import type { Issue, Plan } from "./types";

/**
 * Subscription offers and the print editions, used on /subscribe and by
 * the cover mockup on the home page.
 *
 * Prices are in whole pounds per year. Nothing here takes a payment —
 * the buttons are inert.
 */
export const plans: Plan[] = [
  {
    id: "digital",
    name: "Digital",
    yearly: 32,
    tagline: "Everything we publish, the day we publish it.",
    includes: [
      "Every story on the site, unmetered",
      "The full archive back to 2019",
      "The monthly letter",
    ],
  },
  {
    id: "print",
    name: "Print & digital",
    yearly: 68,
    tagline: "Four issues a year, posted, plus everything above.",
    featured: true,
    includes: [
      "Four print issues, posted worldwide",
      "Everything in Digital",
      "Access to the issue PDFs",
      "A tote we are slightly embarrassed about",
    ],
  },
  {
    id: "institution",
    name: "Institutional",
    yearly: 240,
    tagline: "For libraries, studios and schools.",
    includes: [
      "Up to forty named readers",
      "Three print copies per issue",
      "Classroom reprint permissions",
      "An invoice your finance office will accept",
    ],
  },
];

/** The issue on the shelf now — drives the cover mockup. */
export const currentIssue: Issue = {
  number: 28,
  season: "Summer 2026",
  coverLine: "The City That Learned to Flood",
  leadStory: "the-city-that-learned-to-flood",
};

/** Shown as a small grid under the plans. */
export const pastIssues: Issue[] = [
  {
    number: 27,
    season: "Spring 2026",
    coverLine: "Two Hundred Coats",
    leadStory: "two-hundred-coats",
  },
  {
    number: 26,
    season: "Winter 2025",
    coverLine: "Reading a Field by Its Weeds",
    leadStory: "reading-a-field-by-its-weeds",
  },
  {
    number: 25,
    season: "Autumn 2025",
    coverLine: "Salt Road",
    leadStory: "salt-road",
  },
];

export const subscribeIntro = {
  title: "Four times a year, at length",
  body: "Meridian has no advertising and no proprietor. Subscriptions are the whole of the income, which is why we can spend eleven months on a story about a square that floods, and why we are asking.",
};

export const subscribeFaq: { question: string; answer: string }[] = [
  {
    question: "When does the next issue arrive?",
    answer:
      "Issues post in the first week of March, June, September and December. If you subscribe today you will receive the current issue within a fortnight, and the next one on schedule.",
  },
  {
    question: "Can I read everything without a print subscription?",
    answer:
      "Yes. Digital carries every story we publish, including the full archive. The print edition exists because some stories are better at that size, not because we hold anything back.",
  },
  {
    question: "Do you sell single issues?",
    answer:
      "We do, through independent bookshops, and directly when stock allows. Back issues before number 19 are out of print, though every story remains on the site.",
  },
  {
    question: "Can I cancel?",
    answer:
      "At any time, and we refund the unposted issues. There is no telephone call to make and no retention offer to decline.",
  },
];
