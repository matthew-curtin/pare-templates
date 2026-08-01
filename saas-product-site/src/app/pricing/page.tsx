import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PricingTable } from "@/components/pricing-table";
import { FaqList } from "@/components/faq-list";
import { LogoCloud } from "@/components/logo-cloud";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section-heading";
import { pricingFaqs } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free for small teams, flat per-user pricing for everyone else, and no charge for people who only read reports.",
};

export default function PricingPage() {
  return (
    <>
      <Container>
        <div className="py-20 text-center sm:py-24">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Pricing
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Straightforward pricing that scales with your team
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-ink-muted">
            People who only read reports are always free, so managers and
            stakeholders never add to your bill.
          </p>
        </div>

        <PricingTable />

        <div className="border-t border-line py-16">
          <LogoCloud heading="Teams already on Cadence" />
        </div>
      </Container>

      <Section width="narrow" className="bg-surface">
        <SectionHeading title="Questions people ask before signing up" />
        <div className="mt-12">
          <FaqList faqs={pricingFaqs} />
        </div>
      </Section>

      <CtaBand
        title="Try it on one team first"
        subtitle="Most teams connect a single repository, look at the last quarter, and decide from there."
        primary={{ label: "Start free trial", href: "/contact" }}
        secondary={{ label: "Compare plans", href: "/features" }}
      />
    </>
  );
}
