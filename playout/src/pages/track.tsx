import { Link, useParams } from "react-router-dom";
import { Note, PageHead, Readout } from "@/components/bits";
import { LogList } from "@/components/log";
import { breachAt, placed, standingById } from "@/lib/station";
import { clock, duration, hours } from "@/lib/format";
import { NOW } from "@/content/site";

/**
 * One record, and everything today's log knows about it.
 *
 * The plays are pulled straight out of the log rather than counted into
 * a field somewhere, so a record cannot claim a play it did not get or
 * hide one it did.
 */
export function TrackPage() {
  const { id } = useParams();
  const standing = id ? standingById.get(id) : undefined;

  if (!standing) {
    return (
      <div className="px-4 py-10 sm:px-6">
        <h1 className="text-[var(--text-title)]">No record with that number</h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          It is not on the shelf.{" "}
          <Link to="/library" className="focus-ring text-signal underline underline-offset-2">
            Back to the library
          </Link>
          .
        </p>
      </div>
    );
  }

  const plays = placed.filter(
    (p) => p.element.kind === "music" && p.element.ref === standing.track.id,
  );
  const breached = plays.filter((p) => breachAt.has(`${p.hour}:${p.index}`));

  return (
    <div>
      <PageHead title={standing.track.title}>
        <p>
          {standing.track.artist} · {standing.category.name}
        </p>
      </PageHead>

      <section className="grid gap-6 border-b border-line px-4 py-5 sm:px-6 lg:grid-cols-[repeat(4,minmax(0,12rem))]">
        <Readout label="Length">{duration(standing.track.seconds)}</Readout>
        <Readout label="Intro to talk over">{duration(standing.track.ramp)}</Readout>
        <Readout label="Plays today">{standing.playsToday}</Readout>
        <Readout label="Free again" tone={standing.ready ? "signal" : undefined}>
          {standing.ready ? "now" : clock(standing.eligible ?? 0)}
        </Readout>
      </section>

      <section className="border-b border-line px-4 py-5 sm:px-6">
        <h2 className="text-[var(--text-title)] leading-tight">Its wheel</h2>
        <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {standing.category.name} rests a record {hours(standing.category.restHours)}{" "}
          and keeps an artist off for{" "}
          {hours(standing.category.artistSeparationMinutes / 60)}. At{" "}
          {clock(NOW)} this one{" "}
          {standing.ready
            ? "is free, so the scheduler may hand it to the next slot in the wheel."
            : `is still resting; the wheel will offer it again at ${clock(standing.eligible ?? 0)}.`}
        </p>
        {breached.length > 0 ? (
          <div className="mt-4 max-w-[62ch]">
            <Note tone="live">
              {breached.length === 1
                ? "One of today's plays broke a rule."
                : `${breached.length} of today's plays broke a rule.`}{" "}
              Not a scheduling slip: the hour it happened in asks the wheel for more
              records than the wheel holds, so something has to come round twice.{" "}
              <Link to="/rules" className="focus-ring underline underline-offset-2">
                The arithmetic
              </Link>
              .
            </Note>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="px-4 pb-1 pt-5 text-[var(--text-title)] leading-tight sm:px-6">
          On air today
        </h2>
        {plays.length > 0 ? (
          <LogList rows={plays} breachOf={(p) => breachAt.get(`${p.hour}:${p.index}`)} />
        ) : (
          <p className="px-4 py-6 text-[0.9375rem] text-ink-muted sm:px-6">
            Not scheduled today. It is in the wheel and the wheel has not reached
            it, which happens to a deep library and is the point of having one.
          </p>
        )}
      </section>
    </div>
  );
}
