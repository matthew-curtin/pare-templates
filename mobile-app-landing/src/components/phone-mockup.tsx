import { clsx } from "@/lib/clsx";

/**
 * The app screen on the home page, built in HTML and CSS rather than
 * shipped as a screenshot. It stays sharp at any size, weighs nothing,
 * and every part of it can be clicked and edited.
 *
 * The data below is illustration rather than site copy, so it lives
 * here beside the markup that draws it.
 */

/** The four sleep stages, top lane to bottom lane. */
const LANES = ["Awake", "REM", "Light", "Deep"] as const;
type Lane = (typeof LANES)[number];

/**
 * Heights are in pixels rather than percentages on purpose: a
 * percentage height needs a parent with a definite height, and inside
 * a flex column it silently collapses to nothing.
 */
const LANE_HEIGHT = 20;
const BAR_HEIGHT = 8;
const CHART_HEIGHT = LANES.length * LANE_HEIGHT;

const LANE_COLOUR: Record<Lane, string> = {
  Awake: "bg-accent",
  REM: "bg-cool/70",
  Light: "bg-cool/40",
  Deep: "bg-cool",
};

/** One night, as start and end percentages across the chart. */
const hypnogram: { from: number; to: number; lane: Lane }[] = [
  { from: 0, to: 5, lane: "Awake" },
  { from: 5, to: 16, lane: "Light" },
  { from: 16, to: 30, lane: "Deep" },
  { from: 30, to: 37, lane: "Light" },
  { from: 37, to: 45, lane: "REM" },
  { from: 45, to: 52, lane: "Light" },
  { from: 52, to: 62, lane: "Deep" },
  { from: 62, to: 68, lane: "Light" },
  { from: 68, to: 70, lane: "Awake" },
  { from: 70, to: 76, lane: "Light" },
  { from: 76, to: 86, lane: "REM" },
  { from: 86, to: 94, lane: "Light" },
  { from: 94, to: 100, lane: "Awake" },
];

const summary = [
  { label: "Asleep", value: "7h 42m" },
  { label: "Awake", value: "18m" },
  { label: "Dropped off", value: "9m" },
];

export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={clsx("relative mx-auto w-[290px]", className)}>
      {/* A pool of light behind the phone, so it isn't floating on flat black. */}
      <div
        aria-hidden="true"
        className="absolute -inset-12 -z-10 rounded-full bg-cool/12 blur-3xl"
      />

      <div className="edge-light rounded-[46px] border border-line-strong bg-raised p-2.5 shadow-2xl shadow-black/60">
        <div className="relative overflow-hidden rounded-[36px] bg-canvas">
          {/* Status bar and the pill at the top of the screen. */}
          <div className="relative flex h-11 items-center justify-between px-6">
            <span className="text-[11px] font-semibold text-ink">7:02</span>
            <div className="absolute left-1/2 top-2 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />
            <div className="flex items-center gap-1.5 text-ink-muted">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path
                  d="M1 5.5a8 8 0 0 1 12 0M3.5 8a4.5 4.5 0 0 1 7 0"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <rect
                  x="0.6"
                  y="0.6"
                  width="14"
                  height="8.8"
                  rx="2.4"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <rect
                  x="2.2"
                  y="2.2"
                  width="9"
                  height="5.6"
                  rx="1.4"
                  fill="currentColor"
                />
                <path
                  d="M16.4 3.6v2.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="px-5 pb-5">
            {/* Last night */}
            <p className="text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">
              Last night
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-[34px] leading-none font-bold tracking-tight text-ink">
                7h 42m
              </span>
              <span className="text-[11px] text-ink-muted">asleep</span>
            </div>
            <p className="mt-1 text-[11px] text-ink-subtle">
              11:14 pm — 7:02 am · woke twice
            </p>

            {/* Hypnogram */}
            <div className="mt-5 flex gap-2.5">
              {/*
                Each label gets a box one lane tall, so label n starts at
                n × LANE_HEIGHT — exactly where bar n starts. Spacing them
                with justify-between instead would divide the leftover room
                into three equal gaps and drift a little further out of line
                on every row.
              */}
              <div
                className="flex flex-col"
                style={{ height: `${CHART_HEIGHT}px` }}
              >
                {LANES.map((lane) => (
                  <span
                    key={lane}
                    className="text-[8px] leading-none text-ink-subtle"
                    style={{ height: `${LANE_HEIGHT}px` }}
                  >
                    {lane}
                  </span>
                ))}
              </div>

              <div
                className="relative flex-1"
                style={{ height: `${CHART_HEIGHT}px` }}
              >
                {hypnogram.map((segment) => (
                  <div
                    key={`${segment.lane}-${segment.from}`}
                    className={clsx(
                      "absolute rounded-full",
                      LANE_COLOUR[segment.lane],
                    )}
                    style={{
                      left: `${segment.from}%`,
                      width: `${segment.to - segment.from}%`,
                      top: `${LANES.indexOf(segment.lane) * LANE_HEIGHT}px`,
                      height: `${BAR_HEIGHT}px`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Three numbers */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {summary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-line bg-surface px-2.5 py-2.5"
                >
                  <p className="text-[13px] font-bold text-ink">{item.value}</p>
                  <p className="mt-0.5 text-[9px] text-ink-subtle">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* The weekly note — the app's one opinion */}
            <div className="mt-3 rounded-xl border border-accent-ring bg-accent-soft px-3 py-3">
              <p className="text-[10px] font-bold tracking-wide text-accent uppercase">
                This week
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                You fell asleep fastest on the nights the wind-down started
                before 10 pm. Four out of five.
              </p>
            </div>

            {/* Tonight */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2.5">
              <div>
                <p className="text-[9px] tracking-wide text-ink-subtle uppercase">
                  Tonight
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-ink">
                  Wake between 6:45 and 7:15
                </p>
              </div>
              <div className="h-5 w-9 rounded-full bg-accent p-0.5">
                <div className="ml-auto h-4 w-4 rounded-full bg-canvas" />
              </div>
            </div>

            {/* Now playing */}
            <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-line bg-raised px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cool-soft text-cool">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7c1.2-2.4 2-2.4 3.2 0S6.6 9.4 7.8 7 9.8 4.6 11 7s2 2.4 2 2.4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-ink">
                  Rain on glass
                </p>
                <p className="text-[9px] text-ink-subtle">
                  Fading out over 20 min
                </p>
              </div>
              <div className="flex gap-0.5" aria-hidden="true">
                <span className="h-3 w-0.5 rounded-full bg-cool/70" />
                <span className="h-4 w-0.5 rounded-full bg-cool" />
                <span className="h-2 w-0.5 rounded-full bg-cool/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
