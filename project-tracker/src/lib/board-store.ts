import { issues as seed } from "@/content/issues";
import type { ColumnId, Issue } from "@/content/types";

/**
 * The board's live state.
 *
 * A plain module store rather than a context + `useState`, for two
 * reasons. Components read it through `useSyncExternalStore`, which is
 * the supported way to subscribe to something outside React and does
 * not need a provider wrapped around the tree. And moving a card during
 * a drag has to be cheap — this updates one array and notifies, with no
 * effect chain in between.
 *
 * It deliberately does NOT persist. Reload and the board returns to
 * `src/content/issues.ts`. A cart should survive a refresh, because it
 * is the user's; a board's contents are the template's *content*, and
 * content a stray storage entry can override has stopped being
 * editable.
 */

let state: Issue[] = seed;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Must return the same reference until something actually changes, or
 * `useSyncExternalStore` re-renders forever.
 */
export function getSnapshot(): Issue[] {
  return state;
}

/**
 * Move an issue to `toColumn`, landing at `toIndex` among that column's
 * cards. An index past the end appends.
 *
 * The array is flat and a column's order is its order within that
 * array, so inserting means finding the flat position of the card
 * currently at `toIndex`.
 */
export function moveIssue(
  id: string,
  toColumn: ColumnId,
  toIndex: number,
): void {
  const current = state.find((issue) => issue.id === id);
  if (!current) return;

  // No-op guard. Without it, releasing a drag exactly where it started
  // still notifies every subscriber.
  const currentIndexInColumn = state
    .filter((issue) => issue.column === toColumn)
    .findIndex((issue) => issue.id === id);
  if (current.column === toColumn && currentIndexInColumn === toIndex) return;

  const rest = state.filter((issue) => issue.id !== id);
  const moved: Issue = { ...current, column: toColumn };
  const inColumn = rest.filter((issue) => issue.column === toColumn);
  const clamped = Math.max(0, Math.min(toIndex, inColumn.length));

  let insertAt: number;
  if (inColumn.length === 0) {
    // Nothing to sit beside; anywhere in the flat array reads the same.
    insertAt = rest.length;
  } else if (clamped === inColumn.length) {
    insertAt = rest.indexOf(inColumn[inColumn.length - 1]) + 1;
  } else {
    insertAt = rest.indexOf(inColumn[clamped]);
  }

  state = [...rest.slice(0, insertAt), moved, ...rest.slice(insertAt)];
  emit();
}

/** Move an issue one column left or right, keeping its position. */
export function nudgeIssue(
  id: string,
  columnOrder: ColumnId[],
  direction: -1 | 1,
): ColumnId | null {
  const issue = state.find((candidate) => candidate.id === id);
  if (!issue) return null;
  const from = columnOrder.indexOf(issue.column);
  const to = from + direction;
  if (to < 0 || to >= columnOrder.length) return null;
  const target = columnOrder[to];
  moveIssue(id, target, Number.MAX_SAFE_INTEGER);
  return target;
}

export function toggleChecklistItem(issueId: string, itemId: string): void {
  state = state.map((issue) =>
    issue.id !== issueId
      ? issue
      : {
          ...issue,
          checklist: issue.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        },
  );
  emit();
}

/** Back to the contents of `src/content/issues.ts`. */
export function resetBoard(): void {
  state = seed;
  emit();
}
