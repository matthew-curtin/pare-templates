const MONTHS = [
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
];

/** 1,284 → "1,284" · 12,900 → "12.9K" · 4,200,000 → "4.2M".
 *  Stat tiles and axis ticks both use this, so a number never appears
 *  in two different shapes on one screen. */
export function compact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return trimZero(value / 1_000_000) + "M";
  if (abs >= 10_000) return trimZero(value / 1_000) + "K";
  return withCommas(Math.round(value));
}

function trimZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

export function withCommas(value: number): string {
  return Math.round(value).toLocaleString("en-GB");
}

/** 192 → "3m 12s". Session lengths, so minutes-and-seconds rather
 *  than a decimal. */
export function duration(seconds: number): string {
  const whole = Math.round(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

/** A signed percentage for deltas: 6.4 → "+6.4%". */
export function signedPercent(value: number): string {
  const rounded = Math.abs(value) < 0.05 ? 0 : value;
  return `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${Math.abs(rounded).toFixed(1)}%`;
}

export function ratio(value: number): string {
  return value.toFixed(1);
}

/** "2026-08-03" → "3 Aug". Deliberately not `toLocaleDateString`:
 *  that reads the runtime's locale, so the axis would silently change
 *  shape on a machine set to another region. */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** "2026-08-03" → "3 August 2026". */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const full = [
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
  return `${d} ${full[m - 1]} ${y}`;
}

/** "2026-08-03T21:58:00Z" → "3 Aug, 21:58". */
export function dateTime(iso: string): string {
  const [date, rest] = iso.split("T");
  return `${shortDate(date)}, ${rest.slice(0, 5)}`;
}

/** Percentage change from `before` to `after`. Returns null when
 *  there is nothing to compare against, so the tile can say so
 *  instead of rendering a meaningless ∞. */
export function percentChange(after: number, before: number): number | null {
  if (before === 0) return null;
  return ((after - before) / before) * 100;
}
