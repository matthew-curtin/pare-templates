import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Band } from "@/components/shell";
import { Dial } from "@/components/dial";
import { Plate } from "@/components/plate";
import { StripKey } from "@/components/strip";
import { homes } from "@/content/homes";
import { footerNote, site, states } from "@/content/site";
import { dayFacts, toView } from "@/lib/view";
import { photos } from "@/photos";
import { clock, monthDay } from "@/lib/format";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why a brokerage would publish the thing every other brokerage leaves out, and what it does to a vendor's listing.",
};

const ferry = toView(homes.find((h) => h.slug === "ferry-lane")!);
const shot = ferry.floors
  .flatMap((f) => f.rooms)
  .find((r) => r.shot !== null)!.shot!;

export default function AboutPage() {
  const jun = dayFacts("jun");
  const sep = dayFacts("sep");
  const dec = dayFacts("dec");

  const pane = (
    <div>
      <p className="datum text-[0.6875rem] uppercase text-ink-subtle">
        Three days, one compass
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Dial arc={jun.arc} label="June" />
        <Dial arc={sep.arc} label="September" />
        <Dial arc={dec.arc} label="December" />
      </div>
      <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-muted">
        Everything this office does is downstream of these three
        drawings. The house does not move; the sun does.
      </p>
      <div className="mt-6 border-t border-line pt-5">
        <StripKey states={states} />
      </div>
    </div>
  );

  return (
    <Shell pane={pane}>
      <Band>
        <h1 className="head head-display max-w-[16ch] text-display">
          We publish the thing the photographs leave out
        </h1>
        <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
          {site.name} sells six houses at a time in {site.town} and
          surveys the light in every room of every one of them before it
          goes on the market. Not because it is a clever piece of
          marketing — it costs us listings — but because it is the single
          question every buyer asks and no listing answers.
        </p>
      </Band>

      <Band>
        <h2 className="head text-title">What a vendor is agreeing to</h2>
        <div className="prose-block mt-4 space-y-4 text-[1rem] leading-relaxed text-ink-muted">
          <p>
            The survey goes up whatever it says. If the principal room has
            no direct sun for half the year, the listing says so on the
            first screen, in the same size type as the price. Two vendors
            have withdrawn over it and we would do the same again.
          </p>
          <p>
            The argument for it is not moral, it is commercial. A house
            photographed in June and viewed in November generates offers
            that fall through in the survey and viewings from people who
            were never going to buy it. A house whose worst month is
            printed on the page gets fewer viewings and more of them are
            from people who have already decided they can live with it.
          </p>
          <p>
            The one thing we will not do is grade a house. There is no
            score on this site and no room is described as good or bad. A
            north bedroom is an excellent bedroom and a north kitchen is a
            long February — and which of those you are buying is not a
            judgement an office can make on your behalf.
          </p>
        </div>
      </Band>

      <Band>
        <Plate
          src={photos[shot.file]}
          alt={shot.alt}
          aspect={`${photos[shot.file].width} / ${photos[shot.file].height}`}
          sizes="(min-width: 1024px) 40rem, 100vw"
          width="max-w-[40rem]"
          hour={`${clock(shot.hour)}, ${monthDay(shot.month, shot.day)}`}
          caption={shot.caption}
        />
      </Band>

      <Band last>
        <h2 className="head text-title">The office</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            ["Where", site.office],
            ["Telephone", site.phone],
            ["Email", site.email],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="datum text-[0.6875rem] uppercase text-ink-subtle">
                {k}
              </dt>
              <dd className="datum mt-1.5 text-[0.9375rem]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="prose-block mt-9 text-[0.875rem] leading-relaxed text-ink-subtle">
          {footerNote} The arithmetic, though, is real — you can check it
          against any almanac for 42.3° north.{" "}
          <Link
            href="/light"
            className="focus-ring underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            How we measure
          </Link>
          .
        </p>
      </Band>
    </Shell>
  );
}
