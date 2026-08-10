/**
 * The bill of materials, as arithmetic.
 *
 * ZERO RUNTIME IMPORTS, on purpose. Node strips the types out of this
 * file and runs it directly, so `scripts/check-bom.mjs` asserts against
 * the module the site actually ships rather than against a copy of it
 * that drifts (CONVENTIONS §8). That is also why there is no `@/` alias
 * in here and no `Date` anywhere in it — every instant in this template
 * is an integer day index, so the answers are the same in Auckland as
 * they are in Amsterdam.
 *
 * Five questions, and each one is a different shape of walk over the
 * same graph:
 *
 *   explode()      down, multiplying   — how many of this are in one of those
 *   rolledCost()   up, summing         — what a thing is worth made of
 *   leadTime()     up, MAXIMISING      — the longest chain, not the sum
 *   buildable()    across the leaves   — the smallest quotient wins
 *   whereUsed()    upwards from a leaf — the tree read backwards
 *
 * The third is the one people get wrong, and it is why this file exists
 * rather than a column in a spreadsheet. Lead time is not additive:
 * parts are ordered in parallel, so a machine takes as long as its
 * slowest chain and everything else has slack. Adding the lead times up
 * gives a number four times too big, and the parts it blames are not
 * the parts to chase.
 */

export type Kind = "made" | "bought";

export type Item = {
  id: string;
  name: string;
  kind: Kind;
  /** How this is counted. Mostly "ea", but brazing rod is metres and
   *  coating is a job, and a quantity of 0.6 has to mean something. */
  unit: string;
  /** Bought: what one unit costs, in cents. */
  cost?: number;
  supplierId?: string;
  /** Bought: days from placing an order to it landing on the bench. */
  leadDays?: number;
  /** Bought: what is on the shelf right now. Made items carry no stock
   *  — see the note on `buildable`. */
  stock?: number;
  /** Made: days of work at THIS level, on top of whatever its children
   *  take. Assembling a wheel is a day whether or not the rim is late. */
  buildDays?: number;
  /** Made: cents added at this level that are not a part — the
   *  outworked coating on a frame is bought, but the hour spent filing
   *  the lugs before it goes is not. */
  processCost?: number;
  /** A thing the workshop will sell you on its own. Two bikes, and
   *  three assemblies people crash and need again. */
  sellable?: boolean;
  note?: string;
};

/** One edge: `qty` of `child` go into one `parent`. */
export type Line = { parent: string; child: string; qty: number };

export type Shop = { items: Item[]; lines: Line[] };

export type Order = {
  id: string;
  itemId: string;
  qty: number;
  /** Day index it was placed, and the day the supplier has committed
   *  to. `due` is not `placed + leadDays` — a supplier who is already
   *  late tells you a date, not a duration. */
  placed: number;
  due: number;
  supplierId: string;
  note?: string;
};

/** A build the workshop has committed to: `qty` of `itemId`, wanted by
 *  `due`. The queue is the demand side of every number on the board. */
export type Commitment = { id: string; itemId: string; qty: number; due: number; note?: string };

// ── Indexing ────────────────────────────────────────────────────────

export type Index = {
  byId: Map<string, Item>;
  children: Map<string, Line[]>;
  parents: Map<string, Line[]>;
};

export function indexShop(shop: Shop): Index {
  const byId = new Map<string, Item>();
  for (const item of shop.items) byId.set(item.id, item);

  const children = new Map<string, Line[]>();
  const parents = new Map<string, Line[]>();
  for (const line of shop.lines) {
    const kids = children.get(line.parent);
    if (kids) kids.push(line);
    else children.set(line.parent, [line]);

    const ups = parents.get(line.child);
    if (ups) ups.push(line);
    else parents.set(line.child, [line]);
  }
  return { byId, children, parents };
}

export function childrenOf(ix: Index, id: string): Line[] {
  return ix.children.get(id) ?? [];
}

export function parentsOf(ix: Index, id: string): Line[] {
  return ix.parents.get(id) ?? [];
}

export function item(ix: Index, id: string): Item {
  const found = ix.byId.get(id);
  // A line naming an item that does not exist is a content bug, and it
  // must be loud: returning a placeholder here would render a tree with
  // a blank row in it and no indication anything was wrong.
  if (!found) throw new Error(`no such item: ${id}`);
  return found;
}

// ── Down: explosion ─────────────────────────────────────────────────

export type Node = {
  id: string;
  depth: number;
  /** How many of this go into ONE of its immediate parent. */
  qtyEach: number;
  /** How many go into one of the root, multiplied down the path. This
   *  is the number that surprises people: two wheels of thirty-two
   *  spokes is sixty-four spokes, and nobody who has only seen the
   *  wheel drawing expects to be counting to sixty-four. */
  qtyPer: number;
  /** Every id from the root down to and including this one, which is
   *  what makes a node addressable when the same part appears in four
   *  places. */
  path: string[];
};

/**
 * The tree under `rootId`, depth-first, in content order.
 *
 * A part used twice appears twice, because it genuinely is in two
 * places and collapsing them would hide the second. `requirement()`
 * below is the version that sums.
 */
export function explode(ix: Index, rootId: string): Node[] {
  const out: Node[] = [];
  const walk = (id: string, depth: number, qtyEach: number, qtyPer: number, path: string[]) => {
    // A cycle in a bill of materials is a content bug that would
    // otherwise hang the page rather than fail it.
    if (path.includes(id)) throw new Error(`cycle in the tree at ${id}: ${path.join(" > ")}`);
    const here = [...path, id];
    out.push({ id, depth, qtyEach, qtyPer, path: here });
    for (const line of childrenOf(ix, id)) {
      walk(line.child, depth + 1, line.qty, round(qtyPer * line.qty), here);
    }
  };
  walk(rootId, 0, 1, 1, []);
  return out;
}

/** Quantities multiply, and 0.6 metres of rod times three frames is
 *  1.7999999999999998 without this. Three places is past anything the
 *  content expresses and short of anything float noise reaches. */
export function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/**
 * Every BOUGHT part in one of `rootId`, and how many.
 *
 * Summed across paths, so an M5 bolt that appears in the mudguards, the
 * carrier and the lighting loom comes back once with the total. This is
 * the shopping list, and it is what every stock question is asked
 * against.
 */
export function requirement(ix: Index, rootId: string): Map<string, number> {
  const need = new Map<string, number>();
  for (const node of explode(ix, rootId)) {
    if (item(ix, node.id).kind !== "bought") continue;
    need.set(node.id, round((need.get(node.id) ?? 0) + node.qtyPer));
  }
  return need;
}

/** Every item under `rootId`, made and bought, deduplicated. Used for
 *  "how many distinct things is this" and for the overlap between two
 *  products. */
export function partsIn(ix: Index, rootId: string): Set<string> {
  const seen = new Set<string>();
  for (const node of explode(ix, rootId)) seen.add(node.id);
  seen.delete(rootId);
  return seen;
}

// ── Up: cost ────────────────────────────────────────────────────────

/**
 * What one of these is worth in parts, in cents.
 *
 * Bought: what it costs. Made: the sum of its children times their
 * quantities, plus whatever is added at this level that is not a part.
 * Memoised, because a fastener appearing in six assemblies is otherwise
 * resolved six times per render.
 */
export function rolledCost(ix: Index, id: string, memo = new Map<string, number>()): number {
  const cached = memo.get(id);
  if (cached !== undefined) return cached;

  const it = item(ix, id);
  let total: number;
  if (it.kind === "bought") {
    total = it.cost ?? 0;
  } else {
    total = it.processCost ?? 0;
    for (const line of childrenOf(ix, id)) {
      total += rolledCost(ix, line.child, memo) * line.qty;
    }
  }
  total = Math.round(total);
  memo.set(id, total);
  return total;
}

// ── Up: time ────────────────────────────────────────────────────────

/**
 * Days from "order everything" to "this exists".
 *
 * The MAX over children, not the sum — everything is ordered on the
 * same morning and arrives in parallel, so a machine waits only for its
 * slowest chain. This is the single most misread number in a bill of
 * materials, and the reason a shop chasing its most expensive supplier
 * usually gains nothing.
 */
export function leadTime(ix: Index, id: string, memo = new Map<string, number>()): number {
  const cached = memo.get(id);
  if (cached !== undefined) return cached;

  const it = item(ix, id);
  let days: number;
  if (it.kind === "bought") {
    days = it.leadDays ?? 0;
  } else {
    let worst = 0;
    for (const line of childrenOf(ix, id)) {
      worst = Math.max(worst, leadTime(ix, line.child, memo));
    }
    days = (it.buildDays ?? 0) + worst;
  }
  memo.set(id, days);
  return days;
}

/**
 * The chain that sets the number above, root first.
 *
 * Ties are broken by content order, which is arbitrary but stable —
 * and a tie means either chain is a true answer to "what is holding
 * this up", so there is nothing better to prefer.
 */
export function criticalPath(ix: Index, id: string): string[] {
  const chain = [id];
  let here = id;
  for (;;) {
    const kids = childrenOf(ix, here);
    if (kids.length === 0) return chain;
    let worst: string | null = null;
    let worstDays = -1;
    for (const line of kids) {
      const days = leadTime(ix, line.child);
      if (days > worstDays) {
        worstDays = days;
        worst = line.child;
      }
    }
    if (worst === null) return chain;
    chain.push(worst);
    here = worst;
  }
}

/**
 * How many days late a part could be before it delayed the product.
 *
 * Zero means it is on the critical path. This is the number that turns
 * a bill of materials into a plan: it says which suppliers are worth
 * chasing and — far more usefully, because it is the larger set — which
 * ones could be a fortnight late and change nothing at all.
 */
export function slack(ix: Index, rootId: string): Map<string, number> {
  const total = leadTime(ix, rootId);
  const out = new Map<string, number>();

  // For each node, the time still to run AFTER it exists: the build
  // days of every ancestor. Its lead plus that tail is the earliest the
  // product can be finished if this part is the only thing anyone is
  // waiting for.
  for (const node of explode(ix, rootId)) {
    let tail = 0;
    for (const ancestor of node.path.slice(0, -1)) {
      tail += item(ix, ancestor).buildDays ?? 0;
    }
    const through = leadTime(ix, node.id) + tail;
    const free = total - through;
    const prior = out.get(node.id);
    // A part in two places gets the tighter of its two answers, because
    // the demanding position is the one that constrains it.
    out.set(node.id, prior === undefined ? free : Math.min(prior, free));
  }
  out.delete(rootId);
  return out;
}

// ── Across: what stops you ──────────────────────────────────────────

/** What is on the shelf on a given day: today's stock, plus every
 *  order that has landed by then. Orders do not deplete — the demand
 *  side is the build queue, and `shortfalls()` is where the two meet. */
export function stockOn(shop: Shop, orders: Order[], day: number): Map<string, number> {
  const out = new Map<string, number>();
  for (const it of shop.items) {
    if (it.kind === "bought") out.set(it.id, it.stock ?? 0);
  }
  for (const order of orders) {
    if (order.due > day) continue;
    out.set(order.itemId, round((out.get(order.itemId) ?? 0) + order.qty));
  }
  return out;
}

export type Constraint = {
  itemId: string;
  /** On the shelf. */
  have: number;
  /** Per one of the product. */
  per: number;
  /** How many whole products this part alone would allow. */
  allows: number;
};

/**
 * How many of `rootId` could be built from what is on the shelf, and
 * what the answer depends on.
 *
 * Against BOUGHT parts only. The workshop holds no sub-assembly stock —
 * a wheel exists because somebody built it that morning — so netting
 * off a stock of wheels would be modelling a policy this shop does not
 * have. It also keeps the arithmetic exact: with sub-assembly stock the
 * recursion double-counts any part two assemblies share, and the honest
 * fix for that is a bigger model than a workshop of nine people needs.
 *
 * The number is true and it is not additive across products: a Kade and
 * a Vaart both want the same brass nipples, so "12 of one" and "5 of
 * the other" cannot both be acted on. That is what the build queue is
 * for, and the board says so rather than hiding one of the two.
 */
export function buildable(
  ix: Index,
  rootId: string,
  stock: Map<string, number>,
): { count: number; constraints: Constraint[] } {
  const need = requirement(ix, rootId);
  const constraints: Constraint[] = [];
  for (const [itemId, per] of need) {
    const have = stock.get(itemId) ?? 0;
    constraints.push({ itemId, have, per, allows: Math.floor(have / per) });
  }
  // Fewest first, then by unit cost ascending so the cheap thing that
  // is stopping you sorts above the expensive thing that is stopping
  // you equally — which is the whole argument of this template, and it
  // would be a coin toss on insertion order otherwise.
  constraints.sort(
    (a, b) =>
      a.allows - b.allows ||
      (item(ix, a.itemId).cost ?? 0) - (item(ix, b.itemId).cost ?? 0) ||
      a.itemId.localeCompare(b.itemId),
  );
  const count = constraints.length === 0 ? 0 : constraints[0].allows;
  return { count, constraints };
}

// ── The queue ───────────────────────────────────────────────────────

export type Shortfall = {
  itemId: string;
  /** Cumulative demand at the moment the gap is widest. */
  need: number;
  /** What is on the shelf then, arrivals included. */
  have: number;
  short: number;
  /** The FIRST commitment that cannot be met, which is the date
   *  somebody has to do something about. Not necessarily the same date
   *  as the widest gap. */
  firstShortAt: number;
  /** The day enough has arrived to cover the first shortfall, or null
   *  if nothing is on order for it. This distinction is the whole point
   *  of the report: a problem with a date on it and a problem nobody
   *  has noticed want completely different responses, and they look
   *  identical in a stock column. */
  coveredOn: number | null;
};

/**
 * Where the committed queue runs out of parts.
 *
 * Walked in due-date order and CUMULATIVELY, because the question is
 * never "is there enough for this build" but "is there enough for this
 * build given the three in front of it". A part can be comfortable
 * against every commitment taken alone and short against the sequence,
 * and that is the failure this function exists to find.
 *
 * The gap is measured at every due date and the worst one is reported,
 * rather than the first — an order landing between two builds can
 * rescue the later one while the earlier is still late, and reporting
 * only the first occurrence would understate a shortage that gets worse
 * before it gets better.
 */
export function shortfalls(
  ix: Index,
  shop: Shop,
  orders: Order[],
  queue: Commitment[],
): Shortfall[] {
  const due = [...queue].sort((a, b) => a.due - b.due || a.id.localeCompare(b.id));

  const running = new Map<string, number>();
  const trouble = new Map<string, Shortfall>();

  for (const commitment of due) {
    const per = requirement(ix, commitment.itemId);
    const available = stockOn(shop, orders, commitment.due);
    for (const [itemId, qty] of per) {
      const total = round((running.get(itemId) ?? 0) + qty * commitment.qty);
      running.set(itemId, total);
      const have = available.get(itemId) ?? 0;
      const gap = round(total - have);
      if (gap <= 0) continue;

      const prior = trouble.get(itemId);
      if (!prior) {
        trouble.set(itemId, {
          itemId,
          need: total,
          have,
          short: gap,
          firstShortAt: commitment.due,
          coveredOn: coverageDay(shop, orders, itemId, total),
        });
      } else if (gap > prior.short) {
        // Widest gap wins for the size; the first date stands, because
        // that is when the phone call is needed.
        prior.need = total;
        prior.have = have;
        prior.short = gap;
      }
    }
  }

  return [...trouble.values()].sort(
    (a, b) => a.firstShortAt - b.firstShortAt || b.short - a.short || a.itemId.localeCompare(b.itemId),
  );
}

/** The earliest day on which stock plus arrivals reaches `target`, or
 *  null if it never does. */
export function coverageDay(
  shop: Shop,
  orders: Order[],
  itemId: string,
  target: number,
): number | null {
  const mine = orders.filter((o) => o.itemId === itemId).sort((a, b) => a.due - b.due);
  const base = shop.items.find((i) => i.id === itemId)?.stock ?? 0;
  let running = base;
  if (running >= target) return 0;
  for (const order of mine) {
    running = round(running + order.qty);
    if (running >= target) return order.due;
  }
  return null;
}

/** Total demand on every bought part from the whole queue, whenever it
 *  falls due. The "what this month costs in parts" number. */
export function queueDemand(ix: Index, queue: Commitment[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const commitment of queue) {
    for (const [itemId, qty] of requirement(ix, commitment.itemId)) {
      out.set(itemId, round((out.get(itemId) ?? 0) + qty * commitment.qty));
    }
  }
  return out;
}

// ── Backwards: where used ───────────────────────────────────────────

export type Usage = {
  /** Root-first, ending at the part itself. */
  path: string[];
  /** How many go into one of the root by this route. */
  qtyPer: number;
};

/**
 * Every route from a product down to this part.
 *
 * Computed by exploding each root and keeping the nodes that match,
 * rather than by walking parents upward. Walking up gives the paths but
 * not the quantities — you would have to multiply back down anyway, and
 * a part in two positions under one parent would be counted once.
 */
export function whereUsed(ix: Index, roots: string[], id: string): Usage[] {
  const out: Usage[] = [];
  for (const root of roots) {
    for (const node of explode(ix, root)) {
      if (node.id === id) out.push({ path: node.path, qtyPer: node.qtyPer });
    }
  }
  return out;
}

/** Total per one of `root`, across every route. Zero if it is not in
 *  that product at all, which is a real answer and not an error. */
export function qtyIn(ix: Index, root: string, id: string): number {
  return whereUsed(ix, [root], id).reduce((n, u) => round(n + u.qtyPer), 0);
}
