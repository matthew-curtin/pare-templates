import { SheetNav } from "@/components/masthead";
import { SeasonStyle } from "@/components/season-style";
import { areas } from "@/content/areas";
import { collection } from "@/content/collection";
import { site, visiting, visitors } from "@/content/site";
import { WEEKS, weekLabel } from "@/lib/calendar";
import {
  QUIET_BELOW,
  index,
  peakWeek,
  quietWeeks,
  troughWeek,
  weekValue,
  yearCurve,
} from "@/lib/season";

export const metadata = { title: "Visiting" };

const ix = index(collection);
const curve = yearCurve(ix);
const peak = peakWeek(ix);
const trough = troughWeek(ix);
const quiet = quietWeeks(ix);
const busiest = visitors.indexOf(Math.max(...visitors)) + 1;

/* The line that gives the whole site away, computed rather than
   asserted: rank every week by how good the garden is, then count the
   visitors who came in the best ten and in the worst ten. They are the
   same to within a few hundred people, which means arrival here is
   uncorrelated with whether there is anything to see. */
const ranked = curve
  .map((v, i) => ({ v, week: i + 1 }))
  .sort((a, b) => b.v - a.v);
const inBestTen = ranked.slice(0, 10).reduce((s, r) => s + visitors[r.week - 1], 0);
const inWorstTen = ranked.slice(-10).reduce((s, r) => s + visitors[r.week - 1], 0);

export default function Visit() {
  return (
    <>
      <SeasonStyle week={site.thisWeek} />
      <main className="sheet">
        <div className="span-full">
          <SheetNav />
        </div>

        <div className="span-main">
          <h1 className="monument">Visiting</h1>
          <p className="prose-note" style={{ marginTop: "1.2rem", fontSize: "1.0625rem" }}>
            {site.hectares} hectares, nine staff, and a single-track road at the
            end of it. Everything below is true in every month; when to come is
            a separate question and the rest of this site is about it.
          </p>

          <dl className="facts panel" style={{ marginTop: "1.6rem" }}>
            {visiting.map((v) => (
              <div key={v.label} style={{ display: "contents" }}>
                <dt>{v.label}</dt>
                <dd>{v.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="span-side">
          <div className="panel">
            <div className="label" style={{ color: "var(--color-ink-muted)" }}>
              If you can only come once
            </div>
            <p style={{ marginTop: "0.5rem", textWrap: "pretty" }}>
              Week {peak} —{" "}
              <a href={`/week/${peak}`} className="link-quiet">
                {weekLabel(peak)}
              </a>
              . Nothing else is close. Second best is a fortnight either side of
              it, and after that the last week of October.
            </p>
            <hr className="rule" style={{ margin: "1rem 0" }} />
            <div className="label" style={{ color: "var(--color-ink-muted)" }}>
              Weeks we would rather you did not drive for
            </div>
            <p className="figure" style={{ marginTop: "0.5rem" }}>
              {quiet.length} of {WEEKS}
            </p>
            <p style={{ textWrap: "pretty", color: "var(--color-ink-muted)" }}>
              Fewer than {QUIET_BELOW} things above the bar. The worst is week{" "}
              <a href={`/week/${trough}`} className="link-quiet">
                {trough}
              </a>
              , {weekLabel(trough)}, at{" "}
              <span className="figure">{weekValue(ix, trough).toFixed(1)}</span> against
              March&rsquo;s <span className="figure">{curve[peak - 1].toFixed(1)}</span>.
            </p>
          </div>
        </div>

        <section
          className="span-full panel"
          style={{
            marginTop: "clamp(1.5rem, 4vw, 3rem)",
            background: "var(--color-ink)",
            color: "var(--color-ground)",
          }}
        >
          <h2 className="display" style={{ fontSize: "var(--text-display)", maxWidth: "24ch" }}>
            More of you come in the garden&rsquo;s ten worst weeks than in its
            ten best
          </h2>
          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(11rem, 1fr))",
              marginTop: "1.6rem",
            }}
          >
            <div>
              <div className="monument" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                {inBestTen.toLocaleString("en-GB")}
              </div>
              <div className="label" style={{ opacity: 0.7 }}>
                visitors in the ten best weeks
              </div>
            </div>
            <div>
              <div className="monument" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                {inWorstTen.toLocaleString("en-GB")}
              </div>
              <div className="label" style={{ opacity: 0.7 }}>
                visitors in the ten worst weeks
              </div>
            </div>
            <div>
              <div className="monument" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                {busiest}
              </div>
              <div className="label" style={{ opacity: 0.7 }}>
                busiest week — the garden is at{" "}
                {Math.round((curve[busiest - 1] / curve[peak - 1]) * 100)}% of its best
              </div>
            </div>
          </div>
          <p className="prose-note" style={{ marginTop: "1.6rem", opacity: 0.82 }}>
            We are not complaining about it. People come when the schools are
            shut and the road is dry, which is the right decision for a family
            and has nothing to do with magnolias. But it is why this website is
            built the way it is, and why the first thing on it is a number
            telling you how far short of March you are standing.
          </p>
        </section>

        <section className="span-full" style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
          <h2 className="display" style={{ fontSize: "var(--text-title)" }}>
            Six areas, and how long each takes
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0" }}>
            {areas.map((a) => (
              <li
                key={a.slug}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem 1rem",
                  justifyContent: "space-between",
                  padding: "0.6rem 0",
                  borderBottom: "1px solid var(--color-line)",
                }}
              >
                <a href={`/areas/${a.slug}`} className="link-quiet">
                  {a.name}
                </a>
                <span className="figure" style={{ color: "var(--color-ink-muted)" }}>
                  {a.minutes} min
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
