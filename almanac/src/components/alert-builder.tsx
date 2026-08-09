"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { patterns, salaryFloors, sectors } from "@/content/site";
import {
  emptyFilters,
  matchesFilters,
  type Filters,
  type Listing,
} from "@/lib/filters";
import { formatMoney } from "@/lib/pay";
import { RuleLabel } from "./chips";

export interface AlertRow {
  listing: Listing;
  title: string;
  employerName: string;
  slug: string;
  closingText: string;
}

/**
 * Build an alert and see immediately what it would have caught.
 *
 * The count is the whole point. An alert is a promise about the future
 * and there is normally no way to tell whether you have written a good
 * one until weeks of silence have gone by — at which point you cannot
 * tell a narrow alert from a quiet month. Running it against the
 * current board answers that in the only honest way available.
 *
 * It uses the same `matchesFilters` the board uses, so an alert cannot
 * disagree with the search that created it.
 */
export function AlertBuilder({ rows }: { rows: AlertRow[] }) {
  const [chosenSectors, setSectors] = useState<string[]>([]);
  const [chosenPatterns, setPatterns] = useState<string[]>([]);
  const [floor, setFloor] = useState(0);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("weekly");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const filters: Filters = useMemo(
    () => ({
      ...emptyFilters,
      sectors: chosenSectors,
      patterns: chosenPatterns,
      floor,
    }),
    [chosenSectors, chosenPatterns, floor],
  );

  const matches = useMemo(
    () => rows.filter((row) => matchesFilters(row.listing, filters)),
    [rows, filters],
  );

  function toggle(value: string, list: string[], set: (next: string[]) => void) {
    set(
      list.includes(value) ? list.filter((one) => one !== value) : [...list, value],
    );
    setSaved(null);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (trimmed === "") {
      setError("We need an address to send it to.");
      return;
    }
    // Deliberately loose. A stricter pattern rejects real addresses,
    // and the only test that matters is whether the mail arrives.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That does not look like an email address.");
      return;
    }
    setError(null);
    setSaved(trimmed);
  }

  if (saved) {
    return (
      <div className="rounded-card bg-surface p-7 shadow-card ring-1 ring-accent-ring">
        <h2 className="text-xl font-bold tracking-tight text-ink">
          That would be a {frequency} alert to {saved}
        </h2>
        <p className="mt-2.5 leading-relaxed text-ink-muted">
          Except that it would not, because this is a template and nothing
          here talks to a server. In a real one you would now get an email
          asking you to confirm.
        </p>
        <p className="mt-4 text-ink-muted">
          It would have caught{" "}
          <strong className="tabular font-bold text-ink">
            {matches.length}
          </strong>{" "}
          of the {rows.length} jobs currently on the board.
        </p>
        <button
          type="button"
          onClick={() => setSaved(null)}
          className="focus-ring mt-6 rounded-lg bg-sunk px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-line"
        >
          Change it
        </button>
      </div>
    );
  }

  return (
    /* noValidate on purpose. The browser's own bubble pre-empts this
       form's validation and looks nothing like the rest of the page, so
       the inline message below the field is the one people see. */
    <form onSubmit={submit} noValidate className="space-y-9">
      <div className="space-y-3">
        <RuleLabel>Sectors</RuleLabel>
        <p className="text-xs text-ink-subtle">
          Leave everything off for all of them.
        </p>
        <div className="flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <Toggle
              key={sector}
              on={chosenSectors.includes(sector)}
              onClick={() => toggle(sector, chosenSectors, setSectors)}
            >
              {sector}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <RuleLabel>Where</RuleLabel>
        <div className="flex flex-wrap gap-2">
          {patterns.map((pattern) => (
            <Toggle
              key={pattern}
              on={chosenPatterns.includes(pattern)}
              onClick={() => toggle(pattern, chosenPatterns, setPatterns)}
            >
              {pattern}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <RuleLabel>Pays at least</RuleLabel>
        <div className="flex flex-wrap gap-2">
          <Toggle on={floor === 0} onClick={() => setFloor(0)}>
            Any
          </Toggle>
          {salaryFloors.map((amount) => (
            <Toggle
              key={amount}
              on={floor === amount}
              onClick={() => setFloor(amount)}
            >
              {formatMoney(amount)}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <RuleLabel>How often</RuleLabel>
        <div className="flex flex-wrap gap-2">
          <Toggle on={frequency === "daily"} onClick={() => setFrequency("daily")}>
            Every morning
          </Toggle>
          <Toggle
            on={frequency === "weekly"}
            onClick={() => setFrequency("weekly")}
          >
            Monday mornings
          </Toggle>
        </div>
      </div>

      <MatchPreview matches={matches} total={rows.length} />

      <div className="space-y-2">
        <label
          htmlFor="alert-email"
          className="block text-sm font-semibold tracking-tight text-ink"
        >
          Where to send it
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="alert-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            placeholder="you@example.org"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "alert-email-error" : undefined}
            className={`focus-ring min-w-0 flex-1 rounded-lg border bg-surface px-3.5 py-3 text-sm text-ink shadow-card transition-colors placeholder:text-ink-subtle ${
              error ? "border-urgent" : "border-line-strong hover:border-field"
            }`}
          />
          <button
            type="submit"
            className="focus-ring rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Create the alert
          </button>
        </div>
        {error && (
          <p id="alert-email-error" className="text-sm text-urgent">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

function MatchPreview({
  matches,
  total,
}: {
  matches: AlertRow[];
  total: number;
}) {
  if (matches.length === 0) {
    return (
      <div className="rounded-card bg-sunk p-6">
        <p className="font-semibold text-ink">
          Nothing on the board matches that today.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          You can still create it — but an alert this narrow may be quiet
          for months, and it is worth knowing that now rather than
          wondering later whether it is working.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card bg-surface p-6 shadow-card">
      <p className="text-ink">
        This would have caught{" "}
        <strong className="tabular font-bold">{matches.length}</strong> of the{" "}
        {total} jobs on the board today.
      </p>
      <ul className="mt-4 space-y-2.5">
        {matches.slice(0, 5).map((row) => (
          <li key={row.listing.id} className="flex flex-wrap justify-between gap-2">
            <Link
              href={`/jobs/${row.slug}`}
              className="focus-ring min-w-0 text-sm font-medium text-accent hover:underline hover:underline-offset-2"
            >
              {row.title}
              <span className="font-normal text-ink-subtle">
                {" "}
                · {row.employerName}
              </span>
            </Link>
            <span className="tabular shrink-0 text-xs text-ink-subtle">
              {row.closingText}
            </span>
          </li>
        ))}
      </ul>
      {matches.length > 5 && (
        <p className="mt-3.5 text-xs text-ink-subtle">
          and {matches.length - 5} more.
        </p>
      )}
    </div>
  );
}

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        on
          ? "bg-primary text-on-primary"
          : "bg-surface text-ink-muted shadow-card hover:bg-hover hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
