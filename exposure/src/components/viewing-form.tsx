"use client";

import { useState } from "react";
import { clock, hoursShort } from "@/lib/format";

export type ViewingOption = {
  slug: string;
  address: string;
  mainRoom: string;
  compass: string;
  decHours: number;
  flattering: number | null;
  honest: number | null;
};

type Errors = Partial<Record<"name" | "email" | "date", string>>;

/**
 * A booking form that recommends the wrong hour on purpose.
 *
 * `honest` is the middle of the longest stretch of DAYLIGHT WITH NO SUN
 * in the principal room on the shortest day — the hour at which the room
 * has nothing to show you, and therefore the hour at which you find
 * something out. It is preselected. The hour an agent would book is
 * printed next to it, named, so the reader can see the choice being made
 * rather than be quietly steered.
 *
 * `noValidate` per §8: the browser validates `type="email"` before a
 * submit handler ever runs, so a form with designed error messages
 * mostly shows a native bubble instead — and its own branches go
 * untested and then wrong.
 */
export function ViewingForm({
  options,
  initial,
}: {
  options: ViewingOption[];
  initial: string;
}) {
  const [slug, setSlug] = useState(
    options.some((o) => o.slug === initial) ? initial : options[0].slug,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [when, setWhen] = useState<"honest" | "flattering">("honest");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  const home = options.find((o) => o.slug === slug)!;
  const honest = home.honest;
  const flattering = home.flattering;
  const chosen = when === "honest" ? honest : flattering;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "We need a name to put on the door.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "That does not look like an address we could reply to.";
    }
    if (!date) next.date = "Pick a day.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setSent(null);
      return;
    }
    setSent(
      `${home.address}, ${date}${chosen === null ? "" : `, ${clock(chosen)}`}.`,
    );
  };

  const field =
    "focus-ring mt-2 w-full border border-line-strong bg-surface px-3 py-2.5 text-[0.9375rem]";

  return (
    <form onSubmit={submit} noValidate className="max-w-xl">
      <label className="block">
        <span className="datum block text-[0.6875rem] uppercase text-ink-subtle">
          Which home
        </span>
        <select
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSent(null);
          }}
          className={field}
        >
          {options.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.address}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="mt-7 border-0 p-0">
        <legend className="datum text-[0.6875rem] uppercase text-ink-subtle">
          When to come
        </legend>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
          The {home.mainRoom.toLowerCase()} faces {home.compass} and takes{" "}
          {home.decHours === 0
            ? "no direct sun at all"
            : `${hoursShort(home.decHours)} of direct sun`}{" "}
          on the shortest day of the year.
        </p>
        <div className="mt-4 space-y-3">
          {(
            [
              [
                "honest",
                honest,
                "When there is no sun in the principal room",
                "The hour that tells you something. It is the one we recommend and the one nobody books.",
                // A null here and a null below mean OPPOSITE things, and
                // one message for both would state the reverse of the
                // truth on half the homes on this site.
                "There is direct sun in this room for every daylight hour on 21 December, so there is no such hour to offer.",
              ],
              [
                "flattering",
                flattering,
                "When there is",
                "The hour an agent would offer you, and the hour the photographs were taken in.",
                "There is no direct sun in this room at any hour on 21 December, so there is no such hour to offer.",
              ],
            ] as const
          ).map(([key, hour, label, note, absent]) => (
            <label
              key={key}
              className={`flex cursor-pointer gap-3 border p-4 transition-colors ${
                when === key ? "border-ink bg-surface" : "border-line hover:border-line-strong"
              }`}
            >
              <input
                type="radio"
                name="when"
                checked={when === key}
                onChange={() => {
                  setWhen(key);
                  setSent(null);
                }}
                className="mt-1 self-start"
              />
              <span>
                <span className="block text-[0.9375rem]">
                  {label}
                  {hour !== null && (
                    <span className="figure ml-2 text-ink-muted">
                      {clock(hour)}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-subtle">
                  {hour === null ? absent : note}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="datum block text-[0.6875rem] uppercase text-ink-subtle">
            Your name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? "true" : undefined}
            className={field}
          />
          {errors.name && (
            <span className="mt-1.5 block text-[0.8125rem] text-ink">
              {errors.name}
            </span>
          )}
        </label>
        <label className="block">
          <span className="datum block text-[0.6875rem] uppercase text-ink-subtle">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? "true" : undefined}
            className={field}
          />
          {errors.email && (
            <span className="mt-1.5 block text-[0.8125rem] text-ink">
              {errors.email}
            </span>
          )}
        </label>
      </div>

      <label className="mt-5 block max-w-xs">
        <span className="datum block text-[0.6875rem] uppercase text-ink-subtle">
          Day
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-invalid={errors.date ? "true" : undefined}
          className={field}
        />
        {errors.date && (
          <span className="mt-1.5 block text-[0.8125rem] text-ink">
            {errors.date}
          </span>
        )}
      </label>

      <button
        type="submit"
        className="focus-ring mt-8 bg-ink px-5 py-2.5 text-[0.9375rem] text-canvas transition-opacity hover:opacity-85"
      >
        Ask for this viewing
      </button>

      {sent && (
        <p
          key={sent}
          className="arrives mt-6 border-l-2 border-l-sun bg-surface px-4 py-3.5 text-[0.9375rem] leading-relaxed"
          role="status"
        >
          Asked for: {sent} Nothing has been sent anywhere — this is a
          template, and the office does not exist.
        </p>
      )}
    </form>
  );
}
