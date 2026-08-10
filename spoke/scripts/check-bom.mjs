/**
 * The model and the content, asserted.
 *
 *   node scripts/check-bom.mjs
 *
 * Imports the REAL modules — node strips the types out of a .ts file on
 * its own, so this checks what the site ships rather than a copy of it
 * that drifts (CONVENTIONS §8). Three jobs:
 *
 *   1. Integrity. Every line names an item that exists, no cycles, no
 *      orphans, no duplicate ids.
 *   2. The arithmetic. Explosion multiplies, cost sums, lead MAXIMISES,
 *      buildable takes the minimum, where-used inverts.
 *   3. THE CLAIMS. Every sentence on the site that depends on a
 *      relationship holding — the constraint being cheap, delivery being
 *      far shorter than the sum of the leads, exactly one part having no
 *      slack — is asserted by name here. Those are the ones that go
 *      quietly false when somebody nudges a stock level six months from
 *      now, and nothing else in the toolchain would notice.
 *
 * Per §4b the failure path was exercised: each section below was made to
 * fire by breaking the DATA rather than the assertion, then put back.
 */

import {
  buildable,
  childrenOf,
  criticalPath,
  explode,
  indexShop,
  leadTime,
  parentsOf,
  partsIn,
  qtyIn,
  queueDemand,
  requirement,
  rolledCost,
  shortfalls,
  slack,
  stockOn,
  whereUsed,
} from "../src/lib/bom.ts";
import { DAY_ZERO, TODAY, dateOf, shortDate, weekday } from "../src/lib/calendar.ts";
import { items, productIds } from "../src/content/catalogue.ts";
import { lines } from "../src/content/structure.ts";
import { orders, queue } from "../src/content/orders.ts";
import { suppliers } from "../src/content/suppliers.ts";
import { site } from "../src/content/site.ts";
import { shots } from "../src/content/photos.ts";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

let checks = 0;
const failures = [];

function ok(label, condition, detail = "") {
  checks += 1;
  if (!condition) failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

function eq(label, actual, expected) {
  checks += 1;
  if (actual !== expected) failures.push(`${label} — expected ${expected}, got ${actual}`);
}

function near(label, actual, expected, tol = 0.001) {
  checks += 1;
  if (Math.abs(actual - expected) > tol) {
    failures.push(`${label} — expected ~${expected}, got ${actual}`);
  }
}

const shop = { items, lines };
const ix = indexShop(shop);
const byId = new Map(items.map((i) => [i.id, i]));
const name = (id) => byId.get(id)?.name ?? `<missing ${id}>`;
const cost = (id) => byId.get(id)?.cost ?? 0;

// ── 1. Integrity ────────────────────────────────────────────────────

const ids = items.map((i) => i.id);
eq("no duplicate item ids", new Set(ids).size, ids.length);

for (const line of lines) {
  ok(`line parent exists: ${line.parent}`, byId.has(line.parent));
  ok(`line child exists: ${line.child}`, byId.has(line.child));
  ok(`line qty positive: ${line.parent}>${line.child}`, line.qty > 0);
}

for (const it of items) {
  if (it.kind === "bought") {
    ok(`${it.id} has a cost`, typeof it.cost === "number" && it.cost > 0);
    ok(`${it.id} has a lead`, typeof it.leadDays === "number" && it.leadDays >= 0);
    ok(`${it.id} has stock`, typeof it.stock === "number" && it.stock >= 0);
    ok(`${it.id} has a supplier`, suppliers.some((s) => s.id === it.supplierId));
    ok(`${it.id} is a leaf`, childrenOf(ix, it.id).length === 0, "bought items cannot have children");
  } else {
    ok(`${it.id} has build days`, typeof it.buildDays === "number" && it.buildDays >= 0);
    ok(`${it.id} carries no stock`, it.stock === undefined, "made items are built to order");
  }
}

// Orphans: everything must be reachable from a product, or it is content
// nobody can see. A part added and never put in a tree is invisible on
// every page and would otherwise sit there indefinitely.
const reachable = new Set(productIds);
for (const p of productIds) for (const id of partsIn(ix, p)) reachable.add(id);
for (const it of items) {
  ok(`${it.id} is reachable from a product`, reachable.has(it.id));
}

// Cycles. `explode` throws on one; this asserts it does not.
for (const p of productIds) {
  checks += 1;
  try {
    explode(ix, p);
  } catch (err) {
    failures.push(`${p} tree is not acyclic — ${err.message}`);
  }
}

// Every product is sellable and nothing else claims to be a product.
for (const p of productIds) ok(`${p} is sellable`, byId.get(p)?.sellable === true);
ok("products have no parents", productIds.every((p) => parentsOf(ix, p).length === 0));

// ── 2. The arithmetic ───────────────────────────────────────────────

// Explosion multiplies down the path. Two wheels of thirty-two spokes is
// sixty-four, and the number 64 appears nowhere in the content.
eq("nipples per Kade", requirement(ix, "kade").get("nipple"), 64);
eq("nipples per Vaart", requirement(ix, "vaart").get("nipple"), 64);
eq("spoke-292 per Kade", requirement(ix, "kade").get("spoke-292"), 64);
eq("spoke-292 per Vaart", requirement(ix, "vaart").get("spoke-292"), 32);
ok(
  "no content file states an exploded quantity",
  !readFileSync(path.join(root, "src/content/structure.ts"), "utf8").includes("qty: 64"),
  "writing 64 anywhere is the start of two numbers that disagree",
);

// Fractional quantities survive the multiplication without float noise.
near("brazing rod per Kade", requirement(ix, "kade").get("braze-rod"), 0.6);
near("flux per Vaart", requirement(ix, "vaart").get("flux"), 0.03);

// A part in several assemblies is SUMMED, not overwritten.
eq(
  "M5 bolts per Kade",
  requirement(ix, "kade").get("bolt-m5x16"),
  2 + 8 + 4,
);
eq("M5 bolts per Vaart", requirement(ix, "vaart").get("bolt-m5x16"), 2 + 8 + 6);
eq("M5 bolt appears in 3 Kade assemblies", whereUsed(ix, ["kade"], "bolt-m5x16").length, 3);

// Cost rolls UP: an assembly is the sum of its children times quantity.
for (const madeItem of items.filter((i) => i.kind === "made")) {
  const kids = childrenOf(ix, madeItem.id);
  const sum =
    (madeItem.processCost ?? 0) +
    kids.reduce((n, k) => n + rolledCost(ix, k.child) * k.qty, 0);
  eq(`${madeItem.id} cost rolls up`, rolledCost(ix, madeItem.id), Math.round(sum));
}

// Lead time MAXIMISES over children — the one people get wrong.
for (const madeItem of items.filter((i) => i.kind === "made")) {
  const kids = childrenOf(ix, madeItem.id);
  const worst = kids.reduce((n, k) => Math.max(n, leadTime(ix, k.child)), 0);
  eq(`${madeItem.id} lead is max + own`, leadTime(ix, madeItem.id), (madeItem.buildDays ?? 0) + worst);
}

// And is therefore far below the sum, which is the claim on /method.
for (const p of productIds) {
  const sumOfLeads = [...requirement(ix, p).keys()].reduce((n, id) => n + (byId.get(id).leadDays ?? 0), 0);
  ok(
    `${p} lead is far below the sum of its leads`,
    leadTime(ix, p) < sumOfLeads / 5,
    `${leadTime(ix, p)} vs ${sumOfLeads}`,
  );
}

// The critical path ends at a bought part and its days account for the total.
for (const p of productIds) {
  const chain = criticalPath(ix, p);
  const last = chain[chain.length - 1];
  eq(`${p} critical path ends on a bought part`, byId.get(last).kind, "bought");
  const buildDaysAbove = chain.slice(0, -1).reduce((n, id) => n + (byId.get(id).buildDays ?? 0), 0);
  eq(`${p} critical path days add to the lead`, buildDaysAbove + byId.get(last).leadDays, leadTime(ix, p));
  eq(`${p} critical path has no slack at its end`, slack(ix, p).get(last), 0);
}

// Slack: zero on the critical path, positive everywhere else, and never
// negative — a negative would mean the total lead was wrong.
for (const p of productIds) {
  const sl = slack(ix, p);
  ok(`${p} slack is never negative`, [...sl.values()].every((d) => d >= 0));
  const zero = [...sl.entries()].filter(([id, d]) => d === 0 && byId.get(id).kind === "bought");
  eq(`${p} has exactly one bought part with no slack`, zero.length, 1);
  eq(`${p}'s zero-slack part is the wound hub shell`, zero[0][0], "hub-shell-dyn");
}

// Buildable is the MINIMUM over parts, and the winner is a real quotient.
const stock = stockOn(shop, orders, TODAY);
for (const p of productIds) {
  const { count, constraints } = buildable(ix, p, stock);
  const manual = Math.min(
    ...[...requirement(ix, p)].map(([id, per]) => Math.floor((stock.get(id) ?? 0) / per)),
  );
  eq(`${p} buildable is the minimum`, count, manual);
  eq(`${p} constraints are sorted`, constraints[0].allows, count);
  ok(
    `${p} constraint list is ascending`,
    constraints.every((c, n) => n === 0 || c.allows >= constraints[n - 1].allows),
  );
}

// Where-used inverts the tree: every route the explosion produced comes
// back, with the same quantity.
for (const p of productIds) {
  for (const [id, per] of requirement(ix, p)) {
    near(`${p} > ${id} round-trips through whereUsed`, qtyIn(ix, p, id), per);
  }
}
eq("a part in neither bicycle reports zero", qtyIn(ix, "kade", "deck-slat"), 0);

// ── 3. States §7b — every one the interface can show is reached ──────

const gaps = shortfalls(ix, shop, orders, queue);
eq("exactly three shortfalls", gaps.length, 3);

const gapOf = (id) => gaps.find((g) => g.itemId === id);
const lateOrder = gapOf("brake-lever");
const veryLate = gapOf("hub-shell-dyn");
const unordered = gapOf("bearing-6001");

ok("state: short with an order arriving a few days late", !!lateOrder);
ok("state: short with an order arriving weeks late", !!veryLate);
ok("state: short with NOTHING on order", !!unordered);

if (lateOrder && veryLate && unordered) {
  eq("nothing is on order for the bearings", unordered.coveredOn, null);
  ok("the levers arrive after they are wanted", lateOrder.coveredOn > lateOrder.firstShortAt);
  ok("the levers arrive within a week of being wanted", lateOrder.coveredOn - lateOrder.firstShortAt <= 7);
  ok(
    "the hub shells arrive more than a fortnight late",
    veryLate.coveredOn - veryLate.firstShortAt > 14,
    `${veryLate.coveredOn - veryLate.firstShortAt} days`,
  );
  ok("the hub shells land after the whole queue", veryLate.coveredOn > Math.max(...queue.map((c) => c.due)));
}

// The first batch must be clean and a later one must not: a queue where
// everything fails reads as broken data, and one where nothing does has
// no reason to exist (§7b).
const inDue = [...queue].sort((a, b) => a.due - b.due);
const firstShort = Math.min(...gaps.map((g) => g.firstShortAt));
ok("the next batch out is unaffected", firstShort > inDue[0].due);
ok("a later batch IS affected", firstShort <= inDue[inDue.length - 1].due);

// A part can be a constraint TODAY and fine across the queue — the
// recoverable-versus-not split the whole board is built on.
const kadeCons = buildable(ix, "kade", stock).constraints;
eq("the Kade's binding constraint is the brass nipple", kadeCons[0].itemId, "nipple");
ok("the nipple is NOT short across the queue", !gapOf("nipple"));

// Two items with stock exactly equal to what the queue wants — the
// knife-edge state, which is neither an error nor comfortable.
const demand = queueDemand(ix, queue);
const exact = [...demand].filter(([id, qty]) => (byId.get(id).stock ?? 0) === qty);
ok("at least one part is exactly covered", exact.length >= 1, `${exact.length} found`);

// Fractional units, long names, and a part used only by one bicycle all
// have to exist or their rendering is untested.
ok("a fractional quantity exists", lines.some((l) => !Number.isInteger(l.qty)));
ok("a long part name exists", items.some((i) => i.name.length >= 22));
ok("a Kade-only part exists", [...requirement(ix, "kade").keys()].some((id) => qtyIn(ix, "vaart", id) === 0));
ok("a Vaart-only part exists", [...requirement(ix, "vaart").keys()].some((id) => qtyIn(ix, "kade", id) === 0));
ok("an operation with no children exists", items.some((i) => i.kind === "made" && childrenOf(ix, i.id).length === 0 && (i.processCost ?? 0) > 0));

// Orders: all in flight, all on weekdays, none promised before it was
// raised. A Sunday delivery reads as invented the moment anyone looks.
for (const o of orders) {
  ok(`${o.id} is still in flight`, o.due > TODAY);
  ok(`${o.id} was raised before it is due`, o.placed < o.due);
  const day = weekday(o.due);
  ok(`${o.id} is promised on a weekday`, day !== "Saturday" && day !== "Sunday", day);
  ok(`${o.id} names an item`, byId.has(o.itemId));
  ok(`${o.id} names its supplier`, o.supplierId === byId.get(o.itemId)?.supplierId);
}
for (const c of queue) {
  const day = weekday(c.due);
  ok(`${c.id} is due on a weekday`, day !== "Saturday" && day !== "Sunday", day);
  ok(`${c.id} is in the future`, c.due > TODAY);
  ok(`${c.id} builds a product`, productIds.includes(c.itemId));
}

// ── 4. The claims the prose makes ───────────────────────────────────

// "The five parts nearest to halting a Kade cost seventy cents between
// them, and the dearest of the five is a spoke."
const topFive = kadeCons.slice(0, 5);
const topFiveTotal = topFive.reduce((n, c) => n + cost(c.itemId), 0);
eq("the five nearest constraints cost 70 cents together", topFiveTotal, 70);
ok(
  "none of the five costs more than 40 cents",
  topFive.every((c) => cost(c.itemId) <= 40),
  topFive.map((c) => `${name(c.itemId)} ${cost(c.itemId)}c`).join(", "),
);

// "The hub gear — the most expensive thing we buy — would have let us
// build nineteen." Both halves, because either could drift.
const dearestBought = [...items]
  .filter((i) => i.kind === "bought")
  .sort((a, b) => b.cost - a.cost)[0];
eq("the hub gear is the dearest thing bought", dearestBought.id, "hub-rear-gear");
const hubGear = kadeCons.find((c) => c.itemId === "hub-rear-gear");
ok("the hub gear allows more than the binding part", hubGear.allows > kadeCons[0].allows);
ok(
  "the dearest part is nowhere near the constraint",
  hubGear.allows >= kadeCons[0].allows + 5,
  `${hubGear.allows} vs ${kadeCons[0].allows}`,
);

// "Both bicycles wait on the same part, and it is also one of the three
// we are short of." Stated on /tree.
const ends = productIds.map((p) => criticalPath(ix, p).at(-1));
eq("both critical paths end at the same part", new Set(ends).size, 1);
ok("that part is one of the shortfalls", gaps.some((g) => g.itemId === ends[0]));

// "The bicycles share N of their bought parts" — the number is printed;
// what is asserted is that it is most of them, which is the argument.
const [a, b] = productIds.map((p) => new Set(requirement(ix, p).keys()));
const shared = [...a].filter((id) => b.has(id));
ok("the bicycles share most of their parts", shared.length > a.size * 0.7, `${shared.length}/${a.size}`);

// "Fifty-five of the fifty-eight could be a fortnight late and change
// nothing." Asserted as a proportion, not a literal count.
for (const p of productIds) {
  const sl = [...slack(ix, p).entries()].filter(([id]) => byId.get(id).kind === "bought");
  const slackful = sl.filter(([, d]) => d >= 14).length;
  ok(`most of a ${p}'s parts have a fortnight of slack`, slackful > sl.length * 0.85, `${slackful}/${sl.length}`);
}

// The site quotes longer than the model says, never shorter — the
// /method page argues that the difference is honesty, and the argument
// inverts if the quote is ever the optimistic one.
for (const p of productIds) {
  ok(`the quote is longer than the ${p}'s computed lead`, site.quotedWeeks * 7 > leadTime(ix, p));
}

// Retail covers the parts with room for wages. A price that fell below
// the parts figure would make the front page's closing paragraph absurd.
for (const p of productIds) {
  const retail = site.retail[p];
  ok(`${p} retail is set`, typeof retail === "number");
  ok(`${p} sells for more than its parts`, retail > rolledCost(ix, p) * 1.3);
}

// ── 5. Time is an integer, and stays one ────────────────────────────

// No `Date` anywhere in src. Every instant here is a day index, which is
// what makes the story read identically in every timezone.
const srcFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) srcFiles.push(full);
  }
};
walk(path.join(root, "src"));
for (const file of srcFiles) {
  const text = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
  ok(
    `${path.relative(root, file)} constructs no Date`,
    !/new Date\b|Date\.now\(/.test(text),
  );
}

// The calendar itself.
eq("day zero is a Monday", weekday(0), "Monday");
eq("today is day zero", TODAY, 0);
eq("day zero is 1 March", `${dateOf(0).day}/${dateOf(0).month}`, "1/3");
eq("day 30 crosses into April", `${dateOf(30).day}/${dateOf(30).month}`, "31/3");
eq("day 31 is 1 April", `${dateOf(31).day}/${dateOf(31).month}`, "1/4");
eq("negative days walk backwards", `${dateOf(-1).day}/${dateOf(-1).month}`, "28/2");
eq("a placed date renders", shortDate(-42), "18 Jan");
eq("day zero year", DAY_ZERO.year, 2027);
// Every seventh day is the same weekday, across a month boundary.
for (let d = 0; d < 60; d += 1) eq(`weekday cycles at ${d}`, weekday(d), weekday(d + 7));

// ── 6. Imagery §6 ───────────────────────────────────────────────────

for (const [key, shot] of Object.entries(shots)) {
  ok(`shot ${key} has alt text`, shot.alt.length > 40);
  ok(`shot ${key} has a caption`, shot.caption.length > 20);
  ok(`shot ${key} states its job`, shot.job.length > 60);
  ok(`shot ${key} alt is not the caption`, shot.alt !== shot.caption);
}
const photoDir = path.join(root, "src/photos");
const files = readdirSync(photoDir).filter((f) => /\.jpe?g$/i.test(f));
eq("one file per shot", files.length, Object.keys(shots).length);
for (const key of Object.keys(shots)) {
  ok(`${key}.jpg is committed`, files.includes(`${key}.jpg`));
}

// ── Report ──────────────────────────────────────────────────────────

if (failures.length > 0) {
  console.error(`\n  ✗ ${failures.length} of ${checks} checks failed\n`);
  for (const f of failures) console.error(`    · ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`\n  ✓ ${checks} checks passed`);
console.log(`    ${items.length} items · ${lines.length} lines · ${orders.length} orders · ${queue.length} batches`);
for (const p of productIds) {
  const { count } = buildable(ix, p, stock);
  console.log(
    `    ${name(p).padEnd(8)} ${String(count).padStart(3)} buildable · ${leadTime(ix, p)}d lead · €${(rolledCost(ix, p) / 100).toFixed(2)} of parts · ${requirement(ix, p).size} bought lines`,
  );
}
console.log(`    ${gaps.length} shortfalls: ${gaps.map((g) => `${name(g.itemId)} (${g.coveredOn === null ? "unordered" : `${g.coveredOn - g.firstShortAt}d late`})`).join(", ")}`);
console.log("");
