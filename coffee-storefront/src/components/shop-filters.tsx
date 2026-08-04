"use client";

import { useMemo, useState } from "react";
import { CoffeeCard } from "./coffee-card";
import { ROAST_LABEL } from "@/content/coffees";
import type { Coffee, Process, RoastLevel } from "@/content/types";

type RoastFilter = RoastLevel | null;
type ProcessFilter = Process | null;

/**
 * The shop listing, narrowed by roast and process.
 *
 * Everything is already on the page — this filters what is shown
 * rather than fetching. No request, no spinner, works offline.
 */
export function ShopFilters({ coffees }: { coffees: Coffee[] }) {
  const [roast, setRoast] = useState<RoastFilter>(null);
  const [process, setProcess] = useState<ProcessFilter>(null);
  const [hideSoldOut, setHideSoldOut] = useState(false);

  // Derived from the data rather than hardcoded, so adding a coffee
  // with a new process makes a chip appear on its own.
  const roasts = useMemo(
    () => [...new Set(coffees.map((c) => c.roast))],
    [coffees]
  );
  const processes = useMemo(
    () => [...new Set(coffees.map((c) => c.process))],
    [coffees]
  );

  const shown = useMemo(
    () =>
      coffees.filter(
        (coffee) =>
          (roast === null || coffee.roast === roast) &&
          (process === null || coffee.process === process) &&
          (!hideSoldOut || !coffee.soldOut)
      ),
    [coffees, roast, process, hideSoldOut]
  );

  const filtered = roast !== null || process !== null || hideSoldOut;

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-5">
        <Row label="Roast">
          <Chip active={roast === null} onClick={() => setRoast(null)}>
            Any
          </Chip>
          {roasts.map((value) => (
            <Chip
              key={value}
              active={roast === value}
              onClick={() => setRoast(value)}
            >
              {ROAST_LABEL[value]}
            </Chip>
          ))}
        </Row>

        <Row label="Process">
          <Chip active={process === null} onClick={() => setProcess(null)}>
            Any
          </Chip>
          {processes.map((value) => (
            <Chip
              key={value}
              active={process === value}
              onClick={() => setProcess(value)}
            >
              {value}
            </Chip>
          ))}
        </Row>

        <Row label="Stock">
          <Chip active={!hideSoldOut} onClick={() => setHideSoldOut(false)}>
            Show everything
          </Chip>
          <Chip active={hideSoldOut} onClick={() => setHideSoldOut(true)}>
            In stock only
          </Chip>
        </Row>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink-subtle">
        {shown.length} {shown.length === 1 ? "coffee" : "coffees"}
      </p>

      {shown.length > 0 ? (
        <div className="mt-6 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((coffee) => (
            <CoffeeCard key={coffee.slug} coffee={coffee} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-line-strong bg-surface p-12 text-center">
          <p className="font-display text-xl font-bold">
            Nothing matches that
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            We only roast six coffees at a time, so the combinations run out
            quickly.
          </p>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setRoast(null);
                setProcess(null);
                setHideSoldOut(false);
              }}
              className="mt-5 rounded-full border border-line-strong px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="eyebrow w-16 shrink-0 text-ink-subtle">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-ink-inverse"
          : "border-line-strong text-ink-muted hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
