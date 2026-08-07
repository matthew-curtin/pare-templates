import {
  closures,
  openingHours,
  roomCapacity,
  services,
  site,
} from "@/content/site";
import type { ServiceId } from "@/content/types";

/**
 * Which tables are free, when.
 *
 * Every answer here is DERIVED from the date, the service, the time and
 * the party size — never listed. A hand-written table of availability
 * for every date would be unmaintainable, would go stale the moment
 * anyone edited a service, and would run out at the end of whatever
 * range someone thought to fill in.
 *
 * It is also deterministic: the same request always gives the same
 * answer, so the page does not reshuffle when React re-renders it and a
 * reload does not silently free up the table you were about to lose.
 * There is no randomness anywhere in this file.
 */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

/** Parse "YYYY-MM-DD" at UTC noon, so no timezone can shift the day. */
function parseISO(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function weekdayOf(iso: string): string {
  return WEEKDAYS[parseISO(iso).getUTCDay()];
}

/** "Thursday 7 August" */
export function longDate(iso: string): string {
  const date = parseISO(iso);
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${
    MONTHS[date.getUTCMonth()]
  }`;
}

/** "Thu 7 Aug" — for the date strip, where space is tight. */
export function shortDate(iso: string): string {
  const date = parseISO(iso);
  return `${WEEKDAYS[date.getUTCDay()].slice(0, 3)} ${date.getUTCDate()} ${
    MONTHS[date.getUTCMonth()].slice(0, 3)
  }`;
}

/** A one-off closure — a private hire, or work on the building. */
export function closureFor(iso: string): string | null {
  return closures.find((entry) => entry.date === iso)?.reason ?? null;
}

/** Is the restaurant open at all for this service on this date? */
export function isOpen(iso: string, service: ServiceId): boolean {
  if (closureFor(iso)) return false;
  const day = openingHours.find(
    (entry) => entry.day === weekdayOf(iso),
  );
  if (!day) return false;
  return (service === "lunch" ? day.lunch : day.dinner) !== null;
}

export interface BookableDay {
  iso: string;
  /** Which of the two sittings run at all on this day. */
  openFor: ServiceId[];
}

/**
 * The booking window, starting from `site.today`.
 *
 * Includes closed days: the strip shows Monday and Tuesday greyed out
 * rather than skipping them, because a calendar that silently omits
 * dates makes people think they have mis-read it.
 */
export function bookingWindow(days = 21): BookableDay[] {
  const start = parseISO(site.today);
  const window: BookableDay[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + offset);
    const iso = toISO(date);
    window.push({
      iso,
      openFor: services
        .filter((service) => isOpen(iso, service.id))
        .map((service) => service.id),
    });
  }
  return window;
}

/**
 * A small deterministic hash. Not cryptographic and not trying to be —
 * it exists so that "is 19:30 free a week on Friday for six" has one
 * stable answer instead of a random one.
 */
function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0) % 100;
}

/** The times everyone wants, which is why they are the ones that go. */
const PRIME_TIMES = new Set(["19:00", "19:30", "20:00", "13:00"]);

export interface Slot {
  time: string;
  available: boolean;
}

/**
 * Which times are free, for this date, service and party size.
 *
 * The shape of the result is meant to feel like a real restaurant:
 * a Wednesday lunch is wide open, Saturday at 20:00 is gone, and a
 * table for seven is harder than a table for two everywhere.
 */
export function slotsFor(
  iso: string,
  service: ServiceId,
  party: number,
): Slot[] {
  if (!isOpen(iso, service)) return [];
  const definition = services.find((entry) => entry.id === service);
  if (!definition) return [];

  const weekday = weekdayOf(iso);
  const busyNight = weekday === "Friday" || weekday === "Saturday";

  return definition.slots.map((time) => {
    // Start generous, then take away for everything that makes a table
    // harder to find.
    let chance = 82;
    if (busyNight) chance -= 26;
    if (PRIME_TIMES.has(time)) chance -= 22;
    // Two and four are what the room is laid out for. Above that we are
    // moving furniture.
    if (party >= 5) chance -= 12;
    if (party >= 7) chance -= 16;

    // The party size is deliberately NOT part of the hash, only of the
    // threshold. Hashing it too would re-roll every slot independently
    // for each party size, so a table for six could come up free at a
    // time a table for two could not — which is nonsense, and obvious
    // to anyone who changes the number and watches the grid.
    // Keeping it out makes availability shrink monotonically instead.
    return {
      time,
      available: hash(`${iso}|${service}|${time}`) < chance,
    };
  });
}

/** Does this date have anything at all for this party? Drives the strip. */
export function hasAnySlot(iso: string, party: number): boolean {
  return services.some((service) =>
    slotsFor(iso, service.id, party).some((slot) => slot.available),
  );
}

export const partySizes = Array.from(
  { length: roomCapacity.maxPartyOnline - 1 },
  (_, index) => index + 2,
);

/**
 * A booking reference. Derived from the booking itself rather than
 * generated, so the confirmation page can be reloaded — or linked to —
 * and still show the same code.
 */
export function reference(
  iso: string,
  service: ServiceId,
  time: string,
  party: number,
): string {
  const seed = hash(`${iso}|${service}|${time}|${party}|ref`);
  const letters = "CPQRSTVWXZ";
  const digits = String(
    (hash(`${time}|${iso}|${party}`) * 37 + seed) % 10000,
  ).padStart(4, "0");
  return `${letters[seed % letters.length]}${
    letters[(seed >> 3) % letters.length]
  }-${digits}`;
}
