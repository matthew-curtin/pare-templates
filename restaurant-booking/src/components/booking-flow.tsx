"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { roomCapacity, services, site } from "@/content/site";
import type { ServiceId } from "@/content/types";
import {
  bookingWindow,
  closureFor,
  hasAnySlot,
  isOpen,
  longDate,
  partySizes,
  reference,
  slotsFor,
  weekdayOf,
} from "@/lib/availability";

/**
 * The reservation flow.
 *
 * Three steps, and **every one of them lives in the URL**: party size,
 * date, service, time and step are all search parameters. That is what
 * makes the browser's own back button work through the flow, makes a
 * half-finished booking survive a refresh, and makes "here, this time
 * on Friday" a link you can send someone. It costs nothing over holding
 * the same values in component state, and it is the difference between
 * a form and a page.
 *
 * Nothing here is submitted anywhere — see the note on the last step.
 */

type Step = "when" | "details" | "confirmed";

interface Details {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  notes: string;
}

type Errors = Partial<Record<keyof Details, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Deliberately loose: people write telephone numbers with spaces,
// brackets, a +44 or none of the above, and rejecting a real number
// because of its punctuation is worse than accepting a wrong one.
const PHONE = /^[\d\s()+-]{9,}$/;

function validate(details: Details): Errors {
  const errors: Errors = {};
  if (!details.name.trim()) errors.name = "We need a name for the table.";
  if (!EMAIL.test(details.email)) {
    errors.email = "We send the confirmation here, so it has to be right.";
  }
  if (!PHONE.test(details.phone)) {
    errors.phone = "A number we can ring on the night.";
  }
  return errors;
}

export function BookingFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const party = clampParty(Number(params.get("party") ?? 2));
  const date = params.get("date") ?? "";
  const service = (params.get("service") as ServiceId) ?? "dinner";
  const time = params.get("time") ?? "";
  const step = resolveStep(params.get("step"), date, time);

  const [details, setDetails] = useState<Details>({
    name: "",
    email: "",
    phone: "",
    occasion: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const stripRef = useRef<HTMLUListElement>(null);

  /** Write several parameters at once — see the note in the template README. */
  const go = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      router.push(`/book?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const window21 = useMemo(() => bookingWindow(21), []);

  /**
   * Bring the chosen day into view in the date strip.
   *
   * Putting the date in the URL means someone can be sent a link to a
   * day three weeks out — and land looking at a strip scrolled to today
   * with their day off the right-hand edge, apparently unselected.
   * `block: "nearest"` keeps this horizontal; without it the page jumps
   * vertically to the strip on every render that changes the date.
   */
  useEffect(() => {
    if (!date) return;
    stripRef.current
      ?.querySelector<HTMLElement>(`[data-date="${date}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [date]);
  const slots = useMemo(
    () => (date ? slotsFor(date, service, party) : []),
    [date, service, party],
  );
  const openServices = useMemo(
    () => (date ? services.filter((s) => isOpen(date, s.id)) : []),
    [date],
  );

  if (step === "confirmed") {
    return (
      <Confirmation
        party={party}
        date={date}
        service={service}
        time={time}
        name={details.name}
      />
    );
  }

  if (step === "details") {
    return (
      <div className="mx-auto max-w-2xl">
        <Steps current={2} />
        <h1 className="mt-6 font-display text-4xl leading-tight">
          Nearly there
        </h1>
        <BookingSummary
          party={party}
          date={date}
          service={service}
          time={time}
          onChange={() => go({ step: "when", time: null })}
        />

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            const found = validate(details);
            setErrors(found);
            if (Object.keys(found).length === 0) go({ step: "confirmed" });
          }}
          className="mt-8 space-y-5"
        >
          <Field id="name" label="Name" error={errors.name}>
            <input
              id="name"
              autoComplete="name"
              value={details.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="email" label="Email" error={errors.email}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={details.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass}
              />
            </Field>
            <Field id="phone" label="Telephone" error={errors.phone}>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={details.phone}
                onChange={(e) => update("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            id="occasion"
            label="Occasion"
            hint="Optional. We will not put a candle in anything without warning you."
          >
            <select
              id="occasion"
              value={details.occasion}
              onChange={(e) => update("occasion", e.target.value)}
              className={inputClass}
            >
              <option value="">No particular reason</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="celebration">Something worth celebrating</option>
              <option value="work">Work</option>
            </select>
          </Field>

          <Field
            id="notes"
            label="Allergies, access, anything else"
            hint="We would much rather know now than when you sit down."
          >
            <textarea
              id="notes"
              rows={4}
              value={details.notes}
              onChange={(e) => update("notes", e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              className="focus-ring rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              Confirm booking
            </button>
            <button
              type="button"
              onClick={() => go({ step: "when", time: null })}
              className="focus-ring rounded-sm text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              Back
            </button>
            <span aria-live="polite" className="text-sm text-accent">
              {submitted && Object.keys(errors).length > 0
                ? "Check the fields marked above."
                : ""}
            </span>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Steps current={1} />
      <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
        Book a table
      </h1>
      <p className="mt-3 max-w-prose text-ink-muted">
        Tables are released eight weeks ahead. For parties of more than{" "}
        {roomCapacity.maxPartyOnline}, or to take the room,{" "}
        <Link
          href="/private-dining"
          className="focus-ring rounded-sm text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          talk to us about private dining
        </Link>
        .
      </p>

      {/* Party size */}
      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
          How many
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {partySizes.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={party === size}
              onClick={() => go({ party: String(size), time: null })}
              className={pill(party === size)}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      {/* Date */}
      <section className="mt-8">
        <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
          Which day
        </h2>
        <ul ref={stripRef} className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {window21.map((day) => {
            const closed = day.openFor.length === 0;
            const full = !closed && !hasAnySlot(day.iso, party);
            const selected = day.iso === date;
            return (
              <li key={day.iso} className="shrink-0">
                <button
                  type="button"
                  data-date={day.iso}
                  disabled={closed || full}
                  aria-pressed={selected}
                  onClick={() =>
                    go({
                      date: day.iso,
                      time: null,
                      service: day.openFor.includes(service)
                        ? service
                        : day.openFor[0],
                    })
                  }
                  className={dateTile(selected, closed || full)}
                >
                  <span className="block text-[11px] text-ink-subtle">
                    {weekdayOf(day.iso).slice(0, 3)}
                  </span>
                  <span className="tabular block text-base">
                    {Number(day.iso.slice(8))}
                  </span>
                  <span className="block text-[10px] text-ink-subtle">
                    {closed ? "Closed" : full ? "Full" : " "}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {/*
          The reason for a closure is deliberately NOT repeated here. It
          is shown once, in the panel below, which is where someone who
          has just picked a greyed-out day is already looking.
        */}
      </section>

      {/* Service + times */}
      {date && openServices.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
            Lunch or dinner
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {openServices.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={service === entry.id}
                onClick={() => go({ service: entry.id, time: null })}
                className={pill(service === entry.id)}
              >
                {entry.name}
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-xs uppercase tracking-widest text-ink-subtle">
            {longDate(date)}
          </h2>
          {slots.some((slot) => slot.available) ? (
            <>
              <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {slots.map((slot) => (
                  <li key={slot.time}>
                    <button
                      type="button"
                      disabled={!slot.available}
                      onClick={() =>
                        go({ time: slot.time, step: "details" })
                      }
                      className={timeTile(slot.available)}
                    >
                      <span className="tabular">{slot.time}</span>
                      {!slot.available && (
                        <span className="sr-only"> — fully booked</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-subtle">
                Greyed times are fully booked for {party}.
              </p>
            </>
          ) : (
            <NoTables party={party} />
          )}
        </section>
      )}

      {date && openServices.length === 0 && (
        <p className="mt-8 rounded-lg border border-line bg-surface px-4 py-6 text-ink-muted">
          {closureFor(date) ??
            `We are closed on ${weekdayOf(date)}s. Try a Wednesday to Sunday.`}
        </p>
      )}
    </div>
  );

  function update(key: keyof Details, value: string) {
    const next = { ...details, [key]: value };
    setDetails(next);
    // Only re-check once they have tried to submit — telling someone
    // their email is wrong at the second character is useless.
    if (submitted) setErrors(validate(next));
  }
}

/* ------------------------------------------------------------------ */

function resolveStep(raw: string | null, date: string, time: string): Step {
  // The step is in the URL, so it can be anything. Never trust it past
  // what has actually been chosen — landing on ?step=confirmed with no
  // date must not render a confirmation for a booking nobody made.
  if (raw === "confirmed" && date && time) return "confirmed";
  if (raw === "details" && date && time) return "details";
  return "when";
}

function clampParty(value: number): number {
  if (!Number.isFinite(value)) return 2;
  return Math.min(Math.max(Math.round(value), 2), roomCapacity.maxPartyOnline);
}

const inputClass =
  "focus-ring w-full rounded-md border border-line bg-surface px-3 py-2.5 text-ink placeholder:text-ink-subtle";

function pill(active: boolean): string {
  return [
    "focus-ring min-w-11 rounded-full border px-4 py-2 text-sm transition-colors",
    active
      ? "border-accent bg-accent text-on-accent"
      : "border-line-strong text-ink-muted hover:border-ink-subtle hover:text-ink",
  ].join(" ");
}

function dateTile(selected: boolean, disabled: boolean): string {
  return [
    "focus-ring w-16 rounded-lg border px-2 py-2 text-center transition-colors",
    disabled
      ? "cursor-not-allowed border-line text-ink-subtle opacity-45"
      : selected
        ? "border-accent bg-accent-soft text-ink"
        : "border-line-strong text-ink-muted hover:border-ink-subtle hover:text-ink",
  ].join(" ");
}

function timeTile(available: boolean): string {
  return [
    "focus-ring w-full rounded-md border px-2 py-2.5 text-sm transition-colors",
    available
      ? "border-herb/40 text-ink hover:border-accent hover:bg-accent-soft"
      : "cursor-not-allowed border-line text-ink-subtle line-through opacity-50",
  ].join(" ");
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const labels = ["When", "Your details", "Confirmed"];
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
      {labels.map((label, index) => {
        const step = index + 1;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={step === current ? "text-accent" : undefined}
              aria-current={step === current ? "step" : undefined}
            >
              <span className="tabular">{step}.</span> {label}
            </span>
            {index < labels.length - 1 && (
              <span aria-hidden="true" className="text-line-strong">
                ⁠—
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function BookingSummary({
  party,
  date,
  service,
  time,
  onChange,
}: {
  party: number;
  date: string;
  service: ServiceId;
  time: string;
  onChange?: () => void;
}) {
  const serviceName = services.find((entry) => entry.id === service)?.name;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-line bg-surface px-4 py-3 text-sm">
      <span className="tabular text-ink">
        {longDate(date)} · {time}
      </span>
      <span className="text-ink-muted">
        {serviceName} · {party} {party === 1 ? "person" : "people"}
      </span>
      {onChange && (
        <button
          type="button"
          onClick={onChange}
          className="focus-ring ml-auto rounded-sm text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          Change
        </button>
      )}
    </div>
  );
}

function NoTables({ party }: { party: number }) {
  return (
    <div className="mt-3 rounded-lg border border-line bg-surface px-4 py-6">
      <p className="text-ink">Nothing left for {party} at this sitting.</p>
      <p className="mt-1 text-sm text-ink-muted">
        Try the other sitting, or another day — the strip above greys out
        anything with nothing left. Six seats at the bar are held for
        walk-ins every service, and you are welcome to ring us on{" "}
        <a
          href={site.address.phoneHref}
          className="focus-ring rounded-sm text-accent underline underline-offset-4"
        >
          {site.address.phone}
        </a>
        {" "}in case of a cancellation.
      </p>
    </div>
  );
}

function Confirmation({
  party,
  date,
  service,
  time,
  name,
}: {
  party: number;
  date: string;
  service: ServiceId;
  time: string;
  name: string;
}) {
  const code = reference(date, service, time, party);
  return (
    <div className="mx-auto max-w-2xl">
      <Steps current={3} />
      <p className="mt-6 text-accent">Table booked</p>
      <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
        {name ? `Thank you, ${name.split(" ")[0]}` : "Thank you"}
      </h1>
      <p className="mt-3 text-ink-muted">
        We have you down for {longDate(date)} at {time}. A confirmation is on
        its way to your inbox.
      </p>

      <BookingSummary
        party={party}
        date={date}
        service={service}
        time={time}
      />

      <dl className="mt-6 space-y-2 rounded-lg border border-line bg-surface px-4 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-subtle">Reference</dt>
          <dd className="tabular font-medium">{code}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-subtle">Table held for</dt>
          <dd>15 minutes past {time}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-subtle">Changes</dt>
          <dd className="text-right">
            <a
              href={site.address.phoneHref}
              className="focus-ring rounded-sm underline underline-offset-4 hover:text-accent"
            >
              {site.address.phone}
            </a>
          </dd>
        </div>
      </dl>

      <p className="mt-6 rounded-lg border border-accent-ring bg-accent-soft px-4 py-3 text-sm text-ink-muted">
        <strong className="font-medium text-ink">
          Nothing was actually booked.
        </strong>{" "}
        This is a website template — there is no restaurant, no kitchen and
        no server. The reference above is derived from the date and time so
        that reloading this page shows the same one.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/menu"
          className="focus-ring rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent hover:bg-accent-hover"
        >
          See what is on
        </Link>
        <Link
          href="/book"
          className="focus-ring rounded-full border border-line-strong px-6 py-3 text-sm text-ink-muted hover:text-ink"
        >
          Book another table
        </Link>
      </div>

    </div>
  );
}

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
