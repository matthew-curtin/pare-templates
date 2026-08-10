/**
 * Formatting. Also zero runtime imports, and also no `Date` — every
 * value here is an integer number of seconds, which is the whole reason
 * this template renders the same time in every timezone on earth.
 *
 * The broadcast day runs past midnight, so hour 25 is one in the
 * morning. Every function that turns an hour into something a person
 * reads takes the modulo; every function that COMPARES hours must not.
 */

const MINUS = "−";

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** A length: 3:42, or 1:04:30 once it passes the hour. */
export function duration(seconds: number): string {
  const whole = Math.round(seconds);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** A time of day: 14:51. */
export function clock(second: number): string {
  const h = Math.floor(second / 3600) % 24;
  const m = Math.floor((second % 3600) / 60);
  return `${pad(h)}:${pad(m)}`;
}

/** A time of day to the second, for the console readout. */
export function clockSeconds(second: number): string {
  const s = Math.floor(second) % 60;
  return `${clock(second)}:${pad(s)}`;
}

/** An hour of the broadcast day: 14:00, and 01:00 for hour 25. */
export function hourLabel(h: number): string {
  return `${pad(h % 24)}:00`;
}

/**
 * A drift: +0:47 or −4:12, with a real minus sign.
 *
 * Zero is "on the nose" rather than "0:00", because a schedule that
 * lands exactly is the one result worth saying out loud, and a row of
 * signed zeroes reads like a rounding artefact.
 */
export function signed(seconds: number): string {
  const whole = Math.round(seconds);
  if (whole === 0) return "on the nose";
  const sign = whole > 0 ? "+" : MINUS;
  return `${sign}${duration(Math.abs(whole))}`;
}

/** The same, but as a bare number for a table column. */
export function signedShort(seconds: number): string {
  const whole = Math.round(seconds);
  if (whole === 0) return "0:00";
  return `${whole > 0 ? "+" : MINUS}${duration(Math.abs(whole))}`;
}

/** A rest or a gap, in the units a scheduler thinks in. */
export function hours(value: number): string {
  if (!Number.isFinite(value)) return "never repeats";
  if (value < 1) return `${Math.round(value * 60)} min`;
  const whole = Math.floor(value);
  const minutes = Math.round((value - whole) * 60);
  if (minutes === 0) return `${whole} hr`;
  return `${whole} hr ${minutes} min`;
}

/** A count with its noun, so no component has to think about plurals. */
export function count(n: number, singular: string, plural?: string): string {
  return `${n} ${n === 1 ? singular : (plural ?? `${singular}s`)}`;
}

export { MINUS };
