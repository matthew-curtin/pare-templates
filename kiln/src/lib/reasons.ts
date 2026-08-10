import type { Reason } from "./schedule.ts";

/**
 * The eight answers to "why is this still on the shelf", as words.
 *
 * In their own module with no runtime imports, because the queue's
 * filter is a client component and importing this vocabulary from
 * `studio.ts` would drag the whole simulation — every piece, the packer,
 * the rota — into the browser bundle to render eight labels.
 *
 * The ORDER is not alphabetical and not by size. The first two are the
 * ones somebody can act on this afternoon; the last two are facts about
 * the studio that no amount of hurrying changes.
 */
export const REASON_ORDER: Reason[] = [
  "you",
  "nothing",
  "empty",
  "load",
  "size",
  "drying",
  "next",
  "calendar",
];

export const REASON_LABEL: Record<Reason, string> = {
  next: "On the next firing",
  load: "The kiln filled up",
  empty: "The kiln did not light",
  calendar: "Waiting for the rota",
  size: "Too big for the next one",
  drying: "Still too wet",
  you: "Waiting for you",
  nothing: "Nothing will take it",
};

export const REASON_NOTE: Record<Reason, string> = {
  next: "Packed, and going in.",
  load: "Offered to a kiln that ran out of room before it got there. It goes to the front of the next load, which is the studio's only fairness rule.",
  empty: "Ready for a firing that never lit, because not enough other work was ready for the same one. This is the wait nobody expects and the reason this site exists.",
  calendar: "Nothing is wrong. The next firing of this kind has not come round yet.",
  size: "It fits a kiln, just not the one firing its programme soonest. Height, not luck.",
  drying: "Greenware goes in bone dry or it comes apart. There is no way to hurry this and every reason not to.",
  you: "Out of the bisque, and nobody has chosen a glaze. The studio cannot schedule what it cannot name.",
  nothing: "Taller than the inside of every kiln in the building.",
};
