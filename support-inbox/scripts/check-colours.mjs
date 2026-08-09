/**
 * Palette validation for the status colours.
 *
 *   node scripts/check-colours.mjs
 *
 * Roughly one man in twelve cannot separate some colour pairs, and it
 * is not a judgement anyone can make by looking. So the palette is
 * checked rather than decided: every pair of colours that can appear
 * on screen together is simulated under the three dichromacies and
 * measured, and every colour is checked for contrast against the
 * surface it is actually drawn on.
 *
 * Reads the tokens straight out of `src/index.css`, so it fails when
 * the palette changes rather than describing a palette that used to be
 * there.
 *
 * Two thresholds, both from the fleet's existing practice:
 *   - CIEDE2000 >= 8 between colours that co-occur, under every
 *     simulation. Below that they are the same colour to someone.
 *   - WCAG contrast >= 4.5:1 for text.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(here, "..", "src", "index.css"), "utf8");

/** Every `--color-x: #hex` in the theme block. */
function readTokens() {
  const tokens = new Map();
  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)) {
    tokens.set(match[1], match[2]);
  }
  return tokens;
}

const tokens = readTokens();

function token(name) {
  const value = tokens.get(name);
  if (!value) {
    console.error(`✗ --color-${name} is not in src/index.css`);
    process.exit(1);
  }
  return value;
}

/* ---------- colour maths ---------- */

const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const linearToSrgb = (c) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;

function parse(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
}

/**
 * Machado, Oliveira & Fernandes (2009), severity 1.0. Applied to
 * linear light, which is the part that is easy to get wrong — running
 * these matrices over gamma-encoded values gives plausible-looking
 * numbers that are simply incorrect.
 */
const CVD = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

function simulate(rgb, kind) {
  if (kind === "normal") return rgb;
  const m = CVD[kind];
  const lin = rgb.map(srgbToLinear);
  return m
    .map((row) => row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2])
    .map((v) => linearToSrgb(Math.min(1, Math.max(0, v))));
}

function toLab(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  // sRGB D65 → XYZ, then XYZ → Lab against the D65 white point.
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000. */
function deltaE(lab1, lab2) {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  const rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1;
  const ap2 = (1 + G) * a2;
  const Cp1 = Math.hypot(ap1, b1);
  const Cp2 = Math.hypot(ap2, b2);
  const hp = (b, ap) => {
    if (b === 0 && ap === 0) return 0;
    const h = Math.atan2(b, ap) / rad;
    return h < 0 ? h + 360 : h;
  };
  const hp1 = hp(b1, ap1);
  const hp2 = hp(b2, ap2);
  const dL = L2 - L1;
  const dC = Cp2 - Cp1;
  let dh = 0;
  if (Cp1 * Cp2 !== 0) {
    dh = hp2 - hp1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin((dh * rad) / 2);
  const Lbar = (L1 + L2) / 2;
  const Cpbar = (Cp1 + Cp2) / 2;
  let hbar = hp1 + hp2;
  if (Cp1 * Cp2 !== 0) {
    if (Math.abs(hp1 - hp2) > 180) hbar += hp1 + hp2 < 360 ? 360 : -360;
    hbar /= 2;
  }
  const T =
    1 -
    0.17 * Math.cos((hbar - 30) * rad) +
    0.24 * Math.cos(2 * hbar * rad) +
    0.32 * Math.cos((3 * hbar + 6) * rad) -
    0.2 * Math.cos((4 * hbar - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hbar - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cpbar ** 7 / (Cpbar ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbar - 50) ** 2) / Math.sqrt(20 + (Lbar - 50) ** 2);
  const Sc = 1 + 0.045 * Cpbar;
  const Sh = 1 + 0.015 * Cpbar * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(
    (dL / Sl) ** 2 +
      (dC / Sc) ** 2 +
      (dH / Sh) ** 2 +
      Rt * (dC / Sc) * (dH / Sh),
  );
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = relativeLuminance(parse(a));
  const lb = relativeLuminance(parse(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function separation(hexA, hexB, kind) {
  return deltaE(
    toLab(simulate(parse(hexA), kind)),
    toLab(simulate(parse(hexB), kind)),
  );
}

/* ---------- what actually appears together ---------- */

/**
 * Every hue that can be on screen at once: the four status dots, the
 * overdue red, and the accent on the buttons beside them. All of them
 * co-occur, so every pair is checked.
 */
const HUES = ["open", "waiting", "snoozed", "resolved", "overdue", "accent"];

const KINDS = ["normal", "protanopia", "deuteranopia", "tritanopia"];
const MIN_SEPARATION = 8;
/** WCAG 1.4.3, for anything that is words. */
const MIN_TEXT = 4.5;
/** WCAG 1.4.11, for a shape that carries meaning without being text. */
const MIN_NON_TEXT = 3;

let failed = false;

function check(ok, label, value, unit) {
  if (!ok) failed = true;
  console.log(
    `  ${ok ? "✓" : "✗"} ${label.padEnd(30)} ${value.padStart(5)}${unit}`,
  );
}

console.log("Separation — CIEDE2000, worst across all four vision types\n");

const pairs = [];
for (let i = 0; i < HUES.length; i++) {
  for (let j = i + 1; j < HUES.length; j++) {
    let worst = Infinity;
    let worstKind = "";
    for (const kind of KINDS) {
      const d = separation(token(HUES[i]), token(HUES[j]), kind);
      if (d < worst) {
        worst = d;
        worstKind = kind;
      }
    }
    pairs.push({ a: HUES[i], b: HUES[j], worst, worstKind });
  }
}

pairs.sort((x, y) => x.worst - y.worst);
for (const { a, b, worst, worstKind } of pairs) {
  check(
    worst >= MIN_SEPARATION,
    `${a} vs ${b}`,
    worst.toFixed(1),
    `  (${worstKind})`,
  );
}

console.log("\nDots — non-text, so 3:1 against both surfaces they touch\n");

for (const name of ["open", "waiting", "snoozed", "resolved"]) {
  check(
    contrast(token(name), "#ffffff") >= MIN_NON_TEXT,
    `${name} dot on white`,
    contrast(token(name), "#ffffff").toFixed(2),
    ":1",
  );
  check(
    contrast(token(name), token(`${name}-soft`)) >= MIN_NON_TEXT,
    `${name} dot on its own tint`,
    contrast(token(name), token(`${name}-soft`)).toFixed(2),
    ":1",
  );
}

console.log("\nWords — 4.5:1 against whatever they sit on\n");

/** Pill labels are ordinary ink on the state's soft tint. */
for (const name of ["open", "waiting", "snoozed", "resolved", "overdue"]) {
  check(
    contrast(token("ink"), token(`${name}-soft`)) >= MIN_TEXT,
    `ink on ${name}-soft`,
    contrast(token("ink"), token(`${name}-soft`)).toFixed(2),
    ":1",
  );
}

const TEXT_ON = [
  ["accent", "surface"],
  ["accent", "canvas"],
  ["accent", "accent-soft"],
  // "3h overdue" is red words, not a red shape, so it owes the full
  // text ratio on both surfaces a row can be drawn on.
  ["overdue", "surface"],
  ["overdue", "canvas"],
  ["overdue", "overdue-soft"],
  ["ink", "canvas"],
  ["ink", "surface"],
  ["ink-muted", "canvas"],
  ["ink-muted", "surface"],
  ["ink-subtle", "canvas"],
  ["ink-subtle", "surface"],
  ["on-accent", "accent"],
];
for (const [fg, bg] of TEXT_ON) {
  check(
    contrast(token(fg), token(bg)) >= MIN_TEXT,
    `${fg} on ${bg}`,
    contrast(token(fg), token(bg)).toFixed(2),
    ":1",
  );
}

console.log(
  failed
    ? "\n✗ palette check failed\n"
    : "\n✓ palette check passed\n",
);
process.exit(failed ? 1 : 0);
