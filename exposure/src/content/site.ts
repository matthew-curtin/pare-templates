import type { SurveyNote } from "./types";
import type { SiteGeo } from "../lib/sun";

/**
 * The brokerage, and the one place a date or a coordinate is written
 * down.
 *
 * The clock is PINNED (§7b). Every "today", every day count and every
 * "the sun sets at" on this site renders against this instant, so the
 * template still says what it was written to say a year from now — a
 * listing site read against a live clock shows a season nobody chose
 * and a page of expired viewings. The timezone is pinned with it, by
 * construction: nothing here ever asks the machine what time it is, and
 * the geography below is what converts a sun angle into a clock face.
 */
export const site = {
  name: "Exposure",
  tagline: "We publish the light.",
  town: "Halstead, Michigan",
  claim:
    "Every listing in the county tells you which way the house faces. None of them tells you when.",
  now: { year: 2026, month: 11, day: 19, hour: 14 + 20 / 60 },
  phone: "(734) 555-0148",
  email: "survey@exposure.example",
  office: "9 Weir Street, Halstead, MI",
} as const;

/**
 * 42.3° north, and a long way west inside its own time zone.
 *
 * Both halves matter. The latitude decides how low the December sun
 * gets — 24° here, which is under the ridge behind Hollow Road and under
 * most of the county's mature trees. The longitude decides what the
 * clock says while that happens: Halstead sits nearly nine degrees west
 * of the meridian its time zone is named for, so solar noon is at about
 * twenty-five past twelve in winter and half past one in summer.
 */
export const geo: SiteGeo = {
  latitude: 42.3,
  longitude: -83.7,
  meridian: -75,
  dstMeridian: -60,
  dstFrom: 67,
  dstTo: 305,
};

/**
 * Three days, and every strip on the site is drawn for one of them.
 *
 * Not twelve months, and not a slider. The argument is that the answer
 * changes, and it is made by two extremes with an ordinary day between
 * them — a control with twelve positions invites the reader to hunt for
 * a number instead of noticing that the number moves.
 */
export const seasons = [
  {
    key: "jun",
    short: "June",
    label: "21 June",
    gloss: "the longest day",
    month: 6,
    day: 21,
  },
  {
    key: "sep",
    short: "September",
    label: "22 September",
    gloss: "the equinox",
    month: 9,
    day: 22,
  },
  {
    key: "dec",
    short: "December",
    label: "21 December",
    gloss: "the shortest day",
    month: 12,
    day: 21,
  },
] as const;

export type SeasonKey = (typeof seasons)[number]["key"];

export const DEFAULT_SEASON: SeasonKey = "dec";

/** The window every day strip is drawn across. Fixed, so June and
 *  December are two lengths on one ruler rather than two charts. */
export const STRIP = { from: 4, to: 22 } as const;

export const nav = [
  { href: "/homes", label: "Homes" },
  { href: "/compare", label: "Compare" },
  { href: "/light", label: "How we measure" },
  { href: "/viewings", label: "Viewings" },
  { href: "/about", label: "About" },
] as const;

/** The four states a strip can be in, named once. */
export const states = [
  {
    key: "sun",
    label: "Direct sun",
    gloss: "The beam is on the glass. This is the only light that moves across a floor, and the only one you can feel.",
  },
  {
    key: "sky",
    label: "Sky only",
    gloss: "Daylight, no beam — the sun is up but behind the house. Even, steady and much better to work in than most people expect.",
  },
  {
    key: "shade",
    label: "Blocked",
    gloss: "The sun is in front of the window and something is in the way: a gable, a ridge, a beech that will be taller next year.",
  },
  {
    key: "night",
    label: "Down",
    gloss: "Below the horizon. In December that is fifteen hours of the twenty-four, which is the part of the year nobody views a house in.",
  },
] as const;

export const method: SurveyNote[] = [
  {
    head: "We survey from the plan, not from the visit",
    body: "An agent standing in a room at eleven on a Tuesday in May knows what that room is like at eleven on a Tuesday in May. The sun's position is arithmetic, so the rest of the year is arithmetic too — given the compass bearing of each window, the height of what stands in front of it, and the latitude. All three are measured once, on site, with a compass and a clinometer.",
  },
  {
    head: "Direct sun is the thing we count",
    body: "Hours of beam on the glass: the light that lands on a floor, warms a room and moves through the afternoon. It is not the same as brightness. A north room under a big window is a bright room with no direct sun in it at all, which is why every room here carries its glazing ratio beside its hours.",
  },
  {
    head: "What blocks it is measured, not guessed",
    body: "Each obstruction is recorded as an arc of the compass and an angle above the horizon. The ridge behind Hollow Road stands 26° above the ground-floor windows. The sun here never gets above 24° in December. Those two numbers are the entire story of that house in winter, and neither appears on its listing.",
  },
  {
    head: "The arithmetic is standard and slightly rounded",
    body: "Cooper's declination, the hour-angle form of solar position, and the equation of time — accurate to a few minutes, which is well inside the honesty of the rest. A tree is not a shape and a window is not a plane. Times are given to the nearest five minutes for that reason, and sunrise and sunset include the half-degree of refraction the almanac uses, so they agree with the one in your kitchen drawer.",
  },
  {
    head: "What we do not model",
    body: "Cloud, first of all — this is geometry, not weather, and Halstead is overcast for about half of December. Nor bounce off a white wall opposite, nor the light a skylight brings down a stairwell, nor curtains, nor the tree that comes down next spring. A survey is a floor, not a ceiling.",
  },
];

export const footerNote =
  "Exposure, Halstead, the six homes and every number on this site are invented. It is a template for Pare, not a brokerage, and none of these houses exists.";
