import Image from "next/image";
import Link from "next/link";
import { ROAST_LABEL, fromPence } from "@/content/coffees";
import type { Coffee } from "@/content/types";
import { formatPence } from "@/lib/money";

export function CoffeeCard({
  coffee,
  sizes = "(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw",
}: {
  coffee: Coffee;
  sizes?: string;
}) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/shop/${coffee.slug}`}
        className="product-media relative mb-4 block aspect-square overflow-hidden rounded-lg bg-surface"
      >
        <Image
          src={coffee.image}
          alt={coffee.imageAlt}
          fill
          sizes={sizes}
          className="object-cover"
        />
        {/* Sold-out coffees stay listed rather than being hidden — a
            roastery's stock is seasonal, and hiding it makes the shop
            look thinner than it is. */}
        {coffee.soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-inverse px-2.5 py-1 text-xs font-semibold text-ink-inverse">
            Sold out
          </span>
        )}
        {coffee.decaf && !coffee.soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold">
            Decaf
          </span>
        )}
      </Link>

      <p className="eyebrow text-ink-subtle">
        {coffee.country} · {ROAST_LABEL[coffee.roast]}
      </p>

      <h3 className="mt-1.5 font-display text-xl leading-tight font-bold">
        <Link href={`/shop/${coffee.slug}`} className="hover:text-accent">
          {coffee.name}
        </Link>
      </h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted text-pretty">
        {coffee.tagline}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {coffee.notes.map((note) => (
          <span
            key={note}
            className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-muted"
          >
            {note}
          </span>
        ))}
      </div>

      <p className="tnum mt-4 text-sm font-semibold">
        {coffee.soldOut ? (
          <span className="text-ink-subtle">Back in a fortnight</span>
        ) : (
          <>
            From {formatPence(fromPence(coffee))}
            <span className="font-normal text-ink-subtle"> · 250 g</span>
          </>
        )}
      </p>
    </article>
  );
}
