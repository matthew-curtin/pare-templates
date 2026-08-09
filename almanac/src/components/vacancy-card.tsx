import Link from "next/link";
import { ZONE } from "@/content/site";
import type { BoardItem } from "@/lib/board";
import { closingLabel } from "@/lib/dates";
import { hoursLabel, payLabel } from "@/lib/pay";
import { Chip, ClosingStamp, Flag } from "./chips";
import { Monogram } from "./wordmark";

/**
 * Everything the card draws, as plain values.
 *
 * The card takes this rather than a vacancy so that the "post a job"
 * page can preview a listing that does not exist yet, using exactly the
 * component the board uses. A preview drawn by a second, similar
 * component is a preview that is subtly wrong.
 */
export interface CardData {
  slug?: string;
  title: string;
  employerName: string;
  employerKind: string;
  employerSlug?: string;
  place: string;
  summary: string;
  chips: string[];
  payHeadline: string;
  payNote?: string;
  closingText: string;
  closingTone: "urgent" | "quiet" | "closed";
  featured: boolean;
  fresh: boolean;
  closed: boolean;
}

export function toCardData(
  item: BoardItem,
  basis: Parameters<typeof payLabel>[2],
): CardData {
  const { vacancy, employer, closing } = item;
  const pay = payLabel(vacancy.pay, vacancy.hours, basis);
  return {
    slug: vacancy.slug,
    title: vacancy.title,
    employerName: employer.name,
    employerKind: employer.kind,
    employerSlug: employer.slug,
    place: vacancy.place,
    summary: vacancy.summary,
    chips: [
      vacancy.contract + (vacancy.term ? `, ${vacancy.term}` : ""),
      vacancy.pattern,
      hoursLabel(vacancy.hours),
    ],
    payHeadline: pay.headline,
    payNote: pay.note,
    closingText: closingLabel(closing, vacancy.closes, ZONE),
    closingTone:
      closing.kind === "closed"
        ? "closed"
        : closing.kind === "today" || closing.kind === "soon"
          ? "urgent"
          : "quiet",
    featured: vacancy.featured === true,
    fresh: item.fresh,
    closed: closing.kind === "closed",
  };
}

/**
 * A card, not a boxed row.
 *
 * There is no border at rest. The card is white, the page is warm grey,
 * and a soft shadow does the separating — which means a list of twenty
 * of these has twenty edges fewer than the drawn-box version and reads
 * as considerably calmer at the same density. The closed variant is the
 * one place a border comes back, because a listing that is no longer
 * live should not have the same presence as one that is.
 */
export function VacancyCard({ data }: { data: CardData }) {
  const frame = data.closed
    ? "border border-dashed border-line-strong bg-transparent"
    : data.featured
      ? "bg-surface shadow-card ring-1 ring-primary/10 hover:shadow-lift"
      : "bg-surface shadow-card hover:shadow-lift";

  return (
    <article
      className={`rounded-card p-5 transition-shadow duration-200 sm:p-6 ${frame}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Monogram name={data.employerName} />

        <div className="min-w-0 flex-1">
          {(data.featured || data.fresh || data.closed) && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {data.featured && !data.closed && (
                <Flag tone="featured">Featured</Flag>
              )}
              {data.fresh && <Flag tone="new">New</Flag>}
              {data.closed && <Flag tone="closed">Closed</Flag>}
            </div>
          )}

          <h3 className="text-lg leading-snug font-bold tracking-tight text-balance">
            {data.slug ? (
              <Link
                href={`/jobs/${data.slug}`}
                className="focus-ring text-ink transition-colors hover:text-accent"
              >
                {data.title}
              </Link>
            ) : (
              <span className="text-ink">{data.title}</span>
            )}
          </h3>

          <p className="mt-1.5 text-sm text-ink-muted">
            {data.employerSlug ? (
              <Link
                href={`/employers/${data.employerSlug}`}
                className="focus-ring font-medium transition-colors hover:text-accent"
              >
                {data.employerName}
              </Link>
            ) : (
              <span className="font-medium">{data.employerName}</span>
            )}
            <span className="text-ink-subtle"> · {data.place}</span>
          </p>

          <p className="prose-wrap mt-3 text-sm leading-relaxed text-ink-muted">
            {data.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {data.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
        </div>

        {/* On a phone this sits under the summary and reads left to
            right; from sm up it becomes the right-hand column where the
            eye scans for money and dates. */}
        <div className="shrink-0 border-t border-line pt-4 sm:w-48 sm:border-t-0 sm:pt-0 sm:pl-2 sm:text-right">
          <p className="tabular text-base font-bold tracking-tight text-ink">
            {data.payHeadline}
          </p>
          {data.payNote && (
            <p className="mt-1 text-xs leading-snug text-ink-subtle">
              {data.payNote}
            </p>
          )}
          <p className="mt-2.5">
            <ClosingStamp text={data.closingText} tone={data.closingTone} />
          </p>
        </div>
      </div>
    </article>
  );
}
