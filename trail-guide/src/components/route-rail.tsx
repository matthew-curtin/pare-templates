import { legs, shelters } from "@/content/route";
import { dominantTerrain, mileposts, profileBounds, totalDistance } from "@/lib/route";

/**
 * The spine. CONVENTIONS §4c — this is the structural device only this
 * template has, and it is on every page.
 *
 * The whole 122 miles is drawn as one elevation profile turned on its
 * side: distance runs DOWN the page and height runs across the rail, so
 * scrolling the page is travelling the route. Each leg is filled in the
 * colour of the ground it is mostly made of, which turns the profile
 * into a second reading — dark patches are slow days — before anybody
 * has understood the shape.
 *
 * `mode` is the only thing that changes between pages:
 *
 *   "scroll"  a marker descends as you scroll. For pages that read in
 *             route order, where scroll position genuinely IS position
 *             on the route.
 *   "plain"   the profile, no marker. For pages that do not read in
 *             route order, where a scroll marker would be a confident
 *             lie about where you are.
 *   {from,to} a lit section, everything else dimmed. For a single leg.
 *
 * The distinction matters more than it looks. A position indicator that
 * tracks something other than position is worse than no indicator, and
 * this one is cheap enough to put everywhere that the temptation is to
 * put it everywhere.
 */

const TOTAL = totalDistance(legs);
const BOUNDS = profileBounds(legs);
const POSTS = mileposts(legs);

/** The viewBox is 100 × 1000 with preserveAspectRatio="none", so the
 *  profile stretches to whatever height the viewport happens to be.
 *  That is what lets a 122-mile route live in a sticky element: the
 *  vertical axis is a FRACTION of the route, never a number of pixels
 *  per mile. A rail drawn to a fixed scale would be four screens long
 *  and could not be sticky at all. */
const W = 100;
const H = 1000;

/** Feet → across the rail. The floor of 8 keeps the lowest point on the
 *  route as a visible sliver rather than a hairline. */
function x(elevation: number): number {
  return 8 + 84 * ((elevation - BOUNDS.low) / (BOUNDS.high - BOUNDS.low));
}

/** Miles → down the rail. */
function y(mile: number): number {
  return (H * mile) / TOTAL;
}

/**
 * Each leg gets two paths in its own terrain colour: a filled area at
 * low opacity and the ridge line itself at full strength.
 *
 * The first version filled each leg solid, and it read as a stack of
 * coloured stripes rather than as ground — the shape was there and
 * nothing drew the eye to it, because a 40px-wide band of flat colour
 * is a band whatever its edge is doing. Washing the fill back and
 * putting the weight on the LINE is what turns it into a profile. The
 * colour still says what the ground is; the line says what it does.
 */
type Drawn = { id: string; area: string; ridge: string; terrain: string };

const drawn: Drawn[] = legs.map((leg, i) => {
  const base = POSTS[i];
  const steps = leg.profile.length - 1;
  const pts = leg.profile.map((e, k) => ({
    x: x(e),
    y: y(base + (leg.distance * k) / steps),
  }));
  const ridge = pts
    .map((p, k) => `${k === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const area = `M 0 ${pts[0].y.toFixed(2)} ${ridge.slice(1)} L 0 ${pts[pts.length - 1].y.toFixed(2)} Z`;
  return { id: leg.id, area, ridge, terrain: dominantTerrain(leg) };
});

function Profile() {
  return (
    <>
      {drawn.map((d) => (
        <path
          key={`${d.id}-area`}
          d={d.area}
          fill={`var(--color-ground-${d.terrain})`}
          fillOpacity="0.3"
        />
      ))}
      {drawn.map((d) => (
        <path
          key={`${d.id}-ridge`}
          d={d.ridge}
          fill="none"
          stroke={`var(--color-ground-${d.terrain})`}
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  );
}

export type RailMode = "scroll" | "plain" | { from: number; to: number };

export function RouteRail({
  mode = "plain",
  label,
}: {
  mode?: RailMode;
  label: string;
}) {
  const lit = typeof mode === "object" ? mode : null;
  const clipId = "rail-lit";

  return (
    <div className="rail" data-rail-mode={typeof mode === "string" ? mode : "section"}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        role="img"
        aria-label={label}
      >
        {lit ? (
          <clipPath id={clipId}>
            <rect x="0" y={y(lit.from)} width={W} height={Math.max(y(lit.to) - y(lit.from), 1)} />
          </clipPath>
        ) : null}

        <g className={lit ? "rail-dim" : undefined}>
          <Profile />
        </g>

        {/* The lit section is the same drawing again, clipped to the
            part of the route this page is about. Drawing it twice is
            what lets the dimmed whole stay visible underneath, so the
            lit part reads as a POSITION within the route rather than as
            the only thing there is. */}
        {lit ? (
          <g clipPath={`url(#${clipId})`}>
            <Profile />
          </g>
        ) : null}

        {/* One tick per shelter. No labels: the rail is 40px wide on a
            phone, and a rail that needs a legend has stopped being a
            spine and become a chart. */}
        {POSTS.map((mile, i) => (
          <line
            key={shelters[i].id}
            x1="0"
            x2={W}
            y1={y(mile)}
            y2={y(mile)}
            stroke="var(--color-canvas)"
            strokeWidth="1"
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />
        ))}
      </svg>

      {mode === "scroll" ? (
        <div className="rail-marker">
          <div className="h-px w-full bg-water" />
          <div className="absolute left-0 top-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-water" />
        </div>
      ) : null}
    </div>
  );
}

/** Exported for the page that explains what the colours mean. */
export const railFacts = {
  total: TOTAL,
  bounds: BOUNDS,
  posts: POSTS,
};
