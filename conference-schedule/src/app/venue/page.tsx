import type { Metadata } from "next";
import { Plate } from "@/components/plate";
import { access, spaces, travel, venue } from "@/content/venue";
import { rooms } from "@/content/site";
import ironhouseFloor from "@/photos/ironhouse-floor.jpg";
import craneRail from "@/photos/crane-rail.jpg";
import gearTrain from "@/photos/gear-train.jpg";
import yardTables from "@/photos/yard-tables.jpg";

export const metadata: Metadata = {
  title: "Venue",
  description:
    "The Ironhouse, Pittsburgh — a rolling mill that stopped rolling in 1981, and how to get to it.",
};

export default function VenuePage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <header className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h1 className="sign text-display">{venue.name}</h1>
          {venue.about.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="prose-block mt-5 text-[1rem] leading-relaxed text-ink-muted"
            >
              {para}
            </p>
          ))}
        </div>
        <address className="not-italic">
          <p className="narrow text-[0.75rem] uppercase tracking-wide text-ink-subtle">
            Address
          </p>
          {venue.address.map((line) => (
            <p key={line} className="wide text-[1.25rem] leading-snug">
              {line}
            </p>
          ))}
          <p className="mt-6 text-[0.875rem] text-ink-subtle">
            The building, the address and the conference are invented, so
            do not set off.
          </p>
        </address>
      </header>

      {/* The photograph the page has been describing. It goes directly
          under the paragraph claiming every intervention is visible and
          datable, because that is a claim a picture can settle and prose
          cannot — new floor, new services overhead, old posts and one old
          machine left exactly where they were. */}
      <Plate
        className="mt-12"
        src={ironhouseFloor}
        aspect="16 / 9"
        priority
        sizes="(min-width: 1280px) 1200px, 100vw"
        alt="A mill floor after conversion: a new levelled concrete slab and new services run overhead, with the original heavy timber posts still standing and one old machine left in place on its brick plinth, rails still set into the floor in front of it."
        caption="Nothing is hidden behind a lining. The floor is from 2000, the posts are original, and the machine was left where it stood."
      />

      <section className="mt-16">
        <h2 className="sign text-title">The four rooms</h2>
        <ul className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((space) => {
            const room = rooms.find((r) => r.name === space.name);
            return (
              <li key={space.name} className="bg-canvas p-5">
                <span
                  className="mb-3 block h-1.5 w-full"
                  style={{ background: room?.tone ?? "var(--color-ink)" }}
                  aria-hidden="true"
                />
                <h3 className="wide text-[1.125rem] font-semibold">
                  {space.name}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {space.detail}
                </p>
                <ul className="narrow mt-4 space-y-1 text-[0.8125rem] text-ink-subtle">
                  <li>{space.step ? "Lift access" : "Step-free"}</li>
                  <li>{space.loop ? "Hearing loop" : "Live captions only"}</li>
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Three rooms, in the order the day uses them. Each caption says
          something the room list above does not — the imagery is doing
          its own work rather than illustrating the text beside it. */}
      <section className="mt-16">
        <h2 className="sign text-title">What is still in the building</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Plate
            src={craneRail}
            aspect="4 / 3"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt="A very large empty hall photographed from floor level, rows of columns receding to a distant doorway, with an overhead travelling crane spanning the width of the roof."
            caption="The Foundry. The crane rail is still live; the seating goes underneath it."
          />
          <Plate
            src={gearTrain}
            aspect="4 / 3"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt="The gear train of an old machine in close-up: four cast toothed wheels of different sizes driven off a hand crank and a stepped pulley, the teeth worn bright where they mesh."
            caption="One of four machines left in the building, all of them still turning over."
          />
          <Plate
            src={yardTables}
            aspect="4 / 3"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt="Trestle tables with bench seats set out in rows on a bare concrete floor inside a raw industrial space, with a roller shutter at the far end and nobody at them yet."
            caption="The Yard, laid for lunch. It is heated, which people never believe until they are in it."
          />
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 className="sign text-title">Access</h2>
          <ul className="mt-6 space-y-4">
            {access.map((line) => (
              <li
                key={line.slice(0, 40)}
                className="prose-block border-l-[3px] border-live-deep pl-4 text-[0.9375rem] leading-relaxed"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="sign text-title">Getting there</h2>
          <dl className="mt-6 border border-ink bg-surface">
            {travel.map((t) => (
              <div
                key={t.head}
                className="grid gap-1 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[7rem_1fr] sm:gap-4"
              >
                <dt className="narrow text-[0.8125rem] uppercase tracking-wide text-ink-subtle">
                  {t.head}
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed">{t.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
