import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/avatar";
import { PriorityChip } from "@/components/chips";
import { PageHeader, Stat } from "@/components/controls";
import { columns } from "@/content/site";
import { members } from "@/content/team";
import { pointsIn, workloads } from "@/lib/derive";
import { useBoard } from "@/lib/use-board";

const columnName = new Map(columns.map((column) => [column.id, column.name]));

export function TeamPage() {
  const board = useBoard();
  const rows = useMemo(() => workloads(board, members), [board]);

  const committed = rows.reduce((total, row) => total + row.active, 0);
  const capacity = rows.reduce((total, row) => total + row.member.capacity, 0);
  const unassigned = board.filter(
    (issue) => issue.assigneeId === null && issue.column !== "backlog",
  );

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <PageHeader
        title="Team"
        description="Who is carrying what this cycle. Capacity is points per two-week cycle, and it is a conversation starter rather than a target."
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="People" value={String(members.length)} />
        <Stat
          label="Committed"
          value={`${committed} pts`}
          detail={`of ${capacity} capacity`}
        />
        <Stat
          label="Load"
          value={`${Math.round((committed / capacity) * 100)}%`}
          detail="across the team"
        />
        <Stat
          label="Unassigned"
          value={`${pointsIn(unassigned)} pts`}
          detail={`${unassigned.length} issues in the cycle`}
        />
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map((row) => {
          const over = row.ratio > 1;
          return (
            <li
              key={row.member.id}
              // `min-w-0`: a grid item will not shrink below its content
              // by default, so a long issue title inside stretches the
              // card past the screen on a phone.
              className="min-w-0 rounded-lg border border-line bg-surface p-4"
            >
              <div className="flex items-start gap-3">
                <Avatar member={row.member} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[14px] font-semibold">
                    {row.member.name}
                  </h2>
                  <p className="text-[12px] text-ink-subtle">
                    {row.member.role}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`tabular font-mono text-[13px] ${
                      over ? "text-high" : "text-ink-muted"
                    }`}
                  >
                    {row.active}/{row.member.capacity}
                  </div>
                  <div className="text-[11px] text-ink-subtle">pts</div>
                </div>
              </div>

              {/*
                One colour for every bar. People are a nominal category —
                shading them by size would encode the bar's length twice.
                The number above is the value; the bar is the comparison.
              */}
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-canvas">
                  <div
                    className={`h-full rounded-full ${over ? "bg-high" : "bg-accent"}`}
                    style={{ width: `${Math.min(row.ratio, 1) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-ink-subtle">
                  {over
                    ? `Over capacity by ${row.active - row.member.capacity} pts`
                    : `${row.member.capacity - row.active} pts spare`}
                  {row.done > 0 && ` · ${row.done} pts done this cycle`}
                </p>
              </div>

              {row.activeIssues.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                  {row.activeIssues.map((issue) => (
                    <li key={issue.id} className="flex items-center gap-2">
                      <Link
                        to={`/issue/${issue.id}`}
                        className="focus-ring min-w-0 flex-1 truncate rounded-sm text-[12px] hover:text-accent"
                      >
                        <span className="tabular font-mono text-[11px] text-ink-subtle">
                          {issue.id}
                        </span>{" "}
                        {issue.title}
                      </Link>
                      <span className="shrink-0 text-[11px] text-ink-subtle">
                        {columnName.get(issue.column)}
                      </span>
                      <PriorityChip priority={issue.priority} />
                    </li>
                  ))}
                </ul>
              )}

              {row.activeIssues.length === 0 && (
                <p className="mt-3 border-t border-line pt-3 text-[12px] text-ink-subtle">
                  Nothing in flight.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
