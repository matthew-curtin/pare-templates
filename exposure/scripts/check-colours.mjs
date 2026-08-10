/**
 * Palette validation.
 *
 *   node scripts/check-colours.mjs
 *
 * This template is a LIGHT theme, which inverts the usual constraint:
 * a meaning-carrying colour has to be dark enough to separate from a
 * near-white page rather than light enough to separate from a dark one.
 * The four states of light are the load-bearing set — direct sun, sky
 * only, blocked, and down — and every one of them appears somewhere on
 * this site as a bar with no words beside it, in the strips and in the
 * dial. So each owes 3:1 against BOTH surfaces it can sit on (WCAG
 * 1.4.11) and ten \u0394E from its neighbours under every dichromacy,
 * because roughly one man in twelve cannot take a pair of them apart by
 * hue and the strip is scanned rather than read.
 *
 * The tokens are read straight out of `src/app/globals.css`, so this
 * fails when the palette changes rather than describing one that used to
 * be there (CONVENTIONS §4b). The colour maths below — OKLCH to sRGB,
 * the Machado/Oliveira/Fernandes dichromacy matrices at severity 1.0
 * applied to LINEAR light, CIEDE2000, and WCAG relative luminance — is
 * shared with conference-schedule and trail-guide.
 *
 * It also asserts the typographic position, because that is the one part
 * of §4c this template took by subtraction: there is no bold anywhere on
 * this site, and a restraint nobody can measure is a preference.
 *
 * It prints its own tightest margins at the end of every run rather than
 * carrying a "last run" comment. A hand-written record of a result is a
 * claim that goes stale the first time somebody nudges a token and does
 * not re-read the header.
 */

import { readFileSync, readdirSync } from "node:fs";
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

/** The `--wash-*` tokens, which are derived from the state colours with
 *  color-mix rather than hand-picked, and so live outside the `--color-`
 *  namespace on purpose. */
const washes = new Map(
  [...css.matchAll(/--wash-([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
);

function raw2(name) {
  const value = washes.get(name.replace(/^wash-/, ""));
  if (value === undefined) {
    console.error(`✗ --${name} is not in src/app/globals.css`);
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


// ── 1. The four states of light ───────────────────────────────────────
// The claim in globals.css, measured. A strip identifies what the light
// is doing by colour with no words in it, so these are 1.4.11 signals
// and they have to survive every dichromacy as a SET rather than just
// pairwise against the page.
section("The four states of light");

const stateNames = ["sun", "sky", "shade", "night"];
const states = stateNames.map(colour);

for (const [i, a] of states.entries()) {
  for (const b of states.slice(i + 1)) {
    const j = states.indexOf(b);
    atLeast(
      worstSeparation(a, b),
      10,
      `${stateNames[i]} vs ${stateNames[j]}, worst dichromacy`,
    );
  }
}

// Both surfaces, because a strip sits on the canvas in a list and on a
// card in the pinned pane, and 3:1 against one of them is not enough.
for (const [i, c] of states.entries()) {
  atLeast(contrast(c, colour("canvas")), 3, `${stateNames[i]} on the canvas`);
  atLeast(contrast(c, colour("surface")), 3, `${stateNames[i]} on a card`);
}

// It is an ordered ramp, not four nominal categories, so it has to run
// light to dark in the order the states run — otherwise the encoding is
// arbitrary and the legend is the only way to read it (§4b).
const stateL = states.map((c) => rgbToOklch(c)[0]);
for (let i = 1; i < stateL.length; i += 1) {
  atLeast(
    stateL[i - 1] - stateL[i],
    0.02,
    `${stateNames[i - 1]} is lighter than ${stateNames[i]}`,
  );
}

// ── 2. Text ───────────────────────────────────────────────────────────
// Body ink at 4.5:1 (1.4.3), and the quieter two held to the same bar
// wherever they carry sentences rather than labels. `ink-subtle` is used
// for small uppercase labels and axis ticks, which are text.
section("Text");

const surfaces = ["canvas", "surface", "well"];
for (const s of surfaces) {
  atLeast(contrast(colour("ink"), colour(s)), 7, `ink on ${s}`);
  atLeast(contrast(colour("ink-muted"), colour(s)), 4.5, `ink-muted on ${s}`);
  atLeast(contrast(colour("ink-subtle"), colour(s)), 4.5, `ink-subtle on ${s}`);
}
// The one inverted pair: the active segmented control and the primary
// button put canvas on ink.
atLeast(contrast(colour("canvas"), colour("ink")), 7, "canvas on ink");

// ── 3. Two greys with two different jobs ──────────────────────────────
// §4b's split, arriving from the palette side. A rule between rows is
// DECORATION and 1.4.11 does not reach it — holding it to 3:1 would give
// the page a set of heavy grey bars. What it owes instead is being
// visible at all, which is a perceptual claim: ΔE 3, the just-noticeable
// difference. The boundary of a text field IS the control and owes the
// full ratio.
section("Rules and controls");

atLeast(
  worstSeparation(colour("line"), colour("canvas")),
  3,
  "line is visible against the canvas",
);
atLeast(
  worstSeparation(colour("line"), colour("surface")),
  3,
  "line is visible against a card",
);
atLeast(
  contrast(colour("line-strong"), colour("surface")),
  3,
  "line-strong as a control boundary on a card",
);
atLeast(
  contrast(colour("line-strong"), colour("canvas")),
  3,
  "line-strong as a control boundary on the canvas",
);

// ── 4. The plan's fill ramp ───────────────────────────────────────────
// Rooms are tinted from 16% to 74% of the sun colour in proportion to
// their hours, and a room with none is left in `well`. The boundary that
// matters is the one at the bottom: "an hour of sun" and "no sun at all"
// are the two answers the plan is scanned for, and if the faintest tint
// is indistinguishable from the empty one the drawing is lying by
// omission.
section("The plan's fill ramp");

const tint = (pct) =>
  resolve(`color-mix(in oklch, var(--color-sun) ${pct}%, var(--color-surface))`);

atLeast(
  worstSeparation(tint(40), colour("well")),
  10,
  "the faintest lit room against an unlit one",
);
atLeast(
  worstSeparation(tint(40), tint(74)),
  10,
  "the two ends of the ramp",
);
// 4.5 rather than 7: these are ~19px regular labels, which is normal
// text under 1.4.3 and not the large-text carve-out. Holding them to 7
// was my own invented bar, and it made the ramp unsatisfiable from both
// ends at once — too pale to separate from an unlit room at the bottom,
// too dark to letter at the top.
atLeast(contrast(colour("ink"), tint(74)), 4.5, "a room label on the darkest tint");
atLeast(contrast(colour("ink"), tint(40)), 4.5, "a room label on the faintest tint");
atLeast(contrast(colour("ink-subtle"), colour("well")), 4.5, "the hours line on an unlit room");

// The ramp is monotone, or it is not a ramp.
let previous = 0;
for (const pct of [40, 48, 56, 65, 74]) {
  const l = 1 - rgbToOklch(tint(pct))[0];
  atLeast(l - previous, 0.005, `the ramp darkens at ${pct}%`);
  previous = l;
}

// ── 5. The washes behind text ─────────────────────────────────────────
section("Washes");

for (const [name, expr] of [
  ["wash-sun", raw2("wash-sun")],
  ["wash-sky", raw2("wash-sky")],
  ["wash-night", raw2("wash-night")],
]) {
  const c = resolve(expr);
  atLeast(contrast(colour("ink"), c), 7, `ink on ${name}`);
  atLeast(worstSeparation(c, colour("surface")), 3, `${name} is visible on a card`);
}

// ── 6. The typographic position ───────────────────────────────────────
// §4c asks for a position rather than a default, and this template took
// one by subtraction. A rule about what is ABSENT decays silently — one
// `font-bold` in a component nobody re-reads and the position is gone
// with nothing to show for it — so it is asserted rather than described.
section("No bold, anywhere");

const sourceFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|css)$/.test(entry.name)) sourceFiles.push(full);
  }
})(path.join(here, "..", "src"));

const bold = [];
for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/\bfont-(bold|semibold|extrabold|black|[6-9]00)\b/g)) {
    bold.push(`${path.basename(file)}: ${m[0]}`);
  }
  for (const m of text.matchAll(/font-weight:\s*(600|700|800|900|bold)/g)) {
    bold.push(`${path.basename(file)}: ${m[0]}`);
  }
}
atLeast(bold.length === 0 ? 1 : 0, 1, `no bold weights in the source${bold.length ? ` — found ${bold.join(", ")}` : ""}`);

// The two axes the display face is chosen for have to be set somewhere,
// or the variable font is a static one with extra bytes.
const cssText = readFileSync(path.join(here, "..", "src", "app", "globals.css"), "utf8");
atLeast(/"opsz"/.test(cssText) ? 1 : 0, 1, "the optical-size axis is actually set");
atLeast(/"wdth"/.test(cssText) ? 1 : 0, 1, "the width axis is actually set");
atLeast(
  (cssText.match(/font-variation-settings/g) ?? []).length,
  4,
  "opsz is set per step of the scale rather than once",
);

/* ---------- report ---------- */

console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${passed} checks passed`);
  const tight = [...margins].sort((a, b) => a.ratio - b.ratio).slice(0, 5);
  console.log("\n  Tightest margins:");
  for (const m of tight) {
    console.log(`    ${m.actual.toFixed(2)} / ${m.floor}   ${m.label}`);
  }
  console.log("");
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${passed + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
