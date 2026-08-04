import type { DailyPoint, Kpi, Range } from "./types";

/**
 * The daily series everything else is derived from.
 *
 * This is the one place in the fleet where content is *computed*
 * rather than written out. Ninety days × three measures is 270
 * numbers; as a literal it would be unreadable and nobody could edit
 * it sensibly. The shape parameters below are the editable surface
 * instead — change `TREND_PER_DAY` and the whole dashboard responds.
 *
 * It is deterministic on purpose. The jitter comes from a seeded
 * generator rather than Math.random, so the numbers are identical on
 * every reload: a dashboard whose figures change when you refresh is
 * unusable for judging a design, and impossible to screenshot twice.
 */

/** First day of the series. The last is 89 days later. */
const START = "2026-05-06";
const DAYS = 90;

/** Events on day zero, before trend and weekday shaping. */
const BASE_EVENTS = 38_000;
/** Straight-line growth added per day. */
const TREND_PER_DAY = 160;

/** Index 0 is the START date's weekday. Weekends are quieter, which
 *  is what makes the chart look like a real product rather than a
 *  smooth curve. */
const WEEKDAY_SHAPE = [1.0, 1.0, 0.92, 0.55, 0.52, 1.02, 1.04];

/** A three-day outage, so the series has one thing worth explaining. */
const INCIDENT = { startDay: 61, factors: [0.44, 0.61, 0.86] };

/** Deterministic ±3% jitter. A linear congruential generator, seeded
 *  once — the point is that it never changes between runs. */
function makeJitter(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return 0.97 + (state / 4_294_967_296) * 0.06;
  };
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

function buildSeries(): DailyPoint[] {
  const jitter = makeJitter(20_260_506);
  const out: DailyPoint[] = [];

  for (let i = 0; i < DAYS; i++) {
    const incidentIndex = i - INCIDENT.startDay;
    const incident =
      incidentIndex >= 0 && incidentIndex < INCIDENT.factors.length
        ? INCIDENT.factors[incidentIndex]
        : 1;

    const events = Math.round(
      (BASE_EVENTS + TREND_PER_DAY * i) *
        WEEKDAY_SHAPE[i % WEEKDAY_SHAPE.length] *
        incident *
        jitter()
    );

    // Events per session wanders slowly rather than cycling with the
    // week. An earlier version derived this from `i % 5`, which made
    // the ratio a perfect sawtooth — the "events per session" tile
    // drew a zigzag no real product would produce. Two slow sines beat
    // against each other instead, which reads as drift.
    const perSession = 5.9 + 0.5 * Math.sin(i / 9) + 0.25 * Math.sin(i / 3.3);

    out.push({
      date: addDays(START, i),
      events,
      sessions: Math.round(events / perSession),
      // Session length drifts up slowly and dips during the outage.
      medianSeconds: Math.round((188 + i * 0.55) * (incident < 1 ? 0.82 : 1) * jitter()),
    });
  }

  return out;
}

export const daily: DailyPoint[] = buildSeries();

export const ranges: Range[] = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
];

/** The most recent `days` points. */
export function sliceFor(days: number): DailyPoint[] {
  return daily.slice(-days);
}

/** The `days` points immediately before that, for the comparison line
 *  and every delta on the page. */
export function previousSliceFor(days: number): DailyPoint[] {
  const end = daily.length - days;
  return daily.slice(Math.max(0, end - days), end);
}

export const kpis: Kpi[] = [
  {
    id: "events",
    label: "Events tracked",
    format: "compact",
    goodDirection: "up",
    help: "Every call your code makes to the SDK, across all teams.",
  },
  {
    id: "sessions",
    label: "Sessions",
    format: "compact",
    goodDirection: "up",
    help: "A run of activity from one person with no 30-minute gap.",
  },
  {
    id: "medianSeconds",
    label: "Median session",
    format: "duration",
    goodDirection: "up",
    help: "The middle session, not the mean — a handful of tabs left open all day would drag an average anywhere.",
  },
  {
    id: "eventsPerSession",
    label: "Events per session",
    format: "percent",
    goodDirection: "up",
    help: "How much happens in a typical visit. Falls when a release adds noise rather than use.",
  },
];

/** The one line of prose on the overview that explains the dip. */
export const incidentNote = {
  date: "2026-07-06",
  title: "Ingest outage — 6 to 8 July",
  body: "A bad deploy to the ingest workers dropped roughly 56% of events for two and a half days. The events were lost, not delayed, so the dip is real and will not backfill.",
};
