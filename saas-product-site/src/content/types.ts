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
  /** Lucide-style icon key — see components/feature-icon.tsx. */
  icon: "chart" | "clock" | "users" | "shield" | "plug" | "sparkle";
  /** Bullet points shown under the description on /features. */
  points: string[];
};

export type PricingPlan = {
  id: string;
  name: string;
  /** Monthly price in whole dollars. Use null for "talk to us" tiers. */
  monthly: number | null;
  /** Yearly price per month, i.e. the discounted rate. */
  yearly: number | null;
  tagline: string;
  /** Highlights this plan as the recommended one. */
  featured?: boolean;
  cta: string;
  features: string[];
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type ChangelogEntry = {
  version: string;
  /** ISO date, e.g. "2026-07-14". */
  date: string;
  title: string;
  summary: string;
  tag: "feature" | "improvement" | "fix";
  changes: string[];
};

/** A block of post body content. Keeps posts structured and typed. */
export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingMinutes: number;
  author: { name: string; role: string };
  /** Path under /public, e.g. "/images/blog/velocity.jpg". */
  cover: string;
  coverAlt: string;
  body: PostBlock[];
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
};

export type Faq = {
  question: string;
  answer: string;
};
