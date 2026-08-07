"use client";

import { useState } from "react";
import { spaces } from "@/content/private-dining";

interface Values {
  name: string;
  email: string;
  space: string;
  guests: string;
  dates: string;
  detail: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGEST = Math.max(
  ...spaces.map((space) => space.standing ?? space.seated),
);

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Who should we reply to?";
  if (!EMAIL.test(values.email)) errors.email = "We reply by email.";

  const guests = Number(values.guests);
  if (!values.guests.trim()) {
    errors.guests = "A rough number is fine.";
  } else if (!Number.isFinite(guests) || guests < 1) {
    errors.guests = "A number, roughly.";
  } else if (guests > LARGEST) {
    // Worth saying out loud rather than accepting quietly: the room
    // physically cannot do it, and the honest answer helps them more
    // than a confirmation would.
    errors.guests = `The largest we can do is ${LARGEST}, standing, in the whole restaurant.`;
  }
  return errors;
}

export function EnquiryForm() {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    space: "",
    guests: "",
    dates: "",
    detail: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof Values, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    setSent(false);
    if (submitted) setErrors(validate(next));
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-accent-ring bg-accent-soft p-6">
        <h3 className="font-display text-2xl">Thank you</h3>
        <p className="mt-2 text-ink-muted">
          Milo will come back to you within two working days with what is
          free, a realistic cost, and an honest answer about whether we are
          the right room for it.
        </p>
        <p className="mt-4 text-sm text-ink-subtle">
          Nothing was actually sent — this is a website template, and there
          is no restaurant and no inbox at the other end.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({
              name: "",
              email: "",
              space: "",
              guests: "",
              dates: "",
              detail: "",
            });
            setSubmitted(false);
            setSent(false);
          }}
          className="focus-ring mt-5 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink-muted hover:text-ink"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        const found = validate(values);
        setErrors(found);
        setSent(Object.keys(found).length === 0);
      }}
      className="space-y-5 rounded-lg border border-line bg-surface p-6"
    >
      <h3 className="font-display text-2xl">Tell us what you have in mind</h3>
      <p className="-mt-3 text-sm text-ink-subtle">
        Anything you already know. Dates you are considering is enough.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="e-name" label="Name" error={errors.name}>
          <input
            id="e-name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "e-name-error" : undefined}
            className={input}
          />
        </Field>
        <Field id="e-email" label="Email" error={errors.email}>
          <input
            id="e-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "e-email-error" : undefined}
            className={input}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="e-space" label="Which space" hint="If you have a view.">
          <select
            id="e-space"
            value={values.space}
            onChange={(event) => update("space", event.target.value)}
            className={input}
          >
            <option value="">Not sure yet</option>
            {spaces.map((space) => (
              <option key={space.name} value={space.name}>
                {space.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="e-guests" label="How many" error={errors.guests}>
          <input
            id="e-guests"
            inputMode="numeric"
            value={values.guests}
            onChange={(event) => update("guests", event.target.value)}
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? "e-guests-error" : undefined}
            className={input}
          />
        </Field>
      </div>

      <Field
        id="e-dates"
        label="Dates you are considering"
        hint="Optional. A month is a useful start."
      >
        <input
          id="e-dates"
          value={values.dates}
          onChange={(event) => update("dates", event.target.value)}
          className={input}
        />
      </Field>

      <Field id="e-detail" label="Anything else">
        <textarea
          id="e-detail"
          rows={4}
          value={values.detail}
          onChange={(event) => update("detail", event.target.value)}
          className={`${input} resize-y`}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="focus-ring rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          Send enquiry
        </button>
        <span aria-live="polite" className="text-sm text-accent">
          {submitted && Object.keys(errors).length > 0
            ? "Check the fields marked above."
            : ""}
        </span>
      </div>
    </form>
  );
}

const input =
  "focus-ring w-full rounded-md border border-line bg-canvas px-3 py-2.5 text-ink placeholder:text-ink-subtle";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink-subtle">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
