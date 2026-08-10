/**
 * Numbers and dates, formatted.
 *
 * No runtime imports, and the pinned zone arrives as an argument rather
 * than being read from content — so `scripts/check-route.mjs` can call
 * the real functions, and so a machine in another timezone gets the
 * same answers as this one. CONVENTIONS §8.
 */

/** 11.222 → "11h13". The site never prints a decimal hour, because
 *  "11.2 hours" is a number you compare and "11h13" is a time you
 *  imagine arriving at. */
export function hoursLabel(hours: number): string {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h${String(m).padStart(2, "0")}`;
}

/** For a running total, where minutes are noise. 87.47 → "87½ hours". */
export function hoursRough(hours: number): string {
  const whole = Math.floor(hours);
  const frac = hours - whole;
  const half = frac >= 0.25 && frac < 0.75 ? "½" : "";
  const up = frac >= 0.75 ? 1 : 0;
  return `${whole + up}${half} hours`;
}

export function feet(n: number): string {
  return `${Math.round(n).toLocaleString("en-US")} ft`;
}

export function miles(n: number): string {
  return `${n.toFixed(1)} mi`;
}

/** "2026-08-11" → "11 August". The year is dropped because every date
 *  on this site is inside one season. */
export function shortDate(iso: string, zone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: zone,
  }).format(new Date(`${iso}T12:00:00Z`));
}

export function longDate(iso: string, zone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: zone,
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** The calendar day an instant falls on, in the given zone, as
 *  "YYYY-MM-DD". */
export function dayKey(at: Date, zone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: zone,
  }).format(at);
  return parts;
}

/** Whole days between two "YYYY-MM-DD" keys. Deliberately a CALENDAR
 *  question rather than an elapsed one: a report filed at nine last
 *  night is "yesterday" at nine this morning, and an elapsed-hours test
 *  would call it "today" for another twelve hours. §7b. */
export function daysBetween(fromKey: string, toKey: string): number {
  const a = Date.parse(`${fromKey}T00:00:00Z`);
  const b = Date.parse(`${toKey}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

/** "yesterday", "3 days ago", "18 days ago". */
export function agoLabel(iso: string, now: Date, zone: string): string {
  const n = daysBetween(iso, dayKey(now, zone));
  if (n <= 0) return "today";
  if (n === 1) return "yesterday";
  return `${n} days ago`;
}

/** Where the pinned instant sits relative to the season window. */
export function seasonStatus(
  now: Date,
  zone: string,
  season: { opens: string; closes: string },
): { open: boolean; dayOf: number; length: number; remaining: number } {
  const today = dayKey(now, zone);
  const length = daysBetween(season.opens, season.closes);
  const dayOf = daysBetween(season.opens, today);
  return {
    open: dayOf >= 0 && dayOf <= length,
    dayOf,
    length,
    remaining: length - dayOf,
  };
}
