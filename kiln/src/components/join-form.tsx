"use client";

import { useState } from "react";
import { memberships } from "@/content/site";

type Errors = Partial<Record<"name" | "email" | "plan" | "making", string>>;

/**
 * The enquiry form.
 *
 * `noValidate` is deliberate and is CONVENTIONS §8: the browser
 * validates `type="email"` before a submit handler ever runs, so a form
 * that styles its own messages mostly shows a native bubble instead —
 * one that looks nothing like the page and cannot be positioned. Opting
 * out also means these branches are reachable, which is the only way
 * they get tested.
 */
export function JoinForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const plan = String(data.get("plan") ?? "");
    const making = String(data.get("making") ?? "").trim();

    const next: Errors = {};
    if (name.length < 2) next.name = "We need something to put on the shelf label.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "That address does not look like one we could reply to.";
    }
    if (!plan) next.plan = "Pick one — you can change it after a month.";
    if (making.length < 8) {
      next.making = "A sentence is plenty. It decides which shelf you get and whether you need Bramble.";
    }

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(name.split(" ")[0] ?? name);
    }
  }

  if (sent) {
    return (
      <div className="border border-fire bg-wash-fire p-5">
        <h3 className="text-[1.25rem] leading-tight">Thank you, {sent}.</h3>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          Nothing was sent anywhere — this is a template, and there is no studio at Sedge Row.
          In a real one somebody would now tell you which shelf is free and which Thursday to
          come and look at it.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-[36rem]">
      <Field label="Your name" error={errors.name} htmlFor="name">
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          className="focus-ring w-full border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]"
        />
      </Field>

      <Field label="Email" error={errors.email} htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          className="focus-ring w-full border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]"
        />
      </Field>

      <fieldset className="mt-5 border-0 p-0">
        <legend className="text-[0.9375rem] text-ink">Which membership</legend>
        <div className="mt-2 flex flex-col gap-2">
          {memberships.map((m) => (
            <label key={m.id} className="flex items-baseline gap-2 text-[0.9375rem]">
              <input
                type="radio"
                name="plan"
                value={m.id}
                className="focus-ring accent-[var(--color-fire)]"
              />
              <span>
                {m.name} <span className="text-ink-subtle">— {m.price}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.plan ? (
          <p role="alert" className="mt-2 border-l-2 border-l-cold pl-3 text-[0.8125rem] text-cold">
            {errors.plan}
          </p>
        ) : null}
      </fieldset>

      <Field label="What do you want to make?" error={errors.making} htmlFor="making">
        <textarea
          id="making"
          name="making"
          rows={3}
          aria-invalid={errors.making ? true : undefined}
          className="focus-ring w-full border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]"
        />
      </Field>

      <button
        type="submit"
        className="focus-ring mt-6 border border-fire bg-fire px-4 py-2 text-[0.9375rem] text-paper"
      >
        Send it
      </button>
      <p className="mt-3 text-[0.8125rem] text-ink-subtle">
        Nothing leaves your browser. Marlpit is invented.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <label htmlFor={htmlFor} className="block text-[0.9375rem] text-ink">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p role="alert" className="mt-2 border-l-2 border-l-cold pl-3 text-[0.8125rem] text-cold">
          {error}
        </p>
      ) : null}
    </div>
  );
}
