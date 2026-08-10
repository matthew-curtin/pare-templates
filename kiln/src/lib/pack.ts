import type { Kiln, Piece } from "../content/types";

/**
 * How a kiln gets loaded.
 *
 * Zero runtime imports on purpose: `scripts/check-load.mjs` imports this
 * module with plain node and calls the real functions, so the checker
 * cannot drift from the thing it is checking (CONVENTIONS §8).
 *
 * The whole model is here, and it is smaller than it sounds. A kiln is a
 * box. Work stands on shelves. A shelf's height is set by the TALLEST
 * thing on it, so one big vase costs everything underneath it — which is
 * the fact the rest of the site is about.
 */

/** One piece, placed: where it sits on its shelf, in cm from the corner. */
export type Placement = {
  pieceId: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  height: number;
};

/** One shelf's worth of work. */
export type Layer = {
  /** Height of the shelf's own slab plus the space above it, cm. */
  height: number;
  /** cm from the kiln floor to the underside of this shelf's slab. */
  base: number;
  placements: Placement[];
};

export type Load = {
  layers: Layer[];
  /** Pieces that were offered and did not fit. */
  deferred: string[];
  /** cm of the interior consumed, floor to the top of the last layer. */
  usedHeight: number;
  /**
   * Fraction of the interior box taken up by the work's own bounding
   * boxes. See `occupancy` for why it is measured this way.
   */
  load: number;
};

/** Interior volume, cm³. */
export function capacity(kiln: Kiln): number {
  return kiln.width * kiln.depth * kiln.height;
}

/** A piece's bounding box, cm³. */
export function volume(piece: Piece): number {
  return piece.width * piece.depth * piece.height;
}

/**
 * How full a load is.
 *
 * Measured as the work's bounding-box volume over the interior volume,
 * which is the only measure of the three obvious ones that cannot be
 * gamed. Counting SHELVES says a kiln holding five mugs on five shelves
 * is full. Counting shelf AREA ignores that a tall pot has eaten the
 * headroom above it. Volume charges for both, and it is also what the
 * elevation drawing on the firing page is showing you.
 *
 * It reads low — a well-packed kiln lands nearer 40% than 90% — because
 * pots are mostly air and a box drawn round one is mostly air twice
 * over. That is not a flaw in the measure; a kiln really is mostly
 * empty, and pretending otherwise is how you end up firing one.
 */
export function occupancy(kiln: Kiln, pieces: Piece[]): number {
  const used = pieces.reduce((n, p) => n + volume(p), 0);
  return used / capacity(kiln);
}

/** The tallest piece this kiln can take at all, cm. */
export function tallestPossible(kiln: Kiln): number {
  return kiln.height - kiln.shelfThickness - kiln.clearance;
}

export function fits(kiln: Kiln, piece: Piece): boolean {
  const footprint =
    (piece.width <= kiln.width && piece.depth <= kiln.depth) ||
    (piece.depth <= kiln.width && piece.width <= kiln.depth);
  return footprint && piece.height <= tallestPossible(kiln);
}

/**
 * Fill one shelf.
 *
 * First-fit-decreasing strip packing: work is laid in rows across the
 * depth of the shelf, each row as deep as the first thing put in it, and
 * a piece goes in the first row it fits. It is the standard answer to
 * this shape of problem and it is also, near enough, what a person does
 * with a kiln shelf and a tape measure.
 *
 * `offered` must already be in the order the studio wants to honour;
 * this function never reorders it, because the order IS the fairness
 * policy and it belongs one level up where it can be explained.
 */
function packShelf(
  kiln: Kiln,
  offered: Piece[],
  ceiling: number,
): { placements: Placement[]; taken: Set<string> } {
  const rows: { y: number; depth: number; x: number }[] = [];
  const placements: Placement[] = [];
  const taken = new Set<string>();
  let usedDepth = 0;

  for (const piece of offered) {
    if (piece.height > ceiling) continue;

    // A piece may be turned a quarter turn if that is the way it goes in.
    const options: [number, number][] = [
      [piece.width, piece.depth],
      [piece.depth, piece.width],
    ];

    let placed = false;
    for (const [w, d] of options) {
      if (w > kiln.width || d > kiln.depth) continue;

      const row = rows.find((r) => d <= r.depth && r.x + w <= kiln.width);
      if (row) {
        placements.push({
          pieceId: piece.id,
          x: row.x,
          y: row.y,
          width: w,
          depth: d,
          height: piece.height,
        });
        row.x += w;
        placed = true;
        break;
      }

      if (usedDepth + d <= kiln.depth) {
        rows.push({ y: usedDepth, depth: d, x: w });
        placements.push({
          pieceId: piece.id,
          x: 0,
          y: usedDepth,
          width: w,
          depth: d,
          height: piece.height,
        });
        usedDepth += d;
        placed = true;
        break;
      }
    }

    if (placed) taken.add(piece.id);
  }

  return { placements, taken };
}

/**
 * Load a kiln.
 *
 * `offered` is in priority order — see `queueOrder` in `schedule.ts` for
 * what that order is and why. Each shelf is set by the TALLEST piece
 * that still fits under the roof, and then filled in priority order with
 * anything shorter that fits beside it. Repeat until the headroom runs
 * out.
 *
 * Letting priority order set the shelf height instead was the first
 * version and it was plainly wrong the moment it was looked at: a 3cm
 * plate that happened to be next in the queue took a whole shelf and
 * left 60cm of air above it, while a 54cm urn behind it in the queue was
 * turned away by a kiln with room for it twice over. Nobody loads a kiln
 * like that, and neither the packing nor the fairness was improved by
 * it.
 *
 * The consequence is the site's argument in one sentence: a tall piece
 * sets a tall shelf, and everything under a tall shelf is standing in
 * air the studio has paid to heat. Height is the scarce thing here, not
 * floor space.
 *
 * The simplification, stated because it is real: shelves are full-width.
 * A studio with half-shelves can stand an urn at one end and build a
 * second tier beside it, and this model cannot.
 */
export function packKiln(kiln: Kiln, offered: Piece[]): Load {
  const layers: Layer[] = [];
  const remaining = offered.filter((p) => fits(kiln, p));
  const impossible = offered.filter((p) => !fits(kiln, p)).map((p) => p.id);
  let waiting = remaining;
  let base = 0;

  while (waiting.length > 0) {
    const headroom = kiln.height - base - kiln.shelfThickness - kiln.clearance;
    const { placements, taken } = packShelf(kiln, waiting, headroom);
    if (placements.length === 0) break;

    // The shelf is as tall as the tallest thing STANDING ON IT, which is
    // not the same as the tallest thing that was offered to it. Setting
    // it from the offer was a real bug and an expensive one: a 24cm jar
    // that turned out not to fit the floor still made the shelf 24cm
    // tall, so a load of 14cm bowls sat under 10cm of air nobody was
    // using and the kiln lost a whole tier.
    const shelfHeight = placements.reduce((n, p) => Math.max(n, p.height), 0);

    layers.push({
      base,
      height: kiln.shelfThickness + shelfHeight + kiln.clearance,
      placements,
    });
    base += kiln.shelfThickness + shelfHeight + kiln.clearance;
    waiting = waiting.filter((p) => !taken.has(p.id));
  }

  const placedIds = new Set(
    layers.flatMap((l) => l.placements.map((p) => p.pieceId)),
  );
  const placed = offered.filter((p) => placedIds.has(p.id));

  return {
    layers,
    deferred: [...waiting.map((p) => p.id), ...impossible],
    usedHeight: base,
    load: occupancy(kiln, placed),
  };
}

/** Every piece id in a load, in the order it was shelved. */
export function loadedIds(load: Load): string[] {
  return load.layers.flatMap((l) => l.placements.map((p) => p.pieceId));
}

/** Fraction of a shelf's floor taken up by what is standing on it. */
export function shelfUsed(kiln: Kiln, layer: Layer): number {
  const used = layer.placements.reduce((n, p) => n + p.width * p.depth, 0);
  return used / (kiln.width * kiln.depth);
}
