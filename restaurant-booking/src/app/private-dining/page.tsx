import type { Metadata } from "next";
import Image from "next/image";
import { EnquiryForm } from "@/components/enquiry-form";
import { privateIntro, process, spaces } from "@/content/private-dining";

export const metadata: Metadata = {
  title: "Private dining",
  description:
    "The long table, the yard, or the whole restaurant. You eat what the rest of the room is eating, because there is only one fire.",
};

export default function PrivateDiningPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          Private dining
        </h1>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-muted">
          {privateIntro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <section className="mt-14">
        <h2 className="sr-only">The spaces</h2>
        <ul className="grid gap-8 md:grid-cols-3">
          {spaces.map((space, index) => (
            <li
              key={space.name}
              className="min-w-0 overflow-hidden rounded-lg border border-line bg-surface"
            >
              <div className="relative aspect-4/3 w-full bg-raised">
                <Image
                  src={SPACE_IMAGES[index].src}
                  alt={SPACE_IMAGES[index].alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="photo-warm object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl">{space.name}</h3>
                <p className="tabular mt-1 text-sm text-accent">
                  {space.seated} seated
                  {space.standing ? ` · ${space.standing} standing` : ""}
                </p>
                <p className="mt-3 text-sm text-ink-muted">{space.detail}</p>
                <p className="mt-3 text-sm text-ink-subtle">
                  {space.minimumSpend
                    ? `Minimum spend £${space.minimumSpend.toLocaleString("en-GB")}`
                    : "No minimum spend"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">How it works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((entry, index) => (
            <li key={entry.step} className="border-t border-line pt-4">
              <span className="tabular text-sm text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-medium">{entry.step}</h3>
              <p className="mt-1 text-sm text-ink-muted">{entry.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 max-w-2xl">
        <EnquiryForm />
      </section>
    </div>
  );
}

/**
 * Written against the actual photographs rather than generated from the
 * space names — the point of alt text is to describe the frame.
 */
const SPACE_IMAGES = [
  {
    src: "/images/long-table.jpg",
    alt: "A long timber table laid with folded white napkins down both sides, against a bare plaster wall.",
  },
  {
    src: "/images/yard.jpg",
    alt: "A wooden table in the yard at dusk, under strings of small warm lights and climbing greenery.",
  },
  {
    src: "/images/room-wide.jpg",
    alt: "The dining room at night, chandeliers and small pendant lamps over a long bar counter.",
  },
];
