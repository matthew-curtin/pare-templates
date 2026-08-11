import { SheetNav } from "@/components/masthead";
import { Planner } from "@/components/planner";
import { SeasonStyle } from "@/components/season-style";
import { collection } from "@/content/collection";
import { site } from "@/content/site";
import { index, peakWeek } from "@/lib/season";

export const metadata = { title: "Plan a visit" };

const ix = index(collection);

export default function Plan() {
  return (
    <>
      <SeasonStyle week={peakWeek(ix)} />
      <main className="sheet">
        <div className="span-full">
          <SheetNav />
        </div>
        <div className="span-full">
          <h1 className="monument">One visit</h1>
          <p className="prose-note" style={{ marginTop: "1.2rem", fontSize: "1.0625rem" }}>
            Most people who come to {site.name} come once. So the useful question
            is not what is here, it is which single week to spend — and the
            answer is almost never the week that has everything, because there
            is no such week.
          </p>
          <Planner />
        </div>
      </main>
    </>
  );
}
