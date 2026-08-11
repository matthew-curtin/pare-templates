import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { BudgetBar } from "@/components/board";
import { IncidentLog, StripLinkStyles } from "@/components/log";
import { Tally, TallyLegend, TallyTicks } from "@/components/marks";
import { INCIDENTS } from "@/content/incidents";
import { SERVICES } from "@/content/services";
import { definitionFor } from "@/content/sla";
import { CLOCK, QUARTER, STRIP, incidentsForService, rowBySlug } from "@/lib/board";
import {
  fmtBudget,
  fmtDate,
  fmtDuration,
  fmtPct,
  monthOf,
  windowFor,
} from "@/lib/availability";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const row = rowBySlug(slug);
  if (!row) return { title: "Service" };
  return { title: row.service.name, description: row.service.blurb };
}

/**
 * One service.
 *
 * This is the page the incident↔day linking lives on: pointing at an entry
 * in the log dims every day except the ones that incident darkened. The
 * wrapper is `.strip-linked` and it is deliberately NOT a container query
 * element — `container-type` applies style containment, which would stop
 * the `:has()` invalidation reaching the marks and leave the whole effect
 * silently doing nothing. See globals.css.
 */
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const row = rowBySlug(slug);
  if (!row) notFound();

  const service = row.service;
  const log = incidentsForService(service.id);
  const linkIndex = new Map(log.map((v, i) => [v.incident.id, i]));
  const definition = definitionFor(service.id);

  const month = monthOf(CLOCK);
  const windows = [
    { label: STRIP.label, result: row.strip },
    { label: `${QUARTER.label} to date`, result: row.quarter },
    { label: `${month.label} to date`, result: windowFor(service, INCIDENTS, month, CLOCK) },
  ];

  return (
    <Shell>
      <div className="frame pt-12 pb-8">
        <Link href="/" className="text-micro text-ink-faint hover:text-ink">
          ← All services
        </Link>
        <p className="eyebrow mt-6">{service.group}</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold">{service.name}</h1>
        <p className="prose-body measure mt-3 text-lede text-ink-dim">{service.blurb}</p>
      </div>

      {/* ---- The strip, and the log that lights it --------------------- */}
      <section className="frame strip-linked">
        <StripLinkStyles count={log.length} />

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
          <h2 className="font-semibold">Last 90 days</h2>
          <p className="num text-micro text-ink-faint">
            target {fmtPct(service.target, 2)} · {fmtDate(STRIP.fromMin)} → today
          </p>
        </div>

        <div className="pt-6">
          <Tally cells={row.cells} name={service.name} height="4.5rem" linkIndex={linkIndex} />
          <TallyTicks cells={row.cells} />
        </div>

        {row.strip.partial && (
          <p className="prose-body measure-wide mt-5 text-ink-dim">
            {service.name} became generally available on{" "}
            <span className="num">{fmtDate(service.liveFrom)}</span>, so{" "}
            {row.tally.none} of the ninety days above are before it existed. Its
            availability figure is measured over the{" "}
            <span className="num">{Math.round(row.strip.totalMin / 1440)}</span>{" "}
            days it has been running, and is marked as a partial window
            everywhere it appears.
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <TallyLegend />
          <p className="text-micro text-ink-faint">
            {log.length > 0 && "Point at an incident below to light the days it cost."}
          </p>
        </div>

        <div className="mt-10">
          <h2 className="font-semibold">Incidents</h2>
          <div className="mt-3">
            <IncidentLog views={log} linked />
          </div>
        </div>
      </section>

      {/* ---- Three windows, three verdicts ----------------------------- */}
      <section className="frame py-14 mt-6 border-t border-line-soft">
        <h2 className="font-semibold">The same incidents, over three windows</h2>
        <p className="prose-body measure mt-2 text-ink-dim">
          A verdict is only meaningful with the window it was measured over
          printed next to it. Credits are settled on the calendar month; the
          budget is managed by the quarter; the strip above is ninety rolling
          days.
        </p>

        <div className="mt-6 overflow-x-auto min-w-0">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              {service.name} availability over three measurement windows.
            </caption>
            <thead>
              <tr className="rule">
                <th scope="col" className="eyebrow py-2 pr-4 font-normal">Window</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Availability</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Budget lost</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Budget allowed</th>
                <th scope="col" className="eyebrow py-2 text-right font-normal">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {windows.map((w) => (
                <tr key={w.label} className="border-t border-line-soft">
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {w.label}
                    {w.result.partial && (
                      <span className="ml-2 text-micro text-ink-faint">partial</span>
                    )}
                  </td>
                  <td className="num py-3 pr-4 text-right text-ink">
                    {fmtPct(w.result.availability)}
                  </td>
                  <td className="num py-3 pr-4 text-right text-ink-dim">
                    {fmtBudget(w.result.lostMin)}
                  </td>
                  <td className="num py-3 pr-4 text-right text-ink-dim">
                    {fmtBudget(w.result.allowanceMin)}
                  </td>
                  <td
                    className="py-3 text-right whitespace-nowrap"
                    style={{
                      color: w.result.meetsTarget
                        ? "var(--color-ink-dim)"
                        : "var(--color-major)",
                    }}
                  >
                    {w.result.meetsTarget ? "Met" : "Missed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="board mt-10">
          <div className="board-row budget-host">
            <div>
              <p className="row-label text-ink">Error budget, {QUARTER.label}</p>
              <p className="num mt-0.5 text-micro text-ink-faint">
                {fmtDuration(row.quarter.lostMin)} lost of{" "}
                {fmtDuration(row.quarter.allowanceMin)} earned so far
              </p>
            </div>
            <div className="row-tally">
              <BudgetBar row={row} />
            </div>
            <div className="text-right">
              <p className="num text-ink">{row.burn.toFixed(2)}×</p>
              <p className="text-micro text-ink-faint">burn rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- What the promise actually says ---------------------------- */}
      <section className="frame pb-16 border-t border-line-soft pt-14">
        <h2 className="font-semibold">What &ldquo;unavailable&rdquo; means here</h2>
        <div className="mt-4 grid gap-8 md:grid-cols-2 measure-wide">
          <div>
            <p className="eyebrow">It counts when</p>
            <p className="prose-body mt-2 text-ink-dim">{definition.unavailable}</p>
          </div>
          <div>
            <p className="eyebrow">It does not count when</p>
            <p className="prose-body mt-2 text-ink-dim">{definition.notCounted}</p>
          </div>
        </div>
        <Link href="/sla" className="mt-6 inline-block text-accent hover:underline">
          The full agreement, the credit schedule and how we measure →
        </Link>
      </section>
    </Shell>
  );
}
