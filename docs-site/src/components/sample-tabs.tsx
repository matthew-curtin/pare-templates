"use client";

import { useState, type ReactNode } from "react";

/**
 * The same task in several languages, one tab each.
 *
 * Every panel is highlighted on the server and passed in as children;
 * this component only decides which one is visible. That is the whole
 * reason the tabs are a client component and the highlighting is not —
 * none of Shiki reaches the browser.
 *
 * All panels stay mounted and the inactive ones are hidden, so switching
 * tabs cannot reflow the page or lose a horizontal scroll position.
 */
export function SampleTabs({
  labels,
  children,
}: {
  labels: string[];
  children: ReactNode[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="overflow-hidden rounded-xl border border-code-border bg-code">
      <div
        role="tablist"
        aria-label="Code samples"
        className="flex min-w-0 gap-1 overflow-x-auto border-b border-code-border bg-code-chrome px-2 py-1.5"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            type="button"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`focus-ring rounded px-2.5 py-1 text-xs whitespace-nowrap transition ${
              i === active
                ? "bg-white/10 font-medium text-code-ink"
                : "text-code-ink/55 hover:text-code-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div key={labels[i]} role="tabpanel" hidden={i !== active}>
          {panel}
        </div>
      ))}
    </div>
  );
}
