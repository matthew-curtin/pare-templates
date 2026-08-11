import { Masthead } from "@/components/masthead";
import { SeasonStyle } from "@/components/season-style";
import { Tile } from "@/components/tile";
import { YearRail } from "@/components/year-rail";
import { collection } from "@/content/collection";
import { site, visitors, yearNotes } from "@/content/site";
import { weekLabel, weeksBetween } from "@/lib/calendar";
import { seasonName } from "@/lib/ground";
import {
  QUIET_BELOW,
  index,
  peakWeek,
  quietWeeks,
  troughWeek,
  weekValue,
  whatsOn,
  yearCurve,
} from "@/lib/season";

const ix = index(collection);
const curve = yearCurve(ix);
const peak = peakWeek(ix);
const trough = troughWeek(ix);
const quiet = quietWeeks(ix);
const maxValue = Math.max(...curve);
const maxVisitors = Math.max(...visitors);

/**
 * The wall for one week — the front page and every `/week/N` are this
 * component with a different integer.
 *
 * There is no page column and no chrome layer. The masthead, the state
 * of the week and the notes are all CELLS, in the same dense grid as
 * the plants, competing for the same space. In the third week of March
 * the garden's own name is a small tile in the corner of a wall full of
 * magnolia, which is the correct order of importance and not one any
 * institution would choose for itself.
 */
export function WeekView({ week }: { week: number }) {
  const showing = whatsOn(ix, week);
  const value = weekValue(ix, week);
  const share = Math.round((value / curve[peak - 1]) * 100);
  const note = yearNotes.find((n) => n.week === week);
  const isQuiet = showing.length < QUIET_BELOW;
  const away = weeksBetween(week, peak);

  return (
    <>
      <SeasonStyle week={week} />
      <main>
        <div className="wall">
          <Masthead cols={2} rows={1} />

          {/* The state of the week, as one number. The percentage is the
              site's whole thesis in a single figure, and it is the only
              thing on the page set at monument size — including on the
              week where it reads 19%. */}
          <div
            className="cell cell-prose"
            style={
              {
                "--cols": 2,
                "--rows": 2,
                viewTransitionName: "state",
                justifyContent: "space-between",
              } as React.CSSProperties
            }
          >
            <div>
              <div className="label" style={{ color: "var(--color-ink-muted)" }}>
                Week {week} · {weekLabel(week)}
              </div>
              <div className="monument" style={{ marginTop: "0.35rem" }}>
                {share}%
              </div>
            </div>
            <p className="prose-note" style={{ color: "var(--color-ink-muted)" }}>
              of what this garden is worth in its best week, which is week {peak}
              {week === peak ? " — this one" : `, ${away} weeks ${week < peak || week - peak > 26 ? "away" : "ago"}`}.
              {" "}
              <strong style={{ color: "var(--color-ink)" }}>
                {showing.length} {showing.length === 1 ? "thing" : "things"}
              </strong>{" "}
              above the bar. The colour of this page is {seasonName(week)}.
            </p>
          </div>

          {note ? (
            <div
              className="cell cell-flare cell-prose"
              style={
                {
                  "--cols": 3,
                  "--rows": 1,
                  justifyContent: "center",
                } as React.CSSProperties
              }
            >
              <p className="prose-note" style={{ textWrap: "pretty", maxWidth: "52ch" }}>
                {note.text}
              </p>
            </div>
          ) : null}

          {isQuiet ? (
            <div
              className="cell cell-prose"
              style={
                {
                  "--cols": 2,
                  // Two rows, because at one row the last line — which
                  // is the link to the week you should come instead —
                  // was cut off by the cell's own overflow, and a
                  // scrollbar inside a 140px tile is not a fix.
                  "--rows": 2,
                  background: "var(--color-thin)",
                  color: "white",
                } as React.CSSProperties
              }
            >
              <div className="label">A thin week</div>
              <p style={{ textWrap: "pretty" }}>
                Fewer than {QUIET_BELOW} things are worth walking to.
              </p>
              <p style={{ textWrap: "pretty", marginTop: "auto" }}>
                Best:{" "}
                <a href={`/week/${peak}`} className="link-quiet">
                  week {peak}
                </a>
                . Worst:{" "}
                <a href={`/week/${trough}`} className="link-quiet">
                  week {trough}
                </a>
                .
              </p>
            </div>
          ) : null}

          {showing.map((s, i) => (
            <Tile
              key={s.accession.slug}
              accession={s.accession}
              score={s.score}
              priority={i < 3}
            />
          ))}

          {showing.length === 0 ? (
            <div
              className="cell cell-prose"
              style={{ "--cols": 3, "--rows": 1 } as React.CSSProperties}
            >
              <p className="display" style={{ fontSize: "var(--text-title)" }}>
                Nothing is above the bar this week. That is not a mistake in the
                page.
              </p>
            </div>
          ) : null}
        </div>

        {/* ── The year, below the wall ───────────────────────────── */}
        <section
          style={{
            padding: "clamp(2rem, 5vw, 4rem) clamp(0.6rem, 2vw, 2rem) clamp(3rem, 6vw, 5rem)",
            display: "grid",
            gap: "clamp(1.25rem, 3vw, 2.25rem)",
          }}
        >
          <h2 className="display" style={{ fontSize: "var(--text-display)", maxWidth: "18ch" }}>
            The year, and when people actually come
          </h2>

          <YearRail
            values={curve}
            current={week}
            max={maxValue}
            label={`Worth seeing — peak week ${peak}, trough week ${trough}`}
          />
          <YearRail
            values={visitors}
            current={week}
            max={maxVisitors}
            label={`Visitors through the gate — peak week ${visitors.indexOf(maxVisitors) + 1}`}
            showMonths
            mono
          />

          <p className="prose-note" style={{ color: "var(--color-ink-muted)" }}>
            Two rails rather than two lines on one chart, because interest and
            visitors are different units and drawing them on a shared axis would
            invent a relationship. The one that is really there is visible
            anyway: the peaks are {weeksBetween(peak, visitors.indexOf(maxVisitors) + 1)}{" "}
            weeks apart.
          </p>

          {/* §4b: a chart must never be the only place a value can be
              read. Fifty-two rows is a lot to put on a page unasked, so
              they are behind a disclosure rather than behind a tooltip —
              a tooltip is not a way to read a number, it is a way to
              read one number at a time. */}
          <details>
            <summary className="label" style={{ cursor: "pointer" }}>
              The same thing as a table, all 52 weeks
            </summary>
            <div style={{ overflowX: "auto", minWidth: 0, marginTop: "1rem" }}>
              <table style={{ borderCollapse: "collapse", fontSize: "var(--text-small)" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    {["Week", "Dates", "Above the bar", "Worth", "Visitors"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.35rem 1rem 0.35rem 0",
                          borderBottom: "1px solid var(--color-line)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {curve.map((v, i) => {
                    const w = i + 1;
                    return (
                      <tr key={w} style={{ background: w === week ? "var(--color-sunk)" : undefined }}>
                        <td style={{ padding: "0.25rem 1rem 0.25rem 0" }}>
                          <a href={`/week/${w}`} className="link-quiet figure">
                            {w}
                          </a>
                        </td>
                        <td style={{ padding: "0.25rem 1rem 0.25rem 0", whiteSpace: "nowrap" }}>
                          {weekLabel(w)}
                        </td>
                        <td className="figure" style={{ padding: "0.25rem 1rem 0.25rem 0" }}>
                          {whatsOn(ix, w).length}
                          {quiet.includes(w) ? (
                            <span style={{ color: "var(--color-thin)" }}> · thin</span>
                          ) : null}
                        </td>
                        <td className="figure" style={{ padding: "0.25rem 1rem 0.25rem 0" }}>
                          {v.toFixed(1)}
                        </td>
                        <td className="figure" style={{ padding: "0.25rem 1rem 0.25rem 0" }}>
                          {visitors[i].toLocaleString("en-GB")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>

          <footer
            className="prose-note"
            style={{
              color: "var(--color-ink-muted)",
              fontSize: "var(--text-small)",
              borderTop: "1px solid var(--color-line)",
              paddingTop: "1rem",
            }}
          >
            {site.footer}
          </footer>
        </section>
      </main>
    </>
  );
}
