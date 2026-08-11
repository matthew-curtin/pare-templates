/**
 * What is worth walking to, and when.
 *
 * The whole site is this file rendered eight different ways. A garden's
 * website is normally a list of what it HAS; this one is a list of what
 * is happening, which is a different question with a different answer
 * every week — and the interesting part is that the answer is sometimes
 * "not much", which no garden's own site has ever said.
 *
 * Zero runtime imports (the type import erases), so
 * `scripts/check-season.mjs` asserts against the module the site ships
 * rather than a copy of it that drifts.
 */

import type { Accession } from "@/content/types.ts";

export const WEEKS = 52;

/**
 * Below this, a thing is not worth crossing the garden for.
 *
 * This number is doing more work than it looks. Because the curve floors
 * at 30% of a plant's strength at the edges of its window, the bar means
 * a strength-10 magnolia is above it for every week it is out, while a
 * strength-5 trillium is above it only for the middle of its season. So
 * "how long is this worth seeing" is not the same as "how long is it in
 * flower", and it falls out of two numbers rather than being a third
 * number somebody has to keep consistent with the other two.
 */
export const WORTH_SEEING = 2.5;

/** A week with fewer than this many things above the bar is one the
 *  garden tells you about instead of hiding. */
export const QUIET_BELOW = 6;

/** How much of its strength a plant is still worth at the very edge of
 *  its window. Not zero: the first week of the magnolias is thrilling
 *  even though it is one flower, and the last week of the acers is
 *  still an acer. */
const EDGE_FLOOR = 0.3;

export type Index = {
  all: Accession[];
  bySlug: Map<string, Accession>;
  byArea: Map<string, Accession[]>;
};

export function index(all: Accession[]): Index {
  const bySlug = new Map<string, Accession>();
  const byArea = new Map<string, Accession[]>();
  for (const a of all) {
    bySlug.set(a.slug, a);
    const list = byArea.get(a.area);
    if (list) list.push(a);
    else byArea.set(a.area, [a]);
  }
  return { all, bySlug, byArea };
}

export function normalise(week: number): number {
  return ((Math.round(week) - 1) % WEEKS + WEEKS) % WEEKS + 1;
}

/** How many weeks a window runs for. A window that starts and ends on
 *  the same week is one week long, not fifty-two — which is the bug you
 *  get for free from `(to - from + 52) % 52` and never notice, because
 *  the plant simply appears to be out all year. */
export function windowLength(a: Accession): number {
  return ((a.to - a.from + WEEKS) % WEEKS) + 1;
}

/**
 * What a plant is worth in a given week: 0 outside its window, rising to
 * its full strength at its peak.
 *
 * The two sides of the curve are scaled independently, because a plant's
 * season is not symmetrical — a magnolia builds for a fortnight and is
 * finished by a single warm night, and a katsura takes three weeks to
 * turn and drops in four days.
 */
export function scoreAt(a: Accession, week: number): number {
  const w = normalise(week);
  const span = (a.to - a.from + WEEKS) % WEEKS;
  const pos = (w - a.from + WEEKS) % WEEKS;
  if (span === 0) return w === a.from ? a.strength : 0;
  if (pos > span) return 0;
  const peakPos = (a.peak - a.from + WEEKS) % WEEKS;
  const fall = span - peakPos;
  let t: number;
  if (pos <= peakPos) t = peakPos === 0 ? 1 : pos / peakPos;
  else t = fall === 0 ? 1 : (span - pos) / fall;
  return a.strength * (EDGE_FLOOR + (1 - EDGE_FLOOR) * t);
}

export function isOut(a: Accession, week: number): boolean {
  return scoreAt(a, week) >= WORTH_SEEING;
}

export type Showing = { accession: Accession; score: number };

/** Everything above the bar in a week, best first. Ties break on the
 *  accession id so the wall does not re-order itself between renders —
 *  a mosaic that reshuffles when nothing changed reads as broken. */
export function whatsOn(ix: Index, week: number): Showing[] {
  const out: Showing[] = [];
  for (const a of ix.all) {
    const score = scoreAt(a, week);
    if (score >= WORTH_SEEING) out.push({ accession: a, score });
  }
  out.sort((x, y) => y.score - x.score || x.accession.id.localeCompare(y.accession.id));
  return out;
}

/** The garden's whole value in a week — the sum of everything above the
 *  bar, not of everything alive. Counting the below-bar tail would make
 *  every week look similar, which is precisely the flattening the site
 *  exists to argue against. */
export function weekValue(ix: Index, week: number): number {
  let total = 0;
  for (const { score } of whatsOn(ix, week)) total += score;
  return total;
}

export function yearCurve(ix: Index): number[] {
  const out: number[] = [];
  for (let w = 1; w <= WEEKS; w += 1) out.push(weekValue(ix, w));
  return out;
}

export function peakWeek(ix: Index): number {
  const curve = yearCurve(ix);
  let best = 0;
  for (let i = 1; i < curve.length; i += 1) if (curve[i] > curve[best]) best = i;
  return best + 1;
}

export function troughWeek(ix: Index): number {
  const curve = yearCurve(ix);
  let worst = 0;
  for (let i = 1; i < curve.length; i += 1) if (curve[i] < curve[worst]) worst = i;
  return worst + 1;
}

/** The weeks the garden would rather you knew about in advance. */
export function quietWeeks(ix: Index): number[] {
  const out: number[] = [];
  for (let w = 1; w <= WEEKS; w += 1) {
    if (whatsOn(ix, w).length < QUIET_BELOW) out.push(w);
  }
  return out;
}

/**
 * How big this tile is on the wall.
 *
 * The ranking IS the layout — there is no "featured" flag anywhere in
 * the content, and nothing is promoted by hand. A thing is large in the
 * week it is large in. Three bands rather than a continuous area,
 * because a grid can only span whole tracks and because the eye reads
 * three sizes as a ranking and five as noise.
 */
export function tileSpan(score: number): 1 | 2 | 3 {
  if (score >= 7.5) return 3;
  if (score >= 5) return 2;
  return 1;
}

/** Weeks in which BOTH are above the bar. Empty means you cannot see
 *  them on the same visit, however much you would like to. */
export function overlapWeeks(a: Accession, b: Accession): number[] {
  const out: number[] = [];
  for (let w = 1; w <= WEEKS; w += 1) {
    if (isOut(a, w) && isOut(b, w)) out.push(w);
  }
  return out;
}

/** Weeks in which nothing in this area is above the bar. The number the
 *  garden's own trustees would prefer not to publish. */
export function gapsFor(ix: Index, area: string): number[] {
  const list = ix.byArea.get(area) ?? [];
  const out: number[] = [];
  for (let w = 1; w <= WEEKS; w += 1) {
    if (!list.some((a) => isOut(a, w))) out.push(w);
  }
  return out;
}

/** The longest unbroken run in a circular list of weeks. A gap that
 *  straddles the new year is one gap, and reporting it as two ("weeks
 *  48–52 and weeks 1–9") is how fourteen weeks of nothing gets filed as
 *  two short quiet spells. */
export function longestRun(weeks: number[]): { from: number; to: number; length: number } | null {
  if (weeks.length === 0) return null;
  if (weeks.length === WEEKS) return { from: 1, to: WEEKS, length: WEEKS };
  const set = new Set(weeks.map(normalise));
  let best: { from: number; to: number; length: number } | null = null;
  for (const start of set) {
    // Only start a run at a week whose predecessor is absent, or every
    // member of a run gets measured and the answer is the same length
    // reported many times over.
    if (set.has(normalise(start - 1))) continue;
    let length = 0;
    let w = start;
    while (set.has(normalise(w)) && length < WEEKS) {
      length += 1;
      w = normalise(w + 1);
    }
    if (!best || length > best.length) {
      best = { from: start, to: normalise(start + length - 1), length };
    }
  }
  return best;
}

export type Plan = {
  week: number;
  score: number;
  out: Accession[];
  missing: Accession[];
};

/**
 * Given a handful of things somebody wants to see, the one week to come.
 *
 * The honest half is `missing`: with any real list there is no week that
 * has all of it, and a planner that only showed the winner would be
 * quietly lying by omission. Ties go to the EARLIER week, because a
 * garden in the same state twice is worth seeing on the way up.
 */
export function bestWeekFor(ix: Index, slugs: string[]): Plan | null {
  const wanted = slugs
    .map((s) => ix.bySlug.get(s))
    .filter((a): a is Accession => a !== undefined);
  if (wanted.length === 0) return null;
  let best: Plan | null = null;
  for (let w = 1; w <= WEEKS; w += 1) {
    let score = 0;
    const out: Accession[] = [];
    const missing: Accession[] = [];
    for (const a of wanted) {
      const s = scoreAt(a, w);
      if (s >= WORTH_SEEING) {
        score += s;
        out.push(a);
      } else {
        missing.push(a);
      }
    }
    if (!best || score > best.score) best = { week: w, score, out, missing };
  }
  return best;
}

/** Every week in which this plant is above the bar, as a run. Used for
 *  the bar a plant's own page draws across the year. */
export function seasonOf(ix: Index, slug: string): number[] {
  const a = ix.bySlug.get(slug);
  if (!a) return [];
  const out: number[] = [];
  for (let w = 1; w <= WEEKS; w += 1) if (isOut(a, w)) out.push(w);
  return out;
}

/** The kinds of interest present in a week, in a fixed order, so the
 *  legend does not reorder itself as you move through the year. */
export const KIND_ORDER: Accession["kind"][] = [
  "flower",
  "scent",
  "leaf",
  "fruit",
  "bark",
  "form",
];

export function kindsIn(ix: Index, week: number): Accession["kind"][] {
  const present = new Set(whatsOn(ix, week).map((s) => s.accession.kind));
  return KIND_ORDER.filter((k) => present.has(k));
}
