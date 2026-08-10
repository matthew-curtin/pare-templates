import type { Kiln } from "@/content/types";
import { percent } from "@/lib/format";

/**
 * How much of a kiln is spoken for, and the line it will not light below.
 *
 * The bar animates up from nothing, so a firing short of its threshold
 * is WATCHED failing to reach the mark rather than described as having
 * failed — which is §4c's rule about motion that carries information
 * rather than decorating. `--load` is a registered custom property; the
 * note in globals.css explains why that is the load-bearing half.
 *
 * `data-status` on this element is also what the card two levels up
 * reads with `:has()` to go cold, so this is the single place the state
 * is declared.
 */
export function Gauge({
  kiln,
  load,
  status,
}: {
  kiln: Kiln;
  load: number;
  status: "loading" | "planned" | "postponed" | "open" | "fired";
}) {
  const short = load < kiln.minLoad;

  return (
    <div className="min-w-0">
      <div
        className="gauge relative h-3 border border-line-strong"
        data-status={status}
        data-short={short ? "true" : "false"}
        style={{ "--load": percent(Math.min(1, load), 1) } as React.CSSProperties}
        role="img"
        aria-label={`${percent(load)} of the kiln spoken for; ${kiln.name} will not fire below ${percent(kiln.minLoad)}`}
      >
        <span className="gauge-mark" style={{ left: percent(kiln.minLoad) }} />
      </div>
      <div className="figure mt-1 flex flex-wrap items-baseline gap-x-2 text-[0.75rem] text-ink-subtle">
        <span className={short ? "text-cold" : "text-fire"}>{percent(load)} spoken for</span>
        <span>·</span>
        <span>lights at {percent(kiln.minLoad)}</span>
      </div>
    </div>
  );
}
