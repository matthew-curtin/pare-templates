/**
 * The route, checked.
 *
 *   node scripts/check-route.mjs
 *
 * Run it with the machine's timezone set to somewhere else as well, or
 * it will happily agree with a bug on this laptop:
 *
 *   TZ=Asia/Tokyo node scripts/check-route.mjs
 *
 * These import the REAL modules rather than a copy — node strips the
 * types on its own — so a rule asserted here is a rule the site obeys.
 * CONVENTIONS §8.
 *
 * The two assertions worth reading before the rest are the ones about
 * the PLANNER, because they are properties of an algorithm rather than
 * of a list of numbers, and a design that quietly loses them looks
 * fine:
 *
 *   - asking for one more day never makes the longest day longer
 *   - no plan, at any length, has a day shorter than the longest
 *     single leg — because a leg cannot be broken
 *
 * The first is what makes the slider trustworthy. The second is the
 * argument the whole site is built on, and it is a fact about the
 * content that a careless edit to one leg would silently destroy.
 */

import {
  ascentOf,
  descentOf,
  netOf,
  highPointOf,
  hoursOf,
  dominantTerrain,
  terrainBreakdown,
  sumMix,
  totalDistance,
  totalAscent,
  totalDescent,
  totalHours,
  mileposts,
  routeProfile,
  profileBounds,
  splitInto,
  dayRange,
  longestDayByLength,
  chainBreaks,
  terrainMismatches,
  elevationMismatches,
  TERRAIN_ORDER,
} from "../src/lib/route.ts";
import {
  hoursLabel,
  hoursRough,
  feet,
  miles,
  shortDate,
  dayKey,
  daysBetween,
  agoLabel,
  seasonStatus,
} from "../src/lib/format.ts";
import { legs, shelters } from "../src/content/route.ts";
import { reports, access, seasonNotes } from "../src/content/conditions.ts";
import { NOW, ZONE, site, model, terrainNames } from "../src/content/site.ts";

let passed = 0;
const failures = [];

function ok(cond, label, detail) {
  if (cond) passed += 1;
  else failures.push(detail ? `${label}\n     ${detail}` : label);
}

function eq(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  ok(a === e, label, `expected ${e}\n     got      ${a}`);
}

function close(actual, expected, tol, label) {
  ok(
    Math.abs(actual - expected) <= tol,
    label,
    `expected ${expected} ± ${tol}\n     got      ${actual}`,
  );
}

function section(name) {
  console.log(`\n  ${name}`);
}

const byShelter = new Map(shelters.map((s) => [s.id, s]));

// ── 1. Shape of the route ─────────────────────────────────────────────
section("Shape of the route");

eq(legs.length, shelters.length - 1, "there is one leg between each pair of shelters");
eq(new Set(legs.map((l) => l.id)).size, legs.length, "leg ids are unique");
eq(new Set(legs.map((l) => l.slug)).size, legs.length, "leg slugs are unique");
eq(new Set(shelters.map((s) => s.id)).size, shelters.length, "shelter ids are unique");
eq(new Set(shelters.map((s) => s.slug)).size, shelters.length, "shelter slugs are unique");

eq(chainBreaks(legs), [], "every leg starts where the last one ended");
eq(legs[0].from, shelters[0].id, "the first leg leaves the first shelter");
eq(legs[legs.length - 1].to, shelters[shelters.length - 1].id, "the last leg arrives at the last");
ok(
  legs.every((l) => byShelter.has(l.from) && byShelter.has(l.to)),
  "every leg names shelters that exist",
);
eq(
  shelters.filter((s) => s.kind === "trailhead").map((s) => s.id),
  ["kettleback", "sable-gate"],
  "the two trailheads are the two ends",
);

// ── 2. The numbers agree with each other ──────────────────────────────
section("The numbers agree with each other");

eq(terrainMismatches(legs), [], "terrain miles add up to the leg's distance, every leg");
eq(
  elevationMismatches(legs, shelters),
  [],
  "each profile starts and ends at the elevation of its shelters",
);

ok(
  legs.every((l) => ascentOf(l) - descentOf(l) === netOf(l)),
  "ascent minus descent is the net change, every leg",
);
ok(
  legs.every((l) => highPointOf(l) >= Math.max(l.profile[0], l.profile[l.profile.length - 1])),
  "the high point of a leg is at least as high as either end",
);
eq(
  totalAscent(legs) - totalDescent(legs),
  shelters[shelters.length - 1].elevation - shelters[0].elevation,
  "the route's total climb and drop reconcile against the two trailheads",
);

ok(
  legs.every((l) => l.profile.length >= 6),
  "no leg is drawn with fewer than six samples",
);
ok(
  legs.every((l) => TERRAIN_ORDER.every((t) => l.terrain[t] >= 0)),
  "no leg has negative terrain",
);
ok(
  legs.every((l) => terrainBreakdown(l).every((b) => b.miles > 0)),
  "the terrain breakdown drops classes a leg has none of",
);
ok(
  legs.every((l) => Math.abs(sumMix(l.terrain) - l.distance) < 0.001),
  "sumMix agrees with the stated distance",
);

// The headline figures, pinned. If a leg is edited these move, and they
// are quoted in the copy on three pages — so they are asserted rather
// than trusted to be noticed.
close(totalDistance(legs), 122.1, 0.001, "the route is 122.1 miles");
eq(totalAscent(legs), 13490, "and climbs 13,490 feet");
eq(totalDescent(legs), 13630, "and loses 13,630");
eq(profileBounds(legs).low, 1040, "the lowest point is Sable Gate");
eq(profileBounds(legs).high, 5180, "the highest is on the Cairnwell ridge");

// ── 3. The whole-route polyline ───────────────────────────────────────
section("The whole-route polyline");

const line = routeProfile(legs);
const expectedPoints = legs.reduce((n, l) => n + l.profile.length, 0) - (legs.length - 1);
eq(line.length, expectedPoints, "shared shelter samples are not drawn twice");
ok(
  line.every((p, i) => i === 0 || p.mile >= line[i - 1].mile - 1e-9),
  "the line never goes backwards along the route",
);
close(line[line.length - 1].mile, totalDistance(legs), 1e-9, "and it ends at the full distance");
eq(line[0].elevation, shelters[0].elevation, "it starts at the first trailhead's height");
eq(
  line[line.length - 1].elevation,
  shelters[shelters.length - 1].elevation,
  "and finishes at the last one's",
);

const posts = mileposts(legs);
eq(posts.length, shelters.length, "there is a milepost for every shelter");
eq(posts[0], 0, "the first is zero");
close(posts[posts.length - 1], totalDistance(legs), 1e-9, "the last is the total");
ok(
  posts.every((p, i) => i === 0 || p > posts[i - 1]),
  "and they increase",
);

// ── 4. The argument the site is making ────────────────────────────────
section("The argument the site is making");

const byHours = [...legs].sort((a, b) => hoursOf(b, model) - hoursOf(a, model));
const byMiles = [...legs].sort((a, b) => b.distance - a.distance);

ok(
  byHours[0].id !== byMiles[0].id,
  "the longest leg in hours is NOT the longest in miles",
  `hours: ${byHours[0].name}, miles: ${byMiles[0].name}`,
);
eq(byHours[0].slug, "the-ninebark-flats", "the longest day is the Ninebark flats");
eq(byMiles[0].slug, "the-long-drop", "the longest distance is the long drop");
ok(netOf(byHours[0]) < 0, "and the longest day is downhill overall, which is the point");

const flats = legs.find((l) => l.slug === "the-ninebark-flats");
eq(dominantTerrain(flats), "bog", "the flats are mostly bog");
ok(
  hoursOf(flats, model) > 11,
  "the flats take over eleven hours",
  `${hoursLabel(hoursOf(flats, model))}`,
);
const shortest = [...legs].sort((a, b) => hoursOf(a, model) - hoursOf(b, model))[0];
eq(shortest.slug, "coldwater-riverside", "the shortest day is the riverside");
ok(
  hoursOf(byHours[0], model) / hoursOf(shortest, model) > 3.5,
  "the longest day is more than three and a half times the shortest",
);

close(totalHours(legs, model), 87.47, 0.05, "the whole route is about 87½ hours of walking");

// Every terrain class is actually used, or a colour in the rail is
// decoration. And the ramp's order has to match the pace order, or the
// legibility argument in globals.css is false.
for (const t of TERRAIN_ORDER) {
  ok(
    legs.some((l) => l.terrain[t] > 0),
    `terrain class "${t}" appears on the route`,
  );
  ok(Boolean(terrainNames[t]), `terrain class "${t}" has a label and a gloss`);
}
ok(
  TERRAIN_ORDER.every(
    (t, i) => i === 0 || model.pace[t] < model.pace[TERRAIN_ORDER[i - 1]],
  ),
  "TERRAIN_ORDER runs fastest to slowest, which is what the colour ramp assumes",
);

// The front page spells three of these paces out in words. Prose is
// mostly beyond a checker's reach, but a number written as a word is
// not — and a pace nudged by a tenth would leave the sentence quietly
// wrong with nothing anywhere reporting it.
const minutesPerMile = (t) => Math.round(60 / model.pace[t]);
eq(minutesPerMile("trail"), 23, "a mile of graded trail takes twenty-three minutes");
eq(minutesPerMile("bog"), 55, "a mile of peat takes fifty-five");
eq(minutesPerMile("talus"), 50, "a mile of boulder takes fifty");
ok(
  new Set(legs.map((l) => dominantTerrain(l))).size >= 3,
  "at least three terrain classes dominate some leg, so the rail is not one colour",
);

// ── 5. The planner ────────────────────────────────────────────────────
section("The planner");

eq(dayRange(legs), { min: 1, max: legs.length }, "the planner can express one day per leg");
eq(splitInto(legs, 0, model), [], "asking for zero days returns nothing");
eq(splitInto(legs, legs.length + 1, model), [], "asking for more days than legs returns nothing");

for (let k = 1; k <= legs.length; k += 1) {
  const plan = splitInto(legs, k, model);
  const flat = plan.flatMap((d) => d.legs.map((l) => l.id));
  eq(plan.length, k, `a ${k}-day plan has ${k} days`);
  eq(flat, legs.map((l) => l.id), `a ${k}-day plan walks every leg, in order, once`);
  ok(
    plan.every((d) => d.legs.length > 0),
    `no day in a ${k}-day plan is empty`,
  );
  close(
    plan.reduce((n, d) => n + d.distance, 0),
    totalDistance(legs),
    1e-6,
    `a ${k}-day plan covers the whole distance`,
  );
  close(
    plan.reduce((n, d) => n + d.hours, 0),
    totalHours(legs, model),
    1e-6,
    `a ${k}-day plan totals the same hours`,
  );
  eq(
    plan.reduce((n, d) => n + d.ascent, 0),
    totalAscent(legs),
    `a ${k}-day plan climbs the same feet`,
  );
  ok(
    plan.every((d) => d.dry === d.legs.some((l) => l.dry)),
    `dry days in a ${k}-day plan are exactly the days with a dry leg`,
  );
}

const worst = longestDayByLength(legs, model);
ok(
  worst.every((h, i) => i === 0 || h <= worst[i - 1] + 1e-9),
  "one more day never makes the longest day longer",
  worst.map((h) => hoursLabel(h)).join(" → "),
);

const floorHours = Math.max(...legs.map((l) => hoursOf(l, model)));
close(
  worst[worst.length - 1],
  floorHours,
  1e-9,
  "with a day per leg, the longest day is the longest leg",
);
ok(
  worst.every((h) => h >= floorHours - 1e-9),
  "and NO plan of any length has a day shorter than that — a leg cannot be broken",
);

eq(
  JSON.stringify(splitInto(legs, 7, model).map((d) => d.legs.map((l) => l.id))),
  JSON.stringify(splitInto(legs, 7, model).map((d) => d.legs.map((l) => l.id))),
  "the planner is deterministic",
);

// §7b: the states the planner can draw have to be reachable. A long-day
// warning that never fires is dead design, and one that fires on every
// row has stopped being a warning.
const LONG_DAY = 12;
const sevenDay = splitInto(legs, 7, model);
const elevenDay = splitInto(legs, 11, model);
ok(
  sevenDay.some((d) => d.hours > LONG_DAY),
  "a seven-day plan contains at least one day over twelve hours",
);
ok(
  !elevenDay.some((d) => d.hours > LONG_DAY),
  "an eleven-day plan contains none, so the warning is a signal rather than wallpaper",
);
eq(elevenDay.filter((d) => d.dry).length, 2, "exactly two days are dry when each leg is a day");

// ── 6. Water, escape and shelter states ───────────────────────────────
section("Water, escape and shelter states");

eq(legs.filter((l) => l.dry).length, 2, "two legs of eleven have no water on them");
ok(
  legs.some((l) => l.escape === null),
  "some legs have no escape route",
);
ok(
  legs.some((l) => l.escape !== null),
  "and some do, so the absence reads as information",
);
eq(
  legs.filter((l) => l.escape === null).map((l) => l.slug),
  ["the-slate-ladder", "the-cairnwell-ridge", "the-ember-climb", "the-rime-steps"],
  "the four legs with no way off are the four high ones",
);

// The getting-there page claims two of them run BACK TO BACK, and names
// which two. That is a structural fact about the route rather than a
// turn of phrase, and the first version of the sentence got it wrong —
// it said four consecutive legs where the data has two. A claim in the
// copy that the data can settle should be settled here.
const consecutive = [];
for (let i = 1; i < legs.length; i += 1) {
  if (legs[i].escape === null && legs[i - 1].escape === null) {
    consecutive.push(`${legs[i - 1].slug}+${legs[i].slug}`);
  }
}
eq(
  consecutive,
  ["the-slate-ladder+the-cairnwell-ridge"],
  "exactly one pair of no-escape legs runs back to back, and it is Slatefall to The Cistern",
);

// And the count the planner's copy quotes: a day can end at any fixed
// point except the two trailheads.
eq(
  shelters.filter((s) => s.kind !== "trailhead").length,
  10,
  "there are ten places between the trailheads where a day can end",
);

ok(
  shelters.some((s) => s.kind === "tent" && s.bunks === 0),
  "there is a platform site with no bunks — the :has([data-bunks=\"0\"]) state",
);
ok(
  shelters.filter((s) => s.kind !== "trailhead").every((s) => s.kind === "tent" || s.bunks > 0),
  "and every other shelter has bunks to print",
);
for (const kind of ["staffed", "open", "tent", "trailhead"]) {
  ok(
    shelters.some((s) => s.kind === kind),
    `shelter kind "${kind}" is used`,
  );
}
for (const water of ["reliable", "seasonal", "cistern", "none"]) {
  ok(
    shelters.some((s) => s.water === water),
    `water kind "${water}" is used`,
  );
}
ok(
  shelters.every((s) => s.booking === "required" || s.booking === "first-come"),
  "every shelter says whether it can be booked",
);
ok(
  shelters.every((s) => s.note.length > 60),
  "every shelter has a real note rather than a placeholder",
);

// The dry legs must arrive somewhere with water, or the content is
// telling people to walk a waterless leg to a waterless hut.
for (const leg of legs.filter((l) => l.dry)) {
  const to = byShelter.get(leg.to);
  ok(
    to.water !== "none",
    `${leg.name} is dry, but ${to.name} at the end of it has water`,
  );
}

// ── 7. The clock, and the story in time ───────────────────────────────
section("The clock, and the story in time");

eq(dayKey(NOW, ZONE), "2026-08-12", "the pinned instant is 12 August in the pinned zone");
eq(daysBetween("2026-08-11", "2026-08-12"), 1, "consecutive days are one apart");
eq(daysBetween("2026-08-12", "2026-08-12"), 0, "the same day is zero apart");
eq(daysBetween("2026-07-29", "2026-08-12"), 14, "and it crosses a month correctly");

eq(agoLabel("2026-08-12", NOW, ZONE), "today", "a report filed today reads today");
eq(agoLabel("2026-08-11", NOW, ZONE), "yesterday", "yesterday evening is still yesterday");
eq(agoLabel("2026-08-06", NOW, ZONE), "6 days ago", "and older reports count days");

const season = seasonStatus(NOW, ZONE, site.season);
ok(season.open, "the pinned date is inside the season");
eq(season.length, 107, "the season is 107 days long");
eq(season.dayOf, 53, "and the pinned date is day 53 of it");
ok(season.remaining > 0 && season.remaining < season.length, "with days left, but not all of them");

ok(
  reports.every((r) => daysBetween(r.date, dayKey(NOW, ZONE)) >= 0),
  "no report is dated in the future",
);
ok(
  reports.every((r, i) => i === 0 || r.date <= reports[i - 1].date),
  "reports are listed newest first",
);
ok(
  reports.some((r) => r.kind === "warning") && reports.some((r) => r.kind === "note"),
  "there are both warnings and notes",
);
ok(
  reports.filter((r) => r.kind === "warning").length < reports.length / 2,
  "and warnings are the minority, so amber still means something",
);
const places = new Set([...shelters.map((s) => s.name), ...legs.map((l) => l.name)]);
ok(
  reports.every((r) => places.has(r.where)),
  "every report is filed against a place that exists",
  reports.filter((r) => !places.has(r.where)).map((r) => r.where).join(", "),
);

// The two live warnings have to be about the two shelters whose water
// the route data says is seasonal, or the conditions page and the
// shelter list are telling different stories.
const seasonalNames = new Set(
  shelters.filter((s) => s.water === "seasonal").map((s) => s.name),
);
ok(
  reports
    .filter((r) => r.kind === "warning")
    .every((r) => seasonalNames.has(r.where)),
  "every live warning is about a shelter the route data calls seasonal",
);

// ── 8. Formatting ─────────────────────────────────────────────────────
section("Formatting");

eq(hoursLabel(11.222), "11h13", "hours render as a time, not a decimal");
eq(hoursLabel(2), "2h00", "a whole number keeps its minutes");
eq(hoursLabel(0.5), "0h30", "and half an hour is thirty minutes");
// 9.9917 h is 599.5 minutes. Rounding the MINUTES before splitting is
// what stops this printing "9h60"; splitting first and rounding the
// remainder does exactly that, and looks right until you see one.
eq(hoursLabel(9.9917), "10h00", "rounding never invents a sixtieth minute");
eq(hoursRough(87.47), "87½ hours", "a running total rounds to the half");
eq(hoursRough(87.9), "88 hours", "and up when it is nearly there");
eq(feet(13490), "13,490 ft", "feet get a thousands separator");
eq(miles(11.4), "11.4 mi", "miles keep one decimal");
eq(miles(9), "9.0 mi", "including when it is whole");
eq(shortDate("2026-08-11", ZONE), "11 August", "a date drops the year");

// ── 9. Copy ───────────────────────────────────────────────────────────
section("Copy");

ok(
  legs.every((l) => l.summary.length > 40 && l.detail.length >= 2),
  "every leg has a summary and at least two paragraphs",
);
ok(
  legs.every((l) => l.detail.every((p) => p.length > 100)),
  "and no paragraph is a stub",
);
ok(
  seasonNotes.length >= 3 && seasonNotes.every((n) => n.body.length > 80),
  "the season is explained rather than asserted",
);
ok(access.length >= 4, "getting there covers both ends and the shuttle");
ok(
  site.footer.body.includes("invented"),
  "the footer says the whole thing is made up — §7",
);

// ── Report ────────────────────────────────────────────────────────────
console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${passed} checks passed\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${passed + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
