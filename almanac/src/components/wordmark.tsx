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
      <rect width="32" height="32" rx="6" className="fill-ink-inverse/15" />
      <rect
        x="6"
        y="6.5"
        width="20"
        height="3"
        rx="1.5"
        className="fill-ink-inverse/45"
      />
      <g className="fill-ink-inverse/45">
        <rect x="6" y="13.5" width="5.5" height="5.5" rx="1" />
        <rect x="13.25" y="13.5" width="5.5" height="5.5" rx="1" />
        <rect x="6" y="21" width="5.5" height="5.5" rx="1" />
        <rect x="13.25" y="21" width="5.5" height="5.5" rx="1" />
        <rect x="20.5" y="21" width="5.5" height="5.5" rx="1" />
      </g>
      <rect
        x="20.5"
        y="13.5"
        width="5.5"
        height="5.5"
        rx="1"
        className="fill-ink-inverse"
      />
    </svg>
  );
}

/**
 * An employer's initials, in place of a logo.
 *
 * Every organisation here is invented, so it has no logo to show, and a
 * plausible-looking one would be a small lie on the page. Initials are
 * also what a real board falls back to more often than it admits.
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
      ? "h-14 w-14 text-lg"
      : size === "sm"
        ? "h-8 w-8 text-[0.6875rem]"
        : "h-11 w-11 text-sm";

  return (
    <span
      aria-hidden="true"
      className={`${box} grid shrink-0 place-items-center rounded-sm bg-band font-semibold tracking-wide text-ink-inverse`}
    >
      {initials}
    </span>
  );
}
