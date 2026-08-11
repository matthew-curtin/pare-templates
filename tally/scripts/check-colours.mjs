/**
 * The palette, measured.
 *
 * The load-bearing claim in `globals.css` is that the three outage
 * severities form an ORDINAL scale whose ordering survives colour-vision
 * deficiency, because the ordering lives in lightness rather than in hue.
 * That is a claim about numbers and it is asserted here rather than
 * believed: every severity is pushed through the Machado dichromacy
 * matrices and the lightness ladder has to still be a ladder afterwards.
 *
 * Everything is read back out of `src/app/globals.css`, so the reasoning
 * in the comments there stays true to the values underneath it. Edit a
 * token and this fails; edit this and it stops measuring the real page.
 *
 *   node scripts/check-colours.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const CSS_PATH = path.join(root, "src/app/globals.css");
const css = readFileSync(CSS_PATH, "utf8");

/**
 * Comments in this stylesheet QUOTE the rules they explain, so a bare
 * regex over the raw file happily matches the prose describing a rule
 * instead of the rule. Strip them once, up front. (CONVENTIONS §4b: a
 * check that searches for a string rather than an effect will pass on a
 * comment describing it — that has now happened in this repo.)
 */
const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");

let failures = 0;
let checks = 0;

function ok(label, extra = "") {
  checks += 1;
  console.log(`  ✓ ${label}${extra ? `  ${extra}` : ""}`);
}

function fail(label, detail) {
  checks += 1;
  failures += 1;
  console.log(`  ✗ ${label}\n      ${detail}`);
}

function assertWith(cond, label, reading) {
  if (cond) ok(label, reading);
  else fail(label, reading);
}

function section(title) {
  console.log(`\n${title}`);
}

// ---------------------------------------------------------------------
// Colour science
// ---------------------------------------------------------------------

/** OKLCH → OKLab. */
function lchToLab({ l, c, h }) {
  const rad = (h * Math.PI) / 180;
  return { L: l, a: c * Math.cos(rad), b: c * Math.sin(rad) };
}

/** OKLab → linear sRGB (Björn Ottosson). */
function labToLinear({ L, a, b }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

/** Linear sRGB → OKLab. The inverse of the above. */
function linearToLab({ r, g, b }) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

const gamma = (u) => (u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055);
const degamma = (u) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4));

function inGamut({ r, g, b }) {
  const eps = 1e-4;
  return [r, g, b].every((v) => v >= -eps && v <= 1 + eps);
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** WCAG relative luminance, from LINEAR light. */
function relLuminance({ r, g, b }) {
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
}

function contrast(linA, linB) {
  const a = relLuminance(linA);
  const b = relLuminance(linB);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Machado, Oliveira & Fernandes (2009) dichromacy matrices at severity
 * 1.0, applied to LINEAR light — applying them to gamma-encoded values is
 * the usual mistake and produces reassuringly wrong answers.
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

function simulate(lin, kind) {
  if (kind === "normal") return lin;
  const m = CVD[kind];
  const { r, g, b } = lin;
  return {
    r: m[0][0] * r + m[0][1] * g + m[0][2] * b,
    g: m[1][0] * r + m[1][1] * g + m[1][2] * b,
    b: m[2][0] * r + m[2][1] * g + m[2][2] * b,
  };
}

/** CIEDE2000, over sRGB → Lab(D65). The fleet's standing ΔE measure. */
function linearToXyz({ r, g, b }) {
  const R = clamp01(r), G = clamp01(g), B = clamp01(b);
  return {
    x: 0.4124564 * R + 0.3575761 * G + 0.1804375 * B,
    y: 0.2126729 * R + 0.7151522 * G + 0.072175 * B,
    z: 0.0193339 * R + 0.119192 * G + 0.9503041 * B,
  };
}

function xyzToCieLab({ x, y, z }) {
  const wx = 0.95047, wy = 1, wz = 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const fx = f(x / wx), fy = f(y / wy), fz = f(z / wz);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

function deltaE2000(lab1, lab2) {
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h1p = (Math.atan2(b1, a1p) * deg + 360) % 360;
  const h2p = (Math.atan2(b2, a2p) * deg + 360) % 360;
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * rad) / 2);
  const Lbp = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp;
  if (C1p * C2p === 0) hbp = h1p + h2p;
  else if (Math.abs(h1p - h2p) <= 180) hbp = (h1p + h2p) / 2;
  else hbp = h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
  const T =
    1 -
    0.17 * Math.cos((hbp - 30) * rad) +
    0.24 * Math.cos(2 * hbp * rad) +
    0.32 * Math.cos((3 * hbp + 6) * rad) -
    0.2 * Math.cos((4 * hbp - 63) * rad);
  const dTheta = 30 * Math.exp(-Math.pow((hbp - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cbp, 7) / (Math.pow(Cbp, 7) + Math.pow(25, 7)));
  const Sl = 1 + (0.015 * Math.pow(Lbp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbp - 50, 2));
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(
    Math.pow(dLp / Sl, 2) +
      Math.pow(dCp / Sc, 2) +
      Math.pow(dHp / Sh, 2) +
      Rt * (dCp / Sc) * (dHp / Sh),
  );
}

// ---------------------------------------------------------------------
// Read the tokens back out of the stylesheet
// ---------------------------------------------------------------------

const TOKEN_RE = /--color-([a-z-]+):\s*oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/g;

const tokens = {};
for (const m of css.matchAll(TOKEN_RE)) {
  tokens[m[1]] = { l: Number(m[2]), c: Number(m[3]), h: Number(m[4]) };
}

/** Every derived form of a token, computed once. */
function resolve(name) {
  const lch = tokens[name];
  if (!lch) throw new Error(`No --color-${name} in globals.css`);
  const lin = labToLinear(lchToLab(lch));
  return {
    name,
    lch,
    lin,
    hex:
      "#" +
      [lin.r, lin.g, lin.b]
        .map((v) => Math.round(clamp01(gamma(v)) * 255).toString(16).padStart(2, "0"))
        .join(""),
  };
}

function underCvd(colour, kind) {
  const sim = simulate(colour.lin, kind);
  // Round-trip through the 8-bit sRGB a screen would actually show, so the
  // reading is what a person sees rather than an idealised float.
  const srgb = [sim.r, sim.g, sim.b].map((v) => Math.round(clamp01(gamma(v)) * 255) / 255);
  const lin = { r: degamma(srgb[0]), g: degamma(srgb[1]), b: degamma(srgb[2]) };
  return { lin, oklabL: linearToLab(lin).L, cielab: xyzToCieLab(linearToXyz(lin)) };
}

const REQUIRED = [
  "ground", "surface", "raised", "line", "line-soft",
  "ink", "ink-dim", "ink-faint",
  "accent", "accent-dim",
  "ok", "degraded", "partial", "major", "maint", "void",
];

console.log("\nTALLY — palette check");
console.log(`  ${path.relative(root, CSS_PATH)}`);

section("Tokens parse and are inside sRGB");
for (const name of REQUIRED) {
  if (!tokens[name]) {
    fail(`--color-${name} exists`, "not found in the @theme block");
    continue;
  }
  const col = resolve(name);
  assertWith(
    inGamut(col.lin),
    `--color-${name} is in gamut`,
    `${col.hex}  L ${col.lch.l.toFixed(3)} C ${col.lch.c.toFixed(3)} h ${col.lch.h}`,
  );
}

if (failures > 0) {
  console.log("\nTokens are missing or out of gamut; the rest cannot be measured.");
  process.exit(1);
}

const G = resolve("ground");
const SURFACE = resolve("surface");
const RAISED = resolve("raised");

/** The ordinal ramp, worst last. This ordering IS the design. */
const RAMP = ["degraded", "partial", "major"].map(resolve);
const OK = resolve("ok");
const MAINT = resolve("maint");
const VOID = resolve("void");

// ---------------------------------------------------------------------

section("The severity ramp stays a ladder under colour-vision deficiency");
for (const kind of ["normal", "protanopia", "deuteranopia", "tritanopia"]) {
  const ls = RAMP.map((c) => underCvd(c, kind).oklabL);
  const monotone = ls[0] > ls[1] && ls[1] > ls[2];
  const gaps = [ls[0] - ls[1], ls[1] - ls[2]];
  assertWith(
    monotone && Math.min(...gaps) > 0.05,
    `${kind}: degraded > partial > major in lightness`,
    `L ${ls.map((v) => v.toFixed(3)).join(" > ")}  (gaps ${gaps.map((g) => g.toFixed(3)).join(", ")})`,
  );
}

section("Every mark separates from the ground it sits on");
// A day mark is a bar with no words on it, so §4b's "alone" rule applies:
// 3:1 against both surfaces it can touch (WCAG 1.4.11).
for (const col of [...RAMP, OK, MAINT]) {
  const onGround = contrast(col.lin, G.lin);
  const onSurface = contrast(col.lin, SURFACE.lin);
  assertWith(
    onGround >= 3 && onSurface >= 3,
    `--color-${col.name} clears 3:1 on ground and surface`,
    `${onGround.toFixed(2)}:1 / ${onSurface.toFixed(2)}:1`,
  );
}

section("The absent-day mark is visible without shouting");
// `void` means "this service did not exist yet". It is not a control and
// it is not carrying a status, so 1.4.11 does not reach it — what it owes
// is being perceptible at all, which is a ΔE question (see `almanac`'s
// two greys in CONVENTIONS §4b).
{
  const dE = deltaE2000(
    xyzToCieLab(linearToXyz(VOID.lin)),
    xyzToCieLab(linearToXyz(G.lin)),
  );
  assertWith(dE >= 3, "void is at least one JND from the ground", `ΔE ${dE.toFixed(2)}`);
  assertWith(
    contrast(VOID.lin, G.lin) < 2,
    "void stays quieter than any real status",
    `${contrast(VOID.lin, G.lin).toFixed(2)}:1`,
  );
}

section("No two states collide, under any dichromacy");
{
  const all = [OK, ...RAMP, MAINT];
  let worst = { dE: Infinity, label: "" };
  for (const kind of ["normal", "protanopia", "deuteranopia", "tritanopia"]) {
    for (let i = 0; i < all.length; i += 1) {
      for (let j = i + 1; j < all.length; j += 1) {
        const dE = deltaE2000(underCvd(all[i], kind).cielab, underCvd(all[j], kind).cielab);
        if (dE < worst.dE) worst = { dE, label: `${all[i].name}/${all[j].name} under ${kind}` };
        if (dE < 10) {
          fail(
            `${all[i].name} vs ${all[j].name} under ${kind}`,
            `ΔE ${dE.toFixed(2)} — too close to tell apart`,
          );
        }
      }
    }
  }
  ok("every state pair separates by ΔE ≥ 10 in all four vision models");
  ok(`closest pair is ${worst.label}`, `ΔE ${worst.dE.toFixed(2)}`);
}

section("The accent can never be read as a severity");
{
  const A = resolve("accent");
  for (const col of [...RAMP, MAINT]) {
    for (const kind of ["normal", "protanopia", "deuteranopia", "tritanopia"]) {
      const dE = deltaE2000(underCvd(A, kind).cielab, underCvd(col, kind).cielab);
      if (dE < 12) fail(`accent vs ${col.name} under ${kind}`, `ΔE ${dE.toFixed(2)}`);
    }
  }
  ok("accent is ΔE ≥ 12 from every status hue in all four vision models");
}

section("Text clears its ratio on every surface it is used on");
{
  const cases = [
    ["ink", 7, [G, SURFACE, RAISED]],
    ["ink-dim", 4.5, [G, SURFACE, RAISED]],
    // Labels set at 11px. Small text owes the full 4.5:1, not 3:1 —
    // 1.4.3's large-text exemption starts at 18.66px.
    ["ink-faint", 4.5, [G, SURFACE]],
    ["accent", 4.5, [G, SURFACE]],
  ];
  for (const [name, min, grounds] of cases) {
    const col = resolve(name);
    const readings = grounds.map((g) => contrast(col.lin, g.lin));
    assertWith(
      Math.min(...readings) >= min,
      `--color-${name} clears ${min}:1`,
      readings.map((r) => `${r.toFixed(2)}:1`).join(" / "),
    );
  }
}

section("Borders do the job they are each held to");
{
  // Same split `almanac` found: a divider identifies nothing, so 1.4.11
  // does not reach it and it owes a JND. A field's boundary IS the
  // control, so it owes 3:1.
  const LINE = resolve("line");
  const SOFT = resolve("line-soft");
  assertWith(
    contrast(LINE.lin, G.lin) >= 3,
    "line (control boundaries) clears 3:1 on ground",
    `${contrast(LINE.lin, G.lin).toFixed(2)}:1`,
  );
  const dE = deltaE2000(
    xyzToCieLab(linearToXyz(SOFT.lin)),
    xyzToCieLab(linearToXyz(G.lin)),
  );
  assertWith(dE >= 3, "line-soft (dividers) is at least one JND", `ΔE ${dE.toFixed(2)}`);
}

// ---------------------------------------------------------------------
// Structural guards — the declarations, not the selectors
// ---------------------------------------------------------------------

section("Structure");

{
  // §4b: `color-mix(in oklch, …)` takes an ARC around the hue wheel, and
  // the arc between two chromatic colours passes somewhere nobody chose.
  // Assert structurally rather than mix by mix, because the next one
  // somebody adds will have the same problem.
  const polar = [...bare.matchAll(/color-mix\(\s*in\s+oklch/g)];
  assertWith(
    polar.length === 0,
    "no color-mix() interpolates in a polar space",
    `${[...bare.matchAll(/color-mix\(\s*in\s+oklab/g)].length} oklab mixes, 0 oklch`,
  );
}

{
  // The rule this exists to protect: `container-type` applies style
  // containment, which blocks `:has()` invalidation from an ancestor into
  // the contained subtree. The incident↔day linking is written against
  // `.strip-linked`, so `.strip-linked` must never become a container.
  const linkedBlocks = [...bare.matchAll(/\.strip-linked[^{]*\{([^}]*)\}/g)].map((m) => m[1]);
  assertWith(
    linkedBlocks.length > 0 && linkedBlocks.every((b) => !/container-type/.test(b)),
    "the :has()-linked strip is not a container query element",
    `${linkedBlocks.length} .strip-linked rules, none with container-type`,
  );
  assertWith(
    /\.board\s*\{[^}]*container-type:\s*inline-size/.test(bare),
    ".board is a container so rows respond to their own width",
    "",
  );
  assertWith(
    /@container\s+board\s*\(/.test(bare),
    "and something actually queries it",
    "",
  );
}

{
  // Assert the DECLARATION, not the selector (§4b, learned in `spoke`):
  // match the property and value the rule exists to apply.
  assertWith(
    /\.strip-linked:has\(\.log-entry:hover\)\s+\.tally-data\s+\.day[^{]*\{[^}]*opacity:\s*0\.28/.test(bare),
    ":has() dims the unlit days, and only the DATA days",
    "scoped to .tally-data so the legend does not fade with them",
  );

  // The lit half is generated per incident — CSS cannot relate a hovered
  // entry to the marks it names — so it is asserted where it lives. Both
  // halves have to be checked or half the effect can rot silently.
  const logSrc = readFileSync(path.join(root, "src/components/log.tsx"), "utf8");
  assertWith(
    /:has\(\.le-\$\{i\}:hover\)\s*\.tally-data\s*\.day\.dl-\$\{i\}/.test(logSrc),
    "and the generated rules light the days that incident cost",
    "",
  );
  assertWith(
    /\.day\.dl-\$\{i\}/.test(logSrc),
    "the lit rule out-specifies the dim rule without relying on source order",
    "",
  );
}

{
  // The redundant height channel — the thing that makes the ramp legible
  // without colour at all. Four distinct heights, descending with severity.
  const heights = ["ok", "degraded", "partial", "major"].map((s) => {
    const m = bare.match(new RegExp(`\\.day-${s}\\s*\\{[^}]*--mark-h:\\s*([0-9]+)%`));
    return m ? Number(m[1]) : null;
  });
  assertWith(
    heights.every((h) => h !== null) &&
      heights[0] > heights[1] && heights[1] > heights[2] && heights[2] > heights[3],
    "day-mark height descends with severity (the redundant channel)",
    `ok ${heights[0]}% > degraded ${heights[1]}% > partial ${heights[2]}% > major ${heights[3]}%`,
  );
  assertWith(
    /\.day-maintenance\s*\{[^}]*repeating-linear-gradient/.test(bare),
    "maintenance carries a hatch so it never rests on hue alone",
    "",
  );
}

{
  // §4c: motion is tokenised, real, and degrades to the final state.
  const durs = [...bare.matchAll(/--dur-[a-z]+:\s*([0-9]+)ms/g)].map((m) => Number(m[1]));
  assertWith(durs.length >= 3, "motion has duration tokens", `${durs.join("ms, ")}ms`);
  assertWith(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(bare),
    "prefers-reduced-motion is honoured",
    "",
  );
  assertWith(
    /@property\s+--fill[^}]*syntax:\s*"<percentage>"/.test(bare),
    "--fill is registered so the budget bar can animate its value",
    "",
  );
  assertWith(
    /transition:[^;]*--fill/.test(bare),
    "and something transitions it",
    "",
  );
}

{
  // The variable-font axis has to be genuinely varied, not merely present.
  const stretches = new Set(
    [...bare.matchAll(/font-stretch:\s*([0-9]+)%/g)].map((m) => m[1]),
  );
  assertWith(
    stretches.size >= 2,
    "the wdth axis takes more than one value",
    `${[...stretches].sort().join("%, ")}%`,
  );
}

{
  // §6: exactly one declaration applies the photographic treatment, and it
  // is not "none".
  const applications = [...bare.matchAll(/filter:\s*var\(--photo-filter\)/g)];
  assertWith(
    applications.length === 1,
    "exactly one rule applies --photo-filter",
    `${applications.length} found`,
  );
  const decl = bare.match(/--photo-filter:\s*([^;]+);/);
  assertWith(
    decl !== null && !/^\s*none\s*$/.test(decl[1]),
    "and the treatment is not none",
    decl ? decl[1].trim().replace(/\s+/g, " ") : "missing",
  );
}

{
  // §4c: no hex values inside components. The tokens are the palette.
  const srcDir = path.join(root, "src");
  const files = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry)) files.push(full);
    }
  })(srcDir);

  const offenders = files.filter((f) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(f, "utf8")));
  assertWith(
    offenders.length === 0,
    "no hex colour appears in any component",
    `${files.length} source files scanned`,
  );
}

// ---------------------------------------------------------------------

console.log(`\n${failures === 0 ? "PASS" : "FAIL"} — ${checks - failures}/${checks} checks`);
process.exit(failures === 0 ? 0 : 1);
