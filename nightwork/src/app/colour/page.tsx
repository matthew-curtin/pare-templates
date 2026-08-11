import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Masthead } from "@/components/chrome";
import { Plate } from "@/components/plate";
import { ColourBudget, Swatch } from "@/components/sheet";
import { StockStyle } from "@/components/stock-style";
import { photo } from "@/content/photos";
import { PRICE_PAIRS, SHELLS } from "@/content/shells";
import { shellById } from "@/lib/ballistics";
import { EMITTERS, emissionColour, emitter } from "@/lib/emission";
import { FLEET_BUDGET, costOfLight } from "@/lib/show-data";

export const metadata: Metadata = {
  title: "Colour",
  description:
    "Why every show you have ever seen was mostly gold: the chemistry, the cost and the light output of eight pyrotechnic emitters.",
};

export default function ColourPage() {
  const rates = costOfLight();
  const blue = emitter("blue");
  const gold = emitter("gold");
  const amber = emitter("amber");
  const pair = PRICE_PAIRS[1];
  const goldShell = shellById(SHELLS, pair.gold);
  const blueShell = shellById(SHELLS, pair.blue);
  const dearest = rates[0];

  return (
    <>
      {/* This page is an argument about copper, so it is printed on it. */}
      <StockStyle emission="blue" />
      <Masthead standfirst="A colour in a firework is a metal salt burning at a temperature it can only just survive. That sentence contains the whole economics of the trade, and this page is the arithmetic under it." />

      <main className="px-4 sm:px-6 lg:px-10">
        <section className="rule pt-6">
          <h1 className="display max-w-4xl">
            Blue is not expensive because copper is expensive.
          </h1>
          <p className="prose-lead mt-4 max-w-3xl opacity-80">
            Copper monochloride falls apart above about 1200°C. Every other
            emitter here wants to be hot — hotter is brighter — so a blue star
            has to be built to burn deliberately cool, and a cool flame is a dim
            one. You are paying for a fire that is bad at being a fire. A{" "}
            {goldShell.sizeInches}-inch shell in gold is £{goldShell.costUsd};
            the identical shell in blue is £{blueShell.costUsd}, and it puts out{" "}
            {(blue.intensity / gold.intensity).toFixed(2)} times the light.
          </p>
        </section>

        {/* The eight. */}
        <section className="mt-16">
          <div className="rule pt-6">
            <h2 className="display-sm">The eight emitters</h2>
            <p className="prose-body mt-2 max-w-3xl text-sm opacity-70">
              Every swatch on this site is computed rather than chosen: the
              emitter&rsquo;s published wavelength, through the CIE 1931 colour
              matching functions, into OKLCH — and its lightness is that
              emitter&rsquo;s real relative light output. That is why sodium
              looks bright here and copper looks dim. It is not a stylistic
              decision, and neither is the fact that four of the eight are
              nearly the same hue.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Plate
              src={photo("gold").src}
              alt={photo("gold").alt}
              caption={photo("gold").caption}
            />
            <Plate
              src={photo("green").src}
              alt={photo("green").alt}
              caption={photo("green").caption}
            />
          </div>

          <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {EMITTERS.map((e) => {
              const colour = emissionColour(e.id);
              return (
                <li key={e.id} className="grid grid-cols-[4rem_1fr] gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1 block h-16 w-16 rounded-full"
                    style={{
                      background: `radial-gradient(circle, color-mix(in oklab, oklch(${colour.l} ${colour.c} ${colour.h}) 20%, white) 0%, oklch(${colour.l} ${colour.c} ${colour.h}) 40%, color-mix(in oklab, oklch(${colour.l} ${colour.c} ${colour.h}) 25%, transparent) 82%)`,
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="display-sm">{e.name}</h3>
                    <p className="num mt-1 text-xs opacity-60">
                      {e.salt} ·{" "}
                      {e.lines
                        ? e.lines.map((l) => `${l.nm} nm`).join(" + ")
                        : `${e.kelvin} K broadband`}{" "}
                      · ×{e.intensity} light · ×{e.cost} cost
                    </p>
                    <p className="prose-body mt-2 text-sm opacity-80">{e.chemistry}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Matched pairs. */}
        <section className="mt-16">
          <div className="rule pt-6">
            <h2 className="display-sm">Like for like</h2>
            <p className="prose-body mt-2 max-w-3xl text-sm opacity-70">
              The cleanest way to price a colour is to hold everything else
              still. These three pairs are the same diameter, the same effect,
              the same number of stars and the same burn.
            </p>
            <div className="mt-6 min-w-0 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="eyebrow py-2 pr-4 font-normal opacity-55">
                      Shell
                    </th>
                    <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal opacity-55">
                      Gold
                    </th>
                    <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal opacity-55">
                      Blue
                    </th>
                    <th scope="col" className="eyebrow py-2 text-right font-normal opacity-55">
                      Price ratio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICE_PAIRS.map((p) => {
                    const g = shellById(SHELLS, p.gold);
                    const b = shellById(SHELLS, p.blue);
                    return (
                      <tr key={p.gold} className="border-t border-current/10">
                        <td className="py-3 pr-4">
                          {g.sizeInches} in {g.effect}
                        </td>
                        <td className="num py-3 pr-4 text-right">£{g.costUsd}</td>
                        <td className="num py-3 pr-4 text-right">£{b.costUsd}</td>
                        <td className="num py-3 text-right">
                          ×{(b.costUsd / g.costUsd).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="prose-body mt-4 max-w-3xl text-sm opacity-70">
              About twice the money for about a quarter of the light: roughly
              nine times the price per unit of light in the sky. Sodium is at
              the other end — ×{amber.intensity} the output of charcoal for ×
              {amber.cost} the price — which is why a village show fired
              entirely in amber reads bigger than it is.
            </p>
          </div>
        </section>

        {/* The aggregate, and what it is really measuring. */}
        <section className="mt-16">
          <div className="rule grid gap-10 pt-6 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="display-sm">What a thousand star-tenths costs us</h2>
              <p className="prose-body mt-2 max-w-2xl text-sm opacity-70">
                Across all six displays. This is a different question from the
                one above, and the difference matters: it measures the EFFECT as
                well as the emitter. {emitter(dearest.id).name.toLowerCase()}{" "}
                comes out dearest not because barium is dear but because the
                ring shell is priced for its geometry — sixty stars laid in a
                plane so it reads as a ring from one direction. An aggregate
                that quietly folds two variables together is how a true table
                tells a lie, so both are published.
              </p>
              <div className="mt-6 min-w-0 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      <th scope="col" className="eyebrow py-2 pr-4 font-normal opacity-55">
                        Emitter
                      </th>
                      <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal opacity-55">
                        £ / 1000 star-tenths
                      </th>
                      <th scope="col" className="eyebrow py-2 text-right font-normal opacity-55">
                        Against gold
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((r) => (
                      <tr key={r.id} className="border-t border-current/10">
                        <td className="py-2.5 pr-4">
                          <span className="flex items-center gap-2">
                            <Swatch id={r.id} />
                            {emitter(r.id).name}
                          </span>
                        </td>
                        <td className="num py-2.5 pr-4 text-right">
                          £{r.perThousand.toFixed(2)}
                        </td>
                        <td className="num py-2.5 text-right">
                          ×{r.vsGold.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <ColourBudget budget={FLEET_BUDGET} label="Everything we have fired" />
              <p className="prose-body mt-5 text-sm opacity-70">
                Nearly half of every display this company has fired is charcoal
                glowing at 1700 kelvin. That is not a lack of ambition. It is
                the only emitter in the table that is cheap, bright and
                indestructible at the same time, and every other choice is made
                against it.
              </p>
            </div>
          </div>
        </section>

        {/* The honest note about the palette. */}
        <section className="mt-16">
          <div className="rule grid gap-10 pt-6 md:grid-cols-2">
            <div>
              <h2 className="display-sm">Why colour is never on its own here</h2>
              <p className="prose-body mt-3 opacity-80">
                Computing the palette from physics means accepting what physics
                gives you, and what it gives you is four warm emitters within
                twenty-one degrees of hue — three of them near 590 nanometres
                and one a warm blackbody. Red against green is also the exact
                pair a red-green colour blindness collapses, and roughly one man
                in twelve has one.
              </p>
              <p className="prose-body mt-3 opacity-80">
                So no emitter on this site is ever identified by its colour
                alone. Every swatch carries its name, every cue sheet row is a
                word before it is a hue, and every burst in the field has a
                near-white core — which is what a burst actually looks like, and
                also the only reason a copper blue at 1.2:1 against the night is
                visible at all.
              </p>
            </div>
            <div>
              <h2 className="display-sm">Where the numbers come from</h2>
              <p className="prose-body mt-3 opacity-80">
                Wavelengths and flame temperatures are real and published.
                Relative light output is real and very lopsided — sodium is
                nearly twelve times copper. Prices are invented, but the
                RATIOS between them are not: a blue star really does cost about
                twice its gold equivalent.
              </p>
              <p className="prose-body mt-3 opacity-80">
                One number in this table is not a measurement. Titanium silver
                is entered at an effective 5200 kelvin rather than its flame
                temperature of about 3400, because the burning oxide particles
                radiate far more strongly in the blue than a true blackbody and
                the light reads white. Entering the flame temperature produced a
                tan, which is not a colour anyone has ever seen come out of a
                magnesium star.{" "}
                <Link href="/shells" className="underline underline-offset-4">
                  The catalogue
                </Link>{" "}
                shows what each of them is actually used for.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
