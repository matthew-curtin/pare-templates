import Link from "next/link";
import { Band } from "@/components/shell";
import { Chip, Note } from "@/components/bits";
import { glazes } from "@/content/glazes";
import { programs } from "@/content/kilns";
import { REFERENCE } from "@/lib/schedule";
import { days, longDate, percent } from "@/lib/format";
import { TODAY } from "@/content/site";
import { glazeQuotes, quoteDays, worstQuote } from "@/lib/studio";

export const metadata = {
  title: "Glazes",
  description:
    "Nine glazes at Marlpit, and what each one costs you in days — worked out by putting the same mug through the same simulation once per glaze.",
};

/**
 * The glaze shelf, priced in days.
 *
 * Every number here comes from the same experiment: take a bisqued mug,
 * {REFERENCE.width}cm across and {REFERENCE.height}cm tall, put it into
 * today's studio with that glaze on it, and run the whole simulation
 * again. Nothing else would be honest — a mug added to a firing can be
 * the mug that tips it past its threshold, so the answer genuinely
 * depends on what everybody else chose.
 *
 * The result is the page's whole argument and it is not a ranking. Six
 * glazes give one answer and three give another, and inside each group
 * the difference is zero days. The glaze is not the decision. The
 * programme is.
 */
export default function GlazesPage() {
  const byProgram = programs
    .filter((p) => p.id !== "bisque")
    .map((program) => ({
      program,
      glazes: glazes.filter((g) => g.programId === program.id),
      wait: quoteDays(glazes.find((g) => g.programId === program.id)?.id ?? ""),
    }));

  return (
    <>
      <Band top>
        <h1 className="display max-w-[15ch]">What a glaze costs</h1>
        <p className="mt-5 max-w-[62ch] text-lede leading-relaxed text-ink-muted">
          Not in money. Every price below is in days, and every one of them was worked out by
          putting the same bisqued mug — {REFERENCE.width}cm across, {REFERENCE.height}cm
          tall — into today&rsquo;s studio with that glaze on it and running the whole
          fortnight again.
        </p>
        <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          The answer is not a ranking. Six of these fire in an electric kiln and three do not,
          and inside each group the difference is exactly zero days. Which glaze you pick is
          not the decision; which programme it belongs to is the whole decision.
        </p>
      </Band>

      <Band>
        <div className="flex flex-col gap-10">
          {byProgram.map(({ program, glazes: list, wait }) => (
            <section key={program.id}>
              <header className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h2 className="text-title">{program.name}</h2>
                <Chip heat={program.atmosphere === "reduction" ? "cold" : "fire"}>
                  cone {program.cone} · {program.peak}°C · {program.atmosphere}
                </Chip>
                <span className="figure text-[0.9375rem] text-ink">
                  {wait === null ? "no date inside a month" : days(wait)}
                </span>
              </header>
              <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {program.note}
              </p>

              <ul className="mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((glaze) => {
                  const wd = quoteDays(glaze.id);
                  const track = glazeQuotes.get(glaze.id);
                  return (
                    <li key={glaze.id} className="min-w-0 border border-line bg-paper p-4">
                      <h3 className="text-[1.125rem] leading-tight">{glaze.name}</h3>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
                        {glaze.colour}
                      </p>

                      {/* As wide as the wait it costs. The bar IS the number,
                          and the number is beside it because a length that
                          cannot be read as text is half a chart (§4b). */}
                      <div className="mt-4">
                        <div className="h-2 w-full bg-sunk">
                          <div
                            className={program.atmosphere === "reduction" ? "h-full bg-cold" : "h-full bg-fire"}
                            style={{ width: percent((wd ?? worstQuote) / worstQuote) }}
                          />
                        </div>
                        <p className="figure mt-1 text-[0.8125rem] text-ink-subtle">
                          {wd === null ? "no date inside a month" : days(wd)}
                          {track?.readyOn != null ? ` · out ${longDate(track.readyOn)}` : ""}
                        </p>
                      </div>

                      <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-subtle">
                        {glaze.behaviour}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </Band>

      <Band>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <h2 className="text-title">Why the gap is so wide</h2>
            <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Reduction is not a hotter version of the same firing. It is a claim about
              atmosphere: from about 1000°C the gas kiln is starved of air, so the flame pulls
              oxygen out of the glaze itself, and that is the only way an iron celadon goes
              green rather than a disappointed grey. It cannot be done in an electric kiln at
              any temperature.
            </p>
            <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              So the three reduction glazes depend on one kiln, that kiln fires once a
              fortnight, it needs somebody there for fourteen hours, and it will not light
              under a fifth full.{" "}
              <Link href="/firings" className="focus-ring text-fire underline underline-offset-2">
                Which is where the fortnight goes
              </Link>
              .
            </p>
          </div>

          <div className="min-w-0">
            <Note>
              These quotes are today&rsquo;s. They are not a promise, and they change when
              other people choose — a mug added to a firing can be the mug that tips it over
              its threshold, which means a reduction glaze gets faster the more people pick
              it. The studio does not have a way to make that happen and does not pretend to.
              The quote was taken on {longDate(TODAY)}.
            </Note>
          </div>
        </div>
      </Band>
    </>
  );
}
