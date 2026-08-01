/**
 * Shared content types.
 *
 * Everything the site renders comes from the typed modules in this
 * folder — no copy is hardcoded inside a component. To change what the
 * site says, edit the data; to change how it looks, edit the component.
 */

export type NavLink = {
  label: string;
  href: string;
};

export type Feature = {
  /** Short id, used as an anchor target on /features. */
  id: string;
  title: string;
  /** One line, shown on cards. */
  summary: string;
  /** Two or three sentences, shown on the features page. */
  description: string;
  /** Icon key — see components/feature-icon.tsx. */
  icon: "moon" | "wave" | "alarm" | "chart" | "offline" | "watch";
  /** Bullet points shown under the description on /features. */
  points: string[];
};

/** One step in the "how it works" sequence on the home page. */
export type Step = {
  title: string;
  description: string;
};

/** A track in the sound library. */
export type Sound = {
  id: string;
  name: string;
  category: "Rain" | "Water" | "Nature" | "Ambient" | "Stories";
  /** Shown under the name, e.g. "42 min". */
  length: string;
  description: string;
  /** Path under /public, e.g. "/images/sounds/rain.jpg". */
  image: string;
  imageAlt: string;
  /** Only available on a paid plan. */
  premium?: boolean;
};

export type PricingPlan = {
  id: string;
  name: string;
  /** Monthly price. Use 0 for a free tier. */
  monthly: number;
  /** Yearly price per month, i.e. the discounted rate. */
  yearly: number;
  tagline: string;
  /** Highlights this plan as the recommended one. */
  featured?: boolean;
  cta: string;
  features: string[];
};

/** An app-store style review. */
export type Review = {
  id: string;
  /** Whole stars, 1–5. */
  rating: number;
  title: string;
  body: string;
  author: string;
  /** Where the review came from, e.g. "iPhone · United Kingdom". */
  source: string;
};

/** A block of long-form body content. Keeps articles structured and typed. */
export type DocBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "note"; text: string };

/** A help-centre article. */
export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  updated: string;
  body: DocBlock[];
};

/** One shipped version of the app, shown on /download. */
export type Release = {
  version: string;
  /** ISO date, e.g. "2026-07-14". */
  date: string;
  summary: string;
  changes: string[];
};

/** A legal document — privacy policy, terms. Rendered at /legal/[doc]. */
export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  body: DocBlock[];
};

/** A downloadable item in the press kit. */
export type PressAsset = {
  name: string;
  description: string;
  /** e.g. "ZIP · 4.2 MB". Nothing is actually attached in the template. */
  meta: string;
};

/** A mention of the app in the press. */
export type PressMention = {
  outlet: string;
  quote: string;
  date: string;
};

export type Faq = {
  question: string;
  answer: string;
};
