import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { FaqList } from "@/components/faq-list";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section-heading";
import { companyFaqs, team, values } from "@/content/team";
import { stats } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who builds Cadence, what we believe about measuring engineering work, and what we refuse to measure.",
};

export default function AboutPage() {
  return (
    <>
      <Container>
        <div className="max-w-3xl py-20 sm:py-24">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            About
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            We build the tool we kept rebuilding badly
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-ink-muted">
            Cadence started as a spreadsheet. Two of us had built some version
            of it at three companies each — pulling review times out of an API
            every Monday to work out why shipping felt harder than it should.
            Eventually it seemed worth building properly.
          </p>
        </div>
      </Container>

      {/* Values */}
      <Section className="bg-surface">
        <SectionHeading
          align="left"
          eyebrow="What we believe"
          title="Three commitments that shape the product"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-line bg-canvas p-7"
            >
              <h3 className="font-semibold text-balance">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Container>
        <dl className="grid gap-8 py-16 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
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

      {/* Team */}
      <Section className="border-t border-line">
        <SectionHeading
          align="left"
          eyebrow="Team"
          title="A small team, on purpose"
          subtitle="Remote across Europe and North America, with a couple of days together each quarter."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name}>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                <Image
                  src={member.photo}
                  alt={`Portrait of ${member.name}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <h3 className="mt-4 font-semibold">{member.name}</h3>
              <p className="text-sm text-accent">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section width="narrow" className="bg-surface">
        <SectionHeading title="A few other things people ask" />
        <div className="mt-12">
          <FaqList faqs={companyFaqs} />
        </div>
      </Section>

      <CtaBand
        title="Come and have a look"
        subtitle="Connect one repository and see the last quarter of your team's work in about ten minutes."
      />
    </>
  );
}
