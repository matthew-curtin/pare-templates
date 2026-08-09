import type { RoomId, Session } from "../content/types";
// Explicit `.ts`, and it has to be: this is the one RUNTIME import in
// the pure modules, and `scripts/check-schedule.mjs` imports this file
// directly so node has to resolve the specifier itself. Node ESM does
// not guess extensions. Type-only imports need no extension because
// they are erased before node ever sees them.
import { toMinutes } from "./time.ts";

/**
 * Placement and collision.
 *
 * The one idea this module exists to hold: **two sessions collide if
 * they share a minute**, and every question the site asks — where does
 * this block go, what am I giving up by choosing this, does my plan
 * work — is that same test applied to a different set.
 *
 * Pure, and taking the day's opening time as an argument rather than
 * reading the content, so `scripts/check-schedule.mjs` can call it.
 */

export interface Placed {
  session: Session;
  /** Minutes from midnight. */
  startMins: number;
  endMins: number;
  /** How long it runs. This is what the block's height is computed from. */
  minutes: number;
  /** Minutes from the top of the grid, i.e. from the day's opening time. */
  fromMinutes: number;
}

/** The only comparison that matters. Touching ends do not overlap:
 *  11:00–11:45 and 11:45–12:30 are back to back, not a clash. */
export function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function place(session: Session, dayOpensMins: number): Placed {
  const startMins = toMinutes(session.start);
  const endMins = toMinutes(session.end);
  return {
    session,
    startMins,
    endMins,
    minutes: endMins - startMins,
    fromMinutes: startMins - dayOpensMins,
  };
}

/** Everything on one day, placed, in start order. Total order — ties
 *  break on id — so the grid never reshuffles between renders. */
export function placeDay(
  sessions: Session[],
  day: number,
  dayOpens: string,
): Placed[] {
  const open = toMinutes(dayOpens);
  return sessions
    .filter((s) => s.day === day)
    .map((s) => place(s, open))
    .sort((a, b) =>
      a.startMins !== b.startMins
        ? a.startMins - b.startMins
        : a.session.id < b.session.id
          ? -1
          : 1,
    );
}

/** A plenary is in every room at once, so it has no column to sit in. */
export function isPlenary(session: Session): boolean {
  return session.roomId === null;
}

/** Breaks are grid furniture. They are drawn, but they are not a choice,
 *  so they never count as a collision and never appear in a plan. */
export function isChoosable(session: Session): boolean {
  return session.kind !== "break" && !session.cancelled;
}

export function inRoom(placed: Placed[], roomId: RoomId): Placed[] {
  return placed.filter((p) => p.session.roomId === roomId);
}

export type Phase = "past" | "live" | "upcoming" | "other-day";

/**
 * Where a session sits relative to the pinned clock.
 *
 * `nowMins` is null when the pinned now is not on this session's day,
 * which is the common case — two of the three days are always in the
 * past or the future, and neither should be drawn as though it were
 * being lived through.
 */
export function phaseOf(placed: Placed, nowMins: number | null): Phase {
  if (nowMins === null) return "other-day";
  if (nowMins >= placed.endMins) return "past";
  if (nowMins >= placed.startMins) return "live";
  return "upcoming";
}

/**
 * What this session costs you: everything choosable happening at the
 * same time, in another room.
 *
 * This is the number the front page leads with and the session page
 * prints under the title, because it is the honest answer to "should I
 * go to this" — and no conference site shows it.
 */
export function competingWith(session: Session, all: Session[]): Session[] {
  if (!isChoosable(session)) return [];
  const start = toMinutes(session.start);
  const end = toMinutes(session.end);
  return all
    .filter(
      (other) =>
        other.id !== session.id &&
        other.day === session.day &&
        isChoosable(other) &&
        !isPlenary(other) &&
        overlaps(start, end, toMinutes(other.start), toMinutes(other.end)),
    )
    .sort((a, b) => (a.id < b.id ? -1 : 1));
}

/**
 * Every pair in a set that collides.
 *
 * Used two ways: on a plan, to tell someone they have double-booked
 * themselves; and in the checker, to assert that no room and no speaker
 * is ever in two places at once.
 */
export function clashingPairs(sessions: Session[]): [Session, Session][] {
  const out: [Session, Session][] = [];
  const sorted = [...sessions].sort((a, b) =>
    a.day !== b.day
      ? a.day - b.day
      : toMinutes(a.start) - toMinutes(b.start) || (a.id < b.id ? -1 : 1),
  );
  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = i + 1; j < sorted.length; j += 1) {
      const a = sorted[i];
      const b = sorted[j];
      if (a.day !== b.day) continue;
      if (
        overlaps(
          toMinutes(a.start),
          toMinutes(a.end),
          toMinutes(b.start),
          toMinutes(b.end),
        )
      ) {
        out.push([a, b]);
      }
    }
  }
  return out;
}

/** The ids in a plan that collide with at least one other. A Set rather
 *  than a list of pairs because the UI's question is per-row: does THIS
 *  row have a problem. */
export function clashingIds(sessions: Session[]): Set<string> {
  const ids = new Set<string>();
  for (const [a, b] of clashingPairs(sessions)) {
    ids.add(a.id);
    ids.add(b.id);
  }
  return ids;
}

/** A plan, grouped into days and ordered within them. Days with nothing
 *  in them are dropped rather than rendered empty. */
export function planByDay(
  planIds: string[],
  all: Session[],
  dayNumbers: number[],
): { day: number; sessions: Session[] }[] {
  const chosen = all.filter((s) => planIds.includes(s.id) && isChoosable(s));
  return dayNumbers
    .map((day) => ({
      day,
      sessions: chosen
        .filter((s) => s.day === day)
        .sort((a, b) =>
          toMinutes(a.start) !== toMinutes(b.start)
            ? toMinutes(a.start) - toMinutes(b.start)
            : a.id < b.id
              ? -1
              : 1,
        ),
    }))
    .filter((d) => d.sessions.length > 0);
}

/** Total minutes of programme in a plan, ignoring the overlap — the
 *  honest figure is on the page beside the clash count, not instead
 *  of it. */
export function planMinutes(sessions: Session[]): number {
  return sessions.reduce(
    (sum, s) => sum + (toMinutes(s.end) - toMinutes(s.start)),
    0,
  );
}

/**
 * Two sessions in one room at one time is a data error, not a design
 * state. Same for one speaker in two rooms. Both are trivially easy to
 * introduce by hand-editing the content and completely invisible on the
 * page — the grid will cheerfully draw two blocks on top of each other.
 * The checker asserts both are empty.
 */
export function roomDoubleBookings(sessions: Session[]): [Session, Session][] {
  return clashingPairs(sessions.filter((s) => !isPlenary(s))).filter(
    ([a, b]) => a.roomId === b.roomId,
  );
}

export function speakerDoubleBookings(
  sessions: Session[],
): [Session, Session, string][] {
  const out: [Session, Session, string][] = [];
  for (const [a, b] of clashingPairs(sessions)) {
    for (const id of a.speakerIds) {
      if (b.speakerIds.includes(id)) out.push([a, b, id]);
    }
  }
  return out;
}
