"use client";

import { useState } from "react";
import Link from "next/link";
import type { HomeView } from "@/lib/view";
import type { SeasonKey } from "@/content/site";
import { states } from "@/content/site";
import { Shell, Band } from "./shell";
import { Dial } from "./dial";
import { Strip, StripKey } from "./strip";
import { SeasonSwitch } from "./season-switch";
import { clock, hoursShort, money, percent, sqft } from "@/lib/format";

type DayFacts = {
  sunrise: number;
  sunset: number;
  hours: number;
  noon: number;
  arc: { from: number; to: number };
};

/**
 * Two houses on one ruler.
 *
 * The comparison is room-by-room rather than headline-by-headline,
 * because the headline is an average and averages are exactly what this
 * site exists to look past. Rooms are listed in the order they appear in
 * each plan, so the two columns are two houses rather than a merged
 * table pretending they have the same rooms.
 */
export function Comparer({
  views,
  facts,
  initial,
}: {
  views: HomeView[];
  facts: Record<SeasonKey, DayFacts>;
  initial: [string, string];
}) {
  const [season, setSeason] = useState<SeasonKey>("dec");
  const [left, setLeft] = useState(initial[0]);
  const [right, setRight] = useState(initial[1]);

  const a = views.find((v) => v.slug === left) ?? views[0];
  const b = views.find((v) => v.slug === right) ?? views[1];
  const day = facts[season];

  const pane = (
    <div style={{ viewTransitionName: "season" }}>
      <SeasonSwitch value={season} onChange={setSeason} />
      <div className="mx-auto mt-6 w-36">
        <Dial arc={day.arc} />
      </div>
      <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-muted">
        Sun up {clock(day.sunrise)}, down {clock(day.sunset)}. Both houses
        below are drawn against that same day, and every strip runs from
        four in the morning to ten at night whatever the season — which is
        the only way two months can be compared by eye.
      </p>
      <div className="mt-6 border-t border-line pt-5">
        <StripKey states={states} />
      </div>
    </div>
  );

  return (
    <Shell pane={pane}>
      <Band>
        <h1 className="head head-display max-w-[15ch] text-display">
          Put two of them side by side
        </h1>
        <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
          Room by room rather than average by average. The averages are on
          the homes page and they are useful, but a house is not an
          average — it is a small number of rooms you are in for hours at
          a time and a larger number you walk through.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {(
            [
              ["Left", left, setLeft],
              ["Right", right, setRight],
            ] as const
          ).map(([label, value, set]) => (
            <label key={label} className="block">
              <span className="datum block text-[0.6875rem] uppercase text-ink-subtle">
                {label}
              </span>
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className="focus-ring mt-2 w-full border border-line-strong bg-surface px-3 py-2.5 text-[0.9375rem]"
              >
                {views.map((v) => (
                  <option key={v.slug} value={v.slug}>
                    {v.address}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </Band>

      <div className="grid gap-px bg-line lg:grid-cols-2">
        {[a, b].map((v, i) => (
          <section key={`${v.slug}-${i}`} className="bg-canvas px-4 py-8 sm:px-6">
            <h2 className="head head-small text-[1.375rem]">
              <Link
                href={`/homes/${v.slug}`}
                className="focus-ring transition-colors hover:text-sun"
              >
                {v.address}
              </Link>
            </h2>
            <p className="datum mt-1.5 text-[0.75rem] uppercase text-ink-subtle">
              {money(v.price)} · {sqft(v.area)} · {v.beds} beds
            </p>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <div>
                <div className="figure text-[1.5rem] leading-none text-sun">
                  {hoursShort(season === "dec" ? v.winterHours : v.summerHours)}
                </div>
                <div className="datum mt-1.5 text-[0.6875rem] uppercase text-ink-subtle">
                  whole house
                </div>
              </div>
              <div>
                <div className="figure text-[1.5rem] leading-none">
                  {v.darkRoomCount}/{v.habitableCount}
                </div>
                <div className="datum mt-1.5 text-[0.6875rem] uppercase text-ink-subtle">
                  rooms dark, 21 Dec
                </div>
              </div>
            </div>

            <ul className="mt-7 space-y-5">
              {v.floors
                .flatMap((f) => f.rooms)
                .filter((r) => !r.interior)
                .map((r) => (
                  <li key={r.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="text-[0.9375rem]">{r.name}</span>
                      <span className="datum text-[0.75rem] text-ink-subtle">
                        {r.compass} · {percent(r.glazingRatio)} glass ·{" "}
                        {hoursShort(r.seasons[season].hours)}
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Strip segments={r.seasons[season].segments} height="0.875rem" />
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </Shell>
  );
}
