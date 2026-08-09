/**
 * Turning instants and durations into the short strings a list can
 * carry. Everything takes `now` rather than reading the clock, so the
 * whole app is drawn against `site.now` and nothing drifts.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Every date and time is shown in the workspace's own timezone, not the
 * reader's.
 *
 * This is not what a real support tool does, and it is right here for
 * the same reason `site.now` is pinned. The conversations are a fixed
 * story: a firmware update lands overnight, someone writes in first
 * thing, a colleague adds a note mid-morning. Rendered in the reader's
 * timezone that story survives in London and falls apart everywhere
 * else — the same message reads 02:00 in California and 18:00 in
 * Tokyo, so a morning email arrives in the middle of the night and the
 * working day the content describes never happens.
 *
 * Thornbury Audio is in the UK, so the inbox is drawn in UK time.
 * Anyone building a real product on this wants the opposite: drop the
 * `timeZone` and it follows whoever is reading.
 */
const ZONE = "Europe/London";

/** "just now", "9m ago", "5h ago", "3d ago", then a date. */
export function relativeTime(iso: string, now: number): string {
  const delta = now - Date.parse(iso);
  if (delta < MINUTE) return "just now";
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)}m ago`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)}h ago`;
  if (delta < 7 * DAY) return `${Math.floor(delta / DAY)}d ago`;
  return shortDate(iso);
}

/**
 * A length of time, at one unit of precision below the largest.
 *
 * "1h 5m" rather than "1h", because the difference between those two
 * is the difference between finishing a reply and not.
 */
export function duration(ms: number): string {
  const total = Math.max(0, ms);
  if (total < MINUTE) return "under a minute";
  if (total < HOUR) return `${Math.floor(total / MINUTE)}m`;
  if (total < DAY) {
    const hours = Math.floor(total / HOUR);
    const minutes = Math.floor((total % HOUR) / MINUTE);
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  }
  const days = Math.floor(total / DAY);
  const hours = Math.floor((total % DAY) / HOUR);
  return hours === 0 ? `${days}d` : `${days}d ${hours}h`;
}

/** "12 Mar" */
export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: ZONE,
    day: "numeric",
    month: "short",
  });
}

/** "12 March 2026" */
export function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "Thu 12 Mar, 09:00" — the stamp on a message in a thread. */
export function messageStamp(iso: string): string {
  const day = new Date(iso).toLocaleDateString("en-GB", {
    timeZone: ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${day}, ${timeOf(iso)}`;
}

/** The calendar day an instant falls on, in the workspace's timezone. */
function dayKey(ms: number): string {
  // "en-CA" gives YYYY-MM-DD, which sorts and compares as a string.
  return new Date(ms).toLocaleDateString("en-CA", { timeZone: ZONE });
}

function dayAfter(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

/**
 * "tomorrow at 09:00", or a date when it is further out.
 *
 * Compares calendar days rather than elapsed time, which is not the
 * same question. Snoozing until tomorrow morning at 14:20 on a Thursday
 * lands 19 hours away — under a day — and an elapsed-time version
 * called that "today at 09:20", which is a sentence about Thursday
 * morning, five hours in the past.
 */
export function untilLabel(iso: string, now: number): string {
  const target = dayKey(Date.parse(iso));
  const today = dayKey(now);
  if (target === today) return `today at ${timeOf(iso)}`;
  if (target === dayAfter(today)) return `tomorrow at ${timeOf(iso)}`;
  return `${shortDate(iso)} at ${timeOf(iso)}`;
}
