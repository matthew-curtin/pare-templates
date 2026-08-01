import type { NavLink } from "./types";

/**
 * Global site information — the brand, navigation and footer.
 * This is the first file to edit when you make the template your own.
 */
export const site = {
  name: "Lull",
  tagline: "Wind down. Sleep through. Wake up gently.",
  description:
    "Lull is a sleep app that helps you put the day down — a wind-down routine you'll actually follow, a library of sound to fall asleep to, and a morning alarm that waits for the lightest part of your sleep.",
  email: "hello@lull.example",
  /** Shown on /download and in the store badges. */
  app: {
    ios: "iOS 17 or later. iPhone, iPad and Apple Watch.",
    android: "Android 12 or later. Phone, tablet and Wear OS.",
    size: "48 MB",
    rating: 4.8,
    ratingCount: "62,400",
    price: "Free, with an optional subscription",
  },
  social: {
    x: "https://x.com/example",
    instagram: "https://instagram.com/example",
  },
};

export const mainNav: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Download", href: "/download" },
  { label: "Support", href: "/support" },
  { label: "Press", href: "/press" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "App",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Download", href: "/download" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Support", href: "/support" },
      { label: "Cancel a subscription", href: "/support/cancel-subscription" },
      { label: "Contact us", href: "/support#contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Press kit", href: "/press" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

/** Publications shown in the press row. Rendered as wordmarks, not logos. */
export const pressLogos = [
  "The Evening Standard",
  "Wirecutter Weekly",
  "Longform",
  "Field Guide",
  "Nightwatch",
];

/** The numbers on the home page. All invented. */
export const stats = [
  { value: "4.8", label: "average rating, 62k reviews" },
  { value: "23 min", label: "less time awake in bed" },
  { value: "1.4M", label: "nights recorded last month" },
];
