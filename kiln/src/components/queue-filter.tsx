"use client";

import { useState, type ReactNode } from "react";
import type { Reason } from "@/lib/schedule";
import { withViewTransition } from "@/lib/view";

/**
 * The shelf, narrowed.
 *
 * This is the template's piece of directed motion (§4c): choosing a
 * reason is a state change that carries information, so the tiles that
 * leave and the ones that stay MOVE rather than blink. Each tile carries
 * its own `view-transition-name`, so a piece that survives the filter
 * slides to its new position instead of being redrawn there.
 *
 * The sections are rendered on the SERVER and handed here as nodes. That
 * keeps the whole simulation — fifty-one pieces, the packer and the
 * rota — out of the browser bundle; the only thing shipped to the client
 * is which of eight buttons is pressed.
 */
export type Section = {
  key: Reason;
  label: string;
  note: string;
  count: number;
  content: ReactNode;
};

export function QueueFilter({ sections }: { sections: Section[] }) {
  const [only, setOnly] = useState<Reason | null>(null);
  const shown = only ? sections.filter((s) => s.key === only) : sections;
  const total = sections.reduce((n, s) => n + s.count, 0);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <FilterButton active={only === null} onPress={() => withViewTransition(() => setOnly(null))}>
          Everything <span className="text-ink-subtle">{total}</span>
        </FilterButton>
        {sections.map((s) => (
          <FilterButton
            key={s.key}
            active={only === s.key}
            onPress={() => withViewTransition(() => setOnly(s.key))}
          >
            {s.label} <span className="text-ink-subtle">{s.count}</span>
          </FilterButton>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {shown.map((s) => (
          <section key={s.key}>
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-[1.25rem] leading-tight">{s.label}</h2>
              <span className="figure text-[0.8125rem] text-ink-subtle">
                {s.count === 1 ? "1 piece" : `${s.count} pieces`}
              </span>
            </header>
            <p className="mt-1 max-w-[62ch] text-[0.875rem] leading-relaxed text-ink-muted">
              {s.note}
            </p>
            {s.content}
          </section>
        ))}
      </div>
    </>
  );
}

function FilterButton({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={active}
      className={`figure focus-ring border px-3 py-1 text-[0.8125rem] ${
        active
          ? "border-fire bg-wash-fire text-fire"
          : "border-line bg-paper text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
