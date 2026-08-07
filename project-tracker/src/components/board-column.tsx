import type { ReactNode } from "react";
import type { Column, Issue } from "@/content/types";
import { pointsIn } from "@/lib/derive";
import { IssueCard } from "./issue-card";

/**
 * One column of the board.
 *
 * The scrolling body carries `data-column-id` and fills the available
 * height, so the empty space under the last card is a valid drop
 * target — dropping onto a column should not require aiming at a card.
 */
export function BoardColumn({
  column,
  issues,
  dropIndex,
  slotHeight,
  onCardPointerDown,
  onCardClick,
  onNudge,
}: {
  column: Column;
  issues: Issue[];
  /** Where the dragged card would land, or null if not over this column. */
  dropIndex: number | null;
  slotHeight: number;
  onCardPointerDown: (
    issue: Issue,
    event: React.PointerEvent<HTMLElement>,
  ) => void;
  onCardClick: (issue: Issue) => void;
  onNudge: (issue: Issue, direction: -1 | 1) => void;
}) {
  const overLimit = column.wipLimit !== null && issues.length > column.wipLimit;

  const slot = (key: string) => (
    <li
      key={key}
      aria-hidden="true"
      // Must not swallow the hit test — see hitTest() in use-card-drag.
      style={{ height: slotHeight, pointerEvents: "none" }}
      className="drop-slot rounded-lg border border-dashed border-accent-ring"
    />
  );

  const rows: ReactNode[] = [];
  issues.forEach((issue, index) => {
    if (dropIndex === index) rows.push(slot(`slot-${index}`));
    rows.push(
      <li key={issue.id}>
        <IssueCard
          issue={issue}
          onPointerDown={(event) => onCardPointerDown(issue, event)}
          onCardClick={() => onCardClick(issue)}
          onNudge={(direction) => onNudge(issue, direction)}
        />
      </li>,
    );
  });
  if (dropIndex !== null && dropIndex >= issues.length) {
    rows.push(slot("slot-end"));
  }

  return (
    <section className="flex min-h-0 w-[17.5rem] shrink-0 flex-col lg:w-auto lg:flex-1">
      <header className="px-1 pb-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[13px] font-semibold">{column.name}</h2>
          <span
            className={`tabular font-mono text-[11px] ${
              overLimit ? "text-high" : "text-ink-subtle"
            }`}
          >
            {issues.length}
            {column.wipLimit !== null && `/${column.wipLimit}`}
          </span>
          <span className="tabular ml-auto font-mono text-[11px] text-ink-subtle">
            {pointsIn(issues)} pts
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-ink-subtle">{column.hint}</p>
        {overLimit && column.wipLimit !== null && (
          <p className="mt-1 text-[11px] text-high">
            Over by {issues.length - column.wipLimit} — finish something before
            starting more.
          </p>
        )}
      </header>

      <ul
        data-column-id={column.id}
        className="scroll-thin flex min-h-40 flex-1 flex-col gap-2 overflow-y-auto rounded-lg bg-surface p-2"
      >
        {rows}
        {issues.length === 0 && dropIndex === null && (
          <li className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-line px-3 py-6 text-center text-[11px] text-ink-subtle">
            Nothing in {column.name.toLowerCase()}
          </li>
        )}
      </ul>
    </section>
  );
}
