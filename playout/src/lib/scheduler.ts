import type { Hour, ScheduleElement, Spot, Track } from "./schedule.ts";
import { SECONDS_PER_HOUR } from "./schedule.ts";

/**
 * The scheduler: clocks in, a log out.
 *
 * This is the piece a station buys rather than writes, and it is why the
 * log in this template is DERIVED rather than typed out. Three hundred
 * hand-written elements could not have honoured their own rotation
 * rules — the first rule broken would have been broken silently, and the
 * page would have been describing a discipline it did not have.
 *
 * It is deterministic. No randomness, no shuffling, no clock: the same
 * library and the same clocks produce the same Thursday every time, so
 * `scripts/check-log.mjs` asserts against the log the console renders
 * rather than against a lucky one.
 *
 * The rotation rule is the one every real scheduler uses: play whichever
 * record in the wheel has been off the air longest, and prefer one whose
 * artist has not just been on. That is all. Everything the site claims
 * about repeats falls out of it — including the repeats it cannot avoid,
 * which is the point.
 */

export const MIN_FLEX = 15;
export const MAX_FLEX = 240;

export type Slot =
  | { k: "music"; cat: string }
  | { k: "ident"; s: number; title: string; fixed?: boolean }
  | { k: "link"; s: number; title: string; flex?: boolean }
  | { k: "spot" }
  | { k: "news"; s: number; title: string }
  | { k: "promo"; s: number; title: string }
  | { k: "network"; s: number; title: string };

export type ShowShape = {
  id: string;
  mode: "hosted" | "automated" | "network";
  clock: Slot[];
};

export type PlanShape = {
  h: number;
  showId: string;
  spots: string[];
  insert?: { after: number; kind: "feature" | "news" | "promo"; title: string; s: number };
  draft?: boolean;
};

export type BuildInput = {
  plans: PlanShape[];
  shows: ShowShape[];
  tracks: Track[];
  spots: Spot[];
  /** Minutes the same artist must stay off, by category id. */
  artistSeparation: Record<string, number>;
};

type Memory = {
  lastTrack: Map<string, number>;
  lastArtist: Map<string, number>;
};

/**
 * Choose the record for one music slot.
 *
 * Ordering, in strict priority: a record whose artist is clear beats one
 * whose artist is not, then longest off the air wins, then the order it
 * sits on the shelf. The last one is only ever a tie-break, and it
 * exists so the answer does not depend on how a Map happened to iterate.
 */
function pick(
  pool: Track[],
  memory: Memory,
  second: number,
  separationSeconds: number,
): Track | undefined {
  if (pool.length === 0) return undefined;

  let best: Track | undefined;
  let bestKey: [number, number, number] | undefined;

  pool.forEach((track, index) => {
    const artistAt = memory.lastArtist.get(track.artist.toLowerCase());
    const artistClear =
      artistAt === undefined || second - artistAt >= separationSeconds ? 0 : 1;
    const playedAt = memory.lastTrack.get(track.id);
    const key: [number, number, number] = [
      artistClear,
      playedAt === undefined ? -1 : playedAt,
      index,
    ];
    if (bestKey === undefined || less(key, bestKey)) {
      best = track;
      bestKey = key;
    }
  });

  return best;
}

function less(a: [number, number, number], b: [number, number, number]): boolean {
  if (a[0] !== b[0]) return a[0] < b[0];
  if (a[1] !== b[1]) return a[1] < b[1];
  return a[2] < b[2];
}

/**
 * Build the whole broadcast day.
 *
 * Each hour is laid down in two passes, and the reason is worth stating
 * because it looks like an inefficiency. The flexible back-announce is
 * as long as whatever is left over, which cannot be known until every
 * other element in the hour has been chosen — but choosing the records
 * needs a running clock, so the first pass runs with the back-announce
 * at its floor and the second pass puts the real length in. Nothing
 * chosen in pass one depends on the value pass two produces, so the two
 * cannot disagree.
 */
export function buildDay(input: BuildInput): Hour[] {
  const showById = new Map(input.shows.map((s) => [s.id, s]));
  const spotById = new Map(input.spots.map((s) => [s.id, s]));
  const memory: Memory = { lastTrack: new Map(), lastArtist: new Map() };

  return input.plans.map((plan) => {
    const show = showById.get(plan.showId);
    if (!show) return { h: plan.h, showId: plan.showId, elements: [] };

    const slots = withInsert(show.clock, plan);
    const queue = [...plan.spots];
    const elements: ScheduleElement[] = [];
    const durations: number[] = [];
    let flexIndex = -1;
    let cursor = plan.h * SECONDS_PER_HOUR;

    for (const slot of slots) {
      if (slot.k === "music") {
        const pool = input.tracks.filter((t) => t.categoryId === slot.cat);
        const separation = (input.artistSeparation[slot.cat] ?? 0) * 60;
        const track = pick(pool, memory, cursor, separation);
        if (!track) continue;
        elements.push({ kind: "music", ref: track.id });
        durations.push(track.seconds);
        memory.lastTrack.set(track.id, cursor);
        memory.lastArtist.set(track.artist.toLowerCase(), cursor);
        cursor += track.seconds;
        continue;
      }

      if (slot.k === "spot") {
        // An unsold slot does not become silence, it stops existing. A
        // station with nothing to put there simply plays the next record
        // sooner, which is why the log is shorter than the clock.
        const ref = queue.shift();
        if (ref === undefined) continue;
        const spot = spotById.get(ref);
        if (!spot) continue;
        elements.push({ kind: "spot", ref });
        durations.push(spot.seconds);
        cursor += spot.seconds;
        continue;
      }

      if (slot.k === "link" && slot.flex === true) {
        flexIndex = elements.length;
        elements.push({ kind: "link", title: slot.title, seconds: MIN_FLEX, elastic: true });
        durations.push(MIN_FLEX);
        cursor += MIN_FLEX;
        continue;
      }

      const element: ScheduleElement = {
        kind: slot.k,
        title: slot.title,
        seconds: slot.s,
      };
      if (slot.k === "ident" && slot.fixed === true) element.fixed = true;
      if (slot.k === "network") element.fixed = true;
      elements.push(element);
      durations.push(slot.s);
      cursor += slot.s;
    }

    if (flexIndex >= 0) {
      const withoutFlex = durations.reduce((a, b) => a + b, 0) - MIN_FLEX;
      const wanted = SECONDS_PER_HOUR - withoutFlex;
      const given = Math.min(MAX_FLEX, Math.max(MIN_FLEX, wanted));
      elements[flexIndex] = { ...elements[flexIndex], seconds: given };
    }

    const hour: Hour = { h: plan.h, showId: plan.showId, elements };
    if (plan.draft === true) hour.draft = true;
    return hour;
  });
}

/** Drop a one-off into the clock at the position the plan asks for. */
function withInsert(clock: Slot[], plan: PlanShape): Slot[] {
  if (!plan.insert) return clock;
  const insert = plan.insert;
  const slot: Slot =
    insert.kind === "promo"
      ? { k: "promo", s: insert.s, title: insert.title }
      : { k: "news", s: insert.s, title: insert.title };
  const at = Math.min(Math.max(0, insert.after), clock.length);
  return [...clock.slice(0, at), slot, ...clock.slice(at)];
}
