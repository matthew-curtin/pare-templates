import { INCIDENTS } from "@/content/incidents";
import { SERVICES, serviceById } from "@/content/services";
import {
  NOW,
  budgetSpent,
  burnRate,
  completeMonthsBack,
  creditsOwed,
  dayCells,
  detectMin,
  durationMin,
  impactOn,
  isOpen,
  meanMinutes,
  overlapMinutes,
  quarterConsumedFraction,
  quarterElapsedFraction,
  quarterOf,
  repairMin,
  slowerToNotice,
  stripPeriod,
  tallyStates,
  windowFor,
} from "@/lib/availability";
import type {
  Credit,
  DayCell,
  DayState,
  Incident,
  Period,
  Service,
  WindowResult,
} from "@/lib/availability";

/**
 * Everything the pages read, expanded once at module load.
 *
 * The model is pure and the content is static, so this is a build-time
 * constant in everything but syntax. Nothing on any page computes an
 * availability figure for itself, which is what makes the checker's job
 * possible: there is one place a number can come from.
 *
 * Note the import style. `availability.ts` is deliberately free of runtime
 * imports so that plain node can load it; THIS module is not, because it
 * exists to join the model to the content and node never needs it.
 */

export const CLOCK = NOW;
export const QUARTER = quarterOf(NOW);
export const STRIP = stripPeriod(NOW);

/** How many complete months of credit history we publish. */
export const CREDIT_MONTHS_SHOWN = 6;

export interface ServiceRow {
  service: Service;
  /** The rolling ninety days the strip draws. */
  strip: WindowResult;
  /** Quarter to date — the window the budget is measured over. */
  quarter: WindowResult;
  cells: DayCell[];
  tally: Record<DayState, number>;
  /** Spent ÷ earned. Above 1 is the only genuinely alarming state here. */
  burn: number;
  /** Spent ÷ the WHOLE quarter's allowance. */
  consumed: number;
  /** How far through the quarter this service is. Pairs with `consumed`. */
  elapsed: number;
  /** The worst state currently showing, for the row's status word. */
  live: DayState;
}

function liveState(service: Service, now: number): DayState {
  const open = INCIDENTS.filter(
    (inc) => isOpen(inc, now) && impactOn(inc, service.id) !== undefined,
  );
  if (open.length === 0) return "ok";
  return open.reduce<DayState>(
    (worst, inc) => (worst === "ok" ? inc.severity : worst),
    "ok",
  );
}

function buildRow(service: Service): ServiceRow {
  const cells = dayCells(service, INCIDENTS, NOW);
  return {
    service,
    strip: windowFor(service, INCIDENTS, STRIP, NOW),
    quarter: windowFor(service, INCIDENTS, QUARTER, NOW),
    cells,
    tally: tallyStates(cells),
    burn: burnRate(service, INCIDENTS, NOW),
    consumed: quarterConsumedFraction(service, INCIDENTS, NOW),
    elapsed: quarterElapsedFraction(service, NOW),
    live: liveState(service, NOW),
  };
}

export const BOARD: ServiceRow[] = SERVICES.map(buildRow);

export function rowFor(serviceId: string): ServiceRow {
  const found = BOARD.find((r) => r.service.id === serviceId);
  if (!found) throw new Error(`No board row for ${serviceId}`);
  return found;
}

export function rowBySlug(slug: string): ServiceRow | undefined {
  return BOARD.find((r) => r.service.slug === slug);
}

// ---------------------------------------------------------------------
// Incidents
// ---------------------------------------------------------------------

export interface IncidentSpend {
  service: Service;
  fraction: number;
  note: string;
  /** Impact-weighted minutes this incident cost this service's budget. */
  budgetMin: number;
  /** That spend as a share of the service's whole quarterly allowance. */
  shareOfQuarter: number;
}

export interface IncidentView {
  incident: Incident;
  open: boolean;
  durationMin: number;
  detectMin: number;
  repairMin: number;
  /** True when we took longer to notice than to fix. */
  slowToNotice: boolean;
  spend: IncidentSpend[];
  totalBudgetMin: number;
  services: Service[];
}

export function viewOf(incident: Incident): IncidentView {
  const period = quarterOf(incident.startMin);
  const spend: IncidentSpend[] = incident.impacts.map((impact) => {
    const service = serviceById(impact.serviceId);
    const budgetMin = budgetSpent(
      incident,
      service.id,
      incident.startMin,
      incident.endMin ?? NOW,
      NOW,
    );
    const wholeAllowance = (period.toMin - period.fromMin) * (1 - service.target);
    return {
      service,
      fraction: impact.fraction,
      note: impact.note,
      budgetMin,
      shareOfQuarter: wholeAllowance > 0 ? budgetMin / wholeAllowance : 0,
    };
  });

  return {
    incident,
    open: isOpen(incident, NOW),
    durationMin: durationMin(incident, NOW),
    detectMin: detectMin(incident),
    repairMin: repairMin(incident, NOW),
    slowToNotice:
      incident.severity !== "maintenance" &&
      incident.endMin !== null &&
      detectMin(incident) > repairMin(incident, NOW),
    spend,
    totalBudgetMin: spend.reduce((a, s) => a + s.budgetMin, 0),
    services: spend.map((s) => s.service),
  };
}

/** Newest first — the order every list on the site uses. */
export const TIMELINE: IncidentView[] = INCIDENTS
  .map(viewOf)
  .sort((a, b) => b.incident.startMin - a.incident.startMin);

export const OPEN_INCIDENTS: IncidentView[] = TIMELINE.filter((v) => v.open);

/** The incidents the strip can actually draw. */
export const IN_STRIP: IncidentView[] = TIMELINE.filter(
  (v) => overlapMinutes(v.incident, STRIP.fromMin, STRIP.toMin, NOW) > 0,
);

export function incidentsForService(serviceId: string): IncidentView[] {
  return TIMELINE.filter((v) => impactOn(v.incident, serviceId) !== undefined);
}

export function viewBySlug(slug: string): IncidentView | undefined {
  return TIMELINE.find((v) => v.incident.slug === slug);
}

// ---------------------------------------------------------------------
// Credits
// ---------------------------------------------------------------------

export const CREDIT_MONTHS: Period[] = completeMonthsBack(NOW, CREDIT_MONTHS_SHOWN);
export const CREDITS: Credit[] = creditsOwed(SERVICES, INCIDENTS, CREDIT_MONTHS, NOW);

export const CREDIT_TOTAL_USD = CREDITS.reduce((a, c) => a + c.usd, 0);
export const CREDIT_CLAIMABLE_USD = CREDITS
  .filter((c) => c.claimable)
  .reduce((a, c) => a + c.usd, 0);
export const CREDIT_EXPIRED_USD = CREDIT_TOTAL_USD - CREDIT_CLAIMABLE_USD;

/** What the reference customer on /sla pays for everything, monthly. */
export const REFERENCE_SPEND_USD = SERVICES.reduce((a, s) => a + s.monthlyUsd, 0);

/** Highest band any published month has reached. The 50% band has not been. */
export const WORST_BAND_REACHED = CREDITS.reduce((a, c) => Math.max(a, c.percent), 0);

// ---------------------------------------------------------------------
// Fleet-level readings
// ---------------------------------------------------------------------

const CLOSED_OUTAGES = TIMELINE.filter(
  (v) => v.incident.severity !== "maintenance" && !v.open,
);

export const FLEET = {
  incidents: INCIDENTS.length,
  maintenance: INCIDENTS.filter((i) => i.severity === "maintenance").length,
  inStrip: IN_STRIP.length,
  meanDetectMin: meanMinutes(CLOSED_OUTAGES.map((v) => v.detectMin)),
  meanRepairMin: meanMinutes(CLOSED_OUTAGES.map((v) => v.repairMin)),
  customerReported: TIMELINE.filter((v) => v.incident.detectedBy === "customer").length,
  slowerToNotice: slowerToNotice(INCIDENTS, NOW).length,
  /** Budget minutes every service has spent this quarter, added up. */
  quarterSpendMin: BOARD.reduce((a, r) => a + r.quarter.lostMin, 0),
};

/** Services whose burn rate is above 1 — on pace to break the promise. */
export const OVER_BUDGET: ServiceRow[] = BOARD.filter((r) => r.burn > 1);

/** Services with a clean ninety days. */
export const UNBROKEN: ServiceRow[] = BOARD.filter((r) => r.strip.lostMin === 0 && !r.strip.partial);

/**
 * The pair the front page argues with: the longest incident in the strip
 * against the most expensive one, which are deliberately not the same.
 */
export const LONGEST_IN_STRIP: IncidentView = IN_STRIP
  .filter((v) => v.incident.severity !== "maintenance")
  .reduce((a, b) => (b.durationMin > a.durationMin ? b : a));

export const COSTLIEST_IN_STRIP: IncidentView = IN_STRIP
  .reduce((a, b) => (b.totalBudgetMin > a.totalBudgetMin ? b : a));
