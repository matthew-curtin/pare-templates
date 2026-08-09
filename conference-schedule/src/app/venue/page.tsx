import type { Metadata } from "next";
import { access, spaces, travel, venue } from "@/content/venue";
import { rooms } from "@/content/site";

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
