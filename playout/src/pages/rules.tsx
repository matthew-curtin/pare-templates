import { Link } from "react-router-dom";
import { Note, PageHead, Pill } from "@/components/bits";
import { Plate } from "@/components/plate";
import mast from "@/photos/mast.jpg";
import { shots, station } from "@/content/site";
import { categories } from "@/content/library";
import { showById } from "@/content/shows";
import { bands, breaches, feasibilities, impossibleDemands } from "@/lib/station";
import { count, duration, hours } from "@/lib/format";

/**
 * What the rules can and cannot hold.
 *
 * Two findings, and the difference between them is the point of the
 * page. Every rule the station wrote is one the day CAN keep, and the
 * table proves it by measuring the wheel rather than by asserting it.
 * And one SHOW still breaks a rule four times a week, because a wheel of
 * twelve records asked for fourteen in an hour hands two of them back
 * twice — which is arithmetic, not scheduling, and cannot be fixed by
 * anyone being more careful.
 */
export function RulesPage() {
  const restBreaches = breaches.filter((b) => b.kind === "rest").length;
  const artistBreaches = breaches.filter((b) => b.kind === "artist").length;

  return (
    <div>
      <PageHead title="What the library can hold">
        <p>
          A rotation rule is a promise about the future made by a finite shelf.
          Everything below is worked out from today's log and the number of
          records actually on that shelf, so a rule the station cannot keep says
          so here rather than breaking quietly at seven in the evening.
        </p>
      </PageHead>

      <section className="border-b border-line px-4 py-5 sm:px-6">
        <h2 className="text-[var(--text-title)] leading-tight">Every wheel, measured</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-ink-subtle">
                <th scope="col" className="pill border-0 py-2 pr-3 font-normal">Wheel</th>
                <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">Records</th>
                <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">Plays today</th>
                <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">Window</th>
                <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">Longest rest it can keep</th>
                <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">The rule</th>
                <th scope="col" className="pill border-0 py-2 pl-3 text-right font-normal">Holds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {feasibilities.map((f) => (
                <tr key={f.category.id}>
                  <td className="py-2.5 pr-3 text-[0.875rem] text-ink">{f.category.name}</td>
                  <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-muted">{f.size}</td>
                  <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-muted">{f.plays}</td>
                  <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-subtle">
                    {f.windowHours > 0 ? hours(f.windowHours) : "—"}
                  </td>
                  <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-signal">
                    {hours(f.achievableRestHours)}
                  </td>
                  <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-muted">
                    {hours(f.category.restHours)}
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    {f.feasible ? <Pill>yes</Pill> : <Pill tone="live">no</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-muted">
          The column that matters is <em className="not-italic text-ink">longest rest it can keep</em>. A wheel of {feasibilities[0]?.size}{" "}
          records played {feasibilities[0]?.plays} times across{" "}
          {hours(feasibilities[0]?.windowHours ?? 0)} comes round every{" "}
          {hours(feasibilities[0]?.achievableRestHours ?? 0)} however cleverly it is
          ordered. Dividing by the whole day instead of by the hours the wheel is
          actually used flatters every one of these by a factor of two or more, which
          is the easy way to write a rule that cannot be kept.
        </p>
      </section>

      <section className="grid gap-6 border-b border-line px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <h2 className="text-[var(--text-title)] leading-tight">
            The rule the day keeps and the show cannot
          </h2>
          {impossibleDemands.map((demand) => {
            const show = showById.get(demand.showId);
            const category = categories.find((c) => c.id === demand.categoryId);
            return (
              <div key={`${demand.showId}-${demand.categoryId}`} className="mt-4 max-w-[68ch]">
                <Note tone="live">
                  <strong className="font-normal text-ink">{show?.name}</strong> asks for{" "}
                  {count(demand.slotsPerHour, "record")} from {category?.name} in one
                  hour. There are {demand.available}. So{" "}
                  {count(demand.forcedRepeats, "record")} come round twice inside sixty
                  minutes, against a rest of {hours(category?.restHours ?? 0)} — and the
                  hour after it starts short too, because the wheel has just been
                  emptied.
                </Note>
              </div>
            );
          })}
          <p className="mt-4 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            Today's log breaks the rotation rules {count(breaches.length, "time")}:{" "}
            {restBreaches} on rest and {artistBreaches} on artist separation. Every one
            of them is in or immediately after that hour, and there are two fixes,
            neither of them scheduling: more Cape Wren records, or fewer slots asking
            for them.{" "}
            <Link to="/day?show=flagged" className="focus-ring text-signal underline underline-offset-2">
              See the hours it happens in
            </Link>
            .
          </p>
        </div>
        <Plate shot={shots.mast} src={mast} aspect="3 / 4" />
      </section>

      <section className="px-4 py-5 sm:px-6">
        <h2 className="text-[var(--text-title)] leading-tight">Why the junction is fixed</h2>
        <p className="mt-2 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {station.transmitter}. At the top of every hour the identification has to
          go out, and once a night the transmitter is handed over for four hours to a
          network feed that starts whether or not the station is ready. That is what makes an hour a
          container rather than a list, and it is the reason a schedule is
          arithmetic before it is taste.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,20rem))]">
          {bands.map((band) => (
            <div key={band.label} className="rounded-console border border-line bg-panel p-4">
              <dt className="text-[0.9375rem] text-ink">{band.label} hours</dt>
              <dd className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
                Finest correction{" "}
                <span className="tnum text-ink">
                  {band.meanFinestTrim <= 1 ? "any length" : duration(band.meanFinestTrim)}
                </span>
                , average miss{" "}
                <span className="tnum text-signal">{duration(band.meanAbsDrift)}</span>.
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
