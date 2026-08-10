/** Every content shape on the site, in one place. CONVENTIONS §3. */

/**
 * What the ground is made of, which on this route matters more than how
 * far it is. Four classes, ordered here from fastest to slowest — the
 * order is load-bearing, because the colour ramp in the rail is ordered
 * the same way and the whole legibility of the profile depends on the
 * two agreeing.
 */
export type Terrain = "trail" | "rough" | "talus" | "bog";

/** Miles of each terrain class within one leg. Must sum to the leg's
 *  distance; `scripts/check-route.mjs` refuses to let them disagree. */
export type TerrainMix = Record<Terrain, number>;

export type WaterKind =
  /** Runs all season. Named creeks and springs that have never been
   *  reported dry within living memory. */
  | "reliable"
  /** Runs in early summer and can fail by mid-August, which is exactly
   *  when most people walk this. The interesting case. */
  | "seasonal"
  /** Rainwater, off a roof, into a tank. As reliable as the roof and no
   *  more, and it is shared with everyone else in the hut. */
  | "cistern"
  /** Nothing. Carry it. */
  | "none";

export type ShelterKind =
  /** A warden lives in it through the season and it sells nothing but
   *  a bunk. */
  | "staffed"
  /** Unlocked, unstaffed, free, first come. */
  | "open"
  /** Wooden platforms and a roof over the cooking area. No bunks. */
  | "tent"
  /** Not a shelter at all — a road, a gate, and a place to leave a car. */
  | "trailhead";

/**
 * A fixed point on the route. The whole design rests on these: you do
 * not choose where to stop, because between two of them there is
 * nowhere legal, flat or dry enough to lie down.
 */
export type Shelter = {
  id: string;
  slug: string;
  name: string;
  kind: ShelterKind;
  /** Feet. Must equal the elevation at this point in the profile of
   *  both adjoining legs — checked, not trusted. */
  elevation: number;
  /** Sleeping places under a roof. Zero for a tent platform, which is
   *  what the `:has([data-bunks="0"])` rule in globals.css keys on. */
  bunks: number;
  water: WaterKind;
  booking: "required" | "first-come";
  note: string;
};

/**
 * One leg: shelter to shelter, indivisible. There is no such thing as
 * half a leg on this route, which is the reason the planner can only
 * offer the splits it offers.
 */
export type Leg = {
  id: string;
  slug: string;
  /** Shelter id at the start and end. Consecutive legs must chain. */
  from: string;
  to: string;
  name: string;
  /** Statute miles. */
  distance: number;
  terrain: TerrainMix;
  /**
   * Elevation in feet at evenly spaced points along the leg, first
   * sample at the start shelter and last at the end one.
   *
   * Ascent and descent are DERIVED from this rather than stated
   * alongside it, so the drawn profile and the quoted climb cannot
   * disagree — the failure mode §7b is about, where every number is
   * defensible and the set of them is nonsense.
   */
  profile: number[];
  /** True when there is no drinkable water between the two shelters. */
  dry: boolean;
  /** Where you can bail out to a road, or null if you cannot. */
  escape: string | null;
  summary: string;
  detail: string[];
};

export type Report = {
  /** ISO date, in the pinned zone. */
  date: string;
  where: string;
  body: string;
  kind: "warning" | "note";
};

export type Access = {
  head: string;
  body: string;
};
