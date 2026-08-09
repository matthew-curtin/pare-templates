import Link from "next/link";
import { FilterPanel } from "@/components/filter-panel";
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
  const active = activeFilterCount(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Every job here says what it pays.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          {openItems.length} open positions in city and county government,
          health, schools, housing, museums and nonprofits. Every one is
          read by a person before it goes up, and every one says what it
          pays.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        {/* Two copies of the same panel: a disclosure on a phone, an
            always-open column on a wide screen. Duplicated markup buys
            a filter panel that needs no JavaScript to open. */}
        <details className="rounded-card bg-surface p-5 shadow-card lg:hidden">
          <summary className="focus-ring cursor-pointer list-none text-sm font-semibold text-ink">
            Filter and search
            {active > 0 ? ` · ${active} active` : ""}
          </summary>
          <div className="mt-6">
            <FilterPanel search={search} idPrefix="mobile" />
          </div>
        </details>

        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterPanel search={search} idPrefix="desktop" />
        </aside>

        <div className="min-w-0 flex-1">
          {isUnfiltered(filters) && mode === "closing" && (
            <section className="mb-10">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-sm font-semibold tracking-tight">
                  Featured
                </h2>
                <p className="text-xs text-ink-subtle">
                  Paid promotions, listed again below in their proper place.
                </p>
              </div>
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

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="tabular text-sm text-ink-subtle">
              {active > 0
                ? `${items.length} of ${boardItems.length} jobs`
                : `${items.length} jobs`}
            </p>

            {/* A segmented control rather than three separate buttons —
                one object with a position in it, which is what a sort is. */}
            <div className="flex items-center gap-1 rounded-full bg-sunk p-1">
              {sortOptions.map((option) => {
                const on = mode === option.id;
                return (
                  <Link
                    key={option.id}
                    href={hrefSet(search, "sort", option.id)}
                    aria-current={on ? "true" : undefined}
                    className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      on
                        ? "bg-surface text-ink shadow-card"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
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
    <div className="rounded-card bg-surface px-8 py-14 text-center shadow-card">
      <p className="text-xl font-bold tracking-tight">Nothing matches that</p>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-muted">
        There are twenty-two jobs on the board and none of them fit every
        one of those filters at once. Widen one, or set up an alert and
        we will tell you when something does.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="focus-ring rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          Clear the filters
        </Link>
        <Link
          href="/alerts"
          className="focus-ring rounded-lg bg-sunk px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-line"
        >
          Set up an alert
        </Link>
      </div>
    </div>
  );
}
