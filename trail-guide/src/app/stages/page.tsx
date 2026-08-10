import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { LegCard } from "@/components/leg-card";
import { legs, shelters } from "@/content/route";
import { model } from "@/content/site";
import { ascentOf, hoursOf, mileposts, totalDistance, totalHours } from "@/lib/route";
import { feet, hoursLabel, hoursRough, miles } from "@/lib/format";

export const metadata: Metadata = {
  title: "Stages",
  description:
    "All eleven legs of the Sable Traverse, in route order, quoted in hours.",
};

const posts = mileposts(legs);

export default function StagesPage() {
  return (
    <Shell
      rail="scroll"
      railLabel="Elevation profile of the whole traverse. Your position on this page tracks down it."
    >
      <div className="px-4 py-12 sm:px-8">
        <h1 className="head text-display">Eleven legs, north to south</h1>
        <p className="prose-block mt-4 text-lede leading-relaxed text-ink-muted">
          Each one runs between two places you are allowed to sleep, and
          none of them can be split. Scrolling this page is walking the
          route: the marker on the rail is where you are.
        </p>
        <p className="datum mt-4 text-[0.875rem] text-ink-subtle">
          {miles(totalDistance(legs))} · {feet(legs.reduce((n, l) => n + ascentOf(l), 0))} of
          climb · {hoursRough(totalHours(legs, model))} of walking
        </p>

        <ol className="mt-10 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {legs.map((leg, i) => (
            <li key={leg.id}>
              <LegCard leg={leg} index={i} />
            </li>
          ))}
        </ol>

        {/* The same eleven legs as a table, because a list of cards is
            good for reading one and bad for comparing all of them —
            and comparing all of them is the point of the site. */}
        <section className="mt-16">
          <h2 className="head text-title">All of it, in order</h2>
          <div className="mt-6 min-w-0 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong">
                  <th className="datum py-2 pr-4 text-[0.75rem] font-normal uppercase text-ink-subtle">
                    Leg
                  </th>
                  <th className="datum py-2 pr-4 text-[0.75rem] font-normal uppercase text-ink-subtle">
                    From
                  </th>
                  <th className="datum py-2 pr-4 text-right text-[0.75rem] font-normal uppercase text-ink-subtle">
                    Miles
                  </th>
                  <th className="datum py-2 pr-4 text-right text-[0.75rem] font-normal uppercase text-ink-subtle">
                    Climb
                  </th>
                  <th className="datum py-2 pr-4 text-right text-[0.75rem] font-normal uppercase text-ink-subtle">
                    At mile
                  </th>
                  <th className="datum py-2 text-right text-[0.75rem] font-normal uppercase text-ink-subtle">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {legs.map((leg, i) => (
                  <tr key={leg.id} className="border-b border-line">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/stages/${leg.slug}`}
                        className="focus-ring text-[0.9375rem] hover:text-water"
                      >
                        {leg.name}
                      </Link>
                      {leg.dry ? (
                        <span className="datum ml-2 text-[0.6875rem] text-warn">
                          no water
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4 text-[0.875rem] text-ink-subtle">
                      {shelters[i].name}
                    </td>
                    <td className="datum py-3 pr-4 text-right text-[0.875rem] text-ink-muted">
                      {leg.distance.toFixed(1)}
                    </td>
                    <td className="datum py-3 pr-4 text-right text-[0.875rem] text-ink-muted">
                      {ascentOf(leg).toLocaleString("en-US")}
                    </td>
                    <td className="datum py-3 pr-4 text-right text-[0.875rem] text-ink-subtle">
                      {posts[i].toFixed(1)}
                    </td>
                    <td className="figure py-3 text-right text-[1rem]">
                      {hoursLabel(hoursOf(leg, model))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Shell>
  );
}
