"use client";

import { useState } from "react";
import { Button } from "./button";
import { plans } from "@/content/pricing";
import { clsx } from "@/lib/clsx";

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-accent"
    >
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingTable() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      {/* Billing period toggle */}
      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface p-1"
          role="group"
          aria-label="Billing period"
        >
          {(
            [
              ["Monthly", false],
              ["Yearly", true],
            ] as const
          ).map(([label, value]) => (
            <button
              key={label}
              type="button"
              onClick={() => setYearly(value)}
              aria-pressed={yearly === value}
              className={clsx(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                yearly === value
                  ? "bg-canvas text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {label}
              {value && (
                <span className="ml-1.5 text-xs text-accent">−2 months</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = yearly ? plan.yearly : plan.monthly;
          return (
            <div
              key={plan.id}
              className={clsx(
                "relative flex flex-col rounded-xl border p-7",
                plan.featured
                  ? "border-accent shadow-xl shadow-accent/10"
                  : "border-line",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                {price === null ? (
                  <span className="text-3xl font-semibold tracking-tight">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-semibold tracking-tight">
                      ${price}
                    </span>
                    <span className="text-sm text-ink-subtle">
                      /user/month
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 h-5 text-xs text-ink-subtle">
                {price !== null && price > 0 && yearly
                  ? "billed annually"
                  : price === 0
                    ? "free forever"
                    : ""}
              </p>

              <Button
                href={plan.id === "enterprise" ? "/contact" : "/contact"}
                variant={plan.featured ? "primary" : "secondary"}
                className="mt-6 w-full"
              >
                {plan.cta}
              </Button>

              <ul className="mt-7 space-y-3 border-t border-line pt-7">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm">
                    <CheckIcon />
                    <span className="text-ink-muted">{feature}</span>
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
