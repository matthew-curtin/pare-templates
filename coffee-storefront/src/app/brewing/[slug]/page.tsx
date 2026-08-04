import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrewTimer } from "@/components/brew-timer";
import { Container } from "@/components/container";
import { brewGuides, getBrewGuide } from "@/content/brewing";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return brewGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getBrewGuide(slug);
  if (!guide) return {};
  return { title: guide.name, description: guide.summary };
}

export default async function BrewGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getBrewGuide(slug);
  if (!guide) notFound();

  const facts = [
    { term: "Ratio", value: guide.ratio },
    { term: "Grind", value: guide.grindLabel },
    { term: "Water", value: guide.waterLabel },
    { term: "Total", value: guide.totalLabel },
  ];

  return (
    <Container width="wide" className="py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-subtle">
        <Link href="/brewing" className="hover:text-accent">
          Brewing
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{guide.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <h1 className="font-display text-4xl leading-tight font-bold text-balance sm:text-5xl">
            {guide.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">
            {guide.summary}
          </p>

          <dl className="mt-8 grid gap-4 border-y border-line py-5 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="eyebrow text-ink-subtle">{fact.term}</dt>
                <dd className="mt-1.5 text-sm font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">
              Start the timer and follow along
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Each step lights up when the clock reaches it. Pausing keeps your
              place.
            </p>
            <div className="mt-6">
              <BrewTimer
                steps={guide.steps}
                totalSeconds={guide.totalSeconds}
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-32">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
            <Image
              src={guide.image}
              alt={guide.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 22rem, 92vw"
              className="object-cover"
            />
          </div>

          <div className="mt-6 rounded-xl border border-line p-5">
            <p className="eyebrow text-ink-subtle">What you need</p>
            <ul className="mt-3 space-y-2">
              {guide.kit.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 text-sm leading-relaxed text-ink-muted"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-[0.55em] left-0 h-1.5 w-1.5 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl bg-surface p-5">
            <p className="font-semibold">Need something to brew?</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              We grind to order — pick {guide.name} at the checkout and we will
              set it correctly.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
            >
              Shop the coffee
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
