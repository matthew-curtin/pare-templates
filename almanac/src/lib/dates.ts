/**
 * Closing dates, which are the organising idea of this whole board.
 *
 * No runtime imports: the zone and the thresholds are passed in, so
 * `scripts/check-listings.mjs` can call this directly. See CONVENTIONS
 * §8.
 *
 * The one thing to hold on to: **a closing date is a calendar day, not
 * an instant.** "Closes on Friday" means the end of Friday wherever the
 * employer is, and every question this module answers — is it closed,
 * does it close today, how many days are left — is a question about
 * which day it is, not about how many hours have elapsed.
 *
 * Doing it the elapsed way is the classic bug and it is invisible until
 * it is embarrassing: at 09:20 on Wednesday, a deadline at the end of
 * Thursday is 38 hours away, which an elapsed test rounds to one day
 * and then calls "closes today". Comparing day keys in a fixed zone
 * cannot make that mistake.
 */

export type Closing =
  /** The date has passed. */
  | { kind: "closed"; daysAgo: number }
  /** Today is the last day. */
  | { kind: "today" }
  /** Within the warning window, and drawn in red. */
  | { kind: "soon"; daysLeft: number }
  /** Further off than that. */
  | { kind: "open"; daysLeft: number };

/** "2026-09-16" — the calendar day this instant falls on, in `zone`. */
export function dayKey(ms: number, zone: string): string {
  return new Date(ms).toLocaleDateString("en-CA", { timeZone: zone });
}

function keyToUtc(key: string): number {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Whole calendar days from one key to another. Negative if `to` is earlier. */
export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((keyToUtc(toKey) - keyToUtc(fromKey)) / 86_400_000);
}

export function closingState(
  closesKey: string,
  nowMs: number,
  zone: string,
  closingWithin: number,
): Closing {
  const days = daysBetween(dayKey(nowMs, zone), closesKey);
  if (days < 0) return { kind: "closed", daysAgo: -days };
  if (days === 0) return { kind: "today" };
  if (days <= closingWithin) return { kind: "soon", daysLeft: days };
  return { kind: "open", daysLeft: days };
}

export function isClosed(closesKey: string, nowMs: number, zone: string): boolean {
  return daysBetween(dayKey(nowMs, zone), closesKey) < 0;
}

/** Posted within the last `newFor` days — and never in the future. */
export function isNew(
  postedKey: string,
  nowMs: number,
  zone: string,
  newFor: number,
): boolean {
  const age = daysBetween(postedKey, dayKey(nowMs, zone));
  return age >= 0 && age <= newFor;
}

/* ---------- display ---------- */

/**
 * A date key names a day, not a moment, so it needs an instant before
 * it can be formatted. Midday UTC is that instant: far enough from
 * either boundary that no sane display zone can push it onto the day
 * before or the day after.
 */
function instantOf(key: string): Date {
  return new Date(`${key}T12:00:00Z`);
}

export function longDate(key: string, zone: string): string {
  return instantOf(key).toLocaleDateString("en-GB", {
    timeZone: zone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function shortDate(key: string, zone: string): string {
  return instantOf(key).toLocaleDateString("en-GB", {
    timeZone: zone,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * What the board prints in the closing column.
 *
 * "Today" and "tomorrow" are spelled out because a date on its own does
 * not tell you it is urgent — you have to know what today is to read
 * it, and by then you have stopped scanning.
 */
export function closingLabel(state: Closing, closesKey: string, zone: string): string {
  switch (state.kind) {
    case "closed":
      return state.daysAgo === 1
        ? "Closed yesterday"
        : `Closed ${shortDate(closesKey, zone)}`;
    case "today":
      return "Closes today";
    case "soon":
      return state.daysLeft === 1
        ? "Closes tomorrow"
        : `${state.daysLeft} days left`;
    case "open":
      return `Closes ${shortDate(closesKey, zone)}`;
  }
}

/** "Posted 3 days ago" / "Posted today". */
export function postedLabel(postedKey: string, nowMs: number, zone: string): string {
  const age = daysBetween(postedKey, dayKey(nowMs, zone));
  if (age <= 0) return "Posted today";
  if (age === 1) return "Posted yesterday";
  if (age < 14) return `Posted ${age} days ago`;
  return `Posted ${shortDate(postedKey, zone)}`;
}
