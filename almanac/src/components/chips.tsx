/**
 * The small parts.
 *
 * A `Chip` is a fact — permanent, hybrid, 22.2 hours a week. Facts are
 * never coloured: there are five contract types and three working
 * patterns, and giving each one a hue produces eight colours that mean
 * nothing and drown the two that do.
 *
 * A `Flag` is the exception, and there are only two of them.
 */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-line bg-hover px-2 py-1 text-xs text-ink-muted">
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
      ? "bg-accent text-on-accent"
      : tone === "new"
        ? "bg-accent-soft text-accent"
        : "bg-sunk text-ink-subtle";
  return <span className={`label rounded-sm px-2 py-1 ${styles}`}>{children}</span>;
}

/**
 * The closing date, which is the only thing on a listing that changes
 * colour.
 *
 * The words carry the meaning on their own — "Closes today" says it
 * without any help — and the red is a second cue on top, which is the
 * right way round. Read the other way, a red date that just says
 * "2 Oct" is a colour nobody can act on.
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
    <Tag className="font-serif text-xl font-semibold tracking-tight text-ink">
      {children}
    </Tag>
  );
}

/** A rule with a small-caps word sitting on it. The gazette's divider. */
export function RuleLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="label text-ink-subtle">{children}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
