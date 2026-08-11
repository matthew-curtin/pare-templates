/**
 * Every content shape, in one place. CONVENTIONS §3.
 *
 * Types only — no values — so `src/lib/*.ts` can `import type` from here
 * and still be importable by a plain node script. Type imports erase, so
 * the `@/` alias node cannot resolve never reaches node.
 */

/** What the thing is actually offering you in its season. A garden that
 *  only counts flowers has nothing to say between October and February,
 *  which is how a website ends up showing you July. */
export type InterestKind = "flower" | "scent" | "leaf" | "bark" | "fruit" | "form";

export type Accession = {
  /** Real gardens number by year of accession and sequence. Two plants
   *  of the same species from different collections are different rows. */
  id: string;
  slug: string;
  /** Botanical name, which is the one the label in the ground carries. */
  name: string;
  common: string | null;
  family: string;
  /** Which area of the garden it is standing in. */
  area: string;
  kind: InterestKind;
  /** The window, in week numbers, and it may wrap the year: witch hazel
   *  opens in week 51 and finishes in week 8. Every piece of arithmetic
   *  in `lib/season.ts` treats these as circular for that reason. */
  from: number;
  peak: number;
  to: number;
  /** What it is worth at its peak, 1–10. This is a judgement the garden
   *  is making out loud, which is the whole conceit of the site. */
  strength: number;
  /** The colour of the thing itself, as OKLCH. Drives the tile when
   *  there is no photograph — so the wall is photographs AND colour
   *  rather than photographs and gaps. */
  colour: string;
  /** Wild provenance, where the garden has it. Botanic gardens care
   *  about this far more than nurseries do, and it is the difference
   *  between a collection and a planting. */
  origin: string;
  planted: number;
  note: string;
  /** Set when the plant carries a photograph; the key into `photos`. */
  photo: string | null;
};

export type Area = {
  slug: string;
  name: string;
  /** Where it sits, in a sentence a visitor could follow. */
  where: string;
  blurb: string;
  /** The honest one — what this part of the garden is like when nothing
   *  in it is doing anything. */
  outOfSeason: string;
  minutes: number;
  photo: string | null;
};

export type Photo = {
  key: string;
  file: string;
  alt: string;
  /** The narrative job, per CONVENTIONS §6 — what this frame is FOR.
   *  Printed in CREDITS.md and asserted by the checker, so a photograph
   *  nobody could name a reason for cannot quietly ship. */
  job: string;
  week: number;
};

export type Visit = {
  label: string;
  detail: string;
};

export type YearNote = {
  week: number;
  text: string;
};
