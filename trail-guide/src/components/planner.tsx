"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { LegCard } from "@/components/leg-card";
import { legs, shelters } from "@/content/route";
import { model } from "@/content/site";
import { splitInto } from "@/lib/route";
import { feet, hoursLabel, miles } from "@/lib/format";

const nameOf = new Map(shelters.map((s) => [s.id, s.name]));
const indexOf = new Map(legs.map((l, i) => [l.id, i]));

/** Twelve hours of walking, before stops. Add the twenty per cent
 *  everybody actually spends standing about and it is most of the
 *  daylight in August, which is what makes it the line worth drawing. */
const LONG_DAY = 12;

const LENGTHS = [6, 7, 8, 9, 10, 11];

/**
 * The itinerary, and the one place on the site where the model is
 * interactive rather than printed.
 *
 * Changing the number of days is a View Transition, and that is not
 * decoration: the whole point of dragging nine days down to seven is
 * watching WHICH days merge. An instant swap destroys exactly the
 * information the control exists to give you, which is §4c's test for
 * whether a piece of motion has earned its place.
 *
 * `flushSync` is load-bearing. `startViewTransition` snapshots the DOM
 * the moment its callback returns, and React would otherwise still be
 * scheduling the re-render — so the "after" snapshot would be identical
 * to the "before" one and the transition would run on nothing.
 */
export function Planner() {
  const [days, setDays] = useState(9);
  const plan = splitInto(legs, days, model);
  const longest = Math.max(...plan.map((d) => d.hours));

  function choose(n: number) {
    const swap = () => flushSync(() => setDays(n));
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(swap);
    } else {
      swap();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="datum text-[0.75rem] uppercase text-ink-subtle">
            Walk it in
          </p>
          <div className="mt-2 flex flex-wrap gap-px bg-line">
            {LENGTHS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => choose(n)}
                aria-pressed={n === days}
                className={`focus-ring datum px-4 py-2.5 text-[0.9375rem] transition-colors ${
                  n === days
                    ? "bg-water text-on-water"
                    : "bg-surface text-ink-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[0.8125rem] text-ink-subtle">days</p>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <p className="figure text-[1.75rem] leading-none">
              {hoursLabel(longest)}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-ink-subtle">longest day</p>
          </div>
          <div>
            <p className="figure text-[1.75rem] leading-none">
              {miles(plan.reduce((n, d) => n + d.distance, 0) / days)}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-ink-subtle">average day</p>
          </div>
          <div>
            <p
              className={`figure text-[1.75rem] leading-none ${
                plan.filter((d) => d.hours > LONG_DAY).length > 0
                  ? "text-warn"
                  : "text-water"
              }`}
            >
              {plan.filter((d) => d.hours > LONG_DAY).length}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-ink-subtle">
              days over {LONG_DAY} hours
            </p>
          </div>
        </div>
      </div>

      <ol
        className="mt-10 space-y-10"
        style={{ viewTransitionName: "itinerary" }}
      >
        {plan.map((day) => (
          <li key={day.n} className="day">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="day-heading head text-title">
                Day {day.n}
                <span className="ml-3 text-[0.9375rem] font-normal text-ink-subtle">
                  {nameOf.get(day.legs[0].from)} →{" "}
                  {nameOf.get(day.legs[day.legs.length - 1].to)}
                </span>
              </h2>
              <p className="datum text-[0.875rem] text-ink-muted">
                <span
                  className={`figure text-[1.125rem] ${
                    day.hours > LONG_DAY ? "text-warn" : "text-ink"
                  }`}
                >
                  {hoursLabel(day.hours)}
                </span>
                <span className="ml-3">
                  {miles(day.distance)} · {feet(day.ascent)} up
                </span>
              </p>
            </div>

            <div className="day-rule mt-3 h-px w-full bg-line-strong" />

            {day.hours > LONG_DAY ? (
              <p className="day-warning mt-4 border-l-2 border-warn bg-warn-soft px-3 py-2 text-[0.875rem] leading-relaxed text-ink">
                {hoursLabel(day.hours)} of walking before stops. In August
                that is most of the daylight, and it assumes nothing goes
                wrong.
              </p>
            ) : null}

            {day.dry ? (
              <p className="mt-4 text-[0.875rem] leading-relaxed text-warn">
                No water on part of this day. Fill before you start it.
              </p>
            ) : null}

            {/* One column when the day is one leg. A lone card sitting
                in the left half of a two-column grid reads as a missing
                second card rather than as a short day. */}
            <div
              className={`mt-5 grid gap-4 ${
                day.legs.length > 1 ? "lg:grid-cols-2" : ""
              }`}
            >
              {day.legs.map((leg) => (
                <LegCard key={leg.id} leg={leg} index={indexOf.get(leg.id) ?? 0} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
