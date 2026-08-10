import Link from "next/link";
import { Shell } from "@/components/shell";
import { Stat } from "@/components/stat";
import { Plate } from "@/components/plate";
import { TerrainBar } from "@/components/terrain-bar";
import cloudOnTheRange from "@/photos/cloud-on-the-range.jpg";
import { legs, shelters } from "@/content/route";
import { model, site, terrainNames } from "@/content/site";
import {
  TERRAIN_ORDER,
  hoursOf,
  longestDayByLength,
  totalAscent,
  totalDistance,
  totalHours,
} from "@/lib/route";
import { feet, hoursLabel, hoursRough, miles } from "@/lib/format";

const nameOf = new Map(shelters.map((s) => [s.id, s.name]));

/** Found rather than chosen, so the page stays true if a leg is edited.
 *  The whole argument depends on these two being different legs, and
 *  `scripts/check-route.mjs` fails if they ever become the same one. */
const byHours = [...legs].sort((a, b) => hoursOf(b, model) - hoursOf(a, model));
const byMiles = [...legs].sort((a, b) => b.distance - a.distance);
const worstDay = byHours[0];
const longestLeg = byMiles[0];

const worstByLength = longestDayByLength(legs, model);
const floorHours = worstByLength[worstByLength.length - 1];

/** Six to eleven days. Fewer than six is not a walk, it is a claim. */
const PLAN_LENGTHS = [6, 7, 8, 9, 10, 11];
const chartMax = Math.max(...PLAN_LENGTHS.map((k) => worstByLength[k - 1]));

export default function FrontPage() {
  return (
    <Shell rail="scroll" railLabel="Elevation profile of the whole traverse, north to south.">
      {/* The masthead. Small heading, large figures — the position §4c
          asks for, and the opposite of the one conference-schedule
          takes with its 9.5rem signage. */}
      <section className="border-b border-line px-4 py-12 sm:px-8 sm:py-16">
        <p className="datum text-[0.75rem] uppercase text-ink-subtle">
          {site.season.opens.slice(0, 4)} season · 20 June to 5 October
        </p>
        <h1 className="head mt-3 max-w-[24ch] text-display">
          A long walk is not a distance. It is a short list of places you
          can sleep, and the ground between them.
        </h1>
        <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
          {site.name} runs {miles(totalDistance(legs))} across the Sable
          Range, hut to hut, in {legs.length} legs that cannot be broken
          in the middle. This site quotes every one of them in hours
          first, because the hours are what decide whether you arrive
          before the light goes.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          <Stat value={totalDistance(legs).toFixed(1)} label="miles, end to end" />
          <Stat value={totalAscent(legs).toLocaleString("en-US")} label="feet of climb" />
          <Stat
            value={hoursRough(totalHours(legs, model)).replace(" hours", "")}
            label="hours of walking"
          />
          <Stat value={String(legs.length)} label="legs, between 12 fixed points" />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/plan"
            className="focus-ring bg-water px-5 py-2.5 text-[0.9375rem] font-semibold text-on-water transition-opacity hover:opacity-85"
          >
            Build an itinerary
          </Link>
          <Link
            href="/stages"
            className="focus-ring border border-line-strong px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors hover:border-ink"
          >
            All {legs.length} legs
          </Link>
        </div>
      </section>

      {/* The only photograph on the front page, and it is the site's
          opening claim rather than an illustration of it: the argument
          is that a view will not tell you whether tomorrow is possible,
          and here is the view. The range is somewhere in the top half.

          16/9 rather than a thinner band because the source is 4:3 and a
          thin crop would throw away the mist, which is the entire
          subject. Match the crop to the frame you have. */}
      <Plate
        src={cloudOnTheRange}
        aspect="16 / 9"
        priority
        sizes="100vw"
        alt="A high corrie in thick cloud: pale grass and scattered pink-grey boulders in the foreground, a rock buttress on the right disappearing into mist a few hundred feet up, and no horizon anywhere in the frame."
        caption="The Sable Range, from the Cairnwell shoulder, on an ordinary August morning. There is no summit in this photograph and there is not usually one in the day either."
      />

      {/* The argument, with the evidence beside it. */}
      <section className="border-b border-line px-4 py-14 sm:px-8">
        <h2 className="head text-title">Miles are the wrong number</h2>
        <div className="prose-block mt-4 space-y-4 text-[1rem] leading-relaxed text-ink-muted">
          <p>
            Every trail guide leads with distance, and distance is the one
            measurement on a mountain that tells you almost nothing. A
            mile of graded trail takes twenty-three minutes. A mile of
            peat takes fifty-five, and a mile of boulder takes fifty —
            whether it is going up, down or nowhere.
          </p>
          <p>
            So this site adds the terrain and the climb together and
            quotes you an arrival time. The two legs below make the point
            better than the paragraph does — one of them is the longest on
            the traverse, the other is the longest day, and they are not
            the same leg.
          </p>
        </div>

        <div className="mt-8 grid gap-px bg-line lg:grid-cols-2">
          {[
            { leg: longestLeg, head: "The longest leg" },
            { leg: worstDay, head: "The longest day" },
          ].map(({ leg, head }) => (
            <article key={leg.id} className="bg-surface p-5">
              <p className="datum text-[0.75rem] uppercase text-ink-subtle">{head}</p>
              <h3 className="head mt-2 text-title">
                <Link href={`/stages/${leg.slug}`} className="focus-ring hover:text-water">
                  {leg.name}
                </Link>
              </h3>
              <p className="mt-1 text-[0.8125rem] text-ink-subtle">
                {nameOf.get(leg.from)} → {nameOf.get(leg.to)}
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                <Stat value={miles(leg.distance)} label="on the map" />
                <Stat
                  value={hoursLabel(hoursOf(leg, model))}
                  label="on the day"
                  tone={leg.id === worstDay.id ? "warn" : "ink"}
                />
              </div>
              <TerrainBar leg={leg} className="mt-5" />
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
                {leg.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* The floor. This is the fact the planner exists to show, stated
          up front so nobody has to discover it by dragging a slider. */}
      <section className="border-b border-line px-4 py-14 sm:px-8">
        <h2 className="head text-title">
          There is no version of this walk without an eleven-hour day
        </h2>
        <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
          Splitting the route into more days makes every day shorter,
          right up until it does not. {worstDay.name} is{" "}
          {hoursLabel(hoursOf(worstDay, model))} on its own, there is
          nowhere legal to sleep in the middle of it, and so no itinerary
          of any length has a day shorter than that. Walking it in seven
          days does not add a hard day to an easy route — it adds hard
          days to a route that already had one.
        </p>

        <ul className="mt-8 max-w-2xl space-y-2">
          {PLAN_LENGTHS.map((k) => {
            const h = worstByLength[k - 1];
            const atFloor = Math.abs(h - floorHours) < 1e-9;
            return (
              <li key={k} className="flex items-center gap-4">
                <span className="datum w-16 shrink-0 text-[0.8125rem] text-ink-subtle">
                  {k} days
                </span>
                <span className="relative h-6 flex-1 bg-well">
                  <span
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${(h / chartMax) * 100}%`,
                      background: atFloor
                        ? "var(--color-water-deep)"
                        : "var(--color-warn)",
                    }}
                  />
                </span>
                <span
                  className={`figure w-20 shrink-0 text-right text-[0.9375rem] ${
                    atFloor ? "text-water" : "text-warn"
                  }`}
                >
                  {hoursLabel(h)}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[0.8125rem] text-ink-subtle">
          The longest day in the best possible plan of each length. Blue
          is the floor — the point past which more days buy you nothing.
        </p>
      </section>

      {/* The colour language, taught once, in the same tokens the rail
          and every terrain bar use. */}
      <section className="px-4 py-14 sm:px-8">
        <h2 className="head text-title">Four kinds of ground</h2>
        <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
          These four colours are the only ones on this site that mean
          anything, and they mean the same thing everywhere: in the rail
          running down the left of every page, in the bar on every leg,
          and in the profile on every stage. The lighter the band, the
          faster the ground.
        </p>
        <dl className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {TERRAIN_ORDER.map((t) => (
            <div key={t} className="bg-surface p-5">
              <span
                className="mb-4 block h-1.5 w-full"
                style={{ background: `var(--color-ground-${t})` }}
                aria-hidden="true"
              />
              <dt className="head text-[1rem]">{terrainNames[t].label}</dt>
              <dd className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
                {terrainNames[t].gloss}
              </dd>
              <dd className="datum mt-3 text-[0.8125rem] text-ink-subtle">
                {model.pace[t].toFixed(1)} mph on the flat ·{" "}
                {legs.reduce((n, l) => n + l.terrain[t], 0).toFixed(1)} mi on
                the route
              </dd>
            </div>
          ))}
        </dl>
        <p className="datum mt-6 text-[0.8125rem] text-ink-subtle">
          Climb is added on top: an hour for every {feet(1000)} gained and an
          hour for every {feet(3000)} lost.
        </p>
      </section>
    </Shell>
  );
}
