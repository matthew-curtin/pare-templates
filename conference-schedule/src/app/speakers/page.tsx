import type { Metadata } from "next";
import Link from "next/link";
import { Monogram } from "@/components/wordmark";
import { days } from "@/content/site";
import { sessions } from "@/content/sessions";
import { speakers } from "@/content/speakers";
import { isChoosable } from "@/lib/schedule";
import { rangeLabel, toMinutes } from "@/lib/time";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Thirty people who spend their working lives keeping something going.",
};

export default function SpeakersPage() {
  const byId = new Map(
    speakers.map((p) => [
      p.id,
      sessions.filter((s) => isChoosable(s) && s.speakerIds.includes(p.id)),
    ]),
  );

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="sign text-display">Thirty people</h1>
        <p className="prose-block mt-4 text-lede leading-snug text-ink-muted">
          Bridge inspectors, roofers, archivists, maintainers, a canal
          warden and a bicycle mechanic. Nobody here is speaking about
          something they read.
        </p>
      </header>

      <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {speakers.map((p) => {
          const theirs = byId.get(p.id) ?? [];
          return (
            <li key={p.id} className="bg-canvas p-5">
              <div className="flex gap-4">
                <Monogram
                  initials={p.initials}
                  className="h-12 w-12 text-[0.9375rem]"
                />
                <div className="min-w-0">
                  <h2 className="wide text-[1.0625rem] font-semibold leading-tight">
                    <Link
                      href={`/speakers/${p.slug}`}
                      className="focus-ring hover:underline"
                    >
                      {p.name}
                    </Link>
                  </h2>
                  <p className="narrow text-[0.875rem] leading-snug text-ink-muted">
                    {p.role}, {p.org}
                  </p>
                  <p className="narrow text-[0.8125rem] text-ink-subtle">
                    {p.place}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {theirs.map((s) => (
                  <li key={s.id} className="text-[0.875rem] leading-snug">
                    <Link
                      href={`/sessions/${s.slug}`}
                      className="focus-ring underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                    >
                      {s.title}
                    </Link>
                    <span className="narrow tabular block text-[0.75rem] text-ink-subtle">
                      {days.find((d) => d.n === s.day)?.label}{" "}
                      {rangeLabel(toMinutes(s.start), toMinutes(s.end))}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
