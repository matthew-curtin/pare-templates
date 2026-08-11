import { notFound } from "next/navigation";

import { SheetNav } from "@/components/masthead";
import { Plate } from "@/components/plate";
import { SeasonStrip } from "@/components/season-strip";
import { SeasonStyle } from "@/components/season-style";
import { areas } from "@/content/areas";
import { collection } from "@/content/collection";
import { photos } from "@/content/photos";
import { WEEKS, weekLabel } from "@/lib/calendar";
import {
  WORTH_SEEING,
  gapsFor,
  index,
  isOut,
  longestRun,
  scoreAt,
} from "@/lib/season";

const ix = index(collection);

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = areas.find((x) => x.slug === slug);
  return a ? { title: a.name } : {};
}

export default async function Area({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  const plants = ix.byArea.get(slug) ?? [];
  const curve = Array.from({ length: WEEKS }, (_, i) =>
    plants.reduce((sum, p) => sum + (isOut(p, i + 1) ? scoreAt(p, i + 1) : 0), 0),
  );
  let best = 0;
  for (let i = 1; i < curve.length; i += 1) if (curve[i] > curve[best]) best = i;
  const bestWeek = best + 1;

  const gaps = gapsFor(ix, slug);
  const gapRun = longestRun(gaps);
  const photo = area.photo ? photos.find((p) => p.key === area.photo) : undefined;

  return (
    <>
      <SeasonStyle week={bestWeek} />
      <main className="sheet">
        <div className="span-full">
          <SheetNav />
        </div>

        <div className="span-main">
          <div className="label" style={{ color: "var(--color-ink-muted)" }}>
            {area.where}
          </div>
          <h1 className="monument" style={{ marginTop: "0.3rem" }}>
            {area.name}
          </h1>
          <p className="prose-note" style={{ marginTop: "1.4rem", fontSize: "1.0625rem" }}>
            {area.blurb}
          </p>

          {/* The half a garden's own website never carries. It is not a
              disclaimer bolted on at the end — it sits directly under
              the description, in the same type, because the arithmetic
              underneath the page can work out the number anyway and a
              paragraph that only described May would be contradicted by
              the chart below it. */}
          <div
            className="panel"
            style={{
              marginTop: "1.4rem",
              background: "var(--color-thin)",
              color: "white",
            }}
          >
            <div className="label">Out of season</div>
            <p style={{ marginTop: "0.45rem", textWrap: "pretty" }}>{area.outOfSeason}</p>
            <p className="figure" style={{ marginTop: "0.7rem", opacity: 0.88 }}>
              {gaps.length} of {WEEKS} weeks with nothing above the bar
              {gapRun && gapRun.length > 1 ? (
                <>
                  {" "}
                  · longest stretch {gapRun.length} weeks, from week {gapRun.from} to
                  week {gapRun.to}
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="span-side">
          {photo ? (
            <div
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: "clamp(0.4rem, 0.7vw, 0.75rem)",
                overflow: "hidden",
                marginBottom: "1rem",
                background: "var(--color-sunk)",
              }}
            >
              <Plate
                photo={photo.key}
                alt={photo.alt}
                priority
                sizes="(max-width: 56rem) 100vw, 32vw"
              />
            </div>
          ) : null}
          <dl className="facts panel">
            <dt>Accessions</dt>
            <dd className="figure">{plants.length}</dd>
            <dt>Best week</dt>
            <dd className="figure">
              <a href={`/week/${bestWeek}`} className="link-quiet">
                {bestWeek} · {weekLabel(bestWeek)}
              </a>
            </dd>
            <dt>Allow</dt>
            <dd className="figure">{area.minutes} minutes</dd>
          </dl>
        </div>

        <section className="span-full" style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
          <h2 className="display" style={{ fontSize: "var(--text-title)" }}>
            This area through the year
          </h2>
          <div style={{ marginTop: "1rem" }}>
            <SeasonStrip scores={curve} max={Math.max(1, ...curve)} hue={bestWeek} />
          </div>
        </section>

        <section className="span-full" style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
          <h2 className="display" style={{ fontSize: "var(--text-title)" }}>
            What is planted here
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "1rem 0 0",
              display: "grid",
              gap: "0.1rem",
            }}
          >
            {plants
              .slice()
              .sort((a, b) => a.peak - b.peak)
              .map((p) => (
                <li
                  key={p.slug}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem 1rem",
                    justifyContent: "space-between",
                    padding: "0.55rem 0",
                    borderBottom: "1px solid var(--color-line)",
                  }}
                >
                  <a href={`/plants/${p.slug}`} className="link-quiet binomial">
                    {p.name}
                  </a>
                  <span
                    className="figure"
                    style={{ color: "var(--color-ink-muted)", whiteSpace: "nowrap" }}
                  >
                    {scoreAt(p, p.peak) >= WORTH_SEEING
                      ? `best week ${p.peak}`
                      : "never above the bar"}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </>
  );
}
