import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Shell } from "@/components/shell";
import { SERVICES } from "@/content/services";
import {
  CLAIM_NOTE,
  CLAIM_STEPS,
  DEFINITIONS,
  EXCLUSIONS,
  METHOD,
  REFERENCE_CUSTOMER,
} from "@/content/sla";
import { CLAIMS, PAGE_INTROS } from "@/content/site";
import {
  CLOCK,
  CREDITS,
  CREDIT_CLAIMABLE_USD,
  CREDIT_EXPIRED_USD,
  CREDIT_MONTHS,
  CREDIT_TOTAL_USD,
  REFERENCE_SPEND_USD,
  WORST_BAND_REACHED,
} from "@/lib/board";
import {
  CLAIM_DAYS,
  CREDIT_BANDS,
  bandThresholds,
  fmtDate,
  fmtPct,
} from "@/lib/availability";

export const metadata: Metadata = {
  title: "SLA & credits",
  description:
    "The targets, the credit schedule derived from them, how availability is measured, and every credit the last six months produced.",
};

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function SlaPage() {
  const unreached = CREDIT_BANDS.filter((b) => b.percent > WORST_BAND_REACHED);

  return (
    <Shell>
      <PageHead
        eyebrow="The promise"
        title="What we owe you when we miss"
        intro={PAGE_INTROS.sla}
      />

      {/* ---- The money, first ------------------------------------------ */}
      <section className="frame" id="credits">
        <dl className="grid gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft sm:grid-cols-3">
          <div className="bg-surface p-5">
            <dt className="eyebrow">Owed, last six months</dt>
            <dd className="num mt-2 text-2xl text-ink">{usd(CREDIT_TOTAL_USD)}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="eyebrow">Still claimable</dt>
            <dd className="num mt-2 text-2xl text-ink">{usd(CREDIT_CLAIMABLE_USD)}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="eyebrow">Past its claim window</dt>
            <dd className="num mt-2 text-2xl" style={{ color: "var(--color-partial)" }}>
              {usd(CREDIT_EXPIRED_USD)}
            </dd>
          </div>
        </dl>

        <div className="measure-wide mt-6 space-y-3">
          {CLAIMS.credits.map((p) => (
            <p key={p} className="prose-body text-ink-dim">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto min-w-0">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Every service credit produced by the last six complete months.
            </caption>
            <thead>
              <tr className="rule">
                <th scope="col" className="eyebrow py-2 pr-4 font-normal">Month</th>
                <th scope="col" className="eyebrow py-2 pr-4 font-normal">Service</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Availability</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Target</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Credit</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Value</th>
                <th scope="col" className="eyebrow py-2 text-right font-normal">Claim by</th>
              </tr>
            </thead>
            <tbody>
              {CREDITS.map((c) => (
                <tr
                  key={`${c.period.label}-${c.service.id}`}
                  className="border-t border-line-soft"
                >
                  <td className="py-3 pr-4 whitespace-nowrap">{c.period.label}</td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/services/${c.service.slug}`}
                      className="text-ink hover:text-accent transition-colors"
                    >
                      {c.service.name}
                    </Link>
                  </td>
                  <td className="num py-3 pr-4 text-right" style={{ color: "var(--color-major)" }}>
                    {fmtPct(c.availability)}
                  </td>
                  <td className="num py-3 pr-4 text-right text-ink-faint">
                    {fmtPct(c.service.target, 2)}
                  </td>
                  <td className="num py-3 pr-4 text-right text-ink">{c.percent}%</td>
                  <td className="num py-3 pr-4 text-right text-ink">{usd(c.usd)}</td>
                  <td className="num py-3 text-right whitespace-nowrap">
                    <span style={{ color: c.claimable ? "var(--color-ink-dim)" : "var(--color-partial)" }}>
                      {fmtDate(c.claimByMin)}
                      {!c.claimable && " · closed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="prose-body measure-wide mt-4 text-micro text-ink-faint">
          Six complete months are shown — {CREDIT_MONTHS[CREDIT_MONTHS.length - 1].label}{" "}
          to {CREDIT_MONTHS[0].label}. A month still running has no verdict yet,
          so August is not in this table. The claim window is {CLAIM_DAYS} days
          from the end of the month, which is why only the two most recent rows
          can ever be open.
        </p>
      </section>

      {/* ---- February -------------------------------------------------- */}
      <section className="frame py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 className="font-semibold">The month that changed the page</h2>
            <div className="measure mt-3 space-y-3">
              {CLAIMS.february.map((p) => (
                <p key={p} className="prose-body text-ink-dim">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Which window a verdict used</h2>
            <div className="measure mt-3 space-y-3">
              {CLAIMS.windows.map((p) => (
                <p key={p} className="prose-body text-ink-dim">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- The schedule ---------------------------------------------- */}
      <section className="frame py-14 border-t border-line-soft">
        <h2 className="font-semibold">The credit schedule</h2>
        <p className="prose-body measure mt-2 text-ink-dim">
          Bands are expressed as distance below each service&rsquo;s own
          target rather than as three fixed percentages. Absolute bands are the
          industry norm and they have a hole in them: a service sold on 99.99%
          and credited from 99.95% can miss its promise by a factor of five and
          owe nothing. Deriving them costs one subtraction.
        </p>

        <div className="mt-6 overflow-x-auto min-w-0">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Credit thresholds for each service, derived from its target.
            </caption>
            <thead>
              <tr className="rule">
                <th scope="col" className="eyebrow py-2 pr-4 font-normal">Service</th>
                <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Target</th>
                {CREDIT_BANDS.map((b) => (
                  <th
                    key={b.percent}
                    scope="col"
                    className="eyebrow py-2 pr-4 text-right font-normal"
                  >
                    {b.percent}% credit below
                  </th>
                ))}
                <th scope="col" className="eyebrow py-2 text-right font-normal">Monthly fee</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((s) => (
                <tr key={s.id} className="border-t border-line-soft">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-ink hover:text-accent transition-colors"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="num py-3 pr-4 text-right text-ink">{fmtPct(s.target, 2)}</td>
                  {bandThresholds(s).map((b) => (
                    <td key={b.percent} className="num py-3 pr-4 text-right text-ink-dim">
                      {fmtPct(b.threshold, 2)}
                    </td>
                  ))}
                  <td className="num py-3 text-right text-ink-dim">{usd(s.monthlyUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {unreached.length > 0 && (
          <p className="prose-body measure-wide mt-4 text-micro text-ink-faint">
            No month in the published record has reached the{" "}
            {unreached.map((b) => `${b.percent}%`).join(" or ")} band. The worst
            was {WORST_BAND_REACHED}%. That is stated rather than left to be
            inferred from an empty column, because a band nobody has hit looks
            identical to a band that does not work.
          </p>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h3 className="font-semibold">How to claim</h3>
            <ol className="measure mt-3 space-y-3">
              {CLAIM_STEPS.map((step, i) => (
                <li key={step} className="prose-body flex gap-3 text-ink-dim">
                  <span className="num text-ink-faint">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="prose-body measure mt-4 text-micro text-ink-faint">{CLAIM_NOTE}</p>
          </div>
          <div>
            <h3 className="font-semibold">The reference account</h3>
            <p className="prose-body measure mt-3 text-ink-dim">
              {REFERENCE_CUSTOMER.body}
            </p>
            <p className="num mt-4 text-ink">
              {usd(REFERENCE_SPEND_USD)}
              <span className="text-ink-faint"> / month across all six services</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---- Definitions ------------------------------------------------ */}
      <section className="frame py-14 border-t border-line-soft">
        <h2 className="font-semibold">What counts as unavailable</h2>
        <p className="prose-body measure mt-2 text-ink-dim">
          A target without a definition is a promise about nothing, and that is
          the usual shape of them. These are the conditions that start the
          clock.
        </p>

        <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft md:grid-cols-2">
          {DEFINITIONS.map((d) => {
            const service = SERVICES.find((s) => s.id === d.serviceId);
            if (!service) return null;
            return (
              <div key={d.serviceId} className="bg-surface p-5">
                <h3 className="flex items-baseline justify-between gap-3 font-semibold">
                  {service.name}
                  <span className="num text-micro text-ink-faint">
                    {fmtPct(service.target, 2)}
                  </span>
                </h3>
                <p className="prose-body mt-2 text-ink-dim">{d.unavailable}</p>
                <p className="prose-body mt-3 text-micro text-ink-faint">
                  <span className="text-ink-dim">Not counted: </span>
                  {d.notCounted}
                </p>
              </div>
            );
          })}
        </div>

        <h3 className="mt-10 font-semibold">Exclusions</h3>
        <div className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {EXCLUSIONS.map((e) => (
            <div key={e.title}>
              <p className="eyebrow">{e.title}</p>
              <p className="prose-body mt-2 text-ink-dim">{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Method ----------------------------------------------------- */}
      <section className="frame py-14 border-t border-line-soft" id="method">
        <h2 className="font-semibold">How we measure</h2>
        <ol className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {METHOD.map((m, i) => (
            <li key={m.title}>
              <p className="num text-micro text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-semibold">{m.title}</h3>
              <p className="prose-body mt-2 text-ink-dim">{m.body}</p>
            </li>
          ))}
        </ol>
        <p className="num mt-10 text-micro text-ink-faint">
          This page rendered against {fmtDate(CLOCK)}.
        </p>
      </section>
    </Shell>
  );
}
