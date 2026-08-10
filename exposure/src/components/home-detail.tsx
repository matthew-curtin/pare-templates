"use client";

import { useState } from "react";
import Link from "next/link";
import type { HomeView } from "@/lib/view";
import type { SeasonKey } from "@/content/site";
import { states } from "@/content/site";
import { Shell } from "./shell";
import { Plan } from "./plan";
import { Dial } from "./dial";
import { StripKey } from "./strip";
import { RoomCard } from "./room-card";
import { SeasonSwitch } from "./season-switch";
import { Stat } from "./stat";
import { photos } from "@/photos";
import { clock, daysAgo, duration, hoursShort, money, sqft } from "@/lib/format";

type DayFacts = {
  doy: number;
  sunrise: number;
  sunset: number;
  hours: number;
  noon: number;
  arc: { from: number; to: number };
};

/**
 * The split, doing the thing the split is for.
 *
 * The plan is pinned and the rooms scroll past it. Clicking a room in
 * the drawing selects it and brings its card up; clicking a card's name
 * selects it in the drawing and switches floor if it is on the other
 * one. Neither half is a table of contents for the other — they are the
 * same information at two scales, which is the whole argument for
 * spending half the window on a picture.
 */
export function HomeDetail({
  view,
  facts,
}: {
  view: HomeView;
  facts: Record<SeasonKey, DayFacts>;
}) {
  const [season, setSeason] = useState<SeasonKey>("dec");
  const [floorId, setFloorId] = useState(view.floors[0].id);
  const [selected, setSelected] = useState<string | null>(view.mainRoomId);

  const floor = view.floors.find((f) => f.id === floorId) ?? view.floors[0];
  const day = facts[season];
  const rooms = view.floors.flatMap((f) => f.rooms);
  const selectedRoom = rooms.find((r) => r.id === selected) ?? null;

  const select = (id: string) => {
    setSelected(id);
    const room = rooms.find((r) => r.id === id);
    if (room && room.floorId !== floorId) setFloorId(room.floorId);
    if (typeof document !== "undefined") {
      document
        .getElementById(`room-${id}`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  const pane = (
    <div style={{ viewTransitionName: "season" }}>
        <SeasonSwitch value={season} onChange={setSeason} />

        {view.floors.length > 1 && (
          <div className="mt-5 flex gap-px border border-line bg-line" role="group" aria-label="Floor">
            {view.floors.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFloorId(f.id)}
                aria-pressed={f.id === floorId}
                className={`focus-ring datum flex-1 px-2 py-2 text-[0.75rem] transition-colors ${
                  f.id === floorId
                    ? "bg-ink text-canvas"
                    : "bg-surface text-ink-muted hover:bg-canvas"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5">
          <Plan
            floor={floor}
            northOffset={view.northOffset}
            seasonKey={season}
            dayLength={day.hours}
            selected={selected}
            onSelect={select}
          />
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto] items-start gap-5">
          <div>
            <p className="datum text-[0.6875rem] uppercase text-ink-subtle">
              The day
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
              Sun up {clock(day.sunrise)}, down {clock(day.sunset)} —{" "}
              {duration(day.hours)} of daylight. Due south at{" "}
              {clock(day.noon)}, which is not noon.
            </p>
            {selectedRoom && !selectedRoom.interior && (
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink">
                {selectedRoom.name}: {selectedRoom.compass}, and{" "}
                {hoursShort(selectedRoom.seasons[season].hours)} of it.
              </p>
            )}
          </div>
          <div className="w-24">
            <Dial
              arc={day.arc}
              bearing={selectedRoom && !selectedRoom.interior ? selectedRoom.bearing : undefined}
              label={
                selectedRoom && !selectedRoom.interior
                  ? `${selectedRoom.name} · ${selectedRoom.compass}`
                  : undefined
              }
            />
          </div>
        </div>

      <div className="mt-6 border-t border-line pt-5">
        <StripKey states={states} />
      </div>
    </div>
  );

  return (
    <Shell pane={pane}>
      <div>
        <header className="border-b border-line px-4 py-10 sm:px-8">
          <p className="datum text-[0.75rem] uppercase text-ink-subtle">
            {view.kind} · listed {daysAgo(view.listedDaysAgo)}
          </p>
          <h1 className="head head-display mt-3 max-w-[16ch] text-display">
            {view.address}
          </h1>
          <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
            {view.blurb}
          </p>

          <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
            <Stat value={money(view.price)} label="asking" />
            <Stat
              value={hoursShort(view.winterHours)}
              label="direct sun, 21 Dec"
              tone="sun"
            />
            <Stat value={sqft(view.area)} label="floor area" />
            <Stat value={`${view.beds} / ${view.baths}`} label="beds / baths" />
          </div>

          <div className="mt-8">
            <Link
              href={`/viewings?home=${view.slug}`}
              className="focus-ring inline-block bg-ink px-5 py-2.5 text-[0.9375rem] text-canvas transition-opacity hover:opacity-85"
            >
              Book a viewing at the honest hour
            </Link>
          </div>
        </header>

        <section className="border-b border-line bg-surface px-4 py-9 sm:px-8">
          <h2 className="datum text-[0.75rem] uppercase text-ink-subtle">
            What we would tell you if you asked
          </h2>
          <p className="prose-block mt-4 text-[1rem] leading-relaxed">
            {view.candid}
          </p>
        </section>

        <section className="border-b border-line px-4 py-9 sm:px-8">
          <h2 className="head text-title">
            {view.floors.flatMap((f) => f.rooms).filter((r) => !r.interior).length} rooms,
            hour by hour
          </h2>
          <p className="prose-block mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            Every strip below is drawn from four in the morning to ten at
            night on the same scale, so the three days can be compared by
            looking rather than by arithmetic. Click a room in the plan to
            bring it up here.
          </p>
        </section>

        <div className="room-list divide-y divide-line">
          {view.floors.map((f) => (
            <div key={f.id}>
              <h3 className="datum border-b border-line bg-canvas px-4 py-2.5 text-[0.75rem] uppercase text-ink-subtle sm:px-8">
                {f.name}
              </h3>
              {f.rooms.map((r) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  seasonKey={season}
                  photos={photos}
                  selected={selected === r.id}
                  onSelect={r.interior ? undefined : () => select(r.id)}
                />
              ))}
            </div>
          ))}
        </div>

        <section className="border-t border-line px-4 py-9 sm:px-8">
          <h2 className="head text-title">What needs doing</h2>
          <ul className="prose-block mt-4 space-y-3">
            {view.works.map((w) => (
              <li key={w} className="text-[0.9375rem] leading-relaxed text-ink-muted">
                {w}
              </li>
            ))}
          </ul>
          <p className="datum mt-6 text-[0.75rem] uppercase text-ink-subtle">
            Built {view.built} · {view.darkRoomCount} of {view.habitableCount}{" "}
            rooms take no direct sun on 21 December
          </p>
        </section>
      </div>
    </Shell>
  );
}
