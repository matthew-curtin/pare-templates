import Link from "next/link";
import type { ServiceRow } from "@/lib/board";
import { fmtBudget, fmtPct } from "@/lib/availability";
import { Tally, StatusDot } from "@/components/marks";

/**
 * The architecture, as one component.
 *
 * A board row is an identity / tally / budget triptych, and that triptych
 * is the unit every page on this site is built out of. The row responds to
 * ITS OWN width rather than the viewport's — see the `.board` note in
 * globals.css, which also explains why no `:has()` rule may reach in here.
 */

function verdict(row: ServiceRow): { word: string; cls: string } {
  if (row.burn > 1) return { word: "Over budget", cls: "budget-over" };
  if (row.burn > 0.75) return { word: "Spending fast", cls: "budget-warn" };
  if (row.strip.partial) return { word: "Partial window", cls: "budget-fine" };
  return { word: "Within budget", cls: "budget-fine" };
}

/**
 * Two marks on one track: what has been SPENT, and how far through the
 * quarter we ARE. Reading one against the other is the whole point, which
 * is why they share a track instead of being two numbers side by side.
 *
 * On hover the fill runs to where this burn rate lands at quarter end.
 * `--fill` is deliberately absent from these inline styles — see the
 * stylesheet.
 */
export function BudgetBar({ row }: { row: ServiceRow }) {
  const v = verdict(row);
  const consumed = Math.min(100, row.consumed * 100);
  const elapsed = Math.min(100, row.elapsed * 100);
  const projected = Math.min(100, row.burn * 100);

  return (
    <div>
      <div
        className={`budget ${v.cls}`}
        style={
          {
            "--consumed": `${consumed.toFixed(1)}%`,
            "--elapsed": `${elapsed.toFixed(1)}%`,
            "--projected": `${projected.toFixed(1)}%`,
          } as React.CSSProperties
        }
      />
      <p className="num mt-1.5 text-micro text-ink-dim">
        {consumed.toFixed(1)}% spent · {elapsed.toFixed(1)}% elapsed
      </p>
    </div>
  );
}

export function BoardRow({ row }: { row: ServiceRow }) {
  const v = verdict(row);
  return (
    <div className="board-row budget-host">
      <div>
        <Link
          href={`/services/${row.service.slug}`}
          className="row-label flex items-center gap-2 text-ink hover:text-accent transition-colors"
        >
          <StatusDot state={row.live} />
          {row.service.name}
        </Link>
        <p className="num mt-0.5 text-micro text-ink-faint">
          target {fmtPct(row.service.target, 2)} · {row.service.group}
        </p>
      </div>

      <div className="row-tally">
        <Tally cells={row.cells} name={row.service.name} />
      </div>

      <div className="text-right">
        <p className="num text-ink">{fmtPct(row.quarter.availability)}</p>
        <p
          className="text-micro"
          style={{
            color:
              row.burn > 1
                ? "var(--color-major)"
                : row.burn > 0.75
                  ? "var(--color-partial)"
                  : "var(--color-ink-faint)",
          }}
        >
          {v.word}
        </p>
      </div>
    </div>
  );
}

/** The same triptych with the budget bar shown rather than summarised. */
export function BudgetRow({ row }: { row: ServiceRow }) {
  const v = verdict(row);
  return (
    <div className="board-row budget-host">
      <div>
        <Link
          href={`/services/${row.service.slug}`}
          className="row-label text-ink hover:text-accent transition-colors"
        >
          {row.service.name}
        </Link>
        <p className="num mt-0.5 text-micro text-ink-faint">
          {fmtBudget(row.quarter.lostMin)} of {fmtBudget(row.quarter.allowanceMin)} earned
        </p>
      </div>

      <div className="row-tally">
        <BudgetBar row={row} />
      </div>

      <div className="text-right">
        <p className="num text-ink">{row.burn.toFixed(2)}×</p>
        <p
          className="text-micro"
          style={{
            color: row.burn > 1 ? "var(--color-major)" : "var(--color-ink-faint)",
          }}
        >
          {v.word}
        </p>
      </div>
    </div>
  );
}
