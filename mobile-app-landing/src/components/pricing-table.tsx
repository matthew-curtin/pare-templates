"use client";

import { useState } from "react";
import { Button } from "./button";
import { plans } from "@/content/pricing";
import { clsx } from "@/lib/clsx";

export function PricingTable() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      <div className="flex justify-center">
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1"
        >
          <PeriodButton
            active={!yearly}
            onClick={() => setYearly(false)}
            label="Monthly"
          />
          <PeriodButton
            active={yearly}
            onClick={() => setYearly(true)}
            label="Yearly"
            note="Save a third"
          />
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = yearly ? plan.yearly : plan.monthly;
          const free = price === 0;

          return (
            <div
              key={plan.id}
              className={clsx(
                "edge-light relative flex flex-col rounded-2xl border p-7",
                plan.featured
                  ? "border-accent-ring bg-raised"
                  : "border-line bg-surface",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[11px] font-bold tracking-wide text-on-accent uppercase">
                  Most people pick this
                </span>
              )}

              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                {free ? (
                  <span className="text-4xl font-bold tracking-tight text-ink">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight text-ink">
                      £{price}
                    </span>
                    <span className="text-sm text-ink-subtle">/ month</span>
                  </>
                )}
              </div>
              <p className="mt-1.5 h-5 text-xs text-ink-subtle">
                {free
                  ? "For as long as you like"
                  : yearly
                    ? `Billed £${price * 12} once a year`
                    : "Billed monthly"}
              </p>

              <Button
                href="/download"
                variant={plan.featured ? "primary" : "secondary"}
                className="mt-7 w-full"
              >
                {plan.cta}
              </Button>

              <ul className="mt-7 space-y-3 border-t border-line pt-7">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-relaxed text-ink-muted"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-accent"
                    >
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PeriodButton({
  active,
  onClick,
  label,
  note,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  note?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active ? "bg-accent text-on-accent" : "text-ink-muted hover:text-ink",
      )}
    >
      {label}
      {note && (
        <span
          className={clsx(
            "text-[11px] font-bold",
            active ? "text-on-accent/70" : "text-accent",
          )}
        >
          {note}
        </span>
      )}
    </button>
  );
}
