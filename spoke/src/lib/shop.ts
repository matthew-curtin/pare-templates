/**
 * The model, bound to the content, computed once.
 *
 * Everything here is derived at module scope rather than in a component
 * — the tree is walked a good many times to produce these and none of
 * the inputs change while the page is open, so recomputing per render
 * would be work with no possible different answer.
 *
 * `bom.ts` stays free of this file, not the other way round: the model
 * has zero imports so a plain node script can assert against it.
 */

import {
  buildable,
  indexShop,
  item as lookup,
  leadTime,
  criticalPath,
  explode,
  partsIn,
  queueDemand,
  requirement,
  rolledCost,
  shortfalls,
  slack,
  stockOn,
  whereUsed,
  type Item,
  type Shop,
} from "./bom.ts";
import { TODAY } from "./calendar.ts";
import { items, productIds } from "@/content/catalogue.ts";
import { lines } from "@/content/structure.ts";
import { orders, queue } from "@/content/orders.ts";
import { supplierById } from "@/content/suppliers.ts";

export const shop: Shop = { items, lines };
export const ix = indexShop(shop);

export const item = (id: string): Item => lookup(ix, id);
export const products = productIds.map(item);

/** What is on the shelf right now. Orders due today have landed. */
export const stockToday = stockOn(shop, orders, TODAY);

/** The horizon the queue reaches — the last thing anybody has promised. */
export const horizon = queue.reduce((n, c) => Math.max(n, c.due), TODAY);

export type ProductView = {
  id: string;
  item: Item;
  /** How many could be built today from stock, ignoring the other
   *  product. Both numbers are true and they cannot both be spent. */
  count: number;
  constraints: ReturnType<typeof buildable>["constraints"];
  cost: number;
  lead: number;
  path: string[];
  slack: Map<string, number>;
  boughtCount: number;
  itemCount: number;
  /** Rendered rows, duplicates included — a part in three assemblies
   *  is three rows. Distinct items is `itemCount`. */
  rows: number;
};

export const productViews: ProductView[] = productIds.map((id) => {
  const { count, constraints } = buildable(ix, id, stockToday);
  return {
    id,
    item: item(id),
    count,
    constraints,
    cost: rolledCost(ix, id),
    lead: leadTime(ix, id),
    path: criticalPath(ix, id),
    slack: slack(ix, id),
    boughtCount: requirement(ix, id).size,
    itemCount: partsIn(ix, id).size,
    rows: explode(ix, id).length,
  };
});

export const viewOf = (id: string): ProductView => {
  const found = productViews.find((v) => v.id === id);
  if (!found) throw new Error(`no such product: ${id}`);
  return found;
};

/** Everything the committed queue wants, and where it comes up short. */
export const demand = queueDemand(ix, queue);
export const gaps = shortfalls(ix, shop, orders, queue);

/** Parts with no slack anywhere — the only ones whose supplier is worth
 *  a phone call about a date. Deduplicated across both products. */
export const noSlack = [
  ...new Set(
    productViews.flatMap((v) =>
      [...v.slack.entries()].filter(([, days]) => days <= 0).map(([id]) => id),
    ),
  ),
].filter((id) => item(id).kind === "bought");

/** The tightest slack any product gives this part, or null if it is in
 *  neither — which happens for nothing today and would happen the
 *  moment somebody added a part and forgot to put it in a tree. */
export function slackOf(id: string): number | null {
  let best: number | null = null;
  for (const view of productViews) {
    const days = view.slack.get(id);
    if (days === undefined) continue;
    best = best === null ? days : Math.min(best, days);
  }
  return best;
}

export const bought = items.filter((i) => i.kind === "bought");
export const made = items.filter((i) => i.kind === "made");

/** Bought parts that appear in BOTH bikes. The overlap is why the two
 *  build numbers on the board interfere with each other. */
export const sharedParts = (() => {
  const [a, b] = productIds.map((id) => new Set(requirement(ix, id).keys()));
  return [...a].filter((id) => b.has(id));
})();

export type PartState = "short" | "inbound" | "ok";

/**
 * How a part is doing against the whole committed queue.
 *
 * Three states and no more, because the tree paints them with `:has()`
 * and a fourth would need a fourth selector for every ancestor. "short"
 * means the queue asks for more than will exist by the day it is
 * wanted; "inbound" means there is an order in flight that has not
 * landed. Everything else is fine and gets no treatment at all — most
 * of the list is fine, and a page where every row is coloured has told
 * you nothing.
 */
export function stateOf(id: string): PartState {
  if (gaps.some((g) => g.itemId === id)) return "short";
  if (orders.some((o) => o.itemId === id && o.due > TODAY)) return "inbound";
  return "ok";
}

export const gapOf = (id: string) => gaps.find((g) => g.itemId === id) ?? null;
export const ordersFor = (id: string) => orders.filter((o) => o.itemId === id);
export const supplierOf = (id: string) => {
  const supplierId = item(id).supplierId;
  return supplierId ? (supplierById.get(supplierId) ?? null) : null;
};

/** Every route from either bike down to this part. */
export const usesOf = (id: string) => whereUsed(ix, productIds, id);

export { rolledCost, leadTime, requirement, orders, queue };
