"use client";

import { useEffect, useRef, useState } from "react";
import type { BrewStep } from "@/content/types";

function clock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * A working brew timer: start it and follow the steps.
 *
 * Elapsed time is computed from a timestamp rather than by counting
 * ticks. An interval that adds 1 every 1000ms drifts — browsers
 * throttle timers in background tabs, and over a nine-minute cafetière
 * the error is large enough to matter to the brew. Reading the clock
 * each tick is always right, however irregular the ticks are.
 */
export function BrewTimer({
  steps,
  totalSeconds,
}: {
  steps: BrewStep[];
  totalSeconds: number;
}) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // When the current run began, already offset by whatever had been
  // counted before a pause — so resuming continues rather than
  // restarting.
  const originRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    originRef.current = Date.now() - elapsed * 1000;

    const id = window.setInterval(() => {
      const next = (Date.now() - originRef.current) / 1000;
      if (next >= totalSeconds) {
        setElapsed(totalSeconds);
        setRunning(false);
      } else {
        setElapsed(next);
      }
    }, 200);

    return () => window.clearInterval(id);
    // `elapsed` is deliberately not a dependency: it changes five
    // times a second, and re-running this effect on every change would
    // tear down and rebuild the interval each tick. It is read once,
    // at the moment the timer starts or resumes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, totalSeconds]);

  const activeIndex = steps.reduce(
    (found, step, i) => (elapsed >= step.at ? i : found),
    -1
  );
  const done = elapsed >= totalSeconds;
  const progress = Math.min(1, elapsed / totalSeconds);

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="tnum font-display text-5xl leading-none font-bold">
          {clock(elapsed)}
          <span className="ml-2 text-lg font-medium text-ink-subtle">
            / {clock(totalSeconds)}
          </span>
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (done) {
                setElapsed(0);
                setRunning(true);
                return;
              }
              setRunning((r) => !r);
            }}
            className="rounded-full bg-accent px-6 py-2.5 font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
          >
            {done ? "Again" : running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setElapsed(0);
            }}
            className="rounded-full border border-line-strong px-5 py-2.5 font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        className="mt-5 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Brew progress"
        aria-valuemin={0}
        aria-valuemax={totalSeconds}
        aria-valuenow={Math.floor(elapsed)}
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((step, i) => {
          const active = i === activeIndex && !done;
          const passed = i < activeIndex || done;
          return (
            <li
              key={step.at}
              className={`rounded-lg border p-4 transition-colors ${
                active
                  ? "border-accent bg-accent-soft"
                  : passed
                    ? "border-line bg-canvas opacity-60"
                    : "border-line bg-canvas"
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="tnum text-sm font-semibold text-ink-subtle">
                  {clock(step.at)}
                </span>
                <span
                  className={`font-semibold ${active ? "text-accent" : ""}`}
                >
                  {step.title}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {step.detail}
              </p>
            </li>
          );
        })}
      </ol>

      <p aria-live="polite" className="sr-only">
        {done
          ? "Brew complete"
          : activeIndex >= 0
            ? `Step ${activeIndex + 1}: ${steps[activeIndex].title}`
            : "Timer ready"}
      </p>
    </div>
  );
}
