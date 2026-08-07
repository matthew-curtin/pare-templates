import type { PrivateSpace } from "./types";

export const privateIntro: string[] = [
  "The room was not built for private dining, so we do it in the two ways the building actually allows: the long table at the back, or the whole place.",
  "Either way you eat the same food the rest of the room is eating, chosen from a shortened menu a week beforehand. We do not run a separate 'events' kitchen, because there is only one fire.",
];

export const spaces: PrivateSpace[] = [
  {
    name: "The long table",
    seated: 12,
    standing: null,
    detail:
      "One oak table at the back of the room, beside the fire. Not a separate room — you are in the restaurant, which most people decide they prefer. Available at lunch every day we open, and at 18:00 or 20:45 for dinner.",
    minimumSpend: null,
  },
  {
    name: "The yard",
    seated: 20,
    standing: 40,
    detail:
      "Covered, heated by the same fire, and open from May to September. Good for a drinks party that turns into supper. Weather is weather, and we will talk to you honestly about it a week ahead.",
    minimumSpend: 1200,
  },
  {
    name: "The whole restaurant",
    seated: 34,
    standing: 60,
    detail:
      "Every cover, the yard, the bar and both of us. Wednesdays and Sundays are the nights we can do this without turning away a full room, so those are the ones we quote first.",
    minimumSpend: 3600,
  },
];

/** What actually happens after you send the form. */
export const process: { step: string; detail: string }[] = [
  {
    step: "You send the form",
    detail: "Anything you already know. Dates you are considering is enough.",
  },
  {
    step: "Milo replies within two days",
    detail:
      "With what is free, a realistic cost, and the honest answer about whether we are the right room for it.",
  },
  {
    step: "We hold a date for a week",
    detail: "No deposit at this stage, and no obligation.",
  },
  {
    step: "Menu a week ahead",
    detail:
      "Chosen from whatever is on that week, with everyone's requirements written down.",
  },
];
