import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { brewGuides } from "@/content/brewing";

export const metadata: Metadata = {
  title: "Brewing",
  description:
    "Three recipes with a timer that runs — V60, cafetière and AeroPress.",
};

export default function BrewingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Brewing"
        title="Three recipes we actually use"
        description="A ratio, a grind size, and steps that light up as the clock passes them. No videos, no theory, no talk of extraction yields."
      />

      <Container width="wide" className="py-12 sm:py-16">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {brewGuides.map((guide) => (
            <article key={guide.slug} className="group flex flex-col">
              <Link
                href={`/brewing/${guide.slug}`}
                className="product-media relative mb-4 block aspect-[4/3] overflow-hidden rounded-lg bg-surface"
              >
                <Image
                  src={guide.image}
                  alt={guide.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </Link>
              <p className="eyebrow text-ink-subtle">{guide.totalLabel}</p>
              <h2 className="mt-1.5 font-display text-xl font-bold">
                <Link
                  href={`/brewing/${guide.slug}`}
                  className="hover:text-accent"
                >
                  {guide.name}
                </Link>
              </h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted text-pretty">
                {guide.summary}
              </p>
              <p className="mt-3 text-sm text-ink-subtle">{guide.ratio}</p>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
