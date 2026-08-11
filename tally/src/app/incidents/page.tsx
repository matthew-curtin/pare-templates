import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/shell";
import { IncidentLog } from "@/components/log";
import { CLAIMS, PAGE_INTROS } from "@/content/site";
import { FLEET, TIMELINE } from "@/lib/board";

export const metadata: Metadata = {
  title: "Incident history",
  description:
    "Every incident since February, with what each one cost in error budget.",
};

/**
 * The archive.
 *
 * The two filters are CSS only — a checkbox and a `:has()` rule in
 * globals.css, no state, no re-render, no JavaScript at all. They exist
 * because an archive that mixes announced maintenance and minor
 * degradations in with real outages makes the real outages harder to
 * count, and counting them is what a person comes here to do.
 */
export default function IncidentsPage() {
  const outages = TIMELINE.filter((v) => v.incident.severity !== "maintenance");

  return (
    <Shell>
      <PageHead
        eyebrow="History"
        title="Every incident, and what it cost"
        intro={PAGE_INTROS.incidents}
      />

      <section className="frame">
        <div className="log">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-line pb-3">
            <fieldset className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <legend className="sr-only">Filter the incident list</legend>
              <label className="flex cursor-pointer items-center gap-2 text-ink-dim hover:text-ink transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="filter-maintenance accent-accent"
                />
                Announced maintenance
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-ink-dim hover:text-ink transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="filter-degraded accent-accent"
                />
                Degraded
              </label>
            </fieldset>

            <p className="num text-micro text-ink-faint">
              {TIMELINE.length} entries · {outages.length} unplanned ·{" "}
              {FLEET.maintenance} announced
            </p>
          </div>

          <IncidentLog views={TIMELINE} />
        </div>
      </section>

      <section className="frame py-14 mt-6 border-t border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 className="font-semibold">Noticing is the hard half</h2>
            <div className="measure mt-3 space-y-3">
              {CLAIMS.detection.map((p) => (
                <p key={p} className="prose-body text-ink-dim">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-md border border-line-soft bg-line-soft">
            <div className="bg-surface p-5">
              <dt className="eyebrow">Mean time to notice</dt>
              <dd className="num mt-2 text-2xl text-ink">
                {FLEET.meanDetectMin.toFixed(1)}
                <span className="text-base text-ink-faint"> min</span>
              </dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="eyebrow">Mean time to fix</dt>
              <dd className="num mt-2 text-2xl text-ink">
                {FLEET.meanRepairMin.toFixed(1)}
                <span className="text-base text-ink-faint"> min</span>
              </dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="eyebrow">Told to us by a customer first</dt>
              <dd className="num mt-2 text-2xl text-ink">{FLEET.customerReported}</dd>
              <dd className="text-micro text-ink-faint">
                of {outages.length} unplanned
              </dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="eyebrow">Slower to notice than to fix</dt>
              <dd className="num mt-2 text-2xl text-ink">{FLEET.slowerToNotice}</dd>
              <dd className="text-micro text-ink-faint">
                of {outages.length} unplanned
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </Shell>
  );
}
