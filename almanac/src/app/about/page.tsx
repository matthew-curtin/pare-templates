import type { Metadata } from "next";
import Link from "next/link";
import { RuleLabel } from "@/components/chips";
import { Monogram } from "@/components/wordmark";
import { about, questions } from "@/content/about";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who runs Almanac, what gets listed and what does not, and why closed vacancies keep their pages.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="border-b border-line-strong pb-5">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          About {site.name}
        </h1>
      </header>

      <div className="mt-6 space-y-4">
        {about.intro.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-lg leading-relaxed text-ink-muted"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-10">
        <RuleLabel>Who that is</RuleLabel>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {about.people.map((person) => (
            <li
              key={person.name}
              className="flex gap-3 rounded-card border border-line bg-surface p-4"
            >
              <Monogram name={person.name} />
              <div>
                <p className="font-semibold text-ink">{person.name}</p>
                <p className="label mt-0.5 text-ink-subtle">{person.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {person.note}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="policy" className="mt-12 scroll-mt-6">
        <RuleLabel>{about.policy.heading}</RuleLabel>
        {about.policy.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="mt-4 leading-relaxed text-ink-muted"
          >
            {paragraph}
          </p>
        ))}
        <ul className="mt-5 space-y-2">
          {about.policy.points.map((point) => (
            <li
              key={point.slice(0, 40)}
              className="flex gap-3 leading-relaxed text-ink-muted"
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-1 w-3 shrink-0 bg-line-strong"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <RuleLabel>{about.closed.heading}</RuleLabel>
        {about.closed.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="mt-4 leading-relaxed text-ink-muted"
          >
            {paragraph}
          </p>
        ))}
      </section>

      <section id="questions" className="mt-12 scroll-mt-6">
        <RuleLabel>Questions</RuleLabel>
        <dl className="mt-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {questions.map((entry) => (
            <div key={entry.q} className="p-5">
              <dt className="font-serif text-lg font-semibold text-ink">
                {entry.q}
              </dt>
              <dd className="mt-2 space-y-3">
                {entry.a.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="leading-relaxed text-ink-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 rounded-card border border-line bg-surface p-5">
        <RuleLabel>Get in touch</RuleLabel>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {site.email} — read by both of us, answered by whoever gets
          there first. If a listing is wrong, tell us and we will fix it
          the same day.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/post" className="focus-ring text-accent underline">
            Advertising a vacancy
          </Link>{" "}
          ·{" "}
          <Link href="/alerts" className="focus-ring text-accent underline">
            Email alerts
          </Link>
        </p>
      </section>
    </div>
  );
}
