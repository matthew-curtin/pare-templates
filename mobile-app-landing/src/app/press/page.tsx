import type { Metadata } from "next";
import { PageHeader, Section, SectionHeading } from "@/components/section-heading";
import { pressAssets, pressKit, pressMentions } from "@/content/press";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Press kit",
  description:
    "Boilerplate, facts, logos and screenshots — everything you need to write about Lull.",
};

export default function PressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Press"
        title="Press kit"
        subtitle="Everything you need to write about us, in one place. Take whatever is useful — you do not need to ask first."
      />

      {/* Boilerplate */}
      <Section width="narrow">
        <SectionHeading
          align="left"
          eyebrow="Boilerplate"
          title="The paragraph we'd like quoted"
        />
        <blockquote className="edge-light mt-8 rounded-2xl border border-line bg-surface p-7 text-lg leading-relaxed text-ink-muted">
          {pressKit.boilerplate}
        </blockquote>
      </Section>

      {/* Facts */}
      <Section className="border-y border-line bg-surface">
        <SectionHeading eyebrow="The facts" title="Everything on one line" />
        <dl className="mx-auto mt-12 grid max-w-4xl gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {pressKit.facts.map((fact) => (
            <div key={fact.label} className="border-l border-line-strong pl-5">
              <dt className="text-xs font-bold tracking-[0.14em] text-ink-subtle uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1.5 font-semibold text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Assets */}
      <Section>
        <SectionHeading
          eyebrow="Assets"
          title="Logos, screenshots and portraits"
          subtitle="Nothing is actually attached in this template — wire the links up to real files when you replace the content."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {pressAssets.map((asset) => (
            <div
              key={asset.name}
              className="edge-light flex items-start justify-between gap-5 rounded-2xl border border-line bg-surface p-6"
            >
              <div>
                <h3 className="font-bold text-ink">{asset.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {asset.description}
                </p>
                <p className="mt-3 text-xs text-ink-subtle">{asset.meta}</p>
              </div>
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-muted"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2v9M4.5 7.5 8 11l3.5-3.5M3 13.5h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Coverage */}
      <Section className="border-y border-line bg-surface">
        <SectionHeading eyebrow="Coverage" title="Written about in" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pressMentions.map((mention) => (
            <figure
              key={mention.outlet}
              className="edge-light flex h-full flex-col rounded-2xl border border-line bg-canvas p-6"
            >
              <blockquote className="flex-1 text-lg leading-relaxed text-balance text-ink">
                “{mention.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4 text-sm">
                <span className="font-semibold text-ink-muted">
                  {mention.outlet}
                </span>
                <span className="mx-1.5 text-ink-subtle">·</span>
                <time dateTime={mention.date} className="text-ink-subtle">
                  {formatDate(mention.date)}
                </time>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section width="narrow">
        <div className="edge-light rounded-2xl border border-line bg-surface p-8 sm:p-12">
          <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
            Press contact
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            {pressKit.contact.name}
          </h2>
          <p className="mt-1 text-ink-muted">{pressKit.contact.role}</p>
          <p className="mt-5 max-w-lg leading-relaxed text-ink-muted">
            {pressKit.contact.note}
          </p>
          <a
            href={`mailto:${pressKit.contact.email}`}
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            {pressKit.contact.email}
          </a>
          <p className="mt-8 border-t border-line pt-6 text-sm text-ink-subtle">
            {site.name} is a fictional company invented for this template.
            Every fact, quote and figure on this page is made up.
          </p>
        </div>
      </Section>
    </>
  );
}
