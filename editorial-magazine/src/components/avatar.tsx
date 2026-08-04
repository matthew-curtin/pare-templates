/**
 * Initials in a circle, instead of a photograph.
 *
 * Deliberate: every person on this site is invented, and putting a
 * real stock face on an invented byline is the one thing in a template
 * that reads as dishonest rather than as placeholder.
 */
export function Avatar({
  initials,
  size = 36,
}: {
  initials: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-line-strong bg-accent-soft font-display font-semibold text-accent"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}
