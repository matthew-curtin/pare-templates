import Link from "next/link";
import { Field } from "@/components/field";
import { Plate } from "@/components/plate";
import { Figure, Footer, Masthead } from "@/components/chrome";
import { StockStyle } from "@/components/stock-style";
import { PRICE_PAIRS, SHELLS } from "@/content/shells";
import { photo } from "@/content/photos";
import { CLAIMS, SITE } from "@/content/site";
import { clock, clockCoarse, shellById } from "@/lib/ballistics";
import { emitter } from "@/lib/emission";
import {
  DEEPEST_SALVO,
  EARLY_SHOWS,
  FLEET_TOTALS,
  SHOW_DATA,
  showData,
} from "@/lib/show-data";

const HERO_SLUG = "the-long-field";

export default function HomePage() {
  const hero = showData(HERO_SLUG);
  if (!hero) throw new Error("hero show missing");

  const { data: salvoShow, salvo } = DEEPEST_SALVO;
  const salvoCues = [...salvo.cues].sort((a, b) => a.fireTenths - b.fireTenths);
  const twelve = shellById(SHELLS, "c12-gold");
  const pair = PRICE_PAIRS[2];
  const goldShell = shellById(SHELLS, pair.gold);
  const blueShell = shellById(SHELLS, pair.blue);
  const lightRatio = emitter("blue").intensity / emitter("gold").intensity;
  const priceRatio = blueShell.costUsd / goldShell.costUsd;

  return (
    <>
      {/* The front page is the company, and this company mostly fires
          charcoal gold, so it is printed on charcoal gold. */}
      <StockStyle emission="gold" />
      <Masthead standfirst={SITE.standfirst} />

      <main>
        {/* The architecture, immediately and full-bleed. */}
        <section className="px-4 sm:px-6 lg:px-10">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="display">{hero.show.title}</h2>
            <p className="num text-sm opacity-60">
              {hero.cues.length} shells · {clockCoarse(hero.lastLightTenths)} ·{" "}
              {hero.site.name}
            </p>
          </div>
          <Field data={hero} height="clamp(20rem, 54vh, 34rem)" />
          <p className="prose-body mt-3 max-w-3xl text-sm opacity-70">
            Time across, real height up. Every shell is drawn twice — as the
            climb, and as the burst at the top of it. Switch to{" "}
            <em>what the crew fires</em> and each burst slides left by its own
            lift time, the climbs disappear, and you are reading the other
            document.
          </p>
        </section>

        {/* The three claims, with the one photograph that makes the first
            of them concrete: an unbroken trail from the ground to the
            break, which is the gap the whole site is about. */}
        <section className="mt-20 px-4 sm:px-6 lg:px-10">
          <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[0.8fr_1fr_1fr_1fr]">
            <Plate
              src={photo("climb").src}
              alt={photo("climb").alt}
              caption={photo("climb").caption}
              className="rule pt-5"
              sizes="(min-width: 64rem) 20vw, 100vw"
              priority
            />
            {CLAIMS.map((claim, i) => (
              <article key={claim.id} className="rule pt-5">
                <p className="num text-xs opacity-45">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display-sm mt-3">{claim.title}</h3>
                <p className="prose-body mt-3 text-[0.95rem] opacity-75">{claim.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Claim one, proved. */}
        <section className="mt-20 px-4 sm:px-6 lg:px-10">
          <div className="rule grid gap-8 pt-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow opacity-55">The deepest salvo we have fired</p>
              <h3 className="display mt-3">
                Three shells, one instant, fired{" "}
                {(salvo.spreadTenths / 10).toFixed(1)} seconds apart.
              </h3>
              <p className="prose-body mt-4 max-w-lg opacity-75">
                At {clock(salvo.atTenths)} in{" "}
                <Link
                  href={`/shows/${salvoShow.show.slug}`}
                  className="underline underline-offset-4"
                >
                  {salvoShow.show.title}
                </Link>{" "}
                these three break together. A {twelve.sizeInches}-inch shell
                takes {(twelve.liftTenths / 10).toFixed(1)} seconds to reach{" "}
                {twelve.altitudeM} metres and a two-inch takes 2.1, so the crew
                fires them in an order that has nothing to do with the order
                they are seen in.
              </p>
            </div>

            <div>
              {/* Nine seconds, close up. At the scale of a whole display a
                  climb is under one percent of the width and every
                  trajectory looks vertical; here the three slopes are
                  the argument, arriving at one point. */}
              <Field
                data={salvoShow}
                height="16rem"
                showControls={false}
                compact
                window={[salvoCues[0].fireTenths - 20, salvo.atTenths + 30]}
              />
              <ol className="card mt-4 divide-y divide-current/10">
              {salvoCues.map((cue) => {
                const shell = shellById(SHELLS, cue.shellId);
                return (
                  <li
                    key={cue.id}
                    className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 px-4 py-4 sm:px-5"
                  >
                    <span className="num text-lg">{clock(cue.fireTenths)}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{shell.name}</span>
                      <span className="num block text-xs opacity-55">
                        climbs {(shell.liftTenths / 10).toFixed(1)} s to{" "}
                        {cue.altitudeM} m
                      </span>
                    </span>
                    <span className="num text-sm opacity-60">
                      breaks {clock(cue.breakTenths)}
                    </span>
                  </li>
                );
              })}
              </ol>
            </div>
          </div>
        </section>

        {/* Claims two and three, as figures. */}
        <section className="mt-20 px-4 sm:px-6 lg:px-10">
          <div className="rule grid grid-cols-2 gap-8 pt-6 sm:grid-cols-3 lg:grid-cols-5">
            <Figure
              value={`${EARLY_SHOWS.length} of ${SHOW_DATA.length}`}
              label="shows whose first cue fires before the announced start"
            />
            <Figure
              value={clock(hero.firstFireTenths)}
              label={`earliest cue in ${hero.show.title}`}
            />
            <Figure
              value={`×${priceRatio.toFixed(1)}`}
              label={`price of a 12in blue shell against the same shell in gold`}
            />
            <Figure
              value={`×${lightRatio.toFixed(2)}`}
              label="light a copper star gives against a charcoal one"
            />
            <Figure
              value={`£${FLEET_TOTALS.costUsd.toLocaleString("en-GB")}`}
              label={`of shell across ${FLEET_TOTALS.shows} published displays`}
            />
          </div>
        </section>

        {/* The shows. */}
        <section className="mt-20 px-4 sm:px-6 lg:px-10">
          <div className="rule flex flex-wrap items-baseline justify-between gap-3 pt-6">
            <h2 className="display">Six displays, published in full</h2>
            <Link href="/shows" className="eyebrow underline underline-offset-4">
              All shows
            </Link>
          </div>
          <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {SHOW_DATA.map((data) => (
              <li key={data.show.slug} className="show-card">
                <Link href={`/shows/${data.show.slug}`} className="group block">
                  <div className="show-card-body">
                    <div className="min-w-0">
                      <h3 className="display-sm group-hover:underline group-hover:underline-offset-4">
                        {data.show.title}
                      </h3>
                      <p className="num mt-1 text-xs opacity-55">
                        {data.site.name} · {clockCoarse(data.lastLightTenths)}
                      </p>
                    </div>
                    <div className="show-card-figures">
                      <p className="num text-lg leading-none">{data.cues.length}</p>
                      <p className="eyebrow opacity-50">shells</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Field data={data} height="7rem" showControls={false} compact />
                  </div>
                  <p className="prose-body mt-3 text-sm opacity-70">
                    {data.show.standfirst.split(". ")[0]}.
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}
