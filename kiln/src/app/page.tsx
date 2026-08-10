import Link from "next/link";
import { Band } from "@/components/shell";
import { Chip, Note, Stat } from "@/components/bits";
import { FiringCard } from "@/components/firing-card";
import { Plate } from "@/components/plate";
import { Gauge } from "@/components/gauge";
import { Elevation } from "@/components/drawing";
import { photos } from "@/photos";
import { kilns } from "@/content/kilns";
import { glazes } from "@/content/glazes";
import { shots, site } from "@/content/site";
import { days, litres, money, percent, plural } from "@/lib/format";
import { capacity, loadedIds, tallestPossible } from "@/lib/pack";
import {
  byReason,
  costOf,
  firings,
  loadingNow,
  onShelf,
  quoteDays,
  strandedByLoad,
  withoutDate,
} from "@/lib/studio";

/**
 * The front page: what is being packed, and what will not light.
 *
 * The two numbers at the top are not written down anywhere in the
 * content. They come from putting the same bisqued mug through the whole
 * simulation once per glaze — see `quote` in lib/schedule.ts — which is
 * also why the six electric glazes give one answer and the three
 * reduction glazes give another, and why no glaze inside either group
 * differs from its neighbours by a single day.
 */
export default function Home() {
  const anyElectric = glazes.find((g) => g.programId === "stoneware6");
  const anyReduction = glazes.find((g) => g.programId === "reduction10");
  const electric = anyElectric ? quoteDays(anyElectric.id) : null;
  const reduction = anyReduction ? quoteDays(anyReduction.id) : null;
  const stalled = firings.find((f) => f.status === "postponed");
  const stalledKiln = stalled ? kilns.find((k) => k.id === stalled.kilnId) : undefined;

  return (
    <>
      <Band top>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h1 className="display max-w-[16ch]">A kiln is not a queue.</h1>
            <p className="mt-5 max-w-[52ch] text-lede leading-relaxed text-ink-muted">
              {site.claim}
            </p>

            <div className="mt-8 grid max-w-[46rem] grid-cols-2 gap-6 sm:grid-cols-4">
              <Stat label="Any electric glaze" note="bisqued mug, in today" heat="fire">
                {electric === null ? "—" : days(electric)}
              </Stat>
              <Stat label="Any reduction glaze" note="the same mug, same day" heat="cold">
                {reduction === null ? "—" : days(reduction)}
              </Stat>
              <Stat label="On the shelf" note={`${withoutDate} of them have no date`}>
                {onShelf}
              </Stat>
              <Stat label="Waiting for you" note="glaze not chosen">
                {(byReason.get("you") ?? []).length}
              </Stat>
            </div>

            <p className="mt-6 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Six glazes on the shelf fire in an electric kiln and three do not, and inside
              each group it makes no difference at all which one you pick. The programme is
              the whole decision.{" "}
              <Link href="/glazes" className="focus-ring text-fire underline underline-offset-2">
                What each glaze costs you
              </Link>
              .
            </p>
          </div>

          <Plate shot={shots.greenShelf} src={photos.greenShelf} priority />
        </div>
      </Band>

      {loadingNow.length > 0 ? (
        <Band>
          <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="text-title">Being packed now</h2>
            <p className="max-w-[46ch] text-[0.9375rem] text-ink-muted">
              Loaded in the order the studio publishes: anything a full kiln turned away last
              time, then tallest first, then whoever has waited longest.
            </p>
          </header>
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {loadingNow.map((f) => (
              <FiringCard key={f.id} firing={f} />
            ))}
          </div>
        </Band>
      ) : null}

      {stalled && stalledKiln ? (
        <Band>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="min-w-0">
              <Chip heat="cold">Will not light</Chip>
              <h2 className="mt-3 text-title">
                {stalledKiln.name} is short, so nobody is firing it
              </h2>
              <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {stalledKiln.fuel === "gas" ? "Propane" : "Electricity"} costs{" "}
                {money(costOf(stalledKiln.id))} whether the chamber is packed or holding a
                handful of pots, and {stalledKiln.name} only comes round once a fortnight. So
                the {plural(loadedIds(stalled.load).length, "piece")} glazed for it wait — not
                behind anybody, and not for anything anyone has done wrong. They are waiting
                for other people to choose the same firing.
              </p>
              <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {plural(strandedByLoad, "piece")} on the shelf have no date at all for the
                same reason. They are not lost and nothing is broken; there is simply not yet
                enough of their kind of work in the building.{" "}
                <Link href="/queue" className="focus-ring text-fire underline underline-offset-2">
                  See the shelf
                </Link>
                .
              </p>
            </div>

            <div className="min-w-0 border border-line bg-paper p-4">
              <div className="grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <Elevation kiln={stalledKiln} load={stalled.load} />
                <div className="min-w-0">
                  <Gauge kiln={stalledKiln} load={stalled.load.load} status={stalled.status} />
                  <Note heat="cold">
                    {percent(stalled.load.load)} of {stalledKiln.name} is spoken for. It lights
                    at {percent(stalledKiln.minLoad)}. The next one after this is a fortnight
                    later.
                  </Note>
                </div>
              </div>
            </div>
          </div>
        </Band>
      ) : null}

      <Band>
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="text-title">Three kilns</h2>
          <p className="text-[0.9375rem] text-ink-muted">
            Every one of them has a load below which nobody will light it.
          </p>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {kilns.map((kiln) => (
            <article key={kiln.id} className="min-w-0 border border-line bg-paper p-4">
              <h3 className="text-[1.25rem] leading-tight">{kiln.name}</h3>
              <p className="figure mt-1 text-[0.8125rem] text-ink-subtle">
                {kiln.fuel === "gas" ? "Gas" : "Electric"} · {kiln.width} × {kiln.depth} ×{" "}
                {kiln.height}cm · {litres(capacity(kiln))}
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">{kiln.note}</p>
              <dl className="figure mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-[0.8125rem]">
                <div>
                  <dt className="text-ink-subtle">Lights at</dt>
                  <dd>{percent(kiln.minLoad)}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">A firing costs</dt>
                  <dd>{money(costOf(kiln.id))}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Tallest it takes</dt>
                  <dd>{tallestPossible(kiln)}cm</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Fires</dt>
                  <dd>
                    {kiln.rota.length === 1 ? "once a fortnight" : `${kiln.rota.length} a fortnight`}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <p className="mt-5 text-[0.9375rem] text-ink-muted">
          <Link href="/firings" className="focus-ring text-fire underline underline-offset-2">
            The whole rota, and what came out last week
          </Link>
        </p>
      </Band>
    </>
  );
}

export const metadata = {
  title: `${site.name} — a kiln is not a queue`,
  description: `Every firing at ${site.name}, what is in it, and why your work is not in it yet.`,
};
