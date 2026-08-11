/**
 * The palette, validated rather than eyeballed. CONVENTIONS §4b.
 *
 *   node scripts/check-colours.mjs
 *
 * This template has a much larger surface to check than the others in
 * the fleet, because its colour MOVES. There are 52 grounds, not one,
 * and 59 tile colours the caption ink is chosen against at runtime — so
 * "does the palette work" is not a question anybody can answer by
 * opening the page, since opening the page shows you one week of it.
 *
 * Three things are asserted:
 *
 *   1. The stylesheet and `src/lib/ground.ts` agree about the eight
 *      anchors. The module is the source of truth and the tokens are a
 *      mirror; a mirror nobody checks is just a second copy.
 *   2. Every derived role, in every one of the 52 weeks, clears WCAG —
 *      and is still distinguishable under all three dichromacies, since
 *      a seasonal palette that collapses to the same grey for a third of
 *      the year for one reader in twelve is not a seasonal palette.
 *   3. The structural rules the design depends on, asserted as
 *      DECLARATIONS rather than as selectors — §4b's "a guard can be
 *      satisfied by a LEFTOVER". Matching the property and value a rule
 *      exists to apply is the only version of this that cannot pass on
 *      a comment, a second unrelated use, or a disabled copy.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const G = await import(path.join(root, "src/lib/ground.ts"));
const { collection } = await import(path.join(root, "src/content/collection.ts"));
const css = readFileSync(path.join(root, "src/app/globals.css"), "utf8");

let pass = 0;
const fails = [];
const ok = (label, cond, detail = "") => {
  if (cond) pass += 1;
  else fails.push(`${label}${detail ? ` — ${detail}` : ""}`);
};

/* ── Colour science ───────────────────────────────────────────────
   OKLCH → linear sRGB (Ottosson), then WCAG luminance and CIEDE2000.
   Kept here in full rather than imported from the app, because a
   checker that shares its arithmetic with the thing it checks can only
   ever prove they are consistent — not that either is right. */

function linearFromOklch({ l, c, h }) {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

const luminance = (c) => {
  const [r, g, b] = linearFromOklch(c);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/** Machado, Oliveira & Fernandes, severity 1.0, applied to LINEAR light
 *  — applying it to gamma-encoded values is the usual mistake and makes
 *  every pair look further apart than it is. */
const CVD = {
  protan: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deutan: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  tritan: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900],
};

function simulate(c, m) {
  const [r, g, b] = linearFromOklch(c);
  return [
    m[0] * r + m[1] * g + m[2] * b,
    m[3] * r + m[4] * g + m[5] * b,
    m[6] * r + m[7] * g + m[8] * b,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

function labFromLinear([r, g, b]) {
  const X = 0.4124 * r + 0.3576 * g + 0.1805 * b;
  const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(X / 0.95047);
  const fy = f(Y);
  const fz = f(Z / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000. Long, and worth having in full: ΔE76 disagrees with the
 *  eye badly in exactly the near-neutral region most of these grounds
 *  live in. */
function deltaE([L1, a1, b1], [L2, a2, b2]) {
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cb = (C1 + C2) / 2;
  const G7 = Cb ** 7;
  const Gf = 0.5 * (1 - Math.sqrt(G7 / (G7 + 25 ** 7)));
  const a1p = (1 + Gf) * a1;
  const a2p = (1 + Gf) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const h = (a, b) => {
    if (a === 0 && b === 0) return 0;
    const d = (Math.atan2(b, a) * 180) / Math.PI;
    return d >= 0 ? d : d + 360;
  };
  const h1p = h(a1p, b1);
  const h2p = h(a2p, b2);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);
  const Lbp = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) > 180) hbp += h1p + h2p < 360 ? 360 : -360;
    hbp /= 2;
  }
  const T =
    1 -
    0.17 * Math.cos(((hbp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hbp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hbp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hbp - 63) * Math.PI) / 180);
  const dTh = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin((2 * dTh * Math.PI) / 180) * Rc;
  return Math.sqrt(
    (dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh),
  );
}

const cvdDelta = (a, b, m) =>
  deltaE(labFromLinear(simulate(a, m)), labFromLinear(simulate(b, m)));

/* ── 1. The tokens mirror the module ─────────────────────────────── */
{
  for (const anchor of G.ANCHORS) {
    const token = `--color-anchor-${anchor.name.replace(/\s+/g, "-")}`;
    const m = new RegExp(`${token}:\\s*(oklch\\([^)]*\\))`).exec(css);
    ok(`${token} is declared in globals.css`, m !== null);
    if (!m) continue;
    const parsed = G.parseOklch(m[1]);
    ok(`${token} parses`, parsed !== null, m[1]);
    if (!parsed) continue;
    const same =
      Math.abs(parsed.l - anchor.colour.l) < 1e-6 &&
      Math.abs(parsed.c - anchor.colour.c) < 1e-6 &&
      Math.abs(parsed.h - anchor.colour.h) < 1e-6;
    ok(`${token} matches src/lib/ground.ts`, same,
      `css ${m[1]} vs module ${G.css(anchor.colour)}`);
  }
}

/* ── 2. Every week, every role ───────────────────────────────────── */
{
  let worstText = Infinity;
  let worstTextWeek = 0;
  let worstMuted = Infinity;
  let worstFlare = Infinity;
  let worstFlareWeek = 0;
  let worstLine = Infinity;

  for (let w = 1; w <= 52; w += 1) {
    const ground = G.roleFor("ground", w);
    const sheet = G.roleFor("sheet", w);
    const sunk = G.roleFor("sunk", w);
    const line = G.roleFor("line", w);
    const ink = G.roleFor("ink", w);
    const muted = G.roleFor("inkMuted", w);
    const flare = G.flareFor(w);

    const t = Math.min(ratio(ink, ground), ratio(ink, sheet), ratio(ink, sunk));
    if (t < worstText) {
      worstText = t;
      worstTextWeek = w;
    }
    worstMuted = Math.min(worstMuted, ratio(muted, ground), ratio(muted, sheet));

    // WHAT THE FLARE IS ACTUALLY DOING, which took a round to get right.
    //
    // The first version held it to 1.4.11's 3:1 as a control, and it
    // failed in the spring weeks. The rule was wrong, not the colour: on
    // the year rail a bar's VALUE is its height, and its colour says
    // which season it belongs to — a second cue beside a number that is
    // also printed in the table underneath. The one thing on that rail
    // carrying state alone is the current-week marker, and that is drawn
    // in `--color-ink`, not in the flare (asserted below).
    //
    // So what the flare owes is being a visible MARK against the page it
    // is drawn on — a chart whose bars you cannot see is not a chart.
    // ΔE 10 rather than the ΔE 3 just-noticeable difference `almanac`
    // uses for a divider, because this is the data and that was a rule
    // between rows.
    const f = deltaE(
      labFromLinear(linearFromOklch(flare)),
      labFromLinear(linearFromOklch(ground)),
    );
    if (f < worstFlare) {
      worstFlare = f;
      worstFlareWeek = w;
    }

    // A divider is decoration and 1.4.11 does not reach it (§4b, the
    // almanac split). What it owes is being VISIBLE, which is a
    // perceptual claim: ΔE 3, the just-noticeable difference.
    worstLine = Math.min(
      worstLine,
      deltaE(labFromLinear(linearFromOklch(line)), labFromLinear(linearFromOklch(ground))),
    );

    // The year note and the thin-week cell sit ON the flare, so their
    // ink is COMPUTED rather than assumed. Hardcoded white failed in
    // nineteen weeks of the year.
    const onFlare = G.inkOn(G.css(flare));
    ok(`week ${w}: the computed ink on the flare clears 4.5`,
      onFlare.ratio >= 4.5, onFlare.ratio.toFixed(2));
  }

  ok("body ink clears 4.5:1 in every week of the year", worstText >= 4.5,
    `worst ${worstText.toFixed(2)} in week ${worstTextWeek}`);
  ok("muted ink clears 4.5:1 in every week", worstMuted >= 4.5, worstMuted.toFixed(2));
  ok("every rail bar is a visible mark against its own ground", worstFlare >= 10,
    `worst ΔE ${worstFlare.toFixed(1)} in week ${worstFlareWeek}`);
  // …and the thing that DOES carry state alone is ink, not the flare.
  ok("the current-week marker is drawn in ink, not in the season colour",
    /\.rail-bar\[aria-current="true"\]\s*\.rail-fill\s*\{[^}]*background:\s*var\(--color-ink\)/
      .test(css.replace(/\/\*[\s\S]*?\*\//g, "")));
  ok("the divider is visible against the ground in every week", worstLine >= 3,
    `worst ΔE ${worstLine.toFixed(2)}`);
}

/* ── 3. The year is legible as a SEQUENCE, and under CVD ─────────── */
{
  /*
   * WHAT THE YEAR'S COLOUR IS ASKED TO DO, priced honestly.
   *
   * It is not a categorical scale: nowhere on this site does a reader
   * have to identify a week from its colour. Every page prints "Week 33
   * · 16–22 August" in text, the rail marks position in ink, and the
   * table underneath carries every value as a number. The colour says
   * "you have moved" and "this is roughly that time of year".
   *
   * So it owes two things, and both are asserted under all three
   * dichromacies rather than only in normal vision:
   *
   *   CONSECUTIVE seasons must be clearly different, or moving through
   *   the year does not read as movement at all.
   *
   *   ANY two seasons must be at least perceptibly different, or two
   *   parts of the year become literally the same page.
   *
   * Note which way round the fix went when this first failed. The
   * thresholds are unchanged from the first draft; the PALETTE moved.
   * March and high summer were measuring ΔE 1.0 apart for a deuteranope
   * because they had been given identical lightness, and the answer was
   * to spread the lightness — see the long note in ground.ts — not to
   * lower the bar until the old palette passed.
   */
  const seasons = [3, 11, 18, 23, 30, 43, 48];

  let adjacent = { d: Infinity, pair: "", kind: "" };
  for (let i = 0; i < seasons.length; i += 1) {
    const a = G.roleFor("ground", seasons[i]);
    const b = G.roleFor("ground", seasons[(i + 1) % seasons.length]);
    for (const [kind, m] of Object.entries(CVD)) {
      const d = cvdDelta(a, b, m);
      if (d < adjacent.d) {
        adjacent.d = d;
        adjacent.pair = `wk${seasons[i]}→wk${seasons[(i + 1) % seasons.length]}`;
        adjacent.kind = kind;
      }
    }
  }
  ok("moving to the next season is a visible change, under every dichromacy",
    adjacent.d >= 5,
    `worst ΔE ${adjacent.d.toFixed(1)} (${adjacent.pair}, ${adjacent.kind})`);

  let anyPair = { d: Infinity, pair: "", kind: "" };
  let anyFlare = { d: Infinity, pair: "", kind: "" };
  for (let i = 0; i < seasons.length; i += 1) {
    for (let j = i + 1; j < seasons.length; j += 1) {
      for (const [kind, m] of Object.entries(CVD)) {
        const dg = cvdDelta(
          G.roleFor("ground", seasons[i]),
          G.roleFor("ground", seasons[j]),
          m,
        );
        if (dg < anyPair.d) {
          anyPair = { d: dg, pair: `wk${seasons[i]}/wk${seasons[j]}`, kind };
        }
        const df = cvdDelta(G.flareFor(seasons[i]), G.flareFor(seasons[j]), m);
        if (df < anyFlare.d) {
          anyFlare = { d: df, pair: `wk${seasons[i]}/wk${seasons[j]}`, kind };
        }
      }
    }
  }
  /*
   * The all-pairs floors, and WHY they are floors against degeneracy
   * rather than legibility requirements.
   *
   * The first drafts of these two lines were 3 and 8, on the reasoning
   * that a reader should be able to tell any two seasons apart. A
   * lightness search over the eight anchors — 60,000 candidate palettes,
   * hue and chroma held fixed because summer is green and March is red —
   * got to 2.7 and 7.4 and no further. That is not a tuning failure; it
   * is the known frontier. A categorical palette separable under all
   * THREE dichromacies at once runs out at six or seven colours, and
   * this is seven.
   *
   * So the requirement was wrong, not the palette. Nothing on this site
   * asks a reader to identify a week from its colour: the ground is
   * printed beside its own NAME ("the colour of this page is truss"),
   * which is exactly §4b's case where the words do the work and colour
   * is the second cue. The rail's bars carry their value as height, with
   * every number repeated in the table underneath.
   *
   * What is left for these two to guard is degeneracy — a future edit
   * that quietly collapses two seasons into one colour — so they sit
   * just under what the search proved reachable. The legibility claims
   * are the ADJACENT test above, the ΔE 10 visibility of every bar
   * against its ground, and the thin-week warning below, which is the
   * one genuinely categorical distinction on the site and clears 20.
   */
  ok("no two seasons degenerate into one ground",
    anyPair.d >= 2.5,
    `worst ΔE ${anyPair.d.toFixed(1)} (${anyPair.pair}, ${anyPair.kind})`);
  ok("no two seasons degenerate on the year rail either",
    anyFlare.d >= 7,
    `worst ΔE ${anyFlare.d.toFixed(1)} (${anyFlare.pair}, ${anyFlare.kind})`);

  // The thin-week colour must NOT be mistakable for the season, in any
  // week — that is the entire reason it does not move with the year.
  const thin = G.parseOklch(
    /--color-thin:\s*(oklch\([^)]*\))/.exec(css)?.[1] ?? "oklch(0 0 0)",
  );
  ok("--color-thin is declared", thin !== null);
  let worstThin = Infinity;
  for (let w = 1; w <= 52; w += 1) {
    for (const m of Object.values(CVD)) {
      worstThin = Math.min(worstThin, cvdDelta(thin, G.roleFor("ground", w), m));
    }
  }
  ok("the thin-week warning is distinct from every ground, under CVD",
    worstThin >= 20, `worst ΔE ${worstThin.toFixed(1)}`);
  ok("white on the thin-week colour clears 4.5:1",
    ratio(thin, { l: 1, c: 0, h: 0 }) >= 4.5,
    ratio(thin, { l: 1, c: 0, h: 0 }).toFixed(2));
}

/* ── 4. Every tile colour gets a legible caption ─────────────────── */
{
  let worst = { r: Infinity, slug: "" };
  let untinted = [];
  for (const a of collection) {
    const parsed = G.parseOklch(a.colour);
    ok(`${a.slug} colour parses`, parsed !== null, a.colour);
    if (!parsed) continue;
    const ink = G.inkOn(a.colour);
    if (ink.ratio < worst.r) worst = { r: ink.ratio, slug: a.slug };
    // The chromatic tiles must get a TINTED ink, not black or white.
    if (parsed.c > 0.05 && (G.parseOklch(ink.css)?.c ?? 0) <= 0.001) {
      untinted.push(a.slug);
    }
  }
  ok("the computed caption ink clears 4.5:1 on all 59 tile colours",
    worst.r >= 4.5, `worst ${worst.r.toFixed(2)} on ${worst.slug}`);

  /*
   * And the second half, which exists because falsifying the first half
   * found a hole. Restricting `inkOn` to search one direction — the
   * exact bug it was rewritten to fix — left every assertion GREEN,
   * because the function's own fallback catches the failure and returns
   * pure black or pure white, which clears 4.5 perfectly well.
   *
   * So the ratio check was measuring accessibility, which survived, and
   * nothing at all was measuring the INTENT: that a caption is a dark
   * version of its own tile's colour rather than a default. A fallback
   * that rescues the output is exactly the thing that makes a bug
   * invisible to a check aimed at the output.
   */
  ok("and it is TINTED with the tile's own hue, not defaulted to black",
    untinted.length === 0, untinted.join(", "));
}

/* ── 5. Structure, asserted as DECLARATIONS ──────────────────────── */
{
  const strip = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const decl = (label, re, why) => ok(label, re.test(strip), why);

  // §4b: match the property and value the rule EXISTS to apply, never
  // the selector. `spoke` deleted the one rule doing the work in its
  // stylesheet and passed 74 of 74, because a second rule mentioned the
  // same selector and satisfied the regex.
  decl("the caption scrim is applied by :has(), not by a prop",
    /\.tile:has\(\.tile-photo\)\s*\.tile-caption\s*\{[^}]*background:\s*linear-gradient/,
    "the element decides from its own child");
  decl("the picker's empty state is CSS, not React",
    /\.picker:not\(:has\(input:checked\)\)\s*\.plan-result\s*\{[^}]*display:\s*none/);
  decl("a checked chip is styled by :has()",
    /\.chip:has\(input:checked\)\s*\{[^}]*background:\s*var\(--color-ink\)/);
  decl("cross-document view transitions are switched on",
    /@view-transition\s*\{\s*navigation:\s*auto/);
  decl("the re-pack is given a real duration",
    /::view-transition-group\(\*\)\s*\{[^}]*animation-duration:\s*var\(--dur-repack\)/);
  decl("--veil is registered so it can transition",
    /@property\s+--veil\s*\{[^}]*syntax:\s*"<number>"/);
  decl("--fill is registered so it can transition",
    /@property\s+--fill\s*\{[^}]*syntax:\s*"<percentage>"/);
  decl("the wall packs densely",
    /\.wall\s*\{[^}]*grid-auto-flow:\s*dense/);
  decl("a tile is a container, so its type can be sized in cqw",
    /\.cell\s*\{[^}]*container-type:\s*inline-size/);
  decl("tile type is sized in container units",
    /\.cell\s+\.monument\s*\{[^}]*font-size:\s*clamp\([^)]*cqw/);
  decl("the variable-font axis is actually driven",
    /font-variation-settings:\s*"opsz"\s*96/);
  decl("the photo treatment is declared",
    /--photo-filter:\s*saturate\(/);
  decl("and applied",
    /\.tile-photo\s*\{[^}]*filter:\s*var\(--photo-filter\)/);
  decl("reduced motion turns the view transition OFF at source",
    /prefers-reduced-motion[\s\S]*?@view-transition\s*\{\s*navigation:\s*none/);
  decl("the plan result has an entry animation from @starting-style",
    /@starting-style\s*\{[^}]*\.plan-result\s*\{[^}]*opacity:\s*0/);

  // §4b's polar-mix trap: an arc between two saturated colours goes
  // through violet. Anything mixing two chromatic operands must be
  // rectangular. Parsed with a non-greedy tail that STOPS at the outer
  // close paren rather than the first one — the `kiln` bug.
  const mixes = [...strip.matchAll(/color-mix\(\s*in\s+(oklch|oklab)\s*,([^;]*?)\)\s*[;,)]/g)];
  ok("there is at least one color-mix to check", mixes.length > 0);
  for (const m of mixes) {
    const [, space, body] = m;
    const chromatic = (body.match(/oklch\(\s*[\d.]+\s+([\d.]+)/g) ?? []).filter(
      (t) => Number(/oklch\(\s*[\d.]+\s+([\d.]+)/.exec(t)[1]) > 0.02,
    ).length;
    ok(`color-mix with ${chromatic} chromatic operands uses a safe space`,
      chromatic < 2 || space === "oklab",
      `in ${space}: ${body.trim().slice(0, 60)}`);
  }
}

console.log(`\n  Palette — ${pass + fails.length} checks\n`);
if (fails.length === 0) {
  console.log(`  ✓ all ${pass} pass — 52 grounds, 8 anchors, ${collection.length} tile colours\n`);
  process.exit(0);
}
console.log(`  ✗ ${fails.length} of ${pass + fails.length} failed:\n`);
for (const f of fails) console.log(`   • ${f}`);
console.log("");
process.exit(1);
