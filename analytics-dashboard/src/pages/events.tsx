import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/app-shell";
import { Sparkline } from "@/components/chart/sparkline";
import { KIND_LABEL, events } from "@/content/events";
import type { EventKind } from "@/content/types";
import { compact, dateTime, signedPercent } from "@/lib/format";

type SortKey = "name" | "volume" | "changePercent" | "teams" | "lastSeen";

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "name", label: "Event", align: "left" },
  { key: "volume", label: "Volume, 30d", align: "right" },
  { key: "changePercent", label: "Change", align: "right" },
  { key: "teams", label: "Teams", align: "right" },
  { key: "lastSeen", label: "Last seen", align: "right" },
];

const KINDS: (EventKind | "all")[] = ["all", "track", "identify", "page", "error"];

export function EventsPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<EventKind | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({
    key: "volume",
    desc: true,
  });

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = events.filter(
      (event) =>
        (kind === "all" || event.kind === kind) &&
        (needle === "" ||
          event.name.toLowerCase().includes(needle) ||
          event.owner.toLowerCase().includes(needle))
    );

    return [...filtered].sort((a, b) => {
      const left = a[sort.key];
      const right = b[sort.key];
      const compared =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return sort.desc ? -compared : compared;
    });
  }, [query, kind, sort]);

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current.key === key
        ? { key, desc: !current.desc }
        : // Numbers are most useful largest-first; names A–Z.
          { key, desc: key !== "name" }
    );
  }

  return (
    <>
      <PageHeader
        title="Events"
        description="Everything the SDK is sending, and who owns it."
      />

      <div className="p-6">
        {/* One filter row above the table it scopes. */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative">
            <span className="sr-only">Search events</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or owner"
              className="w-64 rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none placeholder:text-ink-subtle focus:border-accent"
            />
          </label>

          <div role="group" aria-label="Event kind" className="flex flex-wrap gap-1.5">
            {KINDS.map((option) => {
              const active = kind === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setKind(option)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-line-strong text-ink-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  {option === "all" ? "All" : KIND_LABEL[option]}
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="ml-auto text-sm text-ink-subtle">
            {shown.length} of {events.length}
          </p>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line">
                {COLUMNS.map((column) => {
                  const active = sort.key === column.key;
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={
                        active
                          ? sort.desc
                            ? "descending"
                            : "ascending"
                          : "none"
                      }
                      className={`px-4 py-3 font-semibold ${
                        column.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className={`inline-flex items-center gap-1 transition-colors hover:text-accent ${
                          active ? "text-ink" : "text-ink-muted"
                        }`}
                      >
                        {column.label}
                        <span aria-hidden="true" className="text-xs">
                          {active ? (sort.desc ? "↓" : "↑") : "↕"}
                        </span>
                      </button>
                    </th>
                  );
                })}
                <th scope="col" className="px-4 py-3 text-right font-semibold text-ink-muted">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-line last:border-0 hover:bg-canvas"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/events/${event.id}`}
                      className="font-medium text-ink hover:text-accent"
                    >
                      <code className="font-mono text-[0.85em]">
                        {event.name}
                      </code>
                    </Link>
                    <span className="mt-0.5 block text-xs text-ink-subtle">
                      {KIND_LABEL[event.kind]} · {event.owner}
                    </span>
                  </td>
                  <td className="tnum px-4 py-3 text-right">
                    {compact(event.volume)}
                  </td>
                  <td
                    className="tnum px-4 py-3 text-right font-medium"
                    style={{
                      color:
                        event.kind === "error"
                          ? // Up is bad for an error event, so the
                            // colour follows meaning rather than sign.
                            event.changePercent > 0
                            ? "var(--color-critical)"
                            : "var(--color-good-text)"
                          : event.changePercent > 0
                            ? "var(--color-good-text)"
                            : "var(--color-critical)",
                    }}
                  >
                    {event.changePercent > 0 ? "↑" : "↓"}{" "}
                    {signedPercent(event.changePercent)}
                  </td>
                  <td className="tnum px-4 py-3 text-right text-ink-muted">
                    {compact(event.teams)}
                  </td>
                  <td className="tnum px-4 py-3 text-right whitespace-nowrap text-ink-muted">
                    {dateTime(event.lastSeen)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-block align-middle">
                      <Sparkline
                        values={event.trend}
                        width={72}
                        height={22}
                        muted={event.kind === "error"}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {shown.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-ink-subtle">
              No events match that. Try clearing the search or the kind filter.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
