import type { Contract, Pattern, Sector } from "./types";

/**
 * The clock.
 *
 * Every date in this template is read against this instant rather than
 * against the real one, so the story stays the story: one vacancy
 * closes today, one closes tomorrow, three have already closed. Without
 * a pinned now, a template opened six months after it was written is a
 * board on which everything closed in the spring.
 *
 * The timezone is pinned for the same reason and is the half people
 * forget. A closing date here is a calendar day ending at 23:59, and
 * which day that is depends on where you are standing: a deadline of
 * "Friday" is already Saturday in Auckland. Rendered in the reader's
 * timezone the counts come out different in different countries, which
 * is not a property anyone wants in a jobs board.
 *
 * Building a real product on this? Delete ZONE, delete `now`, and both
 * follow whoever is reading — which is what a real product wants and
 * this one cannot have.
 */
export const now = "2026-09-16T09:20:00Z";
export const ZONE = "Europe/London";

export const site = {
  name: "Almanac",
  tagline: "Public and charitable sector vacancies, closing date first.",
  description:
    "A hand-checked board of vacancies in councils, health, education, housing, museums and charities across the UK. Every listing states what it pays.",
  /** Both invented; nothing here resolves. */
  email: "hello@almanac.example",
  address: "Almanac, 4 Wrenfield Row, Leeds LS2",
  nav: [
    { href: "/", label: "Vacancies" },
    { href: "/employers", label: "Employers" },
    { href: "/alerts", label: "Alerts" },
    { href: "/post", label: "Advertise" },
    { href: "/about", label: "About" },
  ],
  footer: {
    columns: [
      {
        heading: "The board",
        links: [
          { href: "/", label: "All vacancies" },
          { href: "/employers", label: "Employers" },
          { href: "/alerts", label: "Email alerts" },
        ],
      },
      {
        heading: "For employers",
        links: [
          { href: "/post", label: "Place a listing" },
          { href: "/post#prices", label: "Prices" },
          { href: "/about#policy", label: "Listing policy" },
        ],
      },
      {
        heading: "Almanac",
        links: [
          { href: "/about", label: "Who runs this" },
          { href: "/about#questions", label: "Questions" },
        ],
      },
    ],
    note: "Almanac is a fictional job board. The organisations, vacancies, salaries, reference numbers and people in it are invented, no address resolves, and nothing here talks to a server.",
  },
} as const;

/**
 * The arithmetic behind every comparison on the board.
 *
 * These are assumptions, not facts, which is exactly why they are one
 * named object rather than numbers dropped into a function. A day rate
 * is not a salary until somebody decides how many days a year are
 * worked, and reasonable people say 220, 225 or 230.
 */
export const payBasis = {
  /** Hours in a full-time week. The common local government figure. */
  fullTimeWeek: 37,
  /** Weeks paid in a year, including leave. */
  weeksPerYear: 52,
  /** Chargeable days behind an interim day rate, after leave and bank holidays. */
  workingDaysPerYear: 220,
} as const;

/** How soon is soon. Both in days, both used by the board and the alerts. */
export const thresholds = {
  /** A listing wears a "new" flag for this long after it is posted. */
  newFor: 3,
  /** Below this many days left, the closing date is drawn in red. */
  closingWithin: 7,
} as const;

export const sectors: readonly Sector[] = [
  "Local government",
  "Health",
  "Education",
  "Culture & heritage",
  "Housing",
  "Environment",
  "Charity",
];

export const contracts: readonly Contract[] = [
  "Permanent",
  "Fixed term",
  "Interim",
  "Casual",
  "Voluntary",
];

export const patterns: readonly Pattern[] = ["On site", "Hybrid", "Remote"];

/**
 * The salary floors offered as filter options.
 *
 * Round numbers people actually think in, rather than a slider — a
 * slider on a board of twenty vacancies gives you forty positions that
 * mean nothing and two that matter.
 */
export const salaryFloors = [20000, 25000, 30000, 40000, 50000, 60000] as const;

export const sortOptions = [
  { id: "closing", label: "Closing soonest" },
  { id: "newest", label: "Recently posted" },
  { id: "pay", label: "Highest paid" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];
