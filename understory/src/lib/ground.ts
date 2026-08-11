/**
 * The page is the colour of the week you are looking at.
 *
 * Every other template in this repo has a fixed surface within a whisker
 * of neutral — measured across sixteen of them, the page's own chroma
 * runs 0.002 to 0.016, and the only saturated thing on screen is an
 * accent the size of a dot. This one moves: eight anchor colours around
 * the year, interpolated per week, driving the ground, the sheet, the
 * ink and the one saturated "flare" that marks where you are.
 *
 * Three decisions worth not undoing.
 *
 * 1. THE ANCHORS LIVE HERE, NOT IN CSS. `globals.css` declares them as
 *    tokens so a component can name one, but this module is the source
 *    of truth and `scripts/check-colours.mjs` fails until the two agree.
 *    Two hand-maintained copies of a palette is the definition of a
 *    thing that drifts, and the drift is invisible — a stylesheet and a
 *    module can disagree for months while every page still renders.
 *
 * 2. INTERPOLATION IS RECTANGULAR (OKLab), NEVER POLAR. CONVENTIONS §4b:
 *    mixing in OKLCH travels an ARC around the hue wheel, and the arc
 *    from a rose ground to a green one passes through violet. Nothing
 *    fails; the page is simply lavender in the second week of April for
 *    no reason anybody chose. Rectangular mixing desaturates through
 *    the middle instead, which is also what a real year does — the week
 *    between the magnolias going over and the leaves coming out is
 *    genuinely colourless.
 *
 * 3. THE ROLES MOVE TOGETHER. Every derived role is a FIXED OFFSET from
 *    the ground's lightness, so the whole ladder rises and falls with
 *    the season while every relationship inside it stays constant. That
 *    is what keeps contrast a structural property rather than 52
 *    separate things to check — if a pair passes at one base it passes
 *    at every base. The checker still walks all 52, because a property
 *    you have not measured is a belief.
 *
 *    The first version pinned the lightnesses outright, which was the
 *    same idea taken one step too far and produced a real defect. See
 *    the long note above `groundLightness`.
 *
 * Zero imports, so the checker asserts the real module.
 */

export type Oklch = { l: number; c: number; h: number };

/** An anchor is a week and the saturated colour the garden is that week.
 *  These are not moods — each one is a specific thing that is out:
 *  witch hazel in February, the big rhododendrons in March, new beech in
 *  late April, meconopsis in June, the katsura turning in October. */
export const ANCHORS: { week: number; name: string; colour: Oklch }[] = [
  { week: 1, name: "hoar", colour: { l: 0.72, c: 0.078, h: 248 } },
  { week: 7, name: "sulphur", colour: { l: 0.78, c: 0.142, h: 84 } },
  { week: 11, name: "truss", colour: { l: 0.46, c: 0.194, h: 14 } },
  { week: 17, name: "new leaf", colour: { l: 0.79, c: 0.166, h: 134 } },
  { week: 23, name: "poppy", colour: { l: 0.47, c: 0.176, h: 258 } },
  { week: 30, name: "canopy", colour: { l: 0.5, c: 0.086, h: 154 } },
  { week: 42, name: "turn", colour: { l: 0.51, c: 0.154, h: 56 } },
  { week: 47, name: "bare", colour: { l: 0.45, c: 0.062, h: 318 } },
];

/*
 * The LIGHTNESSES above are spread on purpose, and the spread is the
 * whole reason this palette survives colour blindness.
 *
 * The first version had the March truss and the high-summer canopy at
 * exactly the same lightness — 0.55 and 0.55, hue 14 and hue 154. Red
 * and green at identical lightness is the textbook deuteranopia
 * collision, and the checker measured the two grounds at ΔE 1.0 for a
 * deuteranope: for one man in twelve, mid-March and the end of July
 * were the SAME PAGE COLOUR, on a site whose entire premise is that
 * those two weeks are nothing alike.
 *
 * Hue could not fix it — summer is green and the magnolias are red, and
 * neither is negotiable. Lightness could, and it also happens to be
 * more truthful: a dense July canopy IS dark and a magnolia against a
 * March sky IS bright. Getting it right for one reader in twelve made
 * it better for everybody, which is the usual way round.
 */

/**
 * Fixed lightnesses for the derived roles, and how much of the anchor's
 * chroma each keeps. The caps matter more than the multipliers: a
 * near-neutral anchor (winter, bare) should stay near-neutral, and a
 * screaming one (the March truss at 0.194) must not drag the page's own
 * surface up with it, or reading the site in March is like reading it
 * through a filter. The cap is what stops the loudest week setting the
 * volume for the whole year.
 */
const ROLES = {
  ground: { offset: 0, scale: 0.38, cap: 0.078 },
  sheet: { offset: 0.04, scale: 0.11, cap: 0.018 },
  sunk: { offset: -0.052, scale: 0.42, cap: 0.086 },
  line: { offset: -0.095, scale: 0.38, cap: 0.072 },
  ink: { offset: -0.7, scale: 0.11, cap: 0.022 },
  inkMuted: { offset: -0.493, scale: 0.12, cap: 0.024 },
} as const;

/**
 * The ground's own lightness moves with the season, and every other
 * role moves WITH it by a fixed offset.
 *
 * The first version pinned all six lightnesses and varied only hue, on
 * the grounds that a fixed lightness makes contrast a structural
 * property rather than 52 separate things to check. That reasoning was
 * right and the consequence was not: two grounds at identical lightness
 * that differ only in hue are, for a deuteranope, THE SAME COLOUR. The
 * checker measured mid-March against the end of July at ΔE 0.8.
 *
 * Shifting the whole ladder together keeps the property — every
 * relationship in the palette is a fixed distance, so if the pair passes
 * once it passes at every base — while giving the year a lightness
 * curve that no colour vision can flatten. It also turns out to be the
 * more truthful design: February on this coast is pale and high summer
 * is a dark green room, and now the page is too.
 *
 * The range is deliberately narrow. This is a light template in every
 * week; the ground is never a dark surface, it is a paper that gets a
 * little heavier in July.
 */
const GROUND_LIGHT = 0.980;
const GROUND_DARK = 0.864;
const FLARE_LIGHTEST = 0.82;
const FLARE_DARKEST = 0.4;

function groundLightness(flare: Oklch): number {
  const t = (flare.l - FLARE_DARKEST) / (FLARE_LIGHTEST - FLARE_DARKEST);
  const clamped = Math.min(1, Math.max(0, t));
  return GROUND_DARK + clamped * (GROUND_LIGHT - GROUND_DARK);
}

export type Role = keyof typeof ROLES;

function toLab(c: Oklch): { l: number; a: number; b: number } {
  const rad = (c.h * Math.PI) / 180;
  return { l: c.l, a: c.c * Math.cos(rad), b: c.c * Math.sin(rad) };
}

function toLch(lab: { l: number; a: number; b: number }): Oklch {
  const c = Math.hypot(lab.a, lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: lab.l, c, h };
}

/** Weeks wrap, so "the anchor before week 3" is the one at week 47. */
function bracket(week: number): { a: number; b: number; t: number } {
  const n = ANCHORS.length;
  for (let i = 0; i < n; i += 1) {
    const start = ANCHORS[i].week;
    const end = ANCHORS[(i + 1) % n].week;
    const span = ((end - start + 52) % 52) || 52;
    const pos = (week - start + 52) % 52;
    if (pos < span) return { a: i, b: (i + 1) % n, t: pos / span };
  }
  return { a: 0, b: 1, t: 0 };
}

/** The saturated colour of a given week — the one the year rail, the
 *  current-week marker and the section rules are drawn in. */
export function flareFor(week: number): Oklch {
  const w = ((Math.round(week) - 1) % 52 + 52) % 52 + 1;
  const { a, b, t } = bracket(w);
  const la = toLab(ANCHORS[a].colour);
  const lb = toLab(ANCHORS[b].colour);
  // Smoothstep rather than linear: a year does not change at a constant
  // rate, and the anchors are unevenly spaced, so linear interpolation
  // puts a visible kink at every one of them.
  const e = t * t * (3 - 2 * t);
  return toLch({
    l: la.l + (lb.l - la.l) * e,
    a: la.a + (lb.a - la.a) * e,
    b: la.b + (lb.b - la.b) * e,
  });
}

/** A derived role for a given week: the anchor's hue, this role's fixed
 *  lightness, and a chroma that is capped rather than scaled alone. */
export function roleFor(role: Role, week: number): Oklch {
  const spec = ROLES[role];
  const flare = flareFor(week);
  return {
    // Clamped at the top only: `sheet` sits above the ground and would
    // otherwise run past 1 in the palest week of February.
    l: Math.min(0.995, groundLightness(flare) + spec.offset),
    c: Math.min(flare.c * spec.scale, spec.cap),
    h: flare.h,
  };
}

export function css(colour: Oklch): string {
  return `oklch(${colour.l.toFixed(3)} ${colour.c.toFixed(3)} ${colour.h.toFixed(1)})`;
}

/** Everything a page needs, as the custom properties the stylesheet
 *  reads. Set on the page root, so one attribute changes the whole
 *  surface — which is the point of the design and also the thing that
 *  makes it editable: there is one place to change the year's colour. */
export function seasonVars(week: number): Record<string, string> {
  return {
    "--season-flare": css(flareFor(week)),
    "--season-ground": css(roleFor("ground", week)),
    "--season-sheet": css(roleFor("sheet", week)),
    "--season-sunk": css(roleFor("sunk", week)),
    "--season-line": css(roleFor("line", week)),
    "--season-ink": css(roleFor("ink", week)),
    "--season-ink-muted": css(roleFor("inkMuted", week)),
    /* The ink for anything sitting ON the flare — the year note, the
       thin-week warning. It cannot be a constant white: the flare is a
       pale sulphur in February and a near-black green in July, and white
       text failed 4.5:1 in nineteen weeks of the year when it was
       hardcoded. Computed by the same function that inks the tiles. */
    "--season-on-flare": inkOn(css(flareFor(week))).css,
  };
}

/* ── Ink on an arbitrary tile colour ───────────────────────────────
   Roughly three-quarters of the collection has no photograph, and those
   tiles are a flat field of the PLANT's own colour — a maroon trillium
   at L 0.38 next to a white eucryphia at L 0.97, in the same wall, with
   a caption over each. So the caption's colour cannot be a constant and
   it cannot be a guess: it is computed, and the checker walks all 58 of
   them and fails on any that does not clear 4.5:1.

   That means a real OKLCH → sRGB conversion rather than a lightness
   threshold. Björn Ottosson's transform, then WCAG relative luminance —
   the same arithmetic the colour checker uses, kept here rather than
   duplicated there, because two copies of a conversion is two chances
   to be subtly wrong in one direction only. */

function srgbFromOklch(c: Oklch): [number, number, number] {
  const rad = (c.h * Math.PI) / 180;
  const L = c.l;
  const a = c.c * Math.cos(rad);
  const b = c.c * Math.sin(rad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  // Clamped, because a saturated OKLCH triple can sit outside the sRGB
  // gamut and a negative channel silently produces a NaN luminance
  // later — which compares false against every threshold and reads as
  // "fails contrast" for a colour that is merely out of gamut.
  return lin.map((v) => Math.min(1, Math.max(0, v))) as [number, number, number];
}

/** WCAG 2.x relative luminance, from LINEAR-light sRGB. */
export function luminance(c: Oklch): number {
  const [r, g, b] = srgbFromOklch(c);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: Oklch, b: Oklch): number {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** `oklch(0.55 0.194 14)` → the triple. Returns null rather than
 *  throwing, because this parses AUTHORED content and a typo in a
 *  content file should degrade one tile, not take the page down. */
export function parseOklch(input: string): Oklch | null {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(input.trim());
  if (!m) return null;
  return { l: Number(m[1]), c: Number(m[2]), h: Number(m[3]) };
}

/** The bar a caption has to clear over its own tile. */
const AA = 4.5;

/**
 * Which ink to set a caption in, over a given tile colour.
 *
 * The first version picked between one near-black and one near-white by
 * measured contrast, and the checker immediately found the hole: SIX of
 * the fifty-nine tile colours landed between 4.30 and 4.63, and they
 * were not six accidents. A colour at lightness 0.55–0.62 is in a dead
 * band where NEITHER black nor white reaches 4.5 — the scarlet fire
 * bush, the amber enkianthus, the lavender rhododendron all sit there,
 * and so will the next plant anybody adds, because that band is simply
 * where saturated mid-tones live.
 *
 * So the ink is not chosen from two options, it is CONSTRUCTED: keep the
 * tile's own hue, keep a trace of its chroma, and walk the lightness in
 * whichever direction has more headroom until the ratio clears. That
 * fixes the whole class rather than six instances, it guarantees the
 * property for colours nobody has written yet — and it is better
 * looking, because a caption on the scarlet tile is now a very dark
 * scarlet rather than black.
 *
 * It cannot fail: L 0 and L 1 bracket every possible tile colour, so the
 * walk always terminates on a passing value.
 */
export function inkOn(colour: string): { css: string; ratio: number } {
  const c = parseOklch(colour);
  if (!c) return { css: "oklch(0.200 0.010 90)", ratio: 0 };

  const chroma = Math.min(c.c * 0.45, 0.06);
  // The chroma tapers toward both ends of the lightness range. A very
  // dark or very light ink cannot hold much of it inside the sRGB gamut
  // anyway — but the reason this is here rather than being a nicety is
  // that the TINT COSTS CONTRAST. Five saturated mid-tones (the fire
  // bush, the enkianthus, the lavender rhododendron) could not reach
  // 4.5 carrying a flat 0.06 of it, so they fell through to the untinted
  // fallback and came out black. Nothing reported that until the
  // falsification pass added an assertion about the tint itself.
  const step = (l: number): Oklch => ({
    l,
    c: Math.min(chroma, l * 0.16, (1 - l) * 0.5),
    h: c.h,
  });

  // BOTH directions are searched, and this is the fix for a bug worth
  // recording. The first version picked a direction from a single
  // luminance threshold — "lighter than 0.32, go light; otherwise go
  // dark" — and had no fallback if the chosen direction could not reach
  // the bar. The rose magnolia measures 0.3169, so it was sent upward,
  // where the best possible answer is 2.70, and the function returned
  // that: a real failure reported as a completed computation. Searching
  // both and comparing costs eighty subtractions and cannot be wrong in
  // that direction.
  let best: Oklch | null = null;
  let bestRatio = 0;
  for (const dir of [-1, 1]) {
    for (let i = 0; i <= 52; i += 1) {
      const l = 0.62 + dir * i * 0.012;
      if (l < 0.02 || l > 1) break;
      const candidate = step(l);
      const r = contrast(c, candidate);
      if (r >= AA) {
        // The first pass in each direction is the ink closest to the
        // tile's own colour that still clears — prefer whichever of the
        // two ends up nearer, so a caption stays a dark version of its
        // own hue rather than defaulting to maximum contrast.
        if (!best || Math.abs(l - c.l) < Math.abs(best.l - c.l)) {
          best = candidate;
          bestRatio = r;
        }
        break;
      }
    }
  }

  if (best) return { css: css(best), ratio: bestRatio };
  // Unreachable for any in-gamut colour, since near-black and near-white
  // bracket everything — but a silent wrong answer is what the bug above
  // was, so the fallback reports the best it actually found.
  const black = { l: 0.05, c: 0, h: c.h };
  const white = { l: 1, c: 0, h: c.h };
  return contrast(c, black) >= contrast(c, white)
    ? { css: css(black), ratio: contrast(c, black) }
    : { css: css(white), ratio: contrast(c, white) };
}

/** The name of the colour the garden is this week. Printed on the page,
 *  because a palette that changes and never says so reads as a bug. */
export function seasonName(week: number): string {
  const { a, b, t } = bracket(((Math.round(week) - 1) % 52 + 52) % 52 + 1);
  return t < 0.5 ? ANCHORS[a].name : ANCHORS[b].name;
}
