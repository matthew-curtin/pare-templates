import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Figure, Footer, Masthead } from "@/components/chrome";
import { EmissionName, Swatch } from "@/components/sheet";
import { StockStyle } from "@/components/stock-style";
import { SHELLS } from "@/content/shells";
import { safetyRadiusM } from "@/lib/ballistics";
import { emissionColour, emitter, toCss } from "@/lib/emission";
import { showsUsing } from "@/lib/show-data";

export function generateStaticParams() {
  return SHELLS.map((shell) => ({ slug: shell.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shell = SHELLS.find((s) => s.id === slug);
  if (!shell) return {};
  return { title: shell.name, description: shell.note };
}

export default async function ShellPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shell = SHELLS.find((s) => s.id === slug);
  if (!shell) notFound();

  const used = showsUsing(shell.id);
  const total = used.reduce((sum, r) => sum + r.count, 0);
  const primary = shell.emissions[0];

  return (
    <>
      {/* A shell page wears its own colour. */}
      <StockStyle emission={primary} />
      <Masthead />

      <main className="px-4 sm:px-6 lg:px-10">
        <section>
          <p className="eyebrow opacity-55">{shell.effect}</p>
          <h1 className="display mt-2">{shell.name}</h1>
          <p className="prose-lead mt-4 max-w-2xl opacity-80">{shell.note}</p>
        </section>

        {/* Drawn against its own flight. */}
        <section className="mt-10">
          <div className="field" style={{ ["--field-h" as string]: "18rem" }}>
            <div className="field-scroll">
              <div
                className="field-inner"
                style={{
                  ["--field-h" as string]: "18rem",
                  ["--field-min" as string]: "0",
                }}
                aria-hidden="true"
              >
                <svg
                  className="traces"
                  viewBox={`0 0 ${shell.liftTenths * 1.6} ${shell.altitudeM * 1.35}`}
                  preserveAspectRatio="none"
                >
                  <line
                    x1={shell.liftTenths * 0.15}
                    y1={shell.altitudeM * 1.35}
                    x2={shell.liftTenths * 0.85}
                    y2={shell.altitudeM * 0.35}
                    stroke={toCss(emissionColour(primary))}
                  />
                </svg>
                <span
                  className="burst"
                  style={{
                    ["--x" as string]: "0.53",
                    ["--a" as string]: "0.74",
                    ["--d" as string]: (shell.burstM / (shell.altitudeM * 1.35) * 0.26).toFixed(5),
                    ["--em" as string]: toCss(emissionColour(primary)),
                  }}
                />
                <span className="num absolute bottom-3 left-4 text-[0.65rem] text-white/45">
                  fired · {(shell.liftTenths / 10).toFixed(1)} s of lift ·{" "}
                  {shell.altitudeM} m · {shell.burstM} m across
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="rule grid grid-cols-2 gap-6 pt-6 sm:grid-cols-3 lg:grid-cols-6">
            <Figure value={`${shell.sizeInches} in`} label="diameter" />
            <Figure value={`${shell.altitudeM} m`} label="break height" />
            <Figure value={`${(shell.liftTenths / 10).toFixed(1)} s`} label="lift time" />
            <Figure value={`${shell.burstM} m`} label="burst across" />
            <Figure value={`${(shell.burnTenths / 10).toFixed(1)} s`} label="stars burn for" />
            <Figure value={`£${shell.costUsd}`} label="each" />
          </div>
        </section>

        <section className="mt-16">
          <div className="rule grid gap-10 pt-6 md:grid-cols-2">
            <div>
              <h2 className="display-sm">What is burning</h2>
              <ul className="mt-4 space-y-5">
                {shell.emissions.map((id) => {
                  const e = emitter(id);
                  return (
                    <li key={id}>
                      <p className="flex items-center gap-2">
                        <Swatch id={id} size={14} />
                        <span className="display-sm">{e.name}</span>
                        <span className="num text-sm opacity-55">
                          {e.lines
                            ? e.lines.map((l) => `${l.nm}nm`).join(" + ")
                            : `${e.kelvin}K`}
                        </span>
                      </p>
                      <p className="prose-body mt-2 text-sm opacity-75">{e.chemistry}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="prose-body mt-5 text-sm opacity-70">
                {shell.stars} stars, so this shell puts{" "}
                <span className="num">
                  {(shell.stars * shell.burnTenths).toLocaleString("en-GB")}
                </span>{" "}
                star-tenths of light into the sky.{" "}
                <Link href="/colour" className="underline underline-offset-4">
                  How these colours are made
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="display-sm">What it needs from the ground</h2>
              <p className="prose-body mt-3 opacity-75">
                Twenty-one metres of clear radius per inch of diameter, so this
                shell may not be fired at a site with less than{" "}
                <span className="num">{safetyRadiusM(shell.sizeInches)} metres</span>{" "}
                between the mortar and the nearest spectator. That single number
                decides more about a display than any other.
              </p>

              <h3 className="eyebrow mt-8 opacity-55">
                Where we have fired it
              </h3>
              {used.length === 0 ? (
                <p className="prose-body mt-3 text-sm opacity-70">
                  Held in stock, not used in any published display.
                </p>
              ) : (
                <>
                  <ul className="mt-3 space-y-2 text-sm">
                    {used.map(({ data, count }) => (
                      <li key={data.show.slug} className="flex items-baseline justify-between gap-4">
                        <Link
                          href={`/shows/${data.show.slug}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {data.show.title}
                        </Link>
                        <span className="num opacity-65">
                          {count} · £{(count * shell.costUsd).toLocaleString("en-GB")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="num mt-4 text-sm opacity-55">
                    {total} fired in total · £
                    {(total * shell.costUsd).toLocaleString("en-GB")}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="rule pt-6">
            <h2 className="eyebrow opacity-55">Everything else in the catalogue</h2>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {SHELLS.filter((s) => s.id !== shell.id).map((other) => (
                <li key={other.id}>
                  <Link
                    href={`/shells/${other.id}`}
                    className="chip flex items-center gap-1.5 px-3 py-1 hover:opacity-70"
                  >
                    <Swatch id={other.emissions[0]} />
                    {other.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <p className="prose-body text-sm opacity-60">
            Primary emitter on this page: <EmissionName id={primary} />. The paper
            is its own colour.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
