import type { ReactNode } from "react";

/**
 * The small parts, in one place so a chip looks like a chip everywhere.
 *
 * Only two things on this site are ever coloured — `fire` for a kiln
 * that is lit or about to be, `cold` for one that is not — and these
 * components are where that discipline is enforced rather than
 * remembered.
 */

export type Heat = "fire" | "cold" | "quiet";

const CHIP: Record<Heat, string> = {
  fire: "border-fire/40 bg-wash-fire text-fire",
  cold: "border-cold/40 bg-wash-cold text-cold",
  quiet: "border-line bg-paper text-ink-muted",
};

export function Chip({ heat = "quiet", children }: { heat?: Heat; children: ReactNode }) {
  return (
    <span
      className={`figure inline-flex items-center gap-1.5 border px-2 py-0.5 text-[0.75rem] leading-5 ${CHIP[heat]}`}
    >
      {children}
    </span>
  );
}

/** A number with its name under it. The site is mostly these. */
export function Stat({
  label,
  children,
  note,
  heat = "quiet",
}: {
  label: string;
  children: ReactNode;
  note?: string;
  heat?: Heat;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[0.6875rem] uppercase text-ink-subtle">{label}</div>
      <div
        className={`figure mt-0.5 text-[1.375rem] leading-tight ${
          heat === "fire" ? "text-fire" : heat === "cold" ? "text-cold" : "text-ink"
        }`}
      >
        {children}
      </div>
      {note ? <div className="mt-0.5 text-[0.8125rem] leading-snug text-ink-muted">{note}</div> : null}
    </div>
  );
}

export function Note({ heat = "quiet", children }: { heat?: Heat; children: ReactNode }) {
  const rule =
    heat === "fire" ? "border-l-fire" : heat === "cold" ? "border-l-cold" : "border-l-line-strong";
  return (
    <p className={`border-l-2 pl-3 text-[0.875rem] leading-relaxed text-ink-muted ${rule}`}>
      {children}
    </p>
  );
}

/** A member, as initials. No stock faces behind invented names (§6). */
export function Initials({ children }: { children: ReactNode }) {
  return (
    <span className="figure inline-flex h-6 w-6 shrink-0 items-center justify-center border border-line-strong bg-paper text-[0.625rem] text-ink-muted">
      {children}
    </span>
  );
}

export function Rule() {
  return <hr className="border-0 border-t border-line" />;
}
