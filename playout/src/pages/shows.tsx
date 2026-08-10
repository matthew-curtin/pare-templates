import { Link } from "react-router-dom";
import { Note, PageHead, Pill } from "@/components/bits";
import { shows } from "@/content/shows";
import { categories, tracks } from "@/content/library";
import { demands } from "@/lib/station";
import type { Slot } from "@/content/types";
import { duration } from "@/lib/format";

/**
 * The clocks.
 *
 * A clock is drawn here as the hour it describes — one bar, sixty
 * minutes wide, every slot at its real width. That is the whole reason
 * this page is worth having: a list of twenty slots tells you nothing
 * about what a show sounds like, and a bar with four minutes of speech
 * in the middle of it tells you immediately.
 *
 * Music slots have no fixed length, so they are drawn at their wheel's
 * average. The bar is therefore a shape rather than a measurement, which
 * is exactly what a clock is — the measurement is `/day`.
 */
const MEAN = new Map(
  categories.map((category) => {
    const mine = tracks.filter((t) => t.categoryId === category.id);
    const total = mine.reduce((sum, t) => sum + t.seconds, 0);
    return [category.id, mine.length > 0 ? total / mine.length : 240];
  }),
);

const NOMINAL_SPOT = 28;

function widthOf(slot: Slot): number {
  if (slot.k === "music") return MEAN.get(slot.cat) ?? 240;
  if (slot.k === "spot") return NOMINAL_SPOT;
  return slot.s;
}

function toneOf(slot: Slot): string {
  if (slot.k === "music") return "bg-ink/20";
  if (slot.k === "spot") return "bg-signal/55";
  if (slot.k === "ident") return "bg-ink/75";
  return "bg-ink/45";
}

function labelOf(slot: Slot): string {
  if (slot.k === "music") return `Record · ${slot.cat}`;
  if (slot.k === "spot") return "Underwriting";
  return `${slot.title} · ${duration(slot.s)}`;
}

export function ShowsPage() {
  return (
    <div>
      <PageHead title="The clocks">
        <p>
          A show is a shape, not a playlist. Every hour of Afternoon Drift has the
          same slots in the same order and none of the same records — which is
          the difference between a format and a list, and the reason a station
          can sound like itself at four in the morning.
        </p>
      </PageHead>

      <div className="divide-y divide-line">
        {shows.map((show) => {
          const total = show.clock.reduce((sum, slot) => sum + widthOf(slot), 0);
          const mine = demands.filter((d) => d.showId === show.id);
          const impossible = mine.filter((d) => d.forcedRepeats > 0);
          const flex = show.clock.find((s) => s.k === "link" && s.flex === true);

          return (
            <section key={show.id} className="px-4 py-6 sm:px-6">
              <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-[var(--text-title)] leading-tight">{show.name}</h2>
                <Pill>{show.mode}</Pill>
                <span className="text-[0.8125rem] text-ink-subtle">
                  {show.hosts ?? "No presenter"}
                </span>
              </header>

              <p className="mt-2 max-w-[66ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {show.blurb}
              </p>

              <div
                className="mt-4 flex h-7 w-full overflow-hidden rounded-console border border-line"
                role="img"
                aria-label={`One hour of ${show.name}: ${show.clock.length} slots`}
              >
                {show.clock.map((slot, index) => (
                  <span
                    key={index}
                    title={labelOf(slot)}
                    className={`${toneOf(slot)} ${
                      slot.k === "link" && slot.flex === true
                        ? "border-x border-signal bg-[var(--wash-signal)]"
                        : ""
                    } block h-full`}
                    style={{ width: `${(widthOf(slot) / total) * 100}%` }}
                  />
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-ink-subtle">
                <span>{show.clock.filter((s) => s.k === "music").length} records</span>
                <span>
                  {show.clock.filter((s) => s.k !== "music").length} everything else
                </span>
                <span>
                  {flex
                    ? "one flexible link — this hour can land exactly"
                    : "no flexible link — this hour lands where the records leave it"}
                </span>
              </div>

              {mine.length > 0 ? (
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem]">
                  {mine.map((demand) => (
                    <div key={demand.categoryId} className="flex items-baseline gap-2">
                      <dt className="text-ink-subtle">
                        {categories.find((c) => c.id === demand.categoryId)?.name}
                      </dt>
                      <dd
                        className={
                          demand.forcedRepeats > 0 ? "tnum text-live" : "tnum text-ink-muted"
                        }
                      >
                        {demand.slotsPerHour} slots from {demand.available}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {impossible.map((demand) => (
                <div key={demand.categoryId} className="mt-3 max-w-[66ch]">
                  <Note tone="live">
                    This hour asks the wheel for {demand.slotsPerHour} records and the
                    wheel holds {demand.available}. {demand.forcedRepeats} of them come
                    round twice inside the hour, every week, and no scheduler can order
                    its way out of it —{" "}
                    <Link to="/rules" className="focus-ring underline underline-offset-2">
                      the arithmetic is on the rules page
                    </Link>
                    .
                  </Note>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
