import type { ReactNode } from "react";

/**
 * The small shared surfaces.
 *
 * Kept together because there are four of them and each is under fifteen
 * lines; splitting them into four files would be filing rather than
 * organising.
 */

export function Pill({
  children,
  tone,
  title,
}: {
  children: ReactNode;
  tone?: "live" | "signal";
  title?: string;
}) {
  return (
    <span
      className="pill inline-flex items-center rounded-full px-2 py-[0.1875rem] leading-none"
      data-tone={tone}
      title={title}
    >
      {children}
    </span>
  );
}

/** A label above a number. The label is small and quiet, the number is
 *  not — a console is read at a distance. */
export function Readout({
  label,
  children,
  tone,
  wrap = false,
}: {
  label: string;
  children: ReactNode;
  tone?: "live" | "signal";
  /** The console truncates, because a readout that reflows while a
   *  record plays is a readout that moves. A page has room to wrap. */
  wrap?: boolean;
}) {
  const colour =
    tone === "live" ? "text-live" : tone === "signal" ? "text-signal" : "text-ink";
  return (
    <div className="min-w-0">
      <div className="pill border-0 px-0 text-ink-subtle">{label}</div>
      <div
        className={`tnum mt-1 text-[0.9375rem] ${wrap ? "leading-snug" : "truncate"} ${colour}`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A note that needs reading.
 *
 * One shape, two temperatures, and no red — the on-air colour is the
 * only warm thing on this console and it means "somebody will hear
 * this", which is exactly what a scheduling problem is.
 */
export function Note({
  children,
  tone = "quiet",
}: {
  children: ReactNode;
  tone?: "quiet" | "live";
}) {
  return (
    <p
      className={`rounded-console border-l-2 py-2 pl-3 pr-3 text-[0.8125rem] leading-relaxed ${
        tone === "live"
          ? "border-l-live bg-[var(--wash-live)] text-ink"
          : "border-l-line-strong bg-panel text-ink-muted"
      }`}
    >
      {children}
    </p>
  );
}

/** A page's opening. Full-bleed like everything else here: there is no
 *  centred measure anywhere in this app. */
export function PageHead({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line px-4 pb-5 pt-6 sm:px-6">
      <h1 className="text-[var(--text-display)] leading-[1.05]">{title}</h1>
      {children ? (
        <div className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {children}
        </div>
      ) : null}
    </header>
  );
}
