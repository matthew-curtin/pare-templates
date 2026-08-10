import type { NavItem } from "./types.ts";

/**
 * Who this is and what it says about itself.
 *
 * Every number quoted in prose anywhere on this site is computed from
 * `catalogue.ts` and `structure.ts` rather than typed here — the claims
 * below are the arguments, not the figures. Where a sentence depends on
 * a figure holding a particular relationship (the constraint being
 * cheap, the lead time being far shorter than the sum), that
 * relationship is asserted in scripts/check-bom.mjs, because a number
 * nudged six months from now would otherwise quietly turn a true
 * sentence into a false one and nothing would fail.
 */
export const site = {
  name: "Spaakwerk",
  place: "Merwesluis",
  tagline: "Nine people, two bicycles, and the whole parts list in the open.",

  /** The h1 on the board. Deliberately not the same sentence as the
   *  lede underneath it — a heading and its own first paragraph opening
   *  identically is the commonest way a page reads as unedited. */
  claim: "What we can build this morning",

  lede: "Every bicycle here is a tree of about a hundred parts, and on any given day one of them is the reason there are not more. This is that tree, with the arithmetic left in.",

  address: "Werf 14, Merwesluis",
  hours: "Workshop open Tuesday to Saturday, 9 to 5. Collections any time we are in.",

  /** What the two bikes sell for. The parts figure beside them is
   *  computed, so the gap on the page is a real subtraction rather than
   *  a claim about one. */
  retail: { kade: 189500, vaart: 234000 },

  /** What a customer is told when they order one. The model says 49 and
   *  50 days; we say ten weeks, and the method page explains why the
   *  difference is honesty rather than padding. */
  quotedWeeks: 10,
} as const;

export const nav: NavItem[] = [
  { to: "/", label: "Board" },
  { to: "/tree", label: "Tree" },
  { to: "/parts", label: "Parts" },
  { to: "/orders", label: "Orders" },
  { to: "/builds", label: "Builds" },
  { to: "/method", label: "Method" },
];

export const footer = {
  note: "Spaakwerk is invented — the workshop, the nine people, the two bicycles, the suppliers and every number attached to them. It is a template for Pare, not a bicycle you can buy.",
  columns: [
    {
      title: "The shop",
      links: [
        { to: "/tree", label: "Both bills of materials" },
        { to: "/parts", label: "Every part we buy" },
        { to: "/method", label: "How the numbers work" },
      ],
    },
    {
      title: "This week",
      links: [
        { to: "/", label: "What we can build" },
        { to: "/builds", label: "What we have promised" },
        { to: "/orders", label: "What is on its way" },
      ],
    },
  ],
};

/**
 * The three sentences the board is built to deliver, in the order it
 * delivers them. Kept here rather than inline because each one is
 * checked: `scripts/check-bom.mjs` asserts the relationship every one
 * of these depends on, by name.
 */
export const findings = [
  {
    id: "cheap",
    title: "The part stopping you is almost never the expensive one",
    body: "The five parts nearest to halting a Kade cost seventy cents between them, and the dearest of the five is a spoke. The hub gear — the most expensive thing we buy, at €182 — would have let us build nineteen. Nobody has ever run out of it.",
  },
  {
    id: "longest",
    title: "Delivery is the longest chain, not the sum",
    body: "Add up the lead times of everything in a Kade and you get seven hundred and seventy-four days. The bike takes forty-nine, because parts are ordered on the same morning and wait alongside each other. Fifty-five of the fifty-eight could be a fortnight late and change nothing.",
  },
  {
    id: "recoverable",
    title: "Cheap stops you today; long-lead stops you in six weeks",
    body: "That is the split worth knowing, and it is not cheap against expensive. A shortage of nipples is a phone call and a fortnight. A shortage of wound hub shells is a date in the third week of April that nobody can move, and it is the only part in the building with no slack at all.",
  },
];
