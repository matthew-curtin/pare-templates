import Link from "next/link";
import { site } from "@/content/site";

/**
 * The wordmark. The mark is a crescent, drawn as one path: a deep arc
 * down the left, then a shallower one back up, which leaves the moon
 * between them.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className ?? ""}`}
      aria-label={`${site.name} home`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
      >
        <rect width="26" height="26" rx="9" className="fill-cool-soft" />
        <path
          d="M13 6.5 A 6.5 6.5 0 1 0 13 19.5 A 9 9 0 0 1 13 6.5 Z"
          className="fill-accent"
        />
      </svg>
      <span className="text-lg">{site.name}</span>
    </Link>
  );
}
