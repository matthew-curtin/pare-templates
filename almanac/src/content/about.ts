import type { PriceTier, Question } from "./types";

export const about = {
  intro: [
    "Almanac lists vacancies in councils, the NHS, schools and universities, housing associations, museums and charities. It is read by people who already work in the sector and by people trying to get into it, which is why it says what things pay.",
    "It is run by two people from a room above a bakery in Leeds. Every listing is read by one of them before it goes up. That is slow, and it is the only part of this we are not willing to automate.",
  ],
  people: [
    {
      name: "Ruth Aliyeva",
      role: "Editor",
      note: "Fifteen years in local government communications, most of it explaining decisions she disagreed with. Reads every listing.",
    },
    {
      name: "Sam Oduya",
      role: "Everything else",
      note: "Builds and runs the site, invoices the employers, and answers the email. Previously a data analyst in an NHS trust.",
    },
  ],
  policy: {
    heading: "What we will and will not list",
    body: [
      "Every listing must state what the job pays. Not \"competitive\", not \"depending on experience\", not a range so wide it means nothing. This costs us listings and we are keeping it.",
      "Two listings on the board at the moment have no salary on them. They were placed before the policy applied to renewals, we have asked both employers to add a figure, and in the meantime those listings sit at the bottom of the pay sort and are excluded from any salary filter. It seemed more honest than quietly deleting them.",
    ],
    points: [
      "Public sector, higher and further education, housing associations, and registered charities. Not agencies advertising on their behalf.",
      "A salary, a day rate, or an honest statement that the role is unpaid.",
      "A named closing date. We will not list a vacancy that closes \"when filled\" — that is not a date, and it makes the board unusable.",
      "Part-time salaries shown as the full-time band with the actual figure alongside it, because \"pro rata\" on its own has misled people for decades.",
    ],
  },
  closed: {
    heading: "Why closed vacancies stay up",
    body: [
      "A listing that has closed disappears from the board but keeps its page. People share these links — in group chats, in emails to a friend, in a message to someone on maternity leave — and a link that 404s two weeks later tells you nothing about what happened.",
      "The page says plainly that it has closed, and points at the employer's other vacancies.",
    ],
  },
};

export const questions: Question[] = [
  {
    q: "How do you decide what counts as a salary?",
    a: [
      "A band, a single figure, an hourly rate or a day rate. Any of those is fine. \"Competitive\" is not, and neither is a band from £25,000 to £70,000.",
      "For part-time roles we ask for the full-time band, because that is how the sector advertises, and then we calculate and show the actual figure ourselves.",
    ],
  },
  {
    q: "Why does the pay sort put some vacancies at the bottom?",
    a: [
      "Because there is nothing to sort them by. A voluntary role, a casual role paid by the hour with no guaranteed hours, and a listing with no salary on it are all genuinely uncomparable to a salaried post.",
      "The alternative is to invent a number — assume a casual worker does 20 hours a week, say — and sort by that. We would rather show them at the end and say why.",
    ],
  },
  {
    q: "Does a salary filter include a job that pays a range?",
    a: [
      "Yes, if the top of the range reaches your figure. The question a filter answers is \"could this job pay me that\", so it compares against the top.",
      "The pay sort does the opposite and compares the bottom, because the question there is \"what would I be starting on\". Same data, two different questions.",
    ],
  },
  {
    q: "Can I get these by email?",
    a: [
      "Yes. Build a search on the alerts page and we will send matching vacancies daily or weekly. The page shows you how many current vacancies your alert would have caught, which is the only honest way to know whether it is too narrow.",
    ],
  },
  {
    q: "How much does it cost to advertise?",
    a: [
      "£180 for a standard listing, £320 to feature it, and £60 for registered charities with an income under £1m. Prices are on the advertise page.",
      "We do not do bulk deals, discounts for volume, or free listings in exchange for a link.",
    ],
  },
  {
    q: "Do you take listings from recruitment agencies?",
    a: [
      "No. Not because agencies are bad, but because a board where the same job appears four times under four agency names is a worse board, and readers cannot tell which is which.",
    ],
  },
];

export const priceTiers: PriceTier[] = [
  {
    id: "charity",
    name: "Charity rate",
    price: 60,
    duration: "30 days",
    blurb:
      "For registered charities with an annual income under £1m. No application, no proof required — we take your word for it.",
    includes: [
      "30 days on the board",
      "Included in daily and weekly alerts",
      "Edits at any time, by email",
    ],
  },
  {
    id: "standard",
    name: "Standard listing",
    price: 180,
    duration: "30 days",
    blurb:
      "The ordinary listing. Everything a vacancy needs and nothing that only exists to be upgraded from.",
    includes: [
      "30 days on the board",
      "Included in daily and weekly alerts",
      "Your organisation's page, with all your current vacancies",
      "Edits at any time, by email",
    ],
    highlight: true,
  },
  {
    id: "featured",
    name: "Featured listing",
    price: 320,
    duration: "30 days",
    blurb:
      "Held at the top of the board for the first fourteen days and marked as featured for the full run. We cap these at four at a time, so it stays worth something.",
    includes: [
      "Everything in a standard listing",
      "Top of the board for 14 days",
      "Marked as featured for the full 30",
      "Named in the weekly alert's opening section",
    ],
  },
];

export const postingRules = [
  "A salary, a day rate, or a plain statement that the role is unpaid.",
  "A closing date. Not \"until filled\".",
  "The hours, and if it is part time, the hours a week rather than a decimal.",
  "Whether it is on site, hybrid or remote — and if hybrid, how many days.",
  "A named contact who will actually answer.",
];
