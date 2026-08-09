import { days, rooms, topics } from "@/content/site";
import type { RoomId } from "@/content/types";

/**
 * The schedule's state lives in the URL, so every narrowing is a link.
 *
 * That means the back button steps through your filters, a refresh
 * keeps them, a filtered day can be pasted into an email, and — the
 * part that actually matters for a conference — the whole thing works
 * with scripting off, on the venue wifi, on a phone with 4% battery.
 */

export type RawParams = Record<string, string | string[] | undefined>;

export interface Filters {
  day: number;
  roomIds: RoomId[];
  topic: string | null;
}

const ALL_ROOMS = rooms.map((r) => r.id);

export function toSearchParams(raw: RawParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  return params;
}

export function parseFilters(params: URLSearchParams): Filters {
  const rawDay = Number(params.get("day"));
  const day = days.some((d) => d.n === rawDay) ? rawDay : days[0].n;

  const rawRooms = (params.get("rooms") ?? "")
    .split(",")
    .filter((id): id is RoomId => (ALL_ROOMS as string[]).includes(id));

  const rawTopic = params.get("topic");
  const topic = rawTopic && topics.includes(rawTopic) ? rawTopic : null;

  // An empty or unrecognised room list means "all of them", not "none".
  // The other reading is technically defensible and produces a blank
  // page for anyone who hand-edits the URL, which is not a trade worth
  // making for a filter.
  return { day, roomIds: rawRooms.length > 0 ? rawRooms : ALL_ROOMS, topic };
}

function build(params: URLSearchParams): string {
  const query = params.toString();
  return query ? `/schedule?${query}` : "/schedule";
}

export function hrefForDay(params: URLSearchParams, day: number): string {
  const next = new URLSearchParams(params);
  next.set("day", String(day));
  return build(next);
}

/** Toggling the last room on would mean "none", which parseFilters reads
 *  as "all" — so removing the final room clears the filter instead, and
 *  the UI shows every room selected again. Same destination, and it
 *  cannot leave anyone staring at an empty grid. */
export function hrefForRoom(
  params: URLSearchParams,
  filters: Filters,
  id: RoomId,
): string {
  const next = new URLSearchParams(params);
  const on = filters.roomIds.includes(id);
  const selected = on
    ? filters.roomIds.filter((r) => r !== id)
    : [...filters.roomIds, id];

  if (selected.length === 0 || selected.length === ALL_ROOMS.length) {
    next.delete("rooms");
  } else {
    next.set("rooms", ALL_ROOMS.filter((r) => selected.includes(r)).join(","));
  }
  return build(next);
}

export function hrefForTopic(
  params: URLSearchParams,
  topic: string | null,
): string {
  const next = new URLSearchParams(params);
  if (topic === null) next.delete("topic");
  else next.set("topic", topic);
  return build(next);
}

export function hrefCleared(params: URLSearchParams): string {
  const next = new URLSearchParams();
  const day = params.get("day");
  if (day) next.set("day", day);
  return build(next);
}

export function activeFilterCount(filters: Filters): number {
  return (
    (filters.roomIds.length === ALL_ROOMS.length ? 0 : 1) +
    (filters.topic ? 1 : 0)
  );
}
