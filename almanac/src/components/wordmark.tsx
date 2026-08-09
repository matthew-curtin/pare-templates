/**
 * The mark: a page of dates with one of them picked out.
 *
 * Drawn rather than shipped as an image, so every part of it can be
 * selected and edited, and so it stays sharp at any size. Same drawing
 * as `src/app/icon.svg`, which is the favicon — if you change one,
 * change the other.
 */
export function AlmanacMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <rect
        x="7"
        y="7.5"
        width="18"
        height="2.5"
        rx="1.25"
        className="fill-on-primary/40"
      />
      <g className="fill-on-primary/40">
        <rect x="7" y="14" width="5" height="5" rx="1.5" />
        <rect x="13.5" y="14" width="5" height="5" rx="1.5" />
        <rect x="7" y="21" width="5" height="5" rx="1.5" />
        <rect x="13.5" y="21" width="5" height="5" rx="1.5" />
        <rect x="20" y="21" width="5" height="5" rx="1.5" />
      </g>
      <rect x="20" y="14" width="5" height="5" rx="1.5" className="fill-on-primary" />
    </svg>
  );
}

/**
 * An employer's initials, in place of a logo.
 *
 * Every organisation here is invented, so it has no logo to show, and a
 * plausible-looking one would be a small lie on the page. Initials are
 * also what a real board falls back to more often than it admits.
 *
 * Softened from a hard black square to a rounded tile on a tinted
 * ground: at this size, on a card with a soft shadow, a solid dark block
 * is the heaviest thing in the row and the eye goes to it instead of to
 * the job title.
 */
export function Monogram({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .replace(/^The /, "")
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word) && word.length > 1)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  const box =
    size === "lg"
      ? "h-16 w-16 rounded-2xl text-xl"
      : size === "sm"
        ? "h-9 w-9 rounded-lg text-xs"
        : "h-12 w-12 rounded-xl text-sm";

  return (
    <span
      aria-hidden="true"
      className={`${box} grid shrink-0 place-items-center bg-sunk font-bold tracking-tight text-ink-muted`}
    >
      {initials}
    </span>
  );
}
