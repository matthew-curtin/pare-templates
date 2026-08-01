import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Cadence team.",
};

const details = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    label: "Sales",
    value: "Book a 20-minute call",
    href: "/contact",
  },
  {
    label: "Support",
    value: "Weekdays, 9am–6pm UTC",
  },
];

export default function ContactPage() {
  return (
    <Container>
      <div className="grid gap-16 py-20 sm:py-24 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Talk to a person
          </h1>
          <p className="mt-5 leading-relaxed text-ink-muted">
            Questions about the product, a security review to get through, or
            just want to know whether this would help your team — all of it goes
            to the same inbox, and a human answers.
          </p>

          <dl className="mt-10 space-y-6 border-t border-line pt-8">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-sm font-medium text-ink-subtle">
                  {detail.label}
                </dt>
                <dd className="mt-1">
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-ink transition-colors hover:text-accent"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-ink">{detail.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-line p-7 sm:p-9">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
