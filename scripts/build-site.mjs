/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

/**
 * Build the Cloudflare Pages site into site/.
 *
 * Layout:
 *   site/index.html          demo book (entry)
 *   site/tokens.html         token explorer
 *   site/components.html     component gallery
 *   site/assets/*            built CSS (+ maps if present)
 *   site/_headers            security + cache headers
 *
 * The npm package still builds into dist/. The site is a separate
 * publish surface and never overwrites package artifacts.
 */

import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

// dirname(fileURLToPath) is scripts/; go up one.
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(repo, "dist");
const out = resolve(repo, "site");
const pages = resolve(repo, "pages");

function run(cmd, args) {
  const executable = process.platform === "win32" && cmd === "npm" ? "npm.cmd" : cmd;
  const r = spawnSync(executable, args, { cwd: repo, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// Ensure package CSS exists without going through a platform-specific shell.
run(process.execPath, [resolve(repo, "build.mjs")]);

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, "assets"), { recursive: true });

await cp(resolve(dist, "sekai-design.css"), resolve(out, "assets", "sekai-design.css"));
try {
  await cp(
    resolve(dist, "sekai-design.css.map"),
    resolve(out, "assets", "sekai-design.css.map"),
  );
} catch {
  /* map optional */
}
await cp(resolve(dist, "sekai-tokens.css"), resolve(out, "assets", "sekai-tokens.css"));

const siteCss = await readFile(resolve(pages, "site.css"), "utf8");
await writeFile(resolve(out, "assets", "site.css"), siteCss);

const chrome = (active) => `<nav class="site-nav" aria-label="SEKAI Design">
  <a class="site-nav__brand" href="/">SEKAI Design</a>
  <div class="site-nav__links">
    <a href="/" ${active === "index" ? 'aria-current="page"' : ""}>导读</a>
    <a href="/tokens.html" ${active === "tokens" ? 'aria-current="page"' : ""}>令牌</a>
    <a href="/components.html" ${active === "components" ? 'aria-current="page"' : ""}>组件</a>
    <a href="https://github.com/25-ji-code-de/sekai-design" rel="noopener noreferrer" target="_blank">GitHub</a>
  </div>
</nav>`;

const explore = `
    <section class="chapter explore page" id="continue">
      <span class="sekai-sig num">继续</span>
      <h2>读完之后</h2>
      <p>规则在规范里，取值在令牌页，样子在组件页。源码和讨论在外面。</p>
      <div class="explore-grid">
        <a class="explore-card sekai-lift" href="/tokens.html">
          <span class="sekai-sig">工具</span>
          <strong>令牌查询</strong>
          <span>两个 world 的色板、字号、阴影与语义色，可切换对照。</span>
        </a>
        <a class="explore-card sekai-lift" href="/components.html">
          <span class="sekai-sig">工具</span>
          <strong>组件一览</strong>
          <span>按钮、表单、卡片、提示、头像与签名装置的活样本。</span>
        </a>
        <a class="explore-card sekai-lift" href="https://github.com/25-ji-code-de/sekai-design" rel="noopener noreferrer" target="_blank">
          <span class="sekai-sig">源码</span>
          <strong>GitHub</strong>
          <span>25-ji-code-de/sekai-design · Apache-2.0</span>
        </a>
        <a class="explore-card sekai-lift" href="https://github.com/25-ji-code-de/sekai-design/blob/master/DESIGN_SYSTEM.md" rel="noopener noreferrer" target="_blank">
          <span class="sekai-sig">规范</span>
          <strong>DESIGN_SYSTEM.md</strong>
          <span>完整设计规范，与本页导读同源。</span>
        </a>
        <a class="explore-card sekai-lift" href="https://space.bilibili.com/3546904856103196" rel="noopener noreferrer" target="_blank">
          <span class="sekai-sig">频道</span>
          <strong>Bilibili</strong>
          <span>@bili_47177171806</span>
        </a>
        <a class="explore-card sekai-lift" href="https://docs.nightcord.de5.net" rel="noopener noreferrer" target="_blank">
          <span class="sekai-sig">生态</span>
          <strong>文档站</strong>
          <span>docs.nightcord.de5.net</span>
        </a>
        <a class="explore-card sekai-lift" href="https://hub.nightcord.de5.net" rel="noopener noreferrer" target="_blank">
          <span class="sekai-sig">生态</span>
          <strong>SEKAI Hub</strong>
          <span>门户与用户中心</span>
        </a>
        <a class="explore-card sekai-lift" href="https://github.com/25-ji-code-de" rel="noopener noreferrer" target="_blank">
          <span class="sekai-sig">组织</span>
          <strong>25-ji-code-de</strong>
          <span>全部公开仓库</span>
        </a>
      </div>
    </section>
`;

let demo = await readFile(resolve(repo, "demo.html"), "utf8");
demo = demo
  .replace(
    '<link rel="stylesheet" href="./dist/sekai-design.css" />',
    '<link rel="stylesheet" href="/assets/sekai-design.css" />\n    <link rel="stylesheet" href="/assets/site.css" />',
  )
  .replace(
    "<title>SEKAI — 本就应该如此</title>",
    "<title>SEKAI Design — 本就应该如此</title>\n    <meta name=\"description\" content=\"SEKAI 设计系统导读：从 nightcord 与 SEKAI Pass 抽象出的统一视觉语言。\" />\n    <meta name=\"theme-color\" content=\"#50476a\" />",
  )
  .replace("<body>", `<body>\n${chrome("index")}`)
  .replace(
    /(<p class="sekai-sig" style="opacity: 0\.5">\s*SEKAI DESIGN SYSTEM[\s\S]*?<\/p>\s*<\/section>)/,
    `$1\n${explore}`,
  )
  // Keep the floating world switcher, but lift it above the bottom edge a bit
  // so it doesn't collide with the fixed nav on small screens.
  .replace(
    ".worlds {\n        position: fixed;\n        right: var(--sekai-space-lg);\n        bottom: var(--sekai-space-lg);",
    ".worlds {\n        position: fixed;\n        right: var(--sekai-space-lg);\n        bottom: calc(var(--sekai-space-lg) + 8px);",
  );

await writeFile(resolve(out, "index.html"), demo);

const shell = (title, active, body) => `<!doctype html>
<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team -->
<html lang="zh-CN" class="world-night">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${title} — SEKAI Design System" />
    <meta name="theme-color" content="#50476a" />
    <title>${title} · SEKAI Design</title>
    <link rel="stylesheet" href="/assets/sekai-design.css" />
    <link rel="stylesheet" href="/assets/site.css" />
  </head>
  <body class="site-page">
${chrome(active)}
    <main class="site-main">
${body}
    </main>
    <footer class="site-footer">
      <span class="sekai-sig">SEKAI DESIGN // Apache-2.0</span>
      <div class="site-footer__links">
        <a href="https://github.com/25-ji-code-de/sekai-design" rel="noopener noreferrer" target="_blank">GitHub</a>
        <a href="https://space.bilibili.com/3546904856103196" rel="noopener noreferrer" target="_blank">Bilibili</a>
        <a href="https://docs.nightcord.de5.net" rel="noopener noreferrer" target="_blank">Docs</a>
      </div>
    </footer>
    <div class="worlds">
      <button type="button" class="sekai-btn sekai-btn--sm sekai-btn--secondary" data-world="system">system</button>
      <button type="button" class="sekai-btn sekai-btn--sm sekai-btn--primary" data-world="night">night</button>
    </div>
    <script src="/assets/site.js"></script>
  </body>
</html>
`;

const tokensBody = await readFile(resolve(pages, "tokens.body.html"), "utf8");
const componentsBody = await readFile(resolve(pages, "components.body.html"), "utf8");
await writeFile(resolve(out, "tokens.html"), shell("令牌查询", "tokens", tokensBody));
await writeFile(
  resolve(out, "components.html"),
  shell("组件一览", "components", componentsBody),
);

const siteJs = await readFile(resolve(pages, "site.js"), "utf8");
await writeFile(resolve(out, "assets", "site.js"), siteJs);

await writeFile(
  resolve(out, "_headers"),
  `# SEKAI Design — Cloudflare Pages headers
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'

/index.html
  Cache-Control: no-cache

/tokens.html
  Cache-Control: no-cache

/components.html
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=3600
`,
);

await writeFile(
  resolve(out, "_redirects"),
  `# Pretty aliases
/demo /index.html 302
/guide /index.html 302
`,
);

// Fail the build if a root-relative local asset is missing.
for (const page of ["index.html", "tokens.html", "components.html"]) {
  const html = await readFile(resolve(out, page), "utf8");
  const references = [...html.matchAll(/(?:href|src)="(\/[^"]+)"/g)].map(
    (match) => match[1].split(/[?#]/, 1)[0],
  );

  for (const reference of references) {
    if (reference === "/") continue;
    await access(resolve(out, reference.slice(1)));
  }
}

console.log("\n✓ site/ built");
