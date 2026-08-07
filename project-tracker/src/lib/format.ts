import { site } from "@/content/site";

const DAY = 24 * 60 * 60 * 1000;

/** Parse a "YYYY-MM-DD" as a date at UTC midnight, so no timezone shifts it. */
function parseDay(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

/**
 * How long ago, in words, measured against `site.today` rather than the
 * real clock — see the note on that field for why.
 */
export function relativeDay(iso: string): string {
  const days = Math.round((parseDay(site.today) - parseDay(iso)) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 61) return "last month";
  return `${Math.floor(days / 30)} months ago`;
}

/** "6 Aug" — short, for dense rows. */
export function shortDay(iso: string): string {
  return new Date(parseDay(iso)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

/** "6 August 2026" — for the one place there is room for it. */
export function longDay(iso: string): string {
  return new Date(parseDay(iso)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Sortable. Used by the backlog table's "Updated" column. */
export function dayValue(iso: string): number {
  return parseDay(iso);
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
