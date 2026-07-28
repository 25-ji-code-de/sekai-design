/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

/**
 * Two checks that catch the failure modes this system is most prone to.
 *
 * 1. DANGLING TOKENS — every var(--sekai-*) referenced anywhere in
 *    css/ must be declared in tokens/. A typo'd token silently
 *    resolves to nothing and the rule just... doesn't apply. There is
 *    no error, no warning, and the component looks 90% right.
 *
 * 2. WORLD PARITY — world-system.css and world-night.css must declare
 *    exactly the same token names. The whole premise is one contract
 *    with two value sets; a token present in one world and missing
 *    from the other means components silently fall back to the :root
 *    default in that world only, which is the hardest class of bug to
 *    see.
 *
 * Exits non-zero on any finding. Wire into CI.
 */

import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function cssFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await cssFiles(full)));
    else if (entry.name.endsWith(".css")) out.push(full);
  }
  return out;
}

/* Comments are stripped first: a declaration that follows a block
   comment is preceded by `/` rather than `;` or `{`, and matching
   raw source silently misses most of the token table. */
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "");

/** Declarations: `--sekai-x: value;` at the start of a declaration. */
function declaredIn(src) {
  return new Set(
    [
      ...stripComments(src).matchAll(
        /(?:^|[;{])\s*(--sekai-[a-z0-9-]+)\s*:/gim,
      ),
    ].map((m) => m[1]),
  );
}

/** References: `var(--sekai-x)` or `var(--sekai-x, fallback)`. */
function referencedIn(src) {
  return [
    ...stripComments(src).matchAll(/var\(\s*(--sekai-[a-z0-9-]+)/gi),
  ].map((m) => m[1]);
}

const tokenFiles = await cssFiles(join(root, "tokens"));
const styleFiles = await cssFiles(join(root, "css"));

const declared = new Set();
for (const f of tokenFiles) {
  for (const t of declaredIn(await readFile(f, "utf8"))) declared.add(t);
}

/* Components may also declare local tokens inline (e.g. --sekai-alert-color
   on .sekai-alert, --sekai-rule-bg on .sekai-rule). Those count as declared. */
for (const f of styleFiles) {
  for (const t of declaredIn(await readFile(f, "utf8"))) declared.add(t);
}

const problems = [];

for (const f of styleFiles) {
  const src = await readFile(f, "utf8");
  const rel = relative(root, f);
  for (const ref of referencedIn(src)) {
    if (!declared.has(ref)) {
      const line = src.slice(0, src.indexOf(`var(${ref}`)).split("\n").length;
      problems.push(`dangling token  ${rel}:${line}  ${ref}`);
    }
  }
}

const system = declaredIn(
  await readFile(join(root, "tokens", "world-system.css"), "utf8"),
);
const night = declaredIn(
  await readFile(join(root, "tokens", "world-night.css"), "utf8"),
);

for (const t of system) {
  if (!night.has(t)) problems.push(`world parity    world-night is missing ${t}`);
}
for (const t of night) {
  if (!system.has(t))
    problems.push(`world parity    world-system is missing ${t}`);
}

/* The contract file must declare a default for everything a world sets,
   so an unwrapped component still renders. */
const contract = declaredIn(
  await readFile(join(root, "tokens", "contract.css"), "utf8"),
);
for (const t of system) {
  if (!contract.has(t))
    problems.push(`contract        contract.css has no default for ${t}`);
}

if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):\n`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}

console.log(
  `✓ ${declared.size} tokens declared, all references resolve, ` +
    `both worlds declare the same ${system.size} tokens`,
);
