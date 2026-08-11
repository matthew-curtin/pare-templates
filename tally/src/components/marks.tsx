import type { DayCell, DayState, Severity } from "@/lib/availability";
import {
  SEVERITY_LABEL,
  fmtBudget,
  fmtDate,
  weekdayOf,
} from "@/lib/availability";

/**
 * The marks: the ninety-day tally, and the small pieces that label it.
 *
 * Two channels carry state on every mark — hue AND height — because a bar
 * two pixels wide has no room for a word. See the ramp note in globals.css
 * for why that redundancy is the accessibility fix here rather than the
 * double-encoding §4b warns about.
 */

const STATE_CLASS: Record<DayState, string> = {
  none: "day-none",
  ok: "day-ok",
  degraded: "day-degraded",
  partial: "day-partial",
  major: "day-major",
  maintenance: "day-maintenance",
};

const STATE_LABEL: Record<DayState, string> = {
  none: "Not yet launched",
  ok: "Fully available",
  degraded: "Degraded",
  partial: "Partial outage",
  major: "Major outage",
  maintenance: "Announced maintenance",
};

export function stateLabel(state: DayState): string {
  return STATE_LABEL[state];
}

/** A day's whole story, for the native tooltip. */
function dayTitle(cell: DayCell): string {
  const when = `${weekdayOf(cell.dayIndex)} ${fmtDate(cell.startMin)}`;
  if (cell.state === "none") return `${when} — before this service launched`;
  if (cell.state === "ok") return `${when} — no incidents`;
  const lost = cell.lostMin > 0 ? `, ${fmtBudget(cell.lostMin)} of budget` : "";
  return `${when} — ${STATE_LABEL[cell.state]}${lost}`;
}

/**
 * The strip.
 *
 * `aria-hidden` is wrong here and `role="img"` with a summary is right:
 * ninety focusable spans is noise, but "84 days fully available, 4
 * degraded" is the same information in one sentence — and every exact
 * figure behind it is written out in the incident list on the same page.
 */
export function Tally({
  cells,
  name,
  height = "2.25rem",
  linkIndex,
}: {
  cells: DayCell[];
  name: string;
  height?: string;
  /** Incident id → index, for the per-incident highlight rules. */
  linkIndex?: Map<string, number>;
}) {
  const counts = cells.reduce<Record<string, number>>((acc, c) => {
    acc[c.state] = (acc[c.state] ?? 0) + 1;
    return acc;
  }, {});

  const summary = (Object.keys(STATE_LABEL) as DayState[])
    .filter((s) => counts[s])
    .map((s) => `${counts[s]} ${STATE_LABEL[s].toLowerCase()}`)
    .join(", ");

  return (
    <div
      className="tally tally-data"
      style={{ "--tally-h": height } as React.CSSProperties}
      role="img"
      aria-label={`${name}, last ${cells.length} days: ${summary}.`}
    >
      {cells.map((cell) => {
        const links = linkIndex
          ? cell.incidentIds
              .map((id) => linkIndex.get(id))
              .filter((n): n is number => n !== undefined)
              .map((n) => `dl-${n}`)
              .join(" ")
          : "";
        return (
          <span
            key={cell.dayIndex}
            className={`day ${STATE_CLASS[cell.state]} ${cell.today ? "day-today" : ""} ${links}`}
            title={dayTitle(cell)}
          />
        );
      })}
    </div>
  );
}

/** Date ticks under a strip. Three of them: start, middle, today. */
export function TallyTicks({ cells }: { cells: DayCell[] }) {
  if (cells.length === 0) return null;
  const first = cells[0];
  const mid = cells[Math.floor(cells.length / 2)];
  return (
    <div className="mt-1.5 flex justify-between">
      <span className="tick num">{fmtDate(first.startMin)}</span>
      <span className="tick num">{fmtDate(mid.startMin)}</span>
      <span className="tick num">Today</span>
    </div>
  );
}

export function StatusDot({ state, live = false }: { state: DayState; live?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`dot ${state === "none" ? "bg-void" : ""} ${live ? "dot-live" : ""}`}
      style={
        state === "none"
          ? undefined
          : ({ background: `var(--color-${state === "maintenance" ? "maint" : state})` } as React.CSSProperties)
      }
    />
  );
}

/**
 * A status, as a dot AND a word — never as a dot alone.
 *
 * §4b: colour beside its own name is a second cue, and the words are doing
 * the work. Colour alone is only asked to carry meaning on the day marks,
 * where it has the height channel beside it.
 */
export function StatusChip({ state }: { state: DayState }) {
  return (
    <span className="chip">
      <StatusDot state={state} />
      {STATE_LABEL[state]}
    </span>
  );
}

export function SeverityWord({ severity }: { severity: Severity }) {
  return (
    <span className="inline-flex items-center gap-2">
      <StatusDot state={severity} />
      <span>{SEVERITY_LABEL[severity]}</span>
    </span>
  );
}

/** The key to the strip. Every page that draws one carries it once. */
export function TallyLegend() {
  const shown: DayState[] = ["ok", "degraded", "partial", "major", "maintenance", "none"];
  return (
    <ul className="flex flex-wrap items-end gap-x-5 gap-y-2">
      {shown.map((state) => (
        <li key={state} className="flex items-end gap-2">
          <span
            className="tally w-2"
            style={{ "--tally-h": "1.125rem" } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className={`day ${STATE_CLASS[state]}`} />
          </span>
          <span className="text-micro text-ink-dim leading-none">{STATE_LABEL[state]}</span>
        </li>
      ))}
    </ul>
  );
}
