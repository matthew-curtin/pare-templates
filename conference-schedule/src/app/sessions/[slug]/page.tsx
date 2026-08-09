import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Monogram } from "@/components/wordmark";
import { PlanToggle } from "@/components/plan-toggle";
import { days, now, rooms, ZONE } from "@/content/site";
import { sessions } from "@/content/sessions";
import { speakers } from "@/content/speakers";
import {
  competingWith,
  isChoosable,
  isPlenary,
  phaseOf,
  place,
} from "@/lib/schedule";
import {
  durationLabel,
  longDate,
  minutesIntoDay,
  rangeLabel,
  toMinutes,
} from "@/lib/time";

const speakerById = new Map(speakers.map((s) => [s.id, s]));

export function generateStaticParams() {
  return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = sessions.find((s) => s.slug === slug);
  if (!session) return { title: "Not found" };
  return { title: session.title, description: session.summary };
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = sessions.find((s) => s.slug === slug);
  if (!session) notFound();

  const day = days.find((d) => d.n === session.day);
  if (!day) notFound();

  const room = rooms.find((r) => r.id === session.roomId);
  const placed = place(session, toMinutes(day.opens));
  const phase = phaseOf(placed, minutesIntoDay(now, ZONE, day.date));
  const against = competingWith(session, sessions);
  const people = session.speakerIds
    .map((id) => speakerById.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <article className="px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href={`/schedule?day=${day.n}`}
        className="focus-ring narrow text-[0.875rem] text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        ← {day.label} on the wallchart
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {room ? (
              <span
                className="narrow inline-flex items-center gap-1.5 border border-ink px-2 py-0.5 text-[0.8125rem]"
                style={{ background: room.toneSoft }}
              >
                <span
                  className="h-2.5 w-2.5"
                  style={{ background: room.tone }}
                  aria-hidden="true"
                />
                {room.name}
              </span>
            ) : (
              <span className="narrow border border-ink bg-ink px-2 py-0.5 text-[0.8125rem] text-ink-inverse">
                Everyone, all rooms
              </span>
            )}
            <span className="narrow border border-line-strong px-2 py-0.5 text-[0.8125rem] text-ink-muted">
              {session.kind}
            </span>
            {phase === "live" ? (
              <span className="narrow bg-live px-2 py-0.5 text-[0.8125rem] font-semibold text-on-live">
                On right now
              </span>
            ) : null}
            {phase === "past" ? (
              <span className="narrow border border-line-strong px-2 py-0.5 text-[0.8125rem] text-ink-subtle">
                Finished
              </span>
            ) : null}
            {session.soldOut ? (
              <span className="narrow border border-ink px-2 py-0.5 text-[0.8125rem]">
                Ballot full
              </span>
            ) : null}
          </div>

          <h1 className="sign mt-5 text-display">{session.title}</h1>

          {session.cancelled ? (
            <p className="mt-6 border-l-4 border-clash bg-clash-soft px-4 py-3 text-[0.9375rem] leading-relaxed">
              <strong className="font-semibold">Cancelled.</strong>{" "}
              {session.cancelled}
            </p>
          ) : null}

          <p className="prose-block mt-6 text-lede leading-snug text-ink-muted">
            {session.summary}
          </p>

          {session.body?.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="prose-block mt-5 text-[1rem] leading-relaxed"
            >
              {para}
            </p>
          ))}

          {people.length > 0 ? (
            <section className="mt-12 border-t border-ink pt-8">
              <h2 className="narrow text-[0.75rem] uppercase tracking-wide text-ink-subtle">
                {people.length === 1 ? "Speaker" : "Speakers"}
              </h2>
              <ul className="mt-5 grid gap-6 sm:grid-cols-2">
                {people.map((p) => (
                  <li key={p.id} className="flex gap-4">
                    <Monogram
                      initials={p.initials}
                      className="h-12 w-12 text-[0.9375rem]"
                    />
                    <div className="min-w-0">
                      <h3 className="wide text-[1rem] font-semibold leading-tight">
                        <Link
                          href={`/speakers/${p.slug}`}
                          className="focus-ring hover:underline"
                        >
                          {p.name}
                        </Link>
                      </h3>
                      <p className="narrow text-[0.875rem] text-ink-muted">
                        {p.role}, {p.org}
                      </p>
                      <p className="narrow text-[0.8125rem] text-ink-subtle">
                        {p.place}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* The docket, and the thing no other conference site prints. */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <dl className="border border-ink bg-surface">
            <Row label="When">
              {longDate(day.date, ZONE)}
              <br />
              <span className="tabular">
                {rangeLabel(placed.startMins, placed.endMins)}
              </span>{" "}
              <span className="text-ink-subtle">
                ({durationLabel(placed.minutes)})
              </span>
            </Row>
            <Row label="Where">
              {room ? (
                <>
                  {room.name}
                  <br />
                  <span className="text-ink-subtle">{room.where}</span>
                </>
              ) : (
                "Every room — nothing else is running"
              )}
            </Row>
            {session.capacity ? (
              <Row label="Places">
                {session.capacity} by ballot
                {session.soldOut ? (
                  <>
                    <br />
                    <span className="text-ink-subtle">
                      The ballot has closed.
                    </span>
                  </>
                ) : null}
              </Row>
            ) : null}
            {session.topics.length > 0 ? (
              <Row label="Topics">
                <span className="flex flex-wrap gap-1.5">
                  {session.topics.map((t) => (
                    <Link
                      key={t}
                      href={`/schedule?day=${day.n}&topic=${encodeURIComponent(t)}`}
                      className="focus-ring narrow border border-line-strong px-2 py-0.5 text-[0.8125rem] hover:border-ink"
                    >
                      {t}
                    </Link>
                  ))}
                </span>
              </Row>
            ) : null}
          </dl>

          {isChoosable(session) ? (
            <div className="mt-4">
              <PlanToggle
                sessionId={session.id}
                title={session.title}
                size="md"
              />
            </div>
          ) : null}

          {isChoosable(session) && !isPlenary(session) ? (
            <section className="mt-8 border border-ink">
              <h2 className="narrow border-b border-ink bg-ink px-4 py-2 text-[0.75rem] uppercase tracking-wide text-ink-inverse">
                What this costs you
              </h2>
              <div className="p-4">
                {against.length === 0 ? (
                  <p className="text-[0.9375rem] text-ink-muted">
                    Nothing. This is the only thing running.
                  </p>
                ) : (
                  <>
                    <p className="text-[0.9375rem] text-ink-muted">
                      {against.length}{" "}
                      {against.length === 1 ? "session" : "sessions"} run
                      against this one, in whole or in part.
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {against.map((other) => {
                        const otherRoom = rooms.find(
                          (r) => r.id === other.roomId,
                        );
                        const partial =
                          toMinutes(other.start) !== toMinutes(session.start);
                        return (
                          <li key={other.id} className="flex gap-2.5">
                            <span
                              className="mt-1.5 h-2.5 w-2.5 shrink-0"
                              style={{ background: otherRoom?.tone }}
                              aria-hidden="true"
                            />
                            <span className="min-w-0">
                              <Link
                                href={`/sessions/${other.slug}`}
                                className="focus-ring text-[0.9375rem] leading-snug underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                              >
                                {other.title}
                              </Link>
                              <span className="narrow tabular block text-[0.8125rem] text-ink-subtle">
                                {rangeLabel(
                                  toMinutes(other.start),
                                  toMinutes(other.end),
                                )}{" "}
                                · {otherRoom?.name}
                                {partial ? " · overlaps in part" : ""}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-line px-4 py-3 last:border-b-0">
      <dt className="narrow text-[0.75rem] uppercase tracking-wide text-ink-subtle">
        {label}
      </dt>
      <dd className="text-[0.9375rem] leading-snug">{children}</dd>
    </div>
  );
}
