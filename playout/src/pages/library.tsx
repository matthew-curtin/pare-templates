import { Link, useSearchParams } from "react-router-dom";
import { PageHead, Pill } from "@/components/bits";
import { Plate } from "@/components/plate";
import stylus from "@/photos/stylus.jpg";
import { shots } from "@/content/site";
import { categories } from "@/content/library";
import { standings } from "@/lib/station";
import { clock, duration, hours } from "@/lib/format";

/**
 * The library, as wheels.
 *
 * Every column here is derived from today's log rather than stored on
 * the record: how many times it has been on, when it last went out, and
 * the second its category's rest lets it back. A record with a rest
 * still running is not an error — it is the rule working, which is why
 * "resting" reads as a plain fact and not a warning.
 */
export function LibraryPage() {
  const [params] = useSearchParams();
  const wheel = params.get("wheel");
  const readyOnly = params.get("ready") === "1";

  const rows = standings.filter((standing) => {
    if (wheel && standing.category.id !== wheel) return false;
    if (readyOnly && !standing.ready) return false;
    return true;
  });

  const link = (next: Record<string, string | null>) => {
    const query = new URLSearchParams(params);
    for (const [key, value] of Object.entries(next)) {
      if (value === null) query.delete(key);
      else query.set(key, value);
    }
    const text = query.toString();
    return text ? `/library?${text}` : "/library";
  };

  return (
    <div>
      <PageHead title="The library">
        <p>
          Seventy-six records in five wheels. A wheel is not a genre — it is a
          rotation speed, and the only thing about a station's sound that is
          actually scheduled is which records go in which one.
        </p>
      </PageHead>

      <div className="grid gap-6 border-b border-line px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div>
          <nav className="flex flex-wrap gap-1">
            <Link
              to={link({ wheel: null })}
              className={`focus-ring rounded-console px-3 py-1.5 text-[0.8125rem] transition-colors ${
                wheel === null
                  ? "bg-raised text-ink"
                  : "text-ink-muted hover:bg-[var(--wash-raised)] hover:text-ink"
              }`}
            >
              Every wheel
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={link({ wheel: category.id })}
                className={`focus-ring rounded-console px-3 py-1.5 text-[0.8125rem] transition-colors ${
                  wheel === category.id
                    ? "bg-raised text-ink"
                    : "text-ink-muted hover:bg-[var(--wash-raised)] hover:text-ink"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              to={link({ ready: readyOnly ? null : "1" })}
              className={`focus-ring rounded-console border px-3 py-1.5 text-[0.8125rem] transition-colors ${
                readyOnly
                  ? "border-signal/60 bg-[var(--wash-signal)] text-signal"
                  : "border-line text-ink-muted hover:text-ink"
              }`}
            >
              {readyOnly ? "Free to play now" : "Show only what is free now"}
            </Link>
            <span className="text-[0.8125rem] text-ink-subtle">
              {rows.length} of {standings.length} records
            </span>
          </div>
        </div>

        <Plate shot={shots.stylus} src={stylus} aspect="3 / 4" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-ink-subtle">
              <th scope="col" className="pill border-0 px-4 py-2 font-normal sm:px-6">
                Record
              </th>
              <th scope="col" className="pill border-0 px-3 py-2 font-normal">
                Wheel
              </th>
              <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">
                Length
              </th>
              <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">
                Ramp
              </th>
              <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">
                Plays
              </th>
              <th scope="col" className="pill border-0 px-3 py-2 text-right font-normal">
                Last on
              </th>
              <th scope="col" className="pill border-0 px-4 py-2 text-right font-normal sm:px-6">
                Free again
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {rows.map((standing) => (
              <tr key={standing.track.id} className="transition-colors hover:bg-[var(--wash-raised)]">
                <td className="px-4 py-2.5 sm:px-6">
                  <Link
                    to={`/library/${standing.track.id}`}
                    className="focus-ring text-[0.875rem] text-ink hover:text-signal"
                  >
                    {standing.track.title}
                  </Link>
                  <span className="block text-[0.8125rem] text-ink-muted">
                    {standing.track.artist}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[0.8125rem] text-ink-muted">
                  {standing.category.name}
                </td>
                <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-muted">
                  {duration(standing.track.seconds)}
                </td>
                <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-subtle">
                  {duration(standing.track.ramp)}
                </td>
                <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-muted">
                  {standing.playsToday}
                </td>
                <td className="tnum px-3 py-2.5 text-right text-[0.8125rem] text-ink-muted">
                  {standing.last ? clock(standing.last.start) : "—"}
                </td>
                <td className="px-4 py-2.5 text-right sm:px-6">
                  {standing.ready ? (
                    <Pill tone="signal">Free</Pill>
                  ) : (
                    <Pill title={`Rest of ${hours(standing.category.restHours)}`}>
                      Rests to {clock(standing.eligible ?? 0)}
                    </Pill>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-10 text-[0.9375rem] text-ink-muted sm:px-6">
          Nothing in that wheel is free at this minute — which is what a wheel
          under pressure looks like rather than an empty list.
        </p>
      ) : null}
    </div>
  );
}
