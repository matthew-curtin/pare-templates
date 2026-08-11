/**
 * Availability, error budgets and SLA credits.
 *
 * This module is the whole argument of the site. A status page that
 * publishes a percentage is publishing a score; the interesting number is
 * the BUDGET — how many minutes the promise allows you to lose, how many
 * you have already spent, and how fast you are spending them. Everything
 * on every page comes out of here, so no figure anywhere is typed twice.
 *
 * Two properties are load-bearing and worth not breaking.
 *
 * ZERO RUNTIME IMPORTS. `import type` is erased by node's type stripping,
 * so `node scripts/check-availability.mjs` can load this file directly and
 * check the real arithmetic rather than a copy of it that drifts. The
 * moment this file imports something at runtime, the checker is testing a
 * transcription.
 *
 * NO `Date`, ANYWHERE. Times are integer minutes since 1970-01-01T00:00Z
 * and the calendar arithmetic below is written out longhand. That is what
 * makes the page render identically in Tokyo and in California — see the
 * note on the pinned clock. The checker asserts the absence and runs
 * itself under three timezones.
 */

// ---------------------------------------------------------------------
// Calendar arithmetic
// ---------------------------------------------------------------------

export const MINUTES_PER_DAY = 1440;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** 1970-01-01 was a Thursday, which is why this list starts where it does. */
const WEEKDAYS = [
  "Thursday", "Friday", "Saturday",
  "Sunday", "Monday", "Tuesday", "Wednesday",
];

/**
 * Days from 1970-01-01 for a proleptic Gregorian date (Howard Hinnant's
 * algorithm). Written out rather than delegated so that the whole model
 * stays free of `Date` — see the header.
 */
export function daysFromCivil(y: number, m: number, d: number): number {
  const yy = y - (m <= 2 ? 1 : 0);
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export interface CivilDate {
  y: number;
  m: number;
  d: number;
}

/** The inverse of `daysFromCivil`. */
export function civilFromDays(z: number): CivilDate {
  const zz = z + 719468;
  const era = Math.floor(zz / 146097);
  const doe = zz - era * 146097;
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365,
  );
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp + (mp < 10 ? 3 : -9);
  return { y: y + (m <= 2 ? 1 : 0), m, d };
}

/** Minutes since 1970-01-01T00:00Z for a UTC wall time. */
export function utc(y: number, m: number, d: number, hh = 0, mm = 0): number {
  return daysFromCivil(y, m, d) * MINUTES_PER_DAY + hh * 60 + mm;
}

/** Whole days since 1970-01-01 containing a given minute. */
export function dayOf(min: number): number {
  return Math.floor(min / MINUTES_PER_DAY);
}

export function daysInMonth(y: number, m: number): number {
  return (m === 12 ? daysFromCivil(y + 1, 1, 1) : daysFromCivil(y, m + 1, 1)) - daysFromCivil(y, m, 1);
}

export function weekdayOf(dayIndex: number): string {
  return WEEKDAYS[((dayIndex % 7) + 7) % 7];
}

/** `14 May 2026` */
export function fmtDate(min: number): string {
  const { y, m, d } = civilFromDays(dayOf(min));
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

/** `14 May` — for axis ticks and dense tables. */
export function fmtDateShort(min: number): string {
  const { m, d } = civilFromDays(dayOf(min));
  return `${d} ${MONTH_ABBR[m - 1]}`;
}

/** `May 2026` */
export function fmtMonth(min: number): string {
  const { y, m } = civilFromDays(dayOf(min));
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/** `04:11` — always UTC, always zero-padded. */
export function fmtTime(min: number): string {
  const within = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hh = Math.floor(within / 60);
  const mm = within % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/** `23 Jul 04:11 UTC` */
export function fmtStamp(min: number): string {
  return `${fmtDateShort(min)} ${fmtTime(min)} UTC`;
}

/** `5h 41m`, `22m`, `1d 3h`. Durations are always spoken, never decimal. */
export function fmtDuration(minutes: number): string {
  const t = Math.max(0, Math.round(minutes));
  if (t < 60) return `${t}m`;
  const h = Math.floor(t / 60);
  const m = t % 60;
  if (h < 24) return m === 0 ? `${h}h` : `${h}h ${m}m`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return rh === 0 ? `${d}d` : `${d}d ${rh}h`;
}

/**
 * Budget minutes to one decimal place.
 *
 * Budget is spent fractionally — a 4% impact for an hour costs 2.4
 * minutes — so rounding it to whole minutes would make the two incidents
 * this whole site is built to compare look like the same number.
 */
export function fmtBudget(minutes: number): string {
  return `${(Math.round(minutes * 10) / 10).toFixed(1)} min`;
}

/**
 * Availability as a percentage, to three decimal places.
 *
 * Three, not two: the difference between 99.95% and 99.99% is the
 * difference between an hour a quarter and six minutes a quarter, and a
 * page that rounds to 99.9% has thrown away the only interesting digit.
 */
export function fmtPct(fraction: number, places = 3): string {
  return `${(fraction * 100).toFixed(places)}%`;
}

// ---------------------------------------------------------------------
// The pinned clock
// ---------------------------------------------------------------------

/**
 * The instant every page renders against: 11 August 2026, 09:42 UTC.
 *
 * §7b of the conventions asks for a fixed "now" so the story survives
 * being read six months later. A status page needs it twice over: the
 * open incident below has been running for 45 minutes, one credit claim
 * window closed six weeks ago and another has eighteen days left, and
 * none of that is true on a clock that moves.
 *
 * UTC is not a compromise here, it is the correct answer. An incident
 * timeline is a coordination document written by people in different
 * places, and the whole industry writes them in UTC for that reason —
 * which is a happier position than `support-inbox`, where pinning the
 * display timezone costs realism to keep the story intact.
 */
export const NOW = utc(2026, 8, 11, 9, 42);

/** How many days of history the front page draws. */
export const STRIP_DAYS = 90;

// ---------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------

/**
 * Severity, worst first.
 *
 * `maintenance` sits outside the ordering on purpose: announced work is
 * not an outage, spends no budget, and is drawn in a hue off the ordinal
 * ramp. See `budgetSpent` and the note above the ramp in globals.css.
 */
export type Severity = "major" | "partial" | "degraded" | "maintenance";

export const OUTAGE_SEVERITIES: Severity[] = ["major", "partial", "degraded"];

const SEVERITY_RANK: Record<Severity, number> = {
  major: 3,
  partial: 2,
  degraded: 1,
  maintenance: 0,
};

export function severityRank(s: Severity): number {
  return SEVERITY_RANK[s];
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  major: "Major outage",
  partial: "Partial outage",
  degraded: "Degraded",
  maintenance: "Maintenance",
};

export interface Region {
  id: string;
  code: string;
  city: string;
  country: string;
  liveFrom: number;
  note: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  group: string;
  blurb: string;
  /** The SLO, as a fraction. 0.9995 is "three nines five". */
  target: number;
  /** When this service became generally available. Windows clamp to it. */
  liveFrom: number;
  /** What the reference customer on /sla pays for it monthly, in USD. */
  monthlyUsd: number;
  regionIds: string[];
}

export interface Impact {
  serviceId: string;
  /**
   * The share of requests affected, 0..1.
   *
   * This is the number that makes an error budget mean anything. An hour
   * in which 4% of reads were slow is not an hour of downtime, and a
   * status page that counts it as one is the reason nobody believes
   * status pages.
   */
  fraction: number;
  note: string;
}

export interface IncidentUpdate {
  atMin: number;
  status: "investigating" | "identified" | "monitoring" | "resolved" | "scheduled";
  body: string;
}

export interface Incident {
  id: string;
  slug: string;
  title: string;
  severity: Severity;
  startMin: number;
  /** null while it is still running. */
  endMin: number | null;
  /** When a human or a probe first knew. Never earlier than the start. */
  detectedMin: number;
  /** Which of us noticed. `customer` is the one that stings. */
  detectedBy: "probe" | "alert" | "engineer" | "customer";
  regionIds: string[];
  impacts: Impact[];
  summary: string;
  cause: string;
  fix: string;
  prevention: string[];
  updates: IncidentUpdate[];
}

export interface Period {
  fromMin: number;
  toMin: number;
  label: string;
}

// ---------------------------------------------------------------------
// Overlap and spend
// ---------------------------------------------------------------------

export function endOf(inc: Incident, now: number): number {
  return inc.endMin ?? now;
}

export function isOpen(inc: Incident, now: number): boolean {
  return inc.endMin === null && inc.startMin <= now;
}

export function durationMin(inc: Incident, now: number): number {
  return Math.max(0, endOf(inc, now) - inc.startMin);
}

/** Minutes of an incident that fall inside a window. */
export function overlapMinutes(inc: Incident, fromMin: number, toMin: number, now: number): number {
  const a = Math.max(inc.startMin, fromMin);
  const b = Math.min(endOf(inc, now), toMin);
  return Math.max(0, b - a);
}

export function impactOn(inc: Incident, serviceId: string): Impact | undefined {
  return inc.impacts.find((i) => i.serviceId === serviceId);
}

/**
 * Budget minutes an incident costs one service inside a window.
 *
 * Announced maintenance costs nothing. That is a real clause in a real
 * SLA rather than a convenience: the customer was told, and got the
 * chance to move work, which is the entire difference between planned
 * and unplanned. /sla states it in words next to the arithmetic.
 */
export function budgetSpent(
  inc: Incident,
  serviceId: string,
  fromMin: number,
  toMin: number,
  now: number,
): number {
  if (inc.severity === "maintenance") return 0;
  const impact = impactOn(inc, serviceId);
  if (!impact) return 0;
  return overlapMinutes(inc, fromMin, toMin, now) * impact.fraction;
}

// ---------------------------------------------------------------------
// Windows
// ---------------------------------------------------------------------

export interface WindowResult {
  period: Period;
  /** Clamped to the service's own launch, which is why this can be short. */
  fromMin: number;
  toMin: number;
  totalMin: number;
  lostMin: number;
  availability: number;
  /** Minutes the target permits over `totalMin`. */
  allowanceMin: number;
  remainingMin: number;
  /** Spent ÷ allowed. Above 1 means the promise is already broken. */
  consumed: number;
  meetsTarget: boolean;
  /** True when the service was not alive for the whole window. */
  partial: boolean;
  incidents: Incident[];
}

export function windowFor(
  service: Service,
  incidents: Incident[],
  period: Period,
  now: number,
): WindowResult {
  const fromMin = Math.max(period.fromMin, service.liveFrom);
  const toMin = Math.min(period.toMin, now);
  const totalMin = Math.max(0, toMin - fromMin);

  const touching = incidents.filter(
    (inc) =>
      impactOn(inc, service.id) !== undefined &&
      overlapMinutes(inc, fromMin, toMin, now) > 0,
  );

  const lostMin = touching.reduce(
    (sum, inc) => sum + budgetSpent(inc, service.id, fromMin, toMin, now),
    0,
  );

  const allowanceMin = totalMin * (1 - service.target);
  const availability = totalMin > 0 ? (totalMin - lostMin) / totalMin : 1;

  return {
    period,
    fromMin,
    toMin,
    totalMin,
    lostMin,
    availability,
    allowanceMin,
    remainingMin: allowanceMin - lostMin,
    consumed: allowanceMin > 0 ? lostMin / allowanceMin : 0,
    meetsTarget: availability >= service.target,
    partial: fromMin > period.fromMin,
    incidents: touching.sort((a, b) => b.startMin - a.startMin),
  };
}

/** The rolling window the strip draws. */
export function stripPeriod(now: number, days = STRIP_DAYS): Period {
  return {
    fromMin: (dayOf(now) - (days - 1)) * MINUTES_PER_DAY,
    toMin: now,
    label: `Last ${days} days`,
  };
}

export function quarterOf(min: number): Period & { q: number; y: number } {
  const { y, m } = civilFromDays(dayOf(min));
  const q = Math.floor((m - 1) / 3) + 1;
  const startM = (q - 1) * 3 + 1;
  const endY = q === 4 ? y + 1 : y;
  const endM = q === 4 ? 1 : startM + 3;
  return {
    fromMin: utc(y, startM, 1),
    toMin: utc(endY, endM, 1),
    label: `Q${q} ${y}`,
    q,
    y,
  };
}

export function monthOf(min: number): Period {
  const { y, m } = civilFromDays(dayOf(min));
  const endY = m === 12 ? y + 1 : y;
  const endM = m === 12 ? 1 : m + 1;
  return { fromMin: utc(y, m, 1), toMin: utc(endY, endM, 1), label: fmtMonth(min) };
}

/** Complete months only, newest first. A month still running has no verdict yet. */
export function completeMonthsBack(now: number, count: number): Period[] {
  const out: Period[] = [];
  let cursor = monthOf(now).fromMin - 1;
  while (out.length < count) {
    const p = monthOf(cursor);
    out.push(p);
    cursor = p.fromMin - 1;
  }
  return out;
}

/**
 * Burn rate: budget spent so far ÷ budget the elapsed time has earned.
 *
 * 1.0 is exactly on pace to finish the quarter with nothing left. This is
 * the number the front page leads on, because it is the only one that
 * answers "is this going to be a problem" rather than "was it".
 */
export function burnRate(service: Service, incidents: Incident[], now: number): number {
  const quarter = quarterOf(now);
  const elapsed = windowFor(service, incidents, quarter, now);
  if (elapsed.allowanceMin <= 0) return 0;
  return elapsed.lostMin / elapsed.allowanceMin;
}

/** How far through the quarter we are, clamped to the service's own life. */
export function quarterElapsedFraction(service: Service, now: number): number {
  const quarter = quarterOf(now);
  const from = Math.max(quarter.fromMin, service.liveFrom);
  const whole = quarter.toMin - from;
  return whole > 0 ? Math.min(1, (now - from) / whole) : 0;
}

/** Budget spent ÷ the WHOLE quarter's allowance. Pairs with the fraction above. */
export function quarterConsumedFraction(
  service: Service,
  incidents: Incident[],
  now: number,
): number {
  const quarter = quarterOf(now);
  const from = Math.max(quarter.fromMin, service.liveFrom);
  const wholeAllowance = (quarter.toMin - from) * (1 - service.target);
  if (wholeAllowance <= 0) return 0;
  return windowFor(service, incidents, quarter, now).lostMin / wholeAllowance;
}

// ---------------------------------------------------------------------
// The strip
// ---------------------------------------------------------------------

export type DayState = "none" | "ok" | Severity;

export interface DayCell {
  dayIndex: number;
  startMin: number;
  state: DayState;
  /** Impact-weighted minutes lost that day. Maintenance contributes none. */
  lostMin: number;
  incidentIds: string[];
  /** True for the day the pinned clock falls in — it is not over yet. */
  today: boolean;
}

/**
 * One cell per day, oldest first.
 *
 * Days before the service existed get `none` rather than `ok`, because a
 * service that did not exist was not up, and a strip that draws forty-nine
 * days of green for a product launched six weeks ago is lying in the most
 * ordinary way a status page can.
 */
export function dayCells(
  service: Service,
  incidents: Incident[],
  now: number,
  days = STRIP_DAYS,
): DayCell[] {
  const firstDay = dayOf(now) - (days - 1);
  const todayIndex = dayOf(now);
  const cells: DayCell[] = [];

  for (let i = 0; i < days; i += 1) {
    const dayIndex = firstDay + i;
    const startMin = dayIndex * MINUTES_PER_DAY;
    const endMin = startMin + MINUTES_PER_DAY;

    if (endMin <= service.liveFrom) {
      cells.push({
        dayIndex,
        startMin,
        state: "none",
        lostMin: 0,
        incidentIds: [],
        today: dayIndex === todayIndex,
      });
      continue;
    }

    const from = Math.max(startMin, service.liveFrom);
    const touching = incidents.filter(
      (inc) =>
        impactOn(inc, service.id) !== undefined &&
        overlapMinutes(inc, from, endMin, now) > 0,
    );

    let worst: Severity | null = null;
    let lostMin = 0;
    for (const inc of touching) {
      lostMin += budgetSpent(inc, service.id, from, endMin, now);
      if (worst === null || severityRank(inc.severity) > severityRank(worst)) {
        worst = inc.severity;
      }
    }

    cells.push({
      dayIndex,
      startMin,
      state: worst ?? "ok",
      lostMin,
      incidentIds: touching.map((i) => i.id),
      today: dayIndex === todayIndex,
    });
  }

  return cells;
}

export function tallyStates(cells: DayCell[]): Record<DayState, number> {
  const out: Record<DayState, number> = {
    none: 0, ok: 0, degraded: 0, partial: 0, major: 0, maintenance: 0,
  };
  for (const c of cells) out[c.state] += 1;
  return out;
}

// ---------------------------------------------------------------------
// Credits
// ---------------------------------------------------------------------

/**
 * The credit schedule, expressed as distance BELOW the service's own
 * target rather than as three absolute percentages.
 *
 * Absolute bands are the industry norm and they have a hole in them: a
 * service sold on 99.99% and credited from 99.95% can miss its promise by
 * a factor of five and owe nothing. Deriving the bands from the target
 * closes it, and costs one subtraction.
 */
export const CREDIT_BANDS = [
  { belowTargetPp: 0, percent: 10 },
  { belowTargetPp: 0.4, percent: 25 },
  { belowTargetPp: 0.9, percent: 50 },
] as const;

/** Credits must be asked for. This is how long you have. */
export const CLAIM_DAYS = 60;

export interface Credit {
  service: Service;
  period: Period;
  availability: number;
  /** 0 when the month met its target. */
  percent: number;
  usd: number;
  claimByMin: number;
  claimable: boolean;
  lostMin: number;
}

export function creditPercent(service: Service, availability: number): number {
  let out = 0;
  for (const band of CREDIT_BANDS) {
    const threshold = service.target - band.belowTargetPp / 100;
    if (availability < threshold) out = band.percent;
  }
  return out;
}

/** The thresholds for one service, as fractions, worst band last. */
export function bandThresholds(service: Service): { percent: number; threshold: number }[] {
  return CREDIT_BANDS.map((b) => ({
    percent: b.percent,
    threshold: service.target - b.belowTargetPp / 100,
  }));
}

export function creditFor(
  service: Service,
  incidents: Incident[],
  period: Period,
  now: number,
): Credit | null {
  // A month still running has no verdict. Publishing one would mean
  // revising it every hour, which is worse than saying "not yet".
  if (period.toMin > now) return null;
  if (period.toMin <= service.liveFrom) return null;

  const w = windowFor(service, incidents, period, now);
  const percent = creditPercent(service, w.availability);
  if (percent === 0) return null;

  const claimByMin = period.toMin + CLAIM_DAYS * MINUTES_PER_DAY;
  return {
    service,
    period,
    availability: w.availability,
    percent,
    usd: Math.round((service.monthlyUsd * percent) / 100),
    claimByMin,
    claimable: now < claimByMin,
    lostMin: w.lostMin,
  };
}

export function creditsOwed(
  services: Service[],
  incidents: Incident[],
  months: Period[],
  now: number,
): Credit[] {
  const out: Credit[] = [];
  for (const period of months) {
    for (const service of services) {
      const credit = creditFor(service, incidents, period, now);
      if (credit) out.push(credit);
    }
  }
  return out.sort((a, b) => b.period.fromMin - a.period.fromMin);
}

// ---------------------------------------------------------------------
// Detection and repair
// ---------------------------------------------------------------------

/** Minutes between an incident starting and anyone knowing. */
export function detectMin(inc: Incident): number {
  return Math.max(0, inc.detectedMin - inc.startMin);
}

/** Minutes between knowing and it being over. */
export function repairMin(inc: Incident, now: number): number {
  return Math.max(0, endOf(inc, now) - inc.detectedMin);
}

/**
 * The incidents we were slower to NOTICE than to FIX.
 *
 * The interesting half of an outage is usually the first half. A page
 * that publishes only mean time to repair is quietly taking credit for
 * the part it is best at.
 */
export function slowerToNotice(incidents: Incident[], now: number): Incident[] {
  return incidents.filter(
    (inc) =>
      inc.severity !== "maintenance" &&
      inc.endMin !== null &&
      detectMin(inc) > repairMin(inc, now),
  );
}

export function meanMinutes(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
