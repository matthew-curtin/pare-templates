import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { PartState } from "@/lib/shop";

/** A small figure with its label under it. The only place on the site
 *  where a number is allowed to be large. */
export function Figure({
  value,
  label,
  tone = "ink",
}: {
  value: ReactNode;
  label: ReactNode;
  tone?: "ink" | "short" | "inbound";
}) {
  const colour =
    tone === "short" ? "text-short" : tone === "inbound" ? "text-inbound" : "text-ink";
  return (
    <div className="min-w-0">
      <div className={`answer ${colour}`}>{value}</div>
      <div className="mt-1 text-[0.8125rem] leading-snug text-ink-subtle">{label}</div>
    </div>
  );
}

/**
 * The state marker.
 *
 * A dot in the state's hue plus the word, never the hue alone — the
 * §4b split: when colour is the only cue it must be unmistakable, and
 * when it sits beside its own name the words are doing the work. Made
 * and bought are told apart by a GLYPH rather than a third colour, for
 * the same reason.
 */
export function StateDot({ state }: { state: PartState }) {
  if (state === "ok") return null;
  const colour = state === "short" ? "bg-short" : "bg-inbound";
  return (
    <span
      className={`inline-block size-[7px] shrink-0 rounded-full ${colour}`}
      aria-hidden="true"
    />
  );
}

export function StateLabel({ state }: { state: PartState }) {
  if (state === "ok") return null;
  const tone = state === "short" ? "text-short" : "text-inbound";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.75rem] ${tone}`}>
      <StateDot state={state} />
      {state === "short" ? "short" : "on order"}
    </span>
  );
}

/** Made or bought, as a glyph. `◇` is something we assemble, `·` is
 *  something that arrives in a box. No colour: it is the most common
 *  distinction in the tree and colouring it would tint every row. */
export function KindMark({ kind }: { kind: "made" | "bought" }) {
  return (
    <span
      className="inline-block w-3 shrink-0 text-center text-[0.6875rem] text-ink-subtle"
      title={kind === "made" ? "made here" : "bought in"}
    >
      {kind === "made" ? "◇" : "·"}
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="fig inline-flex items-center rounded-sm border border-line bg-sheet px-1.5 py-0.5 text-[0.75rem] text-ink-muted">
      {children}
    </span>
  );
}

/** An inline statement about the page's state. Three severities and no
 *  more; the left rule carries the severity so the text is never
 *  coloured for it. */
export function Notice({
  tone = "flat",
  children,
}: {
  tone?: "flat" | "inbound" | "short";
  children: ReactNode;
}) {
  const rule =
    tone === "short"
      ? "border-l-short bg-short-wash"
      : tone === "inbound"
        ? "border-l-inbound bg-inbound-wash"
        : "border-l-line-strong bg-sheet";
  return (
    <div className={`border border-line border-l-2 ${rule} px-3 py-2 text-[0.875rem] leading-relaxed`}>
      {children}
    </div>
  );
}

export function PartLink({ id, name }: { id: string; name: string }) {
  return (
    <Link to={`/parts/${id}`} className="focus-ring hover:underline underline-offset-2">
      {name}
    </Link>
  );
}

/** Section heading with a hairline under it, used on every route so the
 *  pages read as one document rather than six. */
export function Head({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="hair mb-4 border-b pb-2">
      <h2 className="text-title">{children}</h2>
      {note ? (
        <p className="mt-1 max-w-[70ch] text-[0.875rem] leading-relaxed text-ink-muted">{note}</p>
      ) : null}
    </div>
  );
}
