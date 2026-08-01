import type { Feature } from "@/content/types";

/**
 * The six feature icons, drawn inline so they inherit colour and stay
 * sharp. Add a key here and to the `icon` union in content/types.ts.
 */
export function FeatureIcon({
  name,
  className,
}: {
  name: Feature["icon"];
  className?: string;
}) {
  return (
    <svg
      width="22"
      height="22"
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

const paths: Record<Feature["icon"], React.ReactNode> = {
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  wave: (
    <>
      <path d="M2 9c1.8-3.2 3.2-3.2 5 0s3.2 3.2 5 0 3.2-3.2 5 0 3.2 3.2 5 0" />
      <path d="M2 16c1.8-3.2 3.2-3.2 5 0s3.2 3.2 5 0 3.2-3.2 5 0 3.2 3.2 5 0" />
    </>
  ),
  alarm: (
    <>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9.5V13l2.5 1.5" />
      <path d="M4.5 4 7 2M19.5 4 17 2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-4M12.5 16V8M17 16v-6" />
    </>
  ),
  offline: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 5.5h3" />
      <path d="M12 10.5v5M9.75 13.25 12 15.5l2.25-2.25" />
    </>
  ),
  watch: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="3" />
      <path d="M9 6.5 9.5 2.5h5l.5 4M9 17.5l.5 4h5l.5-4" />
      <path d="M12 10v2.2l1.6 1" />
    </>
  ),
};
