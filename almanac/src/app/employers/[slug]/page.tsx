import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RuleLabel } from "@/components/chips";
import { toCardData, VacancyCard } from "@/components/vacancy-card";
import { Monogram } from "@/components/wordmark";
import { employers } from "@/content/employers";
import { payBasis } from "@/content/site";
import { itemsForEmployer } from "@/lib/board";

export function generateStaticParams() {
  return employers.map((employer) => ({ slug: employer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const employer = employers.find((one) => one.slug === slug);
  if (!employer) return { title: "Employer not found" };
  return { title: employer.name, description: employer.about };
}

export default async function EmployerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const employer = employers.find((one) => one.slug === slug);
  if (!employer) notFound();

  const items = itemsForEmployer(employer.id);
  const open = items.filter((item) => !item.listing.closed);
  const closed = items.filter((item) => item.listing.closed);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-8 text-sm">
        <Link
          href="/employers"
          className="focus-ring font-medium text-ink-muted transition-colors hover:text-ink"
        >
          ← All employers
        </Link>
      </nav>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Monogram name={employer.name} size="lg" />
        <div className="min-w-0">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
            {employer.name}
          </h1>
          <p className="mt-1.5 text-sm text-ink-subtle">
            {employer.kind} · {employer.place}
          </p>
        </div>
      </header>

      <p className="prose-wrap mt-8 text-lg leading-relaxed text-ink-muted">
        {employer.about}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 rounded-card bg-surface p-6 shadow-card sm:grid-cols-3">
        <Fact term="Size" value={employer.staff} />
        <Fact term="Established" value={String(employer.founded)} />
        <Fact term="Website" value={employer.site} />
      </dl>

      <section className="mt-12">
        <RuleLabel>
          {open.length > 0
            ? `${open.length} open ${open.length === 1 ? "position" : "positions"}`
            : "Open positions"}
        </RuleLabel>

        {open.length > 0 ? (
          <div className="mt-4 space-y-3">
            {open.map((item) => (
              <VacancyCard
                key={item.vacancy.id}
                data={toCardData(item, payBasis)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-card bg-surface p-7 shadow-card">
            <p className="font-semibold text-ink">
              Nothing open here at the moment.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {closed.length > 0
                ? "Their most recent posting has closed and is below. "
                : ""}
              An alert will catch the next one the day it goes up.
            </p>
            <p className="mt-5">
              <Link
                href="/alerts"
                className="focus-ring inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Set up an alert
              </Link>
            </p>
          </div>
        )}
      </section>

      {closed.length > 0 && (
        <section className="mt-12">
          <RuleLabel>Recently closed</RuleLabel>
          <div className="mt-4 space-y-3">
            {closed.map((item) => (
              <VacancyCard
                key={item.vacancy.id}
                data={toCardData(item, payBasis)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-subtle">{term}</dt>
      <dd className="mt-1.5 text-sm text-ink-muted">{value}</dd>
    </div>
  );
}
