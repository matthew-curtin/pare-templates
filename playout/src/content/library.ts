import type { Category, Track } from "./types.ts";

/**
 * The music library and the wheels it turns on.
 *
 * A category is not a genre. It is a rotation speed: how often a record
 * in it should come round, and how long it has to stay away afterwards.
 * That is the only thing about a station's sound that is actually
 * scheduled — everything else is which records you put in which wheel.
 *
 * `restHours` and `artistSeparationMinutes` are the station's own rules,
 * and they are not aspirational: `/rules` works out whether the library
 * is big enough to keep each one and says so. A rule a library cannot
 * hold is worse than no rule, because the log breaks it silently.
 */
export const categories: Category[] = [
  {
    id: "a",
    name: "A rotation",
    restHours: 3,
    artistSeparationMinutes: 45,
  },
  {
    id: "b",
    name: "B rotation",
    restHours: 3,
    artistSeparationMinutes: 45,
  },
  {
    id: "local",
    name: "Cape Wren artists",
    restHours: 5,
    artistSeparationMinutes: 60,
  },
  {
    id: "library",
    name: "Library",
    restHours: 3.5,
    artistSeparationMinutes: 45,
  },
  {
    id: "night",
    name: "Overnight beds",
    restHours: 2,
    artistSeparationMinutes: 90,
  },
];

export const categoryNames: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.id, c.name]),
);

/**
 * Every record on the shelf.
 *
 * `ramp` is the seconds of intro before the vocal starts — the window a
 * host can talk over. It is the most useful number on a playout screen
 * and almost never on a listing anywhere else, which is exactly the kind
 * of thing this fleet likes to put on the page.
 *
 * Two things in here are deliberate and both show up in the log.
 *
 * Some artists appear in two different wheels — Marram has a library cut
 * and an overnight bed, The Kestrel Ridge Band has a local record and a
 * B-rotation one. A scheduler looking inside one category cannot see
 * either of them coming, which is why the artist rule in `schedule.ts`
 * is checked across the whole log rather than per wheel.
 *
 * And the Cape Wren shelf holds twelve records by TEN acts: The
 * Netmenders and Marge Antilla have two apiece. A wheel is smaller than
 * it looks the moment you count acts instead of records, and Local Cuts
 * is the hour where the difference becomes audible.
 */
export const tracks: Track[] = [
  // ── A rotation ─────────────────────────────────────────────────────
  { id: "a1", title: "Harbour Arm", artist: "Neon Ferry", seconds: 221, categoryId: "a", ramp: 12 },
  { id: "a2", title: "Slow Tide Coming", artist: "The Quiet Kind", seconds: 252, categoryId: "a", ramp: 18 },
  { id: "a3", title: "Signal Fires", artist: "Cassiopeia Blue", seconds: 208, categoryId: "a", ramp: 7 },
  { id: "a4", title: "Paper Boats", artist: "Ida Mott", seconds: 235, categoryId: "a", ramp: 22 },
  { id: "a5", title: "Fathom Line", artist: "Deep Water Radio", seconds: 242, categoryId: "a", ramp: 15 },
  { id: "a6", title: "Every Wire Hums", artist: "Static Orchard", seconds: 199, categoryId: "a", ramp: 9 },
  { id: "a7", title: "Northbound, Empty", artist: "Wren & Hollow", seconds: 266, categoryId: "a", ramp: 26 },
  { id: "a8", title: "Glasshouse", artist: "Marisol Vane", seconds: 227, categoryId: "a", ramp: 11 },
  { id: "a9", title: "Two Short Rings", artist: "The Tannery", seconds: 213, categoryId: "a", ramp: 14 },
  { id: "a10", title: "Sodium Light", artist: "Pale Motorway", seconds: 248, categoryId: "a", ramp: 20 },
  { id: "a11", title: "Keep the Lamp On", artist: "Bright Cargo", seconds: 204, categoryId: "a", ramp: 8 },
  { id: "a12", title: "Windward Side", artist: "Halcyon Freight", seconds: 232, categoryId: "a", ramp: 13 },
  { id: "a13", title: "The Ice Machine", artist: "Petra Lune", seconds: 217, categoryId: "a", ramp: 9 },
  { id: "a14", title: "Small Craft Warning", artist: "Bellwether Sound", seconds: 244, categoryId: "a", ramp: 21 },
  { id: "a15", title: "Carry the Rope", artist: "Odessa Kane", seconds: 209, categoryId: "a", ramp: 10 },
  { id: "a16", title: "Radio Silence, Nearly", artist: "The Blue Hours", seconds: 255, categoryId: "a", ramp: 24 },

  // ── B rotation ─────────────────────────────────────────────────────
  { id: "b1", title: "Weathervane", artist: "Alder & Sound", seconds: 259, categoryId: "b", ramp: 16 },
  { id: "b2", title: "Low Bridge", artist: "The Ferryman's Daughter", seconds: 232, categoryId: "b", ramp: 24 },
  { id: "b3", title: "Coin in the Meter", artist: "Halyard", seconds: 217, categoryId: "b", ramp: 10 },
  { id: "b4", title: "Second Bell", artist: "Ivy Meagher", seconds: 273, categoryId: "b", ramp: 30 },
  { id: "b5", title: "Bricks and Rain", artist: "Corvid Club", seconds: 224, categoryId: "b", ramp: 13 },
  { id: "b6", title: "The Long Way to the Water", artist: "Sable Coast", seconds: 301, categoryId: "b", ramp: 28 },
  { id: "b7", title: "Uncle's Van", artist: "Tin Whistle Union", seconds: 195, categoryId: "b", ramp: 6 },
  { id: "b8", title: "Marker Buoy", artist: "The Kestrel Ridge Band", seconds: 247, categoryId: "b", ramp: 19 },
  { id: "b9", title: "Dry Dock Sunday", artist: "The Pilot Boat", seconds: 238, categoryId: "b", ramp: 17 },
  { id: "b10", title: "Cold Store", artist: "Ferrous Lane", seconds: 241, categoryId: "b", ramp: 15 },
  { id: "b11", title: "Nine Miles of Fence", artist: "Wilder Faye", seconds: 228, categoryId: "b", ramp: 12 },
  { id: "b12", title: "Sunday Boots", artist: "The Grange Hall Trio", seconds: 263, categoryId: "b", ramp: 27 },
  { id: "b13", title: "Gulls on the Tin Roof", artist: "Anouk Perrin", seconds: 206, categoryId: "b", ramp: 8 },
  { id: "b14", title: "Two Stops Past", artist: "The Salt Line", seconds: 249, categoryId: "b", ramp: 20 },
  { id: "b15", title: "Everything Floats", artist: "Kite & Anchor", seconds: 233, categoryId: "b", ramp: 14 },
  { id: "b16", title: "The Slip at Dawn", artist: "Merrow", seconds: 271, categoryId: "b", ramp: 29 },

  // ── Cape Wren artists ──────────────────────────────────────────────
  { id: "l1", title: "Wren Point at Six", artist: "Sunday Bell Ringers", seconds: 211, categoryId: "local", ramp: 12 },
  { id: "l2", title: "Cannery Road", artist: "Otter Creek Four", seconds: 254, categoryId: "local", ramp: 21 },
  { id: "l3", title: "What the Bar Took", artist: "Marge Antilla", seconds: 228, categoryId: "local", ramp: 9 },
  { id: "l4", title: "Fog on the Slip", artist: "The Netmenders", seconds: 280, categoryId: "local", ramp: 33 },
  { id: "l5", title: "Salt in the Truck Bed", artist: "Hollis Dray", seconds: 206, categoryId: "local", ramp: 14 },
  { id: "l6", title: "Chowder Hall", artist: "The Kestrel Ridge Band", seconds: 239, categoryId: "local", ramp: 18 },
  { id: "l7", title: "Seiner's Waltz", artist: "June Okafor", seconds: 261, categoryId: "local", ramp: 25 },
  { id: "l8", title: "Off the Point", artist: "Broken Oar", seconds: 192, categoryId: "local", ramp: 5 },
  { id: "l9", title: "Sixteen Crab Pots", artist: "The Wednesday Shift", seconds: 224, categoryId: "local", ramp: 11 },
  { id: "l10", title: "The Wednesday Boat", artist: "The Netmenders", seconds: 218, categoryId: "local", ramp: 10 },
  { id: "l11", title: "Ellis and Front", artist: "Marge Antilla", seconds: 246, categoryId: "local", ramp: 17 },
  { id: "l12", title: "Everything the Tide Left", artist: "The Slipway Choir", seconds: 268, categoryId: "local", ramp: 25 },

  // ── Library ────────────────────────────────────────────────────────
  { id: "c1", title: "Ellis Street Reel", artist: "The Cormorants", seconds: 292, categoryId: "library", ramp: 20 },
  { id: "c2", title: "Blue Hour Freight", artist: "Ansel Ruiz", seconds: 318, categoryId: "library", ramp: 35 },
  { id: "c3", title: "Two Rivers Meeting", artist: "The Applecross Band", seconds: 276, categoryId: "library", ramp: 22 },
  { id: "c4", title: "Copper Kettle Drum", artist: "Vesper Row", seconds: 234, categoryId: "library", ramp: 15 },
  { id: "c5", title: "Silt", artist: "Nadia Kell", seconds: 344, categoryId: "library", ramp: 40 },
  { id: "c6", title: "The Longshore Song", artist: "Old Fitzwarren", seconds: 269, categoryId: "library", ramp: 26 },
  { id: "c7", title: "Under Lamplight", artist: "Marram", seconds: 251, categoryId: "library", ramp: 18 },
  { id: "c8", title: "Storm Glass", artist: "The Aster Line", seconds: 302, categoryId: "library", ramp: 30 },
  { id: "c9", title: "Clearing the Nets", artist: "Tamsin Boyle", seconds: 264, categoryId: "library", ramp: 23 },
  { id: "c10", title: "A Room Above the Bakery", artist: "Fenwick Green", seconds: 229, categoryId: "library", ramp: 16 },
  { id: "c11", title: "Trawler Yard", artist: "The Harrowgate Band", seconds: 287, categoryId: "library", ramp: 24 },
  { id: "c12", title: "Long Division", artist: "Esme Kovac", seconds: 255, categoryId: "library", ramp: 19 },
  { id: "c13", title: "A Kind of Weather", artist: "The Downstairs Room", seconds: 311, categoryId: "library", ramp: 33 },
  { id: "c14", title: "Beacon, Unlit", artist: "Farrow Vale", seconds: 243, categoryId: "library", ramp: 16 },
  { id: "c15", title: "The Pilot's Chair", artist: "Ilya Brandt", seconds: 298, categoryId: "library", ramp: 28 },
  { id: "c16", title: "Winter Ferry", artist: "The Coalhouse Singers", seconds: 266, categoryId: "library", ramp: 21 },
  { id: "c17", title: "Nettles", artist: "Wren Hallam", seconds: 224, categoryId: "library", ramp: 12 },
  { id: "c18", title: "Anchor Chain Blues", artist: "Solomon Reed", seconds: 335, categoryId: "library", ramp: 38 },
  { id: "c19", title: "Rope and Tar", artist: "The Marlin Street Band", seconds: 271, categoryId: "library", ramp: 23 },
  { id: "c20", title: "Half a Gale", artist: "Odile Fontaine", seconds: 259, categoryId: "library", ramp: 20 },
  { id: "c21", title: "The Old Cannery Floor", artist: "Bracken & Bay", seconds: 304, categoryId: "library", ramp: 31 },
  { id: "c22", title: "Sixty Fathoms Down", artist: "The Lightship Choir", seconds: 282, categoryId: "library", ramp: 26 },
  { id: "c23", title: "Handline", artist: "Casper Oyelaran", seconds: 237, categoryId: "library", ramp: 15 },
  { id: "c24", title: "Last Bus to the Point", artist: "Verity Shaw", seconds: 249, categoryId: "library", ramp: 18 },

  // ── Overnight beds ─────────────────────────────────────────────────
  { id: "n1", title: "Nightwatch", artist: "Low Beam", seconds: 492, categoryId: "night", ramp: 60 },
  { id: "n2", title: "Bell Buoy, Three Miles", artist: "Ambit", seconds: 456, categoryId: "night", ramp: 55 },
  { id: "n3", title: "Slack Water", artist: "Hollow Coast", seconds: 544, categoryId: "night", ramp: 72 },
  { id: "n4", title: "Tide Tables", artist: "Ellery Fen", seconds: 408, categoryId: "night", ramp: 48 },
  { id: "n5", title: "The Watch Below", artist: "Sound Mirror", seconds: 441, categoryId: "night", ramp: 50 },
  { id: "n6", title: "Lantern Room", artist: "Quill & Fathom", seconds: 515, categoryId: "night", ramp: 64 },
  { id: "n7", title: "Fog Signal", artist: "Marram", seconds: 419, categoryId: "night", ramp: 44 },
  { id: "n8", title: "Before the Boats Go Out", artist: "Selkie Wharf", seconds: 467, categoryId: "night", ramp: 58 },
];

export const trackById = new Map(tracks.map((t) => [t.id, t]));

export function trackOf(id: string): Track | undefined {
  return trackById.get(id);
}
