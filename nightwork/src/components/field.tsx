import { SHELLS } from "@/content/shells";
import { clock, clockCoarse, shellById } from "@/lib/ballistics";
import { emissionColour, toCss } from "@/lib/emission";
import type { ShowData } from "@/lib/show-data";

/**
 * The altitude field: the architecture.
 *
 * Time runs across, real height runs up, and every shell in the display
 * is here twice — as a TRAJECTORY from the moment it was fired to the
 * moment it broke, and as a BURST at the top of it. Flip the control at
 * the top and each burst slides left to sit over its firing time
 * instead, the trajectories go, and you are looking at the crew's
 * document rather than the audience's. A twelve-inch shell moves a long
 * way in that flip and a two-inch shell barely moves at all, which is
 * the whole argument of the site rendered as a distance.
 *
 * Nothing here is a canvas. The trajectories are one inline SVG with a
 * viewBox in (tenths × metres) — a plot, drawn in the plot's own units
 * — and every burst is a DOM element positioned by custom properties.
 * All of it is selectable and editable, which a picture of a chart is
 * not (CONVENTIONS §5).
 *
 * BURSTS ARE DRAWN AT AN EIGHTH OF TRUE DIAMETER, and the axis says so.
 * At true scale a twelve-inch shell is 400 metres across at 360 metres
 * up, which is accurate, screen-filling, and — with fifty of them
 * compositing additively — a white rectangle. The reduction is a
 * chart's normal honesty rather than a fudge, which is why it is
 * printed on the drawing rather than buried here.
 *
 * WHY THERE IS A WINDOW PROP. The first version drew whole shows only,
 * and it made a handsome portrait of a display's density that could not
 * show the one thing the site is about. Over fourteen minutes a 6.3
 * second climb is 0.8% of the width, so every trajectory is vertical
 * and the cues that fire before the announced start sit a third of a
 * pixel to the left of it. The mechanism is only visible close up. So a
 * field can be given a window of a few seconds, and the same component
 * draws the detail — three trajectories at three different slopes,
 * arriving at one point.
 */

export const BURST_SCALE = 1 / 8;

export function Field({
  data,
  height = "clamp(22rem, 58vh, 40rem)",
  showControls = true,
  compact = false,
  window: win,
}: {
  data: ShowData;
  height?: string;
  showControls?: boolean;
  compact?: boolean;
  /** Tenths [from, to]. Omit for the whole display. */
  window?: [number, number];
}) {
  const { ceilingM, show } = data;

  // The drawing starts at the earliest thing that happens, which on
  // five of six shows is BEFORE the announced start.
  const t0 = win ? win[0] : Math.min(0, data.firstFireTenths);
  const t1 = win ? win[1] : data.lastLightTenths;
  const span = Math.max(1, t1 - t0);
  const fx = (t: number) => (t - t0) / span;

  // A windowed field only draws what is actually in the window, plus
  // whatever is still climbing into it.
  const cues = win
    ? data.cues.filter((c) => c.breakTenths >= t0 && c.breakTenths <= t1)
    : data.cues;

  const id = win ? `${show.slug}-detail` : show.slug;
  const altTicks: number[] = [];
  for (let m = 100; m <= ceilingM; m += 100) altTicks.push(m);
  const tickEvery = span <= 200 ? 10 : span <= 1200 ? 100 : 600;
  const timeTicks: number[] = [];
  for (let t = Math.ceil(t0 / tickEvery) * tickEvery; t < t1; t += tickEvery) {
    if (t !== 0) timeTicks.push(t);
  }

  return (
    <div
      className="field"
      style={{ ["--show-dur" as string]: `${(span / 10).toFixed(1)}s` }}
    >
      {showControls && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-[0.7rem] sm:px-6">
          <label className="chip flex cursor-pointer items-center gap-2 px-3 py-1 text-white/80 select-none">
            <input type="checkbox" className="play accent-white/80" name={`${id}-play`} />
            <span className="eyebrow">Play the show</span>
          </label>

          {/*
            ONE CHECKBOX, not two radios, and that is not a style choice.
            Chromium does not reliably re-run `:has()` invalidation when
            a RADIO GROUP's state changes — the group's other input
            becoming unchecked does not propagate — so
            `.field:has(.by-fire:checked)` matched in `element.matches()`
            and never applied in the stylesheet. Every burst sat still
            and the trajectories never faded, with no error anywhere.
            The `.play` CHECKBOX on the same panel worked throughout,
            which is what identified it. A two-state switch is the
            honest shape for a two-document toggle anyway.
          */}
          <label className="segmented flex cursor-pointer items-center select-none">
            <input type="checkbox" className="by-fire sr-only" />
            <span className="eyebrow segmented-a px-2.5 py-1">
              What the audience sees
            </span>
            <span className="eyebrow segmented-b px-2.5 py-1">
              What the crew fires
            </span>
          </label>

          <p className="num ml-auto hidden text-[0.65rem] text-white/45 lg:block">
            bursts at ⅛ true diameter · {ceilingM} m ceiling ·{" "}
            {(span / 10 / 60).toFixed(1)} min
          </p>
        </div>
      )}

      <div className="field-scroll">
        <div
          className="field-inner"
          style={{
            ["--field-h" as string]: height,
            // A whole display needs room or fourteen minutes compresses
            // into nonsense; a nine-second window does not, and forcing
            // one to 900px pushed the convergence — the entire point of
            // the detail view — off the right-hand edge.
            ["--field-min" as string]: win ? "0" : "900px",
          }}
          aria-hidden="true"
        >
          {/* Altitude rules. */}
          {altTicks.map((m) => (
            <div
              key={m}
              className="axis-line"
              style={{ bottom: `${(m / ceilingM) * 100}%` }}
            >
              <span className="num absolute left-2 -top-4 text-[0.6rem] text-white/35">
                {m} m
              </span>
            </div>
          ))}

          {/* Time rules. */}
          {timeTicks.map((t) => (
            <div key={t} className="axis-tick" style={{ left: `${fx(t) * 100}%` }}>
              <span className="num absolute bottom-1 left-1.5 text-[0.6rem] text-white/35">
                {tickEvery >= 600 ? clockCoarse(t) : clock(t)}
              </span>
            </div>
          ))}

          {/* Zero. On most of these shows there are cues to the LEFT of
              this line, which is the point of drawing it. */}
          {fx(0) >= 0 && fx(0) <= 1 && (
            <div
              className="absolute top-0 bottom-0 border-l border-dashed border-white/45"
              style={{ left: `${fx(0) * 100}%` }}
            >
              <span className="num absolute top-1 left-1.5 text-[0.6rem] whitespace-nowrap text-white/60">
                0:00 announced start
              </span>
            </div>
          )}

          {/* The trajectories, in the plot's own units. */}
          <svg
            className="traces"
            viewBox={`${t0} 0 ${span} ${ceilingM}`}
            preserveAspectRatio="none"
          >
            {cues.map((c) => {
              const shell = shellById(SHELLS, c.shellId);
              return (
                <line
                  key={c.id}
                  x1={c.fireTenths}
                  y1={ceilingM}
                  x2={c.breakTenths}
                  y2={ceilingM - c.altitudeM}
                  stroke={toCss(emissionColour(shell.emissions[0]))}
                  style={{
                    ["--fuse-delay" as string]: `${((c.fireTenths - t0) / 10).toFixed(1)}s`,
                  }}
                />
              );
            })}
          </svg>

          {/* The sky. */}
          <div className="sky">
            {cues.map((c) => {
              const shell = shellById(SHELLS, c.shellId);
              return (
                <span
                  key={c.id}
                  className="burst"
                  style={{
                    ["--tb" as string]: fx(c.breakTenths).toFixed(5),
                    ["--tf" as string]: fx(c.fireTenths).toFixed(5),
                    ["--a" as string]: (c.altitudeM / ceilingM).toFixed(4),
                    ["--d" as string]: (
                      (shell.burstM * BURST_SCALE) /
                      ceilingM
                    ).toFixed(5),
                    ["--em" as string]: toCss(emissionColour(shell.emissions[0])),
                    ["--delay" as string]: `${((c.breakTenths - t0) / 10).toFixed(1)}s`,
                  }}
                />
              );
            })}
          </div>

          <div className="playhead" />

          {/* Annotations, anchored in the sky at the moment they are
              about. This is the half of the architecture that makes the
              page a plot rather than a chart with text under it. */}
          {!compact &&
            show.segments
              .filter((s) => s.note)
              .map((segment) => {
                const first = cues.find((c) => c.segmentId === segment.id);
                if (!first) return null;
                const left = fx(first.breakTenths);
                return (
                  <div
                    key={segment.id}
                    className="absolute z-10 w-44 max-w-[40%]"
                    style={{
                      left: `${left * 100}%`,
                      bottom: `${(first.altitudeM / ceilingM) * 100}%`,
                      transform: left > 0.62 ? "translate(-100%, 50%)" : "translate(0, 50%)",
                    }}
                  >
                    <div
                      // The sky behind an annotation is whatever burst
                      // happens to be there, so it needs its own ground.
                      className={`bg-[color-mix(in_oklab,black_58%,transparent)] py-1 backdrop-blur-[2px] ${
                        left > 0.62
                          ? "border-r border-white/25 pr-3 pl-2 text-right"
                          : "border-l border-white/25 pr-2 pl-3"
                      }`}
                    >
                      <p className="num text-[0.6rem] text-white/45">
                        {clock(first.breakTenths)} · {first.altitudeM} m
                      </p>
                      <p className="prose-body mt-1 text-[0.72rem] leading-snug text-white/75">
                        {segment.note}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
