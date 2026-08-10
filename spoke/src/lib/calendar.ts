/**
 * Dates, without `Date`.
 *
 * Every instant in this template is an integer day index counted from
 * `DAY_ZERO`, and nothing in `src/` constructs a `Date` — which is
 * asserted, not merely intended, by `scripts/check-bom.mjs`. The reason
 * is the one CONVENTIONS §7b gives for pinning the clock and then pins
 * the timezone as well: a build queue is a story about a fortnight, and
 * rendered in the reader's own timezone that story is a day out for
 * half the planet. An integer has no timezone to be wrong about.
 *
 * Zero runtime imports, so the checker can call this directly.
 */

/** Day 0. A Monday, deliberately — a workshop's week starts on one, and
 *  a rota that begins mid-week reads as an accident. */
export const DAY_ZERO = { year: 2027, month: 3, day: 1 };

/** The story is told from here. Every "today" on the site is this. */
export const TODAY = 0;

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
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeap(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export type CalendarDate = { year: number; month: number; day: number };

/**
 * Day index → calendar date.
 *
 * Walks both ways. Backwards is not hypothetical: a purchase order
 * raised six weeks ago is day −42, and the orders page prints how long
 * it has been outstanding. An earlier version of this clamped at zero
 * and every order looked as though it had been raised this morning —
 * which is the sort of thing that renders perfectly and is simply
 * untrue, and which the checker caught by asking for 18 January.
 */
export function dateOf(index: number): CalendarDate {
  let { year, month, day } = DAY_ZERO;
  let left = Math.round(index);

  while (left > 0) {
    const room = daysInMonth(year, month) - day;
    if (left <= room) {
      day += left;
      left = 0;
    } else {
      left -= room + 1;
      day = 1;
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  }

  while (left < 0) {
    // `day - 1` days are available before reaching the 1st of this
    // month; anything more steps into the previous one.
    const room = day - 1;
    if (-left <= room) {
      day += left;
      left = 0;
    } else {
      left += room + 1;
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      day = daysInMonth(year, month);
    }
  }

  return { year, month, day };
}

/** DAY_ZERO is a Monday, so the weekday is the index mod seven. */
export function weekday(index: number): string {
  return WEEKDAYS[((Math.round(index) % 7) + 7) % 7];
}

export function shortDate(index: number): string {
  const d = dateOf(index);
  return `${d.day} ${MONTHS[d.month - 1].slice(0, 3)}`;
}

export function longDate(index: number): string {
  const d = dateOf(index);
  return `${weekday(index)} ${d.day} ${MONTHS[d.month - 1]}`;
}

export function monthOf(index: number): string {
  const d = dateOf(index);
  return `${MONTHS[d.month - 1]} ${d.year}`;
}

/** "in 12 days" / "today" / "9 days ago". Relative to the pinned TODAY
 *  rather than to the machine's clock, for the same reason as the rest
 *  of this file. */
export function fromToday(index: number): string {
  const delta = Math.round(index) - TODAY;
  if (delta === 0) return "today";
  if (delta === 1) return "tomorrow";
  if (delta === -1) return "yesterday";
  return delta > 0 ? `in ${delta} days` : `${-delta} days ago`;
}

/** Whole weeks, rounded down, for lead times that are more legible as
 *  weeks than as a two-digit day count. */
export function inWeeks(days: number): string {
  const weeks = days / 7;
  if (weeks < 1) return `${days} days`;
  const rounded = Math.round(weeks * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} weeks`;
}
