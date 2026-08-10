/**
 * The mark: a kiln in section, three shelves, the top one empty.
 *
 * Drawn rather than shipped as an image (§5), and it is the same object
 * every elevation on the site draws — including the part that is not
 * being used, which is the joke and also the point.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 28"
        width="20"
        height="23"
        role="img"
        aria-label="Marlpit"
        className="shrink-0"
      >
        <rect x="1" y="1" width="22" height="26" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="20" width="16" height="1.6" fill="currentColor" />
        <rect x="4" y="12" width="16" height="1.6" fill="currentColor" />
        <rect x="6" y="15" width="5" height="5" fill="currentColor" />
        <rect x="13" y="16" width="4" height="4" fill="currentColor" />
        <rect x="6" y="7" width="6" height="5" fill="currentColor" />
      </svg>
      <span className="font-[family-name:var(--font-display)] text-[1.0625rem] tracking-tight">
        Marlpit
      </span>
    </span>
  );
}
