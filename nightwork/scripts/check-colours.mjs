/**
 * The palette — validated, not eyeballed (CONVENTIONS §4b).
 *
 *   node scripts/check-colours.mjs
 *
 * Every colour on this site is COMPUTED, from a metal salt's published
 * emission wavelength through the CIE 1931 colour matching functions
 * into OKLCH, at a lightness taken from that emitter's real luminous
 * output. That buys accuracy and it buys nothing at all for legibility,
 * because physics has never heard of WCAG. So this checks what the
 * physics produced rather than assuming it is usable:
 *
 *   • the stylesheet's copy of the palette still equals the module's
 *   • spectral lines are gamut-limited and thermal ones are not
 *   • every emitter can carry TEXT on every stock this site prints on
 *   • and the ink it constructs to do that is still the right HUE,
 *     which is the assertion a fallback would otherwise hide
 *   • which emitters collapse under each of the three dichromacies,
 *     against a list of the ones we already know about
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  EMITTERS,
  emissionColour,
  emissionInkOn,

  clampChroma,
  contrast,
  fieldFor,
  inkFor,
  lightnessFor,
  luminance,
  oklchToLinear,
  paperFor,
} from "../src/lib/emission.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const css = readFileSync(path.join(root, "src/app/globals.css"), "utf8");

/**
 * The stylesheet is heavily commented and the comments QUOTE the
 * declarations they explain — "no `container-type` here", "transition:
 * --x — worse". A regex over the raw file therefore finds the settings
 * inside the prose arguing against them, and reports a rule present
 * that is not. Strip comments before asserting on structure.
 */
const cssBare = css.replace(/\/\*[\s\S]*?\*\//g, "");

let passed = 0;
const failures = [];
const notes = [];

function ok(label, condition, detail = "") {
  if (condition) passed += 1;
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

/* ── Colour difference, for the CVD pass ───────────────────────────── */

const M_XYZ = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041],
];

function linearToLab([r, g, b]) {
  const rgb = [r, g, b].map((v) => Math.min(1, Math.max(0, v)));
  const [X, Y, Z] = M_XYZ.map((row) => row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2]);
  const white = [0.95047, 1, 1.08883];
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const [fx, fy, fz] = [f(X / white[0]), f(Y / white[1]), f(Z / white[2])];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000. Below about 3 is where two colours stop being two colours. */
function ciede2000([L1, a1, b1], [L2, a2, b2]) {
  const rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1;
  const ap2 = (1 + G) * a2;
  const Cp1 = Math.hypot(ap1, b1);
  const Cp2 = Math.hypot(ap2, b2);
  const hp = (b, a) => {
    if (b === 0 && a === 0) return 0;
    const h = Math.atan2(b, a) / rad;
    return h >= 0 ? h : h + 360;
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
  const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin((dh / 2) * rad);
  const Lb = (L1 + L2) / 2;
  const Cpb = (Cp1 + Cp2) / 2;
  let hpb;
  if (Cp1 * Cp2 === 0) hpb = hp1 + hp2;
  else if (Math.abs(hp1 - hp2) <= 180) hpb = (hp1 + hp2) / 2;
  else hpb = hp1 + hp2 < 360 ? (hp1 + hp2 + 360) / 2 : (hp1 + hp2 - 360) / 2;
  const T =
    1 -
    0.17 * Math.cos((hpb - 30) * rad) +
    0.24 * Math.cos(2 * hpb * rad) +
    0.32 * Math.cos((3 * hpb + 6) * rad) -
    0.2 * Math.cos((4 * hpb - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hpb - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cpb ** 7 / (Cpb ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2);
  const Sc = 1 + 0.045 * Cpb;
  const Sh = 1 + 0.015 * Cpb * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(
    (dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh),
  );
}

/** Machado, Oliveira and Fernandes (2009), severity 1.0, on LINEAR light. */
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

const simulate = (m, linear) =>
  m.map((row) => row[0] * linear[0] + row[1] * linear[1] + row[2] * linear[2]);

/* ── 1. The stylesheet mirrors the module ──────────────────────────── */

// Two hand-kept copies of a palette is the definition of a thing that
// drifts, and a stylesheet and a module can disagree for months while
// every page still renders perfectly.
for (const e of EMITTERS) {
  const c = emissionColour(e.id);
  const re = new RegExp(
    `--color-em-${e.id}:\\s*oklch\\(([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\)`,
  );
  const m = re.exec(css);
  if (!m) {
    failures.push(`--color-em-${e.id} is not declared in globals.css`);
    continue;
  }
  const [, l, ch, h] = m.map(Number);
  ok(
    `--color-em-${e.id} matches the module`,
    Math.abs(l - c.l) < 0.0005 && Math.abs(ch - c.c) < 0.0005 && Math.abs(h - c.h) < 0.5,
    `css oklch(${l} ${ch} ${h}) vs module oklch(${c.l} ${c.c} ${c.h})`,
  );
}

/* ── 2. What the physics produced ──────────────────────────────────── */

for (const e of EMITTERS) {
  const c = emissionColour(e.id);
  const linear = oklchToLinear(c);
  ok(
    `${e.id}: in gamut`,
    linear.every((v) => v >= -0.001 && v <= 1.001),
    linear.map((v) => v.toFixed(3)).join(", "),
  );

  const maxed = clampChroma({ l: c.l, c: 0.4, h: c.h });
  if (e.lines) {
    // A monochromatic line is fully saturated, so it must clamp to the
    // most a screen can show. If one of these ever came back BELOW the
    // gamut limit, the spectral fit would have gone wrong somewhere.
    ok(
      `${e.id}: spectral, so gamut-limited`,
      c.c >= maxed.c - 0.003,
      `${c.c.toFixed(3)} vs max ${maxed.c.toFixed(3)}`,
    );
  } else if (e.kelvin >= 4000) {
    // A HOT thermal emitter is near white and must NOT be maxed — that
    // is the bug that turned titanium silver into a tangerine.
    //
    // The first version of this check applied to all thermal emitters
    // and charcoal gold failed it, correctly: at 1700 kelvin the
    // Planckian locus is a long way from white, so a deep orange really
    // is out of gamut and really should clamp. "Broadband" does not
    // imply "desaturated"; only "close to the white point" does.
    ok(
      `${e.id}: hot and thermal, so purity-limited`,
      c.c < maxed.c - 0.01,
      `${c.c.toFixed(3)} vs max ${maxed.c.toFixed(3)}`,
    );
  } else {
    ok(
      `${e.id}: cool and thermal, so gamut-limited like a line`,
      c.c >= maxed.c - 0.003,
      `${c.c.toFixed(3)} vs max ${maxed.c.toFixed(3)}`,
    );
  }

  ok(`${e.id}: lightness follows its output`, c.l === lightnessFor(e.intensity));
}

// The ladder is the site's argument, so it has to be monotone.
const ranked = [...EMITTERS].sort((a, b) => a.intensity - b.intensity);
for (let i = 1; i < ranked.length; i += 1) {
  ok(
    `${ranked[i - 1].id} is darker than ${ranked[i].id}`,
    emissionColour(ranked[i - 1].id).l < emissionColour(ranked[i].id).l,
  );
}
ok(
  "copper is the darkest thing in the palette",
  ranked[0].id === "blue",
  ranked[0].id,
);
ok(
  "sodium is the brightest",
  ranked[ranked.length - 1].id === "amber",
  ranked[ranked.length - 1].id,
);

/* ── 3. Every stock this site prints on ────────────────────────────── */

for (const e of EMITTERS) {
  const paper = paperFor(e.id);
  const ink = inkFor(e.id);
  const field = fieldFor(e.id);

  const body = contrast(ink, paper);
  ok(`${e.id} stock: body text on paper`, body >= 7, `${body.toFixed(2)}:1`);

  const fieldOnPaper = contrast(field, paper);
  ok(
    `${e.id} stock: the night panel reads as a hole in the paper`,
    fieldOnPaper >= 7,
    `${fieldOnPaper.toFixed(2)}:1`,
  );

  ok(`${e.id} stock: paper is in gamut`, oklchToLinear(paper).every((v) => v >= -0.001 && v <= 1.001));
  ok(`${e.id} stock: paper is light`, luminance(oklchToLinear(paper)) > 0.6);
  ok(`${e.id} stock: field is dark`, luminance(oklchToLinear(field)) < 0.05);
}

/* ── 4. Constructed inks — and the hole a fallback would hide ──────── */

// `emissionInkOn` walks outward from an emitter's own lightness until it
// finds one that clears 4.5:1. If the walk fails it returns near-black
// or near-white, which PASSES a contrast test perfectly well — so a
// contrast assertion alone cannot tell a working construction from a
// broken one falling back. Asserting the result is still TINTED is what
// closes that; it is the exact hole the equivalent check in `understory`
// was rewritten to catch.
const stocks = [
  ...EMITTERS.map((e) => ({ name: `${e.id} paper`, colour: paperFor(e.id) })),
  ...EMITTERS.map((e) => ({ name: `${e.id} field`, colour: fieldFor(e.id) })),
];

for (const stock of stocks) {
  for (const e of EMITTERS) {
    const ink = emissionInkOn(e.id, stock.colour);
    const ratio = contrast(ink, stock.colour);
    ok(
      `${e.id} on ${stock.name}: clears 4.5:1`,
      ratio >= 4.49,
      `${ratio.toFixed(2)}:1`,
    );
    // Silver is genuinely near-neutral — its own chroma is 0.025 — so it
    // is the one emitter whose ink is allowed to be almost grey.
    const floor = e.id === "silver" ? 0.012 : 0.05;
    ok(
      `${e.id} on ${stock.name}: still carries its own hue`,
      ink.c >= floor,
      `chroma ${ink.c.toFixed(3)}`,
    );
    ok(
      `${e.id} on ${stock.name}: hue is unchanged`,
      Math.abs(ink.h - emissionColour(e.id).h) < 1,
    );
  }
}

/* ── 5. Colour blindness ───────────────────────────────────────────── */

/**
 * How close two emitters get for a dichromat.
 *
 * This section was written expecting a LIST of collisions to manage: red
 * at 645nm against green at 515nm is the textbook pair a red-green
 * deficiency collapses, and four of the eight emitters are warm sources
 * within 21 degrees of hue. Nine pairs were written down in advance as
 * known and unfixable.
 *
 * The measurement found none of them. Every pair clears ΔE 3 under all
 * three dichromacies, and the reason is the thing this palette does that
 * a hand-picked one would not: lightness is derived from real luminous
 * output, so sodium sits at 0.73 and copper at 0.27 and the emitters are
 * separated VERTICALLY by an axis no colour deficiency touches. Hue was
 * never going to do it on its own.
 *
 * So the assertion is the strong form — no pair may collide — and the
 * margin is printed, because it is thin enough to lose. Moving any
 * intensity moves a lightness, and moving a lightness is what would
 * bring the textbook collisions back.
 */
let worst = { dE: Infinity, key: "" };
for (const [kind, matrix] of Object.entries(CVD)) {
  for (let i = 0; i < EMITTERS.length; i += 1) {
    for (let j = i + 1; j < EMITTERS.length; j += 1) {
      const a = EMITTERS[i].id;
      const b = EMITTERS[j].id;
      const la = linearToLab(simulate(matrix, oklchToLinear(emissionColour(a))));
      const lb = linearToLab(simulate(matrix, oklchToLinear(emissionColour(b))));
      const dE = ciede2000(la, lb);
      if (dE < worst.dE) worst = { dE, key: `${kind}: ${a}/${b}` };
      ok(
        `${kind}: ${a} vs ${b} stay apart`,
        dE >= 3,
        `ΔE ${dE.toFixed(1)}`,
      );
    }
  }
}
notes.push(
  `closest pair under any dichromacy: ${worst.key} at ΔE ${worst.dE.toFixed(2)}`,
);

/**
 * And the closest pair is the one the site's own chemistry predicts.
 *
 * Purple here is not a hue, it is copper at 445nm plus strontium at
 * 645nm, which the eye adds together. A protanope has no functioning
 * long-wavelength cone, so the strontium half is close to invisible to
 * them — and what is left of a copper-strontium purple is a copper
 * blue. The margin is genuinely thin and it is thin for a reason that
 * cannot be designed around without misreporting what is in the star.
 *
 * Asserting WHICH pair is closest, rather than only that nothing
 * collides, is what makes this informative: if the answer ever becomes
 * some other pair, an intensity has moved and the separation this
 * palette depends on has started to go.
 */
ok(
  "the closest pair is copper against copper-plus-strontium, for a protanope",
  worst.key === "protanopia: blue/purple",
  worst.key,
);

// And the pair everyone expects to fail, called out by name so the
// number is on the record rather than buried in a loop.
for (const kind of ["protanopia", "deuteranopia"]) {
  const la = linearToLab(simulate(CVD[kind], oklchToLinear(emissionColour("red"))));
  const lb = linearToLab(simulate(CVD[kind], oklchToLinear(emissionColour("green"))));
  const dE = ciede2000(la, lb);
  ok(`${kind}: strontium red vs barium green`, dE >= 3, `ΔE ${dE.toFixed(1)}`);
  notes.push(`${kind}: red vs green at ΔE ${dE.toFixed(1)}`);
}

/**
 * Which is fine ONLY because colour is never the sole channel. This is
 * the structural half, and it is the half that would rot: it is a
 * property of the components' shape rather than of any value.
 */
const sheet = readFileSync(path.join(root, "src/components/sheet.tsx"), "utf8");
ok(
  "an emitter's name always ships with its swatch",
  /export function EmissionName[\s\S]*?<Swatch id=\{id\}[\s\S]*?\{emitter\(id\)\.name\}/.test(
    sheet,
  ),
);
ok(
  "the colour bar carries a text equivalent",
  /role="img"[\s\S]*?aria-label=\{budget[\s\S]*?emitter\(r\.id\)\.name/.test(sheet),
);
ok(
  "the cue sheet names a segment in words, not only in colour",
  /<Swatch id=\{shell\.emissions\[0\]\} \/>\s*\{segment\.label\}/.test(sheet),
);
ok("swatches are aria-hidden", /export function Swatch[\s\S]*?aria-hidden="true"/.test(sheet));

/* ── 6. Structure the design depends on ────────────────────────────── */

ok("--x is registered, or the document flip is a cut", /@property\s+--x\s*\{[^}]*syntax:\s*"<number>"/.test(css));
ok("bursts composite additively", /mix-blend-mode:\s*plus-lighter/.test(css));
ok("the field isolates, so plus-lighter has something to add against", /\.field\s*\{[^}]*isolation:\s*isolate/.test(css));
/**
 * Two structural guards on the field, both protecting bugs that cost a
 * long afternoon and both invisible in a screenshot.
 *
 * (1) NO `container-type` on the field. `cqh` was the natural unit for
 *     sizing a burst by the panel's height, and `container-type` applies
 *     style containment, which stops `:has()` invalidation on an
 *     ancestor from reaching inside — so the whole document flip
 *     silently stopped working. Percentage height plus `aspect-ratio`
 *     needs no container.
 *
 * (2) NO `transition` on anything the flip drives. Measured: `left`,
 *     the registered `--x`, and a plain `opacity` all latch at their old
 *     computed value when a `:has()` state change is what moved them.
 */
const motionless = cssBare.slice(0, cssBare.indexOf("@media (prefers-reduced-motion"));
const fieldBlock = cssBare.slice(cssBare.indexOf(".field {"), cssBare.indexOf(".segmented {"));
ok(
  "bursts are sized by percentage height, not container units",
  /height:\s*calc\(var\(--d\)\s*\*\s*100%\)/.test(css) && /aspect-ratio:\s*1/.test(css),
);
ok(
  "the field declares no container-type, which would break the flip",
  !/container-type/.test(fieldBlock),
);
ok(
  "and nothing the flip drives carries a transition",
  // Look only OUTSIDE the reduced-motion block, which legitimately
  // declares `transition: none` — the opposite of the problem. A
  // lookahead for "not none" does not work here: `\s*` backtracks to
  // zero width and the assertion passes on the very string it is
  // supposed to allow, which is its own small version of this slice.
  !/\.burst\s*\{[^}]*transition/.test(motionless) &&
    !/\.traces\s*\{[^}]*transition/.test(motionless),
);
ok("reduced motion is honoured", /@media \(prefers-reduced-motion: reduce\)/.test(css));
ok("reduced motion degrades to the final state", /prefers-reduced-motion[\s\S]*?animation:\s*none/.test(css));
ok("there is an art-direction statement", /ART DIRECTION/.test(css));
ok("view transitions are declared", /@view-transition/.test(css));

// One declared treatment, applied in exactly one place (CONVENTIONS §6).
ok("--photo-filter is declared", /--photo-filter:\s*[^;]+;/.test(css));
// Applied once, in CSS, against a class only one component sets. The
// treatment used to be an inline style on the element, which worked and
// which the FLEET checker rightly rejected: a declaration in a
// stylesheet is one thing anybody can find and hold the template to,
// and an inline style is twenty things nobody can.
ok(
  "and applied in exactly one CSS rule",
  (cssBare.match(/filter:\s*var\(--photo-filter\)/g) || []).length === 1,
);
const componentDir = path.join(root, "src/components");
const platers = readdirSync(componentDir).filter((f) =>
  /className=\{`plate |className="plate/.test(readFileSync(path.join(componentDir, f), "utf8")),
);
ok("on a class exactly one component sets", platers.length === 1, platers.join(", "));
ok("which is plate.tsx", platers[0] === "plate.tsx", platers[0]);

/**
 * A variable font nobody varies is a static font with extra bytes.
 * Anybody carries a genuine 50–150 width axis and the design drives it:
 * wide for the wordmark, narrow for the field's own labels.
 */
const widths = [...css.matchAll(/"wdth"\s+(\d+)/g)].map((m) => Number(m[1]));
ok("the width axis is genuinely driven", new Set(widths).size >= 3, `${new Set(widths).size} distinct values`);
ok("and it spans a real range", Math.max(...widths) - Math.min(...widths) >= 40, `${Math.min(...widths)}–${Math.max(...widths)}`);
const weights = [...css.matchAll(/"wght"\s+(\d+)/g)].map((m) => Number(m[1]));
ok("the weight axis too", new Set(weights).size >= 3, `${new Set(weights).size} distinct values`);

/* ── Report ────────────────────────────────────────────────────────── */

console.log("\n  nightwork — the palette, computed and validated\n");
console.log("  emitter   spectrum      L      C      H     ×light");
for (const e of EMITTERS) {
  const c = emissionColour(e.id);
  const spec = e.lines ? e.lines.map((l) => `${l.nm}nm`).join("+") : `${e.kelvin}K`;
  console.log(
    `  ${e.id.padEnd(9)} ${spec.padEnd(13)} ${c.l.toFixed(3)}  ${c.c.toFixed(3)}  ${String(c.h).padStart(3)}   ×${e.intensity}`,
  );
}
console.log("");
for (const n of notes) console.log(`  · ${n}`);
console.log("");

if (failures.length === 0) {
  console.log(`  ✓ ${passed} checks passed\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${passed + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
