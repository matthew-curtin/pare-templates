import Link from "next/link";
import type { Firing } from "@/lib/schedule";
import { Chip } from "./bits";
import { Elevation } from "./drawing";
import { Gauge } from "./gauge";
import { fromToday, longDate, money, percent } from "@/lib/format";
import { costOf, kilnOf, perPiece, pieceOf, programOf } from "@/lib/studio";

/**
 * One planned firing.
 *
 * The elevation, the gauge and the cost are the three things a member
 * wants, and they are three views of the same fact: how much of this
 * kiln is spoken for. The card goes cold when its gauge does, via the
 * `:has()` rule in globals.css — the status is declared once, on the
 * gauge, and read by the card rather than passed to it twice.
 */
export function FiringCard({ firing, compact = false }: { firing: Firing; compact?: boolean }) {
  const kiln = kilnOf(firing.kilnId);
  const program = programOf(firing.programId);
  if (!kiln || !program) return null;

  const each = perPiece(firing);
  const short = firing.status === "postponed";

  return (
    <article className="kiln-card min-w-0 border border-line bg-paper p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[1.25rem] leading-tight">
          <Link href={`/firings/${firing.id}`} className="focus-ring">
            {kiln.name}
          </Link>{" "}
          <span className="font-[family-name:var(--font-sans)] text-[0.9375rem] text-ink-muted">
            {program.name}, cone {program.cone}
          </span>
        </h3>
        <Chip heat={short ? "cold" : firing.status === "loading" ? "fire" : "quiet"}>
          {firing.status === "loading"
            ? `Loading, ${fromToday(firing.day)}`
            : short
              ? "Will not light"
              : firing.status === "open"
                ? "Nothing on it yet"
                : fromToday(firing.day)}
        </Chip>
      </header>

      <p className="figure mt-1 text-[0.8125rem] text-ink-subtle">{longDate(firing.day)}</p>

      <div className="kiln-body mt-4 grid gap-4">
        <Elevation kiln={kiln} load={firing.load} />

        <div className="min-w-0">
          <Gauge kiln={kiln} load={firing.load.load} status={firing.status} />

          <dl className="figure mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.8125rem]">
            <div>
              <dt className="text-ink-subtle">In it</dt>
              <dd className="text-ink">
                {firing.pieces.length === 0 ? "nothing" : `${firing.pieces.length} pieces`}
              </dd>
            </div>
            <div>
              <dt className="text-ink-subtle">Turned away</dt>
              <dd className="text-ink">{firing.bumped.length}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">Firing costs</dt>
              <dd className="text-ink">{money(costOf(kiln.id))}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">Each piece pays</dt>
              <dd className={each === null ? "text-cold" : "text-ink"}>
                {each === null ? "—" : money(each)}
              </dd>
            </div>
          </dl>

          {short ? (
            <p className="mt-3 border-l-2 border-l-cold pl-3 text-[0.875rem] leading-relaxed text-ink-muted">
              {percent(firing.load.load)} spoken for, and {kiln.name} lights at{" "}
              {percent(kiln.minLoad)}. Running it as it stands would cost{" "}
              {money(costOf(kiln.id))} either way, so it waits.
            </p>
          ) : null}

          {!compact && firing.pieces.length > 0 ? (
            <ul className="mt-3 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[0.8125rem] text-ink-muted">
              {firing.pieces.map((id) => {
                const piece = pieceOf(id);
                return piece ? (
                  <li key={id}>
                    <Link href={`/pieces/${id}`} className="focus-ring hover:text-ink">
                      {piece.name}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
