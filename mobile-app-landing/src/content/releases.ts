import type { Release } from "./types";

/** Newest first. Shown on /download. */
export const releases: Release[] = [
  {
    version: "4.2",
    date: "2026-07-22",
    summary:
      "Separate weekend schedules, and a much better first night for people without a watch.",
    changes: [
      "Set a different wake window for weekends",
      "Phone-only sleep staging is noticeably sharper in the first hour",
      "Sound mixes can be shared with anyone on a Family plan",
      "Fixed the wind-down starting an hour out for two weeks after a clock change",
    ],
  },
  {
    version: "4.1",
    date: "2026-06-09",
    summary: "Offline downloads by collection, and a faster morning screen.",
    changes: [
      "Download a whole collection rather than one track at a time",
      "The morning summary opens instantly instead of after a spinner",
      "Wear OS complication showing last night at a glance",
      "Fixed a crash when a night ran past a device restart",
    ],
  },
  {
    version: "4.0",
    date: "2026-04-30",
    summary:
      "A rebuilt alarm that reads the whole window, and the weekly note.",
    changes: [
      "The alarm now models the full window rather than the last ten minutes",
      "One weekly note in plain language, based on five nights or more",
      "Month-on-month comparison",
      "Twelve new hours of rain",
    ],
  },
  {
    version: "3.8",
    date: "2026-03-11",
    summary: "Sleep stories, and CSV export.",
    changes: [
      "Sleep stories, with a new one each week",
      "Export your whole history as CSV",
      "Fixed sound continuing to play after the fade had finished",
    ],
  },
];
