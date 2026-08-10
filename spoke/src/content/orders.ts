import type { Commitment, Order } from "@/lib/bom.ts";

/**
 * Purchase orders in flight, and the builds they are supposed to feed.
 *
 * `due` is what the supplier has promised, not `placed + leadDays` — a
 * supplier already running behind gives you a date rather than a
 * duration, and the gap between those two is most of what a shortage
 * report is about. Every date here falls on a weekday, which is not
 * decoration: a delivery on a Sunday reads as invented the moment
 * anybody looks at the column.
 */
export const orders: Order[] = [
  { id: "po-4412", itemId: "bolt-m5x16", qty: 1500, placed: -9, due: 4, supplierId: "boutenmoer" },
  { id: "po-4413", itemId: "washer-m5", qty: 1000, placed: -9, due: 4, supplierId: "boutenmoer" },
  { id: "po-4414", itemId: "nut-m5", qty: 1000, placed: -9, due: 4, supplierId: "boutenmoer" },
  { id: "po-4418", itemId: "spade", qty: 600, placed: -6, due: 7, supplierId: "boutenmoer" },
  {
    id: "po-4402",
    itemId: "nipple",
    qty: 2000,
    placed: -18,
    due: 8,
    supplierId: "bergen",
    note: "Standing order, two thousand at a time. Placed the morning we noticed the shelf was down to eight hundred, which was two weeks too late to help this week.",
  },
  { id: "po-4419", itemId: "cable-ferrule", qty: 400, placed: -5, due: 9, supplierId: "boutenmoer" },
  { id: "po-4420", itemId: "axle-nut", qty: 400, placed: -5, due: 10, supplierId: "boutenmoer" },
  { id: "po-4405", itemId: "spoke-292", qty: 1500, placed: -14, due: 15, supplierId: "bergen" },
  { id: "po-4406", itemId: "roller-brake", qty: 60, placed: -13, due: 16, supplierId: "noordkant" },
  { id: "po-4407", itemId: "crankset", qty: 30, placed: -13, due: 18, supplierId: "noordkant" },
  { id: "po-4409", itemId: "footboard", qty: 20, placed: -11, due: 24, supplierId: "stellinga" },
  { id: "po-4410", itemId: "deck-slat", qty: 60, placed: -11, due: 25, supplierId: "houtwerk" },
  { id: "po-4411", itemId: "deck-strap", qty: 40, placed: -11, due: 25, supplierId: "houtwerk" },
  { id: "po-4415", itemId: "tube-main-vaart", qty: 12, placed: -8, due: 30, supplierId: "kamphuis" },
  {
    id: "po-4421",
    itemId: "brake-lever",
    qty: 60,
    placed: -3,
    due: 36,
    supplierId: "noordkant",
    note: "Ordered late. Four days after the second Kade batch is due out, which is four days somebody is going to have to explain.",
  },
  {
    id: "po-4380",
    itemId: "hub-shell-dyn",
    qty: 25,
    placed: -42,
    due: 51,
    supplierId: "wikkelwerk",
    note: "Placed six weeks ago against a promised date of 22 March, re-promised twice, now 21 April. Nothing about this order is unusual for this account, which is the problem.",
  },
];

/**
 * What the workshop has told people it will deliver.
 *
 * Four batches over six weeks. Deliberately not a smooth line: two
 * Kades to one Vaart is roughly the real ratio, and the second Kade
 * batch is the biggest thing in the queue because a shop that has just
 * been to a show comes back with a list.
 */
export const queue: Commitment[] = [
  {
    id: "b-118",
    itemId: "kade",
    qty: 6,
    due: 11,
    note: "Four for the hire fleet at Merwesluis station, two retail.",
  },
  { id: "b-119", itemId: "vaart", qty: 4, due: 18, note: "Bakery on the Kerkstraat, all four in the same green." },
  {
    id: "b-120",
    itemId: "kade",
    qty: 9,
    due: 32,
    note: "Everything taken at the spring show. The largest single batch we have ever agreed to.",
  },
  { id: "b-121", itemId: "vaart", qty: 5, due: 39, note: "Three retail, two for the school run scheme." },
];
