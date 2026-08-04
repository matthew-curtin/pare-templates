import { Sparkline } from "./chart/sparkline";
import { compact, duration, ratio, signedPercent } from "@/lib/format";
import type { KpiValue } from "@/lib/derive";

function render(value: number, format: KpiValue["kpi"]["format"]): string {
  switch (format) {
    case "duration":
      return duration(value);
    case "percent":
      return ratio(value);
    default:
      return compact(value);
  }
}

/**
 * One headline number.
 *
 * The value uses the font's proportional figures, not `tabular-nums`:
 * equal-width digits are for columns that must line up, and at this
 * size they make a number like 121 look loose. The table columns
 * elsewhere do use them.
 *
 * The delta is never colour alone — it ships with an arrow glyph and
 * the period it is measured against, so the direction survives both
 * colour blindness and a black-and-white print.
 */
export function StatTile({
  item,
  comparisonLabel,
}: {
  item: KpiValue;
  comparisonLabel: string;
}) {
  const { kpi, value, changePercent, isGood, spark } = item;

  const deltaColor =
    isGood === null
      ? "var(--color-ink-subtle)"
      : isGood
        ? "var(--color-good-text)"
        : "var(--color-critical)";

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-ink-muted">{kpi.label}</p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl leading-none font-semibold text-ink">
          {render(value, kpi.format)}
        </p>
        <Sparkline values={spark} />
      </div>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 text-xs">
        {changePercent === null ? (
          <span className="text-ink-subtle">No earlier period to compare</span>
        ) : (
          <>
            <span className="font-semibold" style={{ color: deltaColor }}>
              {changePercent > 0 ? "↑" : changePercent < 0 ? "↓" : "→"}{" "}
              {signedPercent(changePercent)}
            </span>
            <span className="text-ink-subtle">vs {comparisonLabel}</span>
          </>
        )}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-ink-subtle">{kpi.help}</p>
    </div>
  );
}
