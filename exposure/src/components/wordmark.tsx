/**
 * A gnomon: the blade of a sundial and the shadow it throws.
 *
 * Drawn rather than shipped as an image, per §5 — every part of it is an
 * element Pare can select and edit, which a logo PNG is not.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="h-[0.95em] w-[0.95em] shrink-0 self-center"
      >
        <path d="M2 13 L13 13 L13 12 L3.6 12 Z" fill="var(--color-ink-subtle)" />
        <path d="M3 12.6 L8.5 2 L9.6 12.6 Z" fill="var(--color-ink)" />
        <circle cx="12.4" cy="3.6" r="1.9" fill="var(--color-sun)" />
      </svg>
      <span className="head head-small text-[1.0625rem]">Exposure</span>
    </span>
  );
}
