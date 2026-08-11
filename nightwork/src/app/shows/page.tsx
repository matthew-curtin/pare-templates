import type { Metadata } from "next";
import Link from "next/link";
import { Field } from "@/components/field";
import { Footer, Masthead } from "@/components/chrome";
import { EmissionName } from "@/components/sheet";
import { StockStyle } from "@/components/stock-style";
import { clockCoarse } from "@/lib/ballistics";
import { FLEET_TOTALS, SHOW_DATA } from "@/lib/show-data";

export const metadata: Metadata = {
  title: "Shows",
  description:
    "Six displays, each published in full — every shell, its cost, the moment it broke and the moment it was fired.",
};

export default function ShowsPage() {
  return (
    <>
      <StockStyle emission="gold" />
      <Masthead standfirst="Six displays, published in full. Each one is drawn as an altitude field — time across, real height up — and each one can be read as the audience saw it or as the crew fired it." />

      <main className="px-4 sm:px-6 lg:px-10">
        <p className="num rule pt-4 text-sm opacity-60">
          {FLEET_TOTALS.shows} displays · {FLEET_TOTALS.shells.toLocaleString("en-GB")}{" "}
          shells · £{FLEET_TOTALS.costUsd.toLocaleString("en-GB")} of stock
        </p>

        <ul className="mt-10 space-y-16">
          {SHOW_DATA.map((data) => (
            <li key={data.show.slug}>
              <article>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="display">
                    <Link
                      href={`/shows/${data.show.slug}`}
                      className="underline-offset-8 hover:underline"
                    >
                      {data.show.title}
                    </Link>
                  </h2>
                  <p className="num text-sm opacity-60">
                    {data.site.name} · {clockCoarse(data.lastLightTenths)} ·{" "}
                    {data.cues.length} shells · £
                    {data.costUsd.toLocaleString("en-GB")}
                  </p>
                </div>

                <p className="prose-lead mt-3 max-w-3xl opacity-80">
                  {data.show.standfirst}
                </p>

                <div className="mt-5">
                  <Field data={data} height="clamp(13rem, 30vh, 20rem)" />
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="eyebrow opacity-50">Signature</dt>
                    <dd className="mt-1">
                      <EmissionName id={data.signature} />
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow opacity-50">Largest shell</dt>
                    <dd className="num mt-1">
                      {data.largestShell.sizeInches} in · {data.largestShell.altitudeM} m
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow opacity-50">Busiest second</dt>
                    <dd className="num mt-1">{data.peakRate.breaks} breaks</dd>
                  </div>
                  <div>
                    <dt className="eyebrow opacity-50">Per minute</dt>
                    <dd className="num mt-1">
                      £{data.costPerMinute.toLocaleString("en-GB")}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </>
  );
}
