import type { VenueSpace } from "./types";

export const venue = {
  name: "The Ironhouse",
  address: ["1400 Smallman Street", "Pittsburgh, PA 15222"],
  about: [
    "The Ironhouse is a rolling mill that stopped rolling in 1981 and spent nineteen years empty before anyone worked out what to do with it. What they did was almost nothing: the roof was made sound, the floor was levelled, services were run in from one end, and the rest was left alone.",
    "It is a good building for this conference specifically because you can see all of that. Nothing is hidden behind a lining. Every intervention since 2000 is visible and datable, which makes the venue itself a reasonable first exhibit.",
  ],
};

export const spaces: VenueSpace[] = [
  {
    name: "Foundry",
    detail: "The main hall. 420 seats, raked, with the original crane rail overhead.",
    step: false,
    loop: true,
  },
  {
    name: "Boiler House",
    detail: "180 seats, flat floor, at the east end past the café.",
    step: false,
    loop: true,
  },
  {
    name: "Drawing Office",
    detail: "90 seats and the bench room for workshops. First floor.",
    step: true,
    loop: true,
  },
  {
    name: "Yard",
    detail: "120 seats under a permanent canopy. Heated, and genuinely warm.",
    step: false,
    loop: false,
  },
];

export const access = [
  "Step-free from Smallman Street to everything on the ground floor. The Drawing Office is first-floor and reached by a lift large enough for a wheelchair and a companion.",
  "Hearing loops in the Foundry, Boiler House and Drawing Office. The Yard has no loop; the Yard sessions are the ones we caption live instead.",
  "Live captioning in every room, on screens rather than only in the app, all three days.",
  "A quiet room off the Drawing Office landing, unbookable and never used for anything else. On Friday the Boiler House is also quiet space from 10:25.",
  "Toilets on both floors, including accessible and gender-neutral on the ground floor.",
];

export const travel = [
  {
    head: "By train",
    body: "Pittsburgh Union Station is a fifteen-minute walk along Smallman Street, or four minutes in a cab.",
  },
  {
    head: "By bus",
    body: "The 54 and the 91 both stop at 16th and Smallman, two minutes away. Both are step-free.",
  },
  {
    head: "By bike",
    body: "Racks for about sixty bikes inside the gate, covered and overlooked. There is a repair stand and a track pump, which we would not normally mention except that Olek is speaking.",
  },
  {
    head: "By car",
    body: "There is no parking at the Ironhouse. The Strip District garage on 17th is a five-minute walk and takes about 400 cars.",
  },
];
