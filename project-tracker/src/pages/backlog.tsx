import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/avatar";
import { PriorityChip } from "@/components/chips";
import { PageHeader, SearchInput, Select } from "@/components/controls";
import { columns, labels, priorities } from "@/content/site";
import { memberById, members } from "@/content/team";
import type { Issue } from "@/content/types";
import { dayValue, relativeDay } from "@/lib/format";
import { priorityRank } from "@/lib/derive";
import { useBoard } from "@/lib/use-board";
import { useParam, useSetParams } from "@/lib/use-filters";

type SortKey = "id" | "priority" | "points" | "updated";

const columnName = new Map(columns.map((column) => [column.id, column.name]));

export function BacklogPage() {
  const board = useBoard();

  const [query, setQuery] = useParam("q", "");
  const [assignee, setAssignee] = useParam("assignee", "all");
  const [label, setLabel] = useParam("label", "all");
  const [status, setStatus] = useParam("status", "all");
  const [priority, setPriority] = useParam("priority", "all");
  const [sort] = useParam("sort", "updated");
  const [direction] = useParam("dir", "desc");
  const setParams = useSetParams();

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = board.filter((issue) => {
      if (assignee === "unassigned" && issue.assigneeId !== null) return false;
      if (
        assignee !== "all" &&
        assignee !== "unassigned" &&
        issue.assigneeId !== assignee
      ) {
        return false;
      }
      if (label !== "all" && !issue.labelIds.includes(label)) return false;
      if (status !== "all" && issue.column !== status) return false;
      if (priority !== "all" && issue.priority !== priority) return false;
      if (needle) {
        const haystack = `${issue.id} ${issue.title} ${issue.summary}`;
        if (!haystack.toLowerCase().includes(needle)) return false;
      }
      return true;
    });

    const sign = direction === "asc" ? 1 : -1;
    const compare = (a: Issue, b: Issue): number => {
      switch (sort as SortKey) {
        case "id":
          return a.id.localeCompare(b.id) * sign;
        case "priority":
          // Ascending means most urgent first, which is what someone
          // clicking "Priority" is actually asking for.
          return (priorityRank[a.priority] - priorityRank[b.priority]) * -sign;
        case "points":
          return (a.points - b.points) * sign;
        default:
          return (dayValue(a.updated) - dayValue(b.updated)) * sign;
      }
    };
    return [...filtered].sort(compare);
  }, [board, query, assignee, label, status, priority, sort, direction]);

  /**
   * Clicking the current column flips the direction; clicking a new one
   * starts it descending. Both values are written in a single update —
   * see useSetParams for why two separate ones lose each other.
   * Defaults are written as `null` so they drop out of the URL.
   */
  const toggleSort = (key: SortKey) => {
    const nextDirection = sort === key && direction === "desc" ? "asc" : "desc";
    setParams({
      sort: key === "updated" ? null : key,
      dir: nextDirection === "desc" ? null : nextDirection,
    });
  };

  const header = (key: SortKey, text: string, align = "text-left") => (
    <th scope="col" className={`px-3 py-2 font-medium ${align}`}>
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className="focus-ring inline-flex items-center gap-1 rounded-sm hover:text-ink"
        aria-sort={
          sort === key
            ? direction === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
      >
        {text}
        <span aria-hidden="true" className="text-[9px]">
          {sort === key ? (direction === "asc" ? "▲" : "▼") : "​"}
        </span>
      </button>
    </th>
  );

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <PageHeader
        title="Backlog"
        description="Every issue in the workspace. Filters and sorting live in the URL, so a useful view can be sent to someone else."
      />

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search issues"
        />
        <Select
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "Any status" },
            ...columns.map((column) => ({
              value: column.id,
              label: column.name,
            })),
          ]}
        />
        <Select
          label="Priority"
          value={priority}
          onChange={setPriority}
          options={[
            { value: "all", label: "Any priority" },
            ...priorities.map((item) => ({ value: item.id, label: item.name })),
          ]}
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
      </div>

      {/*
        `min-w-0` is load-bearing. This is a flex item, and without it
        the wide table inside forces the wrapper past the viewport
        instead of scrolling within it — the whole PAGE then scrolls
        sideways on a phone. Any horizontal scroller inside a flex
        container needs it, the same way a vertical one needs min-h-0.
      */}
      <div className="min-w-0 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[52rem] border-collapse text-[13px]">
          <caption className="sr-only">
            Issues, sorted by {sort}, {direction}ending
          </caption>
          <thead className="bg-surface text-[11px] tracking-wide text-ink-subtle uppercase">
            <tr>
              {header("id", "Key")}
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Title
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Status
              </th>
              {header("priority", "Priority")}
              {header("points", "Pts", "text-right")}
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Assignee
              </th>
              {header("updated", "Updated")}
            </tr>
          </thead>
          <tbody>
            {rows.map((issue) => {
              const member = issue.assigneeId
                ? memberById.get(issue.assigneeId)
                : undefined;
              return (
                <tr
                  key={issue.id}
                  className="border-t border-line transition-colors hover:bg-surface"
                >
                  <td className="tabular px-3 py-2.5 font-mono text-[11px] text-ink-subtle">
                    {issue.id}
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      to={`/issue/${issue.id}`}
                      className="focus-ring rounded-sm font-medium hover:text-accent"
                    >
                      {issue.title}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-ink-subtle">
                      {issue.summary}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-ink-muted">
                    {columnName.get(issue.column)}
                  </td>
                  <td className="px-3 py-2.5">
                    <PriorityChip priority={issue.priority} />
                  </td>
                  <td className="tabular px-3 py-2.5 text-right font-mono text-ink-muted">
                    {issue.points}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2 whitespace-nowrap text-ink-muted">
                      <Avatar member={member} size="sm" />
                      {member ? member.name.split(" ")[0] : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-ink-subtle">
                    {relativeDay(issue.updated)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="px-3 py-10 text-center text-[13px] text-ink-subtle">
            Nothing matches those filters. Widen one of them, or clear the
            search box.
          </p>
        )}
      </div>

      <p className="text-[11px] text-ink-subtle">
        {rows.length} of {board.length} issues
      </p>
    </div>
  );
}
