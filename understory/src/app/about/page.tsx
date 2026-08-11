import { SheetNav } from "@/components/masthead";
import { SeasonStyle } from "@/components/season-style";
import { collection } from "@/content/collection";
import { site } from "@/content/site";
import { WEEKS, weekLabel } from "@/lib/calendar";
import { ANCHORS, css, flareFor } from "@/lib/ground";
import {
  QUIET_BELOW,
  WORTH_SEEING,
  index,
  peakWeek,
  quietWeeks,
  seasonOf,
  troughWeek,
  yearCurve,
} from "@/lib/season";

export const metadata = { title: "The garden" };

const ix = index(collection);
const curve = yearCurve(ix);
const peak = peakWeek(ix);
const trough = troughWeek(ix);

/* Printed rather than claimed: the plant that takes longest to arrive
   and is above the bar for the shortest time. Found by asking the
   model, not by remembering which one it is. */
const narrowest = collection
  .map((a) => ({ a, weeks: seasonOf(ix, a.slug).length }))
  .filter((x) => x.weeks > 0)
  .sort((x, y) => x.weeks - y.weeks || y.a.strength - x.a.strength)[0];

const widest = collection
  .map((a) => ({ a, weeks: seasonOf(ix, a.slug).length }))
  .sort((x, y) => y.weeks - x.weeks)[0];

const never = collection.filter((a) => seasonOf(ix, a.slug).length === 0);

export default function About() {
  return (
    <>
      <SeasonStyle week={peak} />
      <main className="sheet">
        <div className="span-full">
          <SheetNav />
        </div>

        <div className="span-main">
          <h1 className="monument">{site.full}</h1>
          <p className="prose-note" style={{ marginTop: "1.4rem", fontSize: "1.0625rem" }}>
            {site.blurb}
          </p>
          <p className="prose-note" style={{ marginTop: "1rem" }}>
            {site.founder} bought the ground in {site.founded} with money made
            moving other people&rsquo;s cargo, planted the first rhododendrons
            three years later into a hollow that was already sheltered by oaks
            two centuries old, and died without seeing the big magnolia flower.
            His granddaughter gave the whole estate away in {site.given}. Nine
            people look after it now, which is four fewer than in 1970 and
            eleven fewer than in 1912.
          </p>
        </div>

        <div className="span-side">
          <dl className="facts panel">
            <dt>Founded</dt>
            <dd className="figure">{site.founded}</dd>
            <dt>Given away</dt>
            <dd className="figure">{site.given}</dd>
            <dt>Latitude</dt>
            <dd className="figure">{site.latitude}</dd>
            <dt>Area</dt>
            <dd className="figure">{site.hectares} hectares</dd>
            <dt>Taxa</dt>
            <dd className="figure">{site.taxa.toLocaleString("en-GB")}</dd>
            <dt>On this site</dt>
            <dd className="figure">{collection.length} accessions</dd>
            <dt>Staff</dt>
            <dd className="figure">{site.staff}</dd>
          </dl>
        </div>

        <section className="span-full" style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
          <h2 className="display" style={{ fontSize: "var(--text-display)", maxWidth: "20ch" }}>
            How this website decides what is worth seeing
          </h2>

          <div
            style={{
              display: "grid",
              gap: "clamp(1rem, 2.5vw, 2.5rem)",
              gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
              marginTop: "1.6rem",
            }}
          >
            <div>
              <h3 className="label">Every plant has a window and a peak</h3>
              <p className="prose-note" style={{ marginTop: "0.5rem" }}>
                Three week numbers and a strength out of ten. The strength is a
                judgement and we are making it out loud rather than pretending
                the collection is uniformly wonderful. Between the window&rsquo;s
                edges the score rises to that strength at the peak and falls
                away, never quite to nothing — the first week of the magnolias
                is one flower and it is still worth the drive.
              </p>
            </div>
            <div>
              <h3 className="label">
                The bar is <span className="figure">{WORTH_SEEING}</span>
              </h3>
              <p className="prose-note" style={{ marginTop: "0.5rem" }}>
                Below it, a thing is not worth crossing the garden for. This is
                why &ldquo;how long is it worth seeing&rdquo; is shorter than
                &ldquo;how long is it in flower&rdquo;, and why the two differ
                more for a modest plant than a great one. {widest.a.common ??
                  widest.a.name}{" "}
                clears it for {widest.weeks} weeks;{" "}
                <a href={`/plants/${narrowest.a.slug}`} className="link-quiet binomial">
                  {narrowest.a.name}
                </a>{" "}
                for {narrowest.weeks}.
              </p>
            </div>
            <div>
              <h3 className="label">Nothing is promoted by hand</h3>
              <p className="prose-note" style={{ marginTop: "0.5rem" }}>
                There is no &ldquo;featured&rdquo; field anywhere in this
                site&rsquo;s content. A tile on the wall is big because its score
                that week is high, and for no other reason, which is why the
                front page in the third week of March looks nothing like the
                front page in the third week of September.
              </p>
            </div>
            <div>
              <h3 className="label">A week with fewer than {QUIET_BELOW} things is a thin week</h3>
              <p className="prose-note" style={{ marginTop: "0.5rem" }}>
                {quietWeeks(ix).length} of the {WEEKS} qualify. The best is week{" "}
                <a href={`/week/${peak}`} className="link-quiet">
                  {peak}
                </a>{" "}
                ({weekLabel(peak)}) at{" "}
                <span className="figure">{curve[peak - 1].toFixed(1)}</span>; the worst
                is week{" "}
                <a href={`/week/${trough}`} className="link-quiet">
                  {trough}
                </a>{" "}
                ({weekLabel(trough)}) at{" "}
                <span className="figure">{curve[trough - 1].toFixed(1)}</span>, which is
                a factor of{" "}
                <span className="figure">
                  {(curve[peak - 1] / curve[trough - 1]).toFixed(1)}
                </span>
                . We expected the worst week to be in the winter. It is not.
              </p>
            </div>
          </div>
        </section>

        {never.length > 0 ? (
          <section className="span-full panel" style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
            <h3 className="display" style={{ fontSize: "var(--text-title)" }}>
              And one thing that never clears the bar at all
            </h3>
            <p className="prose-note" style={{ marginTop: "0.6rem" }}>
              <a href={`/plants/${never[0].slug}`} className="link-quiet binomial">
                {never[0].name}
              </a>{" "}
              — {never[0].note}
            </p>
          </section>
        ) : null}

        <section className="span-full" style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
          <h2 className="display" style={{ fontSize: "var(--text-display)", maxWidth: "20ch" }}>
            The colour of this page is the week you are looking at
          </h2>
          <p className="prose-note" style={{ marginTop: "0.8rem" }}>
            Eight anchor colours, one for each thing this garden actually is at
            some point in the year, interpolated per week. Every page names the
            week it is ABOUT rather than the week it is — so a plant&rsquo;s own
            page is dressed in the season of its peak, and the blue poppy is
            blue. Mixed in a rectangular colour space rather than a polar one,
            because the arc between a rose ground and a green one goes through
            violet, and a page that turns lavender in April for no reason is a
            bug nobody would ever file.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "1.6rem 0 0",
              display: "grid",
              gap: "0.6rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
            }}
          >
            {ANCHORS.map((a) => (
              <li key={a.name}>
                <a
                  href={`/week/${a.week}`}
                  style={{
                    display: "block",
                    height: "3.5rem",
                    borderRadius: "0.4rem",
                    background: css(flareFor(a.week)),
                  }}
                  aria-label={`Week ${a.week}, ${a.name}`}
                />
                <div className="label" style={{ marginTop: "0.4rem" }}>
                  {a.name}
                </div>
                <div
                  className="figure"
                  style={{ color: "var(--color-ink-muted)", fontSize: "var(--text-small)" }}
                >
                  week {a.week}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer
          className="span-full prose-note"
          style={{
            color: "var(--color-ink-muted)",
            fontSize: "var(--text-small)",
            borderTop: "1px solid var(--color-line)",
            paddingTop: "1rem",
            marginTop: "clamp(2rem, 5vw, 4rem)",
          }}
        >
          {site.footer}
        </footer>
      </main>
    </>
  );
}
