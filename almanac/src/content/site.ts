import type { Contract, Pattern, Sector } from "./types";

/**
 * The clock.
 *
 * Every date in this template is read against this instant rather than
 * against the real one, so the story stays the story: one job closes
 * today, one closes tomorrow, three have already closed. Without a
 * pinned now, a template opened six months after it was written is a
 * board on which everything closed in the spring.
 *
 * The timezone is pinned for the same reason and is the half people
 * forget. A closing date here is a calendar day ending at 11:59pm, and
 * which day that is depends on where you are standing: a deadline of
 * "Friday" is already Saturday in Auckland. Rendered in the reader's
 * timezone the counts come out different in different places, which is
 * not a property anyone wants in a jobs board.
 *
 * Building a real product on this? Delete ZONE, delete `now`, and both
 * follow whoever is reading — which is what a real product wants and
 * this one cannot have.
 */
export const now = "2026-09-16T13:20:00Z";
export const ZONE = "America/New_York";

export const site = {
  name: "Almanac",
  tagline: "Public sector and nonprofit jobs, closing date first.",
  description:
    "A hand-checked board of jobs in city and county government, health, schools, housing, museums and nonprofits. Every posting says what it pays.",
  /** Both invented; nothing here resolves. */
  email: "hello@almanac.example",
  address: "Almanac, 212 Marker Street, Wrenfield OH",
  nav: [
    { href: "/", label: "Jobs" },
    { href: "/employers", label: "Employers" },
    { href: "/alerts", label: "Alerts" },
    { href: "/about", label: "About" },
  ],
  footer: {
    columns: [
      {
        heading: "The board",
        links: [
          { href: "/", label: "All jobs" },
          { href: "/employers", label: "Employers" },
          { href: "/alerts", label: "Email alerts" },
        ],
      },
      {
        heading: "For employers",
        links: [
          { href: "/post", label: "Post a job" },
          { href: "/post#prices", label: "Prices" },
          { href: "/about#policy", label: "Posting policy" },
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
    note: "Almanac is a fictional job board. The organizations, jobs, salaries, job numbers and people in it are invented, no address resolves, and nothing here talks to a server.",
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
  /** Hours in a full-time week. */
  fullTimeWeek: 40,
  /** Weeks paid in a year, including leave. */
  weeksPerYear: 52,
  /** Billable days behind an interim day rate, after leave and holidays. */
  workingDaysPerYear: 220,
} as const;

/** How soon is soon. Both in days, both used by the board and the alerts. */
export const thresholds = {
  /** A posting wears a "new" flag for this long after it goes up. */
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
  "Nonprofit",
];

export const contracts: readonly Contract[] = [
  "Regular",
  "Term",
  "Interim",
  "On call",
  "Volunteer",
];

export const patterns: readonly Pattern[] = ["On site", "Hybrid", "Remote"];

/**
 * The salary floors offered as filter options.
 *
 * Round numbers people actually think in, rather than a slider — a
 * slider on a board of twenty-two jobs gives you forty positions that
 * mean nothing and two that matter.
 */
export const salaryFloors = [
  40000, 55000, 70000, 85000, 100000, 120000,
] as const;

export const sortOptions = [
  { id: "closing", label: "Closing soonest" },
  { id: "newest", label: "Newest" },
  { id: "pay", label: "Highest paid" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];
