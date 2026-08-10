import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { access } from "@/content/conditions";
import { legs, shelters } from "@/content/route";
import { feet } from "@/lib/format";

export const metadata: Metadata = {
  title: "Getting there",
  description:
    "Trailheads, the shuttle, and where you can and cannot get off the Sable Traverse.",
};

const noEscape = legs.filter((l) => l.escape === null);
const trailheads = shelters.filter((s) => s.kind === "trailhead");

export default function GettingTherePage() {
  return (
    <Shell rail="plain" railLabel="Elevation profile of the whole traverse.">
      <div className="px-4 py-12 sm:px-8">
        <h1 className="head text-display">Getting there</h1>
        <p className="prose-block mt-4 text-lede leading-relaxed text-ink-muted">
          Both ends are on a road, neither road goes anywhere, and there
          is one shuttle between them. Most of the planning people do for
          this route is actually planning for the two hours at either end
          of it.
        </p>

        <section className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {trailheads.map((t, i) => (
            <div key={t.id} className="bg-surface p-5">
              <p className="datum text-[0.75rem] uppercase text-ink-subtle">
                {i === 0 ? "North end" : "South end"}
              </p>
              <h2 className="head mt-2 text-title">{t.name}</h2>
              <p className="datum mt-1 text-[0.8125rem] text-ink-subtle">
                {feet(t.elevation)}
              </p>
              <p className="prose-block mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.note}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="head text-title">Practicalities</h2>
          <dl className="mt-6 border border-line bg-surface">
            {access.map((a) => (
              <div
                key={a.head}
                className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="datum text-[0.8125rem] uppercase text-ink-subtle">
                  {a.head}
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-ink-muted">
                  {a.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* The honest bit. Four legs have no way off, and a getting-there
            page that only covers getting there is telling half of it. */}
        <section className="mt-16">
          <h2 className="head text-title">Where you cannot get off</h2>
          <p className="prose-block mt-4 text-[1rem] leading-relaxed text-ink-muted">
            {noEscape.length} of the {legs.length} legs have no escape
            route at all. On those, the nearest road is one of the two
            shelters at either end of the leg you are on, and turning
            round is often the faster of the two.
          </p>
          <ul className="mt-6 space-y-px bg-line">
            {noEscape.map((leg) => (
              <li key={leg.id} className="bg-surface p-4">
                <Link
                  href={`/stages/${leg.slug}`}
                  className="focus-ring flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
                >
                  <span className="text-[1rem] hover:text-water">{leg.name}</span>
                  <span className="datum text-[0.8125rem] text-warn">
                    no escape route
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
