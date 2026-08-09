import Link from "next/link";
import { FilterPanel } from "@/components/filter-panel";
import { RuleLabel } from "@/components/chips";
import { toCardData, VacancyCard } from "@/components/vacancy-card";
import { payBasis, sortOptions } from "@/content/site";
import {
  boardItems,
  featuredItems,
  hrefSet,
  openItems,
  parseFilters,
  parseSort,
  selectItems,
  toSearchParams,
  type RawParams,
} from "@/lib/board";
import { activeFilterCount, isUnfiltered } from "@/lib/filters";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const search = toSearchParams(await searchParams);
  const filters = parseFilters(search);
  const mode = parseSort(search);
  const items = selectItems(filters, mode);
  const narrowed = activeFilterCount(filters) > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2 border-b border-line-strong pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            Current vacancies
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {openItems.length} open, {boardItems.length - openItems.length}{" "}
            recently closed. Every one checked by hand, and every one with a
            salary on it — bar{" "}
            <Link href="/about#policy" className="focus-ring underline">
              two we are chasing
            </Link>
            .
          </p>
        </div>
        <p className="tabular shrink-0 text-sm text-ink-subtle">
          {narrowed
            ? `${items.length} of ${boardItems.length} shown`
            : `${items.length} shown`}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* Two copies of the same panel: a disclosure on a phone, an
            always-open column on a wide screen. Duplicated markup buys
            a filter panel that needs no JavaScript to open. */}
        <details className="rounded-card border border-line bg-surface p-4 lg:hidden">
          <summary className="focus-ring label cursor-pointer list-none text-ink">
            Filter and search
            {narrowed ? ` · ${activeFilterCount(filters)} active` : ""}
          </summary>
          <div className="mt-5">
            <FilterPanel search={search} idPrefix="mobile" />
          </div>
        </details>

        <aside className="hidden w-60 shrink-0 lg:block">
          <FilterPanel search={search} idPrefix="desktop" />
        </aside>

        <div className="min-w-0 flex-1">
          {isUnfiltered(filters) && mode === "closing" && (
            <section className="mb-8">
              <RuleLabel>Featured</RuleLabel>
              <p className="mt-2 mb-4 text-xs text-ink-subtle">
                Paid promotions. They are listed again below, in their
                proper place — a promotion buys attention here, not a
                better position in the board.
              </p>
              <div className="space-y-3">
                {featuredItems.map((item) => (
                  <VacancyCard
                    key={`featured-${item.vacancy.id}`}
                    data={toCardData(item, payBasis)}
                  />
                ))}
              </div>
            </section>
          )}

          <RuleLabel>Order</RuleLabel>
          <div className="mt-4 mb-5 flex flex-wrap gap-2">
            {sortOptions.map((option) => {
              const on = mode === option.id;
              return (
                <Link
                  key={option.id}
                  href={hrefSet(search, "sort", option.id)}
                  aria-current={on ? "true" : undefined}
                  className={`focus-ring rounded-sm border px-2.5 py-1.5 text-xs transition-colors ${
                    on
                      ? "border-band bg-band text-ink-inverse"
                      : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          {items.length === 0 ? (
            <EmptyBoard />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <VacancyCard
                  key={item.vacancy.id}
                  data={toCardData(item, payBasis)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyBoard() {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface p-8 text-center">
      <p className="font-serif text-xl font-semibold">Nothing matches that</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        There are twenty-two vacancies on the board and none of them fit
        every one of those filters at once. Widen one of them, or set up
        an alert and we will tell you when something does.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="focus-ring rounded-sm bg-accent px-3 py-2 text-sm font-semibold text-on-accent hover:bg-accent-hover"
        >
          Clear the filters
        </Link>
        <Link
          href="/alerts"
          className="focus-ring rounded-sm border border-line px-3 py-2 text-sm font-semibold text-ink hover:border-line-strong"
        >
          Set up an alert
        </Link>
      </div>
    </div>
  );
}
