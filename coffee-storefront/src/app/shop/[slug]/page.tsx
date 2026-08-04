import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { CoffeeCard } from "@/components/coffee-card";
import { Container } from "@/components/container";
import { FlavourProfile } from "@/components/flavour-profile";
import { RoastScale } from "@/components/roast-scale";
import { coffees, getCoffee } from "@/content/coffees";

type Props = { params: Promise<{ slug: string }> };

/** Pre-renders a page for every coffee at build time. */
export function generateStaticParams() {
  return coffees.map((coffee) => ({ slug: coffee.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const coffee = getCoffee(slug);
  if (!coffee) return {};
  return { title: coffee.name, description: coffee.tagline };
}

export default async function CoffeePage({ params }: Props) {
  const { slug } = await params;
  const coffee = getCoffee(slug);
  if (!coffee) notFound();

  const others = coffees.filter((c) => c.slug !== coffee.slug).slice(0, 3);

  const spec: { term: string; value: string }[] = [
    { term: "Origin", value: `${coffee.region}, ${coffee.country}` },
    { term: "Producer", value: coffee.producer },
    { term: "Altitude", value: coffee.altitude },
    { term: "Varietal", value: coffee.varietal },
    { term: "Process", value: coffee.process },
  ];

  return (
    <>
      <Container width="wide" className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-subtle">
          <Link href="/shop" className="hover:text-accent">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{coffee.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface lg:sticky lg:top-32">
            <Image
              src={coffee.image}
              alt={coffee.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 32rem, 92vw"
              className="object-cover"
            />
            {coffee.soldOut && (
              <span className="absolute top-4 left-4 rounded-full bg-inverse px-3 py-1.5 text-sm font-semibold text-ink-inverse">
                Sold out
              </span>
            )}
          </div>

          <div>
            <p className="eyebrow text-ink-subtle">
              {coffee.country}
              {coffee.decaf && " · Decaf"}
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight font-bold text-balance sm:text-5xl">
              {coffee.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
              {coffee.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {coffee.notes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-line-strong px-3 py-1 text-sm"
                >
                  {note}
                </span>
              ))}
            </div>

            <div className="mt-8 border-t border-line pt-8">
              <AddToCart coffee={coffee} />
            </div>

            <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
              <RoastScale roast={coffee.roast} />
              <FlavourProfile flavour={coffee.flavour} />
            </div>

            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow text-ink-subtle">The detail</p>
              <dl className="mt-4 space-y-3">
                {spec.map((row) => (
                  <div
                    key={row.term}
                    className="grid grid-cols-[7rem_1fr] gap-4 text-sm"
                  >
                    <dt className="text-ink-subtle">{row.term}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 space-y-4 border-t border-line pt-8">
              {coffee.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className="leading-relaxed text-ink-muted text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <section className="border-t border-line bg-surface">
        <Container width="wide" className="py-16">
          <h2 className="font-display text-2xl font-bold">Also roasting</h2>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <CoffeeCard key={other.slug} coffee={other} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
