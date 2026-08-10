/**
 * The pinned clock, and everything that isn't the route itself.
 *
 * CONVENTIONS §7b: this template's content is a story in time — a
 * season that opens and closes, water sources that fail in the second
 * half of summer, and a set of trail reports with dates on them. Read
 * without a fixed "now" it would either sit permanently before the
 * season opened or permanently after it closed, and the conditions page
 * would show a design nobody intended.
 *
 * The ZONE is pinned for the same reason the instant is. A report filed
 * "yesterday evening" has to still be yesterday evening for a reader in
 * Tokyo, or the sequence the content describes — dry spell, then a
 * warden's note, then rain — stops being a sequence. A real product
 * would want the reader's own zone here; a template of a fixed story
 * does not.
 */
export const ZONE = "America/New_York";

/** Mid-August: deep in the season, late enough that the seasonal water
 *  is a live question rather than a theoretical one. */
export const NOW = new Date("2026-08-12T09:20:00-04:00");

export const site = {
  name: "The Sable Traverse",
  short: "Sable Traverse",
  tagline: "Hut to hut across the Sable Range, in hours rather than miles.",
  /** The two dates the route is a route. Outside them the high legs are
   *  under snow and three of the huts are shuttered. */
  season: { opens: "2026-06-20", closes: "2026-10-05" },
  nav: [
    { href: "/stages", label: "Stages" },
    { href: "/plan", label: "Plan" },
    { href: "/shelters", label: "Shelters" },
    { href: "/conditions", label: "Conditions" },
    { href: "/getting-there", label: "Getting there" },
  ],
  footer: {
    body: "The Sable Range, the traverse, the huts, the wardens and every number on this site are invented. It is a template for Pare, not a trail guide. Do not pack for it.",
    columns: [
      {
        head: "The route",
        links: [
          { href: "/stages", label: "All eleven legs" },
          { href: "/plan", label: "Build an itinerary" },
          { href: "/shelters", label: "Huts and platforms" },
        ],
      },
      {
        head: "Before you go",
        links: [
          { href: "/conditions", label: "Conditions and season" },
          { href: "/getting-there", label: "Trailheads and shuttles" },
        ],
      },
    ],
  },
} as const;

/**
 * The model behind every hour quoted on this site, kept here rather
 * than in the library so it is content a reader can argue with — which
 * is the point of showing it on the conditions page.
 *
 * Paces are miles per hour on the flat for each terrain class. The two
 * climb terms are the standard corrections: an hour for every thousand
 * feet gained, and an hour for every three thousand lost, because a
 * long descent is not free however much it looks it on a profile.
 */
export const model = {
  pace: { trail: 2.6, rough: 1.9, talus: 1.2, bog: 1.1 },
  hoursPerFootUp: 1 / 1000,
  hoursPerFootDown: 1 / 3000,
} as const;

/** What the terrain classes are called on the page, and what they mean
 *  underfoot. Ordered fastest to slowest, matching `Terrain`. */
export const terrainNames = {
  trail: { label: "Graded trail", gloss: "Cut bench, drained, walkable in the dark." },
  rough: { label: "Rough path", gloss: "Roots, blowdown, and a line you have to look for." },
  talus: { label: "Talus", gloss: "Boulder and scree. Hands out of pockets." },
  bog: { label: "Bog", gloss: "Peat and sedge. Flat, and the slowest ground on the route." },
} as const;
