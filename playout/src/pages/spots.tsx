import { Note, PageHead, Pill } from "@/components/bits";
import { spotCopy } from "@/content/spots";
import { deliveries, placed } from "@/lib/station";
import { clock, count, duration } from "@/lib/format";
import { today } from "@/content/site";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LONG_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * Underwriting, counted rather than reported.
 *
 * Every number on this page comes from counting today's log. That is the
 * whole design: a delivery report a station types in is a report about
 * what somebody meant to schedule, and the two disagree exactly when it
 * matters — the week an underwriter asks why they did not hear
 * themselves.
 */
export function SpotsPage() {
  const shortfall = deliveries.filter((d) => d.shortBy > 0);
  const misplaced = deliveries.filter((d) => d.outsideFlight > 0);
  const slots = placed.filter((p) => p.element.kind === "spot").length;

  return (
    <div>
      <PageHead title="Underwriting">
        <p>
          Eight acknowledgements, {count(slots, "airing")} in today's log. Nobody
          types these totals in — they are counted off the log the same way a
          listener would count them, which is the only version anybody can argue
          with.
        </p>
      </PageHead>

      {shortfall.length > 0 || misplaced.length > 0 ? (
        <section className="grid gap-3 border-b border-line px-4 py-5 sm:px-6 lg:grid-cols-2">
          {shortfall.map((d) => (
            <Note key={d.spot.id} tone="live">
              <strong className="font-normal text-ink">{d.spot.underwriter}</strong> is{" "}
              {count(d.shortBy, "airing")} short of the{" "}
              {d.spot.contractedPerDay} they bought for today. There is still time —
              the log runs to two in the morning.
            </Note>
          ))}
          {misplaced.map((d) => (
            <Note key={d.spot.id} tone="live">
              <strong className="font-normal text-ink">{d.spot.underwriter}</strong>{" "}
              is in today's log{" "}
              {d.outsideFlight === 1 ? "once" : count(d.outsideFlight, "time")}, and
              their flight ended on {LONG_DAYS[d.spot.flightTo]}. Somebody is being
              read out for a thing that has already happened.
            </Note>
          ))}
        </section>
      ) : null}

      <div className="divide-y divide-line">
        {deliveries.map((d) => {
          const airings = placed.filter(
            (p) => p.element.kind === "spot" && p.element.ref === d.spot.id,
          );
          return (
            <section key={d.spot.id} className="px-4 py-5 sm:px-6">
              <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-[1.0625rem] text-ink">{d.spot.underwriter}</h2>
                <span className="tnum text-[0.8125rem] text-ink-subtle">
                  {duration(d.spot.seconds)}
                </span>
                {d.inFlight ? (
                  <Pill>
                    {DAYS[d.spot.flightFrom]}–{DAYS[d.spot.flightTo]}
                  </Pill>
                ) : (
                  <Pill tone="live">
                    Flight ended {DAYS[d.spot.flightTo]}
                  </Pill>
                )}
                <span
                  className={`tnum ml-auto text-[0.875rem] ${
                    d.shortBy > 0 || d.outsideFlight > 0 ? "text-live" : "text-ink-muted"
                  }`}
                >
                  {d.aired} of {d.spot.contractedPerDay}
                </span>
              </header>

              <p className="mt-2 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                “{spotCopy[d.spot.id]}”
              </p>

              <p className="tnum mt-2 text-[0.8125rem] text-ink-subtle">
                {airings.length > 0
                  ? airings.map((p) => clock(p.start)).join("  ·  ")
                  : "Not in today's log"}
              </p>
            </section>
          );
        })}
      </div>

      <p className="px-4 py-5 text-[0.8125rem] text-ink-subtle sm:px-6">
        Counted from {today}'s log. A non-commercial licence limits an
        acknowledgement to who paid and what they do — no prices, no calls to
        action, and nothing that sounds like a pitch, which is why the copy above
        reads the way it does.
      </p>
    </div>
  );
}
