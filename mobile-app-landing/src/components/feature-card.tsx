import Link from "next/link";
import { FeatureIcon } from "./feature-icon";
import type { Feature } from "@/content/types";

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link
      href={`/features#${feature.id}`}
      className="edge-light group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-line-strong hover:bg-raised"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cool-soft text-cool">
        <FeatureIcon name={feature.icon} />
      </span>
      <h3 className="mt-5 font-bold text-ink">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {feature.summary}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        More
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          <path
            d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
