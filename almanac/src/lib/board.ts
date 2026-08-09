import { employerById } from "@/content/employers";
import { now, payBasis, thresholds, ZONE } from "@/content/site";
import type { Employer, Vacancy } from "@/content/types";
import { vacancies } from "@/content/vacancies";
import { closingState, isClosed, isNew, type Closing } from "./dates";
import { annualise, type Annual } from "./pay";
import {
  compareListings,
  matchesFilters,
  toListing,
  type Filters,
  type Listing,
  type SortMode,
} from "./filters";

/**
 * The glue. Everything here has runtime imports and is therefore the
 * part the checker does not touch — which is deliberate: the decisions
 * worth checking live in pay.ts, dates.ts and filters.ts, and this file
 * only feeds them.
 */

export const nowMs = Date.parse(now);

export interface BoardItem {
  vacancy: Vacancy;
  employer: Employer;
  annual: Annual | null;
  closing: Closing;
  fresh: boolean;
  listing: Listing;
}

function toItem(vacancy: Vacancy): BoardItem {
  const employer = employerById.get(vacancy.employerId);
  if (!employer) {
    throw new Error(`Vacancy ${vacancy.id} names an employer that does not exist`);
  }
  const annual = annualise(vacancy.pay, vacancy.hours, payBasis);
  const closed = isClosed(vacancy.closes, nowMs, ZONE);
  return {
    vacancy,
    employer,
    annual,
    closing: closingState(vacancy.closes, nowMs, ZONE, thresholds.closingWithin),
    fresh: !closed && isNew(vacancy.posted, nowMs, ZONE, thresholds.newFor),
    listing: toListing({
      ...vacancy,
      employerName: employer.name,
      employerKind: employer.kind,
      closed,
      payFrom: annual?.min ?? null,
      payTo: annual?.max ?? null,
    }),
  };
}

export const boardItems: BoardItem[] = vacancies.map(toItem);

export const itemBySlug = new Map(
  boardItems.map((item) => [item.vacancy.slug, item]),
);

export const openItems = boardItems.filter((item) => !item.listing.closed);

export function itemsForEmployer(employerId: string): BoardItem[] {
  return boardItems
    .filter((item) => item.vacancy.employerId === employerId)
    .sort((a, b) => compareListings(a.listing, b.listing, "closing"));
}

export function selectItems(filters: Filters, mode: SortMode): BoardItem[] {
  return boardItems
    .filter((item) => matchesFilters(item.listing, filters))
    .sort((a, b) => compareListings(a.listing, b.listing, mode));
}

/**
 * The promotions, shown as their own strip above an unfiltered board
 * rather than lifted into it. See the note on compareListings.
 */
export const featuredItems = boardItems
  .filter((item) => item.listing.featured && !item.listing.closed)
  .sort((a, b) => compareListings(a.listing, b.listing, "closing"));

/** How many current vacancies a set of filters would catch. */
export function countMatches(filters: Filters): number {
  return boardItems.filter((item) => matchesFilters(item.listing, filters))
    .length;
}

/* ---------- the query string ---------- */

export type RawParams = Record<string, string | string[] | undefined>;

export function toSearchParams(params: RawParams): URLSearchParams {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    for (const one of Array.isArray(value) ? value : [value]) {
      if (one !== "") search.append(key, one);
    }
  }
  return search;
}

const SORTS: SortMode[] = ["closing", "newest", "pay"];

export function parseSort(search: URLSearchParams): SortMode {
  const value = search.get("sort");
  return SORTS.includes(value as SortMode) ? (value as SortMode) : "closing";
}

export function parseFilters(search: URLSearchParams): Filters {
  const floor = Number.parseInt(search.get("min") ?? "", 10);
  return {
    q: search.get("q") ?? "",
    sectors: search.getAll("sector"),
    contracts: search.getAll("contract"),
    patterns: search.getAll("pattern"),
    floor: Number.isFinite(floor) && floor > 0 ? floor : 0,
    includeClosed: search.get("closed") === "1",
  };
}

/**
 * A link that adds or removes one value, leaving everything else alone.
 *
 * Filters on this board are links rather than a JavaScript widget, so
 * the back button, a refresh and a shared URL all behave — and the
 * board still works with scripting turned off, which is not a niche
 * concern for a public sector audience.
 */
export function hrefToggle(
  search: URLSearchParams,
  key: string,
  value: string,
  base = "/",
): string {
  const next = new URLSearchParams(search);
  const existing = next.getAll(key);
  next.delete(key);
  for (const one of existing) {
    if (one !== value) next.append(key, one);
  }
  if (!existing.includes(value)) next.append(key, value);
  return withQuery(base, next);
}

export function hrefSet(
  search: URLSearchParams,
  key: string,
  value: string | null,
  base = "/",
): string {
  const next = new URLSearchParams(search);
  next.delete(key);
  if (value !== null && value !== "") next.append(key, value);
  return withQuery(base, next);
}

function withQuery(base: string, search: URLSearchParams): string {
  const query = search.toString();
  return query ? `${base}?${query}` : base;
}
