import { Link, useParams } from "react-router-dom";
import { Avatar } from "@/components/avatar";
import { LabelChip, PriorityChip } from "@/components/chips";
import { columns } from "@/content/site";
import { memberById } from "@/content/team";
import { checklistProgress, columnOrder } from "@/lib/derive";
import { longDay, relativeDay } from "@/lib/format";
import { moveIssue, toggleChecklistItem } from "@/lib/board-store";
import { useIssue } from "@/lib/use-board";

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const issue = useIssue(id);

  if (!issue) {
    return (
      <div className="p-6">
        <h1 className="text-lg font-semibold">No issue {id}</h1>
        <p className="mt-1 text-[13px] text-ink-muted">
          It may have been renamed, or the link may be wrong.
        </p>
        <Link
          to="/backlog"
          className="focus-ring mt-4 inline-block rounded-sm text-[13px] text-accent hover:text-accent-hover"
        >
          Back to the backlog
        </Link>
      </div>
    );
  }

  const assignee = issue.assigneeId
    ? memberById.get(issue.assigneeId)
    : undefined;
  const progress = checklistProgress(issue);
  const columnIndex = columnOrder.indexOf(issue.column);

  return (
    <div className="p-4 lg:p-6">
      <Link
        to="/"
        className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-[12px] text-ink-subtle hover:text-ink"
      >
        <span aria-hidden="true">←</span> Board
      </Link>

      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="min-w-0">
          <p className="tabular font-mono text-[12px] text-ink-subtle">
            {issue.id}
          </p>
          <h1 className="mt-1 text-xl leading-tight font-semibold tracking-tight">
            {issue.title}
          </h1>

          <div className="mt-5 space-y-3 text-[14px] leading-relaxed text-ink-muted">
            {issue.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {issue.checklist.length > 0 && (
            <section className="mt-7">
              <div className="flex items-baseline gap-2">
                <h2 className="text-[13px] font-semibold">Checklist</h2>
                <span className="tabular font-mono text-[11px] text-ink-subtle">
                  {progress.done}/{progress.total}
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {issue.checklist.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors hover:bg-surface">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklistItem(issue.id, item.id)}
                        className="focus-ring mt-0.5 h-3.5 w-3.5 shrink-0 accent-accent"
                      />
                      <span
                        className={
                          item.done ? "text-ink-subtle line-through" : "text-ink"
                        }
                      >
                        {item.text}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-7">
            <h2 className="text-[13px] font-semibold">Activity</h2>
            {issue.activity.length === 0 ? (
              <p className="mt-2 text-[13px] text-ink-subtle">
                Nothing yet. Comments appear here as the work moves.
              </p>
            ) : (
              <ul className="mt-3 space-y-4">
                {issue.activity.map((entry) => {
                  const author = memberById.get(entry.memberId);
                  return (
                    <li key={entry.id} className="flex gap-3">
                      <Avatar member={author} size="sm" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-[13px] font-medium">
                            {author?.name ?? "Someone"}
                          </span>
                          <time
                            dateTime={entry.at}
                            className="text-[11px] text-ink-subtle"
                            title={longDay(entry.at)}
                          >
                            {relativeDay(entry.at)}
                          </time>
                        </div>
                        <p className="mt-0.5 text-[13px] text-ink-muted">
                          {entry.text}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-lg border border-line bg-surface p-3">
            <h2 className="text-[11px] tracking-wide text-ink-subtle uppercase">
              Status
            </h2>
            <p className="mt-1 text-[13px] font-medium">
              {columns.find((column) => column.id === issue.column)?.name}
            </p>
            <div className="mt-2.5 flex gap-1.5">
              <button
                type="button"
                disabled={columnIndex <= 0}
                onClick={() =>
                  moveIssue(
                    issue.id,
                    columnOrder[columnIndex - 1],
                    Number.MAX_SAFE_INTEGER,
                  )
                }
                className="focus-ring flex-1 rounded-md border border-line px-2 py-1.5 text-[12px] text-ink-muted transition-colors enabled:hover:border-line-strong enabled:hover:text-ink disabled:opacity-35"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={columnIndex >= columnOrder.length - 1}
                onClick={() =>
                  moveIssue(
                    issue.id,
                    columnOrder[columnIndex + 1],
                    Number.MAX_SAFE_INTEGER,
                  )
                }
                className="focus-ring flex-1 rounded-md border border-line px-2 py-1.5 text-[12px] text-ink-muted transition-colors enabled:hover:border-line-strong enabled:hover:text-ink disabled:opacity-35"
              >
                Forward →
              </button>
            </div>
          </div>

          <dl className="rounded-lg border border-line bg-surface p-3 text-[13px]">
            <Row label="Priority">
              <PriorityChip priority={issue.priority} />
            </Row>
            <Row label="Estimate">
              <span className="tabular font-mono text-ink-muted">
                {issue.points} pts
              </span>
            </Row>
            <Row label="Assignee">
              <span className="flex items-center gap-2 text-ink-muted">
                <Avatar member={assignee} size="sm" />
                {assignee?.name ?? "Unassigned"}
              </span>
            </Row>
            <Row label="Updated">
              <time dateTime={issue.updated} className="text-ink-muted">
                {longDay(issue.updated)}
              </time>
            </Row>
          </dl>

          {issue.labelIds.length > 0 && (
            <div className="rounded-lg border border-line bg-surface p-3">
              <h2 className="text-[11px] tracking-wide text-ink-subtle uppercase">
                Labels
              </h2>
              <div className="mt-2 flex flex-wrap gap-1">
                {issue.labelIds.map((labelId) => (
                  <LabelChip key={labelId} id={labelId} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2 last:border-0">
      <dt className="text-[11px] tracking-wide text-ink-subtle uppercase">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
