import Link from "next/link";
import { clsx } from "@/lib/clsx";

/**
 * A download badge.
 *
 * Deliberately *not* Apple's or Google's official badge artwork —
 * those are trademarks, and this template invents everything. If you
 * ship a real app, replace these with the badges each store gives you
 * and follow their guidelines.
 */
export function StoreBadge({
  platform,
  href = "/download",
  className,
}: {
  platform: "ios" | "android";
  href?: string;
  className?: string;
}) {
  const label = platform === "ios" ? "iPhone and iPad" : "Android";

  return (
    <Link
      href={href}
      className={clsx(
        "edge-light inline-flex items-center gap-3 rounded-xl border border-line-strong bg-raised px-4 py-2.5 transition-colors hover:border-ink-subtle hover:bg-surface",
        className,
      )}
    >
      <span className="text-ink" aria-hidden="true">
        {platform === "ios" ? <AppleGlyph /> : <AndroidGlyph />}
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] tracking-wide text-ink-subtle uppercase">
          Download for
        </span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
      </span>
    </Link>
  );
}

/** A generic phone outline — not any manufacturer's logo. */
function AppleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="5.5"
        y="2"
        width="9"
        height="16"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M8.75 4.6h2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A generic tablet-and-phone pair, standing in for the Android family. */
function AndroidGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2.5"
        y="3"
        width="9"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M13.5 6.5h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
