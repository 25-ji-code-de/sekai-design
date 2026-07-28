/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

/**
 * Derives the eight identity tints.
 *
 * Identity colour is a printed colour-coded tag — a cable marker, an
 * equipment label, a resistor band. Those are always a BRIGHT field
 * with DARK ink of the same hue, because that is what stays legible
 * at a glance from a distance. Glancing across a roster is exactly
 * the job.
 *
 * Constraints (none of them physical, all of them systemic):
 *   - anchored on SEKAI's own hue, not a foreign palette's
 *   - evenly spaced, so any two people are equally distinguishable
 *   - one lightness, so every fill is equally scannable
 *   - world-independent, because a person must stay the same colour
 *     across nightcord, hub and Pass
 *
 * Forcing white ink and darkening every fill to suit would keep
 * contrast and destroy the only function identity colour has: being
 * scannable. Ink follows the fill, the same rule SEKAI already uses
 * for buttons (--sekai-fg-on-accent).
 *
 * Run: node scripts/derive-identity-tints.mjs
 */

/* ---------- colour maths (sRGB <-> OKLab), no dependencies ------- */

const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const linearToSrgb = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const clamp = (x) => Math.max(0, Math.min(1, x));
  return [lr, lg, lb].map((v) => Math.round(clamp(linearToSrgb(clamp(v))) * 255));
}

/** WCAG relative luminance from 8-bit sRGB. */
const luminance = ([r, g, b]) => {
  const [R, G, B] = [r, g, b].map((v) => srgbToLinear(v / 255));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const hex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

/* ---------- derive ------------------------------------------------ */

/**
 * Fill stays vivid; ink is the same hue, driven down until it clears
 * 4.5:1 on its own fill. Same hue, not black: printed tags are inked
 * in a dark version of their own colour, and it keeps each avatar
 * reading as one object rather than as a coloured chip with a black
 * sticker on it.
 */
const ANCHOR_HUE = 293; // nightcord's accent #a78bfa. SEKAI's own hue.
const COUNT = 8;
const STEP = 360 / COUNT;
const FILL_L = 0.74;
const FILL_C = 0.15;
const INK_C = 0.09;

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function solveInk(hue, fill, target) {
  for (let L = 0.55; L > 0.05; L -= 0.005) {
    const ink = oklchToRgb(L, INK_C, hue);
    if (contrast(fill, ink) >= target) return { L, ink };
  }
  return null;
}

console.log(
  `底 L=${FILL_L} C=${FILL_C}，H 从 ${ANCHOR_HUE}° 起每 ${STEP}° 一档；` +
    `字取同色相压暗到 ≥4.5:1\n`,
);

const rows = Array.from({ length: COUNT }, (_, k) => {
  const h = (ANCHOR_HUE + k * STEP) % 360;
  const fill = oklchToRgb(FILL_L, FILL_C, h);
  const { L: inkL, ink } = solveInk(h, fill, 4.5);
  return { k: k + 1, h, fill, ink, inkL, c: contrast(fill, ink) };
});

for (const r of rows) {
  console.log(
    `  t${r.k}  H=${String(Math.round(r.h)).padStart(3)}°  ` +
      `底 ${hex(r.fill)}  字 ${hex(r.ink)} (L=${r.inkL.toFixed(2)})  ${r.c.toFixed(2)}:1`,
  );
}

/* Adjacent steps must actually separate, or "even" is only numerical. */
console.log("\n相邻档之间的差异（sRGB 欧氏距离）");
let minGap = Infinity;
for (let i = 0; i < COUNT; i++) {
  const a = rows[i].fill;
  const b = rows[(i + 1) % COUNT].fill;
  const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  minGap = Math.min(minGap, d);
  console.log(`  t${rows[i].k} ↔ t${rows[(i + 1) % COUNT].k}  ${d.toFixed(0)}`);
}
console.log(`  最小间距 ${minGap.toFixed(0)}（越大越好；<40 就该减档位）`);

console.log("\n--- 粘进 tokens/contract.css ---\n");
for (const r of rows) {
  console.log(`  --sekai-identity-${r.k}: ${r.fill.join(" ")};`);
}
console.log();
for (const r of rows) {
  console.log(`  --sekai-identity-${r.k}-ink: ${r.ink.join(" ")};`);
}
