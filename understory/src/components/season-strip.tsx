import { monthNameShort, weekLabel, weeksInMonth } from "@/lib/calendar";
import { css, flareFor } from "@/lib/ground";
import { WORTH_SEEING } from "@/lib/season";

/**
 * One plant's year: 52 cells, each as tall as the plant is worth that
 * week, and coloured only where it clears the bar.
 *
 * It is the same picture as the year rail on the front page, drawn for
 * a single accession, which is what makes the two comparable by eye —
 * and it is the reason a window that wraps the new year reads correctly
 * rather than as two separate seasons at opposite ends of a chart. The
 * witch hazel's bar runs off the right-hand end and picks up again on
 * the left, which is what actually happens.
 */
export function SeasonStrip({
  scores,
  max,
  hue,
}: {
  scores: number[];
  max: number;
  /** Week to take the bar colour from — the plant's own peak, so the
   *  strip is drawn in the colour of the season it belongs to. */
  hue: number;
}) {
  return (
    <div>
      <div className="season-strip">
        {scores.map((v, i) => {
          const out = v >= WORTH_SEEING;
          return (
            <a
              key={i}
              href={`/week/${i + 1}`}
              className="season-cell"
              data-out={out ? "true" : "false"}
              aria-label={`Week ${i + 1}, ${weekLabel(i + 1)}`}
              style={
                {
                  "--fill": `${Math.max(6, (v / max) * 100)}%`,
                  "--bar": css(flareFor(hue)),
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
      <div className="rail" style={{ marginTop: "0.35rem" }}>
        {Array.from({ length: 12 }, (_, m) => (
          <div
            key={m}
            className="label"
            style={{
              gridColumn: `span ${weeksInMonth(m + 1).length}`,
              color: "var(--color-ink-muted)",
              borderTop: "1px solid var(--color-line)",
              paddingTop: "0.25rem",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {monthNameShort(m + 1)}
          </div>
        ))}
      </div>
    </div>
  );
}
