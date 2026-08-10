/**
 * The studio itself, and the pinned clock.
 *
 * §7b says a template whose content is a story in time needs a fixed
 * "now". This one goes further and has no dates in it at all: `TODAY` is
 * an integer day index into the studio's fortnightly rota, and every
 * calendar label on the site is arithmetic from `DAY_ZERO` (see
 * `lib/format.ts`). There is no `Date` in the application, so the same
 * fortnight renders identically in every timezone and the checker cannot
 * be flattered by the machine it happens to run on.
 *
 * Day 0 is a Monday. TODAY is 17, which is therefore a Thursday — and
 * cycle day 3, which is the day Ash fires stoneware. That is deliberate:
 * the front page should open on a kiln being packed, not on an empty
 * yard.
 */
export const TODAY = 17;

/**
 * How far ahead the simulation runs: thirty-two days, which is three
 * turns of the fortnightly rota and therefore three chances at Bramble.
 *
 * Two is not enough. The gas kiln can postpone one Sunday for want of a
 * load and then fill up on the next, and a piece caught by both needs a
 * third before the site can give its maker a date at all — and "no date"
 * is a worse answer than "the 23rd of June", even when the 23rd of June
 * is a terrible answer.
 *
 * The far end of it is honestly empty. The studio can only simulate work
 * that exists, and nobody has made June's pots yet, so firings past the
 * first fortnight show as `open` rather than as being in trouble.
 */
export const HORIZON = 32;

/** What day 0 was called, for the reader. Nothing computes with it. */
export const DAY_ZERO = { weekday: "Monday", date: 5, month: "May" };

/**
 * What the studio pays for heat, in pence per unit.
 *
 * Electricity by the kilowatt-hour, propane by the kilogram, and the
 * gap between them is most of the reason Bramble has a threshold twice
 * the size of Ash's.
 */
export const tariff: Record<string, number> = { kWh: 28.4, kg: 194 };

export const site = {
  name: "Marlpit",
  tagline: "A members' ceramics studio in the old brush works on Sedge Row.",
  town: "Hollowmere",
  address: "Unit 4, the old brush works, Sedge Row, Hollowmere",
  hours: "Members: any hour. Everyone else: Saturdays, 10 to 4.",
  /**
   * The sentence the whole site exists to prove.
   *
   * It reads on from the headline rather than restating it. Written the
   * other way round — as a self-contained paragraph — it put the same
   * clause on the page twice, six words apart, which nobody notices
   * writing it and everybody notices reading it.
   */
  claim:
    "It is a container that has to be full before anybody will light it, so what your work is waiting for is not the people in front of it. It is other people's work of the same kind.",
};

export const nav = [
  { href: "/", label: "Kilns" },
  { href: "/queue", label: "The shelf" },
  { href: "/firings", label: "Firings" },
  { href: "/glazes", label: "Glazes" },
  { href: "/studio", label: "Studio" },
  { href: "/join", label: "Join" },
];

/**
 * Membership. Note what is NOT on this list: a price for firing.
 *
 * The studio charges each piece its share of the firing it went in,
 * worked out from the space it took — so the price of getting a mug
 * fired depends on how full the kiln was, and there is no number anybody
 * could print here that would be true. Every firing page does the
 * division instead.
 */
export const memberships = [
  {
    id: "bench",
    name: "Bench",
    price: "£54 a month",
    shelf: "One metre of shelf",
    lines: [
      "A key, and the building whenever you want it",
      "Wheel and slab roller booked on the board",
      "Firing at cost, divided by the space you take",
    ],
  },
  {
    id: "two-days",
    name: "Two days",
    price: "£34 a month",
    shelf: "Half a metre of shelf",
    lines: [
      "Tuesdays and Thursdays, 9 to 9",
      "Wheel and slab roller booked on the board",
      "Firing at cost, divided by the space you take",
    ],
  },
  {
    id: "course",
    name: "Eight weeks",
    price: "£180",
    shelf: "A tray, and a box for the rest",
    lines: [
      "Thursday evenings, eight of them, six people",
      "Clay, tools and glaze included",
      "Two firings included, and the queue explained properly",
    ],
  },
];

/**
 * The photographs.
 *
 * Direction: WORK IN PROGRESS UNDER WORKING LIGHT — NOBODY IN FRAME,
 * NOTHING FINISHED. The last clause is the one that rejects things.
 * This site is about the wait, and the finished pot is the one thing the
 * studio cannot show you yet, so there is no glazed pot anywhere on it.
 *
 * `job` is what the photograph is FOR — the claim on the page beside it
 * that prose can only assert. An image that could be swapped for another
 * of the same subject without anybody noticing is decoration, per §6.
 */
export const shots = {
  greenShelf: {
    alt: "Dozens of unfired clay bowls standing rim-up in close rows, receding out of focus into a dark studio.",
    job: "The shelf on this site is forty-seven rows of a table. This is the same forty-seven objects, and it makes the point the table cannot — what runs out at Marlpit is space, not patience.",
    caption: "The green shelf. Nothing here has been near a kiln yet.",
  },
  stacked: {
    alt: "Stacks of pale unfired plates and bowls on a grey metal studio shelf, with an empty shelf above them and a window beyond.",
    job: "Every elevation on this site claims that a shelf is a HEIGHT, and that everything standing under it is standing in air somebody has paid to heat. Here that claim is a photograph, and the air is the part you can see.",
    caption: "Two shelves, and most of what is between them.",
  },
  elements: {
    alt: "The inside of a kiln: heating elements coiled into grooves up a pale refractory wall, and one shelf below holding a row of small bowls with gaps between them.",
    job: "The elevation drawings, unabstracted. The elements, one shelf, the work packed across it with real gaps between real pots, and the whole upper half of the chamber holding nothing at all.",
    caption: "One shelf loaded. The rest of it is air.",
  },
  buckets: {
    alt: "Five open buckets of thick pale liquid seen from above on a speckled concrete floor, one of them with a dried skin across the surface.",
    job: "Some of the work on the shelf is waiting for its maker rather than for a kiln, and this is what that wait actually looks like. The studio cannot schedule a pot whose glaze nobody has picked.",
    caption: "The glaze bench. Five buckets and a decision.",
  },
};

export const footer = {
  note: "Marlpit, Sedge Row, Hollowmere. Everything on this site is invented — the studio, the members, the pots and the glaze recipes. The arithmetic is real.",
};
