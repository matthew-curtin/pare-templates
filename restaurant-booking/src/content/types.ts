/**
 * Every content shape on the site, in one place.
 *
 * If you are changing what the site *says*, you want the other files in
 * this folder. This one describes their shape, so the editor tells you
 * immediately when a field is missing.
 */

/** Which sitting a booking is for. */
export type ServiceId = "lunch" | "dinner";

/** Dietary marks shown against a dish. Always rendered with a key. */
export type DietaryMark = "v" | "vg" | "gf" | "n";

export interface Dish {
  name: string;
  /** What is actually in it. One line, written like a menu. */
  description: string;
  /** Whole pounds — this kitchen does not price in pennies. */
  price: number;
  marks: DietaryMark[];
}

export interface MenuSection {
  name: string;
  /** Optional line under the section heading. */
  note?: string;
  dishes: Dish[];
}

export interface Menu {
  id: string;
  name: string;
  /** Shown under the menu's tab — when it is served, what it costs. */
  detail: string;
  sections: MenuSection[];
}

export interface Service {
  id: ServiceId;
  name: string;
  /** "Wednesday to Sunday, 12:00–14:30" */
  detail: string;
  /** Times offered, in order. Availability is computed separately. */
  slots: string[];
}

export interface OpeningDay {
  day: string;
  lunch: string | null;
  dinner: string | null;
}

export interface Person {
  name: string;
  role: string;
  /** Two letters, drawn as a monogram. No stock headshots. */
  initials: string;
  bio: string;
}

export interface Supplier {
  name: string;
  what: string;
  where: string;
}

export interface Question {
  question: string;
  answer: string;
}

export interface PrivateSpace {
  name: string;
  seated: number;
  standing: number | null;
  detail: string;
  /** Minimum spend, whole pounds. `null` where there isn't one. */
  minimumSpend: number | null;
}

export interface NavItem {
  label: string;
  href: string;
}
