"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/use-cart";
import { site } from "@/content/site";
import { formatPence } from "@/lib/money";

export function CartView() {
  const { resolved, subtotalPence, count, hydrated, setQuantity, remove, clear } =
    useCart();

  // Until localStorage has been read we genuinely do not know what is
  // in the basket, and rendering the empty state first would flash
  // "your basket is empty" at someone who has six bags in it.
  if (!hydrated) {
    return (
      <div className="py-20 text-center text-ink-subtle">Loading your basket…</div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
        <p className="font-display text-2xl font-bold">Nothing in the basket</p>
        <p className="mx-auto mt-2 max-w-sm text-ink-muted">
          Six coffees, roasted the night before we post them. The House blend is
          the one to start with if you are not sure.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
        >
          Browse the coffee
        </Link>
      </div>
    );
  }

  const freeShipping = subtotalPence >= site.freeShippingOverPence;
  const shipping = freeShipping ? 0 : site.shippingPence;
  const remaining = site.freeShippingOverPence - subtotalPence;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {resolved.map((item) => (
            <li key={item.line.id} className="flex gap-4 py-5">
              <Link
                href={`/shop/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="6rem"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="font-display text-lg font-bold">
                    <Link href={`/shop/${item.slug}`} className="hover:text-accent">
                      {item.name}
                    </Link>
                  </h2>
                  <p className="tnum font-semibold">
                    {formatPence(item.totalPence)}
                  </p>
                </div>

                <p className="mt-0.5 text-sm text-ink-subtle">
                  {item.sizeLabel} · {item.grindLabel}
                </p>

                <div className="mt-auto flex items-center gap-4 pt-3">
                  <div className="flex items-center rounded-full border border-line-strong">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.line.id, item.line.quantity - 1)
                      }
                      aria-label={`Reduce quantity of ${item.name}`}
                      className="px-3 py-1.5 text-lg leading-none text-ink-muted transition-colors hover:text-accent"
                    >
                      −
                    </button>
                    <span className="tnum w-8 text-center text-sm font-semibold">
                      {item.line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.line.id, item.line.quantity + 1)
                      }
                      aria-label={`Increase quantity of ${item.name}`}
                      className="px-3 py-1.5 text-lg leading-none text-ink-muted transition-colors hover:text-accent"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.line.id)}
                    className="text-sm text-ink-subtle underline transition-colors hover:text-accent"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href="/shop"
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            ← Keep looking
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-ink-subtle underline transition-colors hover:text-accent"
          >
            Empty the basket
          </button>
        </div>
      </div>

      <aside className="rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-32">
        <h2 className="font-display text-lg font-bold">Summary</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">
              Subtotal
              <span className="text-ink-subtle">
                {" "}
                ({count} {count === 1 ? "bag" : "bags"})
              </span>
            </dt>
            <dd className="tnum font-semibold">{formatPence(subtotalPence)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Delivery</dt>
            <dd className="tnum font-semibold">
              {freeShipping ? "Free" : formatPence(shipping)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line-strong pt-3">
            <dt className="font-semibold">Total</dt>
            <dd className="tnum font-display text-xl font-bold">
              {formatPence(subtotalPence + shipping)}
            </dd>
          </div>
        </dl>

        {!freeShipping && (
          <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2.5 text-sm text-accent">
            {formatPence(remaining)} more for free delivery.
          </p>
        )}

        <button
          type="button"
          className="mt-6 w-full rounded-full bg-accent px-6 py-3.5 font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
        >
          Checkout
        </button>
        <p className="mt-3 text-center text-xs text-ink-subtle">
          Nothing here takes a payment — it is a template.
        </p>
      </aside>
    </div>
  );
}
