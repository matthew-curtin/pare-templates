import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Shell } from "@/components/shell";
import { Plate } from "@/components/plate";
import { REGIONS } from "@/content/regions";
import { HARDWARE, INFRA_INTRO, REDUNDANCY, SITE_NOTE } from "@/content/infrastructure";
import { PAGE_INTROS } from "@/content/site";
import { fmtDate } from "@/lib/availability";

import coldAisle from "@/images/cold-aisle.jpg";
import switchgear from "@/images/switchgear.jpg";
import crossConnect from "@/images/cross-connect.jpg";
import dryCoolers from "@/images/dry-coolers.jpg";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "Five regions on hardware we own, and the parts of it that have failed.",
};

/**
 * Every photograph on this page is settling a claim the prose next to it
 * makes — the §6 test applied at authoring time. The switchgear frame is
 * literally the subject of the June incident; the dry coolers are the
 * reason the free-cooling figure is what it is. An image you could swap
 * for another of the same subject without anybody noticing is decoration.
 */
const PLATE_FOR: Record<string, { src: typeof coldAisle; alt: string; caption: string }> = {
  power: {
    src: switchgear,
    alt: "A long row of grey medium-voltage switchgear panels receding down a corridor, each door carrying a mimic diagram and an asset tag.",
    caption:
      "Medium-voltage switchgear at iad1. One panel is one feed. June's outage was a control relay behind one of these doors — correct rating, wrong coil voltage — which is the kind of sentence you can only write about hardware you own.",
  },
  network: {
    src: crossConnect,
    alt: "Aqua fibre patch cords fanned into an orange line card, connectors individually labelled, status lights along the lower edge.",
    caption:
      "The cross-connect at dub1. Owning the fibre into the building rather than leasing a wavelength is what makes a third transit provider a purchasing decision instead of a negotiation.",
  },
  cooling: {
    src: dryCoolers,
    alt: "Two rows of finned dry-cooler units either side of a rooftop walkway, an insulated pipe running between them under a bright sky.",
    caption:
      "Dry coolers on the roof at pdx1. Free cooling is not an environmental gesture here, it is why the site pencils out at all; the chillers exist for the hundred and fifty-five days a year these cannot carry it alone.",
  },
};

export default function InfrastructurePage() {
  return (
    <Shell>
      <PageHead
        eyebrow="The metal"
        title="Five sites, and what has broken in them"
        intro={PAGE_INTROS.infrastructure}
      />

      <section className="frame">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="measure space-y-3">
            {INFRA_INTRO.map((p) => (
              <p key={p} className="prose-body text-lede text-ink-dim">
                {p}
              </p>
            ))}
          </div>
          <Plate
            src={coldAisle}
            priority
            alt="A data-hall aisle between two rows of perforated black cabinets, cable trays running the length of the ceiling and a wire mesh cage at the far end."
            caption="A cold aisle at iad1. The two tray runs overhead are the separate paths every cabinet is fed from — the redundancy this page claims is visible from the floor, which is the point of showing it."
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
      </section>

      {/* ---- Regions ---------------------------------------------------- */}
      <section className="frame py-14" aria-labelledby="regions-heading">
        <h2 id="regions-heading" className="font-semibold">
          Regions
        </h2>
        <div className="board mt-4">
          {REGIONS.map((r) => (
            <div key={r.id} className="board-row">
              <div>
                <p className="row-label text-ink">
                  {r.city}
                  <span className="num ml-2 text-micro text-ink-faint">{r.code}</span>
                </p>
                <p className="text-micro text-ink-faint">{r.country}</p>
              </div>
              <p className="prose-body row-tally text-ink-dim">{r.note}</p>
              <p className="num text-micro text-ink-faint sm:text-right">
                live {fmtDate(r.liveFrom)}
              </p>
            </div>
          ))}
        </div>
        <p className="prose-body measure-wide mt-6 text-micro text-ink-faint">{SITE_NOTE}</p>
      </section>

      {/* ---- Redundancy, each claim with its evidence ------------------- */}
      <section className="frame py-14 border-t border-line-soft" id="redundancy">
        <h2 className="font-semibold">What is doubled, and what happened anyway</h2>
        <p className="prose-body measure mt-2 text-ink-dim">
          Every claim below has an incident behind it. A redundancy page that
          only lists what is duplicated is a brochure; the interesting half is
          the time the duplicate did not take over.
        </p>

        <div className="mt-10 space-y-14">
          {REDUNDANCY.map((claim, i) => {
            const plate = PLATE_FOR[claim.id];
            return (
              <article
                key={claim.id}
                className={`grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center ${
                  i % 2 === 1 ? "lg:[&>figure]:order-first" : ""
                }`}
              >
                <div>
                  <p className="num text-figure text-ink">{claim.figure}</p>
                  <p className="text-micro text-ink-faint">{claim.unit}</p>
                  <h3 className="mt-5 font-semibold">{claim.title}</h3>
                  <p className="prose-body measure mt-2 text-ink-dim">{claim.body}</p>
                </div>
                {plate ? (
                  <Plate
                    src={plate.src}
                    alt={plate.alt}
                    caption={plate.caption}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                ) : (
                  <div className="panel p-6">
                    <p className="eyebrow">Not photographed</p>
                    <p className="prose-body mt-2 text-ink-dim">
                      Erasure coding has nothing to look at. The fragments are
                      spread across cabinets that are indistinguishable from the
                      ones above, and a photograph of them would be decoration
                      standing in for evidence.
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ---- Hardware ---------------------------------------------------- */}
      <section className="frame py-14 border-t border-line-soft">
        <h2 className="font-semibold">What we buy</h2>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {HARDWARE.map((h) => (
            <div key={h.label} className="bg-surface p-5">
              <dt className="eyebrow">{h.label}</dt>
              <dd className="mt-1 text-ink">{h.value}</dd>
            </div>
          ))}
        </dl>
        <Link href="/incidents" className="mt-8 inline-block text-accent hover:underline">
          Everything that has gone wrong in these rooms →
        </Link>
      </section>
    </Shell>
  );
}
