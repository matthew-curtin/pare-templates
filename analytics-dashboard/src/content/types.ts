/**
 * Shared content types.
 *
 * Everything the app renders comes from the typed modules in this
 * folder — no copy, number or label is hardcoded inside a component.
 */

export type NavItem = {
  label: string;
  to: string;
  /** Icon key — see components/nav-icon.tsx. */
  icon: "overview" | "audience" | "funnels" | "events" | "settings";
};

/** One day of the product's numbers. The whole dashboard derives from
 *  this series, so the date-range control changes real values rather
 *  than swapping in a second set of hardcoded figures. */
export type DailyPoint = {
  /** ISO date, e.g. "2026-08-03". */
  date: string;
  events: number;
  sessions: number;
  /** Median session length, in seconds. */
  medianSeconds: number;
};

export type RangeId = "7d" | "30d" | "90d";

export type Range = {
  id: RangeId;
  label: string;
  days: number;
};

/** A KPI tile. `goodDirection` exists because down is good for some
 *  metrics, and colouring every fall red would be a lie. */
export type Kpi = {
  id: string;
  label: string;
  /** How to render the value. */
  format: "compact" | "duration" | "percent";
  goodDirection: "up" | "down";
  /** One line under the tile, explaining what the number counts. */
  help: string;
};

/** A row in the "where sessions come from" chart. Nominal categories,
 *  so every bar is one colour — see the note in bar-chart.tsx. */
export type Source = {
  name: string;
  sessions: number;
};

/** A segment of the plan mix. Ordered smallest to largest. */
export type PlanSlice = {
  name: string;
  teams: number;
};

/** One cohort row of the retention grid. `values` is week 0..n
 *  retention as a fraction, so index 0 is always 1. */
export type Cohort = {
  /** e.g. "Week of 9 Jun" */
  label: string;
  size: number;
  values: number[];
};

export type FunnelStage = {
  name: string;
  /** Number of teams reaching this stage. Monotonically decreasing. */
  teams: number;
  /** One line on what the stage means. */
  detail: string;
};

export type EventKind = "track" | "identify" | "page" | "error";

export type TrackedEvent = {
  id: string;
  name: string;
  kind: EventKind;
  /** Volume over the last 30 days. */
  volume: number;
  /** Percentage change vs the previous 30 days, signed. */
  changePercent: number;
  /** Teams that have sent this event at least once. */
  teams: number;
  /** ISO datetime of the most recent one seen. */
  lastSeen: string;
  owner: string;
  description: string;
  /** Sparkline data — 14 daily counts, oldest first. */
  trend: number[];
};

export type Workspace = {
  name: string;
  plan: string;
  region: string;
  retentionMonths: number;
};

export type Member = {
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Analyst" | "Viewer";
  initials: string;
};
