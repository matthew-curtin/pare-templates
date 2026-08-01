import type { NavLink } from "./types";

/**
 * Global site information — the brand, navigation and footer.
 * This is the first file to edit when you make the template your own.
 */
export const site = {
  name: "Cadence",
  tagline: "Ship on a steady beat.",
  description:
    "Cadence turns your team's day-to-day engineering activity into a clear picture of how work actually flows — so you can fix the bottlenecks instead of guessing at them.",
  email: "hello@cadence.example",
  social: {
    x: "https://x.com/example",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/company/example",
  },
};

export const mainNav: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "/features" },
      { label: "Status", href: "/changelog" },
      { label: "Support", href: "/contact" },
    ],
  },
];

/** Companies shown in the social-proof row. Rendered as wordmarks, not logos. */
export const customerLogos = [
  "Northwind",
  "Aperture",
  "Lumen Labs",
  "Ridgeline",
  "Foundry",
  "Beacon",
];

export const stats = [
  { value: "40%", label: "less time in review" },
  { value: "3.2x", label: "faster cycle time" },
  { value: "12k+", label: "teams shipping weekly" },
];
