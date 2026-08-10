/**
 * The mark is the route: a ridge line with one point above the rest and
 * a horizon under it. Drawn as inline SVG rather than shipped as an
 * image, per §5, and repeated byte-for-byte in `src/app/icon.svg` for
 * the favicon — change one and change the other.
 */
export function Mark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M1 19 L5.5 12.5 L8 15 L12.5 5 L16 11.5 L18.5 9 L23 19 Z"
        fill="currentColor"
      />
      <rect x="1" y="20.5" width="22" height="1.5" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
