import type { Room } from "./types";

export const site = {
  name: "Overlap",
  tagline: "Three days on keeping things working",
  /**
   * The proposition, in the fewest words that survive being argued with.
   * Used on the front page and in the metadata.
   */
  description:
    "A conference about maintenance — of software, of bridges, of buildings, of institutions, of each other. Pittsburgh, 14–16 October 2026.",
  city: "Pittsburgh",
  venue: "The Ironhouse",
  year: 2026,
  email: "hello@overlap.example",
} as const;

/**
 * The clock is pinned, and it is pinned DURING the conference on purpose.
 *
 * Two things follow from that and neither is available otherwise: the
 * now-marker sits in the middle of day two where you can see it doing
 * its job, and one session is genuinely live — a state that in a real
 * conference site exists for about forty minutes at a time and would
 * otherwise never be seen by anyone, including whoever built it.
 *
 * The timezone is pinned for the same reason support-inbox pins its
 * one: a schedule is a story about a working day, and rendered in the
 * reader's zone that story survives in Pennsylvania and falls apart
 * everywhere else — the 09:00 opening reads 14:00 in London and the
 * evening panel lands at breakfast in Tokyo.
 *
 * Building something real on this? Delete both and it follows whoever
 * is reading, which is what an actual attendee wants.
 */
export const now = "2026-10-15T15:20:00Z"; // 11:20 EDT, Thursday, day two
export const ZONE = "America/New_York";

export interface ConferenceDay {
  /** 1-indexed, and what `Session.day` refers to. */
  n: number;
  /** ISO calendar date, no time. */
  date: string;
  label: string;
  /** The theme of the day, printed above the grid. */
  strand: string;
  /** Grid extent, "HH:MM". Day three is deliberately shorter than the others. */
  opens: string;
  closes: string;
}

export const days: ConferenceDay[] = [
  {
    n: 1,
    date: "2026-10-14",
    label: "Wednesday",
    strand: "What breaks",
    opens: "09:00",
    closes: "17:30",
  },
  {
    n: 2,
    date: "2026-10-15",
    label: "Thursday",
    strand: "Who fixes it",
    opens: "09:00",
    closes: "18:00",
  },
  {
    n: 3,
    date: "2026-10-16",
    label: "Friday",
    strand: "What it costs",
    opens: "09:30",
    closes: "14:00",
  },
];

/**
 * Four rooms, and their colours are spaced in LIGHTNESS as much as in
 * hue — see the note in globals.css. The grid uses colour as a
 * glanceable "which room" cue, so four hues that collapse to two under
 * deuteranopia would take the wallchart's main affordance away from
 * about one man in twelve.
 */
export const rooms: Room[] = [
  {
    id: "foundry",
    name: "Foundry",
    where: "Ground floor, through the main doors",
    seats: 420,
    tone: "var(--color-room-a)",
    toneSoft: "var(--color-room-a-soft)",
  },
  {
    id: "boiler",
    name: "Boiler House",
    where: "Ground floor, east end",
    seats: 180,
    tone: "var(--color-room-b)",
    toneSoft: "var(--color-room-b-soft)",
  },
  {
    id: "drawing",
    name: "Drawing Office",
    where: "First floor, lift or stairs",
    seats: 90,
    tone: "var(--color-room-c)",
    toneSoft: "var(--color-room-c-soft)",
  },
  {
    id: "yard",
    name: "Yard",
    where: "Outside, covered, heated",
    seats: 120,
    tone: "var(--color-room-d)",
    toneSoft: "var(--color-room-d-soft)",
  },
];

export const nav = [
  { href: "/schedule", label: "Schedule" },
  { href: "/speakers", label: "Speakers" },
  { href: "/plan", label: "Your plan" },
  { href: "/venue", label: "Venue" },
  { href: "/tickets", label: "Tickets" },
];

export const topics = [
  "Software",
  "Infrastructure",
  "Buildings",
  "Care",
  "Archives",
  "Repair",
  "Standards",
];

export const footer = {
  lines: [
    "Overlap is run by a non-profit of the same name.",
    "The Ironhouse, 1400 Smallman Street, Pittsburgh PA.",
  ],
  note: "Overlap, the sessions, the speakers and the venue are invented. Nothing here talks to a server and no address resolves.",
};
