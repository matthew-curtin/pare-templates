"use client";

import { useState } from "react";
import { newsletter } from "@/content/site";

/**
 * The newsletter sign-up.
 *
 * Validates on submit rather than on every keystroke — telling someone
 * their address is invalid while they are still halfway through typing
 * it is the most common way this control is got wrong. Nothing is
 * sent anywhere; the success state is local.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (value === "") {
      setError("Enter an email address.");
      return;
    }
    // Deliberately loose. Anything stricter starts rejecting addresses
    // that are genuinely valid, and the real check is the confirmation
    // email either arriving or not.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("That does not look like an email address.");
      return;
    }

    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-sm border border-line-strong bg-surface px-5 py-4 text-sm text-ink">
        {newsletter.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            placeholder="you@example.com"
            aria-invalid={error !== null}
            aria-describedby={error ? "newsletter-error" : undefined}
            className={`w-full rounded-sm border bg-surface px-4 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-accent ${
              error ? "border-accent" : "border-line-strong"
            }`}
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-sm bg-ink px-5 py-2.5 text-[0.95rem] font-semibold text-ink-inverse transition-colors hover:bg-accent"
        >
          {newsletter.cta}
        </button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-accent">
          {error}
        </p>
      )}
    </form>
  );
}
