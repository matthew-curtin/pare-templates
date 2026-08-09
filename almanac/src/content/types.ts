/**
 * Every content shape in one place.
 *
 * The two unions worth reading before anything else are `Pay` and
 * `Hours`, because between them they decide what this board can sort,
 * what it can filter, and what it has to admit it cannot compare.
 */

export type Sector =
  | "Local government"
  | "Health"
  | "Education"
  | "Culture & heritage"
  | "Housing"
  | "Environment"
  | "Nonprofit";

export type Contract =
  | "Regular"
  | "Term"
  | "Interim"
  | "On call"
  | "Volunteer";

/** Where the work happens, in the sense a candidate cares about. */
export type Pattern = "On site" | "Hybrid" | "Remote";

/**
 * How much of a week the job is.
 *
 * `hoursPerWeek` is what makes a part-time salary comparable: public
 * sector postings quote the full-time range and add "prorated", so the
 * number in the posting is not the number anyone is paid.
 *
 * `Casual` deliberately carries no hours. A job that is "as needed" has
 * no annual figure, and inventing one to make it sortable would be the
 * board lying about the only thing it exists to tell you.
 */
export type Hours =
  | { kind: "Full time" }
  | { kind: "Part time"; hoursPerWeek: number }
  | { kind: "Job share"; hoursPerWeek: number }
  | { kind: "Casual"; note: string };

/**
 * What it pays.
 *
 * `range` is the ordinary case — a grade with a bottom and a top, always
 * quoted full-time. `unstated` exists because a handful of listings
 * predate the salary policy, and a board that pretends that never
 * happens has no design for it.
 */
export type Pay =
  | { kind: "range"; min: number; max: number; grade?: string }
  | { kind: "exact"; amount: number; grade?: string }
  | { kind: "hourly"; rate: number }
  | { kind: "daily"; rate: number }
  | { kind: "voluntary"; note: string }
  | { kind: "unstated"; note: string };

export type EmployerKind =
  | "County government"
  | "Health system"
  | "University"
  | "Community college"
  | "Museum"
  | "Housing authority"
  | "Nonprofit"
  | "Regional authority"
  | "School district"
  | "Land trust";

export interface Employer {
  id: string;
  slug: string;
  name: string;
  kind: EmployerKind;
  place: string;
  /** Two or three sentences. Shown on the employer page and, trimmed, on the index. */
  about: string;
  staff: string;
  founded: number;
  site: string;
}

export interface Section {
  heading: string;
  /** Paragraphs. Plain strings; this board has no markdown in it. */
  body?: string[];
  /** Bulleted points, if the section has them. */
  points?: string[];
}

export interface Vacancy {
  id: string;
  slug: string;
  title: string;
  employerId: string;
  sector: Sector;
  contract: Contract;
  pattern: Pattern;
  hours: Hours;
  pay: Pay;
  place: string;
  /** ISO date, no time. Both of these are calendar days, not instants. */
  posted: string;
  closes: string;
  /** The employer's own reference, printed on the listing like a docket. */
  reference: string;
  /** One or two sentences. This is what the board row shows. */
  summary: string;
  sections: Section[];
  /** Some employers name the date up front; plenty do not. */
  interviews?: string;
  /** A paid promotion, which is why /post has a price for it. */
  featured?: boolean;
  /** Fixed-term and interim roles say how long. */
  term?: string;
}

export interface PriceTier {
  id: string;
  name: string;
  price: number;
  duration: string;
  blurb: string;
  includes: string[];
  highlight?: boolean;
}

export interface Question {
  q: string;
  a: string[];
}
