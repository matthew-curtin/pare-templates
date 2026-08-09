import type { Metadata } from "next";
import Link from "next/link";
import { Bullet, RuleLabel } from "@/components/chips";
import { Monogram } from "@/components/wordmark";
import { about, questions } from "@/content/about";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who runs Almanac, what gets listed and what does not, and why closed jobs keep their pages.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">
          About {site.name}
        </h1>
      </header>

      <div className="mt-6 space-y-5">
        {about.intro.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-lg leading-relaxed text-ink-muted"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-12">
        <RuleLabel>Who that is</RuleLabel>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {about.people.map((person) => (
            <li
              key={person.name}
              className="flex gap-4 rounded-card bg-surface p-5 shadow-card"
            >
              <Monogram name={person.name} />
              <div>
                <p className="font-semibold text-ink">{person.name}</p>
                <p className="mt-0.5 text-xs font-medium text-ink-subtle">
                  {person.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {person.note}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="policy" className="mt-14 scroll-mt-24">
        <RuleLabel>{about.policy.heading}</RuleLabel>
        {about.policy.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="mt-4 leading-relaxed text-ink-muted"
          >
            {paragraph}
          </p>
        ))}
        <ul className="mt-5 space-y-2.5">
          {about.policy.points.map((point) => (
            <li
              key={point.slice(0, 40)}
              className="flex gap-3 leading-relaxed text-ink-muted"
            >
              <Bullet />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
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

      <section id="questions" className="mt-14 scroll-mt-24">
        <RuleLabel>Questions</RuleLabel>
        <dl className="mt-4 space-y-3">
          {questions.map((entry) => (
            <div
              key={entry.q}
              className="rounded-card bg-surface p-6 shadow-card"
            >
              <dt className="text-lg font-bold tracking-tight text-ink">
                {entry.q}
              </dt>
              <dd className="mt-2.5 space-y-3">
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

      <section className="mt-14 rounded-card bg-surface p-6 shadow-card">
        <RuleLabel>Get in touch</RuleLabel>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {site.email} — read by both of us, answered by whoever gets there
          first. If a listing is wrong, tell us and we will fix it the same
          day.
        </p>
        <p className="mt-5 text-sm">
          <Link
            href="/post"
            className="focus-ring font-medium text-accent underline underline-offset-2"
          >
            Posting a job
          </Link>
          <span className="text-ink-subtle"> · </span>
          <Link
            href="/alerts"
            className="focus-ring font-medium text-accent underline underline-offset-2"
          >
            Email alerts
          </Link>
        </p>
      </section>
    </div>
  );
}
