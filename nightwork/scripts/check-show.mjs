/**
 * The model, the states and — the part that matters — THE PROSE.
 *
 *   node scripts/check-show.mjs
 *
 * A number inside a sentence is the one kind of content nothing else in
 * this repo can catch. It typechecks, it builds, it renders, and it is
 * wrong. Every figure quoted in the copy of this template is asserted
 * here against the module that produces it, so nudging a `count` in
 * `shows.ts` breaks the sentence that depended on it instead of quietly
 * making it false.
 *
 * It imports the REAL modules — node strips the types — so it validates
 * what the site ships rather than a copy that drifts.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { SHELLS, PRICE_PAIRS } from "../src/content/shells.ts";
import { SHOWS } from "../src/content/shows.ts";
import { SITES, siteById } from "../src/content/sites.ts";
import { CLAIMS, SITE, ABOUT, FOOTER_NOTE, COMMISSION } from "../src/content/site.ts";
import * as B from "../src/lib/ballistics.ts";
import { EMITTERS, emitter } from "../src/lib/emission.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "src");

let passed = 0;
const failures = [];

function ok(label, condition, detail = "") {
  if (condition) passed += 1;
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

function eq(label, actual, expected) {
  ok(label, actual === expected, `expected ${expected}, got ${actual}`);
}

function near(label, actual, expected, tol) {
  ok(
    label,
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ±${tol}, got ${Number(actual).toFixed(4)}`,
  );
}

/**
 * Prose lives in TypeScript string literals, which the formatter is free
 * to wrap wherever it likes. A phrase that straddles a line break fails a
 * naive match while the page renders perfectly — which is this surface's
 * whole failure mode, since nothing looks broken when it is wrong. So
 * everything is normalised before being searched.
 */
const squash = (s) => s.replace(/\s+/g, " ").trim();

function contains(label, haystack, needle) {
  ok(label, squash(haystack).includes(squash(needle)), `missing: "${needle}"`);
}

/* ── 1. Integrity ──────────────────────────────────────────────────── */

const shellIds = new Set(SHELLS.map((s) => s.id));
eq("shell ids are unique", shellIds.size, SHELLS.length);
eq("show slugs are unique", new Set(SHOWS.map((s) => s.slug)).size, SHOWS.length);
eq("site ids are unique", new Set(SITES.map((s) => s.id)).size, SITES.length);
eq("emitter ids are unique", new Set(EMITTERS.map((e) => e.id)).size, EMITTERS.length);

for (const show of SHOWS) {
  ok(`${show.slug}: site exists`, SITES.some((s) => s.id === show.siteId));
  const segIds = new Set(show.segments.map((s) => s.id));
  eq(`${show.slug}: segment ids unique`, segIds.size, show.segments.length);
  for (const seg of show.segments) {
    ok(`${show.slug}/${seg.id}: shell exists`, shellIds.has(seg.shellId), seg.shellId);
    ok(`${show.slug}/${seg.id}: positive count`, seg.count > 0);
    ok(`${show.slug}/${seg.id}: non-negative spacing`, seg.spacingTenths >= 0);
  }
}

for (const shell of SHELLS) {
  ok(`${shell.id}: has at least one emitter`, shell.emissions.length > 0);
  for (const id of shell.emissions) {
    ok(`${shell.id}: emitter ${id} exists`, EMITTERS.some((e) => e.id === id));
  }
  ok(`${shell.id}: positive lift`, shell.liftTenths > 0);
  ok(`${shell.id}: positive stars`, shell.stars > 0);
}

/* ── 2. Arithmetic ─────────────────────────────────────────────────── */

const data = SHOWS.map((show) => {
  const cues = B.expandShow(show, SHELLS);
  return { show, cues, site: siteById(show.siteId) };
});
const allCues = data.flatMap((d) => d.cues);

for (const { show, cues } of data) {
  const expected = show.segments.reduce((n, s) => n + s.count, 0);
  eq(`${show.slug}: cue count`, cues.length, expected);

  for (const cue of cues) {
    const shell = B.shellById(SHELLS, cue.shellId);
    if (cue.fireTenths !== cue.breakTenths - shell.liftTenths) {
      failures.push(`${cue.id}: fire ≠ break − lift`);
      break;
    }
  }
  passed += 1;

  const sorted = cues.every(
    (c, i) => i === 0 || cues[i - 1].breakTenths <= c.breakTenths,
  );
  ok(`${show.slug}: cues sorted by break time`, sorted);

  // Deterministic: the same call twice gives byte-identical answers, or
  // every number on every page changes between renders.
  const again = B.expandShow(show, SHELLS);
  ok(
    `${show.slug}: expansion is deterministic`,
    JSON.stringify(again) === JSON.stringify(cues),
  );

  // Scatter stays inside the ±4% it claims.
  for (const cue of cues) {
    const seg = show.segments.find((s) => s.id === cue.segmentId);
    const base = seg.altitudeM ?? B.shellById(SHELLS, cue.shellId).altitudeM;
    if (cue.altitudeM < base * 0.955 || cue.altitudeM > base * 1.045) {
      failures.push(`${cue.id}: scatter outside ±4% (${cue.altitudeM} vs ${base})`);
      break;
    }
  }
  passed += 1;
}

// The catalogue's own stated relationships.
for (const shell of SHELLS) {
  near(
    `${shell.id}: breaks at ~30m per inch`,
    shell.altitudeM / shell.sizeInches,
    30,
    0.5,
  );
  // ~33 m per inch for a spherical break. A crossette is legitimately
  // wider — each star splits and the fragments keep going — so the
  // tolerance has to admit the one effect that is not a sphere.
  const burstTolerance = shell.effect === "Crossette" ? 4 : 2.5;
  ok(
    `${shell.id}: burst ~33m per inch`,
    Math.abs(shell.burstM / shell.sizeInches - 33) <= burstTolerance,
    `${(shell.burstM / shell.sizeInches).toFixed(1)} m/in`,
  );
}

// Lift climbs with height, but slower than height does.
const bySize = [...new Set(SHELLS.map((s) => s.sizeInches))].sort((a, b) => a - b);
for (let i = 1; i < bySize.length; i += 1) {
  const lo = SHELLS.find((s) => s.sizeInches === bySize[i - 1]);
  const hi = SHELLS.find((s) => s.sizeInches === bySize[i]);
  ok(
    `lift increases with size (${bySize[i - 1]}in → ${bySize[i]}in)`,
    hi.liftTenths > lo.liftTenths,
  );
  ok(
    `lift grows slower than height (${bySize[i - 1]}in → ${bySize[i]}in)`,
    hi.liftTenths / lo.liftTenths < hi.altitudeM / lo.altitudeM,
  );
}

/* ── 3. The invariant that would break silently ────────────────────── */

// A show that fires a shell its ground cannot legally take is the one
// error here that is invisible on every page and illegal in real life.
for (const { show, cues } of data) {
  const largest = Math.max(
    ...cues.map((c) => B.shellById(SHELLS, c.shellId).sizeInches),
  );
  const permitted = B.largestShellFor(show.crowdM);
  ok(
    `${show.slug}: largest shell within the site's radius`,
    largest <= permitted,
    `uses ${largest}in at ${show.crowdM}m, which permits ${permitted}in`,
  );
}

/* ── 4. Matched pairs ──────────────────────────────────────────────── */

for (const pair of PRICE_PAIRS) {
  const g = B.shellById(SHELLS, pair.gold);
  const b = B.shellById(SHELLS, pair.blue);
  eq(`${pair.gold}/${pair.blue}: same diameter`, g.sizeInches, b.sizeInches);
  eq(`${pair.gold}/${pair.blue}: same effect`, g.effect, b.effect);
  eq(`${pair.gold}/${pair.blue}: same star count`, g.stars, b.stars);
  ok(`${pair.gold}: is gold`, g.emissions.length === 1 && g.emissions[0] === "gold");
  ok(`${pair.blue}: is blue`, b.emissions.length === 1 && b.emissions[0] === "blue");
  ok(
    `${pair.gold}/${pair.blue}: blue costs more`,
    b.costUsd > g.costUsd,
    `£${g.costUsd} vs £${b.costUsd}`,
  );
}

/* ── 5. Every state the design can show (CONVENTIONS §7b) ──────────── */

const fleetBudget = B.emissionBudget(allCues, SHELLS);
const enriched = data.map((d) => {
  const budget = B.emissionBudget(d.cues, SHELLS);
  return {
    ...d,
    budget,
    signature: B.signatureEmission(budget, fleetBudget),
    salvos: B.simultaneousGroups(d.cues),
    firstFire: B.firstFire(d.cues),
    peakRate: B.peakRate(d.cues),
    cost: B.totalCost(d.cues, SHELLS),
    lastLight: B.lastLight(d.cues, SHELLS),
  };
});

eq(
  "every show has a different signature emitter",
  new Set(enriched.map((d) => d.signature)).size,
  enriched.length,
);

for (const d of enriched) {
  ok(`${d.show.slug}: has a break-together-fire-apart group`, d.salvos.length > 0);
  ok(
    `${d.show.slug}: its signature is genuinely present`,
    d.budget.find((r) => r.id === d.signature).share >= B.SIGNATURE_FLOOR,
  );
}

// Ground-limited, money-limited, choice-limited: one clear example each.
const groundLimited = enriched.filter(
  (d) =>
    Math.max(...d.cues.map((c) => B.shellById(SHELLS, c.shellId).sizeInches)) ===
      B.largestShellFor(d.show.crowdM) && B.largestShellFor(d.show.crowdM) <= 4,
);
eq("exactly one show is limited by its ground", groundLimited.length, 1);
eq("and it is Ravensmoor", groundLimited[0].show.slug, "ravensmoor");

const sixBells = enriched.find((d) => d.show.slug === "six-bells");
ok(
  "Six Bells is limited by money, not ground",
  Math.max(...sixBells.cues.map((c) => B.shellById(SHELLS, c.shellId).sizeInches)) <
    B.largestShellFor(sixBells.show.crowdM),
);

// The model caught this one: Six Bells is NOT the cheapest display —
// Ravensmoor is, because it is four minutes long. Six Bells is the
// cheapest by the MINUTE, which is what the copy now says.
const cheapest = [...enriched].sort((a, b) => a.cost - b.cost)[0];
eq("the smallest job outright is Ravensmoor", cheapest.show.slug, "ravensmoor");
const cheapestPerMinute = [...enriched].sort(
  (a, b) => a.cost / a.lastLight - b.cost / b.lastLight,
)[0];
eq("Six Bells is the cheapest per minute", cheapestPerMinute.show.slug, "six-bells");
contains(
  "and its note says per minute, not outright",
  sixBells.show.notes[0],
  "costs less per minute than anything else we fire",
);
const perMinute = [...enriched].sort(
  (a, b) => b.cost / b.lastLight - a.cost / a.lastLight,
)[0];
eq("Blue Hour is the dearest per minute", perMinute.show.slug, "blue-hour");

// Cued to sound is reachable, and reached exactly once.
eq(
  "exactly one show is cued to the sound",
  SHOWS.filter((s) => s.cueTo === "sound").length,
  1,
);

/* ── 6. The prose ──────────────────────────────────────────────────── */

const longField = enriched.find((d) => d.show.slug === "the-long-field");
const harbour = enriched.find((d) => d.show.slug === "harbour-nine");
const ravensmoor = enriched.find((d) => d.show.slug === "ravensmoor");
const blueHour = enriched.find((d) => d.show.slug === "blue-hour");
const coldOpen = enriched.find((d) => d.show.slug === "cold-open");

// "Five of the six displays here have a cue with a negative time on it"
const early = enriched.filter((d) => d.firstFire < 0);
eq("five of six shows fire before their announced start", early.length, 5);
eq("and there are six shows", SHOWS.length, 6);
contains("front page says five of six", CLAIMS[1].body, "Five of the six displays");

// "A twelve-inch shell takes 6.3 seconds"
const twelve = B.shellById(SHELLS, "c12-gold");
eq("a twelve-inch shell lifts in 6.3 s", twelve.liftTenths, 63);
contains("front page quotes 6.3 seconds", CLAIMS[1].body, "6.3 seconds");
contains("the Long Field note quotes 6.3 seconds", longField.show.notes[0], "6.3 seconds");

// "the mortar is audible more than two seconds before anybody sees a light"
ok(
  "the fell's first cue really is more than two seconds early",
  longField.firstFire <= -20,
  `${B.clock(longField.firstFire)}`,
);
eq("and the Long Field note quotes it exactly", B.clock(longField.firstFire), "−0:02.3");
contains("the note says −0:02.3", longField.show.segments[0].note, "−0:02.3");
contains("the note says 2.3 seconds", longField.show.notes[1], "2.3 seconds");

// The salvo spreads, each quoted in a different show's notes.
const spreads = {
  "the-long-field": 42,
  "harbour-nine": 27,
  "six-bells": 10,
  ravensmoor: 5,
};
for (const [slug, tenths] of Object.entries(spreads)) {
  const d = enriched.find((x) => x.show.slug === slug);
  eq(`${slug}: deepest salvo spread`, d.salvos[0].spreadTenths, tenths);
}
contains(
  "the fell's salvo note quotes 4.2 seconds",
  longField.show.segments.find((s) => s.id === "salvo-low").note,
  "4.2 seconds apart",
);
contains(
  "the harbour's salvo note quotes 2.7 seconds",
  harbour.show.segments.find((s) => s.id === "salvo-low").note,
  "2.7 seconds apart",
);
contains(
  "Six Bells quotes its own 1.0 against the fell's 4.2",
  sixBells.show.notes[2],
  "1.0 seconds apart. On Bracken Fell the same three tiers are fired 4.2 seconds apart",
);
contains(
  "Ravensmoor quotes half a second",
  ravensmoor.show.segments.find((s) => s.id === "salvo-low").note,
  "Half a second of spread",
);

// "Nine silver peonies sit in the middle of it, at 5:20"
const silverCut = blueHour.show.segments.find((s) => s.id === "silver-cut");
eq("Blue Hour's silver segment is nine shells", silverCut.count, 9);
eq("and it lands at 5:20.0", B.clock(silverCut.atTenths), "5:20.0");
contains("Blue Hour's note says nine at 5:20", blueHour.show.notes[1], "at 5:20");
contains("and calls them silver peonies", blueHour.show.notes[1], "Nine silver peonies");

// "everything the crowd in the ground saw was four-tenths of a second early"
eq("Cold Open's sound delay is four tenths", B.soundDelayTenths(coldOpen.show.crowdM), 4);
contains("and its standfirst says so", coldOpen.show.standfirst, "four-tenths of a second early");
eq("Cold Open is cued to the sound", coldOpen.show.cueTo, "sound");

// Ravensmoor's 88 metres and its consequences.
eq("Ravensmoor's crowd is at 88 metres", ravensmoor.show.crowdM, 88);
eq("which permits a four-inch shell", B.largestShellFor(88), 4);
eq("and caps the break at 120 metres", 4 * 30, 120);
contains("its standfirst says 88 metres", ravensmoor.show.standfirst, "eighty-eight metres away");
contains("and says four inches", ravensmoor.show.standfirst, "caps every shell at four inches");
contains("and says 120 metres", ravensmoor.show.standfirst, "every break at a hundred and twenty metres");

// Cold Open's six-inch ceiling.
eq("Carrow Bowl permits six inches", B.largestShellFor(130), 6);
eq("a six-inch shell needs 126 metres", B.safetyRadiusM(6), 126);
contains("and Cold Open's note does the sum", coldOpen.show.notes[2], "a hundred and twenty-six metres of required radius");

// The constants the pages quote by name.
eq("21 metres per inch", B.SAFETY_METRES_PER_INCH, 21);
eq("343 metres a second", B.SPEED_OF_SOUND, 343);

// "roughly nine times the cost per unit of light"
const bigPair = PRICE_PAIRS[2];
const priceRatio =
  B.shellById(SHELLS, bigPair.blue).costUsd / B.shellById(SHELLS, bigPair.gold).costUsd;
const lightRatio = emitter("blue").intensity / emitter("gold").intensity;
near("blue is ×2.0 the price at twelve inches", priceRatio, 2, 0.01);
near("and ×0.22 the light", lightRatio, 0.22, 0.005);
near("so about nine times per unit of light", priceRatio / lightRatio, 9, 0.5);

// "sodium is nearly twelve times copper"
near(
  "sodium against copper",
  emitter("amber").intensity / emitter("blue").intensity,
  11.8,
  0.3,
);

// "Nearly half of every display ... is charcoal"
const goldShare = fleetBudget.find((r) => r.id === "gold").share;
ok("gold is nearly half the fleet's light", goldShare > 0.44 && goldShare < 0.5, goldShare.toFixed(3));

// The aggregate's dearest emitter is named in the copy by lookup, not by
// hand — but the page's explanation says it is the ring shell, so the
// dearest had better be green.
const goldRow = fleetBudget.find((r) => r.id === "gold");
const goldRate = goldRow.costUsd / goldRow.starTenths;
const dearest = [...fleetBudget].sort(
  (a, b) => b.costUsd / b.starTenths - a.costUsd / a.starTenths,
)[0];
eq("the dearest light in the aggregate is green", dearest.id, "green");
ok(
  "and it is dearest because of the ring shell",
  B.shellById(SHELLS, "r6-green").costUsd / (60 * 18) > goldRate * 2,
);

// Company copy that quotes the model.
contains("the site standfirst promises both moments", SITE.standfirst, "which are not the same moment");
ok("the footer says it is fictional", /invented|fictional/i.test(FOOTER_NOTE));
ok("about copy is three paragraphs", ABOUT.paragraphs.length === 3);
ok("commission offers four budgets", COMMISSION.budgetOptions.length === 4);
eq("three claims on the front page", CLAIMS.length, 3);

// Spelled-out counts in copy. This one was WRONG when the checker was
// first written — three places said "eighteen shells" against a
// catalogue of twenty, and nothing failed, because nothing was checking
// it. A number written as a word is still a number.
const WORDS = {
  20: "Twenty",
  6: "Six",
  5: "Five",
  8: "Eight",
};
const shellsPage = readFileSync(path.join(src, "app/shells/page.tsx"), "utf8");
contains(
  "the shells page states the real size of the catalogue",
  shellsPage,
  `${WORDS[SHELLS.length]} shells`,
);
contains(
  "and so does the module's own comment",
  readFileSync(path.join(src, "content/shells.ts"), "utf8"),
  `${WORDS[SHELLS.length]} shells`,
);
contains(
  "the front page says six displays",
  readFileSync(path.join(src, "app/page.tsx"), "utf8"),
  `${WORDS[SHOWS.length]} displays, published in full`,
);
contains(
  "the sites page says five",
  readFileSync(path.join(src, "content/sites.ts"), "utf8"),
  `The ${WORDS[SITES.length].toLowerCase()} places this company is licensed to fire from`,
);

/* ── 7. No Date, anywhere ──────────────────────────────────────────── */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const sources = walk(src);
const dateUsers = sources.filter((f) => /\bnew Date\b|\bDate\.now\b/.test(readFileSync(f, "utf8")));
ok(
  "no Date anywhere in src",
  dateUsers.length === 0,
  dateUsers.map((f) => path.relative(root, f)).join(", "),
);

// A show is a script, so nothing here may depend on where it is read.
if (!process.env.NIGHTWORK_TZ_CHILD) {
  for (const tz of ["UTC", "Asia/Tokyo", "America/Los_Angeles"]) {
    try {
      execFileSync(process.execPath, [fileURLToPath(import.meta.url)], {
        env: { ...process.env, TZ: tz, NIGHTWORK_TZ_CHILD: "1" },
        stdio: "pipe",
      });
      passed += 1;
    } catch (err) {
      const detail = [err.stdout, err.stderr].filter(Boolean).join("\n").trim();
      failures.push(`fails under TZ=${tz}: ${(detail || String(err)).slice(-400)}`);
    }
  }
}

/* ── 8. Imagery ────────────────────────────────────────────────────── */

const photosFile = path.join(src, "content/photos.ts");
ok("photos.ts exists", existsSync(photosFile));
if (existsSync(photosFile)) {
  const text = readFileSync(photosFile, "utf8");
  const ids = [...text.matchAll(/id:\s*"([a-z-]+)"/g)].map((m) => m[1]);
  ok("at least five photographs", ids.length >= 5, `${ids.length}`);
  contains("the direction is written down", text, "THE DIRECTION:");
  for (const id of ids) {
    const file = path.join(src, "images", `${id}.jpg`);
    ok(`${id}.jpg is committed`, existsSync(file));
    if (existsSync(file)) {
      ok(`${id}.jpg is under 260KB`, statSync(file).size < 260_000, `${Math.round(statSync(file).size / 1024)}KB`);
    }
  }
  // Every photograph states what it is FOR. §6: an image you cannot
  // justify is decoration.
  const jobs = [...text.matchAll(/job:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
  eq("every photograph states its job", jobs.length, ids.length);

  // And every one is actually rendered somewhere.
  const pageText = sources.map((f) => readFileSync(f, "utf8")).join("\n");
  for (const id of ids) {
    ok(
      `${id} is used on a page`,
      new RegExp(`photo\\("${id}"\\)|"${id}"`).test(pageText),
    );
  }
}

// Exactly one component renders an <img> (via next/image).
const renderers = sources.filter((f) => /from "next\/image"/.test(readFileSync(f, "utf8").replace(/import\s+type\s[^;]*?;/g, "")));
eq(
  "exactly one image renderer",
  renderers.length,
  1,
);
ok(
  "and it is plate.tsx",
  renderers.length === 1 && renderers[0].endsWith("plate.tsx"),
  renderers.map((f) => path.basename(f)).join(", "),
);

/* ── Report ────────────────────────────────────────────────────────── */

if (process.env.NIGHTWORK_TZ_CHILD) {
  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  process.exit(0);
}

console.log(`\n  nightwork — the model, the states and the prose\n`);
console.log(`  ${SHOWS.length} displays · ${allCues.length} shells · ${SHELLS.length} in the catalogue`);
console.log(`  ${SITES.length} sites · ${EMITTERS.length} emitters\n`);

if (failures.length === 0) {
  console.log(`  ✓ ${passed} checks passed\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${passed + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
