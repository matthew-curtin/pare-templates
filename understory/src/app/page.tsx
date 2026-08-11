import { WeekView } from "@/components/week-view";
import { site } from "@/content/site";

/**
 * The front page is the pinned week — 16 to 22 August — and that is an
 * argument rather than a default. It is the week more people come to
 * this garden than any other and it is nowhere near its best, so the
 * first thing a visitor sees is a thin wall with a large number on it
 * saying how far short of March they are standing.
 */
export default function Home() {
  return <WeekView week={site.thisWeek} />;
}
