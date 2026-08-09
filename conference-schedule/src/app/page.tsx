import Link from "next/link";
import { Monogram } from "@/components/wordmark";
import { PlanToggle } from "@/components/plan-toggle";
import { days, now, rooms, site, ZONE } from "@/content/site";
import { sessions } from "@/content/sessions";
import { speakers } from "@/content/speakers";
import { isChoosable, isPlenary, competingWith, place, phaseOf } from "@/lib/schedule";
import { longDate, minutesIntoDay, rangeLabel, toMinutes } from "@/lib/time";

const speakerById = new Map(speakers.map((s) => [s.id, s]));
const choosable = sessions.filter(isChoosable);

export default function FrontPage() {
  const day2 = days[1];
  const nowMins = minutesIntoDay(now, ZONE, day2.date);
  const liveNow = sessions
    .filter((s) => s.day === day2.n && isChoosable(s))
    .map((s) => place(s, toMinutes(day2.opens)))
    .filter((p) => phaseOf(p, nowMins) === "live");

  // The worst collision on the programme, found rather than chosen — so
  // it stays true if the content changes.
  const worst = choosable
    .filter((s) => !isPlenary(s))
    .map((s) => ({ session: s, against: competingWith(s, sessions) }))
    .sort((a, b) => b.against.length - a.against.length)[0];

  return (
    <div>
      {/* The signage. Full-bleed, fluid, and the largest thing in the
          repo — §4c asks for a position on type rather than the 4xl
          middle, and a conference front page is a poster. */}
      <section className="border-b border-ink px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <p className="narrow text-[0.875rem] uppercase tracking-wide text-ink-muted">
          {site.city} · 14–16 October {site.year}
        </p>
        <h1 className="sign mt-4 text-signage">
          Everything
          <br />
          needs keeping
        </h1>
        <p className="prose-block mt-8 text-lede leading-snug text-ink-muted">
          Three days on maintenance — of software, of bridges, of
          buildings, of institutions, of each other. {choosable.length}{" "}
          sessions in four rooms, and an honest schedule that shows you
          what you are giving up.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/schedule"
            className="focus-ring wide bg-ink px-5 py-3 text-[1rem] font-semibold text-ink-inverse transition-colors hover:bg-ink/85"
          >
            See the schedule
          </Link>
          <Link
            href="/tickets"
            className="focus-ring wide border border-ink px-5 py-3 text-[1rem] font-semibold transition-colors hover:bg-live"
          >
            Tickets from $95
          </Link>
        </div>
      </section>

      {/* Happening now. Only exists because the clock is pinned into the
          middle of day two — see the note in site.ts. */}
      {liveNow.length > 0 ? (
        <section className="border-b border-ink bg-sunk px-4 py-8 sm:px-6">
          <h2 className="narrow flex items-center gap-2 text-[0.875rem] uppercase tracking-wide">
            <span className="now-dot inline-block h-2.5 w-2.5 rounded-full bg-live-deep" />
            On right now
          </h2>
          <ul className="mt-5 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {liveNow.map((p) => {
              const room = rooms.find((r) => r.id === p.session.roomId);
              return (
                <li key={p.session.id} className="bg-surface p-4">
                  <span
                    className="mb-2 block h-1 w-10"
                    style={{ background: room?.tone }}
                    aria-hidden="true"
                  />
                  <p className="narrow tabular text-[0.75rem] text-ink-muted">
                    {rangeLabel(p.startMins, p.endMins)} · {room?.name}
                  </p>
                  <h3 className="wide mt-1 text-[1rem] font-semibold leading-tight">
                    <Link
                      href={`/sessions/${p.session.slug}`}
                      className="focus-ring hover:underline"
                    >
                      {p.session.title}
                    </Link>
                  </h3>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* The argument. This is the template's thesis, on the page. */}
      <section className="grid gap-10 border-b border-ink px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h2 className="sign text-title">
            A schedule should tell you what you are missing
          </h2>
          <div className="prose-block mt-5 space-y-4 text-[1rem] leading-relaxed text-ink-muted">
            <p>
              Every conference website prints its programme as a list of
              rows, one slot after another, and every one of them hides
              the only fact you actually need: that the two talks you
              want are at the same time, and that the workshop you
              booked swallows both.
            </p>
            <p>
              Ours is drawn to scale. A block&rsquo;s height is its
              length, so a session that started an hour ago and is still
              running sits visibly across the ones beginning now. It is
              not a nicer list. It is a different piece of information.
            </p>
          </div>
        </div>

        {worst ? (
          <figure className="border border-ink bg-surface p-5">
            <figcaption className="narrow text-[0.75rem] uppercase tracking-wide text-ink-muted">
              The worst slot on the programme
            </figcaption>
            <p className="wide mt-3 text-[1.125rem] font-semibold leading-tight">
              {worst.session.title}
            </p>
            <p className="narrow tabular mt-1 text-[0.8125rem] text-ink-subtle">
              {days.find((d) => d.n === worst.session.day)?.label},{" "}
              {rangeLabel(
                toMinutes(worst.session.start),
                toMinutes(worst.session.end),
              )}
            </p>
            <p className="mt-4 text-[0.875rem] text-ink-muted">
              Runs against {worst.against.length} other things:
            </p>
            <ul className="mt-2 space-y-1.5">
              {worst.against.map((s) => (
                <li key={s.id} className="text-[0.875rem] leading-snug">
                  <Link
                    href={`/sessions/${s.slug}`}
                    className="focus-ring underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-[0.8125rem] text-ink-subtle">
              One of those is a ninety-minute workshop that began an hour
              earlier, so no list-shaped schedule would ever show it here.
            </p>
          </figure>
        ) : null}
      </section>

      {/* The three days. */}
      <section className="border-b border-ink px-4 py-14 sm:px-6">
        <h2 className="sign text-title">Three days, three questions</h2>
        <div className="mt-8 grid gap-px bg-line lg:grid-cols-3">
          {days.map((day) => {
            const count = sessions.filter(
              (s) => s.day === day.n && isChoosable(s),
            ).length;
            return (
              <article key={day.n} className="bg-canvas p-6 lg:p-8">
                <p className="narrow tabular text-[0.8125rem] text-ink-subtle">
                  {longDate(day.date, ZONE)}
                </p>
                <h3 className="sign mt-2 text-[2rem]">{day.strand}</h3>
                <p className="narrow tabular mt-3 text-[0.875rem] text-ink-muted">
                  {count} sessions · {day.opens}–{day.closes}
                </p>
                <Link
                  href={`/schedule?day=${day.n}`}
                  className="focus-ring narrow mt-5 inline-block border-b-2 border-ink pb-0.5 text-[0.9375rem] hover:border-live-deep"
                >
                  Open {day.label}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Plenaries — the two things nobody has to choose about. */}
      <section className="border-b border-ink px-4 py-14 sm:px-6">
        <h2 className="sign text-title">Nobody chooses about these</h2>
        <p className="prose-block mt-3 text-[1rem] text-ink-muted">
          Two sessions take the whole building, so there is nothing
          running against them.
        </p>
        <ul className="mt-8 grid gap-6 lg:grid-cols-2">
          {sessions
            .filter((s) => isPlenary(s) && isChoosable(s))
            .map((s) => {
              const day = days.find((d) => d.n === s.day);
              return (
                <li key={s.id} className="border border-ink bg-ink p-6 text-ink-inverse">
                  <p className="narrow tabular text-[0.8125rem] text-ink-inverse/60">
                    {day?.label} · {rangeLabel(toMinutes(s.start), toMinutes(s.end))}
                  </p>
                  <h3 className="sign mt-2 text-[1.75rem]">
                    <Link href={`/sessions/${s.slug}`} className="focus-ring hover:underline">
                      {s.title}
                    </Link>
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {s.speakerIds.map((id) => {
                      const p = speakerById.get(id);
                      if (!p) return null;
                      return (
                        <span key={id} className="flex items-center gap-2">
                          <Monogram
                            initials={p.initials}
                            className="h-8 w-8 border border-ink-inverse/30 bg-transparent text-[0.75rem] text-ink-inverse"
                          />
                          <span className="text-[0.875rem]">{p.name}</span>
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-inverse/75">
                    {s.summary}
                  </p>
                  <div className="mt-5">
                    <PlanToggle sessionId={s.id} title={s.title} size="md" />
                  </div>
                </li>
              );
            })}
        </ul>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="sign text-title">Speaking</h2>
          <Link
            href="/speakers"
            className="focus-ring narrow border-b-2 border-ink pb-0.5 text-[0.9375rem] hover:border-live-deep"
          >
            All {speakers.length}
          </Link>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {speakers.slice(0, 14).map((p) => (
            <li key={p.id}>
              <Link
                href={`/speakers/${p.slug}`}
                className="focus-ring flex items-center gap-2.5 hover:underline"
              >
                <Monogram initials={p.initials} className="h-9 w-9 text-[0.8125rem]" />
                <span>
                  <span className="wide block text-[0.9375rem] font-semibold leading-tight">
                    {p.name}
                  </span>
                  <span className="narrow block text-[0.8125rem] text-ink-subtle">
                    {p.org}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
