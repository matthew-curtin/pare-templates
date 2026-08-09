/**
 * Every content shape in one place.
 *
 * The two worth reading before anything else are `Session` and `Room`,
 * because between them they decide what the wallchart can draw. A
 * session is placed on the grid by three fields and nothing else — the
 * day it is on, the minute it starts, the minute it ends — so the grid
 * cannot disagree with the data about how long anything runs.
 */

export type RoomId = "foundry" | "boiler" | "drawing" | "yard";

export interface Room {
  id: RoomId;
  name: string;
  /** Where it is in the building, for the venue page and the block subtitle. */
  where: string;
  seats: number;
  /**
   * The token half of the room's colour. The tint behind a block is
   * derived from this with color-mix rather than being a second token,
   * so re-hueing a room is genuinely one edit.
   */
  tone: string;
  toneSoft: string;
}

/**
 * What kind of thing is in the slot.
 *
 * `break` is grid furniture — lunch, coffee, the walk between buildings.
 * It has no speaker and no page, and it exists in the data rather than
 * being drawn as a gap because a schedule with an unexplained
 * ninety-minute hole in it looks like missing data.
 */
export type SessionKind =
  | "keynote"
  | "talk"
  | "workshop"
  | "panel"
  | "break";

/**
 * `plenary` sessions occupy every room at once — the opening keynote is
 * not "in Foundry", it is the only thing happening. The grid draws them
 * full width, which is the honest picture: there is nothing to choose
 * between, so there is no column to choose.
 */
export interface Session {
  id: string;
  slug: string;
  title: string;
  kind: SessionKind;
  /** 1, 2 or 3. Indexes into `days` in site.ts. */
  day: number;
  /** "HH:MM", local to the pinned timezone. Minutes from midnight is derived. */
  start: string;
  end: string;
  /** Null for a plenary, which is in every room at once. */
  roomId: RoomId | null;
  speakerIds: string[];
  /** One or two sentences. This is what the grid block and the list show. */
  summary: string;
  /** Paragraphs, on the session page. Absent on breaks. */
  body?: string[];
  /** Workshops cap attendance; everything else is first come. */
  capacity?: number;
  /** Set when a capped session has gone. */
  soldOut?: boolean;
  /** Kept on the schedule struck through rather than removed — see the README. */
  cancelled?: string;
  /** Shown as a tag row on the session page and used by the topic filter. */
  topics: string[];
}

export interface Speaker {
  id: string;
  slug: string;
  name: string;
  /** What they do, one line. */
  role: string;
  org: string;
  place: string;
  /** Two or three sentences, on the speaker page. */
  bio: string[];
  /** Drawn as a monogram; there are no photographs in this template. */
  initials: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  blurb: string;
  includes: string[];
  /** Set on the tier we want the eye to land on. */
  highlight?: boolean;
  /** Some tiers are gone; a price list with nothing sold out is a price list nobody used. */
  soldOut?: boolean;
}

export interface VenueSpace {
  name: string;
  detail: string;
  step: boolean;
  loop: boolean;
}

export interface Question {
  q: string;
  a: string[];
}
