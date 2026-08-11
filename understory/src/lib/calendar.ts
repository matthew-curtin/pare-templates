/**
 * The year, as 52 integers.
 *
 * There is no `Date` anywhere in `src`, and `scripts/check-season.mjs`
 * asserts the absence rather than trusting it. A garden site is a story
 * in time (CONVENTIONS §7b) and a `new Date()` in a component means the
 * story is different in Auckland — the peak week lands on the wrong
 * side of a boundary, "this week" drifts, and the whole argument about
 * WHEN to come is quietly rendered against somebody else's clock.
 *
 * So a week is an integer 1–52 and every date on the site is derived
 * from it by arithmetic that has no timezone to be wrong about. The
 * checker runs under three of them and expects identical output.
 *
 * Zero imports, so the checker asserts the real module.
 */

/** The season the site is written against. Not a leap year, which is
 *  why `daysInMonth` needs no leap branch — the checker asserts that
 *  too, so changing the year fails loudly instead of quietly shifting
 *  every date in March by a day. */
export const YEAR = 2027;

/** Week 1 begins Monday 4 January 2027. Day-of-year, 1-indexed. */
const WEEK_ONE_DAY = 4;

export const WEEKS = 52;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export type CalendarDate = { month: number; day: number };

/** Day-of-year (1-indexed) → month and day. */
export function dateOfYearDay(yearDay: number): CalendarDate {
  let left = yearDay;
  for (let m = 0; m < 12; m += 1) {
    if (left <= DAYS_IN_MONTH[m]) return { month: m + 1, day: left };
    left -= DAYS_IN_MONTH[m];
  }
  // Day 365 is 31 December; anything past it is a bug in the caller, and
  // clamping silently is how a wrong week number becomes a plausible
  // date nobody questions.
  return { month: 12, day: 31 };
}

/** Weeks wrap. Week 53 is week 1; week 0 is week 52. Every window in
 *  the collection is circular — witch hazel opens in week 51 and closes
 *  in week 8 — so this is the only correct way to normalise one. */
export function normaliseWeek(week: number): number {
  return ((Math.round(week) - 1) % WEEKS + WEEKS) % WEEKS + 1;
}

/** The Monday a week begins, as a day-of-year. */
export function weekStartDay(week: number): number {
  return WEEK_ONE_DAY + (normaliseWeek(week) - 1) * 7;
}

export function weekStart(week: number): CalendarDate {
  return dateOfYearDay(weekStartDay(week));
}

export function weekEnd(week: number): CalendarDate {
  return dateOfYearDay(weekStartDay(week) + 6);
}

/** "15–21 March", or "29 March – 4 April" when the week straddles two. */
export function weekLabel(week: number): string {
  const a = weekStart(week);
  const b = weekEnd(week);
  if (a.month === b.month) {
    return `${a.day}–${b.day} ${MONTHS[a.month - 1]}`;
  }
  return `${a.day} ${MONTHS[a.month - 1]} – ${b.day} ${MONTHS[b.month - 1]}`;
}

/** "15–21 Mar" — for a rail with 52 of them on it. */
export function weekLabelShort(week: number): string {
  const a = weekStart(week);
  const b = weekEnd(week);
  if (a.month === b.month) return `${a.day}–${b.day} ${SHORT[a.month - 1]}`;
  return `${a.day} ${SHORT[a.month - 1]} – ${b.day} ${SHORT[b.month - 1]}`;
}

/** The month a week mostly sits in, by its midpoint rather than its
 *  first day — otherwise the week of 29 March to 4 April files as March
 *  and the year's month bands come out a week wide in the wrong place. */
export function monthOfWeek(week: number): number {
  return dateOfYearDay(weekStartDay(week) + 3).month;
}

export function monthName(month: number): string {
  return MONTHS[month - 1];
}

export function monthNameShort(month: number): string {
  return SHORT[month - 1];
}

/** Weeks whose midpoint falls in a given month. Used to band the year
 *  rail — never assume four, because most months get four and some get
 *  five and hardcoding it puts every label after March one column out. */
export function weeksInMonth(month: number): number[] {
  const out: number[] = [];
  for (let w = 1; w <= WEEKS; w += 1) if (monthOfWeek(w) === month) out.push(w);
  return out;
}

/** Distance between two weeks the short way round the year. Week 51 and
 *  week 2 are three weeks apart, not forty-nine. */
export function weeksBetween(a: number, b: number): number {
  const raw = Math.abs(normaliseWeek(a) - normaliseWeek(b));
  return Math.min(raw, WEEKS - raw);
}
