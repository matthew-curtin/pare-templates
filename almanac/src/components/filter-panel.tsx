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
    <div className="space-y-6">
      <form action="/" className="space-y-2">
        {/* Everything except q rides along, so searching does not throw
            away the filters you already set. */}
        {[...search.entries()]
          .filter(([key]) => key !== "q")
          .map(([key, value], index) => (
            <input key={`${key}-${index}`} type="hidden" name={key} value={value} />
          ))}
        <label
          htmlFor={`${idPrefix}-q`}
          className="label block text-ink-subtle"
        >
          Search
        </label>
        <div className="flex gap-2">
          <input
            id={`${idPrefix}-q`}
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="ranger, housing, Halden…"
            className="focus-ring min-w-0 flex-1 rounded-sm border border-field bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle"
          />
          <button
            type="submit"
            className="focus-ring rounded-sm bg-accent px-3 py-2 text-sm font-semibold text-on-accent hover:bg-accent-hover"
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
        heading="Contract"
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
          Measured against the top of the advertised band and against
          actual pay, not the full-time figure. Vacancies with no salary
          on them are excluded — see{" "}
          <Link href="/about#questions" className="focus-ring underline">
            why
          </Link>
          .
        </p>
      </div>

      <div className="space-y-3">
        <RuleLabel>Closed vacancies</RuleLabel>
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
            className="focus-ring text-sm text-accent underline hover:text-accent-hover"
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
      className={`focus-ring inline-flex items-center rounded-sm border px-2.5 py-1.5 text-xs transition-colors ${
        active
          ? "border-accent bg-accent text-on-accent"
          : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
