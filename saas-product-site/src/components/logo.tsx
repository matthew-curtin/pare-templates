import Link from "next/link";
import { site } from "@/content/site";

/** The wordmark. The mark itself is inline SVG so it inherits colour. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}
      aria-label={`${site.name} home`}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="text-accent"
      >
        <rect width="26" height="26" rx="7" fill="currentColor" />
        <path
          d="M7 16.5L10 11l3 4 3-6.5 3 8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg">{site.name}</span>
    </Link>
  );
}
