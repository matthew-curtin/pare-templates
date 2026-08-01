import type { PressAsset, PressMention } from "./types";

/**
 * The press kit. Every app of any size has one of these pages, and it
 * is always the same shape: a boilerplate paragraph a journalist can
 * paste, some hard facts, assets to download, and a name to contact.
 */
export const pressKit = {
  /** The paragraph we would like quoted, written to be quotable. */
  boilerplate:
    "Lull is a sleep app for people who are tired of being told they slept badly. It builds an evening routine you will actually follow, plays four hundred hours of sound recorded not to loop, and wakes you at the lightest point of a window you choose rather than at a minute you picked. It works with the phone alone, records nothing to disk, and does not sell anything about you. Lull was founded in 2023 and is based in Bristol.",
  facts: [
    { label: "Founded", value: "2023, Bristol" },
    { label: "Team", value: "Nine people" },
    { label: "Funding", value: "Independent, no outside investment" },
    { label: "Platforms", value: "iOS, Android, Apple Watch, Wear OS" },
    { label: "Downloads", value: "3.1 million" },
    { label: "Rating", value: "4.8 across 62,400 reviews" },
  ],
  contact: {
    name: "Isobel Kerr",
    role: "Communications",
    email: "press@lull.example",
    note: "Happy to arrange a demo account, or an interview with a founder. We usually reply within a day.",
  },
};

export const pressAssets: PressAsset[] = [
  {
    name: "Logo pack",
    description:
      "The wordmark and the mark on their own, in light and dark, as SVG and PNG.",
    meta: "ZIP · 840 KB",
  },
  {
    name: "App screenshots",
    description:
      "Twelve screens at device resolution, iPhone and Android, in both themes.",
    meta: "ZIP · 18.4 MB",
  },
  {
    name: "Founder portraits",
    description: "Both founders, high resolution, photographed by Anna Whyte.",
    meta: "ZIP · 6.1 MB",
  },
  {
    name: "Brand guidelines",
    description:
      "Colour, type, spacing, and the two things we would rather you did not do to the logo.",
    meta: "PDF · 2.3 MB",
  },
];

export const pressMentions: PressMention[] = [
  {
    outlet: "The Evening Standard",
    quote:
      "The first sleep app that seems genuinely uninterested in making you anxious about sleeping.",
    date: "2026-05-04",
  },
  {
    outlet: "Wirecutter Weekly",
    quote:
      "The wake window is the feature everyone else copied badly. Lull's is the one that works.",
    date: "2026-03-19",
  },
  {
    outlet: "Field Guide",
    quote:
      "Four hundred hours of sound and not one obvious loop in any of it.",
    date: "2026-02-27",
  },
];
