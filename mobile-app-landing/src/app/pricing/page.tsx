import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { PricingTable } from "@/components/pricing-table";
import { PageHeader, Section, SectionHeading } from "@/components/section-heading";
import { pricingFaqs } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free is a permanent plan, not a trial. Plus adds the full sound library and your whole history.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Free is a plan, not a countdown"
        subtitle="Sleep recording, the wake window and the gentle alarm are free and will stay free. Plus adds the rest of the library and your whole history."
      />

      <Section width="wide">
        <PricingTable />

        <p className="mt-10 text-center text-sm text-ink-subtle">
          Prices include VAT. Cancel from your app store at any time — there
          is no retention flow and nobody to email.
        </p>
      </Section>

      <Section className="border-t border-line bg-surface" width="narrow">
        <SectionHeading
          eyebrow="Questions"
          title="The things people ask before subscribing"
        />
        <div className="mt-12">
          <FaqList faqs={pricingFaqs} />
        </div>
      </Section>

      <CtaBand
        title="Try Plus for thirty days."
        subtitle="We remind you before it ends. If you do nothing it starts; if you cancel, nothing is deleted."
      />
    </>
  );
}
