import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { NewsletterForm } from "@/components/newsletter-form";
import { PageHeader } from "@/components/page-header";
import { aboutBlocks, aboutIntro } from "@/content/about";
import { newsletter, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About us",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Since ${site.founded}`}
        title="About the magazine"
        description={aboutIntro}
      />

      <Container width="prose" className="py-14 sm:py-20">
        <div className="space-y-12">
          {aboutBlocks.map((block) => (
            <section key={block.heading}>
              <h2 className="font-display text-2xl font-semibold text-balance">
                {block.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {block.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[1.0625rem] leading-[1.75] text-ink-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="rule-dotted my-14" />

        <div>
          <h2 className="font-display text-2xl font-semibold">
            {newsletter.title}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-muted text-pretty">
            {newsletter.description}
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 rounded-sm border border-line bg-surface p-6">
          <p className="font-display text-xl font-semibold">
            Subscriptions are the whole of it
          </p>
          <p className="mt-2 leading-relaxed text-ink-muted text-pretty">
            No advertising, no proprietor, no sponsored anything. If you would
            like the magazine to keep existing, this is the mechanism.
          </p>
          <Link
            href="/subscribe"
            className="mt-5 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
          >
            See the plans
          </Link>
        </div>
      </Container>
    </>
  );
}
