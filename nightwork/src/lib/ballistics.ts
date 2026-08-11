/**
 * The model. What is in the sky, and when it had to leave the ground.
 *
 * THE ONE INVERSION. A display is written as a list of moments the
 * audience is meant to see — a break at 7:12, another at 7:12, a third
 * at 7:12. But a shell takes time to climb, and a big shell takes much
 * longer than a small one, so the FIRING times of those three are all
 * different. Everything else in this file falls out of that one line:
 *
 *     fire = break − lift
 *
 * The cue sheet a crew works from and the sky an audience watches are
 * therefore two different documents, and the site draws both.
 *
 * NO DATE. Every instant here is an integer number of TENTHS of a
 * second measured from the show's announced start, which can go
 * negative — a twelve-inch shell that breaks four seconds in was fired
 * before the show began. Integers because a show is a script and floats
 * accumulate; tenths because that is the resolution a firing system
 * works to. `scripts/check-show.mjs` asserts that no `Date` appears
 * anywhere in `src`, and runs under three timezones.
 *
 * Zero runtime imports, so the checker loads this module rather than a
 * copy of it.
 */

import type { EmissionId } from "./emission";

/** Sea-level speed of sound, m/s. The number the whole sync argument turns on. */
export const SPEED_OF_SOUND = 343;

/**
 * NFPA 1123's rule for a display site: 70 feet of clear radius for every
 * inch of shell diameter, which is 21.3 metres. Rounded to 21 because
 * nobody has ever measured a firing site to a third of a metre.
 */
export const SAFETY_METRES_PER_INCH = 21;

/** Audio and vision drift apart to a viewer at about a tenth of a second. */
export const SYNC_TOLERANCE_TENTHS = 1;

export interface Shell {
  id: string;
  name: string;
  /** Shell diameter in inches. The trade measures in inches everywhere. */
  sizeInches: number;
  /** Height of the break, in metres. Roughly 30m per inch, as it happens. */
  altitudeM: number;
  /** Time from ignition to break, in tenths. The number that does the work. */
  liftTenths: number;
  /** Diameter of the burst, in metres. */
  burstM: number;
  /** How long the stars burn after the break, in tenths. */
  burnTenths: number;
  /** How many stars are in it. */
  stars: number;
  /** Which emitters those stars use. */
  emissions: readonly EmissionId[];
  /** Peony, chrysanthemum, willow, crossette, ring. */
  effect: string;
  costUsd: number;
  note: string;
}

export interface Segment {
  id: string;
  label: string;
  /** When the FIRST shell in this segment breaks, in tenths from zero. */
  atTenths: number;
  shellId: string;
  count: number;
  /** Gap between consecutive breaks, in tenths. Zero means all together. */
  spacingTenths: number;
  /** Override the shell's own break height — a low front, a high finale. */
  altitudeM?: number;
  note?: string;
}

export interface Show {
  slug: string;
  title: string;
  client: string;
  siteId: string;
  /** Metres from the firing line to the nearest spectator. */
  crowdM: number;
  /**
   * Whether the script is timed so the LIGHT lands on the beat or the
   * SOUND does. You cannot have both, and which one you pick is the most
   * consequential decision in a scripted show.
   */
  cueTo: "light" | "sound";
  segments: readonly Segment[];
  standfirst: string;
  notes: readonly string[];
}

export interface Cue {
  id: string;
  segmentId: string;
  shellId: string;
  /** Position within its segment, from zero. */
  index: number;
  /** When the audience sees it, in tenths from zero. */
  breakTenths: number;
  /** When the crew fires it. Can be negative. */
  fireTenths: number;
  altitudeM: number;
}

/* ── Time ──────────────────────────────────────────────────────────── */

export function seconds(tenths: number): number {
  return tenths / 10;
}

/**
 * `7:12.4`, and `−0:04.3` for anything before the announced start.
 * A true minus sign, because these appear in a technical document
 * beside figures and a hyphen sets too short next to a digit.
 */
export function clock(tenths: number): string {
  const sign = tenths < 0 ? "−" : "";
  const abs = Math.abs(tenths);
  const m = Math.floor(abs / 600);
  const s = Math.floor((abs % 600) / 10);
  const t = abs % 10;
  return `${sign}${m}:${String(s).padStart(2, "0")}.${t}`;
}

/** `1:24` — no tenths, for durations and axis labels. */
export function clockCoarse(tenths: number): string {
  const sign = tenths < 0 ? "−" : "";
  const abs = Math.round(Math.abs(tenths) / 10);
  return `${sign}${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, "0")}`;
}

/* ── Deterministic scatter ─────────────────────────────────────────── */

/**
 * A real run of twenty shells does not break at exactly one height —
 * lift charges vary, and the line in the sky has a wobble in it. This
 * reproduces that without `Math.random`, which would re-roll the sky on
 * every render and make every number on the page unassertable.
 */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/** ±4% on the break height, stable for a given cue id. */
export function scatter(id: string, altitudeM: number): number {
  return Math.round(altitudeM * (0.96 + hash(id) * 0.08));
}

/* ── The inversion ─────────────────────────────────────────────────── */

export function shellById(shells: readonly Shell[], id: string): Shell {
  const found = shells.find((s) => s.id === id);
  if (!found) throw new Error(`unknown shell: ${id}`);
  return found;
}

/** Every shell in a show, in the order the audience sees them. */
export function expandShow(show: Show, shells: readonly Shell[]): Cue[] {
  const cues: Cue[] = [];
  for (const segment of show.segments) {
    const shell = shellById(shells, segment.shellId);
    for (let i = 0; i < segment.count; i += 1) {
      const id = `${show.slug}/${segment.id}/${i}`;
      const breakTenths = segment.atTenths + i * segment.spacingTenths;
      cues.push({
        id,
        segmentId: segment.id,
        shellId: segment.shellId,
        index: i,
        breakTenths,
        fireTenths: breakTenths - shell.liftTenths,
        altitudeM: scatter(id, segment.altitudeM ?? shell.altitudeM),
      });
    }
  }
  return cues.sort((a, b) => a.breakTenths - b.breakTenths || a.id.localeCompare(b.id));
}

/** The earliest match touched. Negative on any show that opens big. */
export function firstFire(cues: readonly Cue[]): number {
  return cues.reduce((min, c) => Math.min(min, c.fireTenths), 0);
}

/** The last light out of the sky — the break plus the burn. */
export function lastLight(cues: readonly Cue[], shells: readonly Shell[]): number {
  return cues.reduce(
    (max, c) => Math.max(max, c.breakTenths + shellById(shells, c.shellId).burnTenths),
    0,
  );
}

/** Shells that have left the mortar and have not yet broken. */
export function inAirAt(cues: readonly Cue[], atTenths: number): Cue[] {
  return cues.filter((c) => c.fireTenths <= atTenths && c.breakTenths > atTenths);
}

/**
 * The most shells ever in the air at once, which is what actually sizes
 * a firing system — every one of them is a live circuit.
 *
 * Only firing instants can raise the count, so those are the only
 * candidates worth testing.
 */
export function peakInAir(cues: readonly Cue[]): { count: number; atTenths: number } {
  let best = { count: 0, atTenths: 0 };
  for (const c of cues) {
    const count = inAirAt(cues, c.fireTenths).length;
    if (count > best.count) best = { count, atTenths: c.fireTenths };
  }
  return best;
}

/** The busiest second in the sky, counted in breaks. */
export function peakRate(cues: readonly Cue[]): { breaks: number; atTenths: number } {
  let best = { breaks: 0, atTenths: 0 };
  for (const c of cues) {
    const breaks = cues.filter(
      (o) => o.breakTenths >= c.breakTenths && o.breakTenths < c.breakTenths + 10,
    ).length;
    if (breaks > best.breaks) best = { breaks, atTenths: c.breakTenths };
  }
  return best;
}

export interface Simultaneous {
  atTenths: number;
  cues: Cue[];
  /** How far apart the crew fired them. The headline number. */
  spreadTenths: number;
}

/**
 * Shells that break together but were fired apart.
 *
 * This is the site's whole argument in one function, so it deliberately
 * only returns groups where the firing times genuinely differ — a run of
 * identical shells breaking together were also fired together and
 * proves nothing.
 */
export function simultaneousGroups(cues: readonly Cue[]): Simultaneous[] {
  const byBreak = new Map<number, Cue[]>();
  for (const c of cues) {
    const list = byBreak.get(c.breakTenths);
    if (list) list.push(c);
    else byBreak.set(c.breakTenths, [c]);
  }
  const groups: Simultaneous[] = [];
  for (const [atTenths, group] of byBreak) {
    if (group.length < 2) continue;
    const fires = group.map((c) => c.fireTenths);
    const spreadTenths = Math.max(...fires) - Math.min(...fires);
    if (spreadTenths === 0) continue;
    groups.push({ atTenths, cues: group, spreadTenths });
  }
  return groups.sort((a, b) => b.spreadTenths - a.spreadTenths || a.atTenths - b.atTenths);
}

/* ── What it is made of ────────────────────────────────────────────── */

export interface EmissionShare {
  id: EmissionId;
  /** Star-tenths: how much burning of this colour the show contains. */
  starTenths: number;
  costUsd: number;
  /** Share of the show's total star-tenths, 0–1. */
  share: number;
}

/**
 * A shell's output and price, split evenly across the emitters in it.
 * Even is a simplification and an honest one: a two-colour star is
 * genuinely half of each, and weighting it any other way would be
 * inventing precision.
 */
export function emissionBudget(
  cues: readonly Cue[],
  shells: readonly Shell[],
): EmissionShare[] {
  const tally = new Map<EmissionId, { starTenths: number; costUsd: number }>();
  for (const c of cues) {
    const shell = shellById(shells, c.shellId);
    const n = shell.emissions.length;
    for (const id of shell.emissions) {
      const row = tally.get(id) ?? { starTenths: 0, costUsd: 0 };
      row.starTenths += (shell.stars / n) * shell.burnTenths;
      row.costUsd += shell.costUsd / n;
      tally.set(id, row);
    }
  }
  const total = [...tally.values()].reduce((sum, r) => sum + r.starTenths, 0);
  return [...tally.entries()]
    .map(([id, r]) => ({
      id,
      starTenths: Math.round(r.starTenths),
      costUsd: Math.round(r.costUsd),
      share: total === 0 ? 0 : r.starTenths / total,
    }))
    .sort((a, b) => b.starTenths - a.starTenths);
}

export function totalCost(cues: readonly Cue[], shells: readonly Shell[]): number {
  return cues.reduce((sum, c) => sum + shellById(shells, c.shellId).costUsd, 0);
}

/**
 * An emitter has to be at least this much of a show before it is allowed
 * to be what the show is ABOUT.
 *
 * This floor was not in the first version and the model immediately
 * proved it necessary. Harbour Nine contains six orange shells out of
 * three hundred and four — 0.8% of its light — and orange is so rare
 * across the rest of the work that those six gave it the highest
 * over-representation ratio of any emitter by a wide margin. The
 * function was working exactly as specified and the answer was that a
 * ten-minute harbour display is an orange show.
 */
export const SIGNATURE_FLOOR = 0.1;

/**
 * The emitter this show is unusually full of, measured against the rest
 * of the work rather than against itself.
 *
 * Asking which emitter is BIGGEST would answer "gold" for almost every
 * show ever fired, which is the site's own argument and therefore says
 * nothing about any particular night. Asking which is most
 * over-represented says what the client actually paid for — provided it
 * is asked only of emitters that are actually present in quantity.
 */
export function signatureEmission(
  show: readonly EmissionShare[],
  fleet: readonly EmissionShare[],
  floor = SIGNATURE_FLOOR,
): EmissionId {
  const baseline = new Map(fleet.map((r) => [r.id, r.share]));
  let best: { id: EmissionId; ratio: number } | null = null;
  for (const row of show) {
    if (row.share < floor) continue;
    const base = baseline.get(row.id) ?? 0;
    const ratio = base === 0 ? Infinity : row.share / base;
    if (!best || ratio > best.ratio) best = { id: row.id, ratio };
  }
  // A show with nothing above the floor is a genuinely even one, and
  // the honest answer for an even show is the trade's default colour.
  return best?.id ?? "gold";
}

/* ── The site ──────────────────────────────────────────────────────── */

/** How late the bang arrives, in tenths, at a given distance. */
export function soundDelayTenths(distanceM: number): number {
  return Math.round((distanceM / SPEED_OF_SOUND) * 10);
}

export function safetyRadiusM(sizeInches: number): number {
  return Math.round(sizeInches * SAFETY_METRES_PER_INCH);
}

/** The biggest shell a site of a given clear radius may legally fire. */
export function largestShellFor(radiusM: number): number {
  return Math.floor(radiusM / SAFETY_METRES_PER_INCH);
}

/** Whether an audience at this distance can tell the flash and the bang apart. */
export function syncIsAudible(distanceM: number): boolean {
  return soundDelayTenths(distanceM) > SYNC_TOLERANCE_TENTHS;
}
