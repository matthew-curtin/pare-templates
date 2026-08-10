import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { Plate } from "@/components/plate";
import { Stat } from "@/components/stat";
import uplandCreek from "@/photos/upland-creek.jpg";
import { reports, seasonNotes } from "@/content/conditions";
import { NOW, ZONE, model, site, terrainNames } from "@/content/site";
import { legs } from "@/content/route";
import { TERRAIN_ORDER, hoursOf, ascentOf, descentOf } from "@/lib/route";
import { agoLabel, hoursLabel, longDate, seasonStatus, shortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Conditions",
  description:
    "Water, weather and the season window on the Sable Traverse, with the pace model the rest of the site is built on.",
};

const season = seasonStatus(NOW, ZONE, site.season);
const worked = legs.find((l) => l.slug === "the-ninebark-flats")!;

export default function ConditionsPage() {
  return (
    <Shell rail="plain" railLabel="Elevation profile of the whole traverse.">
      <div className="px-4 py-12 sm:px-8">
        <h1 className="head text-display">Conditions</h1>
        <p className="prose-block mt-4 text-lede leading-relaxed text-ink-muted">
          On this route conditions mean water more often than they mean
          weather. Two of the huts have a spring that fails in a dry
          August and two more have nothing but a tank, so what has been
          running this week decides where you can stop.
        </p>
        <p className="datum mt-4 text-[0.875rem] text-ink-subtle">
          As of {longDate("2026-08-12", ZONE)}
        </p>

        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-8">
          <Stat
            value={season.open ? "Open" : "Closed"}
            label={`${shortDate(site.season.opens, ZONE)} to ${shortDate(site.season.closes, ZONE)}`}
            tone={season.open ? "water" : "warn"}
          />
          <Stat value={`${season.dayOf}`} label="days into the season" />
          <Stat value={`${season.remaining}`} label="days left in it" />
          <Stat
            value={`${reports.filter((r) => r.kind === "warning").length}`}
            label="live warnings"
            tone={reports.some((r) => r.kind === "warning") ? "warn" : "ink"}
          />
        </div>

        {/* The whole conditions page is about whether things like this
            are still running. Nothing else on the site shows moving
            water, and the paragraph above is an abstraction until you
            have seen what a "reliable source" is. */}
        <Plate
          className="mt-12 max-w-3xl"
          src={uplandCreek}
          aspect="3 / 2"
          priority
          sizes="(min-width: 1024px) 48rem, 100vw"
          alt="A shallow upland creek running fast over dark flat rock between banks of coarse tussock grass, with low bare hills behind it under a flat grey sky."
          caption="The Coldwater, below Ninebark. This is a reliable source: it has never been reported dry, and the two legs either side of it are the only ones nobody has to plan water for."
        />

        <section className="mt-16">
          <h2 className="head text-title">Reports</h2>
          <ol className="mt-6 space-y-px bg-line">
            {reports.map((r) => (
              <li
                key={`${r.date}-${r.where}`}
                className={`bg-surface p-5 ${
                  r.kind === "warning" ? "border-l-2 border-warn" : ""
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3
                    className={`text-[1rem] font-semibold ${
                      r.kind === "warning" ? "text-warn" : "text-ink"
                    }`}
                  >
                    {r.where}
                  </h3>
                  <p className="datum text-[0.8125rem] text-ink-subtle">
                    {shortDate(r.date, ZONE)} · {agoLabel(r.date, NOW, ZONE)}
                  </p>
                </div>
                <p className="prose-block mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {r.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="head text-title">The season</h2>
          <dl className="mt-6 grid gap-px bg-line lg:grid-cols-3">
            {seasonNotes.map((n) => (
              <div key={n.head} className="bg-surface p-5">
                <dt className="head text-[1rem]">{n.head}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {n.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* The model, printed. Every hour quoted anywhere on this site
            comes out of these six numbers, so they belong somewhere a
            reader can disagree with them. */}
        <section className="mt-16">
          <h2 className="head text-title">How the hours are worked out</h2>
          <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
            There is no secret to it. Each terrain class has a pace on
            the flat, the climb is added on top, and that is the whole
            model. It is deliberately pessimistic about bad ground and
            deliberately quiet about how fit you are, because the first
            is a property of the route and the second is not.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong">
                  <th className="datum py-2 pr-4 text-[0.75rem] font-normal uppercase text-ink-subtle">
                    Ground
                  </th>
                  <th className="datum py-2 pr-4 text-right text-[0.75rem] font-normal uppercase text-ink-subtle">
                    Pace
                  </th>
                  <th className="datum py-2 text-[0.75rem] font-normal uppercase text-ink-subtle">
                    What it is
                  </th>
                </tr>
              </thead>
              <tbody>
                {TERRAIN_ORDER.map((t) => (
                  <tr key={t} className="border-b border-line">
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5"
                          style={{ background: `var(--color-ground-${t})` }}
                          aria-hidden="true"
                        />
                        <span className="text-[0.9375rem]">
                          {terrainNames[t].label}
                        </span>
                      </span>
                    </td>
                    <td className="datum py-3 pr-4 text-right text-[0.9375rem] text-ink-muted">
                      {model.pace[t].toFixed(1)} mph
                    </td>
                    <td className="py-3 text-[0.875rem] text-ink-subtle">
                      {terrainNames[t].gloss}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-line">
                  <td className="py-3 pr-4 text-[0.9375rem]">Climbing</td>
                  <td className="datum py-3 pr-4 text-right text-[0.9375rem] text-ink-muted">
                    1 h / 1,000 ft
                  </td>
                  <td className="py-3 text-[0.875rem] text-ink-subtle">
                    Added to the terrain time, not instead of it.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-[0.9375rem]">Descending</td>
                  <td className="datum py-3 pr-4 text-right text-[0.9375rem] text-ink-muted">
                    1 h / 3,000 ft
                  </td>
                  <td className="py-3 text-[0.875rem] text-ink-subtle">
                    A long drop is not free, whatever the profile suggests.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 max-w-2xl border border-line bg-surface p-5">
            <p className="datum text-[0.75rem] uppercase text-ink-subtle">
              Worked through, on {worked.name}
            </p>
            <ul className="mt-3 space-y-1.5">
              {TERRAIN_ORDER.filter((t) => worked.terrain[t] > 0).map((t) => (
                <li key={t} className="datum text-[0.875rem] text-ink-muted">
                  {worked.terrain[t].toFixed(1)} mi of{" "}
                  {terrainNames[t].label.toLowerCase()} at{" "}
                  {model.pace[t].toFixed(1)} mph ={" "}
                  {hoursLabel(worked.terrain[t] / model.pace[t])}
                </li>
              ))}
              <li className="datum text-[0.875rem] text-ink-muted">
                {ascentOf(worked).toLocaleString("en-US")} ft up ={" "}
                {hoursLabel(ascentOf(worked) * model.hoursPerFootUp)}
              </li>
              <li className="datum text-[0.875rem] text-ink-muted">
                {descentOf(worked).toLocaleString("en-US")} ft down ={" "}
                {hoursLabel(descentOf(worked) * model.hoursPerFootDown)}
              </li>
            </ul>
            <p className="figure mt-4 border-t border-line pt-3 text-[1.5rem] text-warn">
              {hoursLabel(hoursOf(worked, model))}
            </p>
            <p className="mt-1 text-[0.8125rem] text-ink-subtle">
              for {worked.distance.toFixed(1)} miles, almost all of it
              downhill.
            </p>
          </div>
        </section>
      </div>
    </Shell>
  );
}
