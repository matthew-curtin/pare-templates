import type { Leg, Terrain } from "@/content/types";
import { terrainNames } from "@/content/site";
import { terrainBreakdown } from "@/lib/route";

/**
 * What the ground is made of, as a bar in the same colours the rail
 * uses. The two have to agree or the site is teaching a colour language
 * on one page and contradicting it on another, which is why both read
 * `--color-ground-*` rather than either owning the values.
 */
export function TerrainBar({ leg, className = "" }: { leg: Leg; className?: string }) {
  const parts = terrainBreakdown(leg);
  return (
    <div className={`flex h-1.5 w-full overflow-hidden ${className}`} aria-hidden="true">
      {parts.map((p) => (
        <span
          key={p.terrain}
          style={{
            width: `${(p.miles / leg.distance) * 100}%`,
            background: `var(--color-ground-${p.terrain})`,
          }}
        />
      ))}
    </div>
  );
}

export function TerrainLegend({ leg }: { leg: Leg }) {
  const parts = terrainBreakdown(leg);
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {parts.map((p) => (
        <li key={p.terrain} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2"
            style={{ background: `var(--color-ground-${p.terrain})` }}
            aria-hidden="true"
          />
          <span className="text-[0.8125rem] text-ink-muted">
            {terrainNames[p.terrain as Terrain].label}
          </span>
          <span className="datum text-[0.8125rem] text-ink-subtle">
            {p.miles.toFixed(1)}
          </span>
        </li>
      ))}
    </ul>
  );
}
