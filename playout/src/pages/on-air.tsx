import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LogList } from "@/components/log";
import { DriftMeter } from "@/components/hour";
import { Note, Readout } from "@/components/bits";
import { Plate } from "@/components/plate";
import desk from "@/photos/desk.jpg";
import { shots, station, today } from "@/content/site";
import { showById } from "@/content/shows";
import { day } from "@/content/day";
import {
  breachAt,
  currentHour,
  hourStatByHour,
  placed,
} from "@/lib/station";
import { clock, duration, hourLabel, signedShort } from "@/lib/format";

/**
 * On air.
 *
 * The hour you are in, whole, with the row that is playing lit and the
 * rows that have gone dimmed. Everything past the playhead is still a
 * decision somebody can make, which is why the analysis sits beside it
 * rather than at the end of the day.
 */
export function OnAirPage() {
  const stat = hourStatByHour.get(currentHour);
  const plan = day.find((d) => d.h === currentHour);
  const show = plan ? showById.get(plan.showId) : undefined;
  const rows = placed.filter((p) => p.hour === currentHour);
  const missing = stat ? Math.abs(stat.drift) > stat.tolerance : false;
  const logRef = useRef<HTMLDivElement>(null);

  // Bring the row that is actually going out into view. An hour is
  // twenty rows long and the interesting one is wherever the clock says
  // it is — a front page you have to scroll to find the present in has
  // failed at the one thing it is for. `block: "center"` rather than
  // "start" so the rows either side of it are readable too, which is
  // what anybody looking at a log actually wants.
  useEffect(() => {
    const playing = logRef.current?.querySelector('[data-playing="true"]');
    playing?.scrollIntoView({ block: "center", behavior: "auto" });
  }, []);

  return (
    <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="min-w-0 border-b border-line lg:border-b-0 lg:border-r">
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line px-4 pb-4 pt-5 sm:px-6">
          <h1 className="clock">{hourLabel(currentHour)}</h1>
          <div className="min-w-0">
            <p className="text-[1.0625rem] text-ink">{show ? show.name : "—"}</p>
            <p className="text-[0.8125rem] text-ink-subtle">
              {show && show.hosts ? show.hosts : "No presenter"} · {today}
            </p>
          </div>
        </header>

        <div ref={logRef}>
          <LogList rows={rows} breachOf={(p) => breachAt.get(`${p.hour}:${p.index}`)} />
        </div>

        <div className="border-t border-line px-4 py-5 sm:px-6">
          <Plate shot={shots.desk} src={desk} className="max-w-[26rem]" />
        </div>
      </section>

      {/* Sticky, because the log beside it scrolls itself to whatever is
          on air the moment the page opens, and without this the analysis
          the page exists to show is carried off the top of the screen by
          its own helpfulness.
          It only works while this column is SHORTER than the one beside
          it: a sticky element cannot move outside its containing block,
          and when the photograph lived here the aside was the taller
          column, so `position: sticky` computed correctly and did
          nothing at all. The photograph is now under the log, which is
          also where its subject belongs. */}
      <aside className="min-w-0 self-start px-4 py-5 sm:px-6 lg:sticky lg:top-0">
        <h2 className="text-[var(--text-title)] leading-tight">Does this hour land?</h2>

        {stat ? (
          <>
            <div className="mt-4">
              <DriftMeter drift={stat.drift} tolerance={stat.tolerance} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <Readout label="Against the junction" tone={missing ? "live" : "signal"}>
                {signedShort(stat.drift)}
              </Readout>
              <Readout label="Scheduled">{duration(stat.scheduled)}</Readout>
              <Readout label="Absorbs with" wrap>
                {stat.finestTrim <= 1 ? "the back-announce" : duration(stat.finestTrim)}
              </Readout>
              <Readout label="Best it can land" wrap>
                {stat.tolerance < 1 ? "to the second" : duration(stat.tolerance)}
              </Readout>
            </div>

            <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-muted">
              An hour lands by absorbing whatever is left over.{" "}
              {stat.finestTrim <= 1
                ? "This one has a host in it, so the back-announce takes the remainder and the hour lands exactly."
                : `This one has nothing in it shorter than ${duration(stat.finestTrim)}, so the finest correction it owns is a whole element.`}
            </p>

            {missing && plan?.note ? (
              <div className="mt-4">
                <Note tone="live">{plan.note}</Note>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="text-[var(--text-title)] leading-tight">The junction</h2>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
            {station.transmitter}. At {clock((currentHour + 1) * 3600)} the top-of-hour
            identification has to go out, and it is the one element in the day nobody
            can move.{" "}
            <Link to="/rules" className="focus-ring text-signal underline underline-offset-2">
              What the rules can and cannot hold
            </Link>
            .
          </p>
        </div>

      </aside>
    </div>
  );
}
