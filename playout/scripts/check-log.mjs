/**
 * The schedule, asserted.
 *
 *   node scripts/check-log.mjs
 *   TZ=Asia/Tokyo node scripts/check-log.mjs
 *
 * It imports the REAL modules — `src/lib/schedule.ts`, `scheduler.ts`,
 * `station.ts` and the content — rather than a copy of them, because a
 * checker testing a duplicate is testing the duplicate (CONVENTIONS §8).
 * Node strips the types itself; that is the whole reason those files
 * carry relative imports with explicit `.ts` extensions and never touch
 * the `@/` alias.
 *
 * Three kinds of thing are checked here and the middle one is the
 * interesting one:
 *
 *   1. PROPERTIES OF THE MODEL — a longer element never makes an hour
 *      land closer; the same library and clocks always produce the same
 *      Thursday; a breach's gap is always shorter than its rule. These
 *      hold for any content and would catch a bug in the arithmetic.
 *   2. CLAIMS THE SITE MAKES — the front page says the cluttered hours
 *      land closest and the rules page says one show cannot keep a rule.
 *      Both are sentences somebody wrote, and both are checked against
 *      the numbers the pages render, so a nudge to the content that
 *      falsifies the prose fails the run instead of shipping.
 *   3. §7B STATES — exactly one hour misses, exactly one underwriter is
 *      short, exactly one is airing outside its flight. A state the data
 *      never reaches is dead code with a nice name on it.
 *
 * Run it with the machine's timezone set to something else too. It
 * should not matter — there is no `Date` anywhere in `src` and check 0
 * asserts that — but a test that agrees with the bug on your laptop is
 * worth nothing.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import * as model from "../src/lib/schedule.ts";
import { buildDay, MAX_FLEX, MIN_FLEX } from "../src/lib/scheduler.ts";
import * as station from "../src/lib/station.ts";
import { categories, tracks } from "../src/content/library.ts";
import { day as plans } from "../src/content/day.ts";
import { shows, showById } from "../src/content/shows.ts";
import { spots } from "../src/content/spots.ts";
import { NOW, WEEKDAY, shots } from "../src/content/site.ts";
import { clock, duration, signedShort } from "../src/lib/format.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

let passed = 0;
const failures = [];

function ok(condition, label) {
  if (condition) passed += 1;
  else failures.push(label);
}

function eq(actual, expected, label) {
  ok(actual === expected, `${label} — got ${actual}, expected ${expected}`);
}

function section(name) {
  console.log(`\n  ${name}`);
}

/* ── 0. No clock, anywhere ───────────────────────────────────────────
   The strongest property this template has is that it renders the same
   schedule in every timezone on earth, and it is only true while nothing
   in `src` constructs a Date. One import is all it takes to lose it, and
   nothing else would fail. */
section("Nothing reads the machine's clock");

const sourceFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) sourceFiles.push(full);
  }
})(path.join(root, "src"));

const clockUsers = [];
for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ");
  if (/\bnew Date\b|\bDate\.now\b|toLocaleTimeString|Intl\.DateTimeFormat/.test(text)) {
    clockUsers.push(path.basename(file));
  }
}
ok(clockUsers.length === 0, `no Date in src — found in ${clockUsers.join(", ")}`);

/* ── 1. Content integrity ───────────────────────────────────────────── */
section("The content holds together");

eq(new Set(tracks.map((t) => t.id)).size, tracks.length, "record ids are unique");
eq(new Set(spots.map((s) => s.id)).size, spots.length, "spot ids are unique");
eq(new Set(shows.map((s) => s.id)).size, shows.length, "show ids are unique");
eq(new Set(plans.map((p) => p.h)).size, plans.length, "one plan per hour");

ok(
  plans.every((p, i) => i === 0 || p.h === plans[i - 1].h + 1),
  "the day is a run of consecutive hours",
);
eq(plans[0].h, model.DAY_START_HOUR, "the broadcast day starts at 06:00");
eq(plans[plans.length - 1].h, model.DAY_END_HOUR - 1, "and runs a full 24 hours");

ok(
  tracks.every((t) => t.ramp > 0 && t.ramp < t.seconds),
  "every record's intro is shorter than the record",
);
ok(
  tracks.every((t) => categories.some((c) => c.id === t.categoryId)),
  "every record is in a wheel that exists",
);
ok(
  plans.every((p) => showById.has(p.showId)),
  "every hour is assigned to a show that exists",
);
ok(
  plans.every((p) => p.spots.every((id) => spots.some((s) => s.id === id))),
  "every scheduled spot exists",
);
ok(
  shows.every((s) =>
    s.clock.every((slot) =>
      slot.k !== "music" ? true : categories.some((c) => c.id === slot.cat),
    ),
  ),
  "every music slot names a wheel that exists",
);

/* ── 2. The log lays out ────────────────────────────────────────────── */
section("The log lays out");

const placed = station.placed;

ok(placed.length > 300, `the day has ${placed.length} elements`);
ok(
  placed.every((p) => p.seconds > 0),
  "no element has zero length",
);
ok(
  placed.every((p, i) => i === 0 || p.start >= placed[i - 1].start),
  "start times never go backwards",
);
ok(
  placed.every((p, i) => {
    if (i === 0) return true;
    const previous = placed[i - 1];
    if (previous.hour !== p.hour) return true;
    return previous.start + previous.seconds === p.start;
  }),
  "elements within an hour butt up against each other with no gap",
);

// Nothing in the log states a duration it could look up.
ok(
  placed
    .filter((p) => p.element.kind === "music")
    .every((p) => p.seconds === station.lookup.track(p.element.ref).seconds),
  "a record's length comes from the record",
);
ok(
  placed
    .filter((p) => p.element.kind === "spot")
    .every((p) => p.seconds === station.lookup.spot(p.element.ref).seconds),
  "a spot's length comes from the contract",
);

/* ── 3. The scheduler is deterministic ──────────────────────────────── */
section("The scheduler is deterministic");

const artistSeparation = Object.fromEntries(
  categories.map((c) => [c.id, c.artistSeparationMinutes]),
);
const again = buildDay({ plans, shows, tracks, spots, artistSeparation });
ok(
  JSON.stringify(again) === JSON.stringify(station.hours),
  "building the day twice gives the same day",
);

/* ── 4. Landing ─────────────────────────────────────────────────────── */
section("Landing on the junction");

const stats = station.stats;
eq(stats.length, 24, "twenty-four hours are analysed");

for (const stat of stats) {
  ok(
    stat.scheduled === stat.drift + model.SECONDS_PER_HOUR,
    `hour ${stat.hour.h}: drift is scheduled minus the hour`,
  );
  ok(stat.tolerance === stat.finestTrim / 2, `hour ${stat.hour.h}: tolerance is half the trim`);
}

// The flexible link is what makes a hosted hour land, and it is bounded.
// An hour whose back-announce is pinned at either end is an hour that
// misses — which is exactly what happens to the one that does.
const flexes = station.hours.flatMap((hour) =>
  hour.elements.filter((el) => el.elastic === true).map((el) => el.seconds),
);
ok(
  flexes.every((s) => s >= MIN_FLEX && s <= MAX_FLEX),
  "every back-announce is within its bounds",
);

const hosted = stats.filter((s) => station.modeOf(s.hour) === "hosted");
const automated = stats.filter((s) => station.modeOf(s.hour) === "automated");
const network = stats.filter((s) => station.modeOf(s.hour) === "network");

eq(hosted.length, 16, "sixteen hosted hours");
eq(automated.length, 4, "four automated hours");
eq(network.length, 4, "four network hours");

ok(
  hosted.every((s) => s.finestTrim === 1),
  "every hosted hour absorbs with speech",
);
ok(
  automated.every((s) => s.finestTrim > 120),
  "no automated hour has anything shorter than a record to trim",
);
ok(
  network.every((s) => s.drift === 0),
  "the network hours are exactly an hour, because the feed decides",
);

/* ── 5. The claim the front page makes ──────────────────────────────── */
section("The cluttered hours are the accurate ones");

const [hostedBand, automatedBand] = station.bands;

ok(
  hostedBand.meanElements > automatedBand.meanElements,
  `hosted hours carry more elements (${hostedBand.meanElements.toFixed(1)} vs ${automatedBand.meanElements.toFixed(1)})`,
);
ok(
  hostedBand.meanFinestTrim < automatedBand.meanFinestTrim,
  "and a finer correction to make with",
);
ok(
  hostedBand.meanAbsDrift * 5 < automatedBand.meanAbsDrift,
  `and land far closer (${duration(hostedBand.meanAbsDrift)} against ${duration(automatedBand.meanAbsDrift)})`,
);
ok(
  hostedBand.worstAbsDrift < automatedBand.worstAbsDrift,
  "their worst hour is better than the other band's worst hour",
);

/* ── 6. §7b — every state is reached, once ──────────────────────────── */
section("Every state is reached, and only as often as it should be");

const missed = stats.filter((s) => !s.clean);
const missedHosted = missed.filter((s) => station.modeOf(s.hour) === "hosted");

eq(missedHosted.length, 1, "exactly one hosted hour misses its junction");
eq(missedHosted[0]?.hour.h, 14, "and it is the hour with the live insert in it");
ok(
  missedHosted[0]?.drift > 60,
  `it misses by ${signedShort(missedHosted[0]?.drift ?? 0)}, which is visible`,
);
ok(
  missed.filter((s) => station.modeOf(s.hour) === "automated").length >= 2,
  "and at least two automated hours miss too, or the band comparison has nothing in it",
);

const drafts = station.hours.filter((h) => h.draft === true);
eq(drafts.length, 1, "exactly one hour is built but not signed off");

ok(
  station.impossibleDemands.length === 1,
  `exactly one show asks its wheel for more than it holds (${station.impossibleDemands.length})`,
);
const demand = station.impossibleDemands[0];
eq(demand?.showId, "local-cuts", "and it is Local Cuts");
eq(
  demand?.forcedRepeats,
  demand?.slotsPerHour - demand?.available,
  "forced repeats are slots minus records",
);

/* ── 7. Rotation ────────────────────────────────────────────────────── */
section("Rotation");

const breaches = station.breaches;
ok(breaches.length > 0, "the day does break its rules somewhere, or the flag is dead code");
ok(
  breaches.every((b) => b.gap < b.required),
  "every reported breach really is inside its rule",
);
ok(
  breaches.every((b) => b.at.start > b.previous.start),
  "a breach always points backwards at the play it is too close to",
);
ok(
  breaches.some((b) => b.kind === "rest") && breaches.some((b) => b.kind === "artist"),
  "both kinds of rule are exercised",
);

// The interesting property: every breach is downstream of the one show
// that over-subscribes its wheel. If a breach ever appears somewhere
// else, either the library shrank or a clock changed, and the rules page
// stops being true.
ok(
  breaches.every((b) => b.at.hour >= 19 && b.at.hour <= 21),
  `every breach is in or just after Local Cuts (hours ${[...new Set(breaches.map((b) => b.at.hour))].join(", ")})`,
);

// Nothing else is over-subscribed, so every wheel keeps its rest across
// the day even though one hour inside it cannot.
ok(
  station.feasibilities.every((f) => f.feasible),
  "every wheel can keep its own rest across the day",
);

// A property of the measure rather than of this data: a wheel with more
// records in it can always keep a longer rest, all else equal.
const localFeasibility = station.feasibilities.find((f) => f.category.id === "local");
const doubled =
  (localFeasibility.windowHours * (localFeasibility.size * 2)) / localFeasibility.plays;
ok(
  doubled > localFeasibility.achievableRestHours,
  "twice the records buys a longer achievable rest",
);

/* ── 8. Underwriting, counted ───────────────────────────────────────── */
section("Underwriting");

for (const d of station.deliveries) {
  const manual = placed.filter(
    (p) => p.element.kind === "spot" && p.element.ref === d.spot.id,
  ).length;
  eq(d.aired, manual, `${d.spot.id}: the count matches the log`);
  eq(
    d.inFlight,
    WEEKDAY >= d.spot.flightFrom && WEEKDAY <= d.spot.flightTo,
    `${d.spot.id}: flight covers today or it does not`,
  );
}

eq(
  station.deliveries.filter((d) => d.shortBy > 0).length,
  1,
  "exactly one underwriter is short today",
);
eq(
  station.deliveries.filter((d) => d.outsideFlight > 0).length,
  1,
  "exactly one is airing outside its flight",
);
ok(
  station.deliveries
    .filter((d) => d.inFlight)
    .every((d) => d.shortBy === Math.max(0, d.spot.contractedPerDay - d.aired)),
  "the shortfall is contracted minus aired",
);

/* ── 9. The clock, and what is on air ───────────────────────────────── */
section("What is on air at the pinned second");

const onAir = station.onAir;
ok(onAir !== null, "something is on air at the pinned second");
ok(
  onAir && NOW >= onAir.placed.start && NOW < onAir.placed.start + onAir.placed.seconds,
  "and the pinned second really is inside it",
);
eq(onAir?.placed.element.kind, "music", "it is a record, which is what the console shows off");
eq(
  onAir?.elapsed + onAir?.remaining,
  onAir?.placed.seconds,
  "elapsed plus remaining is the whole element",
);
eq(
  model.toJunction(NOW),
  model.SECONDS_PER_HOUR - (NOW % model.SECONDS_PER_HOUR),
  "the count to the junction is the rest of the hour",
);
ok(
  station.comingUp.every((p) => p.start + p.seconds > NOW && p.hour === station.currentHour),
  "everything still to come is in this hour and has not finished",
);

/* ── 10. Formatting round-trips ─────────────────────────────────────── */
section("Formatting");

eq(duration(0), "0:00", "zero length");
eq(duration(9), "0:09", "single seconds are padded");
eq(duration(249), "4:09", "a record");
eq(duration(3600), "1:00:00", "an hour rolls over");
eq(clock(6 * 3600), "06:00", "the start of the broadcast day");
eq(clock(25 * 3600), "01:00", "and hour 25 is one in the morning");
eq(clock(29 * 3600 + 59 * 60), "05:59", "the last minute before it starts again");
eq(signedShort(0), "0:00", "a zero drift as a column value");
eq(signedShort(114), "+1:54", "long");
eq(signedShort(-114), "−1:54", "short, with a real minus sign");

/* ── 11. Photography ────────────────────────────────────────────────── */
section("Photography");

for (const [key, shot] of Object.entries(shots)) {
  ok(
    existsSync(path.join(root, "src", "photos", shot.file)),
    `${key}: the file is committed`,
  );
  ok(shot.alt.length > 30, `${key}: has real alt text`);
  ok(shot.job.length > 60, `${key}: has a stated narrative job`);
  ok(shot.caption.length > 10, `${key}: has a caption`);
}

// §6 asks that every photograph does work. A shot nothing renders is
// decoration that has not even been placed.
const pageSource = sourceFiles
  .filter((f) => f.includes(`${path.sep}pages${path.sep}`))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");
for (const key of Object.keys(shots)) {
  ok(pageSource.includes(`shots.${key}`), `${key}: is actually rendered by a page`);
}

/* ---------- report ---------- */

console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${passed} checks passed\n`);
  console.log(`  Hosted   mean miss ${duration(hostedBand.meanAbsDrift)}, worst ${duration(hostedBand.worstAbsDrift)}`);
  console.log(`  Automated mean miss ${duration(automatedBand.meanAbsDrift)}, worst ${duration(automatedBand.worstAbsDrift)}`);
  console.log(`  Breaches ${breaches.length} in hours ${[...new Set(breaches.map((b) => b.at.hour))].join(", ")}`);
  console.log(`  On air at ${clock(NOW)}: ${onAir?.placed.element.ref}, ${duration(onAir?.remaining ?? 0)} left\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${passed + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
