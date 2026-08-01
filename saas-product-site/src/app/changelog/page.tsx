import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { changelog } from "@/content/changelog";
import { formatDate } from "@/lib/format";
import { clsx } from "@/lib/clsx";
import type { ChangelogEntry } from "@/content/types";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What shipped in Cadence, newest first.",
};

const tagStyles: Record<ChangelogEntry["tag"], string> = {
  feature: "bg-accent-soft text-accent",
  improvement: "bg-emerald-50 text-emerald-700",
  fix: "bg-amber-50 text-amber-700",
};

export default function ChangelogPage() {
  return (
    <>
      <Container width="narrow">
        <div className="py-20 sm:py-24">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Changelog
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            What&rsquo;s new
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Every release, newest first. We ship most weeks and write these
            ourselves.
          </p>
        </div>

        <div className="border-t border-line pb-8">
          {changelog.map((entry) => (
            <article
              key={entry.version}
              className="grid gap-6 border-b border-line py-12 sm:grid-cols-[140px_1fr]"
            >
              <div>
                <p className="font-mono text-sm font-medium text-ink">
                  {entry.version}
                </p>
                <p className="mt-1 text-sm text-ink-subtle">
                  {formatDate(entry.date)}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {entry.title}
                  </h2>
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      tagStyles[entry.tag],
                    )}
                  >
                    {entry.tag}
                  </span>
                </div>

                <p className="mt-3 leading-relaxed text-ink-muted">
                  {entry.summary}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {entry.changes.map((change) => (
                    <li key={change} className="flex gap-3 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-subtle"
                      />
                      <span className="text-ink-muted">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Container>

      <CtaBand
        title="Want these in Slack?"
        subtitle="Release notes can post straight to a channel, along with your team's weekly digest."
        primary={{ label: "Start free", href: "/pricing" }}
        secondary={{ label: "See integrations", href: "/features" }}
      />
    </>
  );
}
