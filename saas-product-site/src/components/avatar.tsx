import { clsx } from "@/lib/clsx";

const tints = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

/**
 * Initials avatar. Used instead of stock headshots for testimonials so
 * the page stays light and nobody's face is standing in for a quote
 * they never gave.
 */
export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const tint = tints[name.length % tints.length];
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "sm" ? "h-8 w-8 text-xs" : "h-11 w-11 text-sm",
        tint,
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
