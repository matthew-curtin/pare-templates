import type { Hours, Pay } from "../content/types";

/**
 * What a vacancy pays, and whether that can be compared to another one.
 *
 * This module has no runtime imports on purpose — the assumptions it
 * needs are passed in, so a plain node script can call it directly and
 * check the arithmetic against worked examples. See
 * `scripts/check-listings.mjs`, and CONVENTIONS §8.
 *
 * The thing worth understanding before changing anything here:
 *
 *   The number on a public sector posting is usually not the number
 *   anyone is paid.
 *
 * Part-time positions are posted at the full-time range with
 * "prorated" after it, which has been quietly misleading people for
 * decades. A 24-hour position posted at "$52,000 – $57,000 prorated"
 * pays $31,200 to $34,200. So the board shows both, and — the part
 * that matters — filters and sorts on the actual money, never on the
 * posted range. A jobs board that filters on the range tells someone
 * with a $40,000 floor about a job paying $31,200.
 *
 * And some jobs genuinely cannot be compared. A volunteer position, an
 * on-call position with no guaranteed hours, and a posting with no
 * salary on it have no annual figure, so `annualise` returns null for
 * all three rather than inventing one. Null is a real answer here.
 */

export interface PayBasis {
  fullTimeWeek: number;
  weeksPerYear: number;
  workingDaysPerYear: number;
}

/** The money someone would actually receive in a year. */
export interface Annual {
  min: number;
  max: number;
}

/**
 * The fraction of a full week this post is, or null when the question
 * has no answer. Casual hours are "as required", which is not 0.5 of
 * anything.
 */
export function fteOf(hours: Hours, fullTimeWeek: number): number | null {
  switch (hours.kind) {
    case "Full time":
      return 1;
    case "Part time":
    case "Job share":
      return hours.hoursPerWeek / fullTimeWeek;
    case "Casual":
      return null;
  }
}

/**
 * Actual annual pay, or null when there is nothing to compare.
 *
 * Everything downstream — the salary filter, the pay sort, the alert
 * match count — reads this and only this.
 */
export function annualise(
  pay: Pay,
  hours: Hours,
  basis: PayBasis,
): Annual | null {
  const fte = fteOf(hours, basis.fullTimeWeek);

  switch (pay.kind) {
    case "voluntary":
    case "unstated":
      return null;

    case "hourly": {
      // An hourly rate becomes a year only once somebody says how many
      // hours. Casual work does not, so it stops here.
      if (hours.kind === "Casual") return null;
      const weekly = pay.rate * (fte ?? 1) * basis.fullTimeWeek;
      const annual = Math.round(weekly * basis.weeksPerYear);
      return { min: annual, max: annual };
    }

    case "daily": {
      if (fte === null) return null;
      const annual = Math.round(pay.rate * basis.workingDaysPerYear * fte);
      return { min: annual, max: annual };
    }

    case "exact": {
      if (fte === null) return null;
      const annual = Math.round(pay.amount * fte);
      return { min: annual, max: annual };
    }

    case "range": {
      if (fte === null) return null;
      return {
        min: Math.round(pay.min * fte),
        max: Math.round(pay.max * fte),
      };
    }
  }
}

/**
 * A minimum-salary filter asks "could this job pay me that?", so it
 * compares against the TOP of the range. The pay sort asks "what would
 * I be starting on?", so it uses the bottom. Same data, two questions,
 * and getting them the same way round is a real bug: a floor compared
 * against the bottom of the range hides every job whose band starts
 * below it and ends well above.
 *
 * A vacancy with no comparable figure never passes a floor. It has not
 * failed the test — there is no test to run — but claiming it clears a
 * number nobody has stated would be worse.
 */
export function meetsFloor(annual: Annual | null, floor: number): boolean {
  if (floor <= 0) return true;
  if (annual === null) return false;
  return annual.max >= floor;
}

/** Sort key for "highest paid". Uncomparable vacancies fall to the end. */
export function paySortKey(annual: Annual | null): number {
  return annual === null ? Number.NEGATIVE_INFINITY : annual.min;
}

/* ---------- display ---------- */

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const cents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatMoney(amount: number): string {
  return money.format(amount);
}

function range(min: number, max: number): string {
  return min === max
    ? formatMoney(min)
    : `${formatMoney(min)} – ${formatMoney(max)}`;
}

export interface PayLabel {
  /** What the job pays. The figure the board sorts and filters on. */
  headline: string;
  /** What the employer posted, or why the job cannot be compared. */
  note?: string;
  /** True when there is no annual figure to sort or filter on. */
  uncomparable: boolean;
}

/**
 * Both halves of the truth: what the job pays, and what the posting says.
 *
 * The headline is the ACTUAL money, and the posted range drops to the
 * footnote. That is the second version. The first put the advertised
 * range in the headline — on the grounds that it is what the candidate
 * will see on the employer's own site — and it made the "highest paid"
 * sort look broken: the column read $51,000, then $84,000 prorated,
 * then $44,000 prorated, because the numbers on display were not the
 * numbers being sorted. The rule that came out of it is worth keeping:
 *
 *   whatever the reader scans has to be what the ordering used.
 *
 * Nothing is hidden by the swap. The posted figure is still on the
 * card, one line down, attributed to the employer — which is where a
 * misleading number belongs.
 */
export function payLabel(pay: Pay, hours: Hours, basis: PayBasis): PayLabel {
  const annual = annualise(pay, hours, basis);
  const partTime = hours.kind === "Part time" || hours.kind === "Job share";

  switch (pay.kind) {
    case "voluntary":
      return { headline: "Unpaid", note: pay.note, uncomparable: true };

    case "unstated":
      return { headline: "Not stated", note: pay.note, uncomparable: true };

    case "hourly": {
      const headline = `${cents.format(pay.rate)} an hour`;
      if (annual === null) {
        return {
          headline,
          note: "Hours are as required, so there is no annual figure to compare this against.",
          uncomparable: true,
        };
      }
      return {
        headline,
        note: `About ${formatMoney(annual.min)} a year at these hours.`,
        uncomparable: false,
      };
    }

    case "daily": {
      const headline = `${formatMoney(pay.rate)} a day`;
      return {
        headline,
        note: annual
          ? `About ${formatMoney(annual.min)} a year at ${basis.workingDaysPerYear} chargeable days.`
          : undefined,
        uncomparable: annual === null,
      };
    }

    case "exact": {
      return {
        headline: formatMoney(partTime && annual ? annual.min : pay.amount),
        note: partTime
          ? `Posted as ${formatMoney(pay.amount)} prorated.`
          : undefined,
        uncomparable: false,
      };
    }

    case "range": {
      return {
        headline:
          partTime && annual
            ? range(annual.min, annual.max)
            : range(pay.min, pay.max),
        note: partTime
          ? `Posted as ${range(pay.min, pay.max)} prorated.`
          : undefined,
        uncomparable: false,
      };
    }
  }
}

/** "22.2 hours a week", "Full time", "Job share, 18.5 hours a week". */
export function hoursLabel(hours: Hours): string {
  switch (hours.kind) {
    case "Full time":
      return "Full time";
    case "Part time":
      return `Part time, ${hours.hoursPerWeek} hours a week`;
    case "Job share":
      return `Job share, ${hours.hoursPerWeek} hours a week`;
    case "Casual":
      return "Casual hours";
  }
}
