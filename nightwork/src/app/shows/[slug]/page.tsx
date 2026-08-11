import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Field } from "@/components/field";
import { Figure, Footer, Masthead } from "@/components/chrome";
import { ColourBudget, CueSheet, EmissionName } from "@/components/sheet";
import { StockStyle } from "@/components/stock-style";
import { SHOWS } from "@/content/shows";
import { clock, clockCoarse, largestShellFor, shellById } from "@/lib/ballistics";
import { SHELLS } from "@/content/shells";
import { SHOW_DATA, showData } from "@/lib/show-data";

export function generateStaticParams() {
  return SHOWS.map((show) => ({ slug: show.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = showData(slug);
  if (!data) return {};
  return { title: data.show.title, description: data.show.standfirst };
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = showData(slug);
  if (!data) notFound();

  const { show, site } = data;
  const salvo = data.salvos[0];
  const salvoCues = salvo
    ? [...salvo.cues].sort((a, b) => a.fireTenths - b.fireTenths)
    : [];
  const permitted = largestShellFor(show.crowdM);
  const index = SHOW_DATA.findIndex((d) => d.show.slug === slug);
  const next = SHOW_DATA[(index + 1) % SHOW_DATA.length];

  return (
    <>
      {/* A show is printed on its own signature emitter. */}
      <StockStyle emission={data.signature} />
      <Masthead />

      <main>
        <section className="px-4 sm:px-6 lg:px-10">
          <p className="eyebrow opacity-55">
            {show.client} · {site.name}, {site.where}
          </p>
          <h1 className="display mt-2">{show.title}</h1>
          <p className="prose-lead mt-4 max-w-3xl opacity-80">{show.standfirst}</p>
        </section>

        {/* The architecture. */}
        <section className="mt-8 px-4 sm:px-6 lg:px-10">
          <Field data={data} />
        </section>

        <section className="mt-10 px-4 sm:px-6 lg:px-10">
          <div className="rule grid grid-cols-2 gap-6 pt-6 sm:grid-cols-3 lg:grid-cols-6">
            <Figure value={String(data.cues.length)} label="shells" />
            <Figure value={clockCoarse(data.lastLightTenths)} label="from first light to last" />
            <Figure value={clock(data.firstFireTenths)} label="first cue fires" />
            <Figure value={String(data.peakAir.count)} label="most shells in the air at once" />
            <Figure value={`${data.peakRate.breaks}/s`} label="busiest second" />
            <Figure
              value={`£${data.costUsd.toLocaleString("en-GB")}`}
              label={`£${data.costPerMinute.toLocaleString("en-GB")} a minute`}
            />
          </div>
        </section>

        {/* The salvo, close up. */}
        {salvo && salvo.spreadTenths > 0 && (
          <section className="mt-16 px-4 sm:px-6 lg:px-10">
            <div className="rule grid gap-8 pt-6 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <p className="eyebrow opacity-55">The deepest salvo in this show</p>
                <h2 className="display-sm mt-3">
                  {salvoCues.length} shells break at {clock(salvo.atTenths)}, fired{" "}
                  {(salvo.spreadTenths / 10).toFixed(1)} seconds apart.
                </h2>
                <ol className="mt-4 space-y-2 text-sm">
                  {salvoCues.map((cue) => {
                    const shell = shellById(SHELLS, cue.shellId);
                    return (
                      <li key={cue.id} className="flex items-baseline gap-3">
                        <span className="num w-16 shrink-0">{clock(cue.fireTenths)}</span>
                        <span className="min-w-0 flex-1">
                          <Link
                            href={`/shells/${shell.id}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {shell.name}
                          </Link>
                          <span className="num ml-2 text-xs opacity-55">
                            climbs {(shell.liftTenths / 10).toFixed(1)} s to {cue.altitudeM} m
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <Field
                data={data}
                height="15rem"
                showControls={false}
                compact
                window={[salvoCues[0].fireTenths - 15, salvo.atTenths + 25]}
              />
            </div>
          </section>
        )}

        {/* The site, and what it decided. */}
        <section className="mt-16 px-4 sm:px-6 lg:px-10">
          <div className="rule grid gap-8 pt-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="eyebrow opacity-55">The ground</p>
              <h2 className="display-sm mt-2">
                <Link href="/sites" className="underline-offset-4 hover:underline">
                  {site.name}
                </Link>
              </h2>
              <p className="prose-body mt-3 text-sm opacity-75">{site.ground}</p>
              <p className="prose-body mt-3 text-sm opacity-75">{site.catch}</p>
            </div>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="eyebrow opacity-50">Nearest spectator</dt>
                <dd className="num mt-1">{show.crowdM} m</dd>
              </div>
              <div>
                <dt className="eyebrow opacity-50">Largest shell permitted</dt>
                <dd className="num mt-1">
                  {permitted} in — this show uses {data.largestShell.sizeInches} in
                </dd>
              </div>
              <div>
                <dt className="eyebrow opacity-50">Sound arrives</dt>
                <dd className="num mt-1">
                  {(data.soundDelayTenths / 10).toFixed(1)} s after the light
                </dd>
              </div>
              <div>
                <dt className="eyebrow opacity-50">Script is timed to</dt>
                <dd className="mt-1">
                  {show.cueTo === "light"
                    ? "the light — so the bang lands late"
                    : "the sound — so the light lands early"}
                </dd>
              </div>
            </dl>

            <div>
              <ColourBudget budget={data.budget} />
              <p className="prose-body mt-4 text-sm opacity-70">
                Its signature is <EmissionName id={data.signature} />, which is what
                this page is printed on: not the emitter there is most of, but the one
                this show has more of than the rest of our work.
              </p>
            </div>
          </div>
        </section>

        {/* Notes. */}
        <section className="mt-16 px-4 sm:px-6 lg:px-10">
          <div className="rule pt-6">
            <h2 className="eyebrow opacity-55">Notes on this display</h2>
            <div className="mt-4 grid gap-8 md:grid-cols-3">
              {show.notes.map((note) => (
                <p key={note} className="prose-body opacity-80">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* The cue sheet. */}
        <section className="mt-16 px-4 sm:px-6 lg:px-10">
          <div className="rule pt-6">
            <h2 className="display-sm">The cue sheet</h2>
            <p className="prose-body mt-2 max-w-2xl text-sm opacity-70">
              What the crew works from. <em>Fires</em> is the moment the match is
              touched; <em>breaks</em> is the moment anybody sees anything. The two
              columns are the whole job.
            </p>
            <div className="mt-6 min-w-0 overflow-x-auto">
              <CueSheet data={data} />
            </div>
          </div>
        </section>

        <section className="mt-16 px-4 sm:px-6 lg:px-10">
          <div className="rule flex flex-wrap items-baseline justify-between gap-4 pt-6">
            <Link href="/shows" className="eyebrow underline underline-offset-4">
              All shows
            </Link>
            <Link href={`/shows/${next.show.slug}`} className="display-sm underline-offset-8 hover:underline">
              Next: {next.show.title} →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
