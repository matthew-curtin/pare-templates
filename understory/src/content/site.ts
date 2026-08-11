import type { Visit, YearNote } from "./types";

export const site = {
  name: "Strathdunan",
  full: "Strathdunan Botanic Garden",
  where: "Ardmairn, Argyll",
  tagline: "A garden that tells you when to come.",
  /**
   * CONVENTIONS §7b: pin the clock.
   *
   * This is week 33 — 16 to 22 August — and it is not an arbitrary
   * choice. It is the week more people come to Strathdunan than any
   * other week of the year, and it is nowhere near the best week to be
   * here. Landing the site on its own busiest, second-rate week is the
   * argument stated before a word of copy: the wall you see first is
   * thin, and the year rail underneath it shows you the March you
   * missed.
   *
   * There is no `Date` anywhere in `src`. A week is an integer.
   */
  thisWeek: 33,
  founded: 1878,
  given: 1961,
  founder: "James Marchbank",
  latitude: "56° 41′ N",
  hectares: 21,
  taxa: 2140,
  staff: 9,
  blurb:
    "Twenty-one hectares on the north shore of Loch Ardmairn, planted since 1878 into the shelter of an oak wood that was already two hundred years old. The sea keeps the frost off. Almost everything here would be dead forty miles inland.",
  footer:
    "Strathdunan Botanic Garden, the people in it, the collection, the accession numbers and every figure on this site are invented for a website template. There is no such garden and no such loch.",
};

/**
 * The rhythm of the place, told straight.
 *
 * Every one of these was rewritten AFTER running the model, and three of
 * them were simply wrong before that. A note calling the third week of
 * July "the thin week" was sitting on the week the giant lily opens,
 * which is one of the two or three best days of the year here — and
 * nothing in a build log will ever tell you that a sentence and an array
 * of numbers on the same page disagree. `scripts/check-season.mjs`
 * recomputes each week named below and fails if the garden moves
 * underneath the prose.
 */
export const yearNotes: YearNote[] = [
  {
    week: 3,
    text: "Three smells and a hillside of bark. The sarcococca by the ticket hut, the daphne on the terrace, the witch hazel up the track — that is the whole garden this week, and on a bright cold morning it is enough.",
  },
  {
    week: 11,
    text: "The best week of the year by a distance, and it is over in about nine days. If the wind comes round to the east the big magnolia browns in a single night.",
  },
  {
    week: 18,
    text: "Bluebells under the Loderi, both at once, which nobody planned. The best ten days in the Hollow that do not involve a magnolia.",
  },
  {
    week: 23,
    text: "Blue poppies on the burn and the fire bush on the terrace at the same moment — the one week of the year this garden is not fundamentally red, cream and green.",
  },
  {
    week: 29,
    text: "The giant lily, if it is a year for it. Seven years underground for a fortnight above it, and we will telephone you.",
  },
  {
    week: 33,
    text: "The week more of you come than any other. The eucryphia is worth the drive. Very little else is, and the wall above shows you exactly how little.",
  },
  {
    week: 38,
    text: "The worst week of the year, and it is not in the winter — it is now. Summer has finished and nothing has turned. Three things are above the bar and one of them is a hedge fuchsia.",
  },
  {
    week: 43,
    text: "The katsura drops and the whole Arboretum smells of burnt sugar for about four days. Three-quarters as good as March, which is as close as autumn gets on this coast.",
  },
  {
    week: 48,
    text: "The only part of the garden with anything in it is the Arboretum, and what you are looking at is bark. Come for the loch.",
  },
];

export const visiting: Visit[] = [
  { label: "Open", detail: "Every day, 10.00 until dusk. Dusk in December is 15.40." },
  { label: "Admission", detail: "£9, under-16s free, members free. Cash is fine." },
  { label: "Getting here", detail: "Forty minutes from Lochgilphead on the A-road, then two miles of single track with passing places." },
  { label: "Parking", detail: "Fifty spaces on grass. In August they are gone by eleven." },
  { label: "The tea room", detail: "Open when the garden is, except the first fortnight of January." },
  { label: "Dogs", detail: "On a lead everywhere except the Shore Walk, where they can run." },
  { label: "Wheelchairs", detail: "The Terrace and the Glasshouse are level. The Hollow is not, and we will not pretend otherwise — it is a steep path with roots across it." },
  { label: "Boots", detail: "The Burnside is wet in every month of the year, including August." },
];

/**
 * Visitors per week, counted at the gate.
 *
 * The single most useful number on the site and the one no garden
 * publishes, because putting it next to the interest curve shows that
 * the two peaks are five months apart. Most people come in the school
 * holidays, which is the correct decision for their family and the
 * wrong week for the garden.
 */
export const visitors: number[] = [
  180, 210, 240, 260, 320, 410, 520, 700, 980, 1240, 1520, 1610, 1480, 1390,
  1520, 1660, 1740, 1810, 1980, 2140, 2260, 2380, 2520, 2610, 2740, 2880,
  3010, 3180, 3420, 3680, 3960, 4180, 4410, 4290, 3970, 3510, 3020, 2640,
  2280, 2010, 1840, 1720, 1490, 1180, 860, 620, 470, 400, 360, 330, 300, 260,
];
