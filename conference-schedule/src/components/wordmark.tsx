/**
 * The mark: two blocks sharing a column of time.
 *
 * It is the schedule's central problem drawn at 24px — two things you
 * want, and the part where they cross. Inline SVG rather than an image
 * so it stays sharp, weighs nothing and can be edited in Pare, per
 * CONVENTIONS §5. The favicon at `src/app/icon.svg` is the same shape;
 * change one and change the other.
 */
export function OverlapMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect x="1" y="3" width="13" height="13" fill="currentColor" />
      <rect
        x="10"
        y="8"
        width="13"
        height="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <OverlapMark className="h-5 w-5 shrink-0" />
      <span className="sign text-[1.05rem] leading-none">Overlap</span>
    </span>
  );
}

/**
 * A speaker, drawn rather than photographed. See CREDITS.md — attaching
 * a stock portrait to an invented person is ruled out by §6, and thirty
 * of them would be thirty real faces standing behind quotes nobody said.
 */
export function Monogram({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`narrow inline-flex shrink-0 items-center justify-center bg-ink text-ink-inverse ${className}`}
    >
      {initials}
    </span>
  );
}
