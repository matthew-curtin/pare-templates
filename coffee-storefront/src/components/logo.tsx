import { site } from "@/content/site";

/**
 * The wordmark, with the ridge drawn as inline SVG.
 *
 * Drawn rather than shipped as an image so it stays sharp, inherits
 * the ink colour wherever it is placed (including the dark footer),
 * and can be edited — the ridge is four line segments.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 20"
        aria-hidden="true"
        className="h-4 w-[26px] shrink-0 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 17 L9 6 L15 13 L23 2 L31 17" />
      </svg>
      <span className="font-display text-lg leading-none font-bold tracking-[-0.02em]">
        {site.name}
      </span>
    </span>
  );
}
