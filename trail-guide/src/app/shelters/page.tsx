import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { Plate } from "@/components/plate";
import bothy from "@/photos/bothy.jpg";
import { legs, shelters } from "@/content/route";
import { mileposts } from "@/lib/route";
import { feet } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shelters",
  description:
    "The twelve fixed points on the Sable Traverse — ten huts, a platform site and two trailheads — and what water each one has.",
};

const posts = mileposts(legs);

const KIND_LABEL = {
  staffed: "Warden in season",
  open: "Open, unstaffed",
  tent: "Platforms only",
  trailhead: "Trailhead",
} as const;

const WATER_LABEL = {
  reliable: "Reliable",
  seasonal: "Seasonal — can fail in August",
  cistern: "Rainwater tank",
  none: "None",
} as const;

export default function SheltersPage() {
  return (
    <Shell
      rail="scroll"
      railLabel="Elevation profile of the whole traverse, with a tick at every shelter."
    >
      <div className="px-4 py-12 sm:px-8">
        <h1 className="head text-display">Twelve fixed points</h1>
        <p className="prose-block mt-4 text-lede leading-relaxed text-ink-muted">
          Everything about this route follows from the list below. There
          is nowhere else to sleep — not legally, and mostly not
          physically — so the legs are the gaps between these, and a day
          is one or more legs and never part of one.
        </p>

        {/* The photograph is doing the work the opening paragraph cannot:
            "fixed point" is an abstraction until you have seen one. This
            is eight bunks, a barred door and nothing else for nine
            hours, which is the argument for why the route breaks where
            it breaks. */}
        <Plate
          className="mt-10 max-w-2xl"
          src={bothy}
          aspect="4 / 3"
          priority
          sizes="(min-width: 1024px) 42rem, 100vw"
          alt="A small stone shelter with a slate roof and two heavy timber doors, standing alone on a grass slope under a bank of black cloud, with rough grass blurred across the foreground in the wind."
          caption="Cairnwell Hut, an hour before the weather arrived. Eight bunks, a door that bars from the inside, and no water of any kind."
        />

        <ol className="mt-12 space-y-px bg-line">
          {shelters.map((shelter, i) => (
            <li key={shelter.id} className="shelter bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="head text-title">{shelter.name}</h2>
                <p className="datum text-[0.8125rem] text-ink-subtle">
                  mile {posts[i].toFixed(1)} · {feet(shelter.elevation)}
                </p>
              </div>

              <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                <div>
                  <dt className="datum text-[0.6875rem] uppercase text-ink-subtle">
                    Kind
                  </dt>
                  <dd className="mt-0.5 text-[0.9375rem]">
                    {KIND_LABEL[shelter.kind]}
                  </dd>
                </div>
                {/* A trailhead and a platform site both have zero bunks,
                    and printing "Bunks 0" reads as missing data rather
                    than as a fact. The row goes instead. */}
                {shelter.bunks > 0 ? (
                  <div>
                    <dt className="datum text-[0.6875rem] uppercase text-ink-subtle">
                      Bunks
                    </dt>
                    <dd className="figure mt-0.5 text-[1.125rem]">{shelter.bunks}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="datum text-[0.6875rem] uppercase text-ink-subtle">
                    Water
                  </dt>
                  <dd
                    className={`mt-0.5 text-[0.9375rem] ${
                      shelter.water === "none" || shelter.water === "seasonal"
                        ? "text-warn"
                        : shelter.water === "reliable"
                          ? "text-water"
                          : "text-ink"
                    }`}
                  >
                    {WATER_LABEL[shelter.water]}
                  </dd>
                </div>
                <div>
                  <dt className="datum text-[0.6875rem] uppercase text-ink-subtle">
                    Booking
                  </dt>
                  <dd className="mt-0.5 text-[0.9375rem]">
                    {shelter.booking === "required" ? "Ahead" : "First come"}
                  </dd>
                </div>
              </dl>

              <p className="prose-block mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {shelter.note}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Shell>
  );
}
