import Link from "next/link";
import type { IncidentView } from "@/lib/board";
import {
  SEVERITY_LABEL,
  fmtBudget,
  fmtDateShort,
  fmtDuration,
  fmtTime,
} from "@/lib/availability";
import { StatusDot } from "@/components/marks";

/**
 * The incident log.
 *
 * One entry per incident, and the entry carries what it COST rather than
 * only what it was — duration and impact together, because either alone is
 * the wrong number (see the pair on the front page).
 *
 * `log-entry-*` classes are what the CSS-only filters in globals.css act
 * on. `le-N` is what the per-incident strip highlighting keys off; see
 * `StripLinkStyles` below.
 */

export function LogEntry({
  view,
  index,
  showBudget = true,
}: {
  view: IncidentView;
  /** Position in the list, used only for the strip-highlight link. */
  index?: number;
  showBudget?: boolean;
}) {
  const { incident: inc } = view;
  const classes = [
    "log-entry",
    `log-entry-${inc.severity}`,
    view.open ? "log-entry-open" : "log-entry-resolved",
    index !== undefined ? `le-${index}` : "",
  ].join(" ");

  return (
    <li className={`${classes} border-t border-line-soft`}>
      <Link
        href={`/incidents/${inc.slug}`}
        className="grid gap-x-4 gap-y-1 px-2 py-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] -mx-2 rounded"
      >
        <span className="num text-micro text-ink-faint">
          {fmtDateShort(inc.startMin)} {fmtTime(inc.startMin)}
        </span>

        <span>
          <span className="flex items-center gap-2 text-ink">
            <StatusDot state={inc.severity} live={view.open} />
            <span className="font-medium">{inc.title}</span>
          </span>
          <span className="mt-0.5 block text-micro text-ink-faint">
            {SEVERITY_LABEL[inc.severity]} ·{" "}
            {view.spend.map((s) => s.service.name).join(", ")}
            {view.open && (
              <span style={{ color: "var(--color-degraded)" }}> · open now</span>
            )}
          </span>
        </span>

        <span className="num text-micro text-ink-dim sm:text-right">
          {fmtDuration(view.durationMin)}
          {showBudget && (
            <span className="block text-ink-faint">
              {inc.severity === "maintenance"
                ? "no budget"
                : `${fmtBudget(view.totalBudgetMin)} spent`}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

export function IncidentLog({
  views,
  linked = false,
  showBudget = true,
}: {
  views: IncidentView[];
  /** Adds the index classes the strip highlight needs. */
  linked?: boolean;
  showBudget?: boolean;
}) {
  if (views.length === 0) {
    return (
      <p className="prose-body border-t border-line-soft py-8 text-ink-faint">
        Nothing to report. This service has not had an incident in the period
        shown, which is the least interesting sentence on this site and the one
        we would like to write most often.
      </p>
    );
  }
  return (
    <ul>
      {views.map((view, i) => (
        <LogEntry
          key={view.incident.id}
          view={view}
          index={linked ? i : undefined}
          showBudget={showBudget}
        />
      ))}
    </ul>
  );
}

/**
 * The per-incident highlight rules.
 *
 * CSS has no way to say "light the days whose incident list contains the
 * one being hovered" — `:has()` relates elements, not values — so the
 * cross-reference has to be written out, one rule per incident. It is
 * generated from the same data that draws the marks, so the two cannot
 * disagree, and the DIMMING half lives in globals.css where it is
 * asserted. Fourteen small rules; the alternative was fourteen of them
 * hand-written with a fixed ceiling.
 */
export function StripLinkStyles({ count }: { count: number }) {
  const rules = Array.from(
    { length: count },
    (_, i) =>
      `.strip-linked:has(.le-${i}:hover) .tally-data .day.dl-${i},` +
      `.strip-linked:has(.le-${i}:focus-within) .tally-data .day.dl-${i}{opacity:1}`,
  ).join("");
  return <style>{rules}</style>;
}

/** Which services an incident touched, with what it cost each of them. */
export function SpendTable({ view }: { view: IncidentView }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        What this incident cost each service it affected.
      </caption>
      <thead>
        <tr className="rule">
          <th scope="col" className="eyebrow py-2 pr-4 font-normal">Service</th>
          <th scope="col" className="eyebrow py-2 pr-4 font-normal">Requests affected</th>
          <th scope="col" className="eyebrow py-2 pr-4 text-right font-normal">Budget spent</th>
          <th scope="col" className="eyebrow py-2 text-right font-normal">Of the quarter</th>
        </tr>
      </thead>
      <tbody>
        {view.spend.map((s) => (
          <tr key={s.service.id} className="border-t border-line-soft align-baseline">
            <td className="py-3 pr-4">
              <Link
                href={`/services/${s.service.slug}`}
                className="text-ink hover:text-accent transition-colors"
              >
                {s.service.name}
              </Link>
              <span className="prose-body mt-1 block max-w-md text-micro text-ink-faint">
                {s.note}
              </span>
            </td>
            <td className="num py-3 pr-4 text-ink-dim">
              {(s.fraction * 100).toFixed(0)}%
            </td>
            <td className="num py-3 pr-4 text-right">
              {view.incident.severity === "maintenance" ? "—" : fmtBudget(s.budgetMin)}
            </td>
            <td className="num py-3 text-right text-ink-dim">
              {view.incident.severity === "maintenance"
                ? "excluded"
                : `${(s.shareOfQuarter * 100).toFixed(1)}%`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

