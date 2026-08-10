import type { Leg, Shelter, Terrain, TerrainMix } from "../content/types";

/**
 * Everything the site computes about the route.
 *
 * This module has no runtime imports and reads no content of its own —
 * every function takes the legs, the shelters or the pace model as an
 * argument. That is what lets `scripts/check-route.mjs` import the REAL
 * functions rather than a copy that drifts away from them, which is the
 * only way an assertion here is also a property of the site.
 * CONVENTIONS §8.
 *
 * Two conventions run through all of it. Distances are statute miles,
 * elevations are feet. And nothing states a number that can be derived
 * from another one: ascent comes out of the profile, hours come out of
 * the terrain and the ascent, and totals come out of the legs — so the
 * shape drawn in the rail and the figure printed beside it cannot
 * disagree, which is the §7b failure this content is most exposed to.
 */

export const TERRAIN_ORDER: Terrain[] = ["trail", "rough", "talus", "bog"];

export type PaceModel = {
  pace: Record<Terrain, number>;
  hoursPerFootUp: number;
  hoursPerFootDown: number;
};

/** Feet climbed, summed from the profile samples. */
export function ascentOf(leg: Leg): number {
  let up = 0;
  for (let i = 1; i < leg.profile.length; i += 1) {
    const d = leg.profile[i] - leg.profile[i - 1];
    if (d > 0) up += d;
  }
  return up;
}

/** Feet lost, summed the same way. */
export function descentOf(leg: Leg): number {
  let down = 0;
  for (let i = 1; i < leg.profile.length; i += 1) {
    const d = leg.profile[i] - leg.profile[i - 1];
    if (d < 0) down -= d;
  }
  return down;
}

/** Net change over the leg. Always ascent − descent, by construction. */
export function netOf(leg: Leg): number {
  return leg.profile[leg.profile.length - 1] - leg.profile[0];
}

export function highPointOf(leg: Leg): number {
  return Math.max(...leg.profile);
}

/**
 * How long the leg takes, in hours.
 *
 * The whole argument of the site is in this one function: distance
 * enters it four times, once per terrain class at a different pace, and
 * then the climb is added on top. A mile is not a unit of effort and
 * this is the arithmetic that says so.
 */
export function hoursOf(leg: Leg, model: PaceModel): number {
  let h = 0;
  for (const t of TERRAIN_ORDER) {
    h += leg.terrain[t] / model.pace[t];
  }
  h += ascentOf(leg) * model.hoursPerFootUp;
  h += descentOf(leg) * model.hoursPerFootDown;
  return h;
}

/** The terrain class the leg has most of. Drives the colour of that
 *  leg's section in the rail, so the profile reads as ground rather
 *  than only as shape. */
export function dominantTerrain(leg: Leg): Terrain {
  let best: Terrain = "trail";
  for (const t of TERRAIN_ORDER) {
    if (leg.terrain[t] > leg.terrain[best]) best = t;
  }
  return best;
}

/** Terrain in the order the ramp uses, dropping classes the leg has
 *  none of — so a bar chart of it has no zero-width segments. */
export function terrainBreakdown(leg: Leg): { terrain: Terrain; miles: number }[] {
  return TERRAIN_ORDER.filter((t) => leg.terrain[t] > 0).map((t) => ({
    terrain: t,
    miles: leg.terrain[t],
  }));
}

export function sumMix(mix: TerrainMix): number {
  return TERRAIN_ORDER.reduce((n, t) => n + mix[t], 0);
}

export function totalDistance(legs: Leg[]): number {
  return legs.reduce((n, l) => n + l.distance, 0);
}

export function totalAscent(legs: Leg[]): number {
  return legs.reduce((n, l) => n + ascentOf(l), 0);
}

export function totalDescent(legs: Leg[]): number {
  return legs.reduce((n, l) => n + descentOf(l), 0);
}

export function totalHours(legs: Leg[], model: PaceModel): number {
  return legs.reduce((n, l) => n + hoursOf(l, model), 0);
}

/** Cumulative miles at the START of each leg, plus the total at the
 *  end — so `mileposts(legs)[i]` is the distance to shelter `i`. */
export function mileposts(legs: Leg[]): number[] {
  const out = [0];
  let run = 0;
  for (const leg of legs) {
    run += leg.distance;
    out.push(run);
  }
  return out;
}

export type ProfilePoint = { mile: number; elevation: number };

/**
 * The whole route as one polyline, in miles and feet.
 *
 * Each leg's samples are assumed evenly spaced along that leg, which is
 * a simplification and is stated rather than hidden: the profile is a
 * schematic of the ground, not a survey of it. The last sample of one
 * leg and the first of the next are the same shelter, so the duplicate
 * is dropped and the line is continuous.
 */
export function routeProfile(legs: Leg[]): ProfilePoint[] {
  const out: ProfilePoint[] = [];
  let base = 0;
  legs.forEach((leg, li) => {
    const steps = leg.profile.length - 1;
    leg.profile.forEach((elevation, i) => {
      if (li > 0 && i === 0) return;
      out.push({ mile: base + (leg.distance * i) / steps, elevation });
    });
    base += leg.distance;
  });
  return out;
}

export function profileBounds(legs: Leg[]): { low: number; high: number } {
  let low = Infinity;
  let high = -Infinity;
  for (const leg of legs) {
    for (const e of leg.profile) {
      if (e < low) low = e;
      if (e > high) high = e;
    }
  }
  return { low, high };
}

export type Day = {
  /** 1-based, for display. */
  n: number;
  legs: Leg[];
  hours: number;
  distance: number;
  ascent: number;
  descent: number;
  /** True if any leg in the day has no water on it. */
  dry: boolean;
};

/**
 * Split the route into `days` contiguous days, minimising the LONGEST
 * day. Exact, by dynamic programming — the route is eleven legs, so
 * there is no reason to approximate.
 *
 * Minimising the maximum rather than evening out the average is the
 * whole point. A walker does not care that the mean day is eight hours;
 * they care what the worst one is, because that is the one that ends in
 * the dark. It also gives the planner a property worth relying on:
 * asking for one more day can never make the longest day longer, since
 * any k-day plan can be cut in two to make a (k+1)-day plan no worse.
 * The checker asserts that across every k rather than trusting the
 * argument.
 *
 * Among the plans that tie on the longest day — and with eleven legs
 * there are usually several — it takes the one with the smallest sum of
 * squared day lengths, which is the balanced one. Without a tiebreak
 * the planner would be free to return a plan with a two-hour day and a
 * ten-hour day beside it, both technically optimal, and would look
 * broken.
 */
export function splitInto(legs: Leg[], days: number, model: PaceModel): Day[] {
  const n = legs.length;
  if (days < 1 || days > n) return [];

  const h = legs.map((l) => hoursOf(l, model));
  const prefix = [0];
  for (const x of h) prefix.push(prefix[prefix.length - 1] + x);
  const span = (a: number, b: number) => prefix[b] - prefix[a];

  type Cell = { max: number; sumSq: number; cut: number };
  const worse: Cell = { max: Infinity, sumSq: Infinity, cut: -1 };
  const better = (a: Cell, b: Cell) =>
    a.max < b.max - 1e-9 || (Math.abs(a.max - b.max) <= 1e-9 && a.sumSq < b.sumSq - 1e-9);

  // dp[k][i]: best way to cover legs [0, i) in k days.
  const dp: Cell[][] = [];
  for (let k = 0; k <= days; k += 1) {
    dp.push(new Array<Cell>(n + 1).fill(worse));
  }
  dp[0][0] = { max: 0, sumSq: 0, cut: 0 };

  for (let k = 1; k <= days; k += 1) {
    for (let i = k; i <= n; i += 1) {
      for (let m = k - 1; m < i; m += 1) {
        const prev = dp[k - 1][m];
        if (prev.cut === -1) continue;
        const len = span(m, i);
        const cand: Cell = {
          max: Math.max(prev.max, len),
          sumSq: prev.sumSq + len * len,
          cut: m,
        };
        if (better(cand, dp[k][i])) dp[k][i] = cand;
      }
    }
  }

  if (dp[days][n].cut === -1) return [];

  const cuts: number[] = [n];
  let i = n;
  for (let k = days; k >= 1; k -= 1) {
    const m = dp[k][i].cut;
    cuts.push(m);
    i = m;
  }
  cuts.reverse();

  const out: Day[] = [];
  for (let d = 0; d < days; d += 1) {
    const slice = legs.slice(cuts[d], cuts[d + 1]);
    out.push({
      n: d + 1,
      legs: slice,
      hours: slice.reduce((x, l) => x + hoursOf(l, model), 0),
      distance: slice.reduce((x, l) => x + l.distance, 0),
      ascent: slice.reduce((x, l) => x + ascentOf(l), 0),
      descent: slice.reduce((x, l) => x + descentOf(l), 0),
      dry: slice.some((l) => l.dry),
    });
  }
  return out;
}

/** The fewest days the route can be walked in is one per leg; the most
 *  useful upper bound is the same number. Both ends are content
 *  decisions, so they live with the caller — this just says what is
 *  representable. */
export function dayRange(legs: Leg[]): { min: number; max: number } {
  return { min: 1, max: legs.length };
}

/**
 * The longest day in the best plan of every length, which is the fact
 * the front page is built around: below a certain number of days the
 * plan stops being ambitious and starts being impossible, and there is
 * a leg in the middle that no amount of extra days can shorten.
 */
export function longestDayByLength(legs: Leg[], model: PaceModel): number[] {
  const out: number[] = [];
  for (let k = 1; k <= legs.length; k += 1) {
    const plan = splitInto(legs, k, model);
    out.push(Math.max(...plan.map((d) => d.hours)));
  }
  return out;
}

/* ── Integrity ────────────────────────────────────────────────────────
   Three ways the content can be internally inconsistent while every
   individual number looks fine. All three are exported so the checker
   can assert them; none of them is used by the site, which is the
   correct division — the site should not be defending itself against
   its own data at render time. */

/** Legs that do not start where the previous one finished. */
export function chainBreaks(legs: Leg[]): string[] {
  const out: string[] = [];
  for (let i = 1; i < legs.length; i += 1) {
    if (legs[i].from !== legs[i - 1].to) {
      out.push(`${legs[i].id} starts at ${legs[i].from}, but ${legs[i - 1].id} ends at ${legs[i - 1].to}`);
    }
  }
  return out;
}

/** Legs whose terrain miles do not add up to their distance. */
export function terrainMismatches(legs: Leg[]): string[] {
  return legs
    .filter((l) => Math.abs(sumMix(l.terrain) - l.distance) > 0.001)
    .map((l) => `${l.id}: terrain sums to ${sumMix(l.terrain).toFixed(2)}, distance is ${l.distance}`);
}

/** Legs whose profile does not begin and end at the elevation of the
 *  shelters it runs between — the check that keeps the drawn line and
 *  the stated heights the same fact. */
export function elevationMismatches(legs: Leg[], shelters: Shelter[]): string[] {
  const byId = new Map(shelters.map((s) => [s.id, s]));
  const out: string[] = [];
  for (const leg of legs) {
    const from = byId.get(leg.from);
    const to = byId.get(leg.to);
    if (!from || !to) {
      out.push(`${leg.id}: unknown shelter`);
      continue;
    }
    const first = leg.profile[0];
    const last = leg.profile[leg.profile.length - 1];
    if (first !== from.elevation) {
      out.push(`${leg.id}: profile starts at ${first}, ${from.name} is at ${from.elevation}`);
    }
    if (last !== to.elevation) {
      out.push(`${leg.id}: profile ends at ${last}, ${to.name} is at ${to.elevation}`);
    }
  }
  return out;
}
