import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Band } from "@/components/shell";
import { Dial } from "@/components/dial";
import { Strip, StripKey } from "@/components/strip";
import { homes } from "@/content/homes";
import { geo, method, seasons, site, states } from "@/content/site";
import { aspectDemo, dayFacts, toView } from "@/lib/view";
import { clock, duration, hoursShort } from "@/lib/format";
import { sunPosition } from "@/lib/sun";

export const metadata: Metadata = {
  title: "How we measure",
  description:
    "The arithmetic behind every figure on this site: solar position at 42.3° north, the compass bearing of each window, and the height of whatever stands in front of it.",
};

const demo = aspectDemo();
const hollow = toView(homes.find((h) => h.slug === "hollow-road")!);
const hollowLiving = hollow.floors
  .flatMap((f) => f.rooms)
  .find((r) => r.id === "living")!;
const hollowBed = hollow.floors
  .flatMap((f) => f.rooms)
  .find((r) => r.id === "bed-main")!;

export default function LightPage() {
  const facts = seasons.map((s) => ({ season: s, ...dayFacts(s.key) }));
  const dec = facts.find((f) => f.season.key === "dec")!;
  const jun = facts.find((f) => f.season.key === "jun")!;
  const maxDec = sunPosition(dec.doy, 12, geo.latitude).altitude;
  const maxJun = sunPosition(jun.doy, 12, geo.latitude).altitude;

  const pane = (
    <div>
      <p className="datum text-[0.6875rem] uppercase text-ink-subtle">
        {geo.latitude}° north, {Math.abs(geo.longitude)}° west
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {facts.map((f) => (
          <Dial key={f.season.key} arc={f.arc} label={f.season.short} />
        ))}
      </div>
      <dl className="mt-6 space-y-3 text-[0.8125rem]">
        {facts.map((f) => (
          <div key={f.season.key} className="flex justify-between gap-4">
            <dt className="text-ink-muted">{f.season.label}</dt>
            <dd className="datum text-right text-ink">
              {clock(f.sunrise)} – {clock(f.sunset)}
              <span className="block text-ink-subtle">{duration(f.hours)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 border-t border-line pt-5">
        <StripKey states={states} />
      </div>
    </div>
  );

  return (
    <Shell pane={pane}>
      <Band>
        <h1 className="head head-display max-w-[15ch] text-display">
          The sun&rsquo;s position is arithmetic. So is the rest of it.
        </h1>
        <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
          Nothing on this site is a description of a visit. Given the
          latitude, the compass bearing of a window and the angle of
          whatever stands in front of it, every hour of every day of the
          year can be worked out — including the ones nobody will ever
          book a viewing in.
        </p>
      </Band>

      <Band>
        <h2 className="head text-title">The two numbers everything rests on</h2>
        <div className="mt-7 grid gap-px bg-line sm:grid-cols-2">
          <div className="bg-surface p-6">
            <div className="figure text-[2.25rem] leading-none">
              {maxDec.toFixed(1)}°
            </div>
            <p className="datum mt-2 text-[0.6875rem] uppercase text-ink-subtle">
              highest the sun gets, 21 December
            </p>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-muted">
              Which is lower than a mature conifer forty feet away, lower
              than most two-storey houses across a normal street, and
              lower than the ridge behind {hollow.address}.
            </p>
          </div>
          <div className="bg-surface p-6">
            <div className="figure text-[2.25rem] leading-none">
              {maxJun.toFixed(1)}°
            </div>
            <p className="datum mt-2 text-[0.6875rem] uppercase text-ink-subtle">
              highest the sun gets, 21 June
            </p>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-muted">
              Nearly three times as high, which is why the same obstruction
              that empties a room in December is invisible in June — and
              why every viewing in the spring is a viewing of a different
              house.
            </p>
          </div>
        </div>
      </Band>

      <Band>
        <h2 className="head text-title">Aspect is only half a question</h2>
        <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
          These are four identical rooms with nothing in front of them,
          one facing each way. The surprising column is the last one: due
          south is the only aspect that gets MORE direct sun on the
          shortest day of the year than on the longest, because in June
          the sun rises and sets behind it. The other thing to notice is
          the SPREAD. In June the best aspect beats the worst by about an
          hour and twenty minutes, which is to say aspect barely matters.
          In December it beats it by the entire day.
        </p>
        <ul className="mt-7 space-y-6">
          {demo.map((d) => (
            <li key={d.wall}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="head head-small text-[1.125rem]">
                  {d.name}-facing
                </span>
                <span className="datum text-[0.8125rem] text-ink-subtle">
                  June {hoursShort(d.hours.jun)} · September{" "}
                  {hoursShort(d.hours.sep)} · December{" "}
                  {hoursShort(d.hours.dec)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      <Band>
        <h2 className="head text-title">
          What gets in the way, and why the sun passes between two floors
        </h2>
        <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
          Every obstruction is recorded as an arc of the compass and an
          angle above the horizon, measured on site. Below are two rooms
          in the same house on 21 December, one directly above the other,
          both facing due south. The ground-floor windows see the ridge at
          twenty-six degrees; the first floor sees it at twenty-one. The
          sun tops out at {maxDec.toFixed(1)}°.
        </p>
        <ul className="mt-7 space-y-7">
          {[hollowLiving, hollowBed].map((r) => (
            <li key={r.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="head head-small text-[1.125rem]">
                  {r.name}
                </span>
                <span className="datum text-[0.8125rem] text-ink-subtle">
                  {r.floorName} · ridge at {r.obstruction?.elevation}° ·{" "}
                  {hoursShort(r.seasons.dec.hours)}
                </span>
              </div>
              <div className="mt-2.5">
                <Strip segments={r.seasons.dec.segments} ticks />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.875rem] leading-relaxed text-ink-muted">
          The December sun tops out between those two numbers, which is
          the whole thing: the ground floor never clears the ridge and the
          floor above it does, so one room has a four-hour hole in the
          middle of its day and the room directly above has two gaps of
          about half an hour.{" "}
          <Link
            href={`/homes/${hollow.slug}`}
            className="focus-ring underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            The rest of {hollow.address}
          </Link>
          .
        </p>
      </Band>

      <Band last>
        <h2 className="head text-title">The method, and its limits</h2>
        <dl className="mt-7 space-y-8">
          {method.map((m) => (
            <div key={m.head}>
              <dt className="head head-small text-[1.125rem]">{m.head}</dt>
              <dd className="prose-block mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {m.body}
              </dd>
            </div>
          ))}
        </dl>
        <p className="datum mt-9 text-[0.75rem] uppercase text-ink-subtle">
          {site.town} · {geo.latitude}° N · solar noon at{" "}
          {clock(dec.noon)} in December and {clock(jun.noon)} in June
        </p>
      </Band>
    </Shell>
  );
}
