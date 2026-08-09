import type { Metadata } from "next";
import Link from "next/link";
import { DayDeck, type DayTab } from "@/components/day-deck";
import { ScheduleGrid } from "@/components/schedule-grid";
import { days, now, rooms, topics, ZONE } from "@/content/site";
import { sessions } from "@/content/sessions";
import { isChoosable, isPlenary } from "@/lib/schedule";
import { minutesIntoDay, shortDate } from "@/lib/time";
import {
  activeFilterCount,
  hrefCleared,
  hrefForDay,
  hrefForRoom,
  hrefForTopic,
  parseFilters,
  toSearchParams,
  type RawParams,
} from "@/lib/params";

export const metadata: Metadata = {
  title: "Schedule",
  description:
    "Three days, four rooms, drawn to scale so you can see what runs against what.",
};

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const params = toSearchParams(await searchParams);
  const filters = parseFilters(params);
  const visibleRooms = rooms.filter((r) => filters.roomIds.includes(r.id));
  const active = activeFilterCount(filters);

  // Breaks and plenaries survive every filter. Narrowing to "Software"
  // and losing lunch would leave a ninety-minute hole in the middle of
  // the day that looks like missing data rather than like a filter.
  const shown = sessions.filter(
    (s) =>
      !isChoosable(s) ||
      isPlenary(s) ||
      filters.topic === null ||
      s.topics.includes(filters.topic),
  );

  const tabs: DayTab[] = days.map((d) => ({
    n: d.n,
    label: d.label,
    strand: d.strand,
    dateLabel: shortDate(d.date, ZONE),
    href: hrefForDay(params, d.n),
  }));

  const panels = days.map((d) => (
    <ScheduleGrid
      key={d.n}
      day={d}
      sessions={shown}
      visibleRooms={visibleRooms}
      nowMins={minutesIntoDay(now, ZONE, d.date)}
    />
  ));

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h1 className="sign text-display">The whole thing</h1>
          <p className="prose-block mt-3 text-[1rem] leading-relaxed text-ink-muted">
            Drawn to scale, so a ninety-minute workshop is three times the
            height of a thirty-minute one and you can see what it runs
            against. The clock is pinned to Thursday morning.
          </p>
        </div>
        <p className="narrow tabular text-[0.8125rem] text-ink-subtle">
          Times are Eastern. {sessions.filter(isChoosable).length} sessions
          across four rooms.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-3">
        <FilterGroup label="Rooms">
          {rooms.map((room) => {
            const on = filters.roomIds.includes(room.id);
            return (
              <Link
                key={room.id}
                href={hrefForRoom(params, filters, room.id)}
                aria-pressed={on}
                className={`focus-ring narrow inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.8125rem] transition-colors ${
                  on
                    ? "border-ink bg-surface text-ink"
                    : "border-line-strong text-ink-subtle hover:text-ink"
                }`}
              >
                <span
                  className="h-2.5 w-2.5"
                  style={{ background: on ? room.tone : "transparent", outline: `1px solid ${room.tone}` }}
                  aria-hidden="true"
                />
                {room.name}
              </Link>
            );
          })}
        </FilterGroup>

        <FilterGroup label="Topic">
          <Link
            href={hrefForTopic(params, null)}
            aria-pressed={filters.topic === null}
            className={`focus-ring narrow border px-2.5 py-1 text-[0.8125rem] transition-colors ${
              filters.topic === null
                ? "border-ink bg-ink text-ink-inverse"
                : "border-line-strong text-ink-subtle hover:text-ink"
            }`}
          >
            Everything
          </Link>
          {topics.map((topic) => {
            const on = filters.topic === topic;
            return (
              <Link
                key={topic}
                href={hrefForTopic(params, on ? null : topic)}
                aria-pressed={on}
                className={`focus-ring narrow border px-2.5 py-1 text-[0.8125rem] transition-colors ${
                  on
                    ? "border-ink bg-ink text-ink-inverse"
                    : "border-line-strong text-ink-subtle hover:text-ink"
                }`}
              >
                {topic}
              </Link>
            );
          })}
        </FilterGroup>

        {active > 0 ? (
          <Link
            href={hrefCleared(params)}
            className="focus-ring narrow ml-auto text-[0.8125rem] text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Clear {active === 1 ? "the filter" : "both filters"}
          </Link>
        ) : null}
      </div>

      <div className="mt-8">
        <DayDeck initialDay={filters.day} tabs={tabs} panels={panels} />
      </div>

      <p className="prose-block mt-10 text-[0.875rem] leading-relaxed text-ink-subtle">
        Nothing here is real. If it were, the honest advice would be to
        pick one thing per slot and accept the rest — three days at four
        tracks is thirty-odd hours of programme and about nine hours of
        it that any one person can attend.
      </p>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="narrow text-[0.75rem] uppercase text-ink-subtle">
        {label}
      </span>
      {children}
    </div>
  );
}
