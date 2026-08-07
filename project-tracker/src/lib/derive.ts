import { columns } from "@/content/site";
import type { ColumnId, Issue, Member, Priority } from "@/content/types";

/** The board's column ids, left to right. */
export const columnOrder: ColumnId[] = columns.map((column) => column.id);

/** Where priority sits on the scale — used for sorting, not for colour. */
export const priorityRank: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/**
 * Columns that represent work someone is carrying right now. The two
 * ends of the board are excluded: nothing in the backlog is anyone's
 * yet, and nothing in done is still costing anyone anything.
 */
const ACTIVE_COLUMNS: ColumnId[] = ["todo", "building", "review"];

export function issuesInColumn(board: Issue[], column: ColumnId): Issue[] {
  return board.filter((issue) => issue.column === column);
}

export function pointsIn(issues: Issue[]): number {
  return issues.reduce((total, issue) => total + issue.points, 0);
}

export interface Workload {
  member: Member;
  /** Points in to-do, building and review. */
  active: number;
  /** Points already finished this cycle. */
  done: number;
  activeIssues: Issue[];
  /** active ÷ capacity, uncapped — over 1 means over-committed. */
  ratio: number;
}

export function workloads(board: Issue[], members: Member[]): Workload[] {
  return members.map((member) => {
    const mine = board.filter((issue) => issue.assigneeId === member.id);
    const activeIssues = mine.filter((issue) =>
      ACTIVE_COLUMNS.includes(issue.column),
    );
    const active = pointsIn(activeIssues);
    return {
      member,
      active,
      done: pointsIn(mine.filter((issue) => issue.column === "done")),
      activeIssues,
      ratio: member.capacity === 0 ? 0 : active / member.capacity,
    };
  });
}

export interface CycleStats {
  donePoints: number;
  committedPoints: number;
  inFlight: number;
  unassigned: number;
}

/**
 * The four figures at the top of the board. "Committed" is everything
 * pulled into the cycle — the backlog is not part of a commitment.
 */
export function cycleStats(board: Issue[]): CycleStats {
  const committed = board.filter((issue) => issue.column !== "backlog");
  return {
    donePoints: pointsIn(committed.filter((issue) => issue.column === "done")),
    committedPoints: pointsIn(committed),
    inFlight: board.filter((issue) => issue.column === "building").length,
    unassigned: committed.filter((issue) => issue.assigneeId === null).length,
  };
}

export function checklistProgress(issue: Issue): {
  done: number;
  total: number;
} {
  return {
    done: issue.checklist.filter((item) => item.done).length,
    total: issue.checklist.length,
  };
}
