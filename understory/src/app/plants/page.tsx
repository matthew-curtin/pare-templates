import { Masthead } from "@/components/masthead";
import { SeasonStyle } from "@/components/season-style";
import { Tile } from "@/components/tile";
import { areas } from "@/content/areas";
import { collection } from "@/content/collection";
import { site } from "@/content/site";
import type { Accession } from "@/content/types";
import { weekLabel } from "@/lib/calendar";
import { KIND_ORDER, WORTH_SEEING, scoreAt } from "@/lib/season";

export const metadata = { title: "The collection" };

const KIND_LABEL: Record<Accession["kind"], string> = {
  flower: "Flower",
  scent: "Scent",
  leaf: "Leaf",
  fruit: "Fruit",
  bark: "Bark",
  form: "Form",
};

function href(area?: string, kind?: string) {
  const p = new URLSearchParams();
  if (area) p.set("area", area);
  if (kind) p.set("kind", kind);
  const q = p.toString();
  return q ? `/plants?${q}` : "/plants";
}

/**
 * The whole collection, on the same wall, sized by what each thing is
 * worth THIS WEEK — so the collection page is not an inventory in
 * alphabetical order, it is the inventory ranked by whether you should
 * bother today. Everything below the bar is still here and still
 * clickable, dimmed rather than hidden, because a garden that only
 * lists what is flowering is the thing this site is arguing against.
 *
 * Filters are links rather than state, so every view has a URL. The
 * combination of an area and a kind it does not contain is reachable —
 * the Shore Walk has nothing scented in it — which is how the empty
 * state gets seen by anybody, including whoever wrote it (§7b).
 */
export default async function Plants({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; kind?: string }>;
}) {
  const { area, kind } = await searchParams;
  const week = site.thisWeek;

  const scored = collection
    .map((a) => ({ accession: a, score: scoreAt(a, week) }))
    .filter((s) => (area ? s.accession.area === area : true))
    .filter((s) => (kind ? s.accession.kind === kind : true))
    .sort(
      (x, y) =>
        y.score - x.score || x.accession.name.localeCompare(y.accession.name),
    );

  const outNow = scored.filter((s) => s.score >= WORTH_SEEING).length;

  return (
    <>
      <SeasonStyle week={week} />
      <main>
        <div className="wall">
          <Masthead cols={2} rows={1} />

          <div
            className="cell cell-prose"
            style={{ "--cols": 3, "--rows": 2 } as React.CSSProperties}
          >
            <h1 className="display" style={{ fontSize: "var(--text-display)" }}>
              {collection.length} accessions
            </h1>
            <p className="prose-note" style={{ color: "var(--color-ink-muted)" }}>
              Ranked by what each one is worth in week {week}, {weekLabel(week)} —
              not by name and not by family. {outNow} of them are above the bar
              today; the rest are here, and dimmed, because that is the honest
              proportion and hiding it would be the whole problem.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "auto" }}>
              <a href={href()} className="chip-link label" data-on={!area && !kind}>
                Everything
              </a>
              {areas.map((a) => (
                <a
                  key={a.slug}
                  href={href(a.slug, kind)}
                  className="chip-link label"
                  data-on={area === a.slug}
                >
                  {a.name}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {KIND_ORDER.map((k) => (
                <a
                  key={k}
                  href={href(area, k)}
                  className="chip-link label"
                  data-on={kind === k}
                >
                  {KIND_LABEL[k]}
                </a>
              ))}
            </div>
          </div>

          {scored.length === 0 ? (
            <div
              className="cell cell-prose"
              style={{ "--cols": 3, "--rows": 1 } as React.CSSProperties}
            >
              <p className="display" style={{ fontSize: "var(--text-title)" }}>
                Nothing in the collection matches that.
              </p>
              <p style={{ color: "var(--color-ink-muted)" }}>
                Some of these combinations are genuinely empty — there is nothing
                scented on the Shore Walk, because nothing scented will grow in
                salt wind.{" "}
                <a href={href()} className="link-quiet">
                  Clear the filters
                </a>
                .
              </p>
            </div>
          ) : null}

          {scored.map((s, i) => (
            <Tile
              key={s.accession.slug}
              accession={s.accession}
              score={s.score}
              dim={s.score < WORTH_SEEING}
              priority={i < 3}
            />
          ))}
        </div>
      </main>
    </>
  );
}
