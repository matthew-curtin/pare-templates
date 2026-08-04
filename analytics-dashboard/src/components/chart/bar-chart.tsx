import { useState } from "react";
import { compact, withCommas } from "@/lib/format";

/**
 * Horizontal bars for nominal categories.
 *
 * **One colour for every bar.** The categories here (Direct, Docs,
 * npm…) have no natural order, so shading them darker-where-bigger
 * would encode the bar's length a second time and spend the only free
 * channel on information the chart already shows. A value ramp is for
 * ordered categories — see the funnel.
 *
 * Horizontal because the labels are words: rotated axis text is a
 * readability tax nobody has to pay.
 */
export function BarChart({
  data,
  valueLabel,
}: {
  data: { name: string; value: number }[];
  valueLabel: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ul className="space-y-1">
      {data.map((row) => {
        const share = total === 0 ? 0 : (row.value / total) * 100;
        return (
          <li
            key={row.name}
            className="relative grid grid-cols-[6.5rem_1fr_4rem] items-center gap-3 rounded-md py-1.5 transition-colors"
            style={{
              background:
                hover === row.name ? "var(--color-sunk)" : "transparent",
            }}
            onPointerEnter={() => setHover(row.name)}
            onPointerLeave={() => setHover(null)}
          >
            <span className="truncate text-sm text-ink-muted">{row.name}</span>

            <span className="h-4 w-full">
              {/* 16px thick — under the 24px cap, so the row's leftover
                  space stays as air. Rounded at the data end, square at
                  the baseline. */}
              <span
                className="block h-4"
                style={{
                  width: `${(row.value / max) * 100}%`,
                  background: "var(--color-series-1)",
                  borderRadius: "0 4px 4px 0",
                }}
              />
            </span>

            {/* The value at the tip is the direct label — the reason
                this chart needs no tooltip to be readable. */}
            <span className="tnum text-right text-sm text-ink">
              {compact(row.value)}
            </span>

            {hover === row.name && (
              <span className="pointer-events-none absolute -top-1 right-0 z-10 translate-y-[-100%] rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg">
                <span className="font-semibold text-ink">{row.name}</span>
                <span className="tnum ml-2 text-ink-muted">
                  {withCommas(row.value)} {valueLabel} · {share.toFixed(1)}% of
                  total
                </span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
