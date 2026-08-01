import type { Metadata } from "next";
import { Container } from "@/components/container";
import { FeatureIcon } from "@/components/feature-icon";
import { AppMockup } from "@/components/app-mockup";
import { CtaBand } from "@/components/cta-band";
import { LogoCloud } from "@/components/logo-cloud";
import { Section, SectionHeading } from "@/components/section-heading";
import { features } from "@/content/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Flow analytics, review insights, team health and enterprise controls — everything Cadence measures and why.",
};

export default function FeaturesPage() {
  return (
    <>
      <Container>
        <div className="max-w-3xl py-20 sm:py-24">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Features
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Everything we measure, and why it&rsquo;s worth measuring
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-ink-muted">
            Cadence reads from the tools your team already uses and turns the
            activity into a picture of how work flows. Here is what that looks
            like in practice.
          </p>
        </div>
      </Container>

      {/* Alternating detail sections */}
      <div className="divide-y divide-line border-t border-line">
        {features.map((feature, i) => (
          <section
            key={feature.id}
            id={feature.id}
            className="scroll-mt-20 py-16 sm:py-20"
          >
            <Container>
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <FeatureIcon name={feature.icon} className="h-5.5 w-5.5" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-lg text-ink">{feature.summary}</p>
                  <p className="mt-4 leading-relaxed text-ink-muted">
                    {feature.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {feature.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-accent"
                        >
                          <path
                            d="m3.5 8.5 3 3 6-7"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-ink-muted">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                  <AppMockup />
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>

      <Section className="bg-surface">
        <SectionHeading
          title="Connects to what you already run"
          subtitle="Point Cadence at your repositories and issue tracker. There is nothing to install in your build and no agent to run."
        />
        <div className="mt-12">
          <LogoCloud />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
