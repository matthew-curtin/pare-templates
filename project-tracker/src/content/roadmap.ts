import type { RoadmapEntry } from "./types";

/**
 * The roadmap's horizontal axis. `startQuarter` and `endQuarter` on
 * each entry are indexes into this array, inclusive at both ends — so
 * an entry with 1 and 1 occupies a single column.
 */
export const QUARTERS = [
  "Q2 2026",
  "Q3 2026",
  "Q4 2026",
  "Q1 2027",
  "Q2 2027",
];

/** Which quarter we are in. Drives the "now" marker. */
export const CURRENT_QUARTER = 1;

/**
 * Workstreams, in the order they are drawn. A workstream is just a
 * grouping label — add one here and any entry naming it appears under
 * it.
 */
export const workstreams = [
  {
    name: "Inbox",
    detail: "What agents touch every hour",
  },
  {
    name: "Platform",
    detail: "The parts other systems depend on",
  },
  {
    name: "Scale",
    detail: "Making the size we already are survivable",
  },
  {
    name: "Craft",
    detail: "The work that has no ticket from a customer",
  },
];

export const roadmap: RoadmapEntry[] = [
  /* Inbox */
  {
    id: "r-saved-replies",
    name: "Saved replies",
    workstream: "Inbox",
    startQuarter: 1,
    endQuarter: 1,
    stage: "building",
    note: "Reusable answers with merge fields. In build now.",
  },
  {
    id: "r-merge",
    name: "Merge and de-duplicate",
    workstream: "Inbox",
    startQuarter: 1,
    endQuarter: 1,
    stage: "building",
    note: "Two threads from one person become one history.",
  },
  {
    id: "r-snooze",
    name: "Snooze and follow-ups",
    workstream: "Inbox",
    startQuarter: 1,
    endQuarter: 2,
    stage: "planned",
    note: "Take it out of the inbox until it can actually be acted on.",
  },
  {
    id: "r-bulk",
    name: "Bulk triage",
    workstream: "Inbox",
    startQuarter: 2,
    endQuarter: 2,
    stage: "planned",
    note: "Clear a morning backlog without opening every conversation.",
  },

  /* Platform */
  {
    id: "r-webhook",
    name: "Webhooks v2",
    workstream: "Platform",
    startQuarter: 0,
    endQuarter: 1,
    stage: "shipped",
    note: "New payload shape out, v1 retired six months after notice.",
  },
  {
    id: "r-rules",
    name: "Assignment rules",
    workstream: "Platform",
    startQuarter: 2,
    endQuarter: 2,
    stage: "planned",
    note: "Round-robin across whoever is actually on shift.",
  },
  {
    id: "r-audit",
    name: "Audit log",
    workstream: "Platform",
    startQuarter: 2,
    endQuarter: 3,
    stage: "planned",
    note: "Asked for in almost every security review we go through.",
  },

  /* Scale */
  {
    id: "r-coldstart",
    name: "Console cold start",
    workstream: "Scale",
    startQuarter: 0,
    endQuarter: 1,
    stage: "shipped",
    note: "First paint 4.1s to 1.3s, with a budget so it stays there.",
  },
  {
    id: "r-archive",
    name: "Conversation archive",
    workstream: "Scale",
    startQuarter: 1,
    endQuarter: 2,
    stage: "building",
    note: "History older than a year moves to cold storage, still searchable.",
  },
  {
    id: "r-search",
    name: "Search rebuild",
    workstream: "Scale",
    startQuarter: 3,
    endQuarter: 4,
    stage: "planned",
    note: "Depends on the archive landing first.",
  },

  /* Craft */
  {
    id: "r-composer",
    name: "Composer redesign",
    workstream: "Craft",
    startQuarter: 1,
    endQuarter: 1,
    stage: "building",
    note: "One surface for replying, noting and forwarding.",
  },
  {
    id: "r-a11y",
    name: "Accessibility pass",
    workstream: "Craft",
    startQuarter: 1,
    endQuarter: 2,
    stage: "building",
    note: "Contrast is done; names and announcements are next.",
  },
  {
    id: "r-dark",
    name: "Dark mode",
    workstream: "Craft",
    startQuarter: 3,
    endQuarter: 4,
    stage: "planned",
    note: "Mostly a token sweep. The components are nearly ready for it.",
  },
];
