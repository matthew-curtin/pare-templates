/**
 * Shared content types.
 *
 * Everything the shop renders comes from the typed modules in this
 * folder — no copy or price is hardcoded inside a component. To change
 * what the shop sells, edit the data; to change how it looks, edit the
 * component.
 */

export type NavLink = {
  label: string;
  href: string;
};

/** How dark the roast is. Drives the scale drawn on a product page. */
export type RoastLevel = "light" | "medium-light" | "medium" | "medium-dark";

/** How the coffee cherry was processed after picking. */
export type Process = "Washed" | "Natural" | "Honey" | "Anaerobic";

/**
 * A bag size. Prices are in whole pence so the arithmetic in the cart
 * is exact — a subtotal computed by adding 12.5 to itself enough times
 * eventually shows 87.49999999999999, and a shop that does that once
 * in front of a customer has a real problem.
 */
export type Size = {
  /** Used in the URL and as part of the cart line id. */
  id: string;
  /** e.g. "250 g" */
  label: string;
  /** Whole pence. 1250 renders as £12.50. */
  pence: number;
};

/** How the beans are ground before posting. Does not affect price. */
export type Grind = {
  id: string;
  label: string;
  /** Shown under the option, e.g. "Pour-over, V60, Chemex". */
  hint: string;
};

/**
 * A tasting note score out of 5. Rendered as a bar chart on the
 * product page — see the note in `flavour-profile.tsx` about computing
 * the widths in pixels rather than percentages.
 */
export type Flavour = {
  label: string;
  /** 1–5. */
  score: number;
};

export type Coffee = {
  /** Used in the URL: /shop/ridgeline-house */
  slug: string;
  name: string;
  /** One line, shown on cards. */
  tagline: string;
  country: string;
  region: string;
  producer: string;
  /** e.g. "1,850–2,100 m" */
  altitude: string;
  varietal: string;
  process: Process;
  roast: RoastLevel;
  /** Three or four words, shown as chips: "Blackcurrant", "Cocoa". */
  notes: string[];
  flavour: Flavour[];
  /** Long description, one paragraph per entry. */
  description: string[];
  sizes: Size[];
  image: string;
  imageAlt: string;
  /** Shows a "Decaf" chip and excludes it from the subscription pitch. */
  decaf?: boolean;
  /** Promotes it to the home page. */
  featured?: boolean;
  /** Sold out coffees stay listed — a roastery's stock is seasonal and
   *  hiding them makes the shop look thinner than it is. */
  soldOut?: boolean;
};

/** One step in a brew guide, with its own timing. */
export type BrewStep = {
  /** Seconds from the start of the brew that this step begins. */
  at: number;
  title: string;
  detail: string;
};

export type BrewGuide = {
  slug: string;
  name: string;
  summary: string;
  /** e.g. "3 min 30 s" — shown on the card. */
  totalLabel: string;
  /** Total brew length in seconds; drives the timer. */
  totalSeconds: number;
  /** What you need, as plain lines. */
  kit: string[];
  ratio: string;
  grindLabel: string;
  waterLabel: string;
  steps: BrewStep[];
  image: string;
  imageAlt: string;
};

/** A subscription frequency offered on /subscribe. */
export type Plan = {
  id: string;
  name: string;
  /** e.g. "Every two weeks" */
  cadence: string;
  /** Percentage off the single-bag price, as a whole number. */
  discountPercent: number;
  blurb: string;
  featured?: boolean;
};

/** A block of body content used on /about. */
export type AboutBlock = {
  heading: string;
  body: string[];
};

/** One line in the cart. Grind and size make it distinct. */
export type CartLine = {
  /** `${coffeeSlug}:${sizeId}:${grindId}` — see lib/cart-store.ts. */
  id: string;
  coffeeSlug: string;
  sizeId: string;
  grindId: string;
  quantity: number;
};
