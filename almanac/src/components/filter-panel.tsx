import Link from "next/link";
import { contracts, patterns, salaryFloors, sectors } from "@/content/site";
import { hrefSet, hrefToggle, parseFilters } from "@/lib/board";
import { activeFilterCount } from "@/lib/filters";
import { formatMoney } from "@/lib/pay";
import { RuleLabel } from "./chips";

/**
 * Filters are LINKS, not a JavaScript widget.
 *
 * Every narrowing is a URL, which means the back button steps back
 * through them, a refresh keeps them, a filtered board can be pasted
 * into an email, and the whole thing works with scripting off — which
 * is not a niche concern for an audience that includes people applying
 * from a library computer.
 *
 * The cost is that each link has to rebuild the whole query string, and
 * that is what `hrefToggle` and `hrefSet` are for.
 */
export function FilterPanel({
  search,
  idPrefix,
}: {
  search: URLSearchParams;
  idPrefix: string;
}) {
  const filters = parseFilters(search);
  const active = activeFilterCount(filters);

  return (
    <div className="space-y-7">
      <form action="/" className="space-y-2">
        {/* Everything except q rides along, so searching does not throw
            away the filters you already set. */}
        {[...search.entries()]
          .filter(([key]) => key !== "q")
          .map(([key, value], index) => (
            <input
              key={`${key}-${index}`}
              type="hidden"
              name={key}
              value={value}
            />
          ))}
        <label htmlFor={`${idPrefix}-q`} className="sr-only">
          Search jobs
        </label>
        <div className="flex gap-2">
          <input
            id={`${idPrefix}-q`}
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Search jobs"
            className="focus-ring min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink shadow-card transition-colors placeholder:text-ink-subtle hover:border-field"
          />
          <button
            type="submit"
            className="focus-ring rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Go
          </button>
        </div>
      </form>

      <FilterGroup
        heading="Sector"
        options={sectors}
        selected={filters.sectors}
        hrefFor={(value) => hrefToggle(search, "sector", value)}
      />

      <FilterGroup
        heading="Type"
        options={contracts}
        selected={filters.contracts}
        hrefFor={(value) => hrefToggle(search, "contract", value)}
      />

      <FilterGroup
        heading="Where"
        options={patterns}
        selected={filters.patterns}
        hrefFor={(value) => hrefToggle(search, "pattern", value)}
      />

      <div className="space-y-3">
        <RuleLabel>Pays at least</RuleLabel>
        <div className="flex flex-wrap gap-2">
          {salaryFloors.map((floor) => {
            const on = filters.floor === floor;
            return (
              <Pill
                key={floor}
                href={hrefSet(search, "min", on ? null : String(floor))}
                active={on}
              >
                {formatMoney(floor)}
              </Pill>
            );
          })}
        </div>
        <p className="text-xs leading-relaxed text-ink-subtle">
          Measured against the top of the posted range, and against actual
          pay rather than the full-time figure. Jobs with no salary on
          them are excluded —{" "}
          <Link
            href="/about#questions"
            className="focus-ring text-accent underline underline-offset-2"
          >
            why
          </Link>
          .
        </p>
      </div>

      <div className="space-y-3">
        <RuleLabel>Closed jobs</RuleLabel>
        <Pill
          href={hrefSet(search, "closed", filters.includeClosed ? null : "1")}
          active={filters.includeClosed}
        >
          {filters.includeClosed ? "Showing closed" : "Include closed"}
        </Pill>
      </div>

      {active > 0 && (
        <p>
          <Link
            href="/"
            className="focus-ring text-sm font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
          >
            Clear {active} filter{active === 1 ? "" : "s"}
          </Link>
        </p>
      )}
    </div>
  );
}

function FilterGroup({
  heading,
  options,
  selected,
  hrefFor,
}: {
  heading: string;
  options: readonly string[];
  selected: readonly string[];
  hrefFor: (value: string) => string;
}) {
  return (
    <div className="space-y-3">
      <RuleLabel>{heading}</RuleLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Pill
            key={option}
            href={hrefFor(option)}
            active={selected.includes(option)}
          >
            {option}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function Pill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      className={`focus-ring inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-on-primary"
          : "bg-surface text-ink-muted shadow-card hover:bg-hover hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
