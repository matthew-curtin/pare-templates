/**
 * Shared content types.
 *
 * Everything the site renders comes from the typed modules in this
 * folder — no copy is hardcoded inside a component. To change what the
 * magazine says, edit the data; to change how it looks, edit the
 * component.
 */

export type NavLink = {
  label: string;
  href: string;
};

/** A department of the magazine. Stories belong to exactly one. */
export type Section = {
  /** Used in the URL: /section/cities */
  slug: string;
  name: string;
  /** One line, shown under the section title and on cards. */
  summary: string;
  /** Two or three sentences, shown at the top of the section page. */
  description: string;
};

/** A person who writes or photographs for the magazine. */
export type Contributor = {
  slug: string;
  name: string;
  /** e.g. "Contributing editor" — shown under the name. */
  role: string;
  /** Where they are based, e.g. "Lisbon". */
  based: string;
  /** Two or three sentences for /contributors. */
  bio: string;
  /** Drawn as initials rather than a photograph — a stock headshot
   *  attached to an invented person sits badly. */
  initials: string;
};

/** A block of long-form body content. Keeps stories structured and
 *  typed, so a component can render each kind deliberately instead of
 *  parsing a blob of markup. */
export type StoryBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] }
  /** A full-width photograph inside the body of a story. */
  | { type: "figure"; image: string; alt: string; caption: string };

export type Story = {
  /** Used in the URL: /story/the-last-foundry-on-the-river */
  slug: string;
  title: string;
  /** The standfirst — one or two sentences under the headline. */
  dek: string;
  /** Slug of the section this belongs to. */
  section: string;
  /** Slug of the contributor who wrote it. */
  author: string;
  /** ISO date, e.g. "2026-06-18". */
  date: string;
  /** Whole minutes. Shown as "12 min read". */
  readingMinutes: number;
  /** Path under /public, e.g. "/images/stories/foundry.jpg". */
  image: string;
  imageAlt: string;
  /** Credit line for the photograph, shown small under the image. */
  imageCredit: string;
  /** Promotes the story to the top of the home page. Exactly one
   *  story should carry this. */
  featured?: boolean;
  body: StoryBlock[];
};

/** A subscription offer on /subscribe. */
export type Plan = {
  id: string;
  name: string;
  /** Price per year, in whole currency units. */
  yearly: number;
  /** One line under the name. */
  tagline: string;
  /** Marks the plan the magazine would rather you took. */
  featured?: boolean;
  includes: string[];
};

/** One issue of the print edition. */
export type Issue = {
  number: number;
  /** e.g. "Summer 2026". */
  season: string;
  /** The line printed across the cover. */
  coverLine: string;
  /** Slug of the story the cover leads with. */
  leadStory: string;
};

/** A named passage on /about — the magazine explaining itself. */
export type AboutBlock = {
  heading: string;
  body: string[];
};
