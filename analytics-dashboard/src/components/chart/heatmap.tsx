import { useState } from "react";
import type { Cohort } from "@/content/types";

/**
 * Weekly retention.
 *
 * A **sequential** ramp: one hue, light to dark, because the value is
 * continuous magnitude rather than identity. Unlike the funnel's
 * ordinal ramp, the lightest step here is allowed to recede toward the
 * surface — it means "almost nobody", and that is worth showing as
 * near-nothing.
 *
 * Every cell carries its own number. On a retention grid that is the
 * convention and it is also the mitigation: the pale steps sit below
 * 3:1 against the surface, so the value must not depend on reading the
 * colour.
 */
const STEPS = [
  "var(--color-heat-0)",
  "var(--color-heat-1)",
  "var(--color-heat-2)",
  "var(--color-heat-3)",
  "var(--color-heat-4)",
  "var(--color-heat-5)",
  "var(--color-heat-6)",
];

/** Which step a fraction lands on. Fixed bands rather than a scale
 *  fitted to the data, so two cohorts of the same value always read
 *  the same colour across renders. */
function stepFor(value: number): number {
  if (value >= 0.9) return 6;
  if (value >= 0.65) return 5;
  if (value >= 0.5) return 4;
  if (value >= 0.4) return 3;
  if (value >= 0.25) return 2;
  if (value > 0) return 1;
  return 0;
}

/** White on the dark end, ink on the light end. */
function inkFor(step: number): string {
  return step >= 4 ? "#ffffff" : "var(--color-ink)";
}

export function Heatmap({ cohorts }: { cohorts: Cohort[] }) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const weeks = Math.max(...cohorts.map((c) => c.values.length));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-separate border-spacing-0.5">
        <caption className="sr-only">
          Weekly retention by cohort. Each row is the week a group of teams
          arrived; each column is how many were still active that many weeks
          later.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="pr-3 pb-2 text-left text-xs font-semibold text-ink-muted"
            >
              Cohort
            </th>
            <th
              scope="col"
              className="pr-3 pb-2 text-right text-xs font-semibold text-ink-muted"
            >
              Teams
            </th>
            {Array.from({ length: weeks }, (_, i) => (
              <th
                key={i}
                scope="col"
                className="pb-2 text-center text-xs font-semibold text-ink-muted"
              >
                W{i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort, row) => (
            <tr key={cohort.label}>
              <th
                scope="row"
                className="pr-3 text-left text-xs font-normal whitespace-nowrap text-ink-muted"
              >
                {cohort.label}
              </th>
              <td className="tnum pr-3 text-right text-xs text-ink-muted">
                {cohort.size}
              </td>
              {Array.from({ length: weeks }, (_, col) => {
                const value = cohort.values[col];
                if (value === undefined) {
                  return <td key={col} className="h-9" />;
                }
                const step = stepFor(value);
                const isHover = hover?.row === row && hover?.col === col;
                return (
                  <td key={col} className="relative h-9 p-0">
                    <div
                      className="tnum flex h-9 items-center justify-center rounded-sm text-xs font-medium transition-transform"
                      style={{
                        background: STEPS[step],
                        color: inkFor(step),
                        transform: isHover ? "scale(1.06)" : undefined,
                      }}
                      onPointerEnter={() => setHover({ row, col })}
                      onPointerLeave={() => setHover(null)}
                    >
                      {Math.round(value * 100)}%
                    </div>

                    {isHover && (
                      <div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 translate-y-[-100%] rounded-lg border border-line bg-surface px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                        <span className="font-semibold text-ink">
                          {cohort.label}
                        </span>
                        <span className="tnum ml-2 text-ink-muted">
                          week {col} · {Math.round(value * cohort.size)} of{" "}
                          {cohort.size} teams
                        </span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
