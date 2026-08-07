import type { NavItem, OpeningDay, Service } from "./types";

/**
 * The restaurant. All of it invented — see the footer and the README.
 *
 * Coppice is named for managed woodland, which is where the firewood
 * comes from. Everything on the menu goes over that fire.
 */
export const site = {
  name: "Coppice",
  tagline: "Wood-fired cooking in Bristol",
  description:
    "A thirty-four cover dining room on Colston Yard, Bristol. One fire, " +
    "a short menu that changes weekly, and whatever the growers have.",
  /** Founded. Shown above the hero headline. */
  established: 2021,
  address: {
    // `city` is its own field rather than something derived from
    // `line2`. Splitting "Bristol BS1 5BD" on the first space happens to
    // work and breaks the moment anyone writes a two-word city.
    city: "Bristol",
    line1: "14 Colston Yard",
    line2: "Bristol BS1 5BD",
    // Deliberately not a real telephone number: 0117 496 0xxx is inside
    // Ofcom's range reserved for drama and examples.
    phone: "0117 496 0142",
    phoneHref: "tel:+441174960142",
    email: "hello@coppice.example",
  },
  social: {
    instagram: "@coppicebristol",
  },
  /**
   * "Today", for the booking calendar. A fixed date rather than the real
   * clock, so the first bookable day is always a Wednesday and the
   * template reads the same whenever it is opened. Point this at
   * `new Date()` if you are making this real.
   */
  today: "2026-08-06",
} as const;

export const nav: NavItem[] = [
  { label: "Menus", href: "/menu" },
  { label: "Private dining", href: "/private-dining" },
  { label: "About", href: "/about" },
  { label: "Visit", href: "/visit" },
];

/**
 * The two sittings, and the times offered in each.
 *
 * Which of these times is actually free on a given date is computed in
 * `lib/availability.ts` — it is derived, not listed, because a hand-
 * written table for every date would be unmaintainable and would go
 * stale the moment anyone changed a service.
 */
export const services: Service[] = [
  {
    id: "lunch",
    name: "Lunch",
    detail: "Wednesday to Sunday, from 12:00",
    slots: ["12:00", "12:30", "13:00", "13:30", "14:00"],
  },
  {
    id: "dinner",
    name: "Dinner",
    detail: "Wednesday to Saturday, from 18:00",
    slots: [
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
    ],
  },
];

export const openingHours: OpeningDay[] = [
  { day: "Monday", lunch: null, dinner: null },
  { day: "Tuesday", lunch: null, dinner: null },
  { day: "Wednesday", lunch: "12:00–14:30", dinner: "18:00–21:30" },
  { day: "Thursday", lunch: "12:00–14:30", dinner: "18:00–21:30" },
  { day: "Friday", lunch: "12:00–14:30", dinner: "18:00–22:00" },
  { day: "Saturday", lunch: "12:00–15:00", dinner: "18:00–22:00" },
  { day: "Sunday", lunch: "12:00–16:00", dinner: null },
];

/**
 * Dates the room is not taking bookings, and why.
 *
 * These exist so the "nothing available on this date" state is
 * genuinely reachable — a booking flow whose empty state never appears
 * has an empty state nobody has ever looked at. They are also what
 * actually happens: a private hire takes the whole room out.
 */
export const closures: { date: string; reason: string }[] = [
  {
    date: "2026-08-19",
    reason: "The whole restaurant is privately booked this evening.",
  },
  {
    date: "2026-08-26",
    reason: "Closed — the fire is being relined. Back on the 27th.",
  },
];

/** The dining room. Used by the booking flow to cap a party. */
export const roomCapacity = {
  covers: 34,
  /** Larger than this and it stops being a booking and becomes an event. */
  maxPartyOnline: 8,
};

export const footerNote =
  "Coppice, its people, its suppliers and every booking made here are " +
  "invented. Nothing on this site talks to a server, and no reservation " +
  "you make will reach anyone.";
