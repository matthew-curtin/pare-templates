import Image from "next/image";
import Link from "next/link";
import { CoffeeCard } from "@/components/coffee-card";
import { Container } from "@/components/container";
import { brewGuides } from "@/content/brewing";
import { featuredCoffees } from "@/content/coffees";
import { plans } from "@/content/pages";
import { site } from "@/content/site";

export default function HomePage() {
  const featured = featuredCoffees();
  const guide = brewGuides[0];
  const headline = plans.find((plan) => plan.featured) ?? plans[0];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container width="wide" className="py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="eyebrow text-accent">Roasted to order</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.03] font-bold text-balance sm:text-5xl lg:text-6xl">
                Coffee with a roast date, not a best-before.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
                {site.description}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-accent px-6 py-3 font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
                >
                  Shop the coffee
                </Link>
                <Link
                  href="/subscribe"
                  className="rounded-full border border-line-strong px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
                >
                  Subscribe from {headline.discountPercent}% off
                </Link>
              </div>
              <p className="mt-6 text-sm text-ink-subtle">{site.standfirst}</p>
            </div>

            {/* `w-full` is load-bearing. `ml-auto` on a grid item makes
                it shrink-to-fit instead of stretching, and the only
                child here is a `fill` image — which is absolutely
                positioned and so contributes no intrinsic width. The
                box collapses to zero and the photograph vanishes while
                every build check passes. */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface lg:ml-auto lg:max-w-md">
              <Image
                src="/images/coffee/hero.jpg"
                alt="A hand pouring water over a filter cone into a glass carafe"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 92vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Featured coffees */}
      <section>
        <Container width="wide" className="py-16 sm:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl font-bold">On the shelf now</h2>
            <Link
              href="/shop"
              className="text-sm font-semibold text-accent hover:text-accent-hover"
            >
              All six coffees →
            </Link>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((coffee) => (
              <CoffeeCard key={coffee.slug} coffee={coffee} />
            ))}
          </div>
        </Container>
      </section>

      {/* Subscription */}
      <section className="border-y border-line bg-surface">
        <Container width="wide" className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-accent">Subscriptions</p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-bold text-balance sm:text-4xl">
                Let us choose, and stop thinking about it.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-muted text-pretty">
                Tell us how often and how you brew. We pick the bag, roast it the
                night before, and post it — up to{" "}
                {Math.max(...plans.map((p) => p.discountPercent))}% cheaper than
                buying it one bag at a time.
              </p>
              <Link
                href="/subscribe"
                className="mt-7 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
              >
                See the plans
              </Link>
            </div>

            <dl className="grid gap-4 sm:grid-cols-3 lg:justify-self-end">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-xl border bg-canvas p-5 ${
                    plan.featured ? "border-accent" : "border-line"
                  }`}
                >
                  <dt className="font-display text-lg font-bold">
                    {plan.name}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-subtle">
                    {plan.cadence}
                  </dd>
                  <dd className="tnum mt-3 font-display text-2xl font-bold text-accent">
                    −{plan.discountPercent}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Brewing */}
      <section>
        <Container width="wide" className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-surface">
              <Image
                src={guide.image}
                alt={guide.imageAlt}
                fill
                sizes="(min-width: 1024px) 32rem, 92vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow text-accent">Brewing</p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-bold text-balance">
                Three recipes, with a timer that runs.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-muted text-pretty">
                No videos and no theory — a ratio, a grind, and steps that light
                up as the clock passes them. The {guide.name} is where we would
                start.
              </p>
              <Link
                href={`/brewing/${guide.slug}`}
                className="mt-7 inline-block rounded-full border border-line-strong px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                Brew a {guide.name}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
