import { categories, trackOf, tracks } from "../content/library.ts";
import { day as plans } from "../content/day.ts";
import { shows, showById } from "../content/shows.ts";
import { spotOf, spots } from "../content/spots.ts";
import { NOW, WEEKDAY } from "../content/site.ts";
import { buildDay } from "./scheduler.ts";
import * as model from "./schedule.ts";

/**
 * The station, assembled once.
 *
 * Everything below is derived. Nothing here is a second copy of a number
 * that exists in `src/content` — the log comes out of the clocks and the
 * library, the drift comes out of the log, and the underwriting report
 * comes out of counting the log rather than out of a table somebody
 * maintains.
 *
 * It is computed at module load and shared, because it is a pure
 * function of files that do not change while the app is running. A
 * console recomputing its whole day on every render would be a strange
 * thing to demonstrate.
 */

export const lookup: model.Lookup = { track: trackOf, spot: spotOf };

export const artistSeparation: Record<string, number> = Object.fromEntries(
  categories.map((c) => [c.id, c.artistSeparationMinutes]),
);

export const hours = buildDay({ plans, shows, tracks, spots, artistSeparation });

export const placed = model.layDay(hours, lookup);
export const stats = model.hourStats(hours, lookup);
export const hourStatByHour = new Map(stats.map((s) => [s.hour.h, s]));

export const breaches = model.breaches(placed, lookup, categories);
export const flaggedKeys = model.flagged(breaches);
export const breachAt = new Map(breaches.map((b) => [`${b.at.hour}:${b.at.index}`, b]));

export const deliveries = model.delivery(placed, spots, WEEKDAY);
export const feasibilities = model.feasibility(placed, lookup, categories, tracks);

export const modeOf = (h: model.Hour) => showById.get(h.showId)?.mode ?? "hosted";

export const bands = model.bandStats(stats, [
  { label: "Hosted", holds: (h) => modeOf(h) === "hosted" },
  { label: "Automated", holds: (h) => modeOf(h) === "automated" },
]);

export const onAir = model.onAirAt(placed, NOW);
export const comingUp = model.restOfHour(placed, NOW).slice(1);
export const toJunction = model.toJunction(NOW);
export const currentHour = Math.floor(NOW / model.SECONDS_PER_HOUR);

/**
 * What each show ASKS of the library, hour by hour.
 *
 * A category is a wheel, and a wheel cannot hand you the same record
 * twice in a row unless you ask it for more records than it holds. Local
 * Cuts asks for fourteen Cape Wren records an hour and the shelf has
 * nine, so five of them come round twice inside the hour — every week,
 * whatever the scheduler does. That is arithmetic, not a bug, and it is
 * the one thing on this console no amount of care fixes.
 */
export type ShowDemand = {
  showId: string;
  categoryId: string;
  slotsPerHour: number;
  available: number;
  forcedRepeats: number;
};

export const demands: ShowDemand[] = shows.flatMap((show) => {
  const counts = new Map<string, number>();
  for (const slot of show.clock) {
    if (slot.k !== "music") continue;
    counts.set(slot.cat, (counts.get(slot.cat) ?? 0) + 1);
  }
  return [...counts.entries()].map(([categoryId, slotsPerHour]) => {
    const available = tracks.filter((t) => t.categoryId === categoryId).length;
    return {
      showId: show.id,
      categoryId,
      slotsPerHour,
      available,
      forcedRepeats: model.forcedRepeats(slotsPerHour, available),
    };
  });
});

export const impossibleDemands = demands.filter((d) => d.forcedRepeats > 0);

/** Where each record stands right now: last play, and when the rules let
 *  it back on the air. */
export type Standing = {
  track: model.Track;
  category: model.Category;
  playsToday: number;
  last: model.Placed | null;
  eligible: number | null;
  ready: boolean;
};

export const standings: Standing[] = tracks.map((track) => {
  const category = categories.find((c) => c.id === track.categoryId)!;
  const last = model.lastPlayed(placed, track.id, NOW);
  const eligible = model.eligibleAt(placed, track.id, category, NOW);
  return {
    track,
    category,
    playsToday: placed.filter(
      (p) => p.element.kind === "music" && p.element.ref === track.id,
    ).length,
    last,
    eligible,
    ready: eligible === null || eligible <= NOW,
  };
});

export const standingById = new Map(standings.map((s) => [s.track.id, s]));
