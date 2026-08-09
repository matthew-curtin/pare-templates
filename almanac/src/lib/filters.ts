/**
 * Which vacancies show, and in what order.
 *
 * No runtime imports, so `scripts/check-listings.mjs` can call it. See
 * CONVENTIONS §8.
 *
 * Two things here are easy to get subtly wrong and impossible to see in
 * a screenshot:
 *
 *   A comparator that is not a TOTAL ORDER. If two rows compare equal,
 *   their order depends on the sort implementation and on the order
 *   they arrived in, so a filter that removes an unrelated row can
 *   reshuffle the rest. Every mode here ends by comparing ids.
 *
 *   A search that needs its words in the order you typed them. "ranger
 *   woodland" finding nothing while "woodland ranger" finds the job is
 *   the kind of thing nobody reports as a bug; they just decide the
 *   board is empty and leave.
 */

export type SortMode = "closing" | "newest" | "pay";

export interface Filters {
  q: string;
  sectors: readonly string[];
  contracts: readonly string[];
  patterns: readonly string[];
  /** Minimum actual annual pay. 0 means no floor. */
  floor: number;
  includeClosed: boolean;
}

export const emptyFilters: Filters = {
  q: "",
  sectors: [],
  contracts: [],
  patterns: [],
  floor: 0,
  includeClosed: false,
};

/** Everything the ordering and matching need, and nothing else. */
export interface Listing {
  id: string;
  sector: string;
  contract: string;
  pattern: string;
  closes: string;
  posted: string;
  closed: boolean;
  featured: boolean;
  /** Bottom of the actual annual range; null when there is nothing to compare. */
  payFrom: number | null;
  /** Top of it, which is what a minimum-salary floor is measured against. */
  payTo: number | null;
  /** Title, employer, place and summary, already lowercased. */
  haystack: string;
}

/**
 * Build the sortable, searchable shape from a vacancy.
 *
 * This lives here rather than in the page so that the checker builds
 * its listings the same way the board does. The haystack in particular
 * is worth sharing: a search that quietly stops covering the employer
 * name is not something a typecheck notices.
 */
export function toListing(input: {
  id: string;
  sector: string;
  contract: string;
  pattern: string;
  place: string;
  title: string;
  summary: string;
  closes: string;
  posted: string;
  featured?: boolean;
  employerName: string;
  employerKind: string;
  closed: boolean;
  payFrom: number | null;
  payTo: number | null;
}): Listing {
  return {
    id: input.id,
    sector: input.sector,
    contract: input.contract,
    pattern: input.pattern,
    closes: input.closes,
    posted: input.posted,
    closed: input.closed,
    featured: input.featured === true,
    payFrom: input.payFrom,
    payTo: input.payTo,
    haystack: [
      input.title,
      input.employerName,
      input.employerKind,
      input.place,
      input.sector,
      input.contract,
      input.summary,
    ]
      .join(" ")
      .toLowerCase(),
  };
}

/** Every word must appear somewhere, in any order. */
export function matchesQuery(haystack: string, q: string): boolean {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  return terms.every((term) => haystack.includes(term));
}

export function matchesFilters(listing: Listing, filters: Filters): boolean {
  if (listing.closed && !filters.includeClosed) return false;
  if (filters.sectors.length && !filters.sectors.includes(listing.sector)) {
    return false;
  }
  if (filters.contracts.length && !filters.contracts.includes(listing.contract)) {
    return false;
  }
  if (filters.patterns.length && !filters.patterns.includes(listing.pattern)) {
    return false;
  }
  // A floor is measured against the top of the band — see the note on
  // meetsFloor in pay.ts — and a vacancy with no figure never clears it.
  if (filters.floor > 0) {
    if (listing.payTo === null) return false;
    if (listing.payTo < filters.floor) return false;
  }
  return matchesQuery(listing.haystack, filters.q);
}

/**
 * Ordering.
 *
 * One rule applies before the mode gets a say: closed vacancies sink.
 * You asked to see them; you did not ask to be led by them.
 *
 * And one rule that is conspicuously absent. Featured listings are NOT
 * lifted here, and the first draft of this function lifted them — which
 * put a vacancy closing on 2 October above one closing that afternoon,
 * on a board whose sort control said "Closing soonest". A list that
 * does not obey its own sort is broken however well the promotion
 * pays. Featured listings get their own strip above the board instead,
 * where they are labelled as promotions and cannot lie about the
 * ordering of anything.
 */
export function compareListings(
  a: Listing,
  b: Listing,
  mode: SortMode,
): number {
  if (a.closed !== b.closed) return a.closed ? 1 : -1;

  if (a.closed && b.closed) {
    // Most recently closed first — the ones somebody might still
    // remember seeing.
    if (a.closes !== b.closes) return a.closes < b.closes ? 1 : -1;
    return a.id < b.id ? -1 : 1;
  }

  switch (mode) {
    case "closing":
      if (a.closes !== b.closes) return a.closes < b.closes ? -1 : 1;
      break;
    case "newest":
      if (a.posted !== b.posted) return a.posted < b.posted ? 1 : -1;
      break;
    case "pay": {
      const av = a.payFrom ?? Number.NEGATIVE_INFINITY;
      const bv = b.payFrom ?? Number.NEGATIVE_INFINITY;
      if (av !== bv) return bv - av;
      break;
    }
  }

  return a.id < b.id ? -1 : 1;
}

/** True when nothing is narrowing the board. */
export function isUnfiltered(filters: Filters): boolean {
  return (
    filters.q.trim() === "" &&
    filters.sectors.length === 0 &&
    filters.contracts.length === 0 &&
    filters.patterns.length === 0 &&
    filters.floor === 0 &&
    !filters.includeClosed
  );
}

/** How many separate things the reader has narrowed by. */
export function activeFilterCount(filters: Filters): number {
  return (
    (filters.q.trim() ? 1 : 0) +
    filters.sectors.length +
    filters.contracts.length +
    filters.patterns.length +
    (filters.floor > 0 ? 1 : 0) +
    (filters.includeClosed ? 1 : 0)
  );
}
