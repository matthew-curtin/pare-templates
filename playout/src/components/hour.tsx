import type { ReactNode } from "react";
import type { HourStat } from "@/content/types";
import { duration, hourLabel, signedShort } from "@/lib/format";

/**
 * The drift meter.
 *
 * A bar either side of a centre line. Over and under are told apart by
 * WHICH SIDE the bar is on, never by hue — a red/green pair for over and
 * under is the single most common chart mistake and it is invisible to
 * about one man in twelve (CONVENTIONS §4b). Hue is left to say
 * something else entirely: the bar turns to the on-air colour when the
 * hour has drifted further than it can correct, which is the only fact
 * on this meter anybody has to act on.
 *
 * The faint block behind the bar is the tolerance — how close this hour
 * could land at its very best. On a hosted hour it is a hairline,
 * because the answer is "exactly".
 */
export function DriftMeter({
  drift,
  tolerance,
  max = 300,
}: {
  drift: number;
  tolerance: number;
  max?: number;
}) {
  const share = Math.min(1, Math.abs(drift) / max) * 50;
  const band = Math.min(1, tolerance / max) * 50;
  const beyond = Math.abs(drift) > tolerance;

  return (
    <div
      className="drift-track relative h-2 w-full overflow-hidden rounded-full"
      role="img"
      aria-label={`${signedShort(drift)} against the junction, within a tolerance of ${duration(tolerance)}`}
    >
      <span
        className="absolute inset-y-0 bg-line/70"
        style={{ left: `${50 - band}%`, width: `${band * 2}%` }}
      />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong" />
      <span
        className="drift-bar absolute inset-y-0"
        data-beyond-trim={beyond}
        style={
          drift >= 0
            ? { left: "50%", width: `${share}%` }
            : { right: "50%", width: `${share}%` }
        }
      />
    </div>
  );
}

/**
 * The head of an hour: everything you need to decide whether to open it.
 *
 * `flagged` is passed in rather than derived from the rows below,
 * because the rows below do not exist until the hour is open — and a
 * mark that tells you which hours to open is worthless if it only
 * appears on the ones you have already opened.
 */
export function HourHead({
  stat,
  showName,
  mode,
  expanded,
  flagged,
  onToggle,
  aside,
}: {
  stat: HourStat;
  showName: string;
  mode: string;
  expanded: boolean;
  flagged: boolean;
  onToggle: () => void;
  aside?: ReactNode;
}) {
  const clean = stat.clean;
  return (
    <div className="hour-head" data-flagged={flagged}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="focus-ring grid w-full grid-cols-[4.5rem_1fr] items-center gap-x-3 px-3 py-3 text-left transition-colors hover:bg-[var(--wash-raised)] sm:grid-cols-[4.5rem_1fr_14rem_7rem]"
      >
        <span className="clock text-[1.125rem]">{hourLabel(stat.hour.h)}</span>

        <span className="min-w-0">
          <span className="block truncate text-[0.9375rem] text-ink">{showName}</span>
          <span className="block text-[0.75rem] text-ink-subtle">
            {mode} · {stat.elements} elements · absorbs with{" "}
            {stat.finestTrim <= 1 ? "speech" : duration(stat.finestTrim)}
          </span>
        </span>

        <span className="col-span-2 mt-2 sm:col-span-1 sm:mt-0">
          <DriftMeter drift={stat.drift} tolerance={stat.tolerance} />
        </span>

        <span
          className={`tnum text-[0.875rem] sm:text-right ${clean ? "text-ink-muted" : "text-live"}`}
        >
          {signedShort(stat.drift)}
        </span>
      </button>
      {aside}
    </div>
  );
}
