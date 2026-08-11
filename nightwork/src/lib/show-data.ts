import { SHELLS } from "@/content/shells";
import { SHOWS } from "@/content/shows";
import { siteById, type FiringSite } from "@/content/sites";
import type { EmissionId } from "@/lib/emission";
import {
  clock,
  emissionBudget,
  expandShow,
  firstFire,
  lastLight,
  peakInAir,
  peakRate,
  shellById,
  signatureEmission,
  simultaneousGroups,
  soundDelayTenths,
  totalCost,
  type Cue,
  type EmissionShare,
  type Shell,
  type Show,
  type Simultaneous,
} from "@/lib/ballistics";

/**
 * Everything the pages read, expanded once at module load.
 *
 * The model is pure and the content is static, so this is a build-time
 * constant in everything but syntax — which is what lets a page ask for
 * the peak firing rate of a show without anybody having typed it.
 */

export interface ShowData {
  show: Show;
  site: FiringSite;
  cues: Cue[];
  /** Metres — the top of the field's vertical axis for this show. */
  ceilingM: number;
  firstFireTenths: number;
  lastLightTenths: number;
  peakAir: { count: number; atTenths: number };
  peakRate: { breaks: number; atTenths: number };
  /** Break-together, fired-apart groups, deepest spread first. */
  salvos: Simultaneous[];
  budget: EmissionShare[];
  signature: EmissionId;
  costUsd: number;
  soundDelayTenths: number;
  /** Whole pounds per minute of show. The number clients compare. */
  costPerMinute: number;
  largestShell: Shell;
}

const ALL_CUES: Cue[] = SHOWS.flatMap((show) => expandShow(show, SHELLS));

/** The colour budget of every display this company has fired. */
export const FLEET_BUDGET: EmissionShare[] = emissionBudget(ALL_CUES, SHELLS);

export const FLEET_TOTALS = {
  shells: ALL_CUES.length,
  costUsd: totalCost(ALL_CUES, SHELLS),
  shows: SHOWS.length,
};

function build(show: Show): ShowData {
  const cues = expandShow(show, SHELLS);
  const budget = emissionBudget(cues, SHELLS);
  const lastLightTenths = lastLight(cues, SHELLS);
  const costUsd = totalCost(cues, SHELLS);
  const shells = cues.map((c) => shellById(SHELLS, c.shellId));
  const largestShell = shells.reduce((a, b) => (b.sizeInches > a.sizeInches ? b : a));
  const topAltitude = cues.reduce((m, c) => Math.max(m, c.altitudeM), 0);
  return {
    show,
    site: siteById(show.siteId),
    cues,
    // Round the ceiling up to a round hundred so the axis has honest
    // labels rather than a top tick at 368 metres.
    ceilingM: Math.ceil((topAltitude * 1.06) / 50) * 50,
    firstFireTenths: firstFire(cues),
    lastLightTenths,
    peakAir: peakInAir(cues),
    peakRate: peakRate(cues),
    salvos: simultaneousGroups(cues),
    budget,
    signature: signatureEmission(budget, FLEET_BUDGET),
    costUsd,
    soundDelayTenths: soundDelayTenths(show.crowdM),
    costPerMinute: Math.round(costUsd / (lastLightTenths / 600)),
    largestShell,
  };
}

export const SHOW_DATA: ShowData[] = SHOWS.map(build);

export function showData(slug: string): ShowData | undefined {
  return SHOW_DATA.find((d) => d.show.slug === slug);
}

/** The deepest break-together-fire-apart group anywhere in the work. */
export const DEEPEST_SALVO: { data: ShowData; salvo: Simultaneous } = SHOW_DATA.map(
  (data) => ({ data, salvo: data.salvos[0] }),
).sort((a, b) => b.salvo.spreadTenths - a.salvo.spreadTenths)[0];

/** Shows whose first cue fires before the announced start. */
export const EARLY_SHOWS = SHOW_DATA.filter((d) => d.firstFireTenths < 0);

/** Which shows use each shell, for the shell pages. */
export function showsUsing(shellId: string): { data: ShowData; count: number }[] {
  return SHOW_DATA.map((data) => ({
    data,
    count: data.cues.filter((c) => c.shellId === shellId).length,
  })).filter((r) => r.count > 0);
}

/**
 * What a thousand star-tenths of each colour costs the company.
 *
 * This is an AGGREGATE and it measures something subtly different from
 * the matched pairs on /colour: it includes the effect as well as the
 * emitter, so green comes out dearest not because barium is dear but
 * because the ring shell is priced for its geometry. Both numbers are
 * published, alongside a sentence saying which is which — an aggregate
 * that quietly conflates two variables is how a true table tells a lie.
 */
export function costOfLight(): { id: EmissionId; perThousand: number; vsGold: number }[] {
  const gold = FLEET_BUDGET.find((r) => r.id === "gold");
  const goldRate = gold ? gold.costUsd / gold.starTenths : 1;
  return FLEET_BUDGET.map((r) => ({
    id: r.id,
    perThousand: (r.costUsd / r.starTenths) * 1000,
    vsGold: r.costUsd / r.starTenths / goldRate,
  })).sort((a, b) => b.vsGold - a.vsGold);
}

export { clock };
