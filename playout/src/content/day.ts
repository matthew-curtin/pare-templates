import type { HourPlan } from "./types.ts";

/**
 * Thursday, hour by hour.
 *
 * The clock in `shows.ts` says what shape an hour is. This says what is
 * different about THIS one: which underwriters are in it, and anything
 * dropped in on the day. Everything else — which records, how long the
 * back-announce runs, whether the hour lands — is worked out by
 * `src/lib/scheduler.ts` from the clock and the library, the same way a
 * station's own scheduler would.
 *
 * Broadcast hours run 6 to 29, so 25 is one in the morning and the
 * overnight belongs to the day it started in.
 *
 * Three hours are deliberately not clean, because a console whose every
 * hour is fine is a console nobody can judge (§7b):
 *
 *   14  a late insert leaves the back-announce nothing to give, so the
 *       hour runs long into a junction it cannot move
 *   19  Local Cuts asks for more Cape Wren records than exist
 *   21  built but not signed off, which is the state most hours are in
 *       at this time of day
 */
export const day: HourPlan[] = [
  { h: 6, showId: "first-light", spots: ["coop", "ferry"] },
  { h: 7, showId: "first-light", spots: ["boatworks", "chowder"] },
  { h: 8, showId: "first-light", spots: ["coop", "physio"] },

  { h: 9, showId: "long-table", spots: ["books", "vet"] },
  { h: 10, showId: "long-table", spots: ["coop", "boatworks"] },
  { h: 11, showId: "long-table", spots: ["ferry", "chowder"] },

  { h: 12, showId: "bay-notices", spots: ["coop", "physio"] },

  { h: 13, showId: "afternoon-drift", spots: ["boatworks", "vet"] },
  {
    h: 14,
    showId: "afternoon-drift",
    spots: ["coop", "chowder"],
    insert: {
      after: 11,
      kind: "news",
      title: "Insert — harbourmaster, live: bar closed to small craft",
      s: 195,
    },
    note: "The harbourmaster called it in at 14:29 and it went to air live at 14:31. Three and a quarter minutes the hour did not have, in the back half where the back-announce is all there is left to give.",
  },
  { h: 15, showId: "afternoon-drift", spots: ["ferry", "books"] },

  { h: 16, showId: "crossing", spots: ["boatworks", "coop", "physio"] },
  { h: 17, showId: "crossing", spots: ["chowder", "ferry", "vet"] },
  {
    h: 18,
    showId: "crossing",
    spots: ["boatworks", "cider"],
    note: "Kestrel Ridge finished on Wednesday. Nobody took it off the wheel.",
  },

  {
    h: 19,
    showId: "local-cuts",
    spots: [],
    note: "Fourteen local records an hour out of a category of nine. The repeats are not a scheduling mistake — see /rules.",
  },

  { h: 20, showId: "the-slack", spots: [] },
  {
    h: 21,
    showId: "the-slack",
    spots: [],
    draft: true,
    note: "Built, not signed off. Ines is on air until ten and reads the second hour through in the first.",
  },

  { h: 22, showId: "automation", spots: [] },
  { h: 23, showId: "automation", spots: [] },
  { h: 24, showId: "automation", spots: [] },
  { h: 25, showId: "automation", spots: [] },

  { h: 26, showId: "passing-notes", spots: [] },
  { h: 27, showId: "passing-notes", spots: [] },
  { h: 28, showId: "passing-notes", spots: [] },
  { h: 29, showId: "passing-notes", spots: [] },
];
