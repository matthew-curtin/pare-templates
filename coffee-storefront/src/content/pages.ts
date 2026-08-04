import type { AboutBlock, Plan } from "./types";

/** Subscription frequencies on /subscribe. */
export const plans: Plan[] = [
  {
    id: "weekly",
    name: "Every week",
    cadence: "52 bags a year",
    discountPercent: 20,
    blurb:
      "For a household that gets through a bag in a week, or an office of about six people.",
  },
  {
    id: "fortnightly",
    name: "Every two weeks",
    cadence: "26 bags a year",
    discountPercent: 15,
    blurb:
      "What most people pick. A 250 g bag lasts roughly a fortnight at two cups a day.",
    featured: true,
  },
  {
    id: "monthly",
    name: "Every month",
    cadence: "12 bags a year",
    discountPercent: 10,
    blurb: "For weekend drinkers, or anyone who also has a cafe they like.",
  },
];

export const subscribeIntro = {
  title: "Pick a rhythm, not a coffee",
  body: "You tell us how often and how you brew. We choose the bag, roast it the night before, and post it. If we send you something you do not get on with, tell us and we will send a different one for nothing.",
};

export const subscribeFaq: { question: string; answer: string }[] = [
  {
    question: "Do I get to choose which coffee?",
    answer:
      "You can pin it to one coffee if you want, but most people let us choose — that is the point of the thing, and it is how you end up drinking something you would never have picked off a shelf.",
  },
  {
    question: "Can I skip a delivery?",
    answer:
      "Yes, from the account page, up to the Sunday before a Tuesday post. Skipping does not affect your discount.",
  },
  {
    question: "What if I am going away?",
    answer:
      "Pause it for as long as you like. We would rather you did that than have a bag going stale on a doormat for three weeks.",
  },
  {
    question: "Can I cancel?",
    answer:
      "At any time, from the same page, with no telephone call and no retention offer to decline.",
  },
];

export const aboutIntro =
  "Ridgeline is four people and a 15 kg roaster in a unit behind a tyre garage. We buy small lots, roast them the night before we post them, and put everything we know about the coffee on the bag.";

export const aboutBlocks: AboutBlock[] = [
  {
    heading: "How we buy",
    body: [
      "Everything here is a single lot from a farm, a co-operative or a washing station we can name, bought either directly or through two importers we have used since we started.",
      "We publish what we paid per kilo of green coffee against the going commodity rate for that month. It is on the bag and on each coffee's page. Not because it makes us look good — sometimes it does not — but because a shop that talks about relationships and will not show a number is asking to be taken on trust it has not earned.",
    ],
  },
  {
    heading: "How we roast",
    body: [
      "On a 15 kg drum roaster, in batches of nine to eleven kilos, Monday evening. Every batch is logged and the profiles are dull on purpose: we are trying to make the same coffee twice, not to express anything.",
      "Nothing is roasted more than a day before it is posted, and we do not hold roasted stock. If a coffee is sold out it is because we have not roasted more yet, and it will usually be back on the Tuesday after next.",
    ],
  },
  {
    heading: "Posting",
    body: [
      "Orders placed before midnight on Sunday go out on Tuesday. After that they wait for the following Tuesday. It is a slower promise than most shops make and it is the only way the roast date means anything.",
      "Bags are recyclable kerbside, without the valve needing removing. It took us two years to find one that did not also make the coffee stale.",
    ],
  },
  {
    heading: "The name",
    body: [
      "There is no story. Two of us grew up walking the same ridge and it was the only name all four of us could agree on inside a month.",
    ],
  },
];

/** The one-line honesty note in the footer of every page. */
export const disclaimer =
  "Ridgeline is a fictional roastery, made as a website template. The company, the farms, the producers, the prices and every claim on this site are invented, and nothing here takes a payment.";
