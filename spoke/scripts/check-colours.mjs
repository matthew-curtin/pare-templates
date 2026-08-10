/**
 * Palette validation.
 *
 *   node scripts/check-colours.mjs
 *
 * This shop has exactly two chromatic tokens, and the whole design rests
 * on them being told apart: `short` means this is what is stopping you,
 * `inbound` means this is on its way. They are opposite kinds of news
 * and they appear as dots, left rules and washes with no words attached,
 * so both are WCAG 1.4.11 signals owing 3:1 against every surface they
 * can sit on — and they owe ten dE from each other under every
 * dichromacy, because roughly one man in twelve cannot take a pair apart
 * by hue and a tinted row is scanned rather than read.
 *
 * The tokens are read straight out of `src/index.css`, so this fails
 * when the palette changes rather than describing one that used to be
 * there (CONVENTIONS §4b). The colour maths — OKLCH to sRGB, the
 * Machado/Oliveira/Fernandes dichromacy matrices at severity 1.0 applied
 * to LINEAR light, CIEDE2000, and WCAG relative luminance — is shared
 * with conference-schedule, trail-guide, exposure, playout and kiln.
 *
 * Three checks here are not about contrast, and each exists because of
 * something that shipped somewhere in this repo:
 *
 *   - `color-mix(in oklch, ...)` between two chromatic colours is a hard
 *     failure. Polar mixing interpolates HUE, so a warm accent mixed
 *     into a cold surface takes the long arc and arrives at violet.
 *   - the variable font must actually vary, and on BOTH settings — this
 *     template's entire typographic argument is one family at MONO 0 and
 *     MONO 1, and a stylesheet that only ever asked for one of them
 *     would be shipping a static font with extra bytes.
 *   - the `:has()` propagation must exist, because it is the one thing
 *     in this stylesheet doing work no other technique could, and it is
 *     the sort of rule a refactor deletes without noticing.
 *
 * It prints its own tightest margins at the end of every run rather than
 * carrying a "last run" comment. A hand-written record of a result is a
 * claim that goes stale the first time somebody nudges a token.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(here, "..", "src", "index.css"), "utf8");

/* ---------- reading the stylesheet ---------- */

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


function findMixes(text) {
  const out = [];
  const needle = "color-mix(";
  let from = 0;
  for (;;) {
    const start = text.indexOf(needle, from);
    if (start === -1) return out;
    let depth = 0;
    let i = start + needle.length - 1;
    for (; i < text.length; i += 1) {
      if (text[i] === "(") depth += 1;
      else if (text[i] === ")") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    out.push(text.slice(start, i + 1));
    from = i + 1;
  }
}

/* ---------- what this palette has to be ---------- */

/**
 * The bar depends on what the colour is being asked to do (§4b).
 *
 *   TEXT      4.5:1 — WCAG 1.4.3. Words.
 *   CONTROL   3.0:1 — WCAG 1.4.11. A dot, a left rule, a border.
 *   VISIBLE   dE 3  — the just-noticeable difference. A hairline between
 *                     tree rows owes being SEEN, which is a perceptual
 *                     claim rather than a WCAG one; holding a divider to
 *                     3:1 in a table of eighty-four rows produces a page
 *                     of heavy grey bars and nothing else.
 *   APART     dE 10 — two signals that must never be confused, under
 *                     normal vision and all three dichromacies.
 */
const TEXT = 4.5;
const CONTROL = 3.0;
const VISIBLE = 3;
const APART = 10;

let checks = 0;
const failures = [];
const margins = [];

function assertContrast(label, fg, bg, floor) {
  checks += 1;
  const ratio = contrast(colour(fg), colour(bg));
  margins.push({ label: `${fg} on ${bg}`, value: ratio, floor, unit: ":1" });
  if (ratio < floor) {
    failures.push(`${label}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1, needs ${floor}:1`);
  }
}

function assertApart(label, a, b, floor = APART) {
  for (const kind of ["normal", "protanopia", "deuteranopia", "tritanopia"]) {
    checks += 1;
    const dE = separation(colour(a), colour(b), kind);
    margins.push({ label: `${a} vs ${b} (${kind})`, value: dE, floor, unit: " dE" });
    if (dE < floor) {
      failures.push(`${label}: ${a} vs ${b} is ${dE.toFixed(1)} dE under ${kind}, needs ${floor}`);
    }
  }
}

function structural(label, condition, detail = "") {
  checks += 1;
  if (!condition) failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

/* ---------- ink on every surface it lands on ---------- */

// Four surfaces exist and text sits on three of them. `sunk` is the
// recessed one — the gauge track and the row hover — and muted ink lands
// on it whenever somebody hovers a tree row, which is most of the time
// they are using this page.
const SURFACES = ["ground", "sheet", "sunk"];
for (const surface of SURFACES) {
  assertContrast("body ink", "ink", surface, TEXT);
  assertContrast("muted ink", "ink-muted", surface, TEXT);
  assertContrast("subtle ink", "ink-subtle", surface, TEXT);
}

// The washes are surfaces too: a short row is a surface with every kind
// of ink on it, and forgetting that is how a tinted row becomes the one
// place on the site where the small print is unreadable.
for (const wash of ["short-wash", "inbound-wash"]) {
  assertContrast("body ink", "ink", wash, TEXT);
  assertContrast("muted ink", "ink-muted", wash, TEXT);
  assertContrast("subtle ink", "ink-subtle", wash, TEXT);
}

assertContrast("inverse ink", "ink-inverse", "ink", TEXT);

/* ---------- the two chromatic tokens ---------- */

// Both are used as TEXT — "short 4", the slack column, the constraint
// count — and as bare dots with no words. So both bars apply to both.
for (const surface of [...SURFACES, "short-wash", "inbound-wash"]) {
  assertContrast("short as text", "short", surface, TEXT);
  assertContrast("inbound as text", "inbound", surface, TEXT);
}

// And they must never be mistaken for each other. This is the check the
// palette was actually chosen by: `short` and `inbound` differ in
// LIGHTNESS as well as hue, which is what keeps them apart for a
// protanope, for whom a red-orange collapses toward dark.
assertApart("the two signals", "short", "inbound");

// A wash must be distinguishable from the surface it tints, or a short
// row looks identical to a healthy one — but it is decoration carrying a
// second cue (the dot, the word), so the bar is the just-noticeable
// difference rather than 3:1.
assertApart("short wash from the sheet", "short-wash", "sheet", VISIBLE);
assertApart("inbound wash from the sheet", "inbound-wash", "sheet", VISIBLE);
assertApart("the two washes from each other", "short-wash", "inbound-wash", VISIBLE);

/* ---------- structure ---------- */

// The hairline between tree rows: seen, not 3:1. Eighty-four rows of
// heavy grey rule would be a worse page, and §4b says a divider
// identifies nothing so 1.4.11 does not reach it.
assertApart("the row rule is visible at all", "line", "ground", VISIBLE);
assertApart("the row rule is visible on the sheet", "line", "sheet", VISIBLE);

// The strong line IS a control boundary — it is the table's header rule
// and the focus ring — so it owes the full 3:1.
assertContrast("strong rule", "line-strong", "ground", CONTROL);
assertContrast("strong rule on the sheet", "line-strong", "sheet", CONTROL);

// Surfaces must be distinguishable from each other, or the tinted bands
// that separate the page's sections do nothing.
assertApart("sheet from ground", "sheet", "ground", VISIBLE);
assertApart("sunk from ground", "sunk", "ground", VISIBLE);

/* ---------- rules about the stylesheet itself ---------- */

// A polar mix between two chromatic colours travels an ARC around the
// hue wheel, and the arc between a warm accent and a cool surface goes
// through violet. Nothing about it fails to render, which is why it has
// to be asserted structurally rather than found by looking.
{
  const mixes = findMixes(css);
  const polar = mixes.filter((m) => /^color-mix\(\s*in\s+oklch\b/.test(m));
  const bad = [];
  for (const m of polar) {
    const parts = /^color-mix\(\s*in\s+oklch\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+)\)$/.exec(m);
    if (!parts) {
      bad.push(`${m} (unparseable)`);
      continue;
    }
    const a = rgbToOklch(resolve(parts[1].trim()));
    const b = rgbToOklch(resolve(parts[3].trim()));
    if (a[1] > 0.02 && b[1] > 0.02) bad.push(m);
  }
  structural("no polar color-mix between two chromatic colours", bad.length === 0, bad.join(" / "));
  structural("there are mixes here to guard at all", mixes.length > 0);
}

structural("the washes are mixed in oklab", /color-mix\(\s*in\s+oklab/.test(css));

// The variable-font argument, asserted. One family carries prose and
// figures at two settings of one axis; a stylesheet that asked for only
// one of them would be shipping a variable font it never varies.
structural("the body sets MONO 0", /font-variation-settings:\s*"MONO"\s*0/.test(css));
structural("figures set MONO 1", /font-variation-settings:\s*"MONO"\s*1/.test(css));
structural(
  "prose and figures come from ONE family",
  (css.match(/--font-sans:\s*"Recursive Variable"/) ?? []).length === 1 &&
    (css.match(/--font-mono:\s*"Recursive Variable"/) ?? []).length === 1,
);

// The propagation rule. It is the one thing in this stylesheet that
// could not have been done another way, and a refactor that flattened
// the tree into a list would delete it silently — the page would still
// render, and would simply stop saying which assembly is blocked.
// Both halves, separately, and by their DECLARATIONS rather than by the
// selector appearing anywhere. The first version of this check looked
// for the string `.branch:has(.is-short)` and PASSED with the
// propagation deleted — because the flag rule below mentions the same
// selector and satisfied the regex on its own. That is the §4b lesson
// exactly: it was found only by breaking the thing on purpose, and a
// guard that cannot catch what it was written for is worse than no
// guard, because it is also reassuring.
structural(
  "a shortage tints every assembly above it",
  /\.branch:has\(\.is-short\)\s*>\s*\.node-row\s*\{[^}]*background:\s*var\(--color-short-wash\)/.test(css),
);
structural(
  "and reveals the flag on those assemblies",
  /\.branch:has\(\.is-short\)\s*>\s*\.node-row\s+\.rollup-flag\s*\{[^}]*opacity:\s*1/.test(css),
);
structural(
  "and inbound deliberately does NOT propagate",
  !/\.branch:has\(\.is-inbound\)/.test(css),
  "sixteen orders in flight would tint most of the tree",
);

// Motion tokens, and reduced motion honoured (§4c).
structural("durations are tokens", /--dur-quick:/.test(css) && /--dur-settle:/.test(css));
structural("easings are tokens", /--ease-out:/.test(css));
structural("reduced motion is honoured", /prefers-reduced-motion/.test(css));
structural(
  "no hardcoded transition duration",
  !/transition:[^;]*\b\d+ms/.test(css.replace(/--dur-[a-z]+:\s*\d+ms/g, "")),
);

// The treatment (§6): declared once, applied once.
structural("a photographic treatment is declared", /--photo-filter:/.test(css));
structural("and applied", /filter:\s*var\(--photo-filter\)/.test(css));

/* ---------- report ---------- */

if (failures.length > 0) {
  console.error(`\n  ✗ ${failures.length} of ${checks} checks failed\n`);
  for (const f of failures) console.error(`    · ${f}`);
  console.error("");
  process.exit(1);
}

const tightest = margins
  .map((m) => ({ ...m, headroom: m.value / m.floor }))
  .sort((a, b) => a.headroom - b.headroom)
  .slice(0, 6);

console.log(`\n  ✓ ${checks} checks passed`);
console.log("    tightest margins:");
for (const m of tightest) {
  console.log(
    `      ${m.value.toFixed(m.unit === ":1" ? 2 : 1)}${m.unit}`.padEnd(16) +
      `(floor ${m.floor})  ${m.label}`,
  );
}
console.log("");
