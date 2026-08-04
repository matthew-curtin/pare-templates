import type { TrackedEvent } from "./types";

/**
 * The event catalogue behind /events. Sortable and filterable in the
 * table; each row has its own page.
 *
 * `trend` is 14 daily counts, oldest first, drawn as a sparkline.
 */
export const events: TrackedEvent[] = [
  {
    id: "page-viewed",
    name: "page_viewed",
    kind: "page",
    volume: 1_284_400,
    changePercent: 6.4,
    teams: 2_910,
    lastSeen: "2026-08-03T21:58:00Z",
    owner: "Web",
    description:
      "Fired on every route change, including client-side navigation. The highest-volume event by a wide margin, and the one most worth sampling if ingest costs become a problem.",
    trend: [88, 91, 86, 52, 48, 94, 97, 95, 99, 93, 57, 51, 101, 104],
  },
  {
    id: "project-created",
    name: "project_created",
    kind: "track",
    volume: 18_240,
    changePercent: 11.2,
    teams: 1_744,
    lastSeen: "2026-08-03T21:44:00Z",
    owner: "Core",
    description:
      "A team created a new project. The closest thing we have to an activation signal, and the second stage of the funnel is built on it.",
    trend: [42, 44, 41, 22, 19, 46, 48, 47, 51, 49, 26, 23, 53, 55],
  },
  {
    id: "export-run",
    name: "export_run",
    kind: "track",
    volume: 9_615,
    changePercent: -3.8,
    teams: 612,
    lastSeen: "2026-08-03T20:12:00Z",
    owner: "Reporting",
    description:
      "Someone exported a report to CSV. Falling steadily since the scheduled-reports feature shipped, which is the outcome we wanted.",
    trend: [31, 30, 29, 16, 14, 28, 27, 26, 27, 25, 13, 12, 24, 23],
  },
  {
    id: "member-invited",
    name: "member_invited",
    kind: "track",
    volume: 7_402,
    changePercent: 18.9,
    teams: 1_188,
    lastSeen: "2026-08-03T19:31:00Z",
    owner: "Core",
    description:
      "An invitation was sent. Rising sharply since invites stopped requiring an admin seat — worth watching that it converts rather than just being sent.",
    trend: [18, 19, 20, 11, 9, 22, 24, 25, 27, 26, 14, 13, 29, 31],
  },
  {
    id: "identify",
    name: "identify",
    kind: "identify",
    volume: 214_880,
    changePercent: 5.1,
    teams: 2_874,
    lastSeen: "2026-08-03T21:59:00Z",
    owner: "SDK",
    description:
      "Associates the current session with a known person. Sent on sign-in and whenever traits change, which is why the volume is higher than sign-ins alone would suggest.",
    trend: [71, 73, 70, 41, 38, 75, 77, 76, 79, 78, 44, 41, 81, 83],
  },
  {
    id: "ingest-rejected",
    name: "ingest_rejected",
    kind: "error",
    volume: 3_118,
    changePercent: 42.7,
    teams: 96,
    lastSeen: "2026-08-03T21:50:00Z",
    owner: "Ingest",
    description:
      "A payload was refused — malformed JSON, a missing write key, or a property over the size limit. The jump is almost entirely one team sending an unbounded array as a property.",
    trend: [9, 8, 11, 6, 5, 12, 14, 13, 18, 22, 15, 17, 34, 41],
  },
  {
    id: "alert-fired",
    name: "alert_fired",
    kind: "track",
    volume: 2_046,
    changePercent: -1.2,
    teams: 428,
    lastSeen: "2026-08-03T18:05:00Z",
    owner: "Reporting",
    description:
      "A saved alert crossed its threshold and notified someone. Flat, which for an alerting feature is the good outcome.",
    trend: [7, 8, 7, 4, 4, 8, 9, 8, 8, 7, 4, 5, 8, 8],
  },
  {
    id: "sdk-error",
    name: "sdk_error",
    kind: "error",
    volume: 1_390,
    changePercent: -22.4,
    teams: 143,
    lastSeen: "2026-08-03T17:41:00Z",
    owner: "SDK",
    description:
      "The client SDK caught and reported its own failure. Down by nearly a quarter since 4.2 fixed the retry loop that was double-counting network drops.",
    trend: [12, 11, 10, 6, 6, 9, 8, 7, 6, 5, 3, 3, 4, 4],
  },
];

export function getEvent(id: string): TrackedEvent | undefined {
  return events.find((event) => event.id === id);
}

/** Human labels for the event kinds, kept beside the data. */
export const KIND_LABEL: Record<TrackedEvent["kind"], string> = {
  track: "Track",
  identify: "Identify",
  page: "Page",
  error: "Error",
};
