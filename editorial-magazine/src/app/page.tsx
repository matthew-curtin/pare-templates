import Link from "next/link";
import { Container } from "@/components/container";
import { CoverMockup } from "@/components/cover-mockup";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { StoryCard } from "@/components/story-card";
import { sections } from "@/content/sections";
import { newsletter, site } from "@/content/site";
import { featuredStory, stories, storiesInSection } from "@/content/stories";
import { currentIssue } from "@/content/subscribe";

export default function HomePage() {
  const lead = featuredStory();
  const recent = stories.filter((story) => story.slug !== lead.slug).slice(0, 3);

  return (
    <>
      {/* Masthead. The magazine's name at full size once, at the top of
          the home page only — every other page carries it small in the
          header. */}
      <section className="border-b border-line">
        <Container width="wide" className="py-14 text-center sm:py-20">
          <Logo size="large" />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
            {site.standfirst}
          </p>
        </Container>
      </section>

      {/* The lead story */}
      <section className="border-b border-line">
        <Container width="wide" className="py-14 sm:py-20">
          <StoryCard story={lead} variant="lead" />
        </Container>
      </section>

      {/* Latest */}
      <section>
        <Container width="wide" className="py-14 sm:py-20">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="eyebrow text-ink-subtle">Also in this issue</h2>
            <Link
              href="/archive"
              className="eyebrow text-accent transition-colors hover:text-accent-hover"
            >
              The archive →
            </Link>
          </div>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </Container>
      </section>

      {/* The print edition — the cover is drawn in CSS, not a photo. */}
      <section className="border-y border-line bg-sunk">
        <Container width="wide" className="py-16 sm:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[22rem_1fr]">
            <CoverMockup issue={currentIssue} />
            <div>
              <p className="eyebrow text-accent">
                Issue {currentIssue.number} · {currentIssue.season}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-[1.1] font-semibold text-balance sm:text-4xl">
                It is also a printed object, four times a year.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
                Every story is on this site the day it is published. The print
                edition exists because some of them are better at that size —
                and because a magazine you can put down and come back to is a
                different thing from a tab you have left open.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/subscribe"
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
                >
                  Subscribe from £32
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                >
                  About the magazine
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* The three sections, each with its most recent story */}
      <section>
        <Container width="wide" className="py-16 sm:py-24">
          <h2 className="eyebrow text-ink-subtle">The departments</h2>
          <div className="mt-10 grid gap-12 lg:grid-cols-3">
            {sections.map((section) => {
              const latest = storiesInSection(section.slug)[0];
              return (
                <div key={section.slug}>
                  <h3 className="font-display text-2xl font-semibold">
                    <Link
                      href={`/section/${section.slug}`}
                      className="link-rule"
                    >
                      {section.name}
                    </Link>
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-muted text-pretty">
                    {section.summary}
                  </p>
                  <div className="rule-dotted my-6" />
                  {latest && (
                    <>
                      <p className="eyebrow text-ink-subtle">Most recent</p>
                      <p className="mt-2 font-display text-lg leading-snug font-semibold text-balance">
                        <Link
                          href={`/story/${latest.slug}`}
                          className="link-rule"
                        >
                          {latest.title}
                        </Link>
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="border-t border-line bg-sunk">
        <Container width="wide" className="py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold text-balance">
                {newsletter.title}
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-ink-muted text-pretty">
                {newsletter.description}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
