/**
 * Checks for the three pure modules, and for the data they act on.
 *
 *   node scripts/check-listings.mjs
 *   TZ=Asia/Tokyo node scripts/check-listings.mjs   # must agree
 *
 * Node strips the types out of a `.ts` file on its own, so these call
 * the real `src/lib/*.ts` and the real content rather than copies that
 * can drift away from them.
 *
 * Three kinds of check, and the third is the one that will save
 * somebody:
 *
 *   1. The arithmetic, against worked examples. A part-time salary is
 *      not the number on the advert.
 *   2. Properties that must hold for every input — a higher salary
 *      floor never returns MORE vacancies, the comparator is a total
 *      order, search does not care what order you typed the words in.
 *   3. The content itself. CONVENTIONS §7b asks for data tuned so each
 *      state appears about as often as it should, and nothing in a
 *      typecheck notices when an edit leaves nine vacancies closing
 *      today, or none.
 */

import {
  annualise,
  formatMoney,
  fteOf,
  hoursLabel,
  meetsFloor,
  payLabel,
  paySortKey,
} from "../src/lib/pay.ts";
import {
  closingLabel,
  closingState,
  dayKey,
  daysBetween,
  isClosed,
  isNew,
  longDate,
  postedLabel,
  shortDate,
} from "../src/lib/dates.ts";
import {
  activeFilterCount,
  compareListings,
  emptyFilters,
  isUnfiltered,
  matchesFilters,
  matchesQuery,
  toListing,
} from "../src/lib/filters.ts";
import { vacancies } from "../src/content/vacancies.ts";
import { employers } from "../src/content/employers.ts";
import {
  contracts,
  now,
  patterns,
  payBasis,
  salaryFloors,
  sectors,
  thresholds,
  ZONE,
} from "../src/content/site.ts";

let failures = 0;
let checks = 0;

function ok(condition, label, detail) {
  checks++;
  if (condition) return;
  failures++;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function eq(actual, expected, label) {
  const same = JSON.stringify(actual) === JSON.stringify(expected);
  ok(
    same,
    label,
    same
      ? ""
      : `got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`,
  );
}

const nowMs = Date.parse(now);
const FULL = { kind: "Full time" };
const CASUAL = { kind: "Casual", note: "as required" };
const part = (h) => ({ kind: "Part time", hoursPerWeek: h });

/* ------------------------------------------------------------------ */
console.log("\nPay — what the advert says against what it means\n");

eq(fteOf(FULL, 37), 1, "full time is 1.0 FTE");
eq(fteOf(part(22.2), 37), 0.6, "22.2 hours of 37 is 0.6 FTE");
eq(fteOf(CASUAL, 37), null, "casual hours have no FTE");

eq(
  annualise({ kind: "range", min: 58000, max: 63500 }, FULL, payBasis),
  { min: 58000, max: 63500 },
  "a full-time band is itself",
);

// The one that matters. The advert says £25,900–£28,300; the job pays
// £15,540–£16,980, and a board that filters on the first number is
// telling people about jobs they have explicitly ruled out.
eq(
  annualise({ kind: "range", min: 25900, max: 28300 }, part(22.2), payBasis),
  { min: 15540, max: 16980 },
  "a 0.6 post pays 0.6 of the band",
);

eq(
  annualise({ kind: "exact", amount: 44200 }, FULL, payBasis),
  { min: 44200, max: 44200 },
  "a single salary point is a range of one",
);
eq(
  annualise({ kind: "daily", rate: 465 }, FULL, payBasis),
  { min: 102300, max: 102300 },
  "a day rate annualises at the stated chargeable days",
);
eq(
  annualise({ kind: "hourly", rate: 13.85 }, part(20), payBasis),
  { min: 14404, max: 14404 },
  "an hourly rate needs hours before it is a year",
);
eq(
  annualise({ kind: "hourly", rate: 13.85 }, CASUAL, payBasis),
  null,
  "casual hourly work has no annual figure",
);
eq(
  annualise({ kind: "voluntary", note: "" }, part(4), payBasis),
  null,
  "unpaid is not zero, it is uncomparable",
);
eq(
  annualise({ kind: "unstated", note: "" }, FULL, payBasis),
  null,
  "unstated pay is uncomparable",
);

/* ------------------------------------------------------------------ */
console.log("\nFloors — a filter asks the top, a sort asks the bottom\n");

const band = { min: 40000, max: 80000 };
ok(meetsFloor(band, 50000), "a 40–80k band clears a 50k floor");
ok(meetsFloor(band, 80000), "and clears a floor at its very top");
ok(!meetsFloor(band, 90000), "but not one above it");
ok(meetsFloor(null, 0), "no floor means everything passes");
ok(!meetsFloor(null, 20000), "an uncomparable vacancy never clears a floor");
eq(paySortKey(band), 40000, "the pay sort reads the bottom of the band");
ok(
  paySortKey(null) < paySortKey({ min: 0, max: 0 }),
  "uncomparable sorts below a paid job",
);

const partLabel = payLabel(
  { kind: "range", min: 25900, max: 28300 },
  part(22.2),
  payBasis,
);
// Whatever the reader scans has to be what the ordering used, so the
// headline is the actual money and the advert drops to the footnote.
eq(
  partLabel.headline,
  "£15,540 – £16,980",
  "a part-time headline is what the job actually pays",
);
ok(
  partLabel.note?.includes("£25,900 – £28,300") &&
    partLabel.note.includes("pro rata"),
  "and the advertised band is still on the card, attributed",
  partLabel.note,
);
ok(
  paySortKey(annualise({ kind: "range", min: 25900, max: 28300 }, part(22.2), payBasis)) ===
    15540,
  "and the sort key agrees with the headline",
);
ok(
  payLabel({ kind: "range", min: 58000, max: 63500 }, FULL, payBasis).note ===
    undefined,
  "a full-time band needs no footnote",
);
ok(
  payLabel({ kind: "hourly", rate: 13.85 }, CASUAL, payBasis).uncomparable,
  "casual pay is marked uncomparable",
);
eq(hoursLabel(part(22.2)), "Part time, 22.2 hours a week", "hours read plainly");

/* ------------------------------------------------------------------ */
console.log("\nDates — a closing date is a calendar day, not a countdown\n");

eq(dayKey(nowMs, ZONE), "2026-09-16", "the pinned now is a fixed calendar day");
eq(daysBetween("2026-09-16", "2026-09-18"), 2, "two days is two days");
eq(daysBetween("2026-09-16", "2026-09-11"), -5, "backwards counts backwards");
eq(
  daysBetween("2026-10-24", "2026-10-27"),
  3,
  "and is unaffected by the clocks going back",
);

eq(closingState("2026-09-16", nowMs, ZONE, 7).kind, "today", "today is today");
eq(
  closingState("2026-09-17", nowMs, ZONE, 7),
  { kind: "soon", daysLeft: 1 },
  "tomorrow is one day left",
);
eq(
  closingState("2026-09-23", nowMs, ZONE, 7),
  { kind: "soon", daysLeft: 7 },
  "the edge of the window is inside it",
);
eq(
  closingState("2026-09-24", nowMs, ZONE, 7),
  { kind: "open", daysLeft: 8 },
  "one past the edge is not",
);
eq(
  closingState("2026-09-11", nowMs, ZONE, 7),
  { kind: "closed", daysAgo: 5 },
  "a past date is closed",
);

// The trap this module exists for. At 09:20 on Wednesday, the end of
// Thursday is 38 hours away — under two days by the clock, and an
// elapsed-time test rounds that to one and says "closes today" about a
// deadline that is a day and a half off.
eq(
  closingLabel(closingState("2026-09-17", nowMs, ZONE, 7), "2026-09-17", ZONE),
  "Closes tomorrow",
  "38 hours away is tomorrow, not today",
);
eq(
  closingLabel(closingState("2026-09-16", nowMs, ZONE, 7), "2026-09-16", ZONE),
  "Closes today",
  "and today says so",
);
eq(
  closingLabel(closingState("2026-09-15", nowMs, ZONE, 7), "2026-09-15", ZONE),
  "Closed yesterday",
  "yesterday reads back the same way",
);

eq(
  longDate("2026-09-18", ZONE),
  "Friday, 18 September 2026",
  "long dates are in the workspace timezone",
);
eq(shortDate("2026-10-02", ZONE), "2 Oct 2026", "short dates too");
eq(postedLabel("2026-09-15", nowMs, ZONE), "Posted yesterday", "posted reads back");
eq(postedLabel("2026-09-16", nowMs, ZONE), "Posted today", "including today");
ok(isNew("2026-09-14", nowMs, ZONE, 3), "two days old is new");
ok(!isNew("2026-09-09", nowMs, ZONE, 3), "a week old is not");
ok(isClosed("2026-09-15", nowMs, ZONE), "yesterday's deadline has closed");
ok(!isClosed("2026-09-16", nowMs, ZONE), "today's has not");

/* ------------------------------------------------------------------ */
console.log("\nSearch and ordering\n");

const byId = new Map(employers.map((e) => [e.id, e]));
const listings = vacancies.map((v) => {
  const employer = byId.get(v.employerId);
  const annual = annualise(v.pay, v.hours, payBasis);
  return toListing({
    ...v,
    employerName: employer.name,
    employerKind: employer.kind,
    closed: isClosed(v.closes, nowMs, ZONE),
    payFrom: annual?.min ?? null,
    payTo: annual?.max ?? null,
  });
});

const hay = listings.find((l) => l.id === "v10").haystack;
ok(matchesQuery(hay, "woodland ranger"), "search finds the obvious phrase");
ok(matchesQuery(hay, "ranger woodland"), "and does not care about word order");
ok(matchesQuery(hay, "COPPICE"), "and ignores case");
ok(matchesQuery(hay, "coppice ranger"), "and matches across fields");
ok(!matchesQuery(hay, "woodland dentist"), "but every word has to be there");
ok(matchesQuery(hay, "   "), "an empty search matches everything");

const filtered = (patch) =>
  listings.filter((l) => matchesFilters(l, { ...emptyFilters, ...patch }));

ok(isUnfiltered(emptyFilters), "the empty filter set is unfiltered");
eq(
  activeFilterCount({ ...emptyFilters, sectors: ["Health"], floor: 30000 }),
  2,
  "active filters are counted one per thing narrowed",
);

// A higher floor can never return more vacancies. This is the property
// a user checks by hand, in one click, and it is the one that breaks
// when a filter starts comparing the wrong end of a range.
let previous = Infinity;
for (const floor of [0, ...salaryFloors]) {
  const count = filtered({ floor }).length;
  ok(
    count <= previous,
    `raising the floor to ${floor} does not return more`,
    `${count} > ${previous}`,
  );
  previous = count;
}

// Nor can adding a second filter.
const oneFilter = filtered({ sectors: ["Environment"] }).length;
const twoFilters = filtered({
  sectors: ["Environment"],
  patterns: ["On site"],
}).length;
ok(twoFilters <= oneFilter, "adding a filter does not return more");

for (const mode of ["closing", "newest", "pay"]) {
  let antisymmetric = true;
  let noTies = true;
  for (const a of listings) {
    for (const b of listings) {
      if (a.id === b.id) continue;
      const ab = compareListings(a, b, mode);
      const ba = compareListings(b, a, mode);
      if (Math.sign(ab) !== -Math.sign(ba)) antisymmetric = false;
      if (ab === 0) noTies = false;
    }
  }
  ok(antisymmetric, `${mode}: comparing either way round agrees`);
  ok(noTies, `${mode}: no two vacancies ever compare equal`);

  // A comparator with a tie in it reorders rows when an unrelated one
  // is filtered out. Sorting a reversed copy is the cheapest way to
  // catch that.
  const forward = [...listings]
    .sort((a, b) => compareListings(a, b, mode))
    .map((l) => l.id);
  const backward = [...listings]
    .reverse()
    .sort((a, b) => compareListings(a, b, mode))
    .map((l) => l.id);
  eq(backward, forward, `${mode}: the order does not depend on the input order`);
}

const withClosed = [...listings].sort((a, b) =>
  compareListings(a, b, "closing"),
);
const firstClosedAt = withClosed.findIndex((l) => l.closed);
ok(
  withClosed.slice(firstClosedAt).every((l) => l.closed),
  "closed vacancies sink to the bottom, all of them together",
);

// A promotion must not be able to lie about the ordering. The first
// draft lifted featured listings here, which put a vacancy closing in
// October above one closing that afternoon under a control labelled
// "Closing soonest". They get their own strip on the board instead.
const soonest = listings
  .filter((l) => !l.closed)
  .reduce((best, l) => (l.closes < best.closes ? l : best));
eq(
  withClosed[0].id,
  soonest.id,
  "the soonest-closing vacancy is first, promotion or not",
);
ok(
  listings.some((l) => l.featured && withClosed.indexOf(l) > 0),
  "a featured listing takes its proper place in the order",
);

// The property the first draft broke: what the reader scans has to be
// what the ordering used. A salary headline must open with the same
// number the pay sort keys on — an hourly or daily rate is in a
// different unit and says so, so those are excluded by kind.
const misleading = vacancies.filter((v) => {
  if (v.pay.kind !== "range" && v.pay.kind !== "exact") return false;
  const annual = annualise(v.pay, v.hours, payBasis);
  const shown = payLabel(v.pay, v.hours, payBasis).headline;
  return !shown.startsWith(formatMoney(annual.min));
});
eq(
  misleading.map((v) => v.id),
  [],
  "every salary headline opens with the figure the sort uses",
);

/* ------------------------------------------------------------------ */
console.log("\nThe content — every state the design has to draw\n");

const open = listings.filter((l) => !l.closed);
const closingToday = open.filter(
  (l) => closingState(l.closes, nowMs, ZONE, thresholds.closingWithin).kind === "today",
);
const closingTomorrow = open.filter((l) => daysBetween("2026-09-16", l.closes) === 1);
const soon = open.filter((l) => {
  const s = closingState(l.closes, nowMs, ZONE, thresholds.closingWithin);
  return s.kind === "soon" || s.kind === "today";
});

eq(closingToday.length, 1, "exactly one vacancy closes today");
eq(closingTomorrow.length, 1, "exactly one closes tomorrow");
ok(soon.length >= 4, "several are inside the warning window", `${soon.length}`);
ok(
  soon.length <= open.length / 2,
  "but not so many that red stops meaning anything",
  `${soon.length} of ${open.length}`,
);
eq(listings.filter((l) => l.closed).length, 3, "exactly three have closed");

const unstated = vacancies.filter((v) => v.pay.kind === "unstated");
eq(unstated.length, 2, "exactly two listings have no salary on them");
ok(
  unstated.every((v) => v.pay.note.length > 40),
  "and both say why, at length",
);
ok(
  vacancies.some((v) => v.pay.kind === "voluntary"),
  "one role is unpaid",
);
ok(
  vacancies.some((v) => v.hours.kind === "Casual"),
  "one has no guaranteed hours",
);
ok(
  vacancies.filter((v) => v.pay.kind === "daily").length >= 2,
  "at least two are day rates",
);
ok(
  vacancies.some((v) => v.hours.kind === "Job share"),
  "one is a job share",
);
ok(
  vacancies.filter((v) => v.hours.kind === "Part time").length >= 3,
  "several are part time, so pro rata is exercised",
);
ok(
  listings.filter((l) => l.payFrom === null).length >= 3,
  "and enough are uncomparable to fill the end of the pay sort",
);

for (const pattern of patterns) {
  ok(
    open.some((l) => l.pattern === pattern),
    `something open is ${pattern}`,
  );
}
for (const sector of sectors) {
  ok(
    open.some((l) => l.sector === sector),
    `${sector} has an open vacancy, so its filter is never dead`,
  );
}
for (const contract of contracts) {
  ok(
    listings.some((l) => l.contract === contract),
    `${contract} appears at least once`,
  );
}
for (const floor of salaryFloors) {
  ok(
    filtered({ floor }).length > 0,
    `the ${floor} floor returns something`,
  );
}

// The empty state has to be reachable by a combination somebody would
// plausibly try, or nobody — including whoever designed it — ever sees
// it.
eq(
  filtered({ sectors: ["Culture & heritage"], floor: 40000 }).length,
  0,
  "a sensible pair of filters can return nothing",
);

eq(
  vacancies.filter((v) => v.featured).length,
  2,
  "two are featured, which is a promotion rather than the norm",
);
ok(
  vacancies.some((v) => v.title.length > 60),
  "one title is long enough to test wrapping",
);
ok(
  open.filter((l) => isNew(l.posted, nowMs, ZONE, thresholds.newFor)).length >= 3,
  "several are new enough to wear the flag",
);
ok(
  open.some((l) => !isNew(l.posted, nowMs, ZONE, thresholds.newFor)),
  "and several are not",
);
ok(
  vacancies.some((v) => v.interviews),
  "some name an interview date",
);
ok(
  vacancies.some((v) => !v.interviews),
  "and some do not",
);
ok(
  vacancies.some((v) => v.sections.length === 1),
  "one listing is thin, as real ones are",
);
ok(
  vacancies.some((v) => v.sections.length >= 4),
  "and one is long",
);

const employersWithOpen = new Set(
  vacancies
    .filter((v) => !isClosed(v.closes, nowMs, ZONE))
    .map((v) => v.employerId),
);
const idle = employers.filter((e) => !employersWithOpen.has(e.id));
eq(idle.length, 1, "exactly one employer has nothing open");
ok(
  vacancies.some((v) => v.employerId === idle[0]?.id),
  "and it still has a page worth showing, because it has a closed one",
);

/* ------------------------------------------------------------------ */
console.log("\nIntegrity\n");

const ids = new Set(vacancies.map((v) => v.id));
eq(ids.size, vacancies.length, "vacancy ids are unique");
const slugs = new Set(vacancies.map((v) => v.slug));
eq(slugs.size, vacancies.length, "slugs are unique");
const refs = new Set(vacancies.map((v) => v.reference));
eq(refs.size, vacancies.length, "employer references are unique");
const employerSlugs = new Set(employers.map((e) => e.slug));
eq(employerSlugs.size, employers.length, "employer slugs are unique");

ok(
  vacancies.every((v) => byId.has(v.employerId)),
  "every vacancy names an employer that exists",
);
ok(
  vacancies.every((v) => /^\d{4}-\d{2}-\d{2}$/.test(v.posted)),
  "posted dates are plain calendar days",
);
ok(
  vacancies.every((v) => /^\d{4}-\d{2}-\d{2}$/.test(v.closes)),
  "and so are closing dates",
);
ok(
  vacancies.every((v) => v.posted < v.closes),
  "nothing closes before it was posted",
);
ok(
  vacancies.every((v) => daysBetween(v.posted, "2026-09-16") >= 0),
  "nothing was posted in the future",
);
ok(
  vacancies.every((v) => v.summary.length > 40 && v.summary.length < 260),
  "every summary is a summary",
);
ok(
  vacancies.every((v) => v.sections.every((s) => s.body || s.points)),
  "no section is empty",
);
ok(
  vacancies.every((v) => v.slug.length < 60 && /^[a-z0-9-]+$/.test(v.slug)),
  "slugs are url-safe",
);
ok(
  vacancies.every(
    (v) =>
      v.contract !== "Fixed term" && v.contract !== "Interim" ? true : !!v.term,
  ),
  "every fixed-term and interim post says how long it runs",
);
ok(
  employers.every((e) => e.about.length > 120),
  "every employer says something about itself",
);

/* ------------------------------------------------------------------ */
console.log(
  failures === 0
    ? `\n✓ ${checks} checks passed\n`
    : `\n✗ ${failures} of ${checks} checks failed\n`,
);
process.exit(failures === 0 ? 0 : 1);
