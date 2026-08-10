import Link from "next/link";
import { Band } from "@/components/shell";
import { Chip } from "@/components/bits";
import { FiringCard } from "@/components/firing-card";
import { Plate } from "@/components/plate";
import { photos } from "@/photos";
import { shots } from "@/content/site";
import { longDate, money, plural, shortDate } from "@/lib/format";
import {
  beyondFortnight,
  costOf,
  kilnOf,
  programOf,
  recentFirings,
  thisFortnight,
} from "@/lib/studio";

export const metadata = {
  title: "Firings",
  description:
    "The fortnight's rota at Marlpit, what is loaded on each firing, and what came out of the last six.",
};

/**
 * The rota.
 *
 * Deliberately shows the honest shape of the answer: the fortnight in
 * full, and then a thin list of everything after it with the reason it
 * looks empty. The simulation only knows about pots that exist today, so
 * a rota entry three weeks out with nothing on it is a fact about how
 * far ahead anybody can see, not about the studio being in trouble.
 */
export default function FiringsPage() {
  const lighting = thisFortnight.filter((f) => f.status !== "open");
  const openSoon = thisFortnight.filter((f) => f.status === "open");

  return (
    <>
      <Band top>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h1 className="display max-w-[13ch]">Firings</h1>
            <p className="mt-5 max-w-[58ch] text-lede leading-relaxed text-ink-muted">
              The rota is a fortnight long and every slot on it is conditional. A firing
              happens when enough work is ready for it, and the studio publishes the
              threshold rather than the excuse.
            </p>
          </div>
          <Plate shot={shots.elements} src={photos.elements} priority />
        </div>
      </Band>

      <Band>
        <h2 className="text-title">This fortnight</h2>
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {lighting.map((f) => (
            <FiringCard key={f.id} firing={f} />
          ))}
        </div>

        {openSoon.length > 0 ? (
          <div className="mt-6 border border-line bg-paper p-4">
            <h3 className="text-[1.0625rem] leading-tight">
              {plural(openSoon.length, "slot")} with nothing on yet
            </h3>
            <p className="mt-1 max-w-[64ch] text-[0.875rem] leading-relaxed text-ink-muted">
              These are on the rota and nobody has made the work for them. That is not the
              same as a firing that will not light, and the board keeps them apart.
            </p>
            <ul className="figure mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[0.8125rem] text-ink-subtle">
              {openSoon.map((f) => (
                <li key={f.id}>
                  {kilnOf(f.kilnId)?.name} · {shortDate(f.day)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Band>

      <Band>
        <h2 className="text-title">After that</h2>
        <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          The rota keeps running, and the board stops pretending to know. Everything below is
          a slot the studio will honour if there is work for it — and since none of that work
          has been made yet, saying anything more precise would be a guess with a date on it.
        </p>
        <ul className="figure mt-4 grid list-none gap-x-6 gap-y-1 p-0 text-[0.875rem] text-ink-muted sm:grid-cols-2 lg:grid-cols-3">
          {beyondFortnight.map((f) => {
            const kiln = kilnOf(f.kilnId);
            const program = programOf(f.programId);
            return (
              <li key={f.id} className="flex justify-between gap-4 border-b border-line py-1">
                <span>
                  {kiln?.name} · {program?.name}
                </span>
                <span className="text-ink-subtle">{shortDate(f.day)}</span>
              </li>
            );
          })}
        </ul>
      </Band>

      <Band>
        <h2 className="text-title">What came out</h2>
        <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          The last six firings, with the controller&rsquo;s own log. These are the only
          numbers on this site that are observations rather than derivations.
        </p>

        <ul className="mt-5 grid list-none gap-4 p-0 lg:grid-cols-2 2xl:grid-cols-3">
          {recentFirings.map((f) => {
            const kiln = kilnOf(f.kilnId);
            const program = programOf(f.programId);
            if (!kiln || !program) return null;
            return (
              <li key={f.id} className="min-w-0 border border-line bg-paper p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[1.125rem] leading-tight">
                    <Link href={`/firings/${f.id}`} className="focus-ring">
                      {kiln.name}
                    </Link>{" "}
                    <span className="font-[family-name:var(--font-sans)] text-[0.875rem] text-ink-muted">
                      {program.name}
                    </span>
                  </h3>
                  <Chip>{longDate(f.day)}</Chip>
                </div>
                <p className="figure mt-2 text-[0.8125rem] text-ink-subtle">
                  {plural(f.total, "piece")} · {money(costOf(kiln.id))} ·{" "}
                  {money(costOf(kiln.id) / f.total)} each · {f.loaded.length} still here
                </p>
                {f.note ? (
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{f.note}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Band>
    </>
  );
}
