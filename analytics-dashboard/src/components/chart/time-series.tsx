import { useRef, useState } from "react";
import { useMeasuredWidth } from "@/lib/use-measured-width";
import { shortDate } from "@/lib/format";

const PAD = { left: 52, right: 16, top: 12, bottom: 26 };
const PLOT_HEIGHT = 232;
/** The axis band is part of the height, not an overflow. A container
 *  sized to the plot alone gets a tiny nested scrollbar for its own
 *  labels. */
const HEIGHT = PLOT_HEIGHT + PAD.top + PAD.bottom;

/**
 * An axis maximum, and a tick count that divides it into round
 * numbers.
 *
 * Picking a "nice" maximum is not enough on its own: a max of 75,000
 * split into the usual five ticks gives 18,750 and 56,250, which no
 * axis should ever say out loud. Each candidate maximum therefore
 * carries the number of intervals that divides it cleanly.
 */
const SCALES: [mantissa: number, intervals: number][] = [
  [1, 4],
  [1.25, 5],
  [1.5, 3],
  [2, 4],
  [2.5, 5],
  [3, 3],
  [4, 4],
  [5, 5],
  [7.5, 3],
  [10, 5],
];

function niceScale(value: number): { max: number; ticks: number[] } {
  const safe = value <= 0 ? 1 : value;
  const magnitude = 10 ** Math.floor(Math.log10(safe));

  for (const [mantissa, intervals] of SCALES) {
    const max = mantissa * magnitude;
    if (safe <= max) {
      return {
        max,
        ticks: Array.from(
          { length: intervals + 1 },
          (_, i) => (max / intervals) * i
        ),
      };
    }
  }

  const max = 10 * magnitude;
  return { max, ticks: [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => t * max) };
}

export type SeriesPoint = { date: string; value: number };

/**
 * Trend over time, with the previous period behind it.
 *
 * This is an **emphasis** chart, not a categorical one: the current
 * period is the subject and the comparison is context, so it is one
 * hue plus grey rather than two competing colours. Two series still
 * means a legend — identity never rests on colour-matching alone.
 *
 * Deliberately one y-axis. Plotting a second measure on its own scale
 * would invent a correlation the data does not contain; if you need
 * another measure, add another chart.
 */
export function TimeSeries({
  current,
  previous,
  label,
  previousLabel,
  formatValue,
}: {
  current: SeriesPoint[];
  /** Aligned by index rather than by date — the two periods are
   *  compared day-for-day. Null when the range reaches the start of
   *  the data and there is no earlier period; the chart then drops to
   *  a single series and, correctly, to no legend. */
  previous: number[] | null;
  label: string;
  previousLabel: string;
  formatValue: (value: number) => string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const width = useMeasuredWidth(hostRef);
  const [hover, setHover] = useState<number | null>(null);

  const comparison =
    previous && previous.length === current.length ? previous : null;

  const plotWidth = Math.max(0, width - PAD.left - PAD.right);
  const { max, ticks } = niceScale(
    Math.max(...current.map((p) => p.value), ...(comparison ?? []), 1)
  );

  const x = (i: number) =>
    PAD.left +
    (current.length <= 1 ? plotWidth / 2 : (i / (current.length - 1)) * plotWidth);
  const y = (value: number) =>
    PAD.top + PLOT_HEIGHT - (value / max) * PLOT_HEIGHT;

  const linePath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");

  const areaPath = () =>
    `${linePath(current.map((p) => p.value))} L${x(current.length - 1)},${
      PAD.top + PLOT_HEIGHT
    } L${x(0)},${PAD.top + PLOT_HEIGHT} Z`;

  // Roughly six labels, whatever the range length.
  const labelEvery = Math.max(1, Math.round(current.length / 6));

  function onMove(event: React.PointerEvent<SVGRectElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const local = event.clientX - box.left;
    const ratio = plotWidth === 0 ? 0 : local / plotWidth;
    const index = Math.round(ratio * (current.length - 1));
    setHover(Math.min(current.length - 1, Math.max(0, index)));
  }

  const point = hover === null ? null : current[hover];

  return (
    <div ref={hostRef} className="relative">
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`${label} over ${current.length} days, compared with the ${previousLabel.toLowerCase()}`}
        >
          {/* Gridlines: solid hairlines one step off the surface.
              Never dashed — dashing reads as "threshold". */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--color-grid)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 10}
                y={y(tick) + 4}
                textAnchor="end"
                className="tnum"
                fontSize={11}
                fill="var(--color-ink-subtle)"
              >
                {formatValue(tick)}
              </text>
            </g>
          ))}

          {/* x labels */}
          {current.map((p, i) =>
            i % labelEvery === 0 || i === current.length - 1 ? (
              <text
                key={p.date}
                x={x(i)}
                y={PAD.top + PLOT_HEIGHT + 18}
                textAnchor={i === current.length - 1 ? "end" : "middle"}
                fontSize={11}
                fill="var(--color-ink-subtle)"
              >
                {shortDate(p.date)}
              </text>
            ) : null
          )}

          {/* Order matters: the wash goes down first, then the grey
              comparison on top of it, then the current line on top of
              both. Painting the wash last put a blue tint over the
              grey line and made it read as a third, muddier colour. */}
          <path d={areaPath()} fill="var(--color-series-1)" opacity={0.1} />

          {comparison && (
            <path
              d={linePath(comparison)}
              fill="none"
              stroke="var(--color-series-muted)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          <path
            d={linePath(current.map((p) => p.value))}
            fill="none"
            stroke="var(--color-series-1)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {hover !== null && point && (
            <g>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={PAD.top + PLOT_HEIGHT}
                stroke="var(--color-axis)"
                strokeWidth={1}
              />
              {/* 2px surface ring so the dots stay legible where they
                  cross the line or each other. */}
              {comparison && (
                <circle
                  cx={x(hover)}
                  cy={y(comparison[hover])}
                  r={4}
                  fill="var(--color-series-muted)"
                  stroke="var(--color-surface)"
                  strokeWidth={2}
                />
              )}
              <circle
                cx={x(hover)}
                cy={y(point.value)}
                r={4}
                fill="var(--color-series-1)"
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            </g>
          )}

          {/* One hit surface across the whole plot: a pointer never has
              to land on a 4px dot. */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={plotWidth}
            height={PLOT_HEIGHT}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
      )}

      {width === 0 && <div style={{ height: HEIGHT }} />}

      {hover !== null && point && (
        <div
          className="pointer-events-none absolute z-10 min-w-40 rounded-lg border border-line bg-surface p-3 shadow-lg"
          style={{
            left: Math.min(Math.max(8, x(hover) - 80), Math.max(8, width - 168)),
            top: PAD.top,
          }}
        >
          <p className="text-xs font-semibold text-ink">
            {shortDate(point.date)}
          </p>
          <dl className="mt-2 space-y-1">
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--color-series-1)" }}
                />
                {label}
              </dt>
              <dd className="tnum text-xs font-semibold text-ink">
                {formatValue(point.value)}
              </dd>
            </div>
            {comparison && (
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--color-series-muted)" }}
                  />
                  {previousLabel}
                </dt>
                <dd className="tnum text-xs font-semibold text-ink-muted">
                  {formatValue(comparison[hover])}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
