/**
 * Every content shape in one place.
 *
 * The domain types — what a record is, what an hour is, what a spot is —
 * live in `src/lib/schedule.ts` with the arithmetic that uses them, and
 * are re-exported here so a content file has one import. Everything
 * below is content the model does not need to know about: how a show
 * builds an hour, what the photographs are for, what the station says
 * about itself.
 *
 * Note the relative `./` imports with explicit `.ts` extensions, here
 * and throughout `src/content` and `src/lib`. That is what lets the
 * checkers in `scripts/` import these modules with plain node — node
 * strips the types itself, but it cannot resolve the `@/` alias, so the
 * alias is for components only (CONVENTIONS §8).
 */

export type {
  Absorber,
  Breach,
  Category,
  Delivery,
  ElementKind,
  Feasibility,
  Hour,
  HourStat,
  Lookup,
  OnAir,
  Placed,
  ScheduleElement,
  Spot,
  Track,
} from "../lib/schedule.ts";

/**
 * One position in a show's hour.
 *
 * A clock is radio's word for the template of an hour, and it is the
 * closest thing a station has to a design system: the shape is fixed and
 * the contents change. Music slots name a CATEGORY rather than a record,
 * because which record goes in is the scheduler's job — that is the
 * whole distinction between a format and a playlist.
 */
export type Slot =
  | { k: "music"; cat: string }
  | { k: "ident"; s: number; title: string; fixed?: boolean }
  /** Speech. Exactly one slot per hosted clock is `flex`: the host's
   *  back-announce, which is however long the hour needs it to be. */
  | { k: "link"; s: number; title: string; flex?: boolean }
  | { k: "spot" }
  | { k: "news"; s: number; title: string }
  | { k: "promo"; s: number; title: string }
  | { k: "network"; s: number; title: string };

export type ShowMode = "hosted" | "automated" | "network";

export type Show = {
  id: string;
  name: string;
  /** Whoever is in the chair. Initials only — an invented person does
   *  not get a real face, and on a staff page that means no photograph
   *  rather than a stock one (CONVENTIONS §6). */
  host: string;
  hosts?: string;
  mode: ShowMode;
  blurb: string;
  clock: Slot[];
};

/**
 * What is different about one particular hour.
 *
 * The clock says what shape the hour is; this says which underwriters
 * are in it and whether anything unusual has been dropped in. Keeping
 * the two apart is what stops the day from being twenty-four copies of
 * the same list with three fields changed.
 */
export type HourPlan = {
  h: number;
  showId: string;
  /** Filled into the clock's `spot` slots in order. Fewer refs than
   *  slots and the spare slots simply do not exist that hour. */
  spots: string[];
  /** A one-off: an interview, an outside broadcast, a school choir. */
  insert?: { after: number; kind: "feature" | "news" | "promo"; title: string; s: number };
  note?: string;
  draft?: boolean;
};

export type Shot = {
  file: string;
  alt: string;
  /** What this photograph is FOR. If it could be swapped for another
   *  picture of the same subject without anybody noticing, it is
   *  decoration and it should not ship (§6). */
  job: string;
  caption: string;
};

export type NavItem = { to: string; label: string; hint: string };
