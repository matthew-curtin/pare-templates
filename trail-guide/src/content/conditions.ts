import type { Access, Report } from "./types";

/**
 * What is true on the ground right now, which on this route means water
 * more than it means weather.
 *
 * Dated against the pinned clock in `site.ts` (12 August 2026). Two of
 * these are warnings and four are notes, which is the ratio §7b asks
 * for: a page where every row is amber is a page with no warning on it.
 */
export const reports: Report[] = [
  {
    date: "2026-08-11",
    where: "Slatefall Hut",
    kind: "warning",
    body: "The spring behind the hut ran dry on the 9th. The warden is carrying up from the fall twice a day, and asks everyone coming from Pike Hollow to fill at the crossing an hour below rather than arrive empty.",
  },
  {
    date: "2026-08-10",
    where: "Ember Notch Hut",
    kind: "warning",
    body: "The seep at the notch is a trickle. Twenty minutes to fill two litres, and there were eleven people at the hut for six bunks on Saturday.",
  },
  {
    date: "2026-08-08",
    where: "Rimeplace Hut",
    kind: "note",
    body: "Tank at roughly a third. That is normal for mid-August and it has never emptied, but plan to arrive with water rather than to collect it.",
  },
  {
    date: "2026-08-06",
    where: "The Slate Ladder",
    kind: "note",
    body: "The cairn at the 4,300 ft bench came down in the storm on the 2nd and has been rebuilt taller. In cloud the line from there to the next one is the awkward part of the leg.",
  },
  {
    date: "2026-07-29",
    where: "Long Sedge Platforms",
    kind: "note",
    body: "Board out on platform four. It is usable but the near corner will take a peg badly; the wardens have it on the list for September.",
  },
  {
    date: "2026-07-21",
    where: "Coldwater Hut",
    kind: "note",
    body: "Resupply boxes are running about four days from posting. A box for the second week of August wants to be sent now.",
  },
];

/** The two ends of the season, and what actually decides them. */
export const seasonNotes = [
  {
    head: "Why it opens on 20 June",
    body: "The Slate Ladder and the Rime steps hold snow in their north-facing gullies until the third week of June in an ordinary year. It is walkable before then by people equipped for it, and the wardens do not pretend otherwise, but the huts are shuttered and the shuttle does not run.",
  },
  {
    head: "Why it closes on 5 October",
    body: "The tank at Rimeplace freezes. Everything else on the route could carry on for another month, and in a warm autumn people do — but the highest hut on the range with no water is not a shelter, it is a room.",
  },
  {
    head: "The two weeks nobody warns you about",
    body: "Black fly on the Ninebark flats peaks in the last week of June and the first of July. Seven miles of bog at a mile an hour is a long time to be a food source, and a head net weighs an ounce.",
  },
];

export const access: Access[] = [
  {
    head: "Kettleback Landing",
    body: "Nine miles of gravel off Route 12, driveable in anything with clearance. Nine cars fit at the turning circle and there is no overflow; on an August Saturday it is full by seven in the morning.",
  },
  {
    head: "Sable Gate",
    body: "A cattle grid and a lay-by on the Fallowdyke road. The shuttle stops here three times a day in season — 08:40, 13:10 and 17:35 — and once a day in the shoulder weeks either side.",
  },
  {
    head: "The shuttle",
    body: "Runs Kettleback to Sable Gate and back, twice daily, taking two hours twenty each way around the north end of the range. Booked through the same office as the huts. It is the only sensible way to walk the traverse without two cars.",
  },
  {
    head: "Leaving a car",
    body: "Most people leave one at Sable Gate and shuttle to the start, so that the end of the walk is the end of the walk. The lay-by is unwatched and the wardens are honest about what that means.",
  },
  {
    head: "Getting out early",
    body: "Coldwater and Fallowdyke both have road access and a warden with a vehicle. Four of the eleven legs have no way off at all, and two of them run back to back: from Slatefall over Cairnwell to The Cistern you are committed for two days, which is the part of the route to be honest with yourself about before starting it.",
  },
];
