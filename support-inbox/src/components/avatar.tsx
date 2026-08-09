/**
 * Initials rather than a photograph.
 *
 * CONVENTIONS §6: a real face attached to an invented person sits
 * badly, and a support tool is full of invented people. Initials are
 * also what a real inbox shows for most customers, who have never
 * uploaded anything.
 */

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-[11px]",
  lg: "size-11 text-sm",
};

export function Avatar({
  initials,
  name,
  size = "md",
  tone = "member",
}: {
  initials: string;
  name: string;
  size?: Size;
  /**
   * Customers and colleagues are told apart by weight rather than by a
   * second colour — a thread is already carrying four status hues and a
   * fifth would be one too many.
   */
  tone?: "member" | "customer";
}) {
  const toneClasses =
    tone === "member"
      ? "bg-accent-soft text-accent"
      : "bg-sunk text-ink-muted border border-line";
  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide ${SIZES[size]} ${toneClasses}`}
    >
      {initials}
    </span>
  );
}

/** The slot where an avatar goes when nobody has picked it up. */
export function UnassignedAvatar({ size = "md" }: { size?: Size }) {
  return (
    <span
      title="Unassigned"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-ink-subtle ${SIZES[size]}`}
    >
      ?
    </span>
  );
}
