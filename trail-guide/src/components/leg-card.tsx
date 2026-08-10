import Link from "next/link";
import type { Leg } from "@/content/types";
import { model } from "@/content/site";
import { shelters } from "@/content/route";
import { ascentOf, hoursOf } from "@/lib/route";
import { feet, hoursLabel, miles } from "@/lib/format";
import { TerrainBar, TerrainLegend } from "@/components/terrain-bar";

const nameOf = new Map(shelters.map((s) => [s.id, s.name]));

/**
 * One leg, at whatever width it has been given.
 *
 * The container queries in globals.css are doing real work here rather
 * than decorating: this card appears three legs across on the stages
 * index, full width inside a day on the planner, and squeezed beside
 * the rail on a phone. Dropping the planner from nine days to seven
 * makes every card in it narrower at an unchanged viewport width, so
 * "how much fits" is a question about the CARD and a media query cannot
 * answer it.
 *
 * The hours are the largest thing on the card and the miles are the
 * smallest, which is the site's whole argument expressed as type size.
 */
export function LegCard({ leg, index }: { leg: Leg; index: number }) {
  const hours = hoursOf(leg, model);
  return (
    <article className="leg-card border border-line bg-surface transition-colors hover:border-line-strong">
      <Link href={`/stages/${leg.slug}`} className="focus-ring block p-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="datum text-[0.75rem] text-ink-subtle">
            Leg {index + 1}
          </span>
          {leg.dry ? (
            <span
              data-dry="true"
              className="datum border border-warn/50 px-1.5 py-0.5 text-[0.6875rem] text-warn"
            >
              no water
            </span>
          ) : null}
        </div>

        <h3 className="head mt-1 text-title">{leg.name}</h3>
        <p className="mt-1 text-[0.8125rem] text-ink-subtle">
          {nameOf.get(leg.from)} → {nameOf.get(leg.to)}
        </p>

        <p className="figure mt-4 text-[2rem] leading-none text-ink">
          {hoursLabel(hours)}
        </p>
        <p className="datum mt-1.5 text-[0.8125rem] text-ink-muted">
          {miles(leg.distance)} · {feet(ascentOf(leg))} up
        </p>

        <TerrainBar leg={leg} className="mt-4" />

        <p className="leg-note prose-block mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
          {leg.summary}
        </p>

        <div className="leg-terrain-full mt-3">
          <TerrainLegend leg={leg} />
        </div>
      </Link>
    </article>
  );
}
