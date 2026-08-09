"use client";

import { useState } from "react";
import { tiers } from "@/content/tickets";

const available = tiers.filter((t) => !t.soldOut);

/**
 * A booking form that books nothing.
 *
 * `noValidate` is not optional here, per CONVENTIONS §8: the browser
 * validates `type="email"` before any submit handler runs, so a form
 * with designed error messages mostly shows a native bubble instead —
 * one that looks nothing like the page, cannot be positioned, and makes
 * the handler's own branches unreachable and therefore untested.
 */
export function TicketForm() {
  const [tierId, setTierId] = useState(
    available.find((t) => t.highlight)?.id ?? available[0].id,
  );
  const [count, setCount] = useState(1);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const tier = available.find((t) => t.id === tierId) ?? available[0];
  const total = tier.price * count;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (trimmed === "") {
      setError("We need an email address to send the tickets to.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That does not look like an email address.");
      return;
    }
    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <div className="border border-ink bg-surface p-6">
        <p className="sign text-[1.75rem]">Nothing was booked</p>
        <p className="prose-block mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
          This is a template, so there is no checkout behind the button
          and no message went to{" "}
          <span className="font-semibold text-ink">{email.trim()}</span>.
          You asked for {count} × {tier.name} at ${total.toLocaleString()}.
          Reloading puts the form back.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="focus-ring narrow mt-5 border border-ink px-4 py-2 text-[0.9375rem] transition-colors hover:bg-live"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="border border-ink bg-surface p-6">
      <h2 className="sign text-[1.75rem]">Book</h2>

      <fieldset className="mt-6">
        <legend className="narrow text-[0.75rem] uppercase tracking-wide text-ink-subtle">
          Ticket
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {available.map((t) => {
            const on = t.id === tierId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTierId(t.id)}
                aria-pressed={on}
                className={`focus-ring narrow border px-3 py-2 text-[0.9375rem] transition-colors ${
                  on
                    ? "border-ink bg-ink text-ink-inverse"
                    : "border-line-strong text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {t.name}{" "}
                <span className="tabular">${t.price.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-[7rem_1fr]">
        <div>
          <label
            htmlFor="count"
            className="narrow block text-[0.75rem] uppercase tracking-wide text-ink-subtle"
          >
            How many
          </label>
          <input
            id="count"
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) =>
              setCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
            }
            className="focus-ring tabular mt-2 w-full border border-line-strong bg-canvas px-3 py-2 text-[1rem]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="narrow block text-[0.75rem] uppercase tracking-wide text-ink-subtle"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error !== null}
            aria-describedby={error ? "email-error" : undefined}
            placeholder="you@example.com"
            className={`focus-ring mt-2 w-full border bg-canvas px-3 py-2 text-[1rem] ${
              error ? "border-clash" : "border-line-strong"
            }`}
          />
        </div>
      </div>

      {error ? (
        <p
          id="email-error"
          role="alert"
          className="mt-3 border-l-[3px] border-clash bg-clash-soft px-3 py-2 text-[0.875rem]"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="sign tabular text-[2rem]">
          ${total.toLocaleString()}
        </p>
        <button
          type="submit"
          className="focus-ring wide bg-live px-5 py-3 text-[1rem] font-semibold text-on-live transition-colors hover:bg-live-deep hover:text-ink-inverse"
        >
          Book {count} {count === 1 ? "ticket" : "tickets"}
        </button>
      </div>
    </form>
  );
}
