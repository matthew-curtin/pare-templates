import type { Grind, NavLink } from "./types";

export const site = {
  name: "Ridgeline",
  legalName: "Ridgeline Coffee Roasters",
  tagline: "Coffee roasted to order, posted on Tuesdays",
  description:
    "A small roastery buying single lots from growers we can name, roasting on the day we post, and telling you plainly what is in the bag.",
  founded: 2017,
  /** Shown under the logo on the home page. */
  standfirst:
    "We roast on Monday night and post on Tuesday morning. Nothing sits in a warehouse.",
  freeShippingOverPence: 3000,
  shippingPence: 395,
} as const;

export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "Subscribe", href: "/subscribe" },
  { label: "Brewing", href: "/brewing" },
  { label: "About", href: "/about" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All coffee", href: "/shop" },
      { label: "Subscriptions", href: "/subscribe" },
      { label: "Your basket", href: "/cart" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Brewing guides", href: "/brewing" },
      { label: "About the roastery", href: "/about" },
    ],
  },
];

/**
 * Grind options. Shared by every coffee — a roastery grinds to order,
 * so this is a property of the order rather than of the bean.
 *
 * Whole bean is first and is the default, because it is the one that
 * keeps longest and it is what we would rather sell you.
 */
export const grinds: Grind[] = [
  {
    id: "whole",
    label: "Whole bean",
    hint: "Grind it yourself, as late as possible",
  },
  { id: "filter", label: "Filter", hint: "V60, Chemex, Kalita" },
  { id: "cafetiere", label: "Cafetière", hint: "French press, cupping" },
  { id: "espresso", label: "Espresso", hint: "Pump machines, moka pot" },
  { id: "aeropress", label: "AeroPress", hint: "Slightly finer than filter" },
];

export const DEFAULT_GRIND = "whole";
