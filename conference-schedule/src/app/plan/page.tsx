"use client";

import Link from "next/link";
import { usePlan } from "@/lib/plan-store";
import { days, rooms, ZONE } from "@/content/site";
import { sessions } from "@/content/sessions";
import { speakers } from "@/content/speakers";
import { clashingIds, planByDay, planMinutes } from "@/lib/schedule";
import { durationLabel, longDate, rangeLabel, toMinutes } from "@/lib/time";

const speakerById = new Map(speakers.map((s) => [s.id, s]));
const dayNumbers = days.map((d) => d.n);

/**
 * Your plan, with the collisions called out.
 *
 * The clash treatment is deliberately in two places at once: on the row,
 * where the conflict is, and on the day heading, where you will actually
 * be looking. The second one is pure CSS — `:has([data-clash="true"])`
 * on the day — because "does this subtree contain a problem" is a
 * question about a subtree, and answering it by threading a boolean up
 * through three components is the version that goes stale.
 */
export default function PlanPage() {
  const { ids, ready, clear, reseed, toggle } = usePlan();

  const grouped = planByDay(ids, sessions, dayNumbers);
  const clashes = clashingIds(sessions.filter((s) => ids.includes(s.id)));
  const total = grouped.reduce((sum, g) => sum + planMinutes(g.sessions), 0);

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <h1 className="sign text-display">Your plan</h1>
          <p className="prose-block mt-4 text-lede leading-snug text-ink-muted">
            Kept in this browser and nowhere else. Nothing is sent
            anywhere, and clearing it is genuinely gone.
          </p>
        </div>
        {ready && ids.length > 0 ? (
          <dl className="flex gap-8">
            <Stat label="Sessions" value={String(grouped.reduce((n, g) => n + g.sessions.length, 0))} />
            <Stat label="Programme" value={durationLabel(total)} />
            <Stat
              label="Clashes"
              value={String(clashes.size === 0 ? 0 : clashes.size)}
              alarm={clashes.size > 0}
            />
          </dl>
        ) : null}
      </header>

      {!ready ? (
        <p className="mt-12 text-ink-subtle">Reading your plan…</p>
      ) : grouped.length === 0 ? (
        <div className="mt-12 border border-ink bg-surface px-6 py-16 text-center">
          <p className="sign text-[2rem]">Nothing in it</p>
          <p className="prose-block mx-auto mt-4 text-[1rem] leading-relaxed text-ink-muted">
            Add sessions from the wallchart or from any session page.
            Everything is stored in this browser, so it will still be
            here tomorrow and it will not follow you to another machine.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/schedule"
              className="focus-ring wide bg-ink px-4 py-2.5 text-[0.9375rem] font-semibold text-ink-inverse transition-colors hover:bg-ink/85"
            >
              Open the schedule
            </Link>
            <button
              type="button"
              onClick={reseed}
              className="focus-ring wide border border-ink px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors hover:bg-live"
            >
              Fill it with an example
            </button>
          </div>
        </div>
      ) : (
        <>
          {clashes.size > 0 ? (
            <p className="mt-10 border-l-4 border-clash bg-clash-soft px-4 py-3 text-[0.9375rem] leading-relaxed">
              <strong className="font-semibold">
                You are in two places at once.
              </strong>{" "}
              {clashes.size} of your sessions overlap. They are kept in
              the list rather than removed — deciding which one to drop
              is the whole point, and a plan that silently refused the
              second would just be hiding the choice.
            </p>
          ) : null}

          <div className="mt-10 space-y-12">
            {grouped.map((group) => {
              const day = days.find((d) => d.n === group.day);
              return (
                <section key={group.day} className="plan-day">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h2 className="plan-day-heading sign text-[1.75rem]">
                      {day ? longDate(day.date, ZONE) : `Day ${group.day}`}
                    </h2>
                    <p className="narrow tabular text-[0.875rem] text-ink-subtle">
                      {group.sessions.length}{" "}
                      {group.sessions.length === 1 ? "session" : "sessions"} ·{" "}
                      {durationLabel(planMinutes(group.sessions))}
                    </p>
                  </div>
                  <span className="plan-day-rule mt-2 block h-0.5 w-full bg-ink" />

                  <ul className="mt-5 space-y-3">
                    {group.sessions.map((s) => {
                      const room = rooms.find((r) => r.id === s.roomId);
                      const clash = clashes.has(s.id);
                      return (
                        <li
                          key={s.id}
                          data-clash={clash ? "true" : "false"}
                          className={`plan-row flex flex-wrap items-start gap-x-5 gap-y-3 border px-4 py-3 ${
                            clash
                              ? "border-clash bg-clash-soft"
                              : "border-line-strong bg-surface"
                          }`}
                        >
                          <p className="narrow tabular w-28 shrink-0 text-[0.875rem] text-ink-muted">
                            {rangeLabel(
                              toMinutes(s.start),
                              toMinutes(s.end),
                            )}
                          </p>
                          <div className="min-w-0 flex-1">
                            <h3 className="wide text-[1.0625rem] font-semibold leading-tight">
                              <Link
                                href={`/sessions/${s.slug}`}
                                className="focus-ring hover:underline"
                              >
                                {s.title}
                              </Link>
                            </h3>
                            <p className="narrow mt-0.5 text-[0.875rem] text-ink-muted">
                              {room?.name ?? "All rooms"}
                              {s.speakerIds.length > 0
                                ? ` · ${s.speakerIds
                                    .map((id) => speakerById.get(id)?.name)
                                    .filter(Boolean)
                                    .join(", ")}`
                                : ""}
                            </p>
                            {clash ? (
                              <p className="narrow mt-1.5 text-[0.8125rem] font-semibold text-clash">
                                Overlaps something else in this plan.
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggle(s.id)}
                            className="focus-ring narrow shrink-0 border border-line-strong px-2.5 py-1 text-[0.8125rem] text-ink-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="mt-14 flex flex-wrap gap-3 border-t border-line pt-6">
            <Link
              href="/schedule"
              className="focus-ring wide border border-ink px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors hover:bg-live"
            >
              Add more
            </Link>
            <button
              type="button"
              onClick={clear}
              className="focus-ring narrow px-4 py-2.5 text-[0.9375rem] text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              Clear the plan
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  alarm = false,
}: {
  label: string;
  value: string;
  alarm?: boolean;
}) {
  return (
    <div>
      <dt className="narrow text-[0.75rem] uppercase tracking-wide text-ink-subtle">
        {label}
      </dt>
      <dd
        className={`sign tabular text-[1.75rem] ${alarm ? "text-clash" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
