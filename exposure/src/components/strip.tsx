import type { Segment } from "@/lib/sun";
import { STRIP } from "@/content/site";
import { clock24 } from "@/lib/format";

const FILL: Record<Segment["state"], string> = {
  sun: "var(--color-sun)",
  sky: "var(--color-sky)",
  shade: "var(--color-shade)",
  night: "var(--color-night)",
};

/**
 * One day in one room, drawn 04:00 to 22:00.
 *
 * The window is FIXED at those hours on every strip on the site, which
 * is the whole reason two months can be compared by looking. Drawing
 * each day sunrise-to-sunset would give every strip the same length and
 * quietly delete the difference between June and December — the exact
 * thing this template exists to show.
 *
 * Nothing here is above 22:00 or below 04:00 at this latitude; the
 * longest day runs 05:58 to 21:15.
 */
export function Strip({
  segments,
  height = "1.5rem",
  ticks = false,
}: {
  segments: Segment[];
  height?: string;
  ticks?: boolean;
}) {
  const span = STRIP.to - STRIP.from;
  const pos = (h: number) => ((h - STRIP.from) / span) * 100;

  return (
    <div>
      <div className="strip" style={{ height }}>
        {segments.map((s, i) => {
          const left = Math.max(0, pos(s.from));
          const right = Math.min(100, pos(s.to));
          if (right <= 0 || left >= 100) return null;
          return (
            <span
              key={i}
              className="strip-band"
              style={{
                left: `${left}%`,
                right: `${100 - right}%`,
                background: FILL[s.state],
              }}
            />
          );
        })}
      </div>
      {ticks && (
        <div className="relative mt-1 h-3.5">
          {[6, 9, 12, 15, 18, 21].map((h) => (
            <span
              key={h}
              className="datum absolute top-0 -translate-x-1/2 text-[0.625rem] text-ink-subtle"
              style={{ left: `${pos(h)}%` }}
            >
              {clock24(h)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** The four states, named once, in the order they run light to dark. */
export function StripKey({ states }: { states: readonly { key: string; label: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {states.map((s) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className="h-2.5 w-5 shrink-0"
            style={{ background: FILL[s.key as Segment["state"]] }}
            aria-hidden="true"
          />
          <span className="datum text-[0.75rem] text-ink-muted">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
