import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { FeatureIcon } from "@/components/feature-icon";
import { PhoneMockup } from "@/components/phone-mockup";
import { PageHeader, Section, SectionHeading } from "@/components/section-heading";
import { SoundCard } from "@/components/sound-card";
import { features } from "@/content/features";
import { soundCategories, sounds } from "@/content/sounds";
import { clsx } from "@/lib/clsx";

export const metadata: Metadata = {
  title: "Features",
  description:
    "The wind-down, the sound library, the wake window and the weekly note — what each one actually does.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features"
        title="What Lull actually does"
        subtitle="Four things, done properly, rather than forty on a list. Here is each of them in full."
      />

      {/* Jump links */}
      <div className="sticky top-16 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <Container width="wide">
          <nav className="flex gap-1 overflow-x-auto py-3">
            {features.map((feature) => (
              <a
                key={feature.id}
                href={`#${feature.id}`}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap text-ink-muted transition-colors hover:bg-surface hover:text-ink"
              >
                {feature.title}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {features.map((feature, index) => (
        <Section
          key={feature.id}
          id={feature.id}
          className={clsx(
            "scroll-mt-32",
            index % 2 === 1 && "border-y border-line bg-surface",
          )}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className={clsx(index % 2 === 1 && "lg:order-2")}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cool-soft text-cool">
                <FeatureIcon name={feature.icon} />
              </span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-balance">
                {feature.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
                {feature.description}
              </p>

              <ul className="mt-8 space-y-3">
                {feature.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 leading-relaxed text-ink-muted"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-accent"
                    >
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className={clsx(index % 2 === 1 && "lg:order-1")}>
              {index === 0 ? (
                <PhoneMockup />
              ) : (
                <FeatureIllustration feature={feature.title} />
              )}
            </div>
          </div>
        </Section>
      ))}

      {/* The sound library in full */}
      <Section id="sound-library" className="border-t border-line scroll-mt-32">
        <SectionHeading
          eyebrow="The library"
          title="Everything you can fall asleep to"
          subtitle="Thirty tracks on the free plan, all four hundred hours on Plus. New sleep stories every week."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {soundCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-ink-muted"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sounds.map((sound) => (
            <SoundCard key={sound.id} sound={sound} />
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

/**
 * A placeholder panel for the features that don't have their own
 * screen yet — drawn rather than photographed, so it stays sharp and
 * stays editable.
 */
function FeatureIllustration({ feature }: { feature: string }) {
  return (
    <div className="edge-light relative overflow-hidden rounded-2xl border border-line-strong bg-surface p-10">
      <div className="absolute inset-0 bg-aurora opacity-60" />
      <div className="relative flex h-56 flex-col justify-end">
        {/* A soft ridge of bars, purely decorative. Pixel heights on purpose. */}
        <div className="flex items-end gap-1.5" aria-hidden="true">
          {[18, 34, 26, 52, 44, 68, 58, 82, 70, 96, 78, 62, 48, 36, 24].map(
            (height, index) => (
              <span
                key={index}
                className="flex-1 rounded-full bg-cool/35"
                style={{ height: `${height}px` }}
              />
            ),
          )}
        </div>
        <p className="mt-6 text-sm text-ink-subtle">{feature}</p>
      </div>
    </div>
  );
}
