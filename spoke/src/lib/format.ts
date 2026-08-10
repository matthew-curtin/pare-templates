/**
 * Display helpers. Zero runtime imports, so the checker can assert on
 * the strings the page actually prints rather than on a description of
 * them — a caption that rounds differently from the model is a lie the
 * build never notices.
 */

/**
 * Cents → euros. Always two decimals, always separated.
 *
 * There was a rule here dropping the ",00" from whole amounts over a
 * thousand, on the grounds that decimals are noise in a headline figure.
 * It is, and they are — but the same helper renders a COLUMN, and the
 * orders table came out with `€570.00` above `€2,040` above `€210.00`,
 * which is the almanac lesson (§7b) in miniature: a column of money the
 * eye cannot run down is worse than a headline with two redundant
 * zeroes in it. One rule, no exceptions, nothing to drift.
 *
 * The separators are the half a plain `toFixed` silently drops: the
 * queue's parts bill printed as `€30469.17`, which is unreadable at a
 * glance and passes every check that is not a person looking at it.
 */
export function money(cents: number): string {
  return `€${(cents / 100).toLocaleString("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** "6 × Kade 3". A product is a model name, so pluralising it with an
 *  `s` gives "6 Kade 3s" — which is how English works and is not how
 *  anybody writes a build sheet. */
export function batch(n: number, product: string): string {
  return `${n} × ${product}`;
}

/** For a column of prices where the cheapest is eleven cents and the
 *  dearest is three hundred euros: never drop the decimals, or the two
 *  stop being comparable at a glance. */
export function priceExact(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

/** Quantities. Whole numbers stay whole; 0.6 metres of brazing rod
 *  keeps its decimal, because rounding it to 1 would be a different
 *  claim about the workshop. */
export function qty(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
}

export function plural(n: number, word: string, many?: string): string {
  return `${n} ${n === 1 ? word : (many ?? `${word}s`)}`;
}

export function percent(n: number): string {
  return `${Math.round(n * 100)}%`;
}

/** A number wide enough to read as a count rather than a label. */
export function count(n: number): string {
  return n.toLocaleString("en-IE");
}
