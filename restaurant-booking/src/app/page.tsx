import Image from "next/image";
import Link from "next/link";
import { menus } from "@/content/menus";
import { openingHours, site } from "@/content/site";
import { suppliers } from "@/content/about";

/**
 * Three dishes off the current dinner menu, to show what "on" means.
 *
 * Picked by NAME rather than by position, because each one is paired
 * with a specific photograph below. Taking a slice would silently
 * re-pair the pictures with different dishes the first time anyone
 * reorders the menu — and a caption that no longer matches its
 * photograph is the kind of error nothing in the build will catch.
 */
const FEATURED = [
  "Chicken over the coals, chanterelles",
  "Whole red mullet, brown shrimp, capers",
  "Aged Longhorn sirloin, bone marrow",
];

const fromTheFire = menus[0].sections.find(
  (section) => section.name === "From the fire",
)!;

export default function HomePage() {
  const tonight = FEATURED.map(
    (name) => fromTheFire.dishes.find((dish) => dish.name === name)!,
  );

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/room.jpg"
            alt="Wooden booths against an old brick wall, lit low by two pendant lamps."
            fill
            priority
            sizes="100vw"
            className="photo-warm object-cover"
          />
          {/* The photograph is the background, so the text over it needs a
              scrim rather than luck. Two stops: a flat wash for overall
              legibility and a bottom gradient where the copy sits. */}
          <div className="absolute inset-0 bg-canvas/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[32rem] max-w-6xl flex-col justify-end px-4 py-16 sm:min-h-[38rem] sm:px-6 sm:py-20">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">
            {site.address.city} · Est. {site.established}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl">
            One fire, a short menu, and whatever the growers have.
          </h1>
          {/*
            Deliberately NOT `site.description`. That string is written
            for the meta tag, where it has to stand alone, and it repeats
            the headline almost word for word when the two sit together.
            The hero line says the things you want before booking.
          */}
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            Thirty-four covers on {site.address.line1}. Lunch Wednesday to
            Sunday, dinner Wednesday to Saturday.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/book"
              className="focus-ring rounded-full bg-accent px-7 py-3.5 font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              Book a table
            </Link>
            <Link
              href="/menu"
              className="focus-ring rounded-full border border-line-strong px-7 py-3.5 text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink"
            >
              This week&rsquo;s menu
            </Link>
          </div>
        </div>
      </section>

      {/* The fire */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-surface">
            <Image
              src="/images/fire.jpg"
              alt="Logs burning down to grey embers beneath the bars of the grill."
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="photo-warm object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              Everything goes over the same fire
            </h2>
            <div className="mt-4 space-y-4 text-ink-muted">
              <p>
                Oak and ash from a coppice twelve miles away, seasoned two
                years, lit at eleven every morning. There is no gas in the
                building, which was an accident of the lease and turned out
                to be the making of the place.
              </p>
              <p>
                One fire means one menu, and a short menu means we can buy
                properly — whole animals, whole boxes, from six people we
                know by name.
              </p>
            </div>
            <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {suppliers.slice(0, 4).map((supplier) => (
                <li key={supplier.name} className="flex justify-between gap-3">
                  <span className="text-ink">{supplier.name}</span>
                  <span className="shrink-0 text-ink-subtle">
                    {supplier.where.split(",")[1]?.trim()}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="focus-ring mt-6 inline-block rounded-sm text-sm text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              Where it all comes from
            </Link>
          </div>
        </div>
      </section>

      {/* On the menu this week */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              On this week
            </h2>
            <Link
              href="/menu"
              className="focus-ring rounded-sm text-sm text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              The whole menu
            </Link>
          </div>

          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {tonight.map((dish, index) => (
              <li key={dish.name}>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-raised">
                  <Image
                    src={`/images/dish-${index + 1}.jpg`}
                    alt={DISH_ALT[index]}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="photo-warm object-cover"
                  />
                </div>
                <h3 className="mt-4 text-lg">{dish.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {dish.description}
                </p>
                <p className="tabular mt-2 text-sm text-ink-subtle">
                  £{dish.price}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The yard / private dining */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              The yard, and the whole room
            </h2>
            <p className="mt-4 text-ink-muted">
              Twelve at the long table beside the fire, forty standing in the
              covered yard from May to September, or all thirty-four covers
              and both of us. You eat what the rest of the room is eating,
              because there is only one fire.
            </p>
            <Link
              href="/private-dining"
              className="focus-ring mt-6 inline-block rounded-full border border-line-strong px-6 py-3 text-sm text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink"
            >
              Private dining
            </Link>
          </div>
          <div className="relative order-1 aspect-4/3 w-full overflow-hidden rounded-lg bg-surface md:order-2">
            <Image
              src="/images/yard.jpg"
              alt="A wooden table in the yard at dusk, under strings of small warm lights and climbing greenery."
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="photo-warm object-cover"
            />
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              Come and find us
            </h2>
            <p className="mt-4 max-w-prose text-ink-muted">
              {site.address.line1}, {site.address.line2}. Eight minutes from
              the fountains, up Christmas Steps and left at the top. The yard
              is easy to walk past — look for the door with the fire outside
              it.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="focus-ring rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
              >
                Book a table
              </Link>
              <Link
                href="/visit"
                className="focus-ring rounded-full border border-line-strong px-6 py-3 text-sm text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink"
              >
                Getting here
              </Link>
            </div>
          </div>

          <dl className="min-w-64 space-y-1 text-sm">
            {openingHours.map((day) => (
              <div key={day.day} className="flex justify-between gap-6">
                <dt className="text-ink-muted">{day.day}</dt>
                <dd className="tabular text-right text-ink-subtle">
                  {day.lunch === null && day.dinner === null
                    ? "Closed"
                    : `${day.lunch ?? "—"}${day.dinner ? ` · ${day.dinner}` : ""}`}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

/**
 * Alt text for the three dish photographs, written against the actual
 * pictures rather than generated from the dish names — the point of alt
 * text is to describe what is in the frame.
 */
const DISH_ALT = [
  "Whole chickens turning on a spit above the coals, skin gone deep gold.",
  "Whole red mullet and slices of lemon smoking over the bars of the grill.",
  "A rested steak on slate with charred vegetables and dill.",
];
