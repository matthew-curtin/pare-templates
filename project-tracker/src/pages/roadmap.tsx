import { Fragment } from "react";
import { PageHeader } from "@/components/controls";
import {
  CURRENT_QUARTER,
  QUARTERS,
  roadmap,
  workstreams,
} from "@/content/roadmap";
import type { Stage } from "@/content/types";
import { stageFill, stageLabel } from "@/lib/tokens";

const STAGES: Stage[] = ["planned", "building", "shipped"];

/** One row of quarters, shared by the header and every workstream grid. */
const gridTemplate = `11rem repeat(${QUARTERS.length}, minmax(6.5rem, 1fr))`;

export function RoadmapPage() {
  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <PageHeader
        title="Roadmap"
        description="Where the next year of work sits. Quarters are deliberately coarse — a roadmap that claims to know a week is a plan pretending to be a forecast."
      />

      <Legend />

      <div className="scroll-thin overflow-x-auto">
        <div className="min-w-[46rem]">
          {/*
            Quarter headings.

            The horizontal padding must match the group boxes below
            (`p-2`), or the two grids resolve to different content boxes
            and every bar sits eight pixels right of the quarter it is
            labelled with — which, on a chart whose entire job is
            showing WHEN, is the one error worth chasing.
          */}
          <div
            className="grid items-end gap-x-2 px-2 pb-2"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <span />
            {QUARTERS.map((quarter, index) => (
              <span
                key={quarter}
                className={`text-[11px] font-medium ${
                  index === CURRENT_QUARTER ? "text-accent" : "text-ink-subtle"
                }`}
              >
                {quarter}
                {index === CURRENT_QUARTER && (
                  <span className="ml-1.5 rounded bg-accent-soft px-1 py-0.5 text-[10px]">
                    Now
                  </span>
                )}
              </span>
            ))}
          </div>

          {workstreams.map((workstream) => {
            const entries = roadmap.filter(
              (entry) => entry.workstream === workstream.name,
            );
            return (
              <section key={workstream.name} className="mb-5">
                <div className="mb-1.5 flex items-baseline gap-2">
                  <h2 className="text-[13px] font-semibold">
                    {workstream.name}
                  </h2>
                  <p className="text-[11px] text-ink-subtle">
                    {workstream.detail}
                  </p>
                </div>

                <div
                  className="relative grid gap-x-2 gap-y-1.5 rounded-lg border border-line bg-surface p-2"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  {/* The current quarter, shaded the full height of the
                      group. Sits behind everything and takes no clicks. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none -my-2 rounded bg-accent-soft/40"
                    style={{
                      gridColumn: CURRENT_QUARTER + 2,
                      gridRow: `1 / ${entries.length + 1}`,
                    }}
                  />

                  {entries.map((entry, index) => (
                    <Fragment key={entry.id}>
                      <div
                        className="truncate text-[12px] text-ink-muted"
                        style={{ gridColumn: 1, gridRow: index + 1 }}
                        title={entry.name}
                      >
                        {entry.name}
                      </div>
                      <div
                        className={`${stageFill[entry.stage]} flex items-center rounded px-2 py-1`}
                        style={{
                          gridColumn: `${entry.startQuarter + 2} / ${entry.endQuarter + 3}`,
                          gridRow: index + 1,
                        }}
                      >
                        <span
                          className={`truncate text-[11px] font-medium ${
                            entry.stage === "planned"
                              ? "text-ink-muted"
                              : "text-on-accent"
                          }`}
                        >
                          {stageLabel[entry.stage]}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>

                <ul className="mt-1.5 space-y-0.5 pl-1">
                  {entries.map((entry) => (
                    <li key={entry.id} className="text-[11px] text-ink-subtle">
                      <span className="text-ink-muted">{entry.name}</span> —{" "}
                      {entry.note}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Stage is an ordered scale, so it gets one hue at increasing strength
 * rather than three unrelated colours — and every bar is labelled with
 * its stage in words regardless, so the ramp is a second cue and never
 * the only one.
 */
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {STAGES.map((stage) => (
        <span
          key={stage}
          className="flex items-center gap-1.5 text-[11px] text-ink-muted"
        >
          <span className={`${stageFill[stage]} h-2.5 w-6 rounded-sm`} />
          {stageLabel[stage]}
        </span>
      ))}
    </div>
  );
}
