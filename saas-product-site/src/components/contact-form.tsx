"use client";

import { useState } from "react";
import { Button } from "./button";

const fieldClass =
  "w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-2 focus:outline-offset-1 focus:outline-accent-ring";

const topics = [
  "Product question",
  "Pricing and plans",
  "Security review",
  "Something else",
];

/**
 * A working form with local validation. There is no backend in this
 * template — submitting shows the confirmation state so the flow can be
 * seen end to end. Wire `onSubmit` to your own endpoint when you have one.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    topic: topics[0],
    message: "",
  });

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    if (!values.email.includes("@")) {
      setError("That email address doesn't look right.");
      return;
    }
    setError(null);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="m5 10.5 3.5 3.5L15 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">Thanks, {values.name}.</h3>
        <p className="mt-2 text-sm text-ink-muted">
          We&rsquo;ll reply to {values.email} within one working day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-sm font-medium text-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            className={fieldClass}
            placeholder="Alex Doe"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Work email
          </label>
          <input
            id="email"
            type="email"
            className={fieldClass}
            placeholder="alex@company.com"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
            Company <span className="text-ink-subtle">(optional)</span>
          </label>
          <input
            id="company"
            className={fieldClass}
            placeholder="Northwind"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="topic" className="mb-1.5 block text-sm font-medium">
            What&rsquo;s it about?
          </label>
          <select
            id="topic"
            className={fieldClass}
            value={values.topic}
            onChange={(e) => set("topic", e.target.value)}
          >
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={fieldClass}
          placeholder="Tell us a little about your team and what you're trying to work out."
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg">
          Send message
        </Button>
        <p className="text-sm text-ink-subtle">Usually answered same day.</p>
      </div>
    </form>
  );
}
