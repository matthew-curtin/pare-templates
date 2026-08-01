import type { Metadata } from "next";
import Link from "next/link";
import { PhoneMockup } from "@/components/phone-mockup";
import { PageHeader, Section, SectionHeading } from "@/components/section-heading";
import { StoreBadge } from "@/components/store-badge";
import { releases } from "@/content/releases";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Get Lull for iPhone, iPad, Android and Wear OS — free, with an optional subscription.",
};

export default function DownloadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Download"
        title="Get Lull"
        subtitle="Free to download and free to keep using. Nothing is behind a sign-up wall — you can record your first night before you make an account."
      />

      <Section width="wide">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap gap-3">
              <StoreBadge platform="ios" />
              <StoreBadge platform="android" />
            </div>

            <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              <Requirement label="iOS" value={site.app.ios} />
              <Requirement label="Android" value={site.app.android} />
              <Requirement label="Download size" value={site.app.size} />
              <Requirement label="Price" value={site.app.price} />
            </dl>

            <div className="mt-12 rounded-2xl border border-line bg-surface p-6">
              <h2 className="font-bold text-ink">Before your first night</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Set a wake time, plug the phone in, and rest it face down on
                the corner of the mattress — on top of the covers, not under
                them. That is the whole setup.
              </p>
              <Link
                href="/support/first-night"
                className="mt-4 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Read the full guide →
              </Link>
            </div>
          </div>

          <PhoneMockup />
        </div>
      </Section>

      <Section className="border-t border-line bg-surface" width="narrow">
        <SectionHeading
          align="left"
          eyebrow="Release notes"
          title="What's changed"
          subtitle="Every version, newest first. We ship roughly every six weeks."
        />

        <ol className="mt-12 space-y-10">
          {releases.map((release) => (
            <li
              key={release.version}
              className="border-l border-line pl-6 sm:pl-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent">
                  {release.version}
                </span>
                <time
                  dateTime={release.date}
                  className="text-sm text-ink-subtle"
                >
                  {formatDate(release.date)}
                </time>
              </div>

              <p className="mt-3 leading-relaxed text-ink">{release.summary}</p>

              <ul className="mt-4 space-y-2">
                {release.changes.map((change) => (
                  <li
                    key={change}
                    className="flex gap-3 text-sm leading-relaxed text-ink-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-subtle"
                    />
                    {change}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

function Requirement({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-[0.14em] text-ink-subtle uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 leading-relaxed text-ink-muted">{value}</dd>
    </div>
  );
}
