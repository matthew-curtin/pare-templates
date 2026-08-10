import type { Glaze, Kiln, Piece, Program } from "../content/types";
import type { Load } from "./pack.ts";
import { fits, packKiln, tallestPossible } from "./pack.ts";

/**
 * The studio, simulated forward.
 *
 * ZERO RUNTIME IMPORTS beyond the packer, on purpose: `scripts/
 * check-load.mjs` imports this file with plain node — node strips the
 * types itself — so the checker asserts against the functions the site
 * actually calls rather than a copy of them (CONVENTIONS §8).
 *
 * There is no `Date` in here and there never should be. §7b says to pin
 * the clock and the timezone; this template never constructs a date at
 * all. Time is an integer day index counted from the Monday the studio's
 * fortnightly rota starts, so the same content produces the same
 * fortnight in every timezone and the checker cannot be flattered by the
 * machine it runs on. `site.ts` says what day 0 was called, for the
 * reader, and nothing computes with it.
 *
 * The one thing worth understanding before reading the rest: a firing
 * does not run because work is waiting for it. It runs because ENOUGH
 * work is waiting for it. A kiln costs the same empty as full, so every
 * kiln here carries a `minLoad` below which the studio will not light
 * it — and that single rule is where all the surprising waits come from.
 */

/** The rota repeats every fortnight. Weekly slots are listed twice. */
export const CYCLE_DAYS = 14;

/** Bisque is one programme and every kiln that bisques runs the same one. */
export const BISQUE = "bisque";

/** A kiln is opened the day after it fires. Nobody unpacks it hot. */
export const COOL_DAYS = 1;

/** Between coming out of the bisque and going on the glaze shelf. */
export const GLAZE_DAYS = 2;

/**
 * The studio's reference piece: a mug, 11cm across and 10cm tall.
 *
 * Every quote on the glaze page is this object put through the same
 * simulation the board runs, which is why the glazes can be compared at
 * all. A quote made any other way would be a different question.
 */
export const REFERENCE = { width: 11, depth: 11, height: 10 };

export type Lookup = {
  kiln(id: string): Kiln | undefined;
  program(id: string): Program | undefined;
  glaze(id: string): Glaze | undefined;
};

/** A firing the rota says will happen. */
export type Planned = {
  id: string;
  kilnId: string;
  programId: string;
  day: number;
};

/** What the simulation decided about a planned firing. */
export type Firing = Planned & {
  /**
   * `open` and `postponed` are different sentences and conflating them
   * would have flattered the studio. Open means nobody has made the work
   * yet — the simulation only knows about pots that exist today, so the
   * far end of the rota is honestly empty rather than in trouble.
   * Postponed means work IS waiting and there is not enough of it.
   */
  status: "loading" | "planned" | "postponed" | "open";
  load: Load;
  /** In shelving order. Empty when postponed. */
  pieces: string[];
  /** Offered, and turned away by a kiln that filled up first. */
  bumped: string[];
};

/**
 * Why a piece is not out yet.
 *
 * Seven answers, and they want completely different responses from
 * whoever reads them, which is the reason they are seven rather than a
 * number of days. `empty` is the one this site was built to be able to
 * say: your work is waiting because not enough OTHER people chose the
 * same firing.
 */
export type Reason =
  | "next"
  | "load"
  | "empty"
  | "calendar"
  | "size"
  | "drying"
  | "you"
  | "nothing";

export type Step = {
  firingId: string;
  kilnId: string;
  programId: string;
  day: number;
};

export type Track = {
  pieceId: string;
  steps: Step[];
  /** Firings that filled up without it. */
  bumped: string[];
  /** Firings it was waiting on that never lit. */
  stalled: string[];
  /** Day it can be taken off the collection shelf; null if never. */
  readyOn: number | null;
  reason: Reason;
};

export type Studio = {
  firings: Firing[];
  tracks: Map<string, Track>;
};

/** Day 0 is a Monday. */
const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function weekday(day: number): string {
  return WEEKDAYS[((day % 7) + 7) % 7];
}

export function shortWeekday(day: number): string {
  return weekday(day).slice(0, 3);
}

/**
 * How long a piece takes to dry.
 *
 * Greenware goes in the kiln bone dry or it comes out in pieces, and a
 * tall pot holds water in its base long after the rim is chalky. Five
 * days for anything, and another day for every 12cm of height — which
 * is a rule of thumb rather than physics, and is written as one on the
 * page rather than presented as a measurement.
 */
export function dryingDays(piece: { height: number }): number {
  return 5 + Math.floor(piece.height / 12);
}

export function dryOn(piece: Piece): number {
  return piece.madeOn + dryingDays(piece);
}

/** What this piece needs to happen next. */
export type Need =
  | { kind: "firing"; programId: string }
  | { kind: "member" }
  | { kind: "done" };

export function needOf(piece: Piece, look: Lookup): Need {
  if (piece.state === "collected") return { kind: "done" };
  if (piece.state === "greenware") return { kind: "firing", programId: BISQUE };
  if (piece.glazeId === null) return { kind: "member" };
  const glaze = look.glaze(piece.glazeId);
  if (!glaze) return { kind: "member" };
  return { kind: "firing", programId: glaze.programId };
}

/** Every firing the rota produces between two days, inclusive of both. */
export function plannedFirings(
  kilns: Kiln[],
  from: number,
  to: number,
): Planned[] {
  const out: Planned[] = [];
  for (let day = from; day <= to; day += 1) {
    const inCycle = ((day % CYCLE_DAYS) + CYCLE_DAYS) % CYCLE_DAYS;
    for (const kiln of kilns) {
      for (const slot of kiln.rota) {
        if (slot.day !== inCycle) continue;
        out.push({
          id: `${kiln.id}-${day}`,
          kilnId: kiln.id,
          programId: slot.programId,
          day,
        });
      }
    }
  }
  return out.sort((a, b) => a.day - b.day || a.kilnId.localeCompare(b.kilnId));
}

/**
 * The order the studio loads in, and the only fairness rule it has.
 *
 * Three keys, and the middle one is the one that surprises people:
 *
 *   1. Anything a full kiln turned away goes back in first. Nothing can
 *      be bumped forever.
 *   2. Then tallest first — because the first piece on a shelf sets that
 *      shelf's height, and starting tall means the short work fills in
 *      underneath instead of a tall pot arriving to find 9cm of air.
 *   3. Then whoever has been waiting longest.
 *
 * It is written out on the studio page in those words, because a queue
 * whose order nobody can explain is a queue everybody thinks is rigged.
 */
export function queueOrder(
  pieces: Piece[],
  bumps: Map<string, number>,
  availableOn: Map<string, number>,
): Piece[] {
  return [...pieces].sort((a, b) => {
    const bumpDiff = (bumps.get(b.id) ?? 0) - (bumps.get(a.id) ?? 0);
    if (bumpDiff !== 0) return bumpDiff;
    if (a.height !== b.height) return b.height - a.height;
    const waitDiff =
      (availableOn.get(a.id) ?? 0) - (availableOn.get(b.id) ?? 0);
    if (waitDiff !== 0) return waitDiff;
    return a.id.localeCompare(b.id);
  });
}

type Live = {
  piece: Piece;
  /** Day from which it can go into a kiln. */
  available: number;
  /** What it needs NOW. Mutates as the simulation advances it. */
  need: Need;
  /** What it needed when the fortnight began, which never changes. */
  initial: Need;
  track: Track;
};

/**
 * Walk the rota forward and load every firing on the way.
 *
 * Deterministic: same pieces, same rota, same fortnight, every time. No
 * randomness and no clock, which is what lets the checker assert the
 * site's claims rather than merely its arithmetic.
 */
export function simulate(
  pieces: Piece[],
  kilns: Kiln[],
  look: Lookup,
  today: number,
  horizon: number,
): Studio {
  const planned = plannedFirings(kilns, today, today + horizon);
  const bumps = new Map<string, number>();
  const live = new Map<string, Live>();

  for (const piece of pieces) {
    const need = needOf(piece, look);
    const track: Track = {
      pieceId: piece.id,
      steps: [],
      bumped: [],
      stalled: [],
      readyOn: null,
      reason: "calendar",
    };
    // Three different waits, and conflating them was the first bug in
    // this function. Greenware waits to be dry. A bisqued piece whose
    // member has CHOSEN a glaze still has to have it put on, which
    // happens at the glaze bench and takes a couple of days to come
    // round. A piece already glazed is ready now.
    live.set(piece.id, {
      piece,
      available:
        piece.state === "greenware"
          ? Math.max(today, dryOn(piece))
          : piece.state === "bisqued"
            ? today + GLAZE_DAYS
            : today,
      need,
      initial: need,
      track,
    });
  }

  const firings: Firing[] = [];

  for (const slot of planned) {
    const kiln = look.kiln(slot.kilnId);
    if (!kiln) continue;

    // `fits` belongs in the candidate filter, not further down. Without
    // it, Fen's 88cm standing form is a candidate for every bisque in
    // the studio forever, so every otherwise-empty firing reads as
    // "postponed for want of a load" rather than "nothing on it yet" —
    // one un-fireable pot made five weeks of rota look like a crisis.
    const candidates = [...live.values()]
      .filter(
        (l) =>
          l.need.kind === "firing" &&
          l.need.programId === slot.programId &&
          l.available <= slot.day &&
          fits(kiln, l.piece),
      )
      .map((l) => l.piece);

    const ordered = queueOrder(
      candidates,
      bumps,
      new Map([...live.values()].map((l) => [l.piece.id, l.available])),
    );
    const load = packKiln(kiln, ordered);
    const loadedIds = load.layers.flatMap((layer) =>
      layer.placements.map((p) => p.pieceId),
    );
    // Bumped means a kiln that COULD have taken it filled up first.
    // Something that never fitted was not turned away, it was never in
    // the running — that is a different sentence and a different fix,
    // and merging the two made a 54cm urn report as unlucky rather than
    // as too big for the kiln that happened to fire soonest.
    const bumpedIds = ordered
      .filter((p) => fits(kiln, p) && !loadedIds.includes(p.id))
      .map((p) => p.id);

    if (candidates.length === 0) {
      firings.push({ ...slot, status: "open", load, pieces: [], bumped: [] });
      continue;
    }

    // The rule the whole site is about. Under the threshold the studio
    // does not light it, nothing advances, and everybody who was on it
    // records that the firing they were waiting for never happened.
    if (load.load < kiln.minLoad) {
      // Same distinction as `bumpedIds` below: only work this kiln could
      // actually have taken was waiting on this firing. A 54cm urn is
      // not disappointed by a small kiln failing to light.
      for (const piece of ordered.filter((p) => fits(kiln, p))) {
        live.get(piece.id)?.track.stalled.push(slot.id);
      }
      firings.push({
        ...slot,
        status: "postponed",
        load,
        pieces: [],
        bumped: [],
      });
      continue;
    }

    for (const id of loadedIds) {
      const l = live.get(id);
      if (!l) continue;
      l.track.steps.push({
        firingId: slot.id,
        kilnId: slot.kilnId,
        programId: slot.programId,
        day: slot.day,
      });
      const out = slot.day + COOL_DAYS;

      if (slot.programId === BISQUE) {
        if (l.piece.glazeId === null) {
          l.need = { kind: "member" };
          l.available = out;
        } else {
          const glaze = look.glaze(l.piece.glazeId);
          l.need = glaze
            ? { kind: "firing", programId: glaze.programId }
            : { kind: "member" };
          l.available = out + GLAZE_DAYS;
        }
      } else {
        l.need = { kind: "done" };
        l.available = out;
        l.track.readyOn = out;
      }
    }

    for (const id of bumpedIds) {
      bumps.set(id, (bumps.get(id) ?? 0) + 1);
      live.get(id)?.track.bumped.push(slot.id);
    }

    firings.push({
      ...slot,
      status: slot.day - today <= 1 ? "loading" : "planned",
      load,
      pieces: loadedIds,
      bumped: bumpedIds,
    });
  }

  const tracks = new Map<string, Track>();
  for (const l of live.values()) {
    l.track.reason = reasonFor(l, kilns, look, today, firings);
    tracks.set(l.piece.id, l.track);
  }

  return { firings, tracks };
}

/**
 * Turn a piece's history through the simulation into one word.
 *
 * Order matters here and it is the order of things the studio can do
 * something about. "No kiln will take it" is a fact about the object.
 * "You have not glazed it" is a fact about the member. Everything after
 * that is a fact about the studio, and `empty` — a firing that never lit
 * for want of company — is the one the studio is trying to be honest
 * about rather than hide behind a date.
 */
function reasonFor(
  l: Live,
  kilns: Kiln[],
  look: Lookup,
  today: number,
  firings: Firing[],
): Reason {
  // The INITIAL need, not the one the simulation has advanced it to. A
  // green pot with no glaze chosen is waiting for a bisque today; that
  // it will also be waiting for its maker in a week's time is a
  // different sentence, and the queue is about this week.
  const need = l.initial;
  if (need.kind === "done") return "next";
  if (need.kind === "member") return "you";

  const runnable = kilns.filter(
    (k) => k.rota.some((s) => s.programId === need.programId) && fits(k, l.piece),
  );
  if (runnable.length === 0) return "nothing";

  // Drying comes BEFORE the two kiln answers, and the order was wrong
  // the first time. A pot that is still wet today is not being held up
  // by next week's under-loaded bisque; it is being held up by being
  // wet, and that is the sentence its maker needs.
  if (l.piece.state === "greenware" && dryOn(l.piece) > today) return "drying";

  // The soonest firing of this programme that actually lights.
  const soonest = firings.find(
    (f) => f.programId === need.programId && f.status !== "postponed",
  );

  // Size outranks the two kiln answers for the same reason drying does:
  // a 54cm urn is not unlucky, it is 54cm, and being told the kiln filled
  // up would send its maker to look at a queue it was never in.
  const soonestKiln = soonest ? kilns.find((k) => k.id === soonest.kilnId) : null;
  if (soonestKiln && !fits(soonestKiln, l.piece)) return "size";

  // Both of these outrank `next`, which is the second ordering mistake
  // this function made. A piece that sat through a firing that never lit
  // IS on the next one — a fortnight later — and answering "you're on
  // the next firing" hides the entire reason anybody is waiting.
  if (l.track.stalled.length > 0) return "empty";
  if (l.track.bumped.length > 0) return "load";

  if (soonest && soonest.pieces.includes(l.piece.id)) return "next";
  return "calendar";
}

/** The programme a piece is waiting on, or null if no kiln is involved. */
export function waitingFor(piece: Piece, look: Lookup): string | null {
  const need = needOf(piece, look);
  return need.kind === "firing" ? need.programId : null;
}

/** Everything that is not finished and not collected. */
export function onTheShelf(pieces: Piece[]): Piece[] {
  return pieces.filter((p) => p.state !== "collected");
}

/** What one firing costs to run, in pence. */
export function firingCost(kiln: Kiln, tariff: Record<string, number>): number {
  return Math.round(kiln.energy.perFiring * (tariff[kiln.energy.unit] ?? 0));
}

/** What it costs each piece in it. Infinity is the honest answer for none. */
export function costPerPiece(
  kiln: Kiln,
  tariff: Record<string, number>,
  count: number,
): number | null {
  if (count === 0) return null;
  return firingCost(kiln, tariff) / count;
}

/** The tallest thing the studio can fire at all, across every kiln. */
export function studioCeiling(kilns: Kiln[]): number {
  return Math.max(...kilns.map(tallestPossible));
}

/**
 * What choosing this glaze costs you, in days.
 *
 * Answered by putting the reference mug into the studio TODAY and
 * running the whole simulation again with it in. Nothing else would be
 * honest: a mug added to a firing can be the mug that tips it over its
 * threshold, so the answer genuinely depends on everybody else's work,
 * which is the point being made.
 *
 * The mug is BISQUED rather than green, and that is the whole design of
 * the question. Quoting from wet clay adds five days of drying and a
 * bisque to every glaze equally, which is five days of noise on top of
 * the one decision being priced — and it shrank the gap between an
 * electric glaze and a reduction one from twelve days to five, which is
 * to say it hid the answer. This asks the question a member actually
 * asks, standing at the glaze bench with a bisqued mug in their hand.
 */
export function quote(
  glazeId: string,
  pieces: Piece[],
  kilns: Kiln[],
  look: Lookup,
  today: number,
  horizon: number,
): Track | null {
  const mug: Piece = {
    id: "__quote",
    name: "A mug",
    memberId: "__quote",
    method: "thrown",
    ...REFERENCE,
    state: "bisqued",
    glazeId,
    madeOn: today,
  };
  const { tracks } = simulate([...pieces, mug], kilns, look, today, horizon);
  return tracks.get("__quote") ?? null;
}
