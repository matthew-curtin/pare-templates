/**
 * How every number on this site is written down.
 *
 * No runtime imports, so `scripts/check-sun.mjs` can assert the strings
 * the page actually prints rather than a reimplementation of them.
 *
 * Times are rounded to five minutes everywhere. The model is honest to
 * about two, and printing "13:37" would claim a precision the astronomy
 * does not have once a tree and a window frame are involved.
 */

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

export function clock(hour: number): string {
  const total = Math.round((hour * 60) / 5) * 5;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** For axes and dense tables, where am/pm is noise. */
export function clock24(hour: number): string {
  const total = Math.round((hour * 60) / 5) * 5;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function duration(hours: number): string {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m}`;
}

/** Compact enough to sit under a figure. */
export function hoursShort(hours: number): string {
  if (hours === 0) return "none";
  const total = Math.round(hours * 60);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function monthDay(month: number, day: number): string {
  return `${day} ${MONTHS[month - 1]}`;
}

export function monthName(month: number): string {
  return MONTHS[month - 1];
}

const MONTH_STARTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/** Day of the year back into a date, for the ends of a dark season. */
export function dateOfDoy(doy: number): string {
  let m = 11;
  while (m > 0 && MONTH_STARTS[m] >= doy) m -= 1;
  return `${doy - MONTH_STARTS[m]} ${MONTHS[m]}`;
}

export function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function sqft(n: number): string {
  return `${Math.round(n).toLocaleString("en-US")} sq ft`;
}

export function percent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

export function daysAgo(n: number): string {
  if (n === 0) return "today";
  if (n === 1) return "yesterday";
  if (n < 14) return `${n} days ago`;
  if (n < 60) return `${Math.round(n / 7)} weeks ago`;
  return `${Math.round(n / 30)} months ago`;
}
