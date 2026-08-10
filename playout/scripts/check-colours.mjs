/**
 * Palette validation.
 *
 *   node scripts/check-colours.mjs
 *
 * This console has exactly two chromatic tokens and the whole design
 * rests on them being told apart: `live` means somebody will hear this,
 * `signal` means here is a measurement. Both appear as bars and dots
 * with no words beside them — the drift meter, the playhead, the pills —
 * so both are WCAG 1.4.11 signals owing 3:1 against every surface they
 * can sit on, and they owe ten \u0394E from each other under every
 * dichromacy, because roughly one man in twelve cannot take a pair apart
 * by hue and a meter is scanned rather than read.
 *
 * A dark theme inverts the usual constraint: a meaning-carrying colour
 * has to be LIGHT enough to separate from a near-black panel rather than
 * dark enough to separate from paper.
 *
 * The tokens are read straight out of `src/index.css`, so this fails
 * when the palette changes rather than describing one that used to be
 * there (CONVENTIONS \u00a74b). The colour maths below — OKLCH to sRGB, the
 * Machado/Oliveira/Fernandes dichromacy matrices at severity 1.0 applied
 * to LINEAR light, CIEDE2000, and WCAG relative luminance — is shared
 * with conference-schedule, trail-guide and exposure. The one addition
 * is an OKLab branch in `resolve`, because this template mixes its
 * washes rectangularly on purpose.
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
const css = readFileSync(path.join(here, "..", "src", "index.css"), "utf8");

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

  // Rectangular OKLab first, because that is what this stylesheet uses
  // for its washes and the reason is written above them: mixing a warm
  // accent into a cold surface in polar OKLCH travels through violet.
  const lab =
    /^color-mix\(\s*in\s+oklab\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s*\)$/.exec(v);
  if (lab) {
    const a = rgbToOklab(resolve(lab[1], depth + 1));
    const b = rgbToOklab(resolve(lab[3], depth + 1));
    const p = Number(lab[2]) / 100;
    return oklabToRgb(
      a.map((component, i) => component * p + b[i] * (1 - p)),
    );
  }

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



/** OKLab, rectangular. Needed because this stylesheet mixes `in oklab`
 *  rather than `in oklch` — see the note above the wash tokens. */
function rgbToOklab(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => linearToSrgb(Math.min(1, Math.max(0, v))));
}

/* ---------- assertions ---------- */

/** The stylesheet as text, for the checks that are about its shape
 *  rather than about a resolved colour. */
const cssHead = css;

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

// ── 1. The two chromatic tokens ───────────────────────────────────────
// The claim in index.css, measured. Alarm and arithmetic are different
// jobs and they must never be mistaken for each other — on the drift
// meter they are literally the same bar in two states, which is the
// hardest case there is.
section("Live against signal");

atLeast(
  worstSeparation(colour("live"), colour("signal")),
  10,
  "live vs signal, worst dichromacy",
);

// Every surface either of them is ever drawn on. A bar with no words
// beside it owes 3:1 to the thing behind it (WCAG 1.4.11), and there are
// four different things behind it in this app.
const surfaces = ["canvas", "panel", "raised", "well"];
for (const s of surfaces) {
  atLeast(contrast(colour("live"), colour(s)), 3, `live on ${s}`);
  atLeast(contrast(colour("signal"), colour(s)), 3, `signal on ${s}`);
}

// Both are also used as TEXT — the drift figure, the "left" counter in
// the console, the flagged breach line under a log row — so both owe the
// full 4.5:1 on the two surfaces that carry those.
for (const s of ["canvas", "panel"]) {
  atLeast(contrast(colour("live"), colour(s)), 4.5, `live as text on ${s}`);
  atLeast(contrast(colour("signal"), colour(s)), 4.5, `signal as text on ${s}`);
}

// ── 2. Ink ────────────────────────────────────────────────────────────
// Three weights of ink over three surfaces. `ink-subtle` carries the
// small uppercase labels and the times in the log, which are text and
// not decoration, so it is held to the text bar rather than the 3:1 one.
section("Ink");

for (const s of ["canvas", "panel", "raised"]) {
  atLeast(contrast(colour("ink"), colour(s)), 7, `ink on ${s}`);
  atLeast(contrast(colour("ink-muted"), colour(s)), 4.5, `ink-muted on ${s}`);
  atLeast(contrast(colour("ink-subtle"), colour(s)), 4.5, `ink-subtle on ${s}`);
}

// ── 3. Rules and edges ────────────────────────────────────────────────
// §4b's split between a divider and a control boundary, arriving on a
// dark theme this time. A row rule identifies nothing, so 1.4.11 does
// not reach it and holding it to 3:1 would draw a page of grey bars —
// what it owes is being visible at all, which is a perceptual claim:
// ΔE 3, the just-noticeable difference. The edge of the console and the
// outline of a control are different: they identify a thing.
section("Rules and edges");

atLeast(worstSeparation(colour("line"), colour("panel")), 3, "line on a panel");
atLeast(worstSeparation(colour("line"), colour("canvas")), 3, "line on the canvas");
atLeast(
  contrast(colour("line-strong"), colour("panel")),
  3,
  "line-strong as a control boundary",
);
// The well is cut INTO the panel — the playhead track, the drift track —
// and if it does not read as recessed the meter has no scale behind it.
atLeast(worstSeparation(colour("well"), colour("panel")), 3, "the well reads as recessed");

// ── 4. The washes ─────────────────────────────────────────────────────
// Both wash tokens carry body text, and the live one carries the note
// that says an hour is going to miss. The separation check is the one
// that matters: a wash indistinguishable from the panel is a note with
// no note around it.
section("Washes");

for (const name of ["wash-live", "wash-signal", "wash-raised"]) {
  const c = resolve(raw2(name));
  atLeast(contrast(colour("ink"), c), 7, `ink on ${name}`);
  atLeast(worstSeparation(c, colour("panel")), 3, `${name} is visible on a panel`);
}

// The live wash must still read WARM. Mixing an orange into a cold panel
// in polar OKLCH takes the long way round the hue wheel and comes out
// violet — the first build of this stylesheet did exactly that, and
// nothing failed, because a lavender note is a perfectly legible note.
// Only a hue assertion catches it.
section("The live wash is warm");

const liveWashHue = rgbToOklch(resolve(raw2("wash-live")))[2];
const panelHue = rgbToOklch(colour("panel"))[2];
atLeast(
  liveWashHue < panelHue ? 1 : 0,
  1,
  `wash-live sits warmwards of the panel (hue ${liveWashHue.toFixed(0)}° vs ${panelHue.toFixed(0)}°)`,
);
atLeast(
  liveWashHue > 260 && liveWashHue < 340 ? 0 : 1,
  1,
  `wash-live is not in the violet arc (hue ${liveWashHue.toFixed(0)}°)`,
);

// ── 4b. No mix travels through a hue it did not mean ──────────────────
// The general form of the bug above, asserted structurally rather than
// colour by colour. `color-mix(in oklch, …)` interpolates HUE, so any
// mix between two colours that both HAVE a hue takes an arc — and the
// arc between a warm accent and a cold surface passes through violet.
// Mixing with a near-neutral is fine and often what you want; mixing two
// chromatic colours in a polar space almost never is.
section("No mix travels through a hue it did not mean");

const polarMixes = [
  ...cssHead.matchAll(
    /color-mix\(\s*in\s+oklch\s*,\s*(var\(--color-[a-z-]+\))\s+[\d.]+%\s*,\s*(var\(--color-[a-z-]+\))\s*\)/g,
  ),
];
const travelled = [];
for (const m of polarMixes) {
  const a = rgbToOklch(resolve(m[1]));
  const b = rgbToOklch(resolve(m[2]));
  if (a[1] > 0.02 && b[1] > 0.02) travelled.push(`${m[1]} into ${m[2]}`);
}
atLeast(
  travelled.length === 0 ? 1 : 0,
  1,
  `no polar mix between two chromatic colours${travelled.length ? ` — found ${travelled.join("; ")}` : ""}`,
);

// ── 5. The variable axes are actually set ─────────────────────────────
// Two variable faces are shipped for their width axis. If nothing sets
// it, they are static fonts with extra bytes and the type has no
// position (§4c).
section("Type");

atLeast(/"wdth"/.test(cssHead) ? 1 : 0, 1, "the width axis is actually set");
atLeast(
  (cssHead.match(/font-variation-settings/g) ?? []).length,
  4,
  "the width axis is set per surface rather than once",
);

// ── 6. No hardcoded colour in a component ─────────────────────────────
// CONVENTIONS §4 in one assertion: every colour resolves through the
// theme block, so changing a token re-skins the app. Tailwind's own
// utility names are fine — they read the tokens — but a raw hex or an
// inline oklch in a component is a colour nobody can retune.
section("Every colour comes from the theme");

const componentFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) componentFiles.push(full);
  }
})(path.join(here, "..", "src"));

const strays = [];
for (const file of componentFiles) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/#[0-9a-fA-F]{3,8}\b|\boklch\(|\brgba?\(/g)) {
    strays.push(`${path.basename(file)}: ${m[0]}`);
  }
}
atLeast(
  strays.length === 0 ? 1 : 0,
  1,
  `no literal colours in components${strays.length ? ` — found ${strays.join(", ")}` : ""}`,
);

/* ---------- report ---------- */

console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${passed} checks passed`);
  const tight = [...margins].sort((a, b) => a.ratio - b.ratio).slice(0, 6);
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
