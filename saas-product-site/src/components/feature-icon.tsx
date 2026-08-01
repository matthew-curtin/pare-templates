import type { Feature } from "@/content/types";

const paths: Record<Feature["icon"], React.ReactNode> = {
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6M12 20V6M17 20v-9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6.2a3.5 3.5 0 0 1 0 6.6M17 19a5.5 5.5 0 0 0-1.6-3.9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6.2v5c0 4.2 2.9 7.6 7 9.3 4.1-1.7 7-5.1 7-9.3v-5L12 3.5Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0V8ZM12 17v4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2 10.2 12.6 4.5 10.8 10.2 9 12 3.5Z" />
      <path d="M18.5 4v3M20 5.5h-3" />
    </>
  ),
};

export function FeatureIcon({
  name,
  className,
}: {
  name: Feature["icon"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
