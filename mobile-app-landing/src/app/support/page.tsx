import type { Metadata } from "next";
import { ArticleSearch } from "@/components/article-search";
import { FaqList } from "@/components/faq-list";
import { PageHeader, Section, SectionHeading } from "@/components/section-heading";
import { articles, supportFaqs } from "@/content/support";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Guides for setting up your first night, fixing an alarm that didn't go off, and managing your subscription.",
};

export default function SupportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Help centre"
        subtitle="Short guides to the things that actually go wrong. If none of them covers it, write to us — a person reads every message."
      />

      <Section width="narrow">
        <ArticleSearch articles={articles} />
      </Section>

      <Section className="border-t border-line bg-surface" width="narrow">
        <SectionHeading align="left" eyebrow="Quick answers" title="Asked a lot" />
        <div className="mt-10">
          <FaqList faqs={supportFaqs} />
        </div>
      </Section>

      <Section id="contact" width="narrow" className="scroll-mt-24">
        <div className="edge-light rounded-2xl border border-line bg-surface p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-balance">
            Still stuck?
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-muted text-pretty">
            Tell us what happened and which phone you are on. We answer every
            message ourselves, usually within a day, and we will not ask you to
            reinstall before reading it.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            {site.email}
          </a>
        </div>
      </Section>
    </>
  );
}
