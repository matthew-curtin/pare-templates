import type { NavLink } from "./types";

/**
 * The masthead details and the navigation. Change the name here and it
 * changes in the header, the footer, the page titles and the print
 * cover mockup.
 */
export const site = {
  name: "Meridian",
  tagline: "A magazine about places and the people who make them",
  description:
    "Meridian is a quarterly magazine about the built and grown world — the cities we rearrange, the things we still make by hand, and the land underneath both. Long stories, unhurried, four times a year.",
  founded: 2019,
  /** Printed under the masthead on the home page. */
  standfirst:
    "Four times a year, at length, about the built and grown world.",
} as const;

export const primaryNav: NavLink[] = [
  { label: "Cities", href: "/section/cities" },
  { label: "Craft", href: "/section/craft" },
  { label: "Land", href: "/section/land" },
  { label: "Archive", href: "/archive" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Read",
    links: [
      { label: "Cities", href: "/section/cities" },
      { label: "Craft", href: "/section/craft" },
      { label: "Land", href: "/section/land" },
      { label: "The archive", href: "/archive" },
    ],
  },
  {
    title: "The magazine",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contributors", href: "/contributors" },
      { label: "Subscribe", href: "/subscribe" },
    ],
  },
];

/** Shown in the newsletter block. */
export const newsletter = {
  title: "The Meridian letter",
  description:
    "One email on the first Thursday of the month: what we are working on, what we are reading, and a photograph we could not fit anywhere else.",
  cta: "Sign up",
  /** Shown after a successful submit. Nothing is actually sent. */
  success: "Thank you — check your inbox to confirm.",
};
