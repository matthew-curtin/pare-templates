import type { Question } from "./types";

/** How to get here. Rendered as a short list on /visit. */
export const gettingHere: { mode: string; detail: string }[] = [
  {
    mode: "On foot",
    detail:
      "Eight minutes from the fountains, up Christmas Steps and left at the top. The yard is easy to walk past — look for the door with the fire outside it.",
  },
  {
    mode: "By train",
    detail:
      "Twelve minutes' walk from Bristol Temple Meads, or four from a taxi at the rank.",
  },
  {
    mode: "By bus",
    detail:
      "The 8 and the 72 both stop at Colston Avenue, two minutes away.",
  },
  {
    mode: "Parking",
    detail:
      "There is none at the restaurant. Trenchard Street multi-storey is a four-minute walk and is free after 18:00.",
  },
  {
    mode: "Step-free access",
    detail:
      "The dining room, the bar and the accessible WC are all on one level, entered from the yard without a step. Please tell us when you book so we can seat you well.",
  },
];

export const faqs: Question[] = [
  {
    question: "Do you take walk-ins?",
    answer:
      "Six seats at the bar are held back for walk-ins every service, and they go early. Everything else is booked.",
  },
  {
    question: "Can you cater for allergies and dietary requirements?",
    answer:
      "Yes, and we would much rather know when you book than when you sit down. There is always a vegan main on the menu. We handle nuts, gluten and dairy every service, but the kitchen is one room and we cannot promise a dish is free of any trace of them.",
  },
  {
    question: "Is there a set menu, or a tasting menu?",
    answer:
      "No tasting menu. Lunch is two or three courses at a fixed price; dinner is à la carte. For parties of seven or more we ask everyone to eat from a shortened version of the same menu, chosen a week ahead.",
  },
  {
    question: "Can we bring our own wine?",
    answer:
      "On Wednesdays, with £20 corkage a bottle and a limit of two per table. Not at weekends — the list is short and it is how the room pays for itself.",
  },
  {
    question: "Are children welcome?",
    answer:
      "Very. There is no separate children's menu, but the kitchen will happily cook a smaller plate of whatever is on. High chairs — we have two, so mention it when you book.",
  },
  {
    question: "What if we are running late?",
    answer:
      "Ring us. We hold a table for fifteen minutes, and after that on a full night we may have to give it up. It is a thirty-four cover room and the second sitting is already on its way.",
  },
  {
    question: "How do I cancel or change a booking?",
    answer:
      "The confirmation email has a link, or ring the restaurant. We ask for a day's notice on tables of six or more; below that, whenever you know.",
  },
];
