import type { Question, TicketTier } from "./types";

/**
 * Four tiers, one of them gone.
 *
 * A price list where everything is still available is a price list
 * nobody used — §7b. The bursary tier being the one that sold out is
 * also the honest outcome, and the page says what happens next rather
 * than leaving a dead row on the grid.
 */
export const tiers: TicketTier[] = [
  {
    id: "bursary",
    name: "Bursary",
    price: 0,
    blurb:
      "Forty places, funded by the Supporter tier. No means test and no form beyond a name.",
    includes: [
      "All three days",
      "Lunch, coffee and the reception",
      "Travel costs to $200 on request",
    ],
    soldOut: true,
  },
  {
    id: "community",
    name: "Community",
    price: 95,
    blurb:
      "For volunteers, co-ops, small museums, and anyone paying for this themselves.",
    includes: [
      "All three days",
      "Lunch, coffee and the reception",
      "Workshop ballot entry",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 340,
    blurb: "The ordinary ticket. If your employer is paying, this is the one.",
    includes: [
      "All three days",
      "Lunch, coffee and the reception",
      "Workshop ballot entry",
      "Session recordings, indefinitely",
    ],
    highlight: true,
  },
  {
    id: "supporter",
    name: "Supporter",
    price: 620,
    blurb:
      "The same conference, at a price that funds seven bursary places. Nothing extra, on purpose.",
    includes: [
      "Everything in Standard",
      "Funds seven bursary places",
      "Named in the programme, if you want to be",
    ],
  },
];

export const ticketNotes = [
  "Workshops are balloted rather than first-come. Both have capacity in the twenties and both would otherwise be gone in ninety seconds.",
  "Every ticket includes lunch on all three days, coffee throughout, and the Thursday reception. Nothing at Overlap costs extra once you are through the door.",
  "If the price is the only thing stopping you, write to us. The bursary tier is sold out but we hold places back for exactly this.",
];

export const questions: Question[] = [
  {
    q: "Are the sessions recorded?",
    a: [
      "Talks and keynotes are, and they go up about three weeks afterwards. Workshops are not — they do not survive the format, and people speak more freely without a camera in a room of twenty.",
    ],
  },
  {
    q: "Can I come for one day?",
    a: [
      "Not as a ticket type, because the three days are built as an argument that develops. If a single day is genuinely all you can do, write to us and we will sort something out rather than have you not come.",
    ],
  },
  {
    q: "Is there childcare?",
    a: [
      "Yes, on all three days, free, in the Drawing Office annexe. It needs booking two weeks ahead so we can staff it properly.",
    ],
  },
  {
    q: "What is the food like?",
    a: [
      "Vegetarian by default with everything labelled, cooked on site, and served in the Yard. Tell us about allergies when you book and it will be handled without a conversation on the day.",
    ],
  },
  {
    q: "I want to speak next year.",
    a: [
      "The call opens in February and stays open for six weeks. About a third of the programme each year comes from people who have never given a conference talk, which is deliberate and takes work.",
    ],
  },
];
