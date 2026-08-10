"use client";

import { flushSync } from "react-dom";
import { seasons, type SeasonKey } from "@/content/site";

/**
 * Three days, and the only piece of directed motion on this site.
 *
 * The change is wrapped in a View Transition because the point is not
 * the new picture, it is the DIFFERENCE — which rooms lost their sun and
 * which gained it, and how far the sun's arc swings round the compass
 * between June and December. Two unrelated redraws would leave the
 * reader to remember the first one.
 *
 * `flushSync` is required: `startViewTransition` snapshots the DOM when
 * its callback returns, so React has to have committed by then.
 */
export function SeasonSwitch({
  value,
  onChange,
  className = "",
}: {
  value: SeasonKey;
  onChange: (key: SeasonKey) => void;
  className?: string;
}) {
  const pick = (key: SeasonKey) => {
    if (key === value) return;
    const swap = () => flushSync(() => onChange(key));
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(swap);
    } else {
      swap();
    }
  };

  return (
    <div className={className}>
      <div
        className="flex gap-px border border-line bg-line"
        role="group"
        aria-label="Day of the year"
      >
        {seasons.map((s) => {
          const on = s.key === value;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => pick(s.key)}
              aria-pressed={on}
              className={`focus-ring datum flex-1 px-2 py-2 text-[0.75rem] transition-colors ${
                on
                  ? "bg-ink text-canvas"
                  : "bg-surface text-ink-muted hover:bg-canvas"
              }`}
            >
              {s.short}
            </button>
          );
        })}
      </div>
      <p className="datum mt-2 text-[0.6875rem] uppercase text-ink-subtle">
        {seasons.find((s) => s.key === value)?.label} ·{" "}
        {seasons.find((s) => s.key === value)?.gloss}
      </p>
    </div>
  );
}
