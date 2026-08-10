import { DAY_ZERO, TODAY } from "../content/site.ts";
import { shortWeekday, weekday } from "./schedule.ts";

/**
 * Every number on the site becomes a string here.
 *
 * No `Date`, no `Intl`, no locale. A day is an integer offset from the
 * Monday the rota starts on, and the calendar label is arithmetic over
 * one small table — which is a two-month table because that is all the
 * fortnight the site shows can reach.
 */

const MONTHS = [
  { name: "May", length: 31 },
  { name: "June", length: 30 },
  { name: "July", length: 31 },
];

export function dateOf(day: number): { date: number; month: string } {
  let d = DAY_ZERO.date + day;
  for (const month of MONTHS) {
    if (d <= month.length) return { date: d, month: month.name };
    d -= month.length;
  }
  return { date: d, month: "later" };
}

/** "Thursday 22 May" */
export function longDate(day: number): string {
  const { date, month } = dateOf(day);
  return `${weekday(day)} ${date} ${month}`;
}

/** "Thu 22" */
export function shortDate(day: number): string {
  return `${shortWeekday(day)} ${dateOf(day).date}`;
}

/** "the 22nd" */
export function ordinal(day: number): string {
  const n = dateOf(day).date;
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** How far off it is, said the way a person says it. */
export function fromToday(day: number): string {
  const n = day - TODAY;
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n < 0) return `${-n} days ago`;
  if (n < 7) return `in ${n} days`;
  if (n < 14) return `in ${n} days`;
  return `in ${Math.round(n / 7)} weeks`;
}

export function days(n: number): string {
  return n === 1 ? "1 day" : `${n} days`;
}

/** Pence to pounds. £6.82, and £66 rather than £66.00. */
export function money(pence: number): string {
  const pounds = pence / 100;
  return pounds % 1 === 0 ? `£${pounds}` : `£${pounds.toFixed(2)}`;
}

export function percent(fraction: number, places = 0): string {
  return `${(fraction * 100).toFixed(places)}%`;
}

export function cm(n: number): string {
  return `${Math.round(n)}cm`;
}

/** "15 × 12 × 20cm" */
export function boxOf(p: { width: number; depth: number; height: number }): string {
  return `${p.width} × ${p.depth} × ${p.height}cm`;
}

/** Litres, to one place. A kiln's size is the only thing quoted this way. */
export function litres(cubicCm: number): string {
  return `${(cubicCm / 1000).toFixed(0)} litres`;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Title case for a sentence fragment that has to start one. */
export function sentence(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
