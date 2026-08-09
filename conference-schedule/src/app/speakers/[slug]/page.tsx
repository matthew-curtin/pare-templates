import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Monogram } from "@/components/wordmark";
import { PlanToggle } from "@/components/plan-toggle";
import { days, rooms, ZONE } from "@/content/site";
import { sessions } from "@/content/sessions";
import { speakers } from "@/content/speakers";
import { isChoosable } from "@/lib/schedule";
import { longDate, rangeLabel, toMinutes } from "@/lib/time";

export function generateStaticParams() {
  return speakers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = speakers.find((p) => p.slug === slug);
  if (!person) return { title: "Not found" };
  return {
    title: person.name,
    description: `${person.role}, ${person.org}. ${person.bio[0]}`,
  };
}

export default async function SpeakerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = speakers.find((p) => p.slug === slug);
  if (!person) notFound();

  const theirs = sessions
    .filter((s) => isChoosable(s) && s.speakerIds.includes(person.id))
    .sort((a, b) =>
      a.day !== b.day ? a.day - b.day : toMinutes(a.start) - toMinutes(b.start),
    );

  return (
    <article className="px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/speakers"
        className="focus-ring narrow text-[0.875rem] text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        ← All speakers
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Monogram
            initials={person.initials}
            className="h-20 w-20 text-[1.5rem]"
          />
          <h1 className="sign mt-6 text-display">{person.name}</h1>
          <p className="wide mt-3 text-lede leading-snug text-ink-muted">
            {person.role}, {person.org}
          </p>
          <p className="narrow mt-1 text-[0.9375rem] text-ink-subtle">
            {person.place}
          </p>

          {person.bio.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="prose-block mt-5 text-[1rem] leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>

        <section>
          <h2 className="narrow border-b border-ink pb-2 text-[0.75rem] uppercase tracking-wide text-ink-subtle">
            {theirs.length === 1 ? "One session" : `${theirs.length} sessions`}
          </h2>
          <ul className="mt-6 space-y-6">
            {theirs.map((s) => {
              const day = days.find((d) => d.n === s.day);
              const room = rooms.find((r) => r.id === s.roomId);
              return (
                <li key={s.id} className="border-l-[3px] pl-4" style={{ borderColor: room?.tone ?? "var(--color-ink)" }}>
                  <p className="narrow tabular text-[0.8125rem] text-ink-subtle">
                    {day ? longDate(day.date, ZONE) : ""} ·{" "}
                    {rangeLabel(toMinutes(s.start), toMinutes(s.end))} ·{" "}
                    {room?.name ?? "All rooms"}
                  </p>
                  <h3 className="wide mt-1 text-[1.25rem] font-semibold leading-tight">
                    <Link
                      href={`/sessions/${s.slug}`}
                      className="focus-ring hover:underline"
                    >
                      {s.title}
                    </Link>
                  </h3>
                  <p className="prose-block mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {s.summary}
                  </p>
                  <div className="mt-3">
                    <PlanToggle sessionId={s.id} title={s.title} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </article>
  );
}
