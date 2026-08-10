import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HourHead } from "@/components/hour";
import { LogList } from "@/components/log";
import { Note, PageHead, Pill } from "@/components/bits";
import { Plate } from "@/components/plate";
import night from "@/photos/night-studio.jpg";
import { shots } from "@/content/site";
import { day } from "@/content/day";
import { showById } from "@/content/shows";
import {
  bands,
  breachAt,
  currentHour,
  flaggedKeys,
  modeOf,
  placed,
  stats,
} from "@/lib/station";
import { duration, hourLabel } from "@/lib/format";
import { withViewTransition } from "@/lib/view";

const FILTERS = [
  { id: "all", label: "Every hour" },
  { id: "missed", label: "Missed the junction" },
  { id: "flagged", label: "Broke a rule" },
];

const MODE_LABEL: Record<string, string> = {
  hosted: "Hosted",
  automated: "Automated",
  network: "Network",
};

/**
 * The whole broadcast day, and the argument that comes out of it.
 *
 * The band table at the top is not decoration and not a summary written
 * by hand: it is `bandStats` run over the same log the rows below show,
 * and it says the thing nobody expects — the hours with the most clutter
 * in them are the hours that land.
 */
export function DayPage() {
  const [params, setParams] = useSearchParams();
  const filter = params.get("show") ?? "all";
  const [open, setOpen] = useState<number | null>(currentHour);

  const visible = stats.filter((stat) => {
    if (filter === "missed") return !stat.clean;
    if (filter === "flagged") {
      return placed.some(
        (p) => p.hour === stat.hour.h && flaggedKeys.has(`${p.hour}:${p.index}`),
      );
    }
    return true;
  });

  const toggle = (h: number) => {
    withViewTransition(() => setOpen((current) => (current === h ? null : h)));
  };

  return (
    <div>
      <PageHead title="Thursday, hour by hour">
        <p>
          Every hour has to end on the junction, because the identification at the
          top of the next one is not negotiable. What decides whether it does is
          not care — it is what the hour has in it that can be made shorter.
        </p>
      </PageHead>

      <section className="border-b border-line px-4 py-5 sm:px-6">
        <h2 className="text-[var(--text-title)] leading-tight">
          The hours with the most in them are the hours that land
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,22rem))]">
          {bands.map((band) => (
            <div key={band.label} className="rounded-console border border-line bg-panel p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.9375rem] text-ink">{band.label}</span>
                <Pill>{band.hours} hours</Pill>
              </div>
              <dl className="tnum mt-3 grid grid-cols-[1fr_auto] gap-y-1.5 text-[0.8125rem]">
                <dt className="text-ink-subtle">Elements an hour</dt>
                <dd className="text-ink">{band.meanElements.toFixed(1)}</dd>
                <dt className="text-ink-subtle">Finest correction</dt>
                <dd className="text-ink">
                  {band.meanFinestTrim <= 1 ? "speech" : duration(band.meanFinestTrim)}
                </dd>
                <dt className="text-ink-subtle">Average miss</dt>
                <dd className="text-signal">{duration(band.meanAbsDrift)}</dd>
                <dt className="text-ink-subtle">Worst</dt>
                <dd className="text-ink">{duration(band.worstAbsDrift)}</dd>
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <p className="max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            A hosted hour has a person in it, and a person is infinitely
            adjustable: the back-announce takes whatever is left over and the
            hour lands to the second. An automated hour has nothing in it but
            records, and a record is as long as it is — so the finest correction
            it owns is a whole record, and half of one is the best it can be
            expected to do. The four overnight hours here are not badly built.
            They are as accurate as a wheel of records can be.
          </p>
          <Plate shot={shots.night} src={night} />
        </div>
      </section>

      <nav className="flex flex-wrap gap-1 border-b border-line px-4 py-3 sm:px-6">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setParams(option.id === "all" ? {} : { show: option.id })}
            className={`focus-ring rounded-console px-3 py-1.5 text-[0.8125rem] transition-colors ${
              filter === option.id
                ? "bg-raised text-ink"
                : "text-ink-muted hover:bg-[var(--wash-raised)] hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
        <span className="ml-auto self-center text-[0.8125rem] text-ink-subtle">
          {visible.length} of {stats.length}
        </span>
      </nav>

      <div className="divide-y divide-line">
        {visible.map((stat) => {
          const plan = day.find((d) => d.h === stat.hour.h);
          const show = showById.get(stat.hour.showId);
          const expanded = open === stat.hour.h;
          const flagged = placed.some(
            (p) => p.hour === stat.hour.h && flaggedKeys.has(`${p.hour}:${p.index}`),
          );
          return (
            <section key={stat.hour.h}>
              <HourHead
                stat={stat}
                showName={show ? show.name : stat.hour.showId}
                mode={MODE_LABEL[modeOf(stat.hour)] ?? modeOf(stat.hour)}
                expanded={expanded}
                flagged={flagged}
                onToggle={() => toggle(stat.hour.h)}
                aside={
                  stat.hour.draft ? (
                    <p className="px-3 pb-2 text-[0.75rem] text-ink-subtle">
                      Built, not signed off.
                    </p>
                  ) : null
                }
              />
              {expanded ? (
                <div className="hour-body pb-3" style={{ viewTransitionName: "hour" }}>
                  {plan?.note ? (
                    <div className="px-3 pb-3">
                      <Note tone={stat.clean ? "quiet" : "live"}>{plan.note}</Note>
                    </div>
                  ) : null}
                  <LogList
                    rows={placed.filter((p) => p.hour === stat.hour.h)}
                    breachOf={(p) => breachAt.get(`${p.hour}:${p.index}`)}
                  />
                </div>
              ) : null}
            </section>
          );
        })}

        {visible.length === 0 ? (
          <p className="px-4 py-10 text-[0.9375rem] text-ink-muted sm:px-6">
            No hour of the day is in that state, which is the answer rather than an
            empty screen.{" "}
            <Link to="/day" className="focus-ring text-signal underline underline-offset-2">
              Show every hour
            </Link>
            .
          </p>
        ) : null}
      </div>

      <p className="px-4 py-5 text-[0.8125rem] text-ink-subtle sm:px-6">
        The broadcast day runs {hourLabel(6)} to {hourLabel(6)}, so the overnight
        belongs to the day it started in and the hours run past twenty-four.
      </p>
    </div>
  );
}
