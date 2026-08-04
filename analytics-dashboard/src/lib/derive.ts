import type { DailyPoint, Kpi } from "@/content/types";
import { percentChange } from "./format";

/**
 * Turns a slice of the daily series into the four numbers on the KPI
 * row, plus their change against the preceding slice of the same
 * length.
 *
 * Sums for counts, medians for the median — averaging a column of
 * medians would be a different (and wrong) statistic, and it is the
 * easiest mistake to make here.
 */

export type KpiValue = {
  kpi: Kpi;
  value: number;
  previous: number;
  changePercent: number | null;
  /** True when the change moved the way this metric wants. */
  isGood: boolean | null;
  /** 12 points, for the tile's sparkline. */
  spark: number[];
};

function sum(points: DailyPoint[], key: "events" | "sessions"): number {
  return points.reduce((total, point) => total + point[key], 0);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Down-samples any series to `count` points for a sparkline. Takes
 *  buckets rather than every nth point, so a spike cannot vanish
 *  between samples. */
function toSpark(values: number[], count = 12): number[] {
  if (values.length <= count) return values;
  const size = values.length / count;
  return Array.from({ length: count }, (_, i) => {
    const from = Math.floor(i * size);
    const to = Math.max(from + 1, Math.floor((i + 1) * size));
    const bucket = values.slice(from, to);
    return bucket.reduce((a, b) => a + b, 0) / bucket.length;
  });
}

function measure(points: DailyPoint[], id: string): number {
  switch (id) {
    case "events":
      return sum(points, "events");
    case "sessions":
      return sum(points, "sessions");
    case "medianSeconds":
      return median(points.map((p) => p.medianSeconds));
    case "eventsPerSession": {
      const sessions = sum(points, "sessions");
      return sessions === 0 ? 0 : sum(points, "events") / sessions;
    }
    default:
      return 0;
  }
}

function series(points: DailyPoint[], id: string): number[] {
  switch (id) {
    case "events":
      return points.map((p) => p.events);
    case "sessions":
      return points.map((p) => p.sessions);
    case "medianSeconds":
      return points.map((p) => p.medianSeconds);
    case "eventsPerSession":
      return points.map((p) => p.events / p.sessions);
    default:
      return [];
  }
}

export function computeKpis(
  kpis: Kpi[],
  current: DailyPoint[],
  previous: DailyPoint[]
): KpiValue[] {
  return kpis.map((kpi) => {
    const value = measure(current, kpi.id);
    const prev = measure(previous, kpi.id);
    const change = percentChange(value, prev);
    return {
      kpi,
      value,
      previous: prev,
      changePercent: change,
      isGood:
        change === null || change === 0
          ? null
          : kpi.goodDirection === "up"
            ? change > 0
            : change < 0,
      spark: toSpark(series(current, kpi.id)),
    };
  });
}
