import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Masthead } from "@/components/chrome";
import { Swatch } from "@/components/sheet";
import { StockStyle } from "@/components/stock-style";
import { PRICE_PAIRS, SHELLS } from "@/content/shells";
import { emissionColour, toCss } from "@/lib/emission";
import { shellById } from "@/lib/ballistics";

export const metadata: Metadata = {
  title: "Shells",
  description:
    "Twenty shells, drawn to scale against each other — break height, lift time, burst diameter and price.",
};

const WIDEST = Math.max(...SHELLS.map((s) => s.burstM));

export default function ShellsPage() {
  const bySize = [...SHELLS].sort(
    (a, b) => a.sizeInches - b.sizeInches || a.costUsd - b.costUsd,
  );

  return (
    <>
      <StockStyle emission="gold" />
      <Masthead standfirst="Twenty shells, drawn to scale against one another. Break height runs at about thirty metres per inch of diameter and there is no such thing as a six-inch shell that breaks low — which is why choosing a shell is choosing a height, a lift time and a price all at once." />

      <main className="px-4 sm:px-6 lg:px-10">
        {/* The three matched pairs the price argument rests on. */}
        <section className="rule pt-6">
          <h2 className="display-sm">Three matched pairs</h2>
          <p className="prose-body mt-2 max-w-2xl text-sm opacity-70">
            Same diameter, same effect, same star count, same burn. The only
            difference is which metal is in the star.
          </p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {PRICE_PAIRS.map((pair) => {
              const gold = shellById(SHELLS, pair.gold);
              const blue = shellById(SHELLS, pair.blue);
              return (
                <li key={pair.gold} className="card p-4">
                  <p className="eyebrow opacity-55">{gold.sizeInches} inch</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="flex items-center gap-1.5">
                        <Swatch id="gold" /> gold
                      </dt>
                      <dd className="num">£{gold.costUsd}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="flex items-center gap-1.5">
                        <Swatch id="blue" /> blue
                      </dt>
                      <dd className="num">£{blue.costUsd}</dd>
                    </div>
                  </dl>
                  <p className="num mt-3 text-lg">
                    ×{(blue.costUsd / gold.costUsd).toFixed(2)}
                  </p>
                  <p className="prose-body text-xs opacity-60">
                    for ×0.22 the light
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="prose-body mt-4 max-w-2xl text-sm opacity-70">
            Read together: roughly twice the price for roughly a quarter of the
            light, which is about nine times the cost per unit of light in the
            sky. <Link href="/colour" className="underline underline-offset-4">Why copper does this</Link>.
          </p>
        </section>

        {/* Drawn to scale. */}
        <section className="mt-16">
          <div className="rule pt-6">
            <h2 className="display-sm">The catalogue, drawn to scale</h2>
            <p className="prose-body mt-2 max-w-2xl text-sm opacity-70">
              The disc is the burst at true relative diameter. The twelve-inch
              shell is four hundred metres across.
            </p>
          </div>

          <ul className="mt-8 space-y-px">
            {bySize.map((shell) => (
              <li key={shell.id}>
                <Link
                  href={`/shells/${shell.id}`}
                  className="group grid grid-cols-[3.5rem_1fr] items-center gap-4 py-3 sm:grid-cols-[5rem_1fr_auto]"
                >
                  {/* The burst, to scale. */}
                  <span className="flex h-14 items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="block rounded-full"
                      style={{
                        width: `${(shell.burstM / WIDEST) * 3.5}rem`,
                        height: `${(shell.burstM / WIDEST) * 3.5}rem`,
                        background: `radial-gradient(circle, color-mix(in oklab, ${toCss(
                          emissionColour(shell.emissions[0]),
                        )} 22%, white) 0%, ${toCss(
                          emissionColour(shell.emissions[0]),
                        )} 38%, color-mix(in oklab, ${toCss(
                          emissionColour(shell.emissions[0]),
                        )} 30%, transparent) 78%)`,
                      }}
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="display-sm block group-hover:underline group-hover:underline-offset-4">
                      {shell.name}
                    </span>
                    <span className="num block text-xs opacity-55">
                      breaks at {shell.altitudeM} m ·{" "}
                      {(shell.liftTenths / 10).toFixed(1)} s of lift ·{" "}
                      {shell.burstM} m across · {shell.stars} stars
                    </span>
                  </span>

                  <span className="num hidden text-right text-lg sm:block">
                    £{shell.costUsd}
                  </span>
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
