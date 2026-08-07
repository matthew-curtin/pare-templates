import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { people, story, suppliers } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Coppice started as a fire in a yard behind a hardware shop. It was supposed to run for a summer.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          It was supposed to run for a summer
        </h1>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-muted">
          {story.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="relative mt-12 aspect-16/9 w-full overflow-hidden rounded-lg bg-surface">
        <Image
          src="/images/produce.jpg"
          alt="A wooden crate of tomatoes, peppers, chillies and aubergines, picked and set down on the soil."
          fill
          sizes="(min-width: 1024px) 72rem, 100vw"
          className="photo-warm object-cover"
        />
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Who is here</h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2">
          {people.map((person) => (
            <li key={person.name} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-raised text-sm font-medium text-ink-muted ring-1 ring-line-strong"
              >
                {person.initials}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg leading-tight">{person.name}</h3>
                <p className="text-sm text-accent">{person.role}</p>
                <p className="mt-1.5 text-sm text-ink-muted">{person.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Where it comes from</h2>
        <p className="mt-3 max-w-prose text-ink-muted">
          Six suppliers, none of them far. The distances are the point: if a
          thing has to travel three hundred miles to reach a fire in Bristol,
          we would rather cook something else.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-lg border-collapse text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-ink-subtle">
              <tr>
                <th scope="col" className="pb-3 font-medium">
                  Supplier
                </th>
                <th scope="col" className="pb-3 font-medium">
                  What
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Where
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.name} className="border-t border-line">
                  <td className="py-3 pr-6">{supplier.name}</td>
                  <td className="py-3 pr-6 text-ink-muted">{supplier.what}</td>
                  <td className="py-3 text-ink-subtle">{supplier.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Link
        href="/book"
        className="focus-ring mt-14 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
      >
        Book a table
      </Link>
    </div>
  );
}
