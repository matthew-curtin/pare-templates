import type { Metadata } from "next";
import Link from "next/link";
import { openingHours, site } from "@/content/site";
import { faqs, gettingHere } from "@/content/visit";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Where we are, when we are open, how to get here, and the questions we are asked most.",
};

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">
        Visit
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <section>
            <h2 className="font-display text-2xl">Getting here</h2>
            <dl className="mt-5 space-y-5">
              {gettingHere.map((entry) => (
                <div key={entry.mode}>
                  <dt className="text-sm font-medium text-accent">
                    {entry.mode}
                  </dt>
                  <dd className="mt-1 max-w-prose text-ink-muted">
                    {entry.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl">Questions</h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {faqs.map((item) => (
                <details key={item.question} className="group py-4">
                  <summary className="focus-ring flex cursor-pointer items-center justify-between gap-4 rounded-sm text-left marker:content-none">
                    <span className="font-medium">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-ink-subtle transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-prose text-ink-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-line bg-surface p-5">
            <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
              Where
            </h2>
            <address className="mt-3 not-italic">
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>
            <p className="mt-4 space-y-1 text-sm">
              <a
                href={site.address.phoneHref}
                className="focus-ring block rounded-sm text-ink-muted hover:text-ink"
              >
                {site.address.phone}
              </a>
              <a
                href={`mailto:${site.address.email}`}
                className="focus-ring block rounded-sm text-ink-muted hover:text-ink"
              >
                {site.address.email}
              </a>
            </p>
          </div>

          <div className="rounded-lg border border-line bg-surface p-5">
            <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
              Opening
            </h2>
            <dl className="mt-3 space-y-1 text-sm">
              {openingHours.map((day) => {
                const shut = day.lunch === null && day.dinner === null;
                return (
                  <div key={day.day} className="flex justify-between gap-3">
                    <dt className={shut ? "text-ink-subtle" : "text-ink-muted"}>
                      {day.day}
                    </dt>
                    <dd
                      className={`tabular text-right ${
                        shut ? "text-ink-subtle" : "text-ink-muted"
                      }`}
                    >
                      {shut
                        ? "Closed"
                        : `${day.lunch ?? "—"}${
                            day.dinner ? ` · ${day.dinner}` : ""
                          }`}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <Link
            href="/book"
            className="focus-ring block rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Book a table
          </Link>
        </aside>
      </div>
    </div>
  );
}
