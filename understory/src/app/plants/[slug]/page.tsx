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
  index,
  longestRun,
  overlapWeeks,
  scoreAt,
  seasonOf,
  whatsOn,
  windowLength,
} from "@/lib/season";

const ix = index(collection);

export function generateStaticParams() {
  return collection.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = ix.bySlug.get(slug);
  return a ? { title: a.name } : {};
}

export default async function Plant({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const accession = ix.bySlug.get(slug);
  if (!accession) notFound();

  const scores = Array.from({ length: WEEKS }, (_, i) => scoreAt(accession, i + 1));
  const out = seasonOf(ix, slug);
  const run = longestRun(out);
  const area = areas.find((a) => a.slug === accession.area);
  const photo = accession.photo ? photos.find((p) => p.key === accession.photo) : undefined;

  /* What else is out when this is at its best. Not a curated list — the
     same `whatsOn` the wall uses, filtered to exclude itself. */
  const alongside = whatsOn(ix, accession.peak)
    .filter((s) => s.accession.slug !== slug)
    .slice(0, 6);

  /* The most striking thing you cannot combine with this one: the
     highest-strength accession in the collection whose season never
     once overlaps. Computed, not chosen — which is why it is worth
     printing at all. */
  const never = collection
    .filter((b) => b.slug !== slug && b.strength >= 6)
    .filter((b) => overlapWeeks(accession, b).length === 0)
    .sort((a, b) => b.strength - a.strength)[0];

  return (
    <>
      {/* The page is dressed in the season of this plant's own peak. */}
      <SeasonStyle week={accession.peak} />
      <main className="sheet">
        <div className="span-full">
          <SheetNav />
        </div>

        <div className="span-main">
          <div className="label" style={{ color: "var(--color-ink-muted)" }}>
            {accession.id} · {area?.name}
          </div>
          <h1 className="monument binomial" style={{ marginTop: "0.3rem" }}>
            {accession.name}
          </h1>
          {accession.common ? (
            <p className="display" style={{ fontSize: "var(--text-title)", marginTop: "0.7rem" }}>
              {accession.common}
            </p>
          ) : null}
          <p className="prose-note" style={{ marginTop: "1.4rem", fontSize: "1.0625rem" }}>
            {accession.note}
          </p>
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
                background: accession.colour,
              }}
            >
              <Plate
                photo={photo.key}
                alt={photo.alt}
                priority
                sizes="(max-width: 56rem) 100vw, 32vw"
              />
            </div>
          ) : (
            <div
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "clamp(0.4rem, 0.7vw, 0.75rem)",
                background: accession.colour,
                marginBottom: "1rem",
              }}
              /* Not a missing photograph — the colour of the thing
                 itself, which is a fact the collection records. §5:
                 draw it, do not fake a picture of it. */
              aria-hidden="true"
            />
          )}
          <dl className="facts panel">
            <dt>Family</dt>
            <dd>{accession.family}</dd>
            <dt>Where</dt>
            <dd>
              <a href={`/areas/${accession.area}`} className="link-quiet">
                {area?.name}
              </a>
            </dd>
            <dt>Planted</dt>
            <dd className="figure">{accession.planted}</dd>
            <dt>Origin</dt>
            <dd>{accession.origin}</dd>
            <dt>In season</dt>
            <dd className="figure">
              {weekLabel(accession.from)} — {weekLabel(accession.to)}
            </dd>
            <dt>At its best</dt>
            <dd className="figure">
              Week {accession.peak}, {weekLabel(accession.peak)}
            </dd>
            <dt>Strength</dt>
            <dd className="figure">{accession.strength} of 10</dd>
          </dl>
        </div>

        <section className="span-full" style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
          <h2 className="display" style={{ fontSize: "var(--text-title)" }}>
            Above the bar for{" "}
            <span className="figure">{out.length}</span>{" "}
            {out.length === 1 ? "week" : "weeks"} of {WEEKS}
          </h2>
          <p className="prose-note" style={{ color: "var(--color-ink-muted)", margin: "0.5rem 0 1.2rem" }}>
            {out.length === 0 ? (
              <>
                Never. This is in the collection and it is never the reason to
                come — which does not make it the least important thing here.
              </>
            ) : (
              <>
                Its window runs {windowLength(accession)} weeks; it clears the
                threshold for {out.length} of them
                {run ? (
                  <>
                    , from week {run.from} to week {run.to}
                  </>
                ) : null}
                . The two numbers differ because a strong plant is worth seeing
                at the edges of its season and a modest one is not.
              </>
            )}
          </p>
          <SeasonStrip
            scores={scores}
            max={Math.max(WORTH_SEEING, ...scores)}
            hue={accession.peak}
          />
        </section>

        {alongside.length > 0 ? (
          <section className="span-main" style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
            <h2 className="display" style={{ fontSize: "var(--text-title)" }}>
              Out at the same moment
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.8rem 0 0" }}>
              {alongside.map((s) => (
                <li
                  key={s.accession.slug}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--color-line)",
                  }}
                >
                  <a href={`/plants/${s.accession.slug}`} className="link-quiet binomial">
                    {s.accession.name}
                  </a>
                  <span className="figure" style={{ color: "var(--color-ink-muted)" }}>
                    {s.score.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {never ? (
          <section className="span-side" style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
            <div className="panel">
              <div className="label" style={{ color: "var(--color-ink-muted)" }}>
                You cannot see both
              </div>
              <p style={{ marginTop: "0.5rem", textWrap: "pretty" }}>
                There is no week of the year in which this and{" "}
                <a href={`/plants/${never.slug}`} className="link-quiet binomial">
                  {never.name}
                </a>{" "}
                are both above the bar. Not a scheduling problem — they simply
                do not coincide, and no visit can contain both.
              </p>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
