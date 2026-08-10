/**
 * Every content shape in the studio, in one place.
 *
 * Two units and no others: centimetres for anything physical, and a day
 * index for anything in time. There is no `Date` in this application —
 * see the note above `TODAY` in `site.ts`.
 */

/** A firing programme. Not a kiln — several kilns may run the same one. */
export type Program = {
  id: string;
  /** What the board calls it. */
  name: string;
  /** Orton cone, which is what a potter actually says. */
  cone: string;
  /** Peak temperature, °C. */
  peak: number;
  atmosphere: "oxidation" | "reduction";
  /** How long the schedule runs, hours, ignition to switch-off. */
  hours: number;
  /** How long the kiln then takes to come down far enough to open. */
  coolHours: number;
  /** What this firing is FOR, in a sentence. */
  note: string;
};

/**
 * One slot in the studio's fortnightly rota.
 *
 * `day` indexes a 14-day cycle rather than a week, so a fortnightly
 * firing is one entry and a weekly one is two. Every kiln pattern in the
 * studio is expressible without a second mechanism.
 */
export type Slot = {
  /** 0–13, counted from the Monday the cycle starts. */
  day: number;
  programId: string;
};

export type Kiln = {
  id: string;
  name: string;
  fuel: "electric" | "gas";
  /** Interior, cm. A box: these are all front- or top-loaders. */
  width: number;
  depth: number;
  height: number;
  /** A kiln shelf is a slab of refractory and it is not thin. */
  shelfThickness: number;
  /** Air a piece needs above it before the next shelf goes on. */
  clearance: number;
  /**
   * The fraction of the interior that has to be spoken for before the
   * studio will light it. A kiln costs the same empty as full, so this
   * is the whole reason anybody waits for anything here.
   */
  minLoad: number;
  /** Energy per firing, in this kiln's own unit. */
  energy: { unit: "kWh" | "kg"; perFiring: number };
  rota: Slot[];
  note: string;
};

export type Glaze = {
  id: string;
  name: string;
  programId: string;
  /** What it looks like when it comes out. */
  colour: string;
  /** How it behaves in the firing, which is what a member needs to know. */
  behaviour: string;
};

export type Member = {
  id: string;
  name: string;
  /** Initials, drawn rather than photographed — CONVENTIONS §6. */
  initials: string;
  since: string;
  shelf: string;
};

/**
 * Where a piece has got to.
 *
 * `bisqued` with no glaze chosen is a real and common state, and it is
 * the one the studio cannot do anything about: the kiln is not the thing
 * holding it up.
 */
export type PieceState = "greenware" | "bisqued" | "glazed" | "collected";

export type Piece = {
  id: string;
  name: string;
  memberId: string;
  method: "thrown" | "handbuilt" | "slipcast";
  /** Bounding box, cm. A loader thinks in boxes even about round pots. */
  width: number;
  depth: number;
  height: number;
  state: PieceState;
  /** Null until the member has decided. Required once `glazed`. */
  glazeId: string | null;
  /** Day index it went on the shelf. */
  madeOn: number;
  note?: string;
};

/** A firing that has already happened. History, not derivation. */
export type PastFiring = {
  id: string;
  kilnId: string;
  programId: string;
  day: number;
  /** How many pieces were actually in it. */
  total: number;
  /** Which of them are still on the studio's books. */
  loaded: string[];
  /** Sampled from the controller, (hours from ignition, °C). */
  log: [number, number][];
  note?: string;
};
