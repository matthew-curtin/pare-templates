import { useState } from "react";
import { withCommas } from "@/lib/format";

/** Categorical slots, assigned in fixed order and never cycled — an
 *  entity keeps its hue when a neighbour is filtered away. */
const SERIES = [
  "var(--color-series-1)",
  "var(--color-series-2)",
  "var(--color-series-3)",
];

/** Below this share, a label will not fit inside its own segment with
 *  comfortable padding, so it goes to the legend instead of being
 *  clipped. Clipping the first characters is worse than no label. */
const LABEL_THRESHOLD = 16;

/**
 * Part-to-whole, as one horizontal bar.
 *
 * Three segments on purpose. The palette's fourth slot is yellow,
 * which sits beside slot two's orange — the one adjacent pair the
 * validator flags — so the fourth tier lives in the table rather than
 * taking a colour it cannot safely wear.
 *
 * Segments are separated by a 2px gap in the surface colour, never by
 * a border. A stroke around a mark adds ink that is not data.
 */
export function StackedBar({
  data,
  unit,
}: {
  data: { name: string; value: number }[];
  unit: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="flex h-12 w-full gap-0.5">
        {data.map((segment, i) => {
          const share = total === 0 ? 0 : (segment.value / total) * 100;
          const color = SERIES[i % SERIES.length];
          return (
            <div
              key={segment.name}
              className="relative flex h-full items-center justify-center overflow-visible transition-opacity first:rounded-l-md last:rounded-r-md"
              style={{
                width: `${share}%`,
                background: color,
                opacity: hover === null || hover === segment.name ? 1 : 0.55,
              }}
              onPointerEnter={() => setHover(segment.name)}
              onPointerLeave={() => setHover(null)}
            >
              {/* A label inside a coloured fill is the one place text
                  may leave the ink tokens — white is picked against
                  the fill's luminance so it always clears contrast. */}
              {share >= LABEL_THRESHOLD && (
                <span className="px-2 text-xs font-semibold text-white">
                  {share.toFixed(0)}%
                </span>
              )}

              {hover === segment.name && (
                <span className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 translate-y-[-100%] rounded-lg border border-line bg-surface px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                  <span className="font-semibold text-ink">{segment.name}</span>
                  <span className="tnum ml-2 text-ink-muted">
                    {withCommas(segment.value)} {unit} · {share.toFixed(1)}%
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* The legend carries the values, so the segment too small to
          label inside is not gated behind a hover. */}
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {data.map((segment, i) => (
          <li key={segment.name} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: SERIES[i % SERIES.length] }}
            />
            <span className="text-xs text-ink-muted">{segment.name}</span>
            <span className="tnum text-xs font-semibold text-ink">
              {withCommas(segment.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
