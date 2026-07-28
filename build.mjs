/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

// Builds dist/:
//   sekai-design.js    ESM, React external
//   sekai-design.cjs   CJS, React external
//   sekai-design.js    (global build) → dist/sekai-design.global.js, window.SekaiDesign
//   sekai-design.css   every component style, @imports flattened
//   sekai-tokens.css   variables only, for apps that keep their own CSS
//   index.d.ts         via `npm run build:types`

import { build } from "esbuild";
import { mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const out = resolve(root, "dist");

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const shared = {
  bundle: true,
  minify: false,
  sourcemap: true,
  target: ["es2022", "chrome110", "firefox110", "safari16"],
  jsx: "automatic",
  logLevel: "info",
};

// --- JS: ESM + CJS, React stays external -------------------------
await build({
  ...shared,
  entryPoints: [resolve(root, "react/index.ts")],
  outfile: resolve(out, "sekai-design.js"),
  format: "esm",
  external: ["react", "react-dom", "react/jsx-runtime"],
});

await build({
  ...shared,
  entryPoints: [resolve(root, "react/index.ts")],
  outfile: resolve(out, "sekai-design.cjs"),
  format: "cjs",
  external: ["react", "react-dom", "react/jsx-runtime"],
});

// --- JS: global build ---------------------------------------------
// React is still external here: it resolves from window.React, which
// is how a <script>-tag page (and claude.ai/design's runtime) loads it.
await build({
  ...shared,
  entryPoints: [resolve(root, "react/index.ts")],
  outfile: resolve(out, "sekai-design.global.js"),
  format: "iife",
  globalName: "SekaiDesign",
  external: ["react", "react-dom", "react/jsx-runtime"],
  banner: {
    js: "/* SEKAI Design System — window.SekaiDesign */",
  },
});

// --- CSS ----------------------------------------------------------
await build({
  ...shared,
  entryPoints: [resolve(root, "css/index.css")],
  outfile: resolve(out, "sekai-design.css"),
  loader: { ".woff2": "file", ".woff": "file" },
});

await build({
  ...shared,
  entryPoints: [resolve(root, "tokens/index.css")],
  outfile: resolve(out, "sekai-tokens.css"),
});

console.log("\n✓ dist/ built");
