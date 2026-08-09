/**
 * The small parts.
 *
 * A `Chip` is a fact — regular, hybrid, 24 hours a week. Facts are never
 * coloured: there are five contract types and three working patterns,
 * and giving each one a hue produces eight colours that mean nothing and
 * drown the two that do.
 *
 * A `Flag` is the exception, and there are only two of them.
 */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sunk px-2.5 py-1 text-xs font-medium text-ink-muted">
      {children}
    </span>
  );
}

export function Flag({
  tone,
  children,
}: {
  tone: "featured" | "new" | "closed";
  children: React.ReactNode;
}) {
  const styles =
    tone === "featured"
      ? "bg-primary text-on-primary"
      : tone === "new"
        ? "bg-accent-soft text-accent"
        : "bg-sunk text-ink-subtle";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {children}
    </span>
  );
}

/**
 * The closing date, which is the only thing on a listing that changes
 * colour.
 *
 * The words carry the meaning on their own — "Closes today" says it
 * without any help — and the red is a second cue on top, which is the
 * right way round. Read the other way, a red date that just says
 * "Oct 2" is a colour nobody can act on.
 */
export function ClosingStamp({
  text,
  tone,
  className = "",
}: {
  text: string;
  tone: "urgent" | "quiet" | "closed";
  className?: string;
}) {
  const styles =
    tone === "urgent"
      ? "text-urgent font-semibold"
      : tone === "closed"
        ? "text-ink-subtle"
        : "text-ink-muted";
  return (
    <span className={`tabular text-sm ${styles} ${className}`}>{text}</span>
  );
}

export function SectionHeading({
  children,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className="text-xl font-bold tracking-tight text-ink">{children}</Tag>
  );
}

/**
 * A section label.
 *
 * This used to be a hairline rule with a word in letterspaced capitals
 * sitting on it, repeated down every page. One of those is a nice
 * device; nine of them is a form. It is now just a heading, and the
 * space around it does the separating.
 */
export function RuleLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold tracking-tight text-ink">
      {children}
    </h2>
  );
}

/** The bullet used in every list of duties and requirements. */
export function Bullet() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.5625rem] h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong"
    />
  );
}
