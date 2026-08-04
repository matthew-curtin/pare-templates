"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/use-cart";
import { DEFAULT_GRIND, grinds } from "@/content/site";
import type { Coffee } from "@/content/types";
import { formatPence } from "@/lib/money";

/**
 * Size and grind pickers plus the add button.
 *
 * Grind is part of the line rather than of the coffee: a roastery
 * grinds to order, so the same bean ordered whole and ordered for
 * espresso are two different things to post, and the cart treats them
 * as two lines.
 */
export function AddToCart({ coffee }: { coffee: Coffee }) {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState(coffee.sizes[0].id);
  const [grindId, setGrindId] = useState(DEFAULT_GRIND);
  const [justAdded, setJustAdded] = useState(false);

  // The confirmation clears itself after a moment. The timer is keyed
  // on `justAdded` and nothing else, so a re-render from the parent
  // cannot restart it — an effect that depends on a callback prop
  // restarts on every parent render and may then never fire at all.
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!justAdded) return;
    timerRef.current = window.setTimeout(() => setJustAdded(false), 2600);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [justAdded]);

  const size = coffee.sizes.find((s) => s.id === sizeId) ?? coffee.sizes[0];

  if (coffee.soldOut) {
    return (
      <div className="rounded-lg border border-line bg-surface p-5">
        <p className="font-semibold">Sold out for now</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          We do not hold roasted stock, so this comes back when we next roast
          it — usually the Tuesday after next.
        </p>
        <Link
          href="/subscribe"
          className="mt-4 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
        >
          Let us choose for you instead →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <fieldset>
        <legend className="eyebrow text-ink-subtle">Size</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {coffee.sizes.map((option) => {
            const active = option.id === sizeId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSizeId(option.id)}
                aria-pressed={active}
                className={`tnum rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent-soft font-semibold text-accent"
                    : "border-line-strong hover:border-accent"
                }`}
              >
                {option.label}
                <span className="ml-2 text-ink-subtle">
                  {formatPence(option.pence)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="eyebrow text-ink-subtle">Grind</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {grinds.map((option) => {
            const active = option.id === grindId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setGrindId(option.id)}
                aria-pressed={active}
                className={`rounded-lg border px-4 py-2.5 text-left transition-colors ${
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-line-strong hover:border-accent"
                }`}
              >
                <span
                  className={`block text-sm ${active ? "font-semibold text-accent" : "font-medium"}`}
                >
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-ink-subtle">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => {
          add(coffee.slug, sizeId, grindId);
          setJustAdded(true);
        }}
        className="mt-7 w-full rounded-full bg-accent px-6 py-3.5 font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
      >
        Add to basket — {formatPence(size.pence)}
      </button>

      {/* aria-live so a screen reader hears the confirmation; the
          region stays mounted so the announcement actually fires. */}
      <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm">
        {justAdded && (
          <span className="text-accent">
            Added.{" "}
            <Link href="/cart" className="font-semibold underline">
              Go to basket
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}
