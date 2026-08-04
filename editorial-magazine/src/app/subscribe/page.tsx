import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { CoverMockup } from "@/components/cover-mockup";
import { PageHeader } from "@/components/page-header";
import {
  currentIssue,
  pastIssues,
  plans,
  subscribeFaq,
  subscribeIntro,
} from "@/content/subscribe";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Four issues a year, plus everything on the site. No advertising and no proprietor.",
};

export default function SubscribePage() {
  return (
    <>
      <PageHeader
        eyebrow="Subscribe"
        title={subscribeIntro.title}
        description={subscribeIntro.body}
      />

      {/* Plans */}
      <Container width="wide" className="py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex h-full flex-col rounded-sm border bg-surface p-7 ${
                plan.featured
                  ? "border-accent shadow-[0_1px_0_var(--color-accent)]"
                  : "border-line"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold">
                  {plan.name}
                </h2>
                {plan.featured && (
                  <span className="eyebrow rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                    Most taken
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {plan.tagline}
              </p>

              <p className="mt-6">
                <span className="font-display text-4xl font-semibold">
                  £{plan.yearly}
                </span>
                <span className="ml-2 text-sm text-ink-subtle">a year</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.includes.map((item) => (
                  <li
                    key={item}
                    className="relative pl-6 text-[0.95rem] leading-relaxed text-ink-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.6em] left-0 h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-8 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  plan.featured
                    ? "bg-accent text-ink-inverse hover:bg-accent-hover"
                    : "border border-line-strong hover:border-accent hover:text-accent"
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-subtle">
          Prices include posting worldwide. Nothing on this page takes a
          payment — it is a template.
        </p>
      </Container>

      {/* The current issue */}
      <section className="border-y border-line bg-sunk">
        <Container width="wide" className="py-16 sm:py-20">
          <div className="grid items-center gap-14 lg:grid-cols-[20rem_1fr]">
            <CoverMockup issue={currentIssue} priority />
            <div>
              <p className="eyebrow text-accent">On the shelf now</p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl">
                Issue {currentIssue.number} — {currentIssue.season}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
                Leading with{" "}
                <Link
                  href={`/story/${currentIssue.leadStory}`}
                  className="link-rule font-medium text-ink"
                >
                  {currentIssue.coverLine}
                </Link>
                . Subscribe today and this is the issue that arrives.
              </p>

              <div className="mt-10">
                <p className="eyebrow text-ink-subtle">Recently</p>
                <ul className="mt-4 space-y-3">
                  {pastIssues.map((issue) => (
                    <li
                      key={issue.number}
                      className="flex flex-wrap items-baseline gap-x-3 border-b border-line pb-3"
                    >
                      <span className="font-display text-lg font-semibold">
                        {issue.number}
                      </span>
                      <span className="text-sm text-ink-subtle">
                        {issue.season}
                      </span>
                      <Link
                        href={`/story/${issue.leadStory}`}
                        className="link-rule text-ink-muted"
                      >
                        {issue.coverLine}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Questions */}
      <Container width="default" className="py-16 sm:py-20">
        <h2 className="font-display text-3xl font-semibold text-balance">
          Questions people actually ask
        </h2>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {subscribeFaq.map((item) => (
            <div key={item.question} className="py-6">
              <dt className="font-display text-lg font-semibold text-balance">
                {item.question}
              </dt>
              <dd className="mt-2 max-w-2xl leading-relaxed text-ink-muted text-pretty">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
