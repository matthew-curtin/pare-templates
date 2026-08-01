import Link from "next/link";
import { FeatureIcon } from "./feature-icon";
import type { Feature } from "@/content/types";

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link
      href={`/features#${feature.id}`}
      className="group rounded-xl border border-line bg-canvas p-6 transition-all hover:border-accent-ring hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <FeatureIcon name={feature.icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {feature.summary}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
        Learn more
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
