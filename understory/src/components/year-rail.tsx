import { monthNameShort, weekLabel, weeksInMonth } from "@/lib/calendar";
import { css, flareFor } from "@/lib/ground";

/**
 * The year, twice, on one x-axis and two separate y-axes.
 *
 * CONVENTIONS §4b forbids putting two measures on ONE axis, because it
 * invents a correlation the data does not contain — and here the two
 * measures are "how good is the garden" and "how many people came",
 * which is precisely the pair a reader would be invited to see as
 * related. Its prescribed answer is two charts, so these are two rails,
 * stacked, sharing only the week they are indexed by. The reader can
 * then find the relationship that IS there, which is that the two peaks
 * are five months apart.
 *
 * Each bar is drawn in its OWN week's colour, so the rail is also a
 * picture of the palette — the year the page is dressed in, laid out
 * flat. And each bar is a link, which makes this the site's primary
 * navigation as well as its chart.
 *
 * No numeric ticks, deliberately. §4b wants round numbers on an axis and
 * the honest way to satisfy that here is not to draw an axis at all:
 * "interest" is a made-up unit and a gridline reading 40 would give it
 * a false precision. Every exact value is in the table underneath —
 * which is §4b's other rule, that a chart must never be the only place
 * a number can be read.
 */
export function YearRail({
  values,
  current,
  max,
  label,
  showMonths = false,
  mono = false,
}: {
  values: number[];
  current: number;
  max: number;
  label: string;
  showMonths?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="label" style={{ color: "var(--color-ink-muted)", marginBottom: "0.4rem" }}>
        {label}
      </div>
      <div className="rail" style={{ height: "var(--rail-h, 4.5rem)" }}>
        {values.map((v, i) => {
          const week = i + 1;
          const h = max > 0 ? Math.max(2, (v / max) * 100) : 2;
          return (
            <a
              key={week}
              href={`/week/${week}`}
              className="rail-bar"
              aria-current={week === current ? "true" : undefined}
              aria-label={`Week ${week}, ${weekLabel(week)}`}
              style={
                {
                  "--h": `${h}%`,
                  "--bar": mono ? "var(--color-ink-muted)" : css(flareFor(week)),
                } as React.CSSProperties
              }
            >
              <span className="rail-fill" />
            </a>
          );
        })}
      </div>
      {showMonths ? (
        <div className="rail" style={{ marginTop: "0.35rem" }}>
          {Array.from({ length: 12 }, (_, m) => {
            const weeks = weeksInMonth(m + 1);
            return (
              <div
                key={m}
                className="label"
                style={{
                  gridColumn: `span ${weeks.length}`,
                  color: "var(--color-ink-muted)",
                  borderTop: "1px solid var(--color-line)",
                  paddingTop: "0.25rem",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                {monthNameShort(m + 1)}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
