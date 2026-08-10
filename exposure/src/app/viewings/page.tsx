import type { Metadata } from "next";
import { Shell, Band } from "@/components/shell";
import { Dial } from "@/components/dial";
import { StripKey } from "@/components/strip";
import { ViewingForm, type ViewingOption } from "@/components/viewing-form";
import { homes } from "@/content/homes";
import { site, states } from "@/content/site";
import { dayFacts, mainRoomView, toView, viewingHours } from "@/lib/view";
import { clock, duration } from "@/lib/format";

export const metadata: Metadata = {
  title: "Viewings",
  description:
    "Book a viewing at the hour the house has nothing to show you, which is the hour you find something out.",
};

export default async function ViewingsPage({
  searchParams,
}: {
  searchParams: Promise<{ home?: string }>;
}) {
  const { home } = await searchParams;
  const dec = dayFacts("dec");

  const options: ViewingOption[] = homes.map((h) => {
    const view = toView(h);
    const main = mainRoomView(view);
    const hours = viewingHours(view);
    return {
      slug: view.slug,
      address: view.address,
      mainRoom: main.name,
      compass: main.compass,
      decHours: main.seasons.dec.hours,
      flattering: hours.flattering,
      honest: hours.honest,
    };
  });

  const pane = (
    <div>
      <p className="datum text-[0.6875rem] uppercase text-ink-subtle">
        The shortest day
      </p>
      <div className="mx-auto mt-4 w-36">
        <Dial arc={dec.arc} label="21 December" />
      </div>
      <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-muted">
        Sun up {clock(dec.sunrise)}, down {clock(dec.sunset)} —{" "}
        {duration(dec.hours)}, and about half of those hours are the ones
        nobody views a house in. Every recommendation on this page is
        worked out against this day, because it is the one that decides
        whether you like living somewhere.
      </p>
      <div className="mt-6 border-t border-line pt-5">
        <StripKey states={states} />
      </div>
    </div>
  );

  return (
    <Shell pane={pane}>
      <Band>
        <h1 className="head head-display max-w-[15ch] text-display">
          Come when there is nothing to see
        </h1>
        <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
          Almost every viewing in this county happens between ten and
          three on a weekend, which is the part of the day that flatters a
          house most and tells you least. We would rather you came at the
          hour the principal room is in shade. If you still like it then,
          you will like it in February.
        </p>
      </Band>

      <Band last>
        <ViewingForm options={options} initial={home ?? options[0].slug} />
        <p className="datum mt-9 text-[0.75rem] uppercase text-ink-subtle">
          {site.office} · {site.phone}
        </p>
      </Band>
    </Shell>
  );
}
