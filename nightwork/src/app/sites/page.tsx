import type { Metadata } from "next";
import Link from "next/link";
import { Figure, Footer, Masthead } from "@/components/chrome";
import { Plate } from "@/components/plate";
import { StockStyle } from "@/components/stock-style";
import { PHOTOS } from "@/content/photos";
import { SITES } from "@/content/sites";
import { SHELLS } from "@/content/shells";
import {
  SAFETY_METRES_PER_INCH,
  SPEED_OF_SOUND,
  largestShellFor,
  safetyRadiusM,
  soundDelayTenths,
  syncIsAudible,
} from "@/lib/ballistics";
import { SHOW_DATA } from "@/lib/show-data";

export const metadata: Metadata = {
  title: "Sites",
  description:
    "Five licensed firing sites. One number — the distance to the nearest spectator — sets the largest shell that may leave the ground and how late the sound arrives.",
};

/** The distances the calculator offers. Link-based, so every answer is a URL. */
const DISTANCES = [60, 88, 130, 180, 240, 300, 420];

const SIZES = [...new Set(SHELLS.map((s) => s.sizeInches))].sort((a, b) => a - b);

/**
 * Three of the five sites have a photograph and two do not, which is a
 * decision rather than a gap — see CREDITS.md. These three are the ones
 * where the GROUND decides something the prose then has to explain; a
 * generic harbour under "North Quay" would have been swappable for any
 * other harbour, which CONVENTIONS §6 calls decoration.
 */
const SITE_PHOTO: Record<string, string> = {
  "bracken-fell": "fell",
  "carrow-bowl": "stand",
  "ravensmoor-lawn": "lawn",
};

export default async function SitesPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const chosen = DISTANCES.includes(Number(m)) ? Number(m) : 180;
  const permitted = largestShellFor(chosen);
  const delay = soundDelayTenths(chosen);

  // The smallest legal site for each shell, and whether the delay at
  // that distance is short enough to pass unnoticed.
  const smallest = SIZES.map((inches) => {
    const radius = safetyRadiusM(inches);
    return { inches, radius, delay: soundDelayTenths(radius), audible: syncIsAudible(radius) };
  });
  const inaudible = smallest.filter((r) => !r.audible);

  return (
    <>
      <StockStyle emission="gold" />
      <Masthead standfirst="Five licensed sites, and one number that decides more about a display than the budget does: how far it is to the nearest spectator." />

      <main className="px-4 sm:px-6 lg:px-10">
        <section className="rule pt-6">
          <h1 className="display max-w-4xl">
            The ground writes half the show before anybody has chosen a shell.
          </h1>
          <p className="prose-lead mt-4 max-w-3xl opacity-80">
            The rule is {SAFETY_METRES_PER_INCH} metres of clear radius for every
            inch of shell diameter. It is not a guideline and it does not bend
            for a client, so the distance from the mortar to the front row sets
            the ceiling — literally, since break height runs at about thirty
            metres per inch. Then the same distance sets how far behind the
            light the sound arrives, at {SPEED_OF_SOUND} metres a second, and
            those two pull in opposite directions.
          </p>
        </section>

        {/* The calculator — link-based, so every state is a real URL. */}
        <section className="mt-14">
          <div className="rule pt-6">
            <h2 className="display-sm">What a distance permits</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {DISTANCES.map((d) => (
                <li key={d}>
                  <Link
                    href={d === 180 ? "/sites" : `/sites?m=${d}`}
                    aria-current={d === chosen ? "true" : undefined}
                    className={`chip num block px-3.5 py-1.5 text-sm transition-opacity ${
                      d === chosen
                        ? "bg-[var(--stock-ink)] text-[var(--stock-paper)]"
                        : "hover:opacity-65"
                    }`}
                  >
                    {d} m
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Figure value={`${permitted} in`} label="largest shell permitted" />
              <Figure value={`${permitted * 30} m`} label="highest break available" />
              <Figure
                value={`${(delay / 10).toFixed(1)} s`}
                label="the bang arrives after the flash"
              />
              <Figure
                value={syncIsAudible(chosen) ? "Yes" : "No"}
                label="can an audience hear the gap"
              />
            </div>

            <p className="prose-body mt-6 max-w-3xl text-sm opacity-70">
              At {chosen} metres a {permitted}-inch shell is the ceiling, so
              nothing can break above about {permitted * 30} metres. Every shell
              in{" "}
              <Link href="/shells" className="underline underline-offset-4">
                the catalogue
              </Link>{" "}
              larger than that is simply unavailable, whatever it would have
              added.
            </p>
          </div>
        </section>

        {/* The one case where the delay does not matter. */}
        <section className="mt-14">
          <div className="rule grid gap-10 pt-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="display-sm">
                You cannot get close enough for the delay to go away.
              </h2>
              <p className="prose-body mt-3 opacity-80">
                Light is instant and sound is not, so a scripted display has to
                choose which one lands on the beat. The gap becomes noticeable
                at about a tenth of a second — and the smallest legal site for
                every shell we own except one is already further away than that.
              </p>
              <div className="mt-6 min-w-0 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="sr-only">
                    The smallest legal firing distance for each shell size, and
                    the sound delay at that distance.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="eyebrow py-2 pr-4 font-normal opacity-55">
                        Shell
                      </th>
                      <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal opacity-55">
                        Smallest legal site
                      </th>
                      <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal opacity-55">
                        Delay there
                      </th>
                      <th scope="col" className="eyebrow py-2 text-left font-normal opacity-55">
                        Noticeable
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {smallest.map((r) => (
                      <tr key={r.inches} className="border-t border-current/10">
                        <td className="num py-2.5 pr-4">{r.inches} in</td>
                        <td className="num py-2.5 pr-4 text-right">{r.radius} m</td>
                        <td className="num py-2.5 pr-4 text-right">
                          {(r.delay / 10).toFixed(1)} s
                        </td>
                        <td className="py-2.5">{r.audible ? "yes" : "no"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="prose-body mt-4 max-w-2xl text-sm opacity-70">
                {inaudible.length === 0
                  ? "There is no distance at which it goes away."
                  : `The only exception is the ${inaudible
                      .map((r) => `${r.inches}-inch`)
                      .join(" and ")} shell at its own minimum of ${inaudible
                      .map((r) => `${r.radius} metres`)
                      .join(" and ")}, which is a distance nothing else may be fired from.`}{" "}
                Everywhere else, somebody is watching a flash and hearing it
                afterwards, and the script has to have decided which of those
                two the music is for.
              </p>
            </div>

            <div>
              <h2 className="eyebrow opacity-55">How our six were cued</h2>
              <ul className="mt-4 space-y-4">
                {SHOW_DATA.map((data) => (
                  <li key={data.show.slug} className="rule pt-3">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <Link
                        href={`/shows/${data.show.slug}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {data.show.title}
                      </Link>
                      <span className="num text-sm opacity-60">
                        {data.show.crowdM} m · {(data.soundDelayTenths / 10).toFixed(1)} s
                      </span>
                    </p>
                    <p className="prose-body mt-1 text-xs opacity-65">
                      cued to the {data.show.cueTo}
                      {data.show.cueTo === "sound"
                        ? " — the live audience saw everything early"
                        : " — the live audience heard everything late"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The five sites. */}
        <section className="mt-16">
          <div className="rule pt-6">
            <h2 className="display-sm">The five</h2>
          </div>
          <ul className="mt-8 space-y-12">
            {SITES.map((site) => {
              const shows = SHOW_DATA.filter((d) => d.site.id === site.id);
              return (
                <li key={site.id} className="rule grid gap-6 pt-6 md:grid-cols-[1fr_1.4fr]">
                  <div>
                    <h3 className="display-sm">{site.name}</h3>
                    <p className="prose-body mt-1 text-sm opacity-60">{site.where}</p>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="opacity-55">Nearest spectator</dt>
                        <dd className="num">{site.crowdM} m</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="opacity-55">Largest shell</dt>
                        <dd className="num">{largestShellFor(site.crowdM)} in</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="opacity-55">Sound delay</dt>
                        <dd className="num">
                          {(soundDelayTenths(site.crowdM) / 10).toFixed(1)} s
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    {(() => {
                      const shot = PHOTOS.find((p) => p.id === SITE_PHOTO[site.id]);
                      return shot ? (
                        <Plate
                          src={shot.src}
                          alt={shot.alt}
                          caption={shot.caption}
                          className="mb-4"
                          sizes="(min-width: 48rem) 55vw, 100vw"
                        />
                      ) : null;
                    })()}
                    <p className="prose-body opacity-80">{site.ground}</p>
                    <p className="prose-body mt-3 opacity-80">{site.catch}</p>
                    {shows.length > 0 && (
                      <p className="mt-4 text-sm opacity-65">
                        Fired here:{" "}
                        {shows.map((d, i) => (
                          <span key={d.show.slug}>
                            {i > 0 && ", "}
                            <Link
                              href={`/shows/${d.show.slug}`}
                              className="underline underline-offset-4"
                            >
                              {d.show.title}
                            </Link>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}
