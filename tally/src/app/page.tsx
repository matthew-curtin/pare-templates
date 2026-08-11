import Link from "next/link";
import { Shell } from "@/components/shell";
import { BoardRow, BudgetRow } from "@/components/board";
import { IncidentLog } from "@/components/log";
import { StatusDot, TallyLegend } from "@/components/marks";
import { CLAIMS, SITE } from "@/content/site";
import {
  BOARD,
  CLOCK,
  CREDIT_CLAIMABLE_USD,
  CREDIT_TOTAL_USD,
  COSTLIEST_IN_STRIP,
  LONGEST_IN_STRIP,
  OPEN_INCIDENTS,
  OVER_BUDGET,
  QUARTER,
  STRIP,
  TIMELINE,
  UNBROKEN,
} from "@/lib/board";
import {
  fmtBudget,
  fmtDuration,
  fmtPct,
  fmtStamp,
  fmtTime,
  SEVERITY_LABEL,
} from "@/lib/availability";

export default function StatusPage() {
  const worst = [...BOARD].sort((a, b) => b.burn - a.burn)[0];
  const trouble = OVER_BUDGET[0];

  return (
    <Shell>
      {/* ---- What is happening right now ------------------------------- */}
      {OPEN_INCIDENTS.length > 0 && (
        <section className="frame pt-8" aria-label="Open incidents">
          {OPEN_INCIDENTS.map((view) => {
            const latest = view.incident.updates[view.incident.updates.length - 1];
            return (
              <article
                key={view.incident.id}
                className="panel p-5"
                style={{ borderColor: "var(--color-degraded)" }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <StatusDot state={view.incident.severity} live />
                    {view.incident.title}
                  </h2>
                  <p className="num text-micro text-ink-dim">
                    {SEVERITY_LABEL[view.incident.severity]} · started{" "}
                    {fmtTime(view.incident.startMin)} UTC ·{" "}
                    {fmtDuration(view.durationMin)} so far
                  </p>
                </div>
                <p className="prose-body measure-wide mt-3 text-ink-dim">
                  {view.incident.summary}
                </p>
                {latest && (
                  <p className="prose-body measure-wide mt-3 border-l-2 border-line pl-3 text-micro text-ink-faint">
                    <span className="num">{fmtTime(latest.atMin)} UTC</span> —{" "}
                    {latest.body}
                  </p>
                )}
                <Link
                  href={`/incidents/${view.incident.slug}`}
                  className="mt-4 inline-block text-accent hover:underline"
                >
                  Follow this incident →
                </Link>
              </article>
            );
          })}
        </section>
      )}

      {/* ---- The lead: a number that can be bad ------------------------- */}
      <section className="frame pt-12 pb-10">
        <p className="eyebrow">Error budget · {QUARTER.label}</p>
        {trouble ? (
          <>
            <p className="num mt-2 text-figure text-ink">
              {trouble.burn.toFixed(2)}×
            </p>
            <p className="prose-body measure-wide mt-4 text-lede text-ink-dim">
              <Link
                href={`/services/${trouble.service.slug}`}
                className="text-ink hover:text-accent transition-colors"
              >
                {trouble.service.name}
              </Link>{" "}
              is spending its quarterly error budget {trouble.burn.toFixed(2)}{" "}
              times faster than the quarter is passing — {fmtPct(trouble.consumed, 1)}{" "}
              of it gone with {fmtPct(trouble.elapsed, 1)} of the quarter
              elapsed. Nothing is down. It is still the most important thing on
              this page.
            </p>
          </>
        ) : (
          <>
            <p className="num mt-2 text-figure text-ink">
              {worst.burn.toFixed(2)}×
            </p>
            <p className="prose-body measure-wide mt-4 text-lede text-ink-dim">
              Every service is inside its budget for {QUARTER.label}. The
              fastest spender is {worst.service.name}, and at this rate it
              finishes the quarter with budget to spare.
            </p>
          </>
        )}
      </section>

      {/* ---- The board: the architecture ------------------------------- */}
      <section className="frame pb-4" aria-labelledby="board-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
          <h2 id="board-heading" className="font-semibold">
            Last 90 days
          </h2>
          <p className="num text-micro text-ink-faint">
            {fmtStamp(STRIP.fromMin)} → {fmtStamp(CLOCK)}
          </p>
        </div>

        <div className="board">
          {BOARD.map((row) => (
            <BoardRow key={row.service.id} row={row} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <TallyLegend />
          <p className="num text-micro text-ink-faint">
            one mark per day · height and hue both carry severity
          </p>
        </div>

        <p className="prose-body measure-wide mt-8 text-ink-dim">
          {CLAIMS.noSingleNumber.join(" ")}
        </p>

        {UNBROKEN.length > 0 && (
          <p className="prose-body measure-wide mt-3 text-ink-faint">
            {UNBROKEN.map((r) => r.service.name).join(" and ")}{" "}
            {UNBROKEN.length === 1 ? "has" : "have"} not had an incident in the
            window above. That is worth stating plainly, because a strip of
            unbroken marks looks identical to a strip nobody is measuring.
          </p>
        )}
      </section>

      {/* ---- The argument ---------------------------------------------- */}
      <section className="frame py-14" aria-labelledby="budget-heading">
        <h2 id="budget-heading" className="font-semibold">
          What the promise allows, and what is left of it
        </h2>
        <div className="measure-wide mt-3 space-y-3">
          {CLAIMS.budget.map((p) => (
            <p key={p} className="prose-body text-ink-dim">
              {p}
            </p>
          ))}
        </div>

        <div className="board mt-8">
          {BOARD.map((row) => (
            <BudgetRow key={row.service.id} row={row} />
          ))}
        </div>
        <p className="mt-4 text-micro text-ink-faint">
          The hairline on each track is how far through the quarter we are.
          Fill to the left of it is ahead; to the right is behind. Point at a
          row to run the fill out to where its current rate lands at quarter
          end.
        </p>
      </section>

      {/* ---- Duration is the wrong axis -------------------------------- */}
      <section className="frame py-14 border-t border-line-soft" aria-labelledby="pair-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 id="pair-heading" className="font-semibold">
              Two incidents, eight days apart, on the same service
            </h2>
            <div className="measure mt-3 space-y-3">
              {CLAIMS.pair.map((p) => (
                <p key={p} className="prose-body text-ink-dim">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft self-start">
            {[
              { k: "Longest in the window", view: LONGEST_IN_STRIP },
              { k: "Costliest in the window", view: COSTLIEST_IN_STRIP },
            ].map(({ k, view }) => (
              <div key={k} className="bg-surface p-5">
                <dt className="eyebrow">{k}</dt>
                <dd
                  className="num mt-2 text-2xl"
                  style={{ color: `var(--color-${view.incident.severity})` }}
                >
                  {fmtDuration(view.durationMin)}
                </dd>
                <dd className="num mt-3 text-ink">
                  {fmtBudget(view.totalBudgetMin)}
                </dd>
                <dd className="text-micro text-ink-faint">
                  of budget · {(view.spend[0].fraction * 100).toFixed(0)}% of
                  requests
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Recent, and the money ------------------------------------- */}
      <section className="frame py-14 border-t border-line-soft">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-semibold">Recent incidents</h2>
              <Link href="/incidents" className="text-accent hover:underline">
                All {TIMELINE.length} →
              </Link>
            </div>
            <div className="mt-3">
              <IncidentLog views={TIMELINE.slice(0, 6)} />
            </div>
          </div>

          <div>
            <h2 className="font-semibold">Credits owed</h2>
            <p className="num mt-3 text-2xl text-ink">
              ${CREDIT_TOTAL_USD.toLocaleString("en-US")}
            </p>
            <p className="text-micro text-ink-faint">
              across the last six complete months
            </p>
            <div className="measure mt-4 space-y-3">
              {CLAIMS.credits.slice(1).map((p) => (
                <p key={p} className="prose-body text-ink-dim">
                  {p}
                </p>
              ))}
            </div>
            <p className="num mt-4 text-micro text-ink-faint">
              ${CREDIT_CLAIMABLE_USD.toLocaleString("en-US")} still claimable
            </p>
            <Link href="/sla#credits" className="mt-4 inline-block text-accent hover:underline">
              The schedule and every month →
            </Link>
          </div>
        </div>
      </section>

      <section className="frame pb-4">
        <p className="prose-body measure-wide text-micro text-ink-faint">
          {SITE.name} publishes this page from the same measurements its
          on-call engineers are paged by. Where a judgement could go either
          way it goes the expensive way — see{" "}
          <Link href="/sla#method" className="text-accent hover:underline">
            how we measure
          </Link>
          .
        </p>
      </section>
    </Shell>
  );
}
