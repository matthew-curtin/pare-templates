import type { Item } from "@/lib/bom.ts";

/**
 * Every item Spaakwerk buys, makes or does. Invented, and tuned.
 *
 * The tuning is the work here, and CONVENTIONS §7b is the reason: a
 * plausible set of stock levels produces a board on which nothing is
 * ever short, or on which everything is, and both are useless for
 * judging the design. These numbers are arranged so that each state the
 * interface can show is reached, in the proportion it should be:
 *
 *   · exactly one part with no slack at all (the wound hub shell)
 *   · one part short with an order arriving four days late
 *   · one short with an order arriving nineteen days late
 *   · one short with nothing on order at all
 *   · the five parts nearest to stopping a Kade all under forty cents
 *   · the two most expensive parts nowhere near being the constraint
 *   · two items with stock EXACTLY equal to what the queue wants
 *
 * Every one of those is asserted in scripts/check-bom.mjs against this
 * file, so tuning it further fails loudly rather than quietly changing
 * what the site is arguing.
 *
 * OPERATIONS are modelled as made items with no children: powder
 * coating has a turnaround and an invoice but no stock and no parts, so
 * `buildDays` plus `processCost` says everything true about it. That
 * also means an operation can never be a constraint, which is correct —
 * you cannot run out of coating.
 */
export const items: Item[] = [
  // ── Products ──────────────────────────────────────────────────────
  {
    id: "kade",
    name: "Kade 3",
    kind: "made",
    unit: "ea",
    buildDays: 1,
    sellable: true,
    note: "Three-speed town bike, 28in wheels, hub gear, dynamo lighting, rear carrier. The one most people come for.",
  },
  {
    id: "vaart",
    name: "Vaart L",
    kind: "made",
    unit: "ea",
    buildDays: 2,
    sellable: true,
    note: "Long-tail cargo bike on a 26in rear wheel, with an ash deck and folding footboards. Two days on the stand rather than one, mostly because of the deck.",
  },

  // ── Framesets ─────────────────────────────────────────────────────
  { id: "fs-kade", name: "Frameset, Kade", kind: "made", unit: "ea", buildDays: 4 },
  { id: "fs-vaart", name: "Frameset, Vaart", kind: "made", unit: "ea", buildDays: 6 },
  {
    id: "frame-kade",
    name: "Frame, Kade",
    kind: "made",
    unit: "ea",
    buildDays: 3,
    note: "Brazed in the jig, filed, then over the river to be coated.",
  },
  { id: "frame-vaart", name: "Frame, Vaart", kind: "made", unit: "ea", buildDays: 5 },
  {
    id: "coat-kade",
    name: "Powder coating, Kade frame",
    kind: "made",
    unit: "job",
    buildDays: 9,
    processCost: 3800,
    supplierId: "vanacker",
    note: "An operation, not a part: it has a price and a turnaround and nothing to run out of.",
  },
  {
    id: "coat-vaart",
    name: "Powder coating, Vaart frame",
    kind: "made",
    unit: "job",
    buildDays: 11,
    processCost: 4600,
    supplierId: "vanacker",
  },
  { id: "headset", name: "Headset", kind: "made", unit: "ea", buildDays: 0 },

  // ── Wheels ────────────────────────────────────────────────────────
  { id: "ws-kade", name: "Wheelset, Kade", kind: "made", unit: "set", buildDays: 1 },
  { id: "ws-vaart", name: "Wheelset, Vaart", kind: "made", unit: "set", buildDays: 1 },
  {
    id: "wheel-front",
    name: "Front wheel, 28in dynamo",
    kind: "made",
    unit: "ea",
    buildDays: 1,
    sellable: true,
    note: "The same wheel on both bikes, and the longest chain in the building runs through it.",
  },
  {
    id: "wheel-rear-kade",
    name: "Rear wheel, 28in hub gear",
    kind: "made",
    unit: "ea",
    buildDays: 1,
    sellable: true,
  },
  {
    id: "wheel-rear-vaart",
    name: "Rear wheel, 26in cargo",
    kind: "made",
    unit: "ea",
    buildDays: 1,
    sellable: true,
  },
  {
    id: "hub-front",
    name: "Front dynamo hub",
    kind: "made",
    unit: "ea",
    buildDays: 1,
    note: "Two bearings pressed into a wound shell. Half an hour of work behind six and a half weeks of waiting.",
  },

  // ── Sub-assemblies ────────────────────────────────────────────────
  { id: "dt-kade", name: "Drivetrain, Kade", kind: "made", unit: "set", buildDays: 1 },
  { id: "dt-vaart", name: "Drivetrain, Vaart", kind: "made", unit: "set", buildDays: 1 },
  { id: "brakes-kade", name: "Brake set, Kade", kind: "made", unit: "set", buildDays: 0 },
  { id: "brakes-vaart", name: "Brake set, Vaart", kind: "made", unit: "set", buildDays: 0 },
  { id: "cockpit-kade", name: "Cockpit, Kade", kind: "made", unit: "set", buildDays: 0 },
  { id: "cockpit-vaart", name: "Cockpit, Vaart", kind: "made", unit: "set", buildDays: 0 },
  { id: "seating", name: "Seat assembly", kind: "made", unit: "set", buildDays: 0 },
  {
    id: "lighting",
    name: "Lighting loom",
    kind: "made",
    unit: "set",
    buildDays: 1,
    note: "One loom for both frames, cut to length on the bench. The offcut on a Kade costs less than a second part number would.",
  },
  { id: "guards-kade", name: "Mudguards, Kade", kind: "made", unit: "set", buildDays: 0 },
  { id: "guards-vaart", name: "Mudguards, Vaart", kind: "made", unit: "set", buildDays: 0 },
  { id: "carrier", name: "Rear carrier", kind: "made", unit: "ea", buildDays: 1 },
  {
    id: "deck",
    name: "Cargo deck",
    kind: "made",
    unit: "ea",
    buildDays: 2,
    note: "Seven ash slats, two straps and a pair of folding boards. The slowest thing on a Vaart that is not a frame.",
  },
  { id: "packing", name: "Packing set", kind: "made", unit: "set", buildDays: 0 },

  // ── Tube, machining, coating ──────────────────────────────────────
  { id: "tube-main-kade", name: "Main tube set, Kade", kind: "bought", unit: "set", cost: 11800, leadDays: 35, stock: 22, supplierId: "kamphuis" },
  { id: "tube-main-vaart", name: "Main tube set, Vaart", kind: "bought", unit: "set", cost: 16400, leadDays: 35, stock: 7, supplierId: "kamphuis" },
  { id: "tube-rear-kade", name: "Rear triangle set, Kade", kind: "bought", unit: "set", cost: 6200, leadDays: 35, stock: 24, supplierId: "kamphuis" },
  { id: "tube-tail-vaart", name: "Tail and rear set, Vaart", kind: "bought", unit: "set", cost: 9600, leadDays: 35, stock: 9, supplierId: "kamphuis" },
  { id: "dropout", name: "Dropout, forged", kind: "bought", unit: "ea", cost: 1450, leadDays: 21, stock: 96, supplierId: "stellinga" },
  { id: "head-tube", name: "Head tube, machined", kind: "bought", unit: "ea", cost: 1980, leadDays: 21, stock: 41, supplierId: "stellinga" },
  { id: "bb-shell", name: "Bottom bracket shell", kind: "bought", unit: "ea", cost: 1640, leadDays: 21, stock: 38, supplierId: "stellinga" },
  { id: "braze-rod", name: "Silver brazing rod", kind: "bought", unit: "m", cost: 310, leadDays: 14, stock: 140, supplierId: "noordkant" },
  { id: "flux", name: "Brazing flux", kind: "bought", unit: "kg", cost: 2400, leadDays: 14, stock: 3.4, supplierId: "noordkant" },
  { id: "decal-set", name: "Decal set", kind: "bought", unit: "set", cost: 420, leadDays: 10, stock: 60, supplierId: "noordkant" },
  { id: "fork-28", name: "Fork, 28in unicrown", kind: "bought", unit: "ea", cost: 7200, leadDays: 21, stock: 17, supplierId: "noordkant" },
  { id: "fork-vaart", name: "Fork, cargo twin-plate", kind: "bought", unit: "ea", cost: 8800, leadDays: 28, stock: 9, supplierId: "noordkant" },

  // ── Headset ───────────────────────────────────────────────────────
  { id: "hs-cup", name: "Headset cup", kind: "bought", unit: "ea", cost: 640, leadDays: 10, stock: 88, supplierId: "noordkant" },
  { id: "bearing-hs", name: "Headset bearing, 41.5mm", kind: "bought", unit: "ea", cost: 410, leadDays: 10, stock: 74, supplierId: "noordkant" },
  { id: "crown-race", name: "Crown race", kind: "bought", unit: "ea", cost: 360, leadDays: 10, stock: 44, supplierId: "noordkant" },
  { id: "hs-topcap", name: "Top cap and bolt", kind: "bought", unit: "ea", cost: 290, leadDays: 10, stock: 51, supplierId: "noordkant" },
  { id: "hs-spacer", name: "Spacer, 10mm", kind: "bought", unit: "ea", cost: 85, leadDays: 10, stock: 300, supplierId: "noordkant" },

  // ── Wheel parts ───────────────────────────────────────────────────
  { id: "rim-28", name: "Rim, 28in double wall", kind: "bought", unit: "ea", cost: 3150, leadDays: 12, stock: 46, supplierId: "bergen" },
  { id: "rim-26", name: "Rim, 26in heavy duty", kind: "bought", unit: "ea", cost: 3690, leadDays: 12, stock: 21, supplierId: "bergen" },
  { id: "spoke-292", name: "Spoke, 292mm", kind: "bought", unit: "ea", cost: 38, leadDays: 12, stock: 940, supplierId: "bergen" },
  { id: "spoke-264", name: "Spoke, 264mm", kind: "bought", unit: "ea", cost: 38, leadDays: 12, stock: 512, supplierId: "bergen" },
  {
    id: "nipple",
    name: "Brass nipple, 12mm",
    kind: "bought",
    unit: "ea",
    cost: 11,
    leadDays: 12,
    stock: 812,
    supplierId: "bergen",
    note: "Sixty-four in every bike we make, and the cheapest line on the whole account.",
  },
  { id: "rim-tape", name: "Rim tape", kind: "bought", unit: "ea", cost: 140, leadDays: 12, stock: 90, supplierId: "bergen" },
  { id: "tyre-28", name: "Tyre, 28 x 1.75", kind: "bought", unit: "ea", cost: 1890, leadDays: 10, stock: 58, supplierId: "noordkant" },
  { id: "tyre-26", name: "Tyre, 26 x 2.15", kind: "bought", unit: "ea", cost: 2450, leadDays: 10, stock: 26, supplierId: "noordkant" },
  { id: "tube-28", name: "Inner tube, 28in", kind: "bought", unit: "ea", cost: 480, leadDays: 10, stock: 74, supplierId: "noordkant" },
  { id: "tube-26", name: "Inner tube, 26in", kind: "bought", unit: "ea", cost: 540, leadDays: 10, stock: 30, supplierId: "noordkant" },
  { id: "axle-nut", name: "Axle nut, M10", kind: "bought", unit: "ea", cost: 65, leadDays: 4, stock: 68, supplierId: "boutenmoer" },
  {
    id: "hub-shell-dyn",
    name: "Dynamo hub shell, wound",
    kind: "bought",
    unit: "ea",
    cost: 5400,
    leadDays: 45,
    stock: 17,
    supplierId: "wikkelwerk",
    note: "Six and a half weeks, wound by one person in Delft. The only part in the building with no slack.",
  },
  { id: "bearing-6001", name: "Cartridge bearing, 6001", kind: "bought", unit: "ea", cost: 220, leadDays: 10, stock: 40, supplierId: "noordkant" },
  {
    id: "hub-rear-gear",
    name: "Hub gear, 7-speed",
    kind: "bought",
    unit: "ea",
    cost: 18200,
    leadDays: 28,
    stock: 19,
    supplierId: "noordkant",
    note: "The most expensive line we buy, and it has never once been the thing that stopped a build.",
  },
  { id: "hub-rear-cargo", name: "Rear hub, cargo", kind: "bought", unit: "ea", cost: 4800, leadDays: 21, stock: 14, supplierId: "noordkant" },

  // ── Brakes ────────────────────────────────────────────────────────
  { id: "brake-lever", name: "Brake lever", kind: "bought", unit: "ea", cost: 1240, leadDays: 10, stock: 34, supplierId: "noordkant" },
  { id: "roller-brake", name: "Roller brake unit", kind: "bought", unit: "ea", cost: 3400, leadDays: 10, stock: 40, supplierId: "noordkant" },
  { id: "brake-cable", name: "Inner cable", kind: "bought", unit: "ea", cost: 120, leadDays: 10, stock: 190, supplierId: "noordkant" },
  { id: "brake-housing", name: "Outer housing", kind: "bought", unit: "m", cost: 240, leadDays: 10, stock: 96, supplierId: "noordkant" },
  { id: "cable-ferrule", name: "Cable ferrule", kind: "bought", unit: "ea", cost: 9, leadDays: 4, stock: 96, supplierId: "boutenmoer" },

  // ── Drivetrain ────────────────────────────────────────────────────
  { id: "crankset", name: "Crankset, 38T", kind: "bought", unit: "ea", cost: 5400, leadDays: 14, stock: 26, supplierId: "noordkant" },
  { id: "bb-cartridge", name: "Bottom bracket cartridge", kind: "bought", unit: "ea", cost: 2100, leadDays: 14, stock: 31, supplierId: "noordkant" },
  { id: "chain", name: "Chain, 1/2 x 1/8", kind: "bought", unit: "ea", cost: 1460, leadDays: 10, stock: 54, supplierId: "noordkant" },
  { id: "sprocket", name: "Sprocket, 19T", kind: "bought", unit: "ea", cost: 780, leadDays: 10, stock: 61, supplierId: "noordkant" },
  { id: "chain-guard", name: "Chain guard", kind: "bought", unit: "ea", cost: 1620, leadDays: 14, stock: 29, supplierId: "noordkant" },
  { id: "shifter", name: "Twist shifter and cable", kind: "bought", unit: "ea", cost: 2800, leadDays: 14, stock: 22, supplierId: "noordkant" },
  { id: "tensioner", name: "Chain tensioner", kind: "bought", unit: "ea", cost: 1200, leadDays: 10, stock: 20, supplierId: "noordkant" },

  // ── Contact points ────────────────────────────────────────────────
  { id: "bar-kade", name: "Handlebar, swept", kind: "bought", unit: "ea", cost: 1950, leadDays: 10, stock: 30, supplierId: "noordkant" },
  { id: "bar-vaart", name: "Handlebar, cargo", kind: "bought", unit: "ea", cost: 2300, leadDays: 10, stock: 12, supplierId: "noordkant" },
  { id: "stem", name: "Stem, 90mm", kind: "bought", unit: "ea", cost: 1780, leadDays: 10, stock: 37, supplierId: "noordkant" },
  { id: "grip", name: "Grip, cork", kind: "bought", unit: "ea", cost: 520, leadDays: 10, stock: 84, supplierId: "noordkant" },
  { id: "bell", name: "Bell", kind: "bought", unit: "ea", cost: 460, leadDays: 10, stock: 70, supplierId: "noordkant" },
  { id: "saddle", name: "Saddle, sprung", kind: "bought", unit: "ea", cost: 3200, leadDays: 14, stock: 33, supplierId: "noordkant" },
  { id: "seatpost", name: "Seatpost, 27.2", kind: "bought", unit: "ea", cost: 1420, leadDays: 10, stock: 44, supplierId: "noordkant" },
  { id: "seat-clamp", name: "Seat clamp", kind: "bought", unit: "ea", cost: 540, leadDays: 10, stock: 52, supplierId: "noordkant" },

  // ── Lighting ──────────────────────────────────────────────────────
  { id: "light-front", name: "Front lamp, dynamo", kind: "bought", unit: "ea", cost: 2600, leadDays: 24, stock: 26, supplierId: "elektrolicht" },
  { id: "light-rear", name: "Rear lamp, dynamo", kind: "bought", unit: "ea", cost: 1280, leadDays: 24, stock: 31, supplierId: "elektrolicht" },
  { id: "loom-wire", name: "Loom wire, twin", kind: "bought", unit: "m", cost: 95, leadDays: 24, stock: 220, supplierId: "elektrolicht" },
  { id: "spade", name: "Spade connector", kind: "bought", unit: "ea", cost: 9, leadDays: 4, stock: 84, supplierId: "boutenmoer" },
  { id: "cable-tie", name: "Cable tie, 200mm", kind: "bought", unit: "ea", cost: 3, leadDays: 4, stock: 700, supplierId: "boutenmoer" },

  // ── Mudguards, carrier, deck ──────────────────────────────────────
  { id: "guard-28-front", name: "Mudguard, 28in front", kind: "bought", unit: "ea", cost: 1140, leadDays: 10, stock: 34, supplierId: "noordkant" },
  { id: "guard-28-rear", name: "Mudguard, 28in rear", kind: "bought", unit: "ea", cost: 1380, leadDays: 10, stock: 31, supplierId: "noordkant" },
  { id: "guard-26-rear", name: "Mudguard, 26in rear", kind: "bought", unit: "ea", cost: 1490, leadDays: 10, stock: 15, supplierId: "noordkant" },
  { id: "guard-stay", name: "Mudguard stay", kind: "bought", unit: "ea", cost: 210, leadDays: 10, stock: 150, supplierId: "noordkant" },
  { id: "rack-tube", name: "Carrier tube set", kind: "bought", unit: "set", cost: 2200, leadDays: 21, stock: 28, supplierId: "stellinga" },
  { id: "deck-slat", name: "Deck slat, ash", kind: "bought", unit: "ea", cost: 490, leadDays: 16, stock: 38, supplierId: "houtwerk" },
  { id: "deck-strap", name: "Deck strap", kind: "bought", unit: "ea", cost: 680, leadDays: 16, stock: 14, supplierId: "houtwerk" },
  { id: "footboard", name: "Footboard, folding", kind: "bought", unit: "ea", cost: 3400, leadDays: 21, stock: 14, supplierId: "stellinga" },

  // ── Fasteners ─────────────────────────────────────────────────────
  {
    id: "bolt-m5x16",
    name: "Bolt, M5 x 16",
    kind: "bought",
    unit: "ea",
    cost: 14,
    leadDays: 4,
    stock: 300,
    supplierId: "boutenmoer",
    note: "In three assemblies on a Kade and three on a Vaart, which is why it is the part most people are surprised to find they have run out of.",
  },
  { id: "bolt-m6x20", name: "Bolt, M6 x 20", kind: "bought", unit: "ea", cost: 19, leadDays: 4, stock: 240, supplierId: "boutenmoer" },
  { id: "washer-m5", name: "Washer, M5", kind: "bought", unit: "ea", cost: 3, leadDays: 4, stock: 132, supplierId: "boutenmoer" },
  { id: "nut-m5", name: "Nyloc nut, M5", kind: "bought", unit: "ea", cost: 7, leadDays: 4, stock: 136, supplierId: "boutenmoer" },

  // ── Packing ───────────────────────────────────────────────────────
  { id: "carton", name: "Carton and packing", kind: "bought", unit: "ea", cost: 430, leadDays: 10, stock: 40, supplierId: "noordkant" },
  { id: "manual", name: "Handbook, printed", kind: "bought", unit: "ea", cost: 110, leadDays: 16, stock: 120, supplierId: "houtwerk" },
  { id: "toolkit", name: "Tool roll", kind: "bought", unit: "set", cost: 360, leadDays: 10, stock: 25, supplierId: "noordkant" },
];

/** The two things we sell whole. Order matters — it is the order they
 *  appear everywhere on the site. */
export const productIds = ["kade", "vaart"];
