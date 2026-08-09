/**
 * Clock arithmetic for the wallchart.
 *
 * This module has no runtime imports on purpose — it takes the pinned
 * instant and the pinned zone as arguments rather than reading them —
 * so `scripts/check-schedule.mjs` can import the real thing rather than
 * a copy that drifts away from it. CONVENTIONS §8.
 *
 * Everything here works in MINUTES FROM MIDNIGHT, local to the pinned
 * zone. That is the only representation the grid needs: a block's
 * position is (start − day opens) and its height is (end − start), and
 * neither question involves a date. Dates enter exactly once, in
 * `minutesIntoDay`, to answer "is the pinned now on this day at all".
 */

/** "09:30" → 570. Returns NaN for anything that is not HH:MM. */
export function toMinutes(hhmm: string): number {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return NaN;
  return h * 60 + min;
}

/** 570 → "09:30". The inverse, used by the checker rather than the UI. */
export function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * 570 → "9:30". Twelve-hour, no meridiem.
 *
 * The meridiem is left off deliberately: inside a block the range
 * "1:40 – 2:25" is unambiguous because the rail beside it is labelled,
 * and printing AM/PM on every one of forty blocks is four hundred
 * characters of noise on a page whose whole argument is legibility.
 * `hourLabel` puts it back where it is actually load-bearing.
 */
export function timeLabel(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** 780 → "1 PM". Used on the hour rail, where the meridiem does work. */
export function hourLabel(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h} ${h24 < 12 ? "AM" : "PM"}`;
}

/** "11:00 – 11:45". An en dash, because it is a range. */
export function rangeLabel(startMins: number, endMins: number): string {
  return `${timeLabel(startMins)} – ${timeLabel(endMins)}`;
}

/** 90 → "1h 30m", 45 → "45m". */
export function durationLabel(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * The calendar day an instant falls on, in a fixed zone. "2026-10-15".
 *
 * Via Intl rather than by adding an offset, because an offset is wrong
 * twice a year and this conference is three weeks before the US clocks
 * change — close enough that a hand-rolled version would look correct
 * in every test written in October.
 */
export function dayKey(iso: string, zone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Minutes from midnight of `iso`, in `zone`, IF it falls on `date`.
 * Null otherwise — which is the whole point: "is now on this day, and
 * if so where" is one question, and splitting it into two invites the
 * caller to answer the second without asking the first.
 */
export function minutesIntoDay(
  iso: string,
  zone: string,
  date: string,
): number | null {
  if (dayKey(iso, zone) !== date) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  // en-GB renders midnight as 24:00 in some engines; normalise it.
  return (get("hour") % 24) * 60 + get("minute");
}

/** "2026-10-15" → "Thursday 15 October". Formatted at noon UTC so the
 *  date cannot slip a day in a zone west of the meridian. */
export function longDate(date: string, zone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00Z`));
}

/** "2026-10-15" → "Oct 15". */
export function shortDate(date: string, zone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00Z`));
}
