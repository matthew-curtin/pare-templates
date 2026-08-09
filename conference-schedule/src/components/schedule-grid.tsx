import Link from "next/link";
import { PlanToggle } from "./plan-toggle";
import type { ConferenceDay } from "@/content/site";
import { speakers } from "@/content/speakers";
import type { Room, Session } from "@/content/types";
import {
  isChoosable,
  isPlenary,
  phaseOf,
  place,
  type Placed,
} from "@/lib/schedule";
import { durationLabel, hourLabel, rangeLabel, toMinutes } from "@/lib/time";

const speakerById = new Map(speakers.map((s) => [s.id, s]));

function names(session: Session): string {
  return session.speakerIds
    .map((id) => speakerById.get(id)?.name ?? "")
    .filter(Boolean)
    .join(", ");
}

/**
 * One day, drawn to scale.
 *
 * The whole argument of this template is in the positioning: a block's
 * top is (start − day opens) and its height is (end − start), both in
 * minutes against `--hour-height`. Nothing rounds to a row, so a
 * ninety-minute workshop genuinely overlaps the two forty-five minute
 * talks that start in the middle of it — a collision no list-shaped
 * schedule can show, because in a list those three are in different
 * rows and look like different choices.
 */
export function ScheduleGrid({
  day,
  sessions,
  visibleRooms,
  nowMins,
}: {
  day: ConferenceDay;
  sessions: Session[];
  visibleRooms: Room[];
  /** Minutes into this day, or null when the pinned now is elsewhere. */
  nowMins: number | null;
}) {
  const open = toMinutes(day.opens);
  const close = toMinutes(day.closes);
  const spanMinutes = close - open;

  const onDay = sessions.filter((s) => s.day === day.n);
  const plenaries = onDay.filter(isPlenary).map((s) => place(s, open));
  const hours: number[] = [];
  for (let m = Math.ceil(open / 60) * 60; m <= close; m += 60) hours.push(m);

  const gridHeight = `calc(${spanMinutes} / 60 * var(--hour-height))`;

  if (visibleRooms.length === 0) {
    return (
      <p className="border border-line-strong bg-surface px-6 py-16 text-center text-ink-muted">
        No rooms selected. Turn one back on above.
      </p>
    );
  }

  return (
    <div className="min-w-0 overflow-x-auto">
      <div
        className="relative min-w-[42rem]"
        style={{
          // The rail plus one track per visible room. Tracks are equal
          // and never narrower than legible; past that the container
          // scrolls sideways rather than the blocks getting unreadable.
          display: "grid",
          gridTemplateColumns: `var(--rail-width) repeat(${visibleRooms.length}, minmax(9.5rem, 1fr))`,
        }}
      >
        {/* EVERY child is placed explicitly, and that is load-bearing.
            The plenary layer below has a definite row and column, and
            CSS grid places definitely-positioned items BEFORE it
            auto-places anything — so with auto-placed columns the
            plenary took row 2 and pushed all four room columns down
            into a third row that should not exist. Definite placement
            throughout lets them overlap, which is the whole point. */}
        <div
          className="sticky top-0 z-30 border-b border-ink bg-canvas"
          style={{ gridRow: 1, gridColumn: 1 }}
        />
        {visibleRooms.map((room, i) => (
          <div
            key={room.id}
            style={{ gridRow: 1, gridColumn: i + 2 }}
            className="sticky top-0 z-30 border-b border-l border-ink bg-canvas px-2 py-2"
          >
            <span
              className="mb-1 block h-1 w-full"
              style={{ background: room.tone }}
              aria-hidden="true"
            />
            <p className="narrow text-[0.8125rem] font-semibold leading-tight">
              {room.name}
            </p>
            <p className="narrow tabular text-[0.6875rem] text-ink-subtle">
              {room.seats} seats
            </p>
          </div>
        ))}

        {/* The hour rail. Sticky on the horizontal axis so it survives a
            sideways scroll on a phone. */}
        <div
          className="sticky left-0 z-20 bg-canvas"
          style={{ gridRow: 2, gridColumn: 1, height: gridHeight }}
        >
          {/* Scroll-driven, so you can see how far down the page you are
              on a nine-hour day where the rail itself never moves. No
              scroll listener, no rAF, and it runs off the main thread —
              which is the reason to prefer it, not a bonus. */}
          <span
            className="rail-progress absolute right-0 top-0 z-10 h-full w-px bg-ink"
            aria-hidden="true"
          />
          {hours.map((m) => (
            <span
              key={m}
              // The rail is exactly as tall as the day, so a label
              // centred on the first or last hour line has half of
              // itself outside the box — under the sticky room headers
              // at the top, and clipped away at the bottom. Only the
              // ones in the middle can be centred.
              className={`narrow tabular absolute right-2 text-[0.6875rem] text-ink-subtle ${
                m === hours[0]
                  ? ""
                  : m === hours[hours.length - 1]
                    ? "-translate-y-full"
                    : "-translate-y-1/2"
              }`}
              style={{ top: `calc(${m - open} / 60 * var(--hour-height))` }}
            >
              {hourLabel(m)}
            </span>
          ))}

          {/* The now-marker's LABEL lives on the axis, which is the only
              place it can be emphatic without landing on top of
              somebody's session title. See the line below. */}
          {nowMins !== null && nowMins >= open && nowMins <= close ? (
            <span
              className="absolute right-0 z-40 flex -translate-y-1/2 items-center gap-1"
              style={{ top: `calc(${nowMins - open} / 60 * var(--hour-height))` }}
            >
              <span className="narrow bg-live-deep px-1.5 py-0.5 text-[0.6875rem] font-semibold text-ink-inverse">
                Now
              </span>
              <span className="now-dot block h-2 w-2 rounded-full bg-live-deep" />
            </span>
          ) : null}
        </div>

        {/* The now-line, drawn BEFORE the room columns on purpose.
            Painted after them it crossed every live block at 11:20 and
            read as four struck-through titles — a line through a word
            means something else entirely. Underneath, it shows in the
            gaps and between the columns, and the sessions that are
            actually running say so themselves with the live outline. */}
        {nowMins !== null && nowMins >= open && nowMins <= close ? (
          <div
            aria-hidden="true"
            className="pointer-events-none relative"
            style={{
              gridRow: 2,
              gridColumn: `2 / span ${visibleRooms.length}`,
              height: gridHeight,
            }}
          >
            <span
              className="absolute inset-x-0 block h-0.5 bg-live-deep"
              style={{ top: `calc(${nowMins - open} / 60 * var(--hour-height))` }}
            />
          </div>
        ) : null}

        {/* One column per room, each its own positioning context. */}
        {visibleRooms.map((room, i) => {
          const placed = onDay
            .filter((s) => s.roomId === room.id)
            .map((s) => place(s, open));
          return (
            <div
              key={room.id}
              className="room-column relative border-l border-line"
              style={{ gridRow: 2, gridColumn: i + 2, height: gridHeight }}
            >
              {hours.map((m) => (
                <span
                  key={m}
                  aria-hidden="true"
                  className="absolute inset-x-0 h-px bg-line"
                  style={{ top: `calc(${m - open} / 60 * var(--hour-height))` }}
                />
              ))}

              {placed.map((p) => (
                <SessionBlock
                  key={p.session.id}
                  placed={p}
                  room={room}
                  nowMins={nowMins}
                />
              ))}

              {/* Only rendered when :has() finds no .slot in this column. */}
              <span className="room-empty narrow absolute inset-x-0 top-8 text-center text-[0.75rem] text-ink-subtle">
                Nothing in {room.name} today
              </span>
            </div>
          );
        })}

        {/* Plenaries and the now-marker sit above the columns, spanning
            all of them. A plenary is not "in a room" — it is the only
            thing happening — so it has no column to sit in. */}
        <div
          className="pointer-events-none relative"
          style={{
            gridColumn: `2 / span ${visibleRooms.length}`,
            gridRow: 2,
            height: gridHeight,
          }}
        >
          {plenaries.map((p) => (
            <div key={p.session.id} className="slot pointer-events-auto" style={cssVars(p)}>
              <PlenaryBlock placed={p} nowMins={nowMins} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The two numbers the CSS needs, and nothing else. */
function cssVars(p: Placed): React.CSSProperties {
  return {
    "--from": p.fromMinutes,
    "--mins": p.minutes,
  } as React.CSSProperties;
}

function SessionBlock({
  placed,
  room,
  nowMins,
}: {
  placed: Placed;
  room: Room;
  nowMins: number | null;
}) {
  const s = placed.session;
  const phase = phaseOf(placed, nowMins);
  const live = phase === "live";
  const done = phase === "past";
  const cancelled = Boolean(s.cancelled);

  return (
    <div className="slot block-shell p-0.5" style={cssVars(placed)}>
      <div
        className={`relative flex h-full flex-col overflow-hidden border-l-[3px] px-2 py-1.5 transition-colors ${
          cancelled
            ? "border-dashed border-line-strong bg-canvas"
            : done
              ? "opacity-55"
              : ""
        } ${live ? "outline outline-2 outline-live-deep" : ""}`}
        style={{
          borderLeftColor: cancelled ? undefined : room.tone,
          background: cancelled ? undefined : room.toneSoft,
        }}
      >
        {/* The plan toggle rides on the time row rather than sitting
            under the block. A forty-five minute block is 102px tall,
            and a control on its own line costs a line the title needs —
            which is how the first version came to clip its own buttons
            on the most common session length on the programme. */}
        <div className="flex items-start gap-1.5">
          <p className="narrow tabular flex min-w-0 flex-wrap items-center gap-1 text-[0.6875rem] text-ink-muted">
            <span>{rangeLabel(placed.startMins, placed.endMins)}</span>
            {live ? (
              <span className="bg-live px-1 font-semibold text-on-live">
                Live
              </span>
            ) : null}
            {s.soldOut ? (
              <span className="border border-line-strong px-1">Full</span>
            ) : null}
          </p>
          {isChoosable(s) ? (
            <span className="relative z-10 ml-auto">
              <PlanToggle sessionId={s.id} title={s.title} />
            </span>
          ) : null}
        </div>

        <h3 className="wide mt-1 text-[0.875rem] font-semibold leading-[1.15]">
          <Link
            href={`/sessions/${s.slug}`}
            className={`focus-ring line-clamp-4 after:absolute after:inset-0 ${
              cancelled ? "line-through decoration-clash decoration-2" : ""
            }`}
          >
            {s.title}
          </Link>
        </h3>

        {/* Height decides whether there is room for a name; WIDTH decides
            whether a name would survive being shown. Both are questions
            about this block's own box rather than the window's — filter
            to two rooms and every block doubles in width at the same
            viewport size — which is exactly what container queries are
            for and what a media query cannot express. */}
        {names(s) ? (
          <p className="block-detail narrow mt-1 truncate text-[0.75rem] text-ink-muted">
            {names(s)}
          </p>
        ) : null}
        <p className="block-wide-only narrow tabular mt-0.5 text-[0.6875rem] text-ink-subtle">
          {durationLabel(placed.minutes)} · {s.kind}
        </p>
      </div>
    </div>
  );
}

function PlenaryBlock({
  placed,
  nowMins,
}: {
  placed: Placed;
  nowMins: number | null;
}) {
  const s = placed.session;
  const isBreak = s.kind === "break";
  const done = phaseOf(placed, nowMins) === "past";

  if (isBreak) {
    return (
      <div
        className={`flex h-full items-center gap-3 border-y border-dotted border-line-strong bg-sunk px-3 ${
          done ? "opacity-55" : ""
        }`}
      >
        <span className="narrow tabular text-[0.6875rem] text-ink-subtle">
          {rangeLabel(placed.startMins, placed.endMins)}
        </span>
        <span className="narrow text-[0.8125rem] text-ink-muted">{s.title}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full flex-col justify-center border border-ink bg-ink px-4 py-2 text-ink-inverse ${
        done ? "opacity-55" : ""
      }`}
    >
      <p className="narrow tabular text-[0.6875rem] text-ink-inverse/60">
        {rangeLabel(placed.startMins, placed.endMins)} · everyone, all rooms
      </p>
      <h3 className="wide text-[1.0625rem] font-semibold leading-tight">
        <Link
          href={`/sessions/${s.slug}`}
          className="focus-ring after:absolute after:inset-0"
        >
          {s.title}
        </Link>
      </h3>
      {names(s) ? (
        <p className="narrow text-[0.8125rem] text-ink-inverse/70">{names(s)}</p>
      ) : null}
    </div>
  );
}
