import { ranges } from "@/content/metrics";
import type { Range, RangeId } from "@/content/types";

/**
 * The date-range control.
 *
 * It lives in one row above everything it scopes, never inside a chart
 * card. Per-chart filters are how a dashboard ends up showing two
 * cards on two different periods, side by side, with nothing saying so.
 */
export function RangePicker({
  value,
  onChange,
}: {
  value: Range;
  onChange: (id: RangeId) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Date range"
      className="flex rounded-lg border border-line bg-surface p-0.5"
    >
      {ranges.map((range) => {
        const active = range.id === value.id;
        return (
          <button
            key={range.id}
            type="button"
            onClick={() => onChange(range.id)}
            aria-pressed={active}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-accent text-white"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
