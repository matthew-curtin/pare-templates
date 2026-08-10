/** Every content shape in one place. CONVENTIONS §3. */

/** Which wall of the drawn plan the room's glass sits in. The plan is
 *  drawn with its own "up", and the home's `northOffset` says how far
 *  that up is rotated from true north — so a room's real compass bearing
 *  is derived rather than stated, and turning the whole house turns
 *  every room's light with it. */
export type Wall = "n" | "e" | "s" | "w";

/**
 * Something that stands between a window and the sun: a neighbouring
 * gable, a tree, the hill behind.
 *
 * `from` and `to` are true bearings in degrees and `elevation` is how
 * far up the sky it reaches from the window. A sun inside that arc and
 * below that elevation is a sun the room does not get, which is the
 * whole reason two identical rooms on the same street are not the same
 * room.
 */
export type Obstruction = {
  what: string;
  from: number;
  to: number;
  elevation: number;
};

export type Room = {
  id: string;
  name: string;
  /** Plan geometry in feet. Floor area is derived from it, never stated. */
  x: number;
  y: number;
  w: number;
  h: number;
  wall: Wall;
  /** Square feet of glass in that wall. */
  glazing: number;
  /** Rooms with no exterior wall at all — an interior bath, a hall. */
  interior?: boolean;
  obstruction?: Obstruction;
  note?: string;
};

export type Floor = {
  id: string;
  name: string;
  rooms: Room[];
};

/**
 * A photograph, with the hour it was taken. The hour is the point: every
 * listing photograph is taken in the one hour that flatters the room, so
 * this site prints the hour beside the picture.
 *
 * `lit` records whether the frame actually has direct sun in it, and it
 * is the load-bearing field. `scripts/check-sun.mjs` puts the stated
 * date and hour through the model and fails if the answer disagrees — so
 * a caption cannot drift away from the picture it is under, which is the
 * failure §6 warns about in both directions at once.
 */
export type Shot = {
  file: string;
  roomId: string;
  /** Clock time, 24h, e.g. 17.67 for 17:40. */
  hour: number;
  month: number;
  day: number;
  /** Is there direct sun in the frame? Asserted against the model. */
  lit: boolean;
  alt: string;
  /** What this photograph is FOR. §6: an image you could swap without
   *  anyone noticing is decoration. */
  job: string;
  caption: string;
};

export type Home = {
  slug: string;
  address: string;
  kind: string;
  /** Degrees the plan's "up" is rotated clockwise from true north. */
  northOffset: number;
  price: number;
  built: number;
  beds: number;
  baths: number;
  /** Listed at, in days before the pinned clock. */
  listedDaysAgo: number;
  /** The room the house is actually lived in. A survey that averages a
   *  bathroom against a living room answers a question nobody asked. */
  mainRoomId: string;
  blurb: string;
  /** The paragraph a normal listing would not print. */
  candid: string;
  works: string[];
  floors: Floor[];
  shots: Shot[];
};

export type SurveyNote = {
  head: string;
  body: string;
};
