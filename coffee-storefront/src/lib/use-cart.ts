"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  addLine,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  removeLine,
  setLineQuantity,
  subscribe,
} from "./cart-store";
import { getCoffee, getSize } from "@/content/coffees";
import { grinds } from "@/content/site";
import type { CartLine } from "@/content/types";

/** A cart line resolved against the catalogue, ready to render. */
export type ResolvedLine = {
  line: CartLine;
  name: string;
  slug: string;
  sizeLabel: string;
  grindLabel: string;
  image: string;
  imageAlt: string;
  /** Price of one bag. */
  unitPence: number;
  /** unitPence × quantity. */
  totalPence: number;
};

export function useCart() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const resolved = useMemo(() => {
    const out: ResolvedLine[] = [];
    for (const line of state.lines) {
      const coffee = getCoffee(line.coffeeSlug);
      const size = coffee && getSize(coffee, line.sizeId);
      if (!coffee || !size) continue;
      out.push({
        line,
        name: coffee.name,
        slug: coffee.slug,
        sizeLabel: size.label,
        // Falls back to the stored id so a grind removed from the
        // catalogue still renders as something rather than blank.
        grindLabel:
          grinds.find((grind) => grind.id === line.grindId)?.label ??
          line.grindId,
        image: coffee.image,
        imageAlt: coffee.imageAlt,
        unitPence: size.pence,
        totalPence: size.pence * line.quantity,
      });
    }
    return out;
  }, [state.lines]);

  const count = useMemo(
    () => state.lines.reduce((total, line) => total + line.quantity, 0),
    [state.lines]
  );

  const subtotalPence = useMemo(
    () => resolved.reduce((total, item) => total + item.totalPence, 0),
    [resolved]
  );

  return {
    lines: state.lines,
    hydrated: state.loaded,
    resolved,
    count,
    subtotalPence,
    add: addLine,
    setQuantity: setLineQuantity,
    remove: removeLine,
    clear: clearCart,
  };
}
