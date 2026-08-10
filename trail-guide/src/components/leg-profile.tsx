import type { Leg } from "@/content/types";
import { dominantTerrain, profileBounds } from "@/lib/route";
import { feet } from "@/lib/format";

/**
 * One leg's profile, drawn the conventional way round — distance left
 * to right, height up the page.
 *
 * That is deliberately NOT the rail's orientation, and the difference
 * carries meaning rather than being an inconsistency. The rail is a
 * spine you travel down, so distance runs the way the page scrolls. A
 * single leg is a chart you read, so it runs the way a chart reads. The
 * moment a reader has both on screen the two orientations tell them
 * which one is which.
 *
 * The vertical scale is the WHOLE ROUTE's range, not the leg's own, so
 * that a leg on the plateau looks high and the walk out looks low. A
 * per-leg scale would make every leg the same shape, which is the usual
 * mistake and it flatters the flat ones.
 */
export function LegProfile({ leg, legs }: { leg: Leg; legs: Leg[] }) {
  const bounds = profileBounds(legs);
  const W = 1000;
  const H = 260;
  const pad = 10;

  const pts = leg.profile.map((e, i) => ({
    x: (W * i) / (leg.profile.length - 1),
    y:
      H -
      pad -
      (H - pad * 2) * ((e - bounds.low) / (bounds.high - bounds.low)),
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const ground = dominantTerrain(leg);

  const highIndex = leg.profile.indexOf(Math.max(...leg.profile));

  return (
    <figure className="border border-line bg-surface">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block h-40 w-full sm:h-56"
        role="img"
        aria-label={`Elevation profile of ${leg.name}, from ${feet(leg.profile[0])} to ${feet(leg.profile[leg.profile.length - 1])}, high point ${feet(Math.max(...leg.profile))}.`}
      >
        <path d={area} fill={`var(--color-ground-${ground})`} opacity="0.32" />
        <path
          d={line}
          fill="none"
          stroke={`var(--color-ground-${ground})`}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={pts[highIndex].x}
          cy={pts[highIndex].y}
          r="3"
          fill="var(--color-ink)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <figcaption className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-line px-3 py-2">
        <span className="datum text-[0.75rem] text-ink-subtle">
          {feet(leg.profile[0])} at the start
        </span>
        <span className="datum text-[0.75rem] text-ink-muted">
          high point {feet(Math.max(...leg.profile))}
        </span>
        <span className="datum text-[0.75rem] text-ink-subtle">
          {feet(leg.profile[leg.profile.length - 1])} at the end
        </span>
      </figcaption>
    </figure>
  );
}
