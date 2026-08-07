import { Link } from "react-router-dom";
import type { Issue } from "@/content/types";
import { memberById } from "@/content/team";
import { checklistProgress } from "@/lib/derive";
import { relativeDay } from "@/lib/format";
import { priorityBar } from "@/lib/tokens";
import { Avatar } from "./avatar";
import { LabelChip, PointsChip, PriorityChip } from "./chips";

/**
 * One card on the board.
 *
 * The title is a real `<Link>`, so the issue has a URL that can be
 * middle-clicked, copied and bookmarked — and it is the card's single
 * tab stop, which keeps the keyboard path through a five-column board
 * bearable. Left and right arrows move the card while that link has
 * focus, so the board is fully operable without a pointer.
 *
 * The rest of the card is clickable too, and draggable from anywhere.
 */
export function IssueCard({
  issue,
  onPointerDown,
  onCardClick,
  onNudge,
  ghost = false,
}: {
  issue: Issue;
  onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
  onCardClick?: () => void;
  onNudge?: (direction: -1 | 1) => void;
  /** Rendered as the floating copy under the cursor — inert. */
  ghost?: boolean;
}) {
  const assignee = issue.assigneeId
    ? memberById.get(issue.assigneeId)
    : undefined;
  const progress = checklistProgress(issue);

  return (
    <article
      data-card-id={ghost ? undefined : issue.id}
      onPointerDown={onPointerDown}
      onClick={onCardClick}
      className={[
        "relative overflow-hidden rounded-lg border border-line bg-raised p-3 pl-4",
        ghost
          ? "w-full"
          : "cursor-grab transition-colors hover:border-line-strong hover:bg-raised-hover active:cursor-grabbing",
      ].join(" ")}
      // Let the browser scroll the column vertically with a finger; the
      // drag arms on a long press instead. See use-card-drag.ts.
      style={{ touchAction: "pan-y" }}
    >
      {/* Priority as an edge, so it is readable at a glance down a
          column without competing with the card's own content. */}
      <span
        aria-hidden="true"
        className={`${priorityBar[issue.priority]} absolute inset-y-0 left-0 w-1`}
      />

      <div className="flex items-center gap-2">
        <span className="tabular font-mono text-[11px] text-ink-subtle">
          {issue.id}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <PriorityChip priority={issue.priority} />
          <PointsChip points={issue.points} />
        </span>
      </div>

      <h3 className="mt-1.5 text-[13px] leading-snug font-medium">
        {ghost ? (
          issue.title
        ) : (
          <Link
            to={`/issue/${issue.id}`}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (!onNudge) return;
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                onNudge(-1);
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                onNudge(1);
              }
            }}
            className="focus-ring rounded-sm hover:text-accent"
          >
            {issue.title}
          </Link>
        )}
      </h3>

      {issue.labelIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {issue.labelIds.map((id) => (
            <LabelChip key={id} id={id} />
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-2 text-[11px] text-ink-subtle">
        <Avatar member={assignee} size="sm" />
        {progress.total > 0 && (
          <span className="tabular font-mono">
            {progress.done}/{progress.total}
          </span>
        )}
        <span className="ml-auto">{relativeDay(issue.updated)}</span>
      </div>
    </article>
  );
}
