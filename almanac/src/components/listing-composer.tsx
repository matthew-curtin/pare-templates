"use client";

import { useMemo, useState } from "react";
import {
  contracts,
  now,
  patterns,
  payBasis,
  sectors,
  thresholds,
  ZONE,
} from "@/content/site";
import type { Contract, Hours, Pattern, Pay, Sector } from "@/content/types";
import { closingLabel, closingState, longDate } from "@/lib/dates";
import { hoursLabel, payLabel } from "@/lib/pay";
import { VacancyCard, type CardData } from "./vacancy-card";
import { RuleLabel } from "./chips";

const nowMs = Date.parse(now);
const today = new Date(nowMs).toLocaleDateString("en-CA", { timeZone: ZONE });

type PayKind = "range" | "exact" | "hourly" | "daily" | "voluntary";
type HoursKind = Hours["kind"];

/**
 * Compose a listing and watch it appear.
 *
 * The preview is the real `VacancyCard` with real `payLabel` and
 * `closingState` behind it, not a lookalike — so switching Hours to
 * part time makes the pro-rata footnote appear with the correct
 * figures in it, and setting a closing date next week turns the date
 * red. A preview built from a second, similar component is a preview
 * that is quietly wrong about the thing you are checking.
 *
 * Note what the form cannot do: there is no "salary not stated"
 * option. The listing policy is not a rule enforced after the fact,
 * it is a field you cannot leave empty.
 */
export function ListingComposer() {
  const [title, setTitle] = useState("Community Engagement Officer");
  const [org, setOrg] = useState("Wrenfield Borough Council");
  const [kind, setKind] = useState("Council");
  const [place, setPlace] = useState("Wrenfield");
  const [sector, setSector] = useState<Sector>("Local government");
  const [contract, setContract] = useState<Contract>("Permanent");
  const [term, setTerm] = useState("12 months");
  const [pattern, setPattern] = useState<Pattern>("Hybrid");
  const [hoursKind, setHoursKind] = useState<HoursKind>("Full time");
  const [hoursPerWeek, setHoursPerWeek] = useState(22.2);
  const [payKind, setPayKind] = useState<PayKind>("range");
  const [payMin, setPayMin] = useState(33000);
  const [payMax, setPayMax] = useState(36500);
  const [rate, setRate] = useState(14.5);
  const [closes, setCloses] = useState("2026-10-16");
  const [summary, setSummary] = useState(
    "Work with residents' groups across the borough on the neighbourhood plan, running consultations that people actually attend.",
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const hours: Hours = useMemo(() => {
    switch (hoursKind) {
      case "Part time":
        return { kind: "Part time", hoursPerWeek };
      case "Job share":
        return { kind: "Job share", hoursPerWeek };
      case "Casual":
        return { kind: "Casual", note: "As required" };
      default:
        return { kind: "Full time" };
    }
  }, [hoursKind, hoursPerWeek]);

  const pay: Pay = useMemo(() => {
    switch (payKind) {
      case "exact":
        return { kind: "exact", amount: payMin };
      case "hourly":
        return { kind: "hourly", rate };
      case "daily":
        return { kind: "daily", rate };
      case "voluntary":
        return {
          kind: "voluntary",
          note: "Unpaid. Reasonable expenses reimbursed.",
        };
      default:
        return { kind: "range", min: payMin, max: payMax };
    }
  }, [payKind, payMin, payMax, rate]);

  const label = payLabel(pay, hours, payBasis);
  const closing = closingState(closes, nowMs, ZONE, thresholds.closingWithin);

  const card: CardData = {
    title: title.trim() || "Untitled vacancy",
    employerName: org.trim() || "Your organisation",
    employerKind: kind,
    place: place.trim() || "Somewhere",
    summary:
      summary.trim() ||
      "A sentence or two about the job, which is what people read before they decide to read the rest.",
    chips: [
      contract + (contract === "Fixed term" || contract === "Interim" ? `, ${term}` : ""),
      pattern,
      hoursLabel(hours),
    ],
    payHeadline: label.headline,
    payNote: label.note,
    closingText: closingLabel(closing, closes, ZONE),
    closingTone:
      closing.kind === "closed"
        ? "closed"
        : closing.kind === "today" || closing.kind === "soon"
          ? "urgent"
          : "quiet",
    featured: false,
    fresh: true,
    closed: closing.kind === "closed",
  };

  function check(event: React.FormEvent) {
    event.preventDefault();
    const found: string[] = [];
    if (title.trim().length < 4) found.push("The job needs a title.");
    if (org.trim().length < 2) found.push("Name the organisation.");
    if (summary.trim().length < 30) {
      found.push("The summary is too short to tell anyone anything.");
    }
    if (closing.kind === "closed") {
      found.push(
        `The closing date has already passed. It needs to be after ${longDate(today, ZONE)}.`,
      );
    }
    if (payKind === "range" && payMax <= payMin) {
      found.push("The top of the band has to be above the bottom of it.");
    }
    setErrors(found);
    setSubmitted(found.length === 0);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* noValidate: the list of problems below is this form's own, and
          a browser bubble on top of it says the same thing twice. */}
      <form onSubmit={check} noValidate className="space-y-6">
        <div className="space-y-3">
          <RuleLabel>The job</RuleLabel>
          <Field label="Title">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={input}
            />
          </Field>
          <Field label="Summary">
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              className={`${input} resize-y`}
            />
            <span className="tabular mt-1 block text-xs text-ink-subtle">
              {summary.trim().length} characters. Two sentences is plenty.
            </span>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Sector">
              <select
                value={sector}
                onChange={(event) => setSector(event.target.value as Sector)}
                className={input}
              >
                {sectors.map((one) => (
                  <option key={one}>{one}</option>
                ))}
              </select>
            </Field>
            <Field label="Closing date">
              <input
                type="date"
                value={closes}
                min={today}
                onChange={(event) => setCloses(event.target.value)}
                className={`${input} tabular`}
              />
            </Field>
          </div>
        </div>

        <div className="space-y-3">
          <RuleLabel>The organisation</RuleLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                value={org}
                onChange={(event) => setOrg(event.target.value)}
                className={input}
              />
            </Field>
            <Field label="Kind">
              <input
                value={kind}
                onChange={(event) => setKind(event.target.value)}
                className={input}
              />
            </Field>
            <Field label="Place">
              <input
                value={place}
                onChange={(event) => setPlace(event.target.value)}
                className={input}
              />
            </Field>
            <Field label="Where the work happens">
              <select
                value={pattern}
                onChange={(event) => setPattern(event.target.value as Pattern)}
                className={input}
              >
                {patterns.map((one) => (
                  <option key={one}>{one}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="space-y-3">
          <RuleLabel>Terms</RuleLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Contract">
              <select
                value={contract}
                onChange={(event) => setContract(event.target.value as Contract)}
                className={input}
              >
                {contracts.map((one) => (
                  <option key={one}>{one}</option>
                ))}
              </select>
            </Field>
            {(contract === "Fixed term" || contract === "Interim") && (
              <Field label="How long">
                <input
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  className={input}
                />
              </Field>
            )}
            <Field label="Hours">
              <select
                value={hoursKind}
                onChange={(event) => setHoursKind(event.target.value as HoursKind)}
                className={input}
              >
                <option>Full time</option>
                <option>Part time</option>
                <option>Job share</option>
                <option>Casual</option>
              </select>
            </Field>
            {(hoursKind === "Part time" || hoursKind === "Job share") && (
              <Field label="Hours a week">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max={payBasis.fullTimeWeek}
                  value={hoursPerWeek}
                  onChange={(event) => setHoursPerWeek(Number(event.target.value))}
                  className={`${input} tabular`}
                />
              </Field>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <RuleLabel>Pay</RuleLabel>
          <p className="text-xs leading-relaxed text-ink-subtle">
            There is no option here for leaving this blank. Quote the
            full-time band for a part-time post as you normally would —
            we work out and publish what it actually pays.
          </p>
          <Field label="Quoted as">
            <select
              value={payKind}
              onChange={(event) => setPayKind(event.target.value as PayKind)}
              className={input}
            >
              <option value="range">A band</option>
              <option value="exact">A single figure</option>
              <option value="hourly">An hourly rate</option>
              <option value="daily">A day rate</option>
              <option value="voluntary">Unpaid</option>
            </select>
          </Field>
          {(payKind === "range" || payKind === "exact") && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={payKind === "range" ? "Bottom" : "Salary"}>
                <input
                  type="number"
                  step="100"
                  value={payMin}
                  onChange={(event) => setPayMin(Number(event.target.value))}
                  className={`${input} tabular`}
                />
              </Field>
              {payKind === "range" && (
                <Field label="Top">
                  <input
                    type="number"
                    step="100"
                    value={payMax}
                    onChange={(event) => setPayMax(Number(event.target.value))}
                    className={`${input} tabular`}
                  />
                </Field>
              )}
            </div>
          )}
          {(payKind === "hourly" || payKind === "daily") && (
            <Field label={payKind === "hourly" ? "Per hour" : "Per day"}>
              <input
                type="number"
                step="0.05"
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
                className={`${input} tabular`}
              />
            </Field>
          )}
        </div>

        {errors.length > 0 && (
          <div className="rounded-card border border-urgent bg-urgent-soft p-4">
            <p className="font-semibold text-urgent">
              {errors.length === 1
                ? "One thing to fix"
                : `${errors.length} things to fix`}
            </p>
            <ul className="mt-2 space-y-1">
              {errors.map((message) => (
                <li key={message} className="text-sm text-ink-muted">
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {submitted && errors.length === 0 && (
          <div className="rounded-card border border-accent-ring bg-accent-soft p-4">
            <p className="font-semibold text-ink">
              That would go to Ruth to read.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              In a real version you would pay here and it would be on the
              board within a working day. This is a template, so nothing
              was sent anywhere.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="focus-ring rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-accent-hover"
        >
          Check and continue
        </button>
      </form>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <RuleLabel>How it will look</RuleLabel>
        <div className="mt-4">
          <VacancyCard data={card} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
          This is the same card the board draws, with the same
          arithmetic behind it — so the figure in the corner is what a
          reader will see, including what a part-time post actually
          pays.
        </p>
      </div>
    </div>
  );
}

const input =
  "focus-ring w-full rounded-sm border border-field bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label mb-1.5 block text-ink-subtle">{label}</span>
      {children}
    </label>
  );
}
