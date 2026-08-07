import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";
import { getReleases } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Changelog",
  description: "API versions, library releases and breaking changes.",
};

/* Release kinds get a colour so a breaking change is visible while
   scrolling. Anything not listed falls back to neutral rather than
   throwing, so adding a new kind in a markdown file cannot break the
   page. */
const KIND_STYLE: Record<string, string> = {
  "API version": "bg-note-soft text-note",
  "Breaking change": "bg-danger-soft text-danger",
  Library: "bg-accent-soft text-accent",
  CLI: "bg-good-soft text-good",
};

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function ChangelogPage() {
  const releases = getReleases();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
        <p className="mt-2 text-[17px] leading-7 text-ink-muted">
          API versions are dates. Pinning to one keeps that behaviour until you change it; a
          breaking change never lands on a version you have already pinned.
        </p>
      </header>

      <div className="space-y-14">
        {releases.map((release) => (
          <article key={release.version} className="grid gap-4 sm:grid-cols-[9rem_1fr]">
            <div className="min-w-0 sm:pt-1">
              <p className="font-mono text-sm font-medium text-ink">{release.version}</p>
              <p className="mt-0.5 text-xs text-ink-subtle">{formatDate(release.date)}</p>
              <span
                className={`mt-2 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${
                  KIND_STYLE[release.kind] ?? "bg-surface text-ink-muted"
                }`}
              >
                {release.kind}
              </span>
            </div>

            {/* Release notes are markdown, through the same renderer the
                documentation uses. The first paragraph carries no top
                margin so it lines up with the version beside it. */}
            <div className="min-w-0 [&>*:first-child]:mt-0">
              <Markdown tokens={release.tokens} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
