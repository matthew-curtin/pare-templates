import { withCommas } from "@/lib/format";
import type { FunnelStage } from "@/content/types";

/**
 * The activation funnel.
 *
 * The one chart here that legitimately uses a value ramp: funnel
 * stages are genuinely *ordered*, so the ordinal blue steps carry that
 * order. On nominal categories the same treatment would be wrong —
 * see the note in bar-chart.tsx.
 *
 * The ramp does not start lighter than step 250: below that the first
 * stage stops being distinguishable from the surface it sits on.
 */
const STEPS = [
  "var(--color-step-1)",
  "var(--color-step-2)",
  "var(--color-step-3)",
  "var(--color-step-4)",
  "var(--color-step-5)",
];

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const first = stages[0]?.teams ?? 1;

  return (
    <ol className="space-y-3">
      {stages.map((stage, i) => {
        const share = (stage.teams / first) * 100;
        const previous = i === 0 ? null : stages[i - 1].teams;
        const dropped = previous === null ? 0 : previous - stage.teams;
        const dropPercent = previous === null ? 0 : (dropped / previous) * 100;
        // Later steps are dark enough to need white text; earlier ones
        // are not. Picked by step rather than measured, because the
        // ramp is fixed.
        const labelInk = i >= 2 ? "#ffffff" : "var(--color-ink)";

        return (
          <li key={stage.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-semibold text-ink">{stage.name}</p>
              <p className="tnum text-sm text-ink-muted">
                {withCommas(stage.teams)} teams
                <span className="ml-2 text-ink-subtle">
                  {share.toFixed(0)}% of signups
                </span>
              </p>
            </div>

            <div className="mt-1.5 h-8 w-full rounded-md bg-sunk">
              <div
                className="flex h-8 items-center rounded-md px-3"
                style={{ width: `${share}%`, background: STEPS[i % STEPS.length] }}
              >
                {share >= 22 && (
                  <span
                    className="tnum text-xs font-semibold"
                    style={{ color: labelInk }}
                  >
                    {withCommas(stage.teams)}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-1.5 text-xs text-ink-subtle">
              {stage.detail}
              {previous !== null && (
                <>
                  {" · "}
                  <span className="text-ink-muted">
                    {withCommas(dropped)} dropped ({dropPercent.toFixed(0)}%)
                  </span>
                </>
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
