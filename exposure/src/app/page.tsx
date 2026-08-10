import Link from "next/link";
import { Shell, Band } from "@/components/shell";
import { Dial } from "@/components/dial";
import { Stat } from "@/components/stat";
import { Plate } from "@/components/plate";
import { StripKey } from "@/components/strip";
import { homes } from "@/content/homes";
import { site, states } from "@/content/site";
import { aspectDemo, dayFacts, mainRoomView, toView } from "@/lib/view";
import { clock, duration, hoursShort, money, monthDay } from "@/lib/format";
import { photos } from "@/photos";

const views = homes.map(toView).sort((a, b) => b.winterHours - a.winterHours);
const demo = aspectDemo();
const jun = dayFacts("jun");
const dec = dayFacts("dec");

const south = demo.find((d) => d.wall === "s")!;
const north = demo.find((d) => d.wall === "n")!;

/**
 * The site's sharpest finding, and nobody wrote it: across the six
 * principal rooms, glass and winter sun run in opposite directions. The
 * two ends of that are FOUND rather than named, so the paragraph beside
 * them stays true if a room is edited — and `scripts/check-sun.mjs`
 * asserts the direction, because an earlier version of this section
 * claimed something adjacent and false.
 */
const principals = views.map((v) => ({ home: v, room: mainRoomView(v) }));
const byGlass = [...principals].sort(
  (a, b) => b.room.glazingRatio - a.room.glazingRatio,
);
const extremes = [byGlass[0], byGlass[byGlass.length - 1]];

const cassel = views.find((v) => v.slug === "cassel-avenue")!;
const casselGarden = cassel.floors
  .flatMap((f) => f.rooms)
  .find((r) => r.id === "garden-room")!;
const casselShot = casselGarden.shot!;

export default function FrontPage() {
  const pane = (
    <div>
      <p className="datum text-[0.6875rem] uppercase text-ink-subtle">
        Where the sun goes over {site.town}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Dial arc={jun.arc} label="21 June" />
        <Dial arc={dec.arc} label="21 December" />
      </div>
      <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-muted">
        The orange arc is the sun&rsquo;s path across the compass. In June
        it rises well north of east and sets well north of west, so it
        reaches three-quarters of the way round the house. In December it
        never leaves the southern quarter — {duration(dec.hours)} of it,
        and never more than {Math.round(24.25)}° above the horizon.
      </p>
      <div className="mt-6 border-t border-line pt-5">
        <StripKey states={states} />
      </div>
    </div>
  );

  return (
    <Shell pane={pane}>
      <Band>
        <p className="datum text-[0.75rem] uppercase text-ink-subtle">
          {site.town} · {site.tagline}
        </p>
        <h1 className="head head-display mt-4 max-w-[17ch] text-display">
          Everyone asks which way it faces. Nobody asks when.
        </h1>
        <p className="prose-block mt-6 text-lede leading-relaxed text-ink-muted">
          {site.claim} So we survey the light instead: the compass bearing
          of every window, the height of whatever stands in front of it,
          and the arithmetic that turns those into hours. Six homes, every
          room, three days of the year.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/homes"
            className="focus-ring bg-ink px-5 py-2.5 text-[0.9375rem] text-canvas transition-opacity hover:opacity-85"
          >
            See the six
          </Link>
          <Link
            href="/light"
            className="focus-ring border border-line-strong px-5 py-2.5 text-[0.9375rem] transition-colors hover:border-ink"
          >
            How we measure
          </Link>
        </div>
      </Band>

      {/* The argument, settled by arithmetic rather than asserted. */}
      <Band>
        <h2 className="head text-title">
          A south room gets more sun on the shortest day than on the
          longest
        </h2>
        <div className="prose-block mt-4 space-y-4 text-[1rem] leading-relaxed text-ink-muted">
          <p>
            Four identical rooms, one facing each way, nothing in front of
            any of them. On 21 December the sun stays in the southern
            quarter of the sky all day, so a south window has it from the
            moment it comes up until the moment it goes down —{" "}
            {hoursShort(south.hours.dec)}. On 21 June the sun rises behind
            that room and sets behind it, and the same window gets{" "}
            {hoursShort(south.hours.jun)}.
          </p>
          <p>
            The north room is the same fact from the other side:{" "}
            {hoursShort(north.hours.jun)} in June, when the sun comes up in
            the north-east and goes down in the north-west, and{" "}
            <strong className="font-normal text-ink">
              nothing at all in December
            </strong>
            . Ask about aspect without asking about the month and you have
            asked nothing.
          </p>
        </div>

        <table className="mt-8 w-full max-w-lg border-collapse text-left">
          <thead>
            <tr className="border-b border-line-strong">
              <th className="datum py-2 text-[0.6875rem] uppercase text-ink-subtle">
                Facing
              </th>
              <th className="datum py-2 text-right text-[0.6875rem] uppercase text-ink-subtle">
                21 June
              </th>
              <th className="datum py-2 text-right text-[0.6875rem] uppercase text-ink-subtle">
                22 Sept
              </th>
              <th className="datum py-2 text-right text-[0.6875rem] uppercase text-ink-subtle">
                21 Dec
              </th>
            </tr>
          </thead>
          <tbody>
            {demo.map((d) => (
              <tr key={d.wall} className="border-b border-line">
                <td className="py-2.5 text-[0.9375rem]">{d.name}</td>
                <td className="figure py-2.5 text-right text-[0.9375rem]">
                  {hoursShort(d.hours.jun)}
                </td>
                <td className="figure py-2.5 text-right text-[0.9375rem]">
                  {hoursShort(d.hours.sep)}
                </td>
                <td
                  className={`figure py-2.5 text-right text-[0.9375rem] ${d.hours.dec === 0 ? "text-ink-subtle" : ""}`}
                >
                  {hoursShort(d.hours.dec)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="datum mt-3 text-[0.75rem] text-ink-subtle">
          Hours of direct sun on the glass, at {site.town}&rsquo;s latitude,
          with nothing in the way.
        </p>
      </Band>

      {/* The seductive photograph, undercut by its own timestamp. */}
      <Band>
        <h2 className="head text-title">
          This is the photograph that sells a house
        </h2>
        <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
          It is also the most expensive home on our books and it has been
          on the market for {cassel.listedDaysAgo} days. Every photograph
          on this site carries the hour it was taken, because that is the
          fact a listing photograph is designed to leave out.
        </p>
        <Plate
          className="mt-7"
          src={photos[casselShot.file]}
          alt={casselShot.alt}
          aspect={`${photos[casselShot.file].width} / ${photos[casselShot.file].height}`}
          sizes="(min-width: 1024px) 44rem, 100vw"
          width="max-w-[44rem]"
          priority
          hour={`${clock(casselShot.hour)}, ${monthDay(casselShot.month, casselShot.day)}`}
          caption={casselShot.caption}
        />
        <p className="prose-block mt-6 text-[1rem] leading-relaxed text-ink-muted">
          The garden room at {cassel.address} takes no direct sun for{" "}
          {casselGarden.darkDays} days of the year, and it is the most
          generously glazed room in this listing.{" "}
          <Link href={`/homes/${cassel.slug}`} className="focus-ring underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            The rest of that house
          </Link>{" "}
          is more complicated than that, which is rather the point.
        </p>
      </Band>

      {/* Emergent, not authored. */}
      <Band>
        <h2 className="head text-title">More glass, less sun</h2>
        <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
          Across the six rooms these houses are actually lived in, glass
          and winter sun run in opposite directions. The most generously
          glazed of them — nearly a quarter of its floor area in glass —
          takes no direct sun at all on the shortest day. The least glazed
          takes the whole of it, sunrise to sunset. Nobody arranged that;
          it is what happens when glass goes where the view is and the sun
          is somewhere else.
        </p>
        <ul className="mt-7 grid gap-px bg-line sm:grid-cols-2">
          {extremes.map(({ home, room }) => (
            <li key={`${home.slug}-${room.id}`} className="bg-surface p-5">
              <p className="datum text-[0.6875rem] uppercase text-ink-subtle">
                {home.address}
              </p>
              <h3 className="head head-small mt-2 text-[1.125rem]">
                <Link
                  href={`/homes/${home.slug}`}
                  className="focus-ring hover:text-sun"
                >
                  {room.name}
                </Link>
              </h3>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                <Stat
                  value={`${Math.round(room.glazingRatio * 100)}%`}
                  label="glass to floor"
                />
                <Stat
                  value={hoursShort(room.seasons.dec.hours)}
                  label="sun, 21 Dec"
                  tone={room.seasons.dec.hours === 0 ? "muted" : "sun"}
                />
              </div>
            </li>
          ))}
        </ul>
      </Band>

      {/* The list, sorted by the column it prints. */}
      <Band last>
        <h2 className="head text-title">Six homes, coldest month first</h2>
        <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
          Hours of direct sun on 21 December, averaged across the floor
          area of every habitable room — so a big house cannot win by
          being big, and one enormous dark room cannot hide behind six
          small bright ones.
        </p>
        <ul className="mt-7 divide-y divide-line border-y border-line">
          {views.map((v) => {
            const main = mainRoomView(v);
            return (
              <li key={v.slug}>
                <Link
                  href={`/homes/${v.slug}`}
                  className="focus-ring group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5 transition-colors hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="head head-small block text-[1.25rem] group-hover:text-sun">
                      {v.address}
                    </span>
                    <span className="datum mt-1 block text-[0.75rem] uppercase text-ink-subtle">
                      {main.name} faces {main.compass} ·{" "}
                      {hoursShort(main.seasons.dec.hours)} on 21 December
                    </span>
                  </span>
                  <span className="flex shrink-0 items-baseline gap-8">
                    <span className="figure text-[1.125rem] text-ink-muted">
                      {money(v.price)}
                    </span>
                    <span className="figure w-16 text-right text-[1.375rem] text-sun">
                      {hoursShort(v.winterHours)}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Band>
    </Shell>
  );
}
