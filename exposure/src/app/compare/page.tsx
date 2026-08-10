import type { Metadata } from "next";
import { Comparer } from "@/components/comparer";
import { homes } from "@/content/homes";
import { seasons, type SeasonKey } from "@/content/site";
import { dayFacts, toView } from "@/lib/view";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Two homes side by side, room by room, on the same day of the year and the same scale.",
};

export default function ComparePage() {
  const views = homes.map(toView);
  const facts = Object.fromEntries(
    seasons.map((s) => [s.key, dayFacts(s.key)]),
  ) as Record<SeasonKey, ReturnType<typeof dayFacts>>;

  // The cheapest against the most expensive, because that is the
  // comparison the site keeps making and it should be the one already on
  // screen when the page opens.
  const byPrice = [...views].sort((x, y) => x.price - y.price);
  return (
    <Comparer
      views={views}
      facts={facts}
      initial={[byPrice[0].slug, byPrice[byPrice.length - 1].slug]}
    />
  );
}
