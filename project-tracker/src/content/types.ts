/**
 * Every content shape in the app, in one place.
 *
 * If you are changing what a template *says*, you want the other files
 * in this folder. This one describes their shape, so the editor tells
 * you immediately when a field is missing.
 */

/** The board columns, left to right. */
export type ColumnId = "backlog" | "todo" | "building" | "review" | "done";

/**
 * Priority is an ordered scale, which is why the UI is allowed to give
 * it a colour ramp. It always ships with its name too.
 */
export type Priority = "urgent" | "high" | "medium" | "low";

/** Where a roadmap entry has got to. Also ordered. */
export type Stage = "planned" | "building" | "shipped";

export interface Column {
  id: ColumnId;
  name: string;
  /** Shown under the column heading — what belongs here. */
  hint: string;
  /**
   * Work-in-progress limit. `null` means unlimited, which is right for
   * the two ends of the board: everything starts in one and piles up
   * in the other.
   */
  wipLimit: number | null;
}

export interface Label {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  /** Two letters, drawn as an avatar. No stock headshots — see CREDITS. */
  initials: string;
  /** Points this person can take in one two-week cycle. */
  capacity: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ActivityEntry {
  id: string;
  memberId: string;
  text: string;
  /** ISO date. Rendered relative to the newest date in the data set. */
  at: string;
}

export interface Issue {
  /** The human key, e.g. "LAN-142". Shown everywhere; unique. */
  id: string;
  title: string;
  /** One line. This is what the backlog table shows. */
  summary: string;
  /** Paragraphs. This is what the issue page shows. */
  description: string[];
  column: ColumnId;
  priority: Priority;
  /** Estimate. Fibonacci-ish, as most teams use. */
  points: number;
  assigneeId: string | null;
  labelIds: string[];
  checklist: ChecklistItem[];
  activity: ActivityEntry[];
  /** ISO date, used for the "Updated" column and its sort. */
  updated: string;
}

export interface RoadmapEntry {
  id: string;
  name: string;
  workstream: string;
  /** Indexes into `QUARTERS` in roadmap.ts. Inclusive at both ends. */
  startQuarter: number;
  endQuarter: number;
  stage: Stage;
  note: string;
}

export interface NavItem {
  label: string;
  to: string;
  /** Which glyph `nav-icon.tsx` draws. */
  icon: "board" | "backlog" | "roadmap" | "team" | "settings";
}
