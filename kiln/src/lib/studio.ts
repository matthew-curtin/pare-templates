import type { Piece } from "../content/types";
import { glazeById, glazes, memberById } from "../content/glazes.ts";
import { kilnById, kilns, programById } from "../content/kilns.ts";
import { pastFirings, pieceById, pieces } from "../content/pieces.ts";
import { HORIZON, TODAY, tariff } from "../content/site.ts";
import { volume } from "./pack.ts";
import type { Firing, Lookup, Reason, Track } from "./schedule.ts";
import { firingCost, needOf, quote, simulate } from "./schedule.ts";

/**
 * The studio, assembled once.
 *
 * Everything below is derived from `src/content` by the model in
 * `pack.ts` and `schedule.ts`. Nothing here is typed in, and no page
 * states a number it could work out — a firing's cost comes from its
 * kiln's energy and the tariff, a piece's share of that cost comes from
 * the space it took, and a wait comes from walking the rota forward.
 */

export const look: Lookup = {
  kiln: (id) => kilnById.get(id),
  program: (id) => programById.get(id),
  glaze: (id) => glazeById.get(id),
};

export const studio = simulate(pieces, kilns, look, TODAY, HORIZON);

export const firings = studio.firings;
export const tracks = studio.tracks;

/** The kilns that are being packed right now, soonest first. */
export const loadingNow = firings.filter((f) => f.status === "loading");

/** Everything not yet collected, in queue-ish order. */
export const waiting = pieces.filter((p) => p.state !== "collected");

export function trackOf(pieceId: string): Track | undefined {
  return tracks.get(pieceId);
}

export function reasonOf(pieceId: string): Reason | undefined {
  return tracks.get(pieceId)?.reason;
}

/** Everything on the shelf, grouped by why it is still there. */
export const byReason = new Map<Reason, Piece[]>();
for (const piece of waiting) {
  const reason = reasonOf(piece.id);
  if (!reason) continue;
  const list = byReason.get(reason) ?? [];
  list.push(piece);
  byReason.set(reason, list);
}

/** What one firing of this kiln costs to run, in pence. */
export function costOf(kilnId: string): number {
  const kiln = kilnById.get(kilnId);
  return kiln ? firingCost(kiln, tariff) : 0;
}

/**
 * A piece's share of a firing, in pence.
 *
 * Divided by the space it took, not by the head count — which is the
 * only division that does not make a mug subsidise an urn.
 */
export function shareOf(firing: Firing, pieceId: string): number | null {
  const piece = pieceById.get(pieceId);
  if (!piece || firing.pieces.length === 0) return null;
  const total = firing.pieces.reduce((n, id) => {
    const p = pieceById.get(id);
    return n + (p ? volume(p) : 0);
  }, 0);
  if (total === 0) return null;
  return (costOf(firing.kilnId) * volume(piece)) / total;
}

/** What this firing would cost each piece if it went as loaded. */
export function perPiece(firing: Firing): number | null {
  if (firing.pieces.length === 0) return null;
  return costOf(firing.kilnId) / firing.pieces.length;
}

export const pieceOf = (id: string) => pieceById.get(id);
export const memberOf = (id: string) => memberById.get(id);
export const glazeOf = (id: string | null) => (id ? glazeById.get(id) : undefined);
export const programOf = (id: string) => programById.get(id);
export const kilnOf = (id: string) => kilnById.get(id);

/** Which past firing a piece went through, newest first. */
export function historyOf(pieceId: string) {
  return pastFirings
    .filter((f) => f.loaded.includes(pieceId))
    .sort((a, b) => b.day - a.day);
}

export const recentFirings = [...pastFirings].sort((a, b) => b.day - a.day);

/** Every piece a member has on the books. */
export function piecesOf(memberId: string): Piece[] {
  return pieces.filter((p) => p.memberId === memberId);
}

/** What a piece needs next, as a programme id, or null. */
export function needOfPiece(piece: Piece): string | null {
  const need = needOf(piece, look);
  return need.kind === "firing" ? need.programId : null;
}

/** Firings grouped by the day they happen, for the rota strip. */
export const firingsByDay = new Map<number, Firing[]>();
for (const firing of firings) {
  const list = firingsByDay.get(firing.day) ?? [];
  list.push(firing);
  firingsByDay.set(firing.day, list);
}

export const firingById = new Map(firings.map((f) => [f.id, f]));

/**
 * The fortnight the studio can honestly speak to.
 *
 * The simulation runs a month so that every piece gets an answer, but it
 * only knows about work that exists today — so past one turn of the rota
 * the firings are empty because nobody has made June's pots yet, not
 * because anything is wrong. The pages show the fortnight in full and
 * say what the rest is.
 */
export const FORTNIGHT_END = TODAY + 14;
export const thisFortnight = firings.filter((f) => f.day <= FORTNIGHT_END);
export const beyondFortnight = firings.filter((f) => f.day > FORTNIGHT_END);

/**
 * What each glaze costs you in days, answered by simulation.
 *
 * One run per glaze, each with the reference mug added to the real
 * shelf — so the answer includes the possibility that your mug is the
 * one that tips a firing over its threshold.
 */
export const glazeQuotes = new Map(
  glazes.map((g) => [g.id, quote(g.id, pieces, kilns, look, TODAY, HORIZON)] as const),
);

/** Days from today, or null when the horizon never reaches it. */
export function quoteDays(glazeId: string): number | null {
  const t = glazeQuotes.get(glazeId);
  return t && t.readyOn !== null ? t.readyOn - TODAY : null;
}

/** The longest quote any glaze carries, for scaling the bars. */
export const worstQuote = Math.max(
  ...glazes.map((g) => quoteDays(g.id) ?? 0),
);

export const onShelf = waiting.length;
export const withoutDate = waiting.filter((p) => trackOf(p.id)?.readyOn == null).length;

/**
 * Pieces with no date BECAUSE a kiln did not light.
 *
 * Deliberately narrower than `withoutDate`, which also counts the five
 * pieces whose maker has not chosen a glaze and the one nothing in the
 * building is tall enough for. The front page originally attributed all
 * of them to the gas kiln in one sentence, which was wrong about six of
 * the eight and would have read as the studio blaming its rota for
 * somebody else's indecision.
 */
export const strandedByLoad = waiting.filter((p) => {
  const track = trackOf(p.id);
  return track !== undefined && track.readyOn === null && track.reason === "empty";
}).length;
