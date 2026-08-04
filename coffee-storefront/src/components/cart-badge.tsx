"use client";

import Link from "next/link";
import { useCart } from "@/lib/use-cart";

/**
 * The basket link in the header.
 *
 * The count is hidden until `hydrated`, because the cart lives in
 * localStorage and the server has no way to know what is in it — so
 * the first render is always zero. Showing that zero and then
 * correcting it a frame later reads as a bug; showing nothing until we
 * know reads as loading.
 */
export function CartBadge() {
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h2l1.6 8.2a1 1 0 0 0 1 .8h5.6a1 1 0 0 0 1-.8L14.5 6H5" />
        <circle cx="6.5" cy="14" r="0.9" />
        <circle cx="12.5" cy="14" r="0.9" />
      </svg>
      <span>Basket</span>
      {hydrated && count > 0 && (
        <span className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-ink-inverse">
          {count}
        </span>
      )}
      <span className="sr-only">
        {hydrated ? `${count} items in basket` : "Loading basket"}
      </span>
    </Link>
  );
}
