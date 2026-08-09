import type { PriceTier, Question } from "./types";

export const about = {
  intro: [
    "Almanac lists jobs in city and county government, health systems, schools and universities, housing authorities, museums and nonprofits. It is read by people who already work in the sector and by people trying to get into it, which is why it says what things pay.",
    "It is run by two people from an office above a bakery in Wrenfield. Every posting is read by one of them before it goes up. That is slow, and it is the only part of this we are not willing to automate.",
  ],
  people: [
    {
      name: "Ruth Aliyeva",
      role: "Editor",
      note: "Fifteen years in county communications, most of it explaining decisions she disagreed with. Reads every posting.",
    },
    {
      name: "Sam Oduya",
      role: "Everything else",
      note: "Builds and runs the site, invoices the employers, and answers the email. Previously a data analyst at a health system.",
    },
  ],
  policy: {
    heading: "What we will and will not list",
    body: [
      "Every posting must state what the job pays. Not \"competitive\", not \"depending on experience\", not a range so wide it means nothing. This costs us postings and we are keeping it.",
      "Two postings on the board at the moment have no salary on them. They were placed before the policy applied to renewals, we have asked both employers to add a figure, and in the meantime those postings sit at the bottom of the pay sort and are excluded from any salary filter. It seemed more honest than quietly deleting them.",
    ],
    points: [
      "Government, public education, housing authorities, and 501(c)(3) organizations. Not staffing agencies advertising on their behalf.",
      "A salary, an hourly rate, a day rate, or an honest statement that the position is unpaid.",
      "A named closing date. We will not list a job that closes \"when filled\" — that is not a date, and it makes the board unusable.",
      "Part-time salaries shown as what the job actually pays, with the full-time range beside it, because \"prorated\" on its own has misled people for decades.",
    ],
  },
  closed: {
    heading: "Why closed postings stay up",
    body: [
      "A posting that has closed disappears from the board but keeps its page. People share these links — in group chats, in emails to a friend, in a message to someone on leave — and a link that 404s two weeks later tells you nothing about what happened.",
      "The page says plainly that it has closed, and points at the employer's other openings.",
    ],
  },
};

export const questions: Question[] = [
  {
    q: "How do you decide what counts as a salary?",
    a: [
      "A range, a single figure, an hourly rate or a day rate. Any of those is fine. \"Competitive\" is not, and neither is a range from $25,000 to $150,000.",
      "For part-time positions we ask for the full-time range, because that is how the sector posts, and then we calculate and show the actual figure ourselves.",
    ],
  },
  {
    q: "Why does the pay sort put some jobs at the bottom?",
    a: [
      "Because there is nothing to sort them by. A volunteer position, an on-call position paid by the hour with no guaranteed hours, and a posting with no salary on it are all genuinely uncomparable to a salaried job.",
      "The alternative is to invent a number — assume an on-call worker does 20 hours a week, say — and sort by that. We would rather show them at the end and say why.",
    ],
  },
  {
    q: "Does a salary filter include a job that posts a range?",
    a: [
      "Yes, if the top of the range reaches your figure. The question a filter answers is \"could this job pay me that\", so it compares against the top.",
      "The pay sort does the opposite and compares the bottom, because the question there is \"what would I be starting on\". Same data, two different questions.",
    ],
  },
  {
    q: "Can I get these by email?",
    a: [
      "Yes. Build a search on the alerts page and we will send matching jobs daily or weekly. The page shows you how many current jobs your alert would have caught, which is the only honest way to know whether it is too narrow.",
    ],
  },
  {
    q: "How much does it cost to post a job?",
    a: [
      "$195 for a standard posting, $345 to feature it, and $65 for 501(c)(3) organizations with revenue under $1M. Prices are on the posting page.",
      "We do not do bulk deals, volume discounts, or free postings in exchange for a link.",
    ],
  },
  {
    q: "Do you take postings from staffing agencies?",
    a: [
      "No. Not because agencies are bad, but because a board where the same job appears four times under four agency names is a worse board, and readers cannot tell which is which.",
    ],
  },
];

export const priceTiers: PriceTier[] = [
  {
    id: "nonprofit",
    name: "Nonprofit rate",
    price: 65,
    duration: "30 days",
    blurb:
      "For 501(c)(3) organizations with annual revenue under $1M. No application, no proof required — we take your word for it.",
    includes: [
      "30 days on the board",
      "Included in daily and weekly alerts",
      "Edits at any time, by email",
    ],
  },
  {
    id: "standard",
    name: "Standard posting",
    price: 195,
    duration: "30 days",
    blurb:
      "The ordinary posting. Everything a job needs and nothing that only exists to be upgraded from.",
    includes: [
      "30 days on the board",
      "Included in daily and weekly alerts",
      "Your organization's page, with all your current openings",
      "Edits at any time, by email",
    ],
    highlight: true,
  },
  {
    id: "featured",
    name: "Featured posting",
    price: 345,
    duration: "30 days",
    blurb:
      "Held in the featured strip at the top of the board for the first fourteen days and marked as featured for the full run. We cap these at four at a time, so it stays worth something.",
    includes: [
      "Everything in a standard posting",
      "Featured strip for 14 days",
      "Marked as featured for the full 30",
      "Named in the weekly alert's opening section",
    ],
  },
];

export const postingRules = [
  "A salary, an hourly rate, a day rate, or a plain statement that the position is unpaid.",
  "A closing date. Not \"until filled\".",
  "The hours, and if it is part time, the hours a week rather than a decimal.",
  "Whether it is on site, hybrid or remote — and if hybrid, how many days.",
  "A named contact who will actually answer.",
];
