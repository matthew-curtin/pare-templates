import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BoardColumn } from "@/components/board-column";
import { PageHeader, SearchInput, Select, Stat } from "@/components/controls";
import { IssueCard } from "@/components/issue-card";
import { columns, labels, site } from "@/content/site";
import { members } from "@/content/team";
import type { Issue } from "@/content/types";
import { nudgeIssue, resetBoard } from "@/lib/board-store";
import { columnOrder, cycleStats } from "@/lib/derive";
import { useBoard } from "@/lib/use-board";
import { useCardDrag } from "@/lib/use-card-drag";
import { useParam } from "@/lib/use-filters";

export function BoardPage() {
  const board = useBoard();
  const navigate = useNavigate();
  const { drag, startDrag, consumeDragClick } = useCardDrag();

  const [assignee, setAssignee] = useParam("assignee", "all");
  const [label, setLabel] = useParam("label", "all");
  const [query, setQuery] = useParam("q", "");

  /** Announced to screen readers after a keyboard move. */
  const [announcement, setAnnouncement] = useState("");
  /** The card whose link should hold focus once the board re-renders. */
  const pendingFocusRef = useRef<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return board.filter((issue) => {
      if (assignee === "unassigned" && issue.assigneeId !== null) return false;
      if (
        assignee !== "all" &&
        assignee !== "unassigned" &&
        issue.assigneeId !== assignee
      ) {
        return false;
      }
      if (label !== "all" && !issue.labelIds.includes(label)) return false;
      if (needle) {
        const haystack = `${issue.id} ${issue.title} ${issue.summary}`;
        if (!haystack.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [board, assignee, label, query]);

  const stats = useMemo(() => cycleStats(filtered), [filtered]);

  const draggingIssue = drag
    ? board.find((issue) => issue.id === drag.issueId)
    : undefined;

  /** The dragged card is not drawn in place — the ghost stands in for it. */
  const visible = drag
    ? filtered.filter((issue) => issue.id !== drag.issueId)
    : filtered;

  const openIssue = useCallback(
    (issue: Issue) => {
      // A drag that ended on this card is followed by a click. Ignore it,
      // or every drop would also navigate away from the board.
      if (consumeDragClick()) return;
      navigate(`/issue/${issue.id}`);
    },
    [consumeDragClick, navigate],
  );

  const nudge = useCallback((issue: Issue, direction: -1 | 1) => {
    const moved = nudgeIssue(issue.id, columnOrder, direction);
    if (!moved) return;
    const column = columns.find((candidate) => candidate.id === moved);
    setAnnouncement(`${issue.id} moved to ${column?.name ?? moved}`);
    pendingFocusRef.current = issue.id;
  }, []);

  /**
   * Put focus back on the card that just moved.
   *
   * It lands in a different list, so React unmounts and remounts it and
   * focus falls to the body — after which a second arrow press does
   * nothing and the keyboard path dies after one move. This has to run
   * AFTER the commit, which is what an effect keyed on the board
   * guarantees; scheduling a frame instead is a guess about when React
   * will have finished, and it loses the race.
   */
  useEffect(() => {
    const id = pendingFocusRef.current;
    if (!id) return;
    pendingFocusRef.current = null;
    document.querySelector<HTMLElement>(`[data-card-id="${id}"] a`)?.focus();
  }, [board]);

  const filtersActive = assignee !== "all" || label !== "all" || query !== "";

  return (
    <div className="flex h-full min-h-dvh flex-col gap-4 p-4 lg:h-dvh lg:p-6">
      <PageHeader
        title="Board"
        description={`${site.cycle.name} · drag a card between columns, or focus one and use the left and right arrow keys.`}
      >
        <button
          type="button"
          onClick={() => {
            resetBoard();
            setAnnouncement("Board reset");
          }}
          className="focus-ring rounded-md border border-line px-2.5 py-1.5 text-[12px] text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          Reset board
        </button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat
          label="Done"
          value={`${stats.donePoints} pts`}
          detail={`of ${stats.committedPoints} committed`}
        />
        <Stat
          label="In flight"
          value={String(stats.inFlight)}
          detail="being built now"
        />
        <Stat
          label="Unassigned"
          value={String(stats.unassigned)}
          detail="in the cycle"
        />
        <Stat
          label="Cycle"
          value="2 days"
          detail={`left of ${site.cycle.name}`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search this board"
        />
        <Select
          label="Assignee"
          value={assignee}
          onChange={setAssignee}
          options={[
            { value: "all", label: "Everyone" },
            { value: "unassigned", label: "Unassigned" },
            ...members.map((member) => ({
              value: member.id,
              label: member.name,
            })),
          ]}
        />
        <Select
          label="Label"
          value={label}
          onChange={setLabel}
          options={[
            { value: "all", label: "All labels" },
            ...labels.map((item) => ({ value: item.id, label: item.name })),
          ]}
        />
        {filtersActive && (
          <span className="text-[11px] text-ink-subtle">
            {visible.length} of {board.length} shown
          </span>
        )}
      </div>

      <div className="scroll-thin flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            issues={visible.filter((issue) => issue.column === column.id)}
            dropIndex={
              drag?.target?.column === column.id ? drag.target.index : null
            }
            slotHeight={drag?.height ?? 0}
            onCardPointerDown={(issue, event) => startDrag(event, issue.id)}
            onCardClick={openIssue}
            onNudge={nudge}
          />
        ))}
      </div>

      {/*
        The card under the cursor. Positioned by CSS variables written
        imperatively at pointer rate — the transform string below never
        changes, so React's style diff is a no-op and cannot fight the
        drag. See use-card-drag.ts.
      */}
      {drag && draggingIssue && (
        <div
          className="card-dragging pointer-events-none fixed top-0 left-0 z-50 rounded-lg"
          style={{
            width: drag.width,
            transform: "translate(var(--drag-x, 0px), var(--drag-y, 0px))",
          }}
        >
          <IssueCard issue={draggingIssue} ghost />
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
