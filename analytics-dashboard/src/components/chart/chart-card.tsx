import { useId, useState } from "react";

/**
 * The frame every chart sits in — title, optional note, and the
 * chart/table toggle.
 *
 * The toggle is not a nicety. A tooltip must never be the only way to
 * read a value, and one of this app's series sits below 3:1 against
 * the white surface, so colour alone cannot carry it either. The table
 * is the WCAG-clean twin of every chart, and putting it in the shared
 * frame means no chart can ship without one.
 */
export function ChartCard({
  title,
  subtitle,
  note,
  table,
  toolbar,
  children,
}: {
  title: string;
  subtitle?: string;
  /** A line of prose under the chart — what the reader should notice. */
  note?: string;
  /** The table twin. Rendered instead of the chart when toggled. */
  table: React.ReactNode;
  /** Optional controls belonging to this card (a legend, usually). */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const panelId = useId();

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-ink">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-ink-subtle">{subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 rounded-lg bg-sunk p-0.5">
          {(["chart", "table"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              aria-pressed={view === option}
              aria-controls={panelId}
              className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                view === option
                  ? "bg-surface text-ink shadow-[0_1px_2px_rgba(20,22,26,0.08)]"
                  : "text-ink-subtle hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {toolbar && view === "chart" && <div className="mt-4">{toolbar}</div>}

      <div id={panelId} className="mt-4">
        {view === "chart" ? children : table}
      </div>

      {note && (
        <p className="mt-4 border-t border-line pt-3 text-sm leading-relaxed text-ink-muted">
          {note}
        </p>
      )}
    </section>
  );
}

/** The table twin's shared shape, so every one looks the same. */
export function DataTable({
  columns,
  rows,
  align = [],
}: {
  columns: string[];
  rows: React.ReactNode[][];
  /** Per-column alignment; defaults to left. */
  align?: ("left" | "right")[];
}) {
  return (
    <div className="max-h-80 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-line">
            {columns.map((column, i) => (
              <th
                key={column}
                scope="col"
                className={`py-2 pr-4 font-semibold text-ink-muted ${
                  align[i] === "right" ? "text-right" : "text-left"
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2 pr-4 ${
                    align[j] === "right" ? "tnum text-right" : "text-left"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A legend row. Always present for two or more series — identity must
 *  never depend on matching colours by eye. A single series gets none:
 *  the title already names what is plotted. */
export function Legend({
  items,
}: {
  items: { label: string; color: string; muted?: boolean }[];
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: item.color }}
          />
          {/* Text wears ink, never the series colour — a light hue is
              illegible as text, and the swatch beside it is what
              carries identity. */}
          <span
            className={`text-xs ${item.muted ? "text-ink-subtle" : "text-ink-muted"}`}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
