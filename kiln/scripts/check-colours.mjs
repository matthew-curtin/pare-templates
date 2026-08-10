/**
 * Palette validation.
 *
 *   node scripts/check-colours.mjs
 *
 * This studio has exactly two chromatic tokens and the whole design
 * rests on them being told apart: `fire` means a kiln is lit or about to
 * be, `cold` means nothing is happening. Both appear as bars with no
 * words beside them — the load gauges, the glaze bars, the step dots —
 * so both are WCAG 1.4.11 signals owing 3:1 against every surface they
 * can sit on, and they owe ten dE from each other under every
 * dichromacy, because roughly one man in twelve cannot take a pair apart
 * by hue and a gauge is scanned rather than read.
 *
 * The tokens are read straight out of `src/app/globals.css`, so this
 * fails when the palette changes rather than describing one that used to
 * be there (CONVENTIONS §4b). The colour maths — OKLCH to sRGB, the
 * Machado/Oliveira/Fernandes dichromacy matrices at severity 1.0 applied
 * to LINEAR light, CIEDE2000, and WCAG relative luminance — is shared
 * with conference-schedule, trail-guide, exposure and playout.
 *
 * Two checks here are not about contrast at all, and both exist because
 * of something that shipped:
 *
 *   - `color-mix(in oklch, ...)` between two chromatic colours is a hard
 *     failure. Polar mixing interpolates HUE, so a warm accent mixed
 *     into a cool surface takes the long arc and arrives at violet.
 *     `playout` shipped that twice in one file and nothing looked
 *     broken, because a lavender note is a perfectly legible note.
 *   - the variable font must actually vary. A face nobody varies is a
 *     static font with extra bytes.
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
const css = readFileSync(path.join(here, "..", "src", "app", "globals.css"), "utf8");

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

/* ---------- what this palette has to be ---------- */

/**
 * The bar depends on what the colour is being asked to do (§4b).
 *
 *   TEXT      4.5:1 — WCAG 1.4.3. Words.
 *   CONTROL   3.0:1 — WCAG 1.4.11. A bar, a border, a dot with no words.
 *   VISIBLE   dE 3  — the just-noticeable difference. A divider or a
 *                     tint owes being SEEN, which is a perceptual claim
 *                     rather than a WCAG one; holding a hairline to 3:1
 *                     produces a page of heavy grey bars.
 *   APART     dE 10 — two signals that must never be confused, measured
 *                     under normal vision and all three dichromacies.
 */
const TEXT = 4.5;
const CONTROL = 3;
const VISIBLE = 3;
const APART = 10;

let pass = 0;
const failures = [];
const margins = [];

function text(ink, ground) {
  const ratio = contrast(colour(ink), colour(ground));
  margins.push([`${ink} on ${ground}`, ratio, TEXT]);
  if (ratio >= TEXT) pass += 1;
  else failures.push(`${ink} on ${ground}: ${ratio.toFixed(2)}:1, needs ${TEXT}`);
}

function control(mark, ground) {
  const ratio = contrast(colour(mark), colour(ground));
  margins.push([`${mark} against ${ground}`, ratio, CONTROL]);
  if (ratio >= CONTROL) pass += 1;
  else failures.push(`${mark} against ${ground}: ${ratio.toFixed(2)}:1, needs ${CONTROL}`);
}

function visible(a, b) {
  const d = deltaE(toLab(colour(a)), toLab(colour(b)));
  margins.push([`${a} vs ${b} (visible)`, d, VISIBLE]);
  if (d >= VISIBLE) pass += 1;
  else failures.push(`${a} vs ${b}: dE ${d.toFixed(2)}, needs ${VISIBLE} to be seen at all`);
}

function apart(a, b) {
  for (const kind of ["normal", "protanopia", "deuteranopia", "tritanopia"]) {
    const d = separation(colour(a), colour(b), kind);
    margins.push([`${a} vs ${b} (${kind})`, d, APART]);
    if (d >= APART) pass += 1;
    else failures.push(`${a} vs ${b} under ${kind}: dE ${d.toFixed(2)}, needs ${APART}`);
  }
}

console.log("\n  Palette — CONVENTIONS §4b\n");

// Words, on every surface they can land on.
for (const ground of ["ground", "paper", "sunk"]) {
  text("ink", ground);
  text("ink-muted", ground);
  text("ink-subtle", ground);
}

// `fire` and `cold` are set as text as well as drawn as bars: a Stat
// value, a chip label, "No date". Both owe the full text ratio on the
// surfaces they are actually set on.
text("fire", "paper");
text("fire", "ground");
text("fire", "wash-fire");
text("cold", "paper");
text("cold", "ground");
text("cold", "wash-cold");
text("paper", "fire"); // the submit button, which is ink on the accent

// Controls and marks with no words beside them.
control("line-strong", "ground");
control("line-strong", "paper");
control("line-strong", "sunk");
control("fire", "sunk"); // a gauge fill against its own track
control("cold", "sunk");
control("fire", "paper");
control("cold", "paper");
control("ink-subtle", "sunk"); // the shelf slabs in every elevation

// Decoration owes being seen and nothing more.
visible("line", "ground");
visible("line", "paper");
visible("wash-fire", "paper");
visible("wash-cold", "paper");
visible("wash-slack", "sunk"); // the hatch that means "empty"
visible("sunk", "ground");

// The one pair that must never be confused. A gauge that has fallen
// short of its threshold is drawn cold and one that has not is drawn
// fire, with no words on the bar itself.
apart("fire", "cold");

/* ---------- structural: things a ratio cannot catch ---------- */

console.log("  Structure\n");

function structural(label, condition, detail = "") {
  if (condition) pass += 1;
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

/**
 * Find every `color-mix(...)` in the file, whole.
 *
 * By counting parentheses rather than matching a regex, because the
 * regex version of this had exactly the bug it was written to catch a
 * cousin of: an unanchored `(.+?)\)` stops at the FIRST close paren, so
 * `color-mix(in oklch, var(--a) 13%, var(--b))` came back as the string
 * `var(--b` and the checker threw instead of failing. It was only found
 * by deliberately breaking the stylesheet to watch the guard fire —
 * which is the argument for doing that to every new check.
 */
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
  structural(
    "no polar color-mix between two chromatic colours",
    bad.length === 0,
    bad.join(" / "),
  );
  structural("there are mixes here to guard at all", mixes.length > 0);
}

// Every mix in this stylesheet should be rectangular, and there should
// be at least one — otherwise the rule above is guarding nothing.
structural("the washes are mixed in oklab", /color-mix\(\s*in\s+oklab/.test(css));

// A variable font nobody varies is a static font with extra bytes.
structural(
  "the display face varies an axis",
  /font-variation-settings:\s*[^;]*"opsz"/.test(css) &&
    /font-variation-settings:\s*[^;]*"WONK"/.test(css),
);
structural(
  "and it varies it by more than nothing",
  (() => {
    const sizes = [...css.matchAll(/"opsz"\s+(\d+)/g)].map((m) => Number(m[1]));
    return new Set(sizes).size > 1;
  })(),
  "every opsz is the same value, so the axis is decorative",
);

// §6: one treatment, declared and applied.
structural("a photo treatment is declared", /--photo-filter:/.test(css));
structural("and applied", /filter:\s*"?var\(--photo-filter\)/.test(css) || /var\(--photo-filter\)/.test(readFileSync(path.join(here, "..", "src", "components", "plate.tsx"), "utf8")));

// Motion gets tokens rather than Tailwind's default 150ms (§4c).
structural("motion has duration tokens", /--dur-[a-z]+:/.test(css));
structural("motion has easing tokens", /--ease-[a-z]+:/.test(css));
structural("and reduced motion is honoured", /prefers-reduced-motion/.test(css));

// A token nothing uses is a token that has stopped meaning anything.
{
  const src = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|css)$/.test(entry.name)) src.push(readFileSync(full, "utf8"));
    }
  };
  walk(path.join(here, "..", "src"));
  const all = src.join("\n");
  const dead = [...tokens.keys()].filter((name) => {
    const utility = new RegExp(`(bg|text|border|border-l|fill|stroke|accent)-${name}\\b`);
    return !utility.test(all) && !all.includes(`var(--color-${name})`);
  });
  structural("every colour token is used somewhere", dead.length === 0, dead.join(", "));
}

/* ---------- report ---------- */

const tightest = margins
  .map(([label, value, floor]) => ({ label, value, floor, slack: value / floor }))
  .sort((a, b) => a.slack - b.slack)
  .slice(0, 6);

console.log("  Tightest margins this run");
for (const m of tightest) {
  console.log(`    ${m.label.padEnd(34)} ${m.value.toFixed(2)} (floor ${m.floor})`);
}

console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${pass} checks passed\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${pass + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
