import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { SpendTable } from "@/components/log";
import { StatusDot } from "@/components/marks";
import { INCIDENTS } from "@/content/incidents";
import { regionById } from "@/content/regions";
import { viewBySlug } from "@/lib/board";
import {
  SEVERITY_LABEL,
  fmtBudget,
  fmtDate,
  fmtDuration,
  fmtStamp,
  fmtTime,
} from "@/lib/availability";

export function generateStaticParams() {
  return INCIDENTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/incidents/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const view = viewBySlug(slug);
  if (!view) return { title: "Incident" };
  return { title: view.incident.title, description: view.incident.summary };
}

const STATUS_WORD: Record<string, string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
  scheduled: "Scheduled",
};

/**
 * The post-mortem.
 *
 * Prose gets a reading column here, which is the one place on this site
 * where a measure is the right layout — everywhere else the content is a
 * grid of numbers that wants width.
 */
export default async function IncidentPage({ params }: PageProps<"/incidents/[slug]">) {
  const { slug } = await params;
  const view = viewBySlug(slug);
  if (!view) notFound();

  const inc = view.incident;
  const planned = inc.severity === "maintenance";

  return (
    <Shell>
      <article className="frame pt-12 pb-10">
        <Link href="/incidents" className="text-micro text-ink-faint hover:text-ink">
          ← Incident history
        </Link>

        <p className="eyebrow mt-6 flex items-center gap-2">
          <StatusDot state={inc.severity} />
          {SEVERITY_LABEL[inc.severity]}
          {view.open && " · open now"}
        </p>

        <h1 className="measure-wide mt-2 text-2xl md:text-3xl font-semibold">{inc.title}</h1>

        <p className="prose-body measure-wide mt-4 text-lede text-ink-dim">{inc.summary}</p>

        {/* -- The readings ------------------------------------------------ */}
        <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-surface p-4">
            <dt className="eyebrow">Started</dt>
            <dd className="num mt-1 text-ink">{fmtStamp(inc.startMin)}</dd>
            <dd className="text-micro text-ink-faint">{fmtDate(inc.startMin)}</dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="eyebrow">Duration</dt>
            <dd className="num mt-1 text-ink">{fmtDuration(view.durationMin)}</dd>
            <dd className="text-micro text-ink-faint">
              {view.open ? "still running" : `ended ${fmtStamp(inc.endMin ?? 0)}`}
            </dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="eyebrow">Noticed after</dt>
            <dd className="num mt-1 text-ink">{view.detectMin} min</dd>
            <dd className="text-micro text-ink-faint">
              by {inc.detectedBy === "customer" ? "a customer" : `our ${inc.detectedBy}s`}
            </dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="eyebrow">Error budget</dt>
            <dd className="num mt-1 text-ink">
              {planned ? "—" : fmtBudget(view.totalBudgetMin)}
            </dd>
            <dd className="text-micro text-ink-faint">
              {planned ? "announced, so excluded" : "impact-weighted"}
            </dd>
          </div>
        </dl>

        {view.slowToNotice && (
          <p
            className="prose-body measure-wide mt-6 border-l-2 pl-4 text-ink-dim"
            style={{ borderColor: "var(--color-partial)" }}
          >
            We took <strong className="num text-ink">{view.detectMin} minutes</strong> to
            notice this and{" "}
            <strong className="num text-ink">{view.repairMin} minutes</strong> to fix it.
            That is the wrong way round, and it is the only incident in the
            published record where it happened.
          </p>
        )}

        {/* -- Where -------------------------------------------------------- */}
        <section className="mt-10">
          <h2 className="eyebrow">Regions affected</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {inc.regionIds.map((id) => {
              const r = regionById(id);
              return (
                <li key={id} className="chip">
                  <span className="num">{r.code}</span> {r.city}
                </li>
              );
            })}
          </ul>
        </section>

        {/* -- What it cost ------------------------------------------------- */}
        <section className="mt-10">
          <h2 className="font-semibold">What it cost</h2>
          <div className="mt-3 overflow-x-auto min-w-0">
            <SpendTable view={view} />
          </div>
        </section>

        {/* -- The write-up ------------------------------------------------- */}
        <section className="measure mt-12 space-y-8">
          <div>
            <h2 className="font-semibold">
              {planned ? "Why we did it" : "What happened"}
            </h2>
            <p className="prose-body mt-2 text-ink-dim">{inc.cause}</p>
          </div>

          <div>
            <h2 className="font-semibold">
              {planned ? "How it went" : "How it was fixed"}
            </h2>
            <p className="prose-body mt-2 text-ink-dim">{inc.fix}</p>
          </div>

          <div>
            <h2 className="font-semibold">
              {planned ? "Notes" : "What changes because of it"}
            </h2>
            <ul className="mt-2 space-y-2">
              {inc.prevention.map((p) => (
                <li key={p} className="prose-body flex gap-3 text-ink-dim">
                  <span aria-hidden="true" className="mt-2 h-px w-4 flex-none bg-line" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* -- The timeline ------------------------------------------------- */}
        <section className="mt-12">
          <h2 className="font-semibold">Updates as they were published</h2>
          <ol className="measure-wide mt-4">
            {inc.updates.map((u) => (
              <li
                key={u.atMin}
                className="grid gap-x-5 gap-y-1 border-t border-line-soft py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
              >
                <div>
                  <p className="num text-micro text-ink">{fmtTime(u.atMin)} UTC</p>
                  <p className="num text-micro text-ink-faint">
                    {fmtDate(u.atMin)}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">{STATUS_WORD[u.status]}</p>
                  <p className="prose-body mt-1 text-ink-dim">{u.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {view.open && (
            <p className="prose-body measure mt-4 text-micro text-ink-faint">
              This incident is still running. Updates are published at least
              every thirty minutes until it is closed, and the full write-up
              follows within five working days.
            </p>
          )}
        </section>
      </article>
    </Shell>
  );
}
