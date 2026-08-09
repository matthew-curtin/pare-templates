import type { InboxView, Status } from "../content/types";

/**
 * Which conversations a view shows, and in what order.
 *
 * No runtime imports, for the same reason as `sla.ts`: matching and
 * ordering are the parts that can be quietly wrong — a comparator that
 * is not a total order re-shuffles rows on every render, and a search
 * that requires the tokens in order finds nothing for a perfectly
 * sensible query. Both are checked directly in `scripts/check-sla.mjs`.
 */

/** The minimum a conversation has to expose to be matched by a view. */
export interface Viewable {
  status: Status;
  assigneeId: string | null;
}

export function matchesView(
  conversation: Viewable,
  view: InboxView,
  currentMemberId: string,
): boolean {
  if (view.status !== "all" && conversation.status !== view.status) {
    return false;
  }
  if (view.assignee === "me") {
    return conversation.assigneeId === currentMemberId;
  }
  if (view.assignee === "unassigned") {
    return conversation.assigneeId === null;
  }
  return true;
}

/**
 * Every token has to appear somewhere, in any order.
 *
 * "kerr refund" should find the refund thread from Fiona Kerr even
 * though those two words never sit together in it — which a plain
 * `haystack.includes(query)` cannot do, and which is how people
 * actually search an inbox: one word they remember from the subject and
 * one from the name.
 */
export function matchesQuery(haystack: string, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = haystack.toLowerCase();
  return tokens.every((token) => hay.includes(token));
}

export type SortMode = "newest" | "urgent";

/** The minimum a conversation has to expose to be ordered. */
export interface Sortable {
  id: string;
  /** Epoch ms of the most recent message. */
  lastActivityAt: number;
  /** From `msLeftOf` — negative once past, `null` when no clock runs. */
  msLeft: number | null;
}

/**
 * Order two conversations.
 *
 * "Newest" is the obvious one. "Most urgent" is not: it puts everything
 * with a running clock above everything without one, most overdue
 * first, and only then falls back to recency for the conversations that
 * owe nothing. Sorting purely on `msLeft` would bury a conversation
 * that is four hours late underneath one that was answered a minute
 * ago, because "no clock" has no natural position on that scale.
 *
 * Both modes tie-break on `id`, which is what makes this a total order.
 * Without it, two conversations sharing a timestamp — which the seed
 * data does not do, but a template someone has edited very well might —
 * swap places on every re-render.
 */
export function compareForSort(
  mode: SortMode,
  a: Sortable,
  b: Sortable,
): number {
  if (mode === "urgent") {
    const aClock = a.msLeft !== null;
    const bClock = b.msLeft !== null;
    if (aClock !== bClock) return aClock ? -1 : 1;
    if (aClock && bClock && a.msLeft !== b.msLeft) {
      return (a.msLeft as number) - (b.msLeft as number);
    }
  }
  if (a.lastActivityAt !== b.lastActivityAt) {
    return b.lastActivityAt - a.lastActivityAt;
  }
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
