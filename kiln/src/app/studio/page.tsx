import Link from "next/link";
import { Band } from "@/components/shell";
import { Initials, Note } from "@/components/bits";
import { Plate } from "@/components/plate";
import { photos } from "@/photos";
import { kilns, programs } from "@/content/kilns";
import { members } from "@/content/glazes";
import { shots, site } from "@/content/site";
import { capacity, tallestPossible } from "@/lib/pack";
import { CYCLE_DAYS, GLAZE_DAYS, studioCeiling, weekday } from "@/lib/schedule";
import { cm, litres, money, percent, plural } from "@/lib/format";
import { costOf, piecesOf } from "@/lib/studio";

export const metadata = {
  title: "Studio",
  description:
    "Marlpit: three kilns, ten members, a fortnightly rota, and the loading order written out in the order it is actually applied.",
};

/**
 * The building, and the rules.
 *
 * The loading order is on this page in the words the packer uses,
 * because a queue whose order nobody can explain is a queue everybody
 * thinks is rigged — and because it is the one thing on the site that is
 * a policy rather than a fact, so it is the one thing that could be
 * argued with.
 */
export default function StudioPage() {
  const ceiling = studioCeiling(kilns);

  return (
    <>
      <Band top>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h1 className="display max-w-[12ch]">The studio</h1>
            <p className="mt-5 max-w-[58ch] text-lede leading-relaxed text-ink-muted">
              {site.tagline} Ten members, three kilns, one rota, and a shelf that is always
              fuller than anybody wants it to be.
            </p>
            <p className="figure mt-4 text-[0.9375rem] text-ink-muted">
              {site.address}
              <br />
              {site.hours}
            </p>
          </div>
          {/* Capped, because the source is 2:3 and an uncapped portrait
              plate in a grid cell renders about 960px tall — three times
              the column beside it, with a void underneath the text. */}
          <Plate shot={shots.stacked} src={photos.stacked} priority aspect="3 / 4" className="max-w-[22rem]" />
        </div>
      </Band>

      <Band>
        <h2 className="text-title">How a kiln gets loaded</h2>
        <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          In this order, every time, by the same rule the board on this site uses. It is
          published because a queue whose order nobody can explain is a queue everybody thinks
          is rigged.
        </p>

        <ol className="mt-5 grid list-none gap-4 p-0 lg:grid-cols-3">
          <Rule
            n={1}
            title="Anything a full kiln turned away"
            body="Whatever was offered to the last firing of this programme and did not fit goes back in first. It is the only thing stopping a piece being bumped forever, and it is why a small pot can go in ahead of a big one that arrived earlier."
          />
          <Rule
            n={2}
            title="Then the tallest"
            body="A shelf is as tall as the tallest thing standing on it, so starting tall means the short work fills in underneath. Start short and a 40cm vase arrives to find nine centimetres of air."
          />
          <Rule
            n={3}
            title="Then whoever has waited longest"
            body="Only after the other two, and it decides less than anybody expects. Most of what looks like queue position at Marlpit is actually height and programme."
          />
        </ol>

        <div className="mt-6 max-w-[70ch]">
          <Note>
            One simplification worth admitting: this studio loads full-width shelves. A studio
            with half-shelves can stand an urn at one end and build a second tier beside it,
            and neither Marlpit nor the drawings on this site can do that. It is the main
            reason a tall pot here costs more than it would somewhere better equipped.
          </Note>
        </div>
      </Band>

      <Band>
        <h2 className="text-title">The kilns</h2>
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
                  <dt className="text-ink-subtle">Shelf slab</dt>
                  <dd>{cm(kiln.shelfThickness)}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Clearance above</dt>
                  <dd>{cm(kiln.clearance)}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Tallest it takes</dt>
                  <dd>{cm(tallestPossible(kiln))}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Lights at</dt>
                  <dd>{percent(kiln.minLoad)}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Energy</dt>
                  <dd>
                    {kiln.energy.perFiring}
                    {kiln.energy.unit === "kWh" ? " kWh" : "kg"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">A firing costs</dt>
                  <dd>{money(costOf(kiln.id))}</dd>
                </div>
              </dl>

              <h4 className="mt-4 text-[0.6875rem] uppercase text-ink-subtle">Its rota</h4>
              <ul className="figure mt-1 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[0.8125rem] text-ink-muted">
                {kiln.rota.map((slot, i) => (
                  <li key={i}>
                    {weekday(slot.day)}
                    {kiln.rota.filter((s) => s.day % 7 === slot.day % 7).length === 1
                      ? " (fortnightly)"
                      : ""}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-5 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          The rota repeats every {CYCLE_DAYS} days rather than every week, because Bramble
          only fires every other Sunday and a weekly rota has no way to say that. The tallest
          thing the building can fire at all is {cm(ceiling)}.
        </p>
      </Band>

      <Band>
        <h2 className="text-title">The three programmes</h2>
        <ul className="mt-5 grid list-none gap-4 p-0 lg:grid-cols-3">
          {programs.map((program) => (
            <li key={program.id} className="min-w-0 border border-line bg-paper p-4">
              <h3 className="text-[1.125rem] leading-tight">{program.name}</h3>
              <p className="figure mt-1 text-[0.8125rem] text-ink-subtle">
                Cone {program.cone} · {program.peak}°C · {program.hours}h up,{" "}
                {program.coolHours}h down · {program.atmosphere}
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">{program.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          Between the bisque coming out and the glaze firing going in there is a gap of{" "}
          {plural(GLAZE_DAYS, "day")} — the glaze bench, which is a person&rsquo;s job rather
          than a kiln&rsquo;s.{" "}
          <Link href="/queue" className="focus-ring text-fire underline underline-offset-2">
            Some of the shelf is stuck there right now
          </Link>
          .
        </p>
      </Band>

      <Band>
        <h2 className="text-title">Members</h2>
        <ul className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {members.map((member) => {
            const mine = piecesOf(member.id);
            const here = mine.filter((p) => p.state !== "collected");
            return (
              <li key={member.id} className="min-w-0 border border-line bg-paper p-3">
                <span className="flex items-center gap-2">
                  <Initials>{member.initials}</Initials>
                  <span className="min-w-0 truncate text-[0.9375rem]">{member.name}</span>
                </span>
                <p className="figure mt-2 text-[0.8125rem] text-ink-subtle">
                  Shelf {member.shelf} · since {member.since}
                </p>
                <p className="figure text-[0.8125rem] text-ink-muted">
                  {here.length === 0 ? "nothing on the shelf" : plural(here.length, "piece")}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-subtle">
          Initials rather than photographs: these ten people are invented, and a real
          person&rsquo;s face under an invented name is a small lie that would sit on the page
          forever.
        </p>
      </Band>
    </>
  );
}

function Rule({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="min-w-0 border border-line bg-paper p-4">
      <span className="figure text-[0.75rem] text-fire">{n}</span>
      <h3 className="mt-1 text-[1.125rem] leading-tight">{title}</h3>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{body}</p>
    </li>
  );
}
