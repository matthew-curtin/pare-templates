/**
 * The 12-point trend inside a stat tile.
 *
 * Deliberately has no tooltip. The tile's own value and delta are the
 * readable data; the line is shape, not a lookup surface, and every
 * value in it is available with full hover on the chart below and in
 * that chart's table view. A tooltip on a 60px sparkline would be a
 * hit target nobody can land on, for a number already on screen.
 *
 * Drawn in a scaled viewBox rather than at measured pixels — this is
 * the one place that is fine, because there is no text and no axis to
 * distort, and `vector-effect` holds the stroke at 2px.
 */
export function Sparkline({
  values,
  width = 96,
  height = 28,
  muted = false,
}: {
  values: number[];
  width?: number;
  height?: number;
  muted?: boolean;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * width;
    // 2px of padding top and bottom so the extremes are not clipped by
    // the stroke's own width.
    const y = height - 2 - ((value - min) / span) * (height - 4);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="overflow-visible"
    >
      <path
        d={points.join(" ")}
        fill="none"
        stroke={
          muted ? "var(--color-series-muted)" : "var(--color-series-1)"
        }
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
