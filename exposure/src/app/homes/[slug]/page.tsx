import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeDetail } from "@/components/home-detail";
import { homes, homeBySlug } from "@/content/homes";
import { seasons, type SeasonKey } from "@/content/site";
import { dayFacts, mainRoomView, toView } from "@/lib/view";
import { hoursShort, money } from "@/lib/format";

export function generateStaticParams() {
  return homes.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const home = homeBySlug(slug);
  if (!home) return { title: "Not found" };
  const view = toView(home);
  const main = mainRoomView(view);
  return {
    title: home.address,
    description: `${home.address}, ${money(home.price)}. ${main.name}: ${main.compass}, ${hoursShort(main.seasons.dec.hours)} of direct sun on the shortest day of the year.`,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const home = homeBySlug(slug);
  if (!home) notFound();

  const facts = Object.fromEntries(
    seasons.map((s) => [s.key, dayFacts(s.key)]),
  ) as Record<SeasonKey, ReturnType<typeof dayFacts>>;

  return <HomeDetail view={toView(home)} facts={facts} />;
}
