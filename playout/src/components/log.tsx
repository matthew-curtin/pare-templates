import { Link } from "react-router-dom";
import type { Breach, Placed } from "@/content/types";
import { describe } from "@/lib/describe";
import { clock, duration, hours } from "@/lib/format";
import { NOW } from "@/content/site";

/**
 * One element of the log.
 *
 * The row is a grid rather than a flex line because four of its five
 * columns must align down the whole hour — a log you cannot read
 * vertically is a list, and the entire value of a log is that the eye
 * runs down the times.
 *
 * Its state is carried on data attributes and dressed in `index.css`, so
 * "what a playing row looks like" is one place in a stylesheet rather
 * than a ternary in here.
 */
export function LogRow({
  placed,
  breach,
}: {
  placed: Placed;
  breach?: Breach;
}) {
  const shown = describe(placed);
  const end = placed.start + placed.seconds;
  const playing = NOW >= placed.start && NOW < end;
  const past = end <= NOW;

  return (
    <div
      className="log-row grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-x-3 px-3 py-1.5"
      data-playing={playing}
      data-past={past}
      data-flagged={breach !== undefined}
    >
      <div className="tnum text-[0.75rem] text-ink-subtle">{clock(placed.start)}</div>

      <div className="log-row-body min-w-0">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <span className="pill border-0 px-0 text-ink-subtle">{shown.kind}</span>
          <span className="truncate text-[0.875rem] text-ink">
            {shown.trackId ? (
              <Link
                to={`/library/${shown.trackId}`}
                className="focus-ring hover:text-signal"
              >
                {shown.title}
              </Link>
            ) : (
              shown.title
            )}
          </span>
          {shown.by ? (
            <span className="log-row-by truncate text-[0.8125rem] text-ink-muted">
              {shown.by}
            </span>
          ) : null}
        </div>

        {breach ? (
          <p className="mt-0.5 text-[0.75rem] leading-snug text-live">
            {breach.kind === "rest"
              ? `Back after ${hours(breach.gap / 3600)} — the wheel asks ${hours(breach.required / 3600)}.`
              : `${breach.artist} was on ${hours(breach.gap / 3600)} ago — the wheel asks ${hours(breach.required / 3600)}.`}
          </p>
        ) : null}
      </div>

      <div className="flex items-baseline gap-3">
        {shown.ramp !== null ? (
          <span className="log-row-ramp tnum text-[0.6875rem] text-ink-subtle">
            ramp {duration(shown.ramp)}
          </span>
        ) : null}
        <span className="tnum text-[0.8125rem] text-ink-muted">
          {duration(placed.seconds)}
        </span>
      </div>
    </div>
  );
}

/** A run of rows, in a container the rows can measure themselves
 *  against. The width here differs by a factor of two between the front
 *  page and the day view, which is what makes this a container query
 *  rather than a media query. */
export function LogList({
  rows,
  breachOf,
}: {
  rows: Placed[];
  breachOf?: (placed: Placed) => Breach | undefined;
}) {
  return (
    <div className="log divide-y divide-line/60">
      {rows.map((placed) => (
        <LogRow
          key={`${placed.hour}:${placed.index}`}
          placed={placed}
          breach={breachOf ? breachOf(placed) : undefined}
        />
      ))}
    </div>
  );
}
