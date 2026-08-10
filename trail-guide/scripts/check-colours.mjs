/**
 * Palette validation.
 *
 *   node scripts/check-colours.mjs
 *
 * This template's palette is written in OKLCH, and the four room tints
 * are derived from the room hues with color-mix rather than being hand
 * picked — so the checker has to resolve both before it can measure
 * anything. It reads the tokens straight out of `src/app/globals.css`,
 * which means it fails when the palette changes rather than describing
 * one that used to be there. CONVENTIONS §4b.
 *
 * The load-bearing claim it exists to defend is the one in site.ts: the
 * four rooms are separated in LIGHTNESS as much as in hue, because four
 * hues at one lightness collapse to two under deuteranopia and the grid
 * uses colour as its main glanceable "which room" cue. That claim is
 * either true in the numbers or it is decoration, and looking at it
 * cannot tell you which.
 *
 * It prints its own tightest margins at the end of every run rather
 * than carrying a "last run" comment. A hand-written record of a result
 * is a claim that goes stale the first time somebody nudges a token and
 * does not re-read the header — and this file exists precisely because
 * claims about colour are not trustworthy without measurement.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(
  path.join(here, "..", "src", "app", "globals.css"),
  "utf8",
);

/* ---------- reading the stylesheet ---------- */

/** Every `--color-x: <value>;` declaration in the file, value unresolved. */
function readTokens() {
  const tokens = new Map();
  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
    tokens.set(match[1], match[2].trim());
  }
  return tokens;
}

const tokens = readTokens();

function raw(name) {
  const value = tokens.get(name);
  if (value === undefined) {
    console.error(`✗ --color-${name} is not in src/app/globals.css`);
    process.exit(1);
  }
  return value;
}

/* ---------- colour maths ---------- */

const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const linearToSrgb = (c) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;

/**
 * OKLCH → sRGB, via Ottosson's OKLab.
 *
 * The cube step is the one to be careful with: OKLab's inverse cubes
 * the l'm's' values, and getting that backwards produces colours that
 * are plausible and wrong, which is the worst kind of wrong for a file
 * whose entire job is to be trusted.
 */
function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((v) => linearToSrgb(Math.min(1, Math.max(0, v))));
}

function rgbToOklch(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, Math.hypot(A, B), H];
}

/**
 * Resolve a token value to sRGB.
 *
 * Handles the three forms this stylesheet actually uses: a bare
 * `oklch()`, a `color-mix(in oklch, A p%, B)`, and a `var()` reference
 * to another token. Anything else is a hard failure rather than a
 * silent zero — a checker that quietly reads an unparsed colour as
 * black is worse than one that does not run.
 */
function resolve(value, depth = 0) {
  if (depth > 6) throw new Error(`token nesting too deep: ${value}`);
  const v = value.trim();

  const varRef = /^var\(\s*--color-([a-z0-9-]+)\s*\)$/.exec(v);
  if (varRef) return resolve(raw(varRef[1]), depth + 1);

  const hex = /^#([0-9a-fA-F]{6})$/.exec(v);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
  }

  const ok = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(v);
  if (ok) return oklchToRgb(Number(ok[1]), Number(ok[2]), Number(ok[3]));

  const mix =
    /^color-mix\(\s*in\s+oklch\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s*\)$/.exec(v);
  if (mix) {
    const a = rgbToOklch(resolve(mix[1], depth + 1));
    const b = rgbToOklch(resolve(mix[3], depth + 1));
    const p = Number(mix[2]) / 100;
    // Hue takes the shorter arc, which is what CSS specifies. With one
    // near-achromatic operand the arc barely matters, but getting it
    // wrong on a saturated pair sends the mix the long way round.
    let dh = b[2] - a[2];
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    return oklchToRgb(
      a[0] * p + b[0] * (1 - p),
      a[1] * p + b[1] * (1 - p),
      a[2] + dh * (1 - p),
    );
  }

  throw new Error(`cannot parse colour: ${v}`);
}

function colour(name) {
  return resolve(raw(name));
}

/**
 * Machado, Oliveira & Fernandes (2009), severity 1.0. Applied to linear
 * light, which is the part that is easy to get wrong — running these
 * matrices over gamma-encoded values gives plausible-looking numbers
 * that are simply incorrect.
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
    (dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh),
  );
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function separation(a, b, kind) {
  return deltaE(toLab(simulate(a, kind)), toLab(simulate(b, kind)));
}


/* ---------- assertions ---------- */

const KINDS = ["normal", "protanopia", "deuteranopia", "tritanopia"];
let passed = 0;
const failures = [];
const margins = [];

function atLeast(actual, floor, label) {
  margins.push({ label, actual, floor, ratio: actual / floor });
  if (actual >= floor) passed += 1;
  else failures.push(`${label} — ${actual.toFixed(2)}, needs ${floor}`);
}

function section(name) {
  console.log(`\n  ${name}`);
}

/** Worst separation across all three dichromacies and normal vision. */
function worstSeparation(a, b) {
  return Math.min(...KINDS.map((k) => separation(a, b, k)));
}

// ── 1. The four grounds ───────────────────────────────────────────────
// The claim in globals.css, measured. The rail identifies terrain by
// colour with no words beside it, so these are 1.4.11 signals and they
// have to survive every dichromacy as a SET, not just pairwise against
// the background.
section("The four grounds");

const groundNames = ["ground-trail", "ground-rough", "ground-talus", "ground-bog"];
const grounds = groundNames.map(colour);

for (let i = 0; i < groundNames.length; i += 1) {
  for (let j = i + 1; j < groundNames.length; j += 1) {
    atLeast(
      worstSeparation(grounds[i], grounds[j]),
      10,
      `${groundNames[i]} vs ${groundNames[j]}, worst case`,
    );
  }
}

// The mechanism behind it. If a future edit re-hues the four to one
// lightness the pair checks above might still scrape through while the
// reasoning in globals.css is quietly dead — and the ORDER matters too,
// because the ramp claims "lighter is faster" and the terrain bar, the
// rail and the legend all rely on it.
const groundL = grounds.map((c) => rgbToOklch(c)[0]);
for (let i = 1; i < groundL.length; i += 1) {
  atLeast(
    groundL[i - 1] - groundL[i],
    0.06,
    `${groundNames[i - 1]} is lighter than ${groundNames[i]}, and by enough`,
  );
}

// Each one carries meaning alone in the rail, so 3:1 against the canvas
// it is drawn on. This is the constraint that puts a floor under all
// four and is why none of them is a deep earth colour.
for (let i = 0; i < groundNames.length; i += 1) {
  atLeast(contrast(grounds[i], colour("canvas")), 3, `${groundNames[i]} on the canvas`);
  atLeast(contrast(grounds[i], colour("well")), 3, `${groundNames[i]} in the rail well`);
}

// The soft tints are surfaces rather than signals, so ordinary ink has
// to be readable on them.
for (const name of groundNames) {
  atLeast(contrast(colour("ink"), colour(`${name}-soft`)), 4.5, `ink on the ${name} tint`);
}

// ── 2. Text ───────────────────────────────────────────────────────────
// `surface` is the brightest thing text lands on and therefore sets the
// bar. Measuring only against `canvas` would pass everything and prove
// nothing, which is the easy mistake on a dark theme.
section("Text");

const surfaces = ["canvas", "surface", "well"];
for (const s of surfaces) {
  atLeast(contrast(colour("ink"), colour(s)), 4.5, `ink on ${s}`);
  atLeast(contrast(colour("ink-muted"), colour(s)), 4.5, `ink-muted on ${s}`);
  atLeast(contrast(colour("ink-subtle"), colour(s)), 4.5, `ink-subtle on ${s}`);
}

// The two signal colours are used as TEXT as well as as marks — the
// amber warnings on the planner and the blue water labels on the
// shelter list are both coloured prose, so they owe 4.5:1.
for (const s of surfaces) {
  atLeast(contrast(colour("warn"), colour(s)), 4.5, `warning text on ${s}`);
  atLeast(contrast(colour("water"), colour(s)), 4.5, `water text on ${s}`);
}

// The primary action is ink ON water, which is the one place the
// relationship inverts.
atLeast(contrast(colour("on-water"), colour("water")), 4.5, "button label on water");

// ── 3. The two signals against each other ─────────────────────────────
// Amber and blue are the pair chosen precisely because it survives
// every dichromacy — the site would be broken for a red/green reader if
// this were the usual red-and-green. Worth measuring rather than
// asserting.
section("Signals");

atLeast(worstSeparation(colour("warn"), colour("water")), 20, "warning vs water, worst case");
atLeast(worstSeparation(colour("warn"), colour("ink")), 20, "warning vs ordinary ink");
atLeast(worstSeparation(colour("water"), colour("ink")), 15, "water vs ordinary ink");

// A warning must not be confusable with the ground colour nearest it in
// hue, because both can appear in the same leg card.
atLeast(
  worstSeparation(colour("warn"), colour("ground-rough")),
  10,
  "warning vs the olive ground",
);
atLeast(
  worstSeparation(colour("warn"), colour("ground-bog")),
  10,
  "warning vs the rust ground",
);

// ── 4. Rules and surfaces ─────────────────────────────────────────────
// Hairlines between rows are decoration: they identify no control, so
// they owe visibility (ΔE 3, the just-noticeable difference) rather
// than 3:1. A control's own boundary IS the control and owes the ratio.
section("Rules and surfaces");

atLeast(worstSeparation(colour("line"), colour("canvas")), 3, "hairline on the canvas");
atLeast(worstSeparation(colour("line"), colour("surface")), 3, "hairline crossing a panel");
atLeast(worstSeparation(colour("surface"), colour("canvas")), 3, "a panel against the canvas");
atLeast(worstSeparation(colour("well"), colour("canvas")), 3, "the rail well against the canvas");
atLeast(contrast(colour("line-strong"), colour("canvas")), 3, "a control border on the canvas");
atLeast(contrast(colour("line-strong"), colour("surface")), 3, "a control border on a panel");

// ── Report ────────────────────────────────────────────────────────────
console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${passed} checks passed`);
  console.log("\n  Tightest margins:");
  for (const m of [...margins].sort((a, b) => a.ratio - b.ratio).slice(0, 6)) {
    console.log(`    ${m.actual.toFixed(2)} against ${m.floor}   ${m.label}`);
  }
  console.log("");
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${passed + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
