/**
 * The arithmetic under the schedule.
 *
 * ZERO RUNTIME IMPORTS, on purpose. `scripts/check-log.mjs` imports this
 * file directly with plain node — node strips the types on its own — so
 * the checker asserts against the functions the console actually calls
 * rather than against a copy of them that drifts (CONVENTIONS §8).
 *
 * There is also no `Date` in here, anywhere, and there never should be.
 * §7b says to pin the clock and the timezone; this template goes one
 * step further and never constructs a date at all. Every time in the
 * model is an integer number of seconds from midnight at the start of
 * the broadcast day, so nothing can be shifted by the machine's zone,
 * nothing needs a formatter, and the checker gives the same answers in
 * Tokyo as it does in Oregon. The station's zone is stated in `site.ts`
 * for the reader's benefit and is never used for a computation.
 *
 * A broadcast day runs 06:00 to 06:00, so hours are numbered 6 through
 * 29 and 25 means one in the morning. Broadcasters count them that way
 * for a good reason: the overnight belongs to the day it started in.
 */

export const SECONDS_PER_HOUR = 3600;

/** The broadcast day starts here, and the hour numbers run on past 24. */
export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 30;

export type ElementKind =
  | "music"
  | "link"
  | "ident"
  | "spot"
  | "promo"
  | "news"
  | "feature"
  | "network";

/**
 * One thing that goes to air.
 *
 * `seconds` is absent on music because a record's length belongs to the
 * record, not to the slot it is in — restating it here would be two
 * numbers to keep in step, and the one in the log would silently win.
 */
export type ScheduleElement = {
  kind: ElementKind;
  ref?: string;
  title?: string;
  seconds?: number;
  /** Fixed elements cannot be moved or trimmed: a network junction, the
   *  news. They are what makes the hour a container rather than a list. */
  fixed?: boolean;
  /**
   * Speech a host can stretch or cut to whatever the hour needs.
   *
   * This one flag is the difference between the two halves of the day.
   * An hour containing one of these can absorb any remainder, so it
   * lands exactly; an hour of records can only add or drop a whole
   * record, so the best it can do is half of one.
   */
  elastic?: boolean;
  note?: string;
};

export type Hour = {
  h: number;
  showId: string;
  /** An hour still being built. It is in the log, it will go to air, and
   *  it does not yet add up — which is a state worth being able to see. */
  draft?: boolean;
  elements: ScheduleElement[];
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  seconds: number;
  categoryId: string;
  /** Seconds of intro you can talk over before the vocal starts. */
  ramp: number;
};

export type Category = {
  id: string;
  name: string;
  /** Hours that must pass before the same record may play again. */
  restHours: number;
  /** Minutes that must pass before the same artist may play again. */
  artistSeparationMinutes: number;
};

export type Spot = {
  id: string;
  underwriter: string;
  seconds: number;
  /** Weekday indices, Monday 0, inclusive. A spot in today's log when
   *  today is outside its flight has been mis-scheduled, and somebody is
   *  being read out for a thing that has already happened. */
  flightFrom: number;
  flightTo: number;
  contractedPerDay: number;
};

export type Placed = {
  hour: number;
  index: number;
  element: ScheduleElement;
  /** Seconds from the start of the broadcast day. */
  start: number;
  seconds: number;
};

/**
 * Where an element's length comes from.
 *
 * Nothing in the log states a duration it could look up. A record is as
 * long as the record; a spot is as long as the copy that was recorded.
 * Restating either in the log would be two numbers to keep in step, and
 * the wrong one would be the one on the page.
 */
export type Lookup = {
  track(id: string): Track | undefined;
  spot(id: string): Spot | undefined;
};

export type TrackLookup = Lookup;

/* ─────────────────────────── laying the hour out ─────────────────── */

/** How long an element runs. Music asks the record, a spot asks the
 *  contract, and everything else carries its own length — speech is the
 *  only thing here whose duration is genuinely a decision. */
export function durationOf(element: ScheduleElement, look: Lookup): number {
  if (element.kind === "music") {
    const found = element.ref === undefined ? undefined : look.track(element.ref);
    return found ? found.seconds : 0;
  }
  if (element.kind === "spot") {
    const found = element.ref === undefined ? undefined : look.spot(element.ref);
    return found ? found.seconds : 0;
  }
  return element.seconds ?? 0;
}

/** Every element of an hour, with the second it starts at. */
export function layHour(hour: Hour, track: TrackLookup): Placed[] {
  let cursor = hour.h * SECONDS_PER_HOUR;
  return hour.elements.map((element, index) => {
    const seconds = durationOf(element, track);
    const placed: Placed = { hour: hour.h, index, element, start: cursor, seconds };
    cursor += seconds;
    return placed;
  });
}

/** Every element of the whole day, in order. */
export function layDay(hours: Hour[], track: TrackLookup): Placed[] {
  return hours.flatMap((hour) => layHour(hour, track));
}

export function scheduled(hour: Hour, track: TrackLookup): number {
  return hour.elements.reduce((total, el) => total + durationOf(el, track), 0);
}

/**
 * How far past the junction this hour runs. Positive is long.
 *
 * This is the number the whole console is organised around: the top of
 * the hour is not a preference, it is where the network takes the
 * transmitter, so an hour that is 47 seconds long does not get 47 extra
 * seconds — something in it gets cut off mid-word.
 */
export function drift(hour: Hour, track: TrackLookup): number {
  return scheduled(hour, track) - SECONDS_PER_HOUR;
}

export type AbsorberKind = "speech" | "record" | "none";

export type Absorber = {
  kind: AbsorberKind;
  /** The size of the smallest correction available, in seconds. */
  step: number;
  label: string;
};

/**
 * What this hour can absorb a remainder WITH.
 *
 * This is the argument the site is built on, and it is the one thing
 * here that nobody guesses right. An hour lands by soaking up whatever
 * is left over, and the question is what you have to soak it up with. A
 * host talking is infinitely adjustable, so an hour with speech in it
 * lands to the second. An hour of nothing but records can only add or
 * drop a whole record, so the finest correction it owns is three or four
 * minutes — and half of that is the best it can be expected to do.
 *
 * Which means the cluttered hours are the accurate ones, and the hours
 * of pure music are the ones that run minutes long. Every station knows
 * this and no listener does.
 */
export function absorber(hour: Hour, look: Lookup): Absorber {
  if (hour.elements.some((el) => el.elastic === true)) {
    return { kind: "speech", step: 1, label: "the back-announce" };
  }
  const movable = hour.elements
    .filter((el) => el.fixed !== true)
    .map((el) => durationOf(el, look))
    .filter((s) => s > 0);
  if (movable.length === 0) {
    return { kind: "none", step: SECONDS_PER_HOUR, label: "nothing — the hour is fixed" };
  }
  return { kind: "record", step: Math.min(...movable), label: "a whole element" };
}

/** The smallest correction the hour can make. */
export function finestTrim(hour: Hour, look: Lookup): number {
  return absorber(hour, look).step;
}

/** Half the finest trim: what this hour can reasonably be expected to
 *  land inside without cutting anything short. */
export function tolerance(hour: Hour, look: Lookup): number {
  return finestTrim(hour, look) / 2;
}

export function landsClean(hour: Hour, track: TrackLookup): boolean {
  return Math.abs(drift(hour, track)) <= tolerance(hour, track);
}

/* ──────────────────────────── the clock ──────────────────────────── */

/** Seconds from the start of the broadcast day to the next junction. */
export function toJunction(second: number): number {
  const into = second % SECONDS_PER_HOUR;
  return into === 0 ? 0 : SECONDS_PER_HOUR - into;
}

export type OnAir = {
  placed: Placed;
  elapsed: number;
  remaining: number;
  /** 0–1 through the element. */
  progress: number;
};

/** What is going out at this second, and how far into it we are. */
export function onAirAt(day: Placed[], second: number): OnAir | null {
  for (const placed of day) {
    if (second >= placed.start && second < placed.start + placed.seconds) {
      const elapsed = second - placed.start;
      return {
        placed,
        elapsed,
        remaining: placed.seconds - elapsed,
        progress: placed.seconds === 0 ? 0 : elapsed / placed.seconds,
      };
    }
  }
  return null;
}

/** Everything still to come in the hour we are in, in order. */
export function restOfHour(day: Placed[], second: number): Placed[] {
  const hour = Math.floor(second / SECONDS_PER_HOUR);
  return day.filter((p) => p.hour === hour && p.start + p.seconds > second);
}

/* ───────────────────────── separation and rest ───────────────────── */

export type Play = {
  placed: Placed;
  track: Track;
};

export function musicPlays(day: Placed[], look: Lookup): Play[] {
  const plays: Play[] = [];
  for (const placed of day) {
    if (placed.element.kind !== "music" || placed.element.ref === undefined) continue;
    const found = look.track(placed.element.ref);
    if (found) plays.push({ placed, track: found });
  }
  return plays;
}

export type Breach = {
  kind: "rest" | "artist";
  /** The second play — the one that should not have happened yet. */
  at: Placed;
  previous: Placed;
  trackId: string;
  artist: string;
  /** Seconds between the two starts. */
  gap: number;
  /** Seconds the rule asked for. */
  required: number;
};

/**
 * Every place the day breaks its own rotation rules.
 *
 * Two rules, and they are different questions. REST is about a record:
 * the same song should not come round inside its category's rest. ARTIST
 * is about a voice: two different songs by the same act back to back is
 * the thing a listener actually notices, and it is the rule stations
 * break most often because the songs are in different categories and
 * nothing in a naive scheduler is looking across them.
 */
export function breaches(
  day: Placed[],
  look: Lookup,
  categories: Category[],
): Breach[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const lastTrack = new Map<string, Placed>();
  const lastArtist = new Map<string, { placed: Placed; trackId: string }>();
  const found: Breach[] = [];

  for (const play of musicPlays(day, look)) {
    const category = byId.get(play.track.categoryId);
    const artistKey = play.track.artist.toLowerCase();

    const previousPlay = lastTrack.get(play.track.id);
    if (category && previousPlay) {
      const gap = play.placed.start - previousPlay.start;
      const required = category.restHours * SECONDS_PER_HOUR;
      if (gap < required) {
        found.push({
          kind: "rest",
          at: play.placed,
          previous: previousPlay,
          trackId: play.track.id,
          artist: play.track.artist,
          gap,
          required,
        });
      }
    }

    const previousArtist = lastArtist.get(artistKey);
    if (category && previousArtist && previousArtist.trackId !== play.track.id) {
      const gap = play.placed.start - previousArtist.placed.start;
      const required = category.artistSeparationMinutes * 60;
      if (gap < required) {
        found.push({
          kind: "artist",
          at: play.placed,
          previous: previousArtist.placed,
          trackId: play.track.id,
          artist: play.track.artist,
          gap,
          required,
        });
      }
    }

    lastTrack.set(play.track.id, play.placed);
    lastArtist.set(artistKey, { placed: play.placed, trackId: play.track.id });
  }

  return found;
}

/** Whether a given element is one end of a breach, so a row can mark
 *  itself without the page carrying a second index. */
export function flagged(found: Breach[]): Set<string> {
  const keys = new Set<string>();
  for (const breach of found) keys.add(`${breach.at.hour}:${breach.at.index}`);
  return keys;
}

/* ───────────────────── what the library can support ──────────────── */

export type Feasibility = {
  category: Category;
  /** Records in the category. */
  size: number;
  /** Times the category is played across the broadcast day. */
  plays: number;
  /** Hours between this category's first play and its last. */
  windowHours: number;
  /**
   * The longest rest this category can actually keep.
   *
   * If a wheel of nine records is played twelve times inside a
   * three-hour window, it comes round every two hours however cleverly
   * you order it. No amount of scheduling buys a longer rest out of
   * that — the only two things that do are more records or fewer plays.
   *
   * The window matters and is the easy thing to get wrong: dividing by
   * the whole twenty-four hours flatters every category that only plays
   * in part of the day, which is all of them. An overnight bed played
   * eight times between ten and two has a four-hour window, not a
   * twenty-four-hour one, and the difference is a factor of six.
   */
  achievableRestHours: number;
  feasible: boolean;
};

export function feasibility(
  day: Placed[],
  look: Lookup,
  categories: Category[],
  library: Track[],
): Feasibility[] {
  const plays = musicPlays(day, look);
  return categories.map((category) => {
    const size = library.filter((t) => t.categoryId === category.id).length;
    const mine = plays.filter((p) => p.track.categoryId === category.id);
    const count = mine.length;

    // Fewer plays than records means nothing has to come round at all,
    // which is a different answer from a very long rest and should read
    // as one.
    let achievable = Infinity;
    let windowHours = 0;
    if (count > 1) {
      const starts = mine.map((p) => p.placed.start);
      windowHours =
        (Math.max(...starts) - Math.min(...starts)) / SECONDS_PER_HOUR;
      if (count > size) achievable = (windowHours * size) / count;
    }

    return {
      category,
      size,
      plays: count,
      windowHours,
      achievableRestHours: achievable,
      feasible: achievable >= category.restHours,
    };
  });
}

/**
 * Repeats a show cannot avoid.
 *
 * A wheel of nine records asked for fourteen in an hour hands you five
 * of them twice, and there is no ordering that does not. This is the
 * only place on the console where a number is bad news that nobody can
 * act on except by buying more records or cutting the show, which is
 * exactly why it is worth printing.
 */
export function forcedRepeats(slotsPerHour: number, categorySize: number): number {
  return Math.max(0, slotsPerHour - categorySize);
}

/** Hours since a record last went out, at a given second. Null if the
 *  day has not played it yet. */
export function lastPlayed(day: Placed[], trackId: string, before: number): Placed | null {
  let latest: Placed | null = null;
  for (const placed of day) {
    if (placed.element.kind !== "music" || placed.element.ref !== trackId) continue;
    if (placed.start >= before) continue;
    if (latest === null || placed.start > latest.start) latest = placed;
  }
  return latest;
}

/** The second a record becomes eligible again, given its category. */
export function eligibleAt(
  day: Placed[],
  trackId: string,
  category: Category,
  now: number,
): number | null {
  const previous = lastPlayed(day, trackId, now);
  if (previous === null) return null;
  return previous.start + category.restHours * SECONDS_PER_HOUR;
}

/* ──────────────────────────── underwriting ───────────────────────── */

export type Delivery = {
  spot: Spot;
  /** Airings in today's log. */
  aired: number;
  inFlight: boolean;
  /** Airings that should not have happened at all, because today is
   *  outside the flight the underwriter agreed. */
  outsideFlight: number;
  shortBy: number;
};

/**
 * What each underwriter is getting today, against what they bought.
 *
 * Deliberately a DAY rather than a week: a week would need six more logs
 * this app does not hold, so it would have to be told the answer in a
 * table somewhere — and a number that is told rather than counted is the
 * one that goes wrong. Counting today's log is a real measurement.
 */
export function delivery(day: Placed[], spots: Spot[], weekday: number): Delivery[] {
  return spots.map((spot) => {
    const aired = day.filter(
      (p) => p.element.kind === "spot" && p.element.ref === spot.id,
    ).length;
    const inFlight = weekday >= spot.flightFrom && weekday <= spot.flightTo;
    return {
      spot,
      aired,
      inFlight,
      outsideFlight: inFlight ? 0 : aired,
      shortBy: inFlight ? Math.max(0, spot.contractedPerDay - aired) : 0,
    };
  });
}

/* ─────────────────────────── the day, summed ─────────────────────── */

export type HourStat = {
  hour: Hour;
  scheduled: number;
  drift: number;
  finestTrim: number;
  tolerance: number;
  clean: boolean;
  elements: number;
};

export function hourStats(hours: Hour[], track: TrackLookup): HourStat[] {
  return hours.map((hour) => ({
    hour,
    scheduled: scheduled(hour, track),
    drift: drift(hour, track),
    finestTrim: finestTrim(hour, track),
    tolerance: tolerance(hour, track),
    clean: landsClean(hour, track),
    elements: hour.elements.length,
  }));
}

export type BandStat = {
  label: string;
  hours: number;
  meanElements: number;
  meanFinestTrim: number;
  meanAbsDrift: number;
  worstAbsDrift: number;
};

/**
 * The site's headline, computed rather than asserted.
 *
 * Split the day by how an hour is put together — hosted hours carry
 * idents, spots and speech; automated ones carry records and nothing
 * else — and compare what each lands within. The claim on the front page
 * is that the cluttered half lands closer, which is exactly backwards
 * from how anybody describes a "clean" hour of radio.
 */
export function bandStats(
  stats: HourStat[],
  bands: { label: string; holds: (hour: Hour) => boolean }[],
): BandStat[] {
  return bands.map(({ label, holds }) => {
    const subset = stats.filter((s) => holds(s.hour));
    return {
      label,
      hours: subset.length,
      meanElements: mean(subset.map((s) => s.elements)),
      meanFinestTrim: mean(subset.map((s) => s.finestTrim)),
      meanAbsDrift: mean(subset.map((s) => Math.abs(s.drift))),
      worstAbsDrift: Math.max(0, ...subset.map((s) => Math.abs(s.drift))),
    };
  });
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
