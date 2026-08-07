"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/docs";
import { pickActiveHeading } from "@/lib/active-heading";

/**
 * On this page — the contents list, with the section you are reading
 * highlighted.
 *
 * The ids come from the same place the headings' ids do: they were
 * computed once, in lib/docs.ts, and written onto the tokens. Nothing here
 * re-derives a slug, which is what stops the contents list and the page
 * from disagreeing about where a link goes.
 */
export function DocToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // A scroll listener rather than an IntersectionObserver. The observer
    // is the usual choice, but it only reports elements crossing a
    // threshold, and the question here is "which heading is furthest down
    // the page while still above the fold" — which needs the positions of
    // all of them, not the one that happened to cross. The earlier version
    // used an observer purely as a notification that something had moved
    // and then measured everything anyway, which is what a scroll event
    // already is.
    let frame = 0;
    const update = () => {
      frame = 0;
      const positions = elements.map((element) => ({
        id: element.id,
        top: element.getBoundingClientRect().top,
      }));
      // 96px clears the sticky header.
      setActiveId(pickActiveHeading(positions, 96));
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <aside className="hidden w-52 shrink-0 xl:block">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-4">
        <h2 className="mb-3 text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">
          On this page
        </h2>
        <ul className="space-y-1 border-l border-border">
          {headings.map((heading) => {
            const active = heading.id === activeId;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  aria-current={active ? "location" : undefined}
                  className={`focus-ring -ml-px block border-l py-0.5 text-[13px] leading-5 transition ${
                    heading.depth === 3 ? "pl-6" : "pl-3"
                  } ${
                    active
                      ? "border-accent font-medium text-accent"
                      : "border-transparent text-ink-muted hover:text-ink"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
