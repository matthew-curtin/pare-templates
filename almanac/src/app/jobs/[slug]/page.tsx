import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClosingStamp, Flag, RuleLabel } from "@/components/chips";
import { toCardData, VacancyCard } from "@/components/vacancy-card";
import { Monogram } from "@/components/wordmark";
import { payBasis, ZONE } from "@/content/site";
import { boardItems, itemBySlug, itemsForEmployer, nowMs } from "@/lib/board";
import { closingLabel, longDate, postedLabel } from "@/lib/dates";
import { hoursLabel, payLabel } from "@/lib/pay";
import { vacancies } from "@/content/vacancies";

export function generateStaticParams() {
  return vacancies.map((vacancy) => ({ slug: vacancy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = itemBySlug.get(slug);
  if (!item) return { title: "Vacancy not found" };
  return {
    title: `${item.vacancy.title}, ${item.employer.name}`,
    description: item.vacancy.summary,
  };
}

export default async function VacancyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = itemBySlug.get(slug);
  if (!item) notFound();

  const { vacancy, employer, closing } = item;
  const pay = payLabel(vacancy.pay, vacancy.hours, payBasis);
  const closed = closing.kind === "closed";
  const urgent = closing.kind === "today" || closing.kind === "soon";

  const siblings = itemsForEmployer(employer.id).filter(
    (other) => other.vacancy.id !== vacancy.id && !other.listing.closed,
  );
  const similar = boardItems
    .filter(
      (other) =>
        other.vacancy.id !== vacancy.id &&
        !other.listing.closed &&
        other.vacancy.sector === vacancy.sector,
    )
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm">
        <Link href="/" className="focus-ring text-accent hover:underline">
          ← All vacancies
        </Link>
      </nav>

      {closed && (
        <div className="mb-6 rounded-card border border-line-strong bg-sunk p-4">
          <p className="font-semibold text-ink">
            This vacancy closed on {longDate(vacancy.closes, ZONE)}.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            The page stays up because people share these links, and a
            dead one tells you nothing about what happened.{" "}
            {siblings.length > 0 ? (
              <>
                {employer.name} has {siblings.length} other{" "}
                {siblings.length === 1 ? "vacancy" : "vacancies"} open —{" "}
                <Link
                  href={`/employers/${employer.slug}`}
                  className="focus-ring text-accent underline"
                >
                  see them
                </Link>
                .
              </>
            ) : (
              <>
                {employer.name} has nothing else open at the moment.{" "}
                <Link href="/alerts" className="focus-ring text-accent underline">
                  An alert
                </Link>{" "}
                will catch the next one.
              </>
            )}
          </p>
        </div>
      )}

      <header>
        <div className="flex flex-wrap items-center gap-2">
          {vacancy.featured && !closed && <Flag tone="featured">Featured</Flag>}
          {item.fresh && <Flag tone="new">New</Flag>}
          <span className="label text-ink-subtle">{vacancy.sector}</span>
        </div>

        <h1 className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          {vacancy.title}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <Monogram name={employer.name} />
          <div>
            <Link
              href={`/employers/${employer.slug}`}
              className="focus-ring font-semibold text-ink hover:text-accent hover:underline"
            >
              {employer.name}
            </Link>
            <p className="text-sm text-ink-subtle">
              {employer.kind} · {vacancy.place}
            </p>
          </div>
        </div>
      </header>

      {/* The docket. Everything a reader wants before they decide
          whether to read the advert at all, in one block, in the same
          order on every listing. */}
      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
        <Cell term="Salary">
          <span className="tabular font-semibold text-ink">{pay.headline}</span>
          {pay.note && (
            <span className="mt-1 block text-xs leading-snug text-ink-subtle">
              {pay.note}
            </span>
          )}
        </Cell>
        <Cell term="Hours">{hoursLabel(vacancy.hours)}</Cell>
        <Cell term="Contract">
          {vacancy.contract}
          {vacancy.term ? `, ${vacancy.term}` : ""}
        </Cell>
        <Cell term="Where">{vacancy.pattern}</Cell>
        <Cell term="Closing date">
          <span className="tabular block text-ink">
            {longDate(vacancy.closes, ZONE)}
          </span>
          <ClosingStamp
            className="mt-1 block"
            text={closingLabel(closing, vacancy.closes, ZONE)}
            tone={closed ? "closed" : urgent ? "urgent" : "quiet"}
          />
        </Cell>
        <Cell term="Reference">
          <span className="tabular">{vacancy.reference}</span>
          <span className="mt-1 block text-xs text-ink-subtle">
            {postedLabel(vacancy.posted, nowMs, ZONE)}
          </span>
        </Cell>
        {vacancy.interviews && (
          <Cell term="Interviews" wide>
            {vacancy.interviews}
          </Cell>
        )}
      </dl>

      {!closed && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#apply"
            className="focus-ring rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-accent-hover"
          >
            How to apply
          </a>
          <p className="text-xs text-ink-subtle">
            Applications go to {employer.name}, not to us. We do not take
            CVs and we do not pass anything on.
          </p>
        </div>
      )}

      <div className="mt-10 space-y-8">
        <p className="prose-wrap text-lg leading-relaxed text-ink">
          {vacancy.summary}
        </p>

        {vacancy.sections.map((section) => (
          <section
            key={section.heading}
            id={
              section.heading.toLowerCase().startsWith("how to apply")
                ? "apply"
                : undefined
            }
            className="scroll-mt-6"
          >
            <RuleLabel>{section.heading}</RuleLabel>
            {section.body?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="prose-wrap mt-4 leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
            {section.points && (
              <ul className="mt-4 space-y-2">
                {section.points.map((point) => (
                  <li
                    key={point.slice(0, 40)}
                    className="prose-wrap flex gap-3 leading-relaxed text-ink-muted"
                  >
                    <span aria-hidden="true" className="mt-2 h-1 w-3 shrink-0 bg-line-strong" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="mt-12 rounded-card border border-line bg-surface p-5">
        <RuleLabel>About {employer.name}</RuleLabel>
        <p className="prose-wrap mt-4 leading-relaxed text-ink-muted">
          {employer.about}
        </p>
        <p className="mt-4 text-sm">
          <Link
            href={`/employers/${employer.slug}`}
            className="focus-ring text-accent underline hover:text-accent-hover"
          >
            {siblings.length > 0
              ? `${siblings.length} other ${siblings.length === 1 ? "vacancy" : "vacancies"} at ${employer.name}`
              : `More about ${employer.name}`}
          </Link>
        </p>
      </section>

      {similar.length > 0 && (
        <section className="mt-12">
          <RuleLabel>Also in {vacancy.sector.toLowerCase()}</RuleLabel>
          <div className="mt-4 space-y-3">
            {similar.map((other) => (
              <VacancyCard
                key={other.vacancy.id}
                data={toCardData(other, payBasis)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Cell({
  term,
  children,
  wide,
}: {
  term: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`bg-surface px-4 py-3 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="label text-ink-subtle">{term}</dt>
      <dd className="mt-1.5 text-sm text-ink-muted">{children}</dd>
    </div>
  );
}
