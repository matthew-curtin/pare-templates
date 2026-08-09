"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";

export interface DayTab {
  n: number;
  label: string;
  strand: string;
  dateLabel: string;
  /** Where a no-JS click goes. Carries the current filters with it. */
  href: string;
}

/**
 * The day switch, and the template's one piece of directed motion.
 *
 * All three days are rendered by the server and only one is shown, so
 * switching is a DOM change in the same document rather than a
 * navigation — which is what makes a View Transition possible at all.
 * The hour rail and the room headers keep their identity while the
 * blocks under them cross-fade, so it reads as the same wallchart
 * turning to the next page.
 *
 * It degrades in both directions. Without View Transitions the switch
 * is instant and correct. Without JavaScript entirely the tabs are
 * ordinary links and the server renders the right day, which is why
 * they are `<a href>` with a click handler rather than buttons.
 *
 * `flushSync` is load-bearing: `startViewTransition` snapshots the DOM,
 * runs its callback, and snapshots again, so the callback has to have
 * updated the DOM by the time it returns. A bare `setActive` schedules
 * the update for later and the transition captures two identical
 * frames — no error, no warning, just no animation.
 */
export function DayDeck({
  initialDay,
  tabs,
  panels,
}: {
  initialDay: number;
  tabs: DayTab[];
  panels: React.ReactNode[];
}) {
  const [active, setActive] = useState(initialDay);
  const [lastFromServer, setLastFromServer] = useState(initialDay);
  const router = useRouter();

  // A filter click is a real navigation, so the server sends a new
  // initialDay and the local state has to yield to it — otherwise the
  // URL and the visible day disagree.
  //
  // Adjusting during render rather than in an effect is deliberate and
  // is React's own recommendation for this shape: an effect would
  // render the wrong day once, commit it, then re-render, which is both
  // a visible flash and the cascading-render the lint rule is about.
  if (initialDay !== lastFromServer) {
    setLastFromServer(initialDay);
    setActive(initialDay);
  }

  function show(tab: DayTab, event: React.MouseEvent) {
    // Let the browser handle modified clicks — open-in-new-tab has to
    // keep working, and it needs the href rather than our handler.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    if (tab.n === active) return;

    const swap = () => flushSync(() => setActive(tab.n));
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(swap);
    } else {
      swap();
    }
    router.replace(tab.href, { scroll: false });
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Conference day"
        className="flex flex-wrap items-stretch border border-ink"
      >
        {tabs.map((tab) => {
          const on = tab.n === active;
          return (
            <a
              key={tab.n}
              href={tab.href}
              role="tab"
              aria-selected={on}
              onClick={(event) => show(tab, event)}
              className={`focus-ring flex-1 border-r border-ink px-4 py-3 text-left transition-colors last:border-r-0 ${
                on ? "bg-ink text-ink-inverse" : "bg-surface hover:bg-sunk"
              }`}
            >
              <span className="wide block text-[1.125rem] font-semibold leading-tight">
                {tab.label}
              </span>
              <span
                className={`narrow tabular block text-[0.75rem] ${
                  on ? "text-ink-inverse/65" : "text-ink-subtle"
                }`}
              >
                {tab.dateLabel} · {tab.strand}
              </span>
            </a>
          );
        })}
      </div>

      {panels.map((panel, i) => (
        <div
          key={tabs[i].n}
          role="tabpanel"
          hidden={tabs[i].n !== active}
          // Named only while visible. Two elements cannot share a
          // view-transition-name, and `hidden` keeps the other two out
          // of the render tree entirely, so this is safe.
          style={
            tabs[i].n === active
              ? ({ viewTransitionName: "grid" } as React.CSSProperties)
              : undefined
          }
          className="mt-6"
        >
          {panel}
        </div>
      ))}
    </>
  );
}
