import { trackOf } from "../content/library.ts";
import { spotById } from "../content/spots.ts";
import type { Placed } from "./schedule.ts";

/**
 * How an element reads on the log.
 *
 * One function rather than a branch inside every component, because the
 * same element appears on four pages and it should say the same thing on
 * all of them. `kind` is what the row is; `title` and `by` are what a
 * person would call it out as.
 */
export type Described = {
  kind: string;
  title: string;
  by: string | null;
  /** Seconds of intro to talk over. Only records have one. */
  ramp: number | null;
  trackId: string | null;
  spotId: string | null;
};

const KIND_LABEL: Record<string, string> = {
  music: "Record",
  link: "Link",
  ident: "ID",
  spot: "Underwriting",
  promo: "Promo",
  news: "Speech",
  feature: "Feature",
  network: "Network",
};

export function describe(placed: Placed): Described {
  const element = placed.element;

  if (element.kind === "music" && element.ref) {
    const track = trackOf(element.ref);
    if (track) {
      return {
        kind: KIND_LABEL.music,
        title: track.title,
        by: track.artist,
        ramp: track.ramp,
        trackId: track.id,
        spotId: null,
      };
    }
  }

  if (element.kind === "spot" && element.ref) {
    const spot = spotById.get(element.ref);
    if (spot) {
      return {
        kind: KIND_LABEL.spot,
        title: spot.underwriter,
        by: null,
        ramp: null,
        trackId: null,
        spotId: spot.id,
      };
    }
  }

  return {
    kind: KIND_LABEL[element.kind] ?? element.kind,
    title: element.title ?? "—",
    by: null,
    ramp: null,
    trackId: null,
    spotId: null,
  };
}
