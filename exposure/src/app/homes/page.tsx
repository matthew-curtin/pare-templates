import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Band } from "@/components/shell";
import { Dial } from "@/components/dial";
import { Strip, StripKey } from "@/components/strip";
import { homes } from "@/content/homes";
import { states } from "@/content/site";
import { dayFacts, mainRoomView, toView, type HomeView } from "@/lib/view";
import { daysAgo, hoursShort, money, percent, sqft } from "@/lib/format";

export const metadata: Metadata = {
  title: "Homes",
  description:
    "Six homes in Halstead, each with the hours of direct sun in every room on the longest day of the year, an ordinary one, and the shortest.",
};

const SORTS = {
  winter: {
    label: "December sun",
    note: "Hours of direct sun on 21 December, averaged over the floor area.",
    of: (v: HomeView) => -v.winterHours,
  },
  summer: {
    label: "June sun",
    note: "The same figure on the longest day, which reorders the list.",
    of: (v: HomeView) => -v.summerHours,
  },
  price: {
    label: "Price",
    note: "Least expensive first. It is not the same order as the light.",
    of: (v: HomeView) => v.price,
  },
  size: {
    label: "Size",
    note: "Largest first, which is the order most boards would put them in.",
    of: (v: HomeView) => -v.area,
  },
} as const;

type SortKey = keyof typeof SORTS;

export default async function HomesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const key: SortKey = sort && sort in SORTS ? (sort as SortKey) : "winter";
  const views = homes.map(toView).sort((a, b) => SORTS[key].of(a) - SORTS[key].of(b));
  const dec = dayFacts("dec");

  const pane = (
    <div>
      <p className="datum text-[0.6875rem] uppercase text-ink-subtle">Sort by</p>
      <ul className="mt-3 space-y-1.5">
        {(Object.keys(SORTS) as SortKey[]).map((k) => (
          <li key={k}>
            <Link
              href={k === "winter" ? "/homes" : `/homes?sort=${k}`}
              aria-current={k === key ? "true" : undefined}
              className={`focus-ring datum block px-3 py-2 text-[0.8125rem] transition-colors ${
                k === key
                  ? "bg-ink text-canvas"
                  : "border border-line bg-surface text-ink-muted hover:border-line-strong"
              }`}
            >
              {SORTS[k].label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
        {SORTS[key].note}
      </p>

      <div className="mx-auto mt-7 w-32">
        <Dial arc={dec.arc} label="21 December" />
      </div>

      <div className="mt-7 border-t border-line pt-5">
        <StripKey states={states} />
      </div>
    </div>
  );

  return (
    <Shell pane={pane}>
      <Band>
        <h1 className="head head-display max-w-[14ch] text-display">
          Six homes, and what the light in them is actually doing
        </h1>
        <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
          Each row shows the principal room&rsquo;s day on 21 December,
          drawn on the same four-to-ten scale as every other strip on this
          site. The number on the right is the one this list is sorted by
          — because a board that displays one figure and orders by another
          looks broken even when it is right.
        </p>
      </Band>

      <div className="divide-y divide-line">
        {views.map((v) => {
          const main = mainRoomView(v);
          return (
            <article key={v.slug} className="px-4 py-8 sm:px-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <h2 className="head head-small text-[1.5rem]">
                  <Link
                    href={`/homes/${v.slug}`}
                    className="focus-ring transition-colors hover:text-sun"
                  >
                    {v.address}
                  </Link>
                </h2>
                <p className="figure text-[1.25rem] text-ink-muted">
                  {money(v.price)}
                </p>
              </div>
              <p className="datum mt-1.5 text-[0.75rem] uppercase text-ink-subtle">
                {v.kind} · {sqft(v.area)} · listed {daysAgo(v.listedDaysAgo)}
              </p>
              <p className="prose-block mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {v.blurb}
              </p>

              <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="min-w-0">
                  <p className="datum text-[0.6875rem] uppercase text-ink-subtle">
                    {main.name} · {main.compass} · 21 December
                  </p>
                  <div className="mt-2">
                    <Strip segments={main.seasons.dec.segments} ticks />
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="figure text-[1.75rem] leading-none text-sun">
                    {hoursShort(v.winterHours)}
                  </div>
                  <div className="datum mt-1.5 text-[0.6875rem] uppercase text-ink-subtle">
                    December sun, whole house
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[0.8125rem] text-ink-subtle">
                {v.darkRoomCount === 0
                  ? `Every one of the ${v.habitableCount} rooms takes some direct sun on the shortest day.`
                  : `${v.darkRoomCount} of ${v.habitableCount} rooms take none at all on the shortest day.`}{" "}
                Glass in the principal room: {percent(main.glazingRatio)} of
                its floor.
              </p>
            </article>
          );
        })}
      </div>
    </Shell>
  );
}
