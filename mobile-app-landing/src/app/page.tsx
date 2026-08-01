import Link from "next/link";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { FeatureCard } from "@/components/feature-card";
import { PhoneMockup } from "@/components/phone-mockup";
import { RatingStars } from "@/components/rating-stars";
import { ReviewCard } from "@/components/review-card";
import { Section, SectionHeading } from "@/components/section-heading";
import { SoundCard } from "@/components/sound-card";
import { StepList } from "@/components/step-list";
import { StoreBadge } from "@/components/store-badge";
import { features, steps } from "@/content/features";
import { ratingBreakdown, reviews } from "@/content/reviews";
import { pressLogos, site, stats } from "@/content/site";
import { sounds } from "@/content/sounds";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-aurora">
        <Container width="wide" className="py-16 sm:py-24">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Version 4.2 — weekend schedules
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Put the day down.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
                {site.description}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <StoreBadge platform="ios" />
                <StoreBadge platform="android" />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-subtle">
                <RatingStars rating={5} />
                <span>
                  <span className="font-semibold text-ink">
                    {site.app.rating}
                  </span>{" "}
                  from {site.app.ratingCount} reviews
                </span>
                {/* Hidden once the row wraps, so the dot never dangles. */}
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
                <span>{site.app.price}</span>
              </div>
            </div>

            <PhoneMockup className="lg:ml-auto" />
          </div>
        </Container>
      </section>

      {/* Press */}
      <div className="border-b border-line bg-surface">
        <Container width="wide" className="py-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            <span className="text-xs font-bold tracking-[0.14em] text-ink-subtle uppercase">
              Written about in
            </span>
            {pressLogos.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-ink-subtle/80"
              >
                {name}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* How it works */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="Three things, once."
          subtitle="Set it up on a Sunday evening and then mostly forget it exists. There is nothing to log and nothing to wear."
        />
        <div className="mt-16">
          <StepList steps={steps} />
        </div>
      </Section>

      {/* Features */}
      <Section className="border-y border-line bg-surface">
        <SectionHeading
          eyebrow="What's in it"
          title="Everything, without the lecture."
          subtitle="Lull will not give you a score out of a hundred, and it will not tell you off for staying up. It does four things and tries to do them properly."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Section>

      {/* Sound */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="The library"
            title="Four hundred hours, none of it looping."
            subtitle="Every track is recorded long and mixed to drift, so you never hear the seam where it starts again."
          />
          <Link
            href="/features#sound"
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            All the sounds →
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sounds.map((sound) => (
            <SoundCard key={sound.id} sound={sound} />
          ))}
        </div>
      </Section>

      {/* Stats */}
      <div className="border-y border-line bg-surface">
        <Container className="py-14">
          <dl className="grid gap-10 text-center sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-4xl font-bold tracking-tight text-accent">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-sm text-ink-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      {/* Reviews */}
      <Section>
        <SectionHeading
          eyebrow="Reviews"
          title="What people say once they've slept on it."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[18rem_1fr] lg:items-start">
          <div className="edge-light rounded-2xl border border-line bg-surface p-6">
            <p className="text-5xl font-bold tracking-tight text-ink">
              {site.app.rating}
            </p>
            <RatingStars rating={5} size={16} className="mt-2" />
            <p className="mt-2 text-sm text-ink-subtle">
              {site.app.ratingCount} ratings
            </p>

            <div className="mt-6 space-y-2">
              {ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="w-3 text-xs text-ink-subtle">
                    {row.stars}
                  </span>
                  {/* A definite track height, so the fill has something to sit in. */}
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <span
                      className="block h-full rounded-full bg-accent"
                      style={{ width: `${row.percent}%` }}
                    />
                  </span>
                  <span className="w-8 text-right text-xs text-ink-subtle">
                    {row.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
