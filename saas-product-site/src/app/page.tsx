import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/button";
import { AppMockup } from "@/components/app-mockup";
import { LogoCloud } from "@/components/logo-cloud";
import { FeatureCard } from "@/components/feature-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section-heading";
import { features } from "@/content/features";
import { testimonials } from "@/content/testimonials";
import { posts } from "@/content/posts";
import { site, stats } from "@/content/site";
import { formatDate } from "@/lib/format";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <Container>
          <div className="pt-20 pb-16 text-center sm:pt-28">
            <Link
              href="/changelog"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1 text-sm text-ink-muted transition-colors hover:border-accent-ring"
            >
              <span className="font-medium text-accent">New</span>
              Reviewer load balancing
              <span aria-hidden="true">→</span>
            </Link>

            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Know where your team&rsquo;s work actually gets stuck
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted sm:text-xl">
              {site.description}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/pricing" size="lg">
                Start free
              </Button>
              <Button href="/features" size="lg" variant="secondary">
                See how it works
              </Button>
            </div>
            <p className="mt-4 text-sm text-ink-subtle">
              Free for up to 10 people. No card required.
            </p>
          </div>

          <div className="pb-8">
            <AppMockup />
          </div>
        </Container>
      </section>

      {/* Social proof */}
      <Container>
        <div className="border-t border-line py-14">
          <LogoCloud heading="Trusted by engineering teams at" />
        </div>
      </Container>

      {/* Stats */}
      <Container>
        <dl className="grid gap-8 border-t border-line py-14 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-4xl font-semibold tracking-tight text-accent">
                  {stat.value}
                </span>
                <span className="mt-1 block text-sm text-ink-muted">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* Features */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="What you get"
          title="Delivery insight without the surveillance"
          subtitle="Every metric is about the process rather than the people inside it. That constraint has shaped more of this product than any other decision."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionHeading
          eyebrow="Customers"
          title="What teams say after a quarter"
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {testimonials.slice(0, 4).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Section>

      {/* Recent writing */}
      <Section className="bg-surface">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="From the blog"
            title="Writing about how software actually ships"
            className="max-w-xl"
          />
          <Link
            href="/blog"
            className="text-sm font-medium text-accent hover:underline"
          >
            All posts →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-line bg-canvas p-6 transition-all hover:border-accent-ring hover:shadow-lg hover:shadow-ink/5"
            >
              <p className="text-xs font-medium text-accent uppercase">
                {post.category}
              </p>
              <h3 className="mt-3 font-semibold text-balance group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                {post.excerpt}
              </p>
              <p className="mt-4 text-xs text-ink-subtle">
                {formatDate(post.date)} · {post.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
