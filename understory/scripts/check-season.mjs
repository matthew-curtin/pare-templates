/**
 * The model, the content, the §7b states and every claim the prose
 * makes — asserted against the REAL modules the site ships.
 *
 *   node scripts/check-season.mjs
 *   TZ=Pacific/Auckland node scripts/check-season.mjs
 *
 * `src/lib/season.ts`, `calendar.ts`, `ground.ts` and `format.ts` have
 * zero runtime imports, so node's type stripping lets this import them
 * directly rather than against a copy that drifts. CONVENTIONS §8.
 *
 * The section that matters most is THE PROSE. A number in a sentence is
 * the one kind of content nothing else in this repo can check: it
 * typechecks, it builds, it renders, and it is wrong. Three sentences on
 * this site were wrong when they were first written and the model caught
 * all three — a note calling the giant lily's week "the thin week", a
 * front page claiming the worst week was in November, and a visitors
 * comparison that stopped being true when one witch hazel was added to
 * the arboretum.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = (p) => path.join(root, "src", p);

const { collection } = await import(src("content/collection.ts"));
const { areas } = await import(src("content/areas.ts"));
const { photos } = await import(src("content/photos.ts"));
const { site, visitors, visiting, yearNotes } = await import(src("content/site.ts"));
const S = await import(src("lib/season.ts"));
const C = await import(src("lib/calendar.ts"));
const G = await import(src("lib/ground.ts"));

let pass = 0;
const fails = [];
function ok(label, cond, detail = "") {
  if (cond) pass += 1;
  else fails.push(`${label}${detail ? ` — ${detail}` : ""}`);
}
function eq(label, actual, expected) {
  ok(label, actual === expected, `expected ${expected}, got ${actual}`);
}

const ix = S.index(collection);
const curve = S.yearCurve(ix);
const peak = S.peakWeek(ix);
const trough = S.troughWeek(ix);
const quiet = S.quietWeeks(ix);

// ─── 1. Integrity ──────────────────────────────────────────────────
{
  const slugs = new Set();
  const ids = new Set();
  const areaSlugs = new Set(areas.map((a) => a.slug));
  for (const a of collection) {
    ok(`unique slug ${a.slug}`, !slugs.has(a.slug));
    slugs.add(a.slug);
    ok(`unique id ${a.id}`, !ids.has(a.id));
    ids.add(a.id);
    ok(`${a.slug} area exists`, areaSlugs.has(a.area), a.area);
    ok(`${a.slug} weeks in range`,
      [a.from, a.peak, a.to].every((w) => Number.isInteger(w) && w >= 1 && w <= 52));
    ok(`${a.slug} strength 1–10`, a.strength >= 1 && a.strength <= 10);
    ok(`${a.slug} colour parses`, G.parseOklch(a.colour) !== null, a.colour);
    ok(`${a.slug} note is written`, a.note.length > 60);
    // The peak has to be INSIDE the window, and the wrap makes that a
    // real check rather than a formality: `from 51, peak 3, to 8` is
    // correct and `from 3, peak 51, to 8` is not, and neither of them
    // looks wrong in a list.
    const span = (a.to - a.from + 52) % 52;
    const peakPos = (a.peak - a.from + 52) % 52;
    ok(`${a.slug} peak inside its window`, peakPos <= span,
      `from ${a.from} peak ${a.peak} to ${a.to}`);
  }
  eq("visitors has 52 weeks", visitors.length, 52);
  ok("every visitor count is positive", visitors.every((v) => v > 0));
  ok("six areas", areas.length === 6, String(areas.length));
  for (const a of areas) {
    ok(`${a.slug} has plants`, (ix.byArea.get(a.slug) ?? []).length > 0);
    ok(`${a.slug} states its out-of-season`, a.outOfSeason.length > 40);
  }
}

// ─── 2. The arithmetic ─────────────────────────────────────────────
{
  // A window that wraps the new year is the thing most likely to be
  // silently wrong, so it gets its own case rather than being covered
  // incidentally by a plant that happens to have one.
  const hazel = ix.bySlug.get("hamamelis-pallida");
  ok("a wrapping window is 10 weeks long, not 42", S.windowLength(hazel) === 10,
    String(S.windowLength(hazel)));
  ok("wrapping window: week 52 is inside it", S.scoreAt(hazel, 52) > 0);
  ok("wrapping window: week 30 is outside it", S.scoreAt(hazel, 30) === 0);

  // Score curve shape.
  //
  // The "scores zero outside its window" half skips anything whose
  // window is the entire year, because such a plant HAS no outside and
  // the first version of this check failed on the hedge — the check
  // being wrong, not the data. A skip that can quietly grow is worse
  // than no skip, so the exemption is itself asserted below: exactly one
  // accession may be all-year, and it must be the hedge.
  const allYear = collection.filter((a) => S.windowLength(a) === 52);
  eq("exactly one accession is in its window all year", allYear.length, 1);
  eq("and it is the hedge", allYear[0]?.slug, "griselinia-littoralis");

  for (const a of collection) {
    const atPeak = S.scoreAt(a, a.peak);
    eq(`${a.slug} scores full strength at its peak`, atPeak, a.strength);
    if (S.windowLength(a) === 52) continue;
    const outside = S.normalise(a.to + Math.max(1, Math.floor((52 - S.windowLength(a)) / 2)));
    ok(`${a.slug} scores zero outside its window`, S.scoreAt(a, outside) === 0,
      `week ${outside} scores ${S.scoreAt(a, outside)}`);
  }

  // The bar means what the About page says it means.
  ok("nothing below the bar appears in whatsOn",
    Array.from({ length: 52 }, (_, i) => S.whatsOn(ix, i + 1))
      .every((list) => list.every((s) => s.score >= S.WORTH_SEEING)));
  ok("whatsOn is sorted by score, descending",
    Array.from({ length: 52 }, (_, i) => S.whatsOn(ix, i + 1))
      .every((l) => l.every((s, j) => j === 0 || l[j - 1].score >= s.score)));

  // longestRun has to treat the year as a circle. Two separate runs at
  // opposite ends of the array are ONE run.
  const wrap = S.longestRun([50, 51, 52, 1, 2, 20]);
  eq("longestRun wraps the new year", wrap.length, 5);
  eq("longestRun starts where the run starts", wrap.from, 50);
  eq("longestRun of a single week", S.longestRun([7]).length, 1);
  ok("longestRun of nothing is null", S.longestRun([]) === null);

  // tileSpan bands, which are the layout.
  eq("a 9.0 is a three-span tile", S.tileSpan(9), 3);
  eq("a 5.0 is a two-span tile", S.tileSpan(5), 2);
  eq("a 4.9 is a one-span tile", S.tileSpan(4.9), 1);

  // bestWeekFor must never claim something is out when it is not.
  const plan = S.bestWeekFor(ix, ["magnolia-campbellii", "cardiocrinum-giganteum"]);
  ok("the planner reports what you would miss", plan.missing.length === 1);
  ok("the planner's winners really are above the bar",
    plan.out.every((a) => S.isOut(a, plan.week)));
  ok("the planner ignores a slug that does not exist",
    S.bestWeekFor(ix, ["magnolia-campbellii", "not-a-plant"]).out.length >= 1);
  ok("the planner returns null for nothing", S.bestWeekFor(ix, []) === null);
}

// ─── 3. Every §7b state is reachable ───────────────────────────────
{
  eq("one week is the clear best", peak, 11);
  eq("one week is the clear worst", trough, 38);
  ok("the best week is clear of the second best",
    curve[peak - 1] > 1.25 * Math.max(...curve.filter((_, i) => Math.abs(i + 1 - peak) > 4)),
    `${curve[peak - 1].toFixed(1)} vs the best outside the peak fortnight`);

  ok("thin weeks exist but are not most of the year",
    quiet.length >= 8 && quiet.length <= 20, `${quiet.length} of 52`);
  ok("a run of thin weeks is genuinely consecutive",
    S.longestRun(quiet).length >= 4, String(S.longestRun(quiet)?.length));

  const narrow = collection
    .map((a) => ({ a, n: S.seasonOf(ix, a.slug).length }))
    .filter((x) => x.n > 0)
    .sort((x, y) => x.n - y.n)[0];
  ok("something is above the bar for two weeks or fewer", narrow.n <= 2,
    `${narrow.a.slug} at ${narrow.n}`);
  const wide = collection
    .map((a) => ({ a, n: S.seasonOf(ix, a.slug).length }))
    .sort((x, y) => y.n - x.n)[0];
  ok("something is above the bar for fifteen weeks or more", wide.n >= 15,
    `${wide.a.slug} at ${wide.n}`);

  const never = collection.filter((a) => S.seasonOf(ix, a.slug).length === 0);
  ok("exactly one thing never clears the bar", never.length === 1,
    never.map((a) => a.slug).join(", "));
  eq("and it is the hedge", never[0]?.slug, "griselinia-littoralis");

  // The empty-filter state the /plants page depends on.
  const scentedOnTheShore = collection.filter(
    (a) => a.area === "shorewalk" && a.kind === "scent",
  );
  eq("an area/kind filter combination is genuinely empty", scentedOnTheShore.length, 0);

  // An area with nothing for more than half the year, and one that
  // carries deep winter on its own.
  const shoreGaps = S.gapsFor(ix, "shorewalk");
  ok("one area is empty for more than half the year", shoreGaps.length > 26,
    `shorewalk: ${shoreGaps.length}`);
  const week48 = areas.filter((a) => !S.gapsFor(ix, a.slug).includes(48));
  eq("in week 48 exactly one area has anything", week48.length, 1);
  eq("and it is the arboretum", week48[0]?.slug, "arboretum");

  // Tile sizes: the wall needs all three bands to occur, and the big
  // one has to be rare or it stops being a ranking.
  const spans = new Set();
  let bigTiles = 0;
  for (let w = 1; w <= 52; w += 1) {
    for (const s of S.whatsOn(ix, w)) {
      const span = S.tileSpan(s.score);
      spans.add(span);
      if (span === 3) bigTiles += 1;
    }
  }
  eq("all three tile sizes occur across the year", spans.size, 3);
  ok("three-span tiles are rare", bigTiles < 60, String(bigTiles));

  // A week with a photograph in it, and the trough having at least one,
  // because the worst week of the year is the one most likely to look
  // like a broken page.
  const withPhoto = (w) =>
    S.whatsOn(ix, w).filter((s) => s.accession.photo !== null).length;
  ok("the peak week carries photographs", withPhoto(peak) >= 2, String(withPhoto(peak)));
  ok("the trough week carries at least one", withPhoto(trough) >= 1, String(withPhoto(trough)));
}

// ─── 4. The prose ──────────────────────────────────────────────────
{
  // Every year note names a week; the note must not contradict it.
  for (const n of yearNotes) {
    ok(`note for week ${n.week} names a real week`, n.week >= 1 && n.week <= 52);
  }
  const byWeek = new Map(yearNotes.map((n) => [n.week, n.text]));

  ok("the week-11 note calls it the best week of the year",
    /best week of the year/i.test(byWeek.get(11) ?? "") && peak === 11);

  const troughNote = byWeek.get(38) ?? "";
  ok("the week-38 note claims the worst week and is right",
    /worst week of the year/i.test(troughNote) && trough === 38);
  ok("the week-38 note says it is NOT in winter, and it is not",
    /not in the winter/i.test(troughNote) && C.monthOfWeek(trough) === 9);
  const troughCount = S.whatsOn(ix, 38).length;
  ok("the week-38 note says three things and there are three",
    /\bthree things\b/i.test(troughNote), `actually ${troughCount}`);
  eq("…and that count is really three", troughCount, 3);
  ok("one of them really is the hedge fuchsia",
    S.whatsOn(ix, 38).some((s) => s.accession.slug === "fuchsia-magellanica"));

  const w48 = byWeek.get(48) ?? "";
  ok("the week-48 note says only the Arboretum, and only the Arboretum has anything",
    /Arboretum/.test(w48) && areas.filter((a) => !S.gapsFor(ix, a.slug).includes(48)).length === 1);

  const w3 = byWeek.get(3) ?? "";
  ok("the week-3 note claims three scents and there are three",
    /Three smells/i.test(w3) &&
      S.whatsOn(ix, 3).filter((s) => s.accession.kind === "scent").length === 3,
    `${S.whatsOn(ix, 3).filter((s) => s.accession.kind === "scent").length} scents`);

  const w43 = byWeek.get(43) ?? "";
  const autumnShare = curve[42] / curve[peak - 1];
  ok("the week-43 note says three-quarters of March, and it is",
    /Three-quarters as good as March/i.test(w43) &&
      autumnShare > 0.7 && autumnShare < 0.8,
    `${(autumnShare * 100).toFixed(0)}%`);

  const w18 = byWeek.get(18) ?? "";
  ok("the week-18 note claims bluebells under the Loderi at once, and they overlap",
    /Bluebells under the Loderi/i.test(w18) &&
      S.overlapWeeks(
        ix.bySlug.get("hyacinthoides-non-scripta"),
        ix.bySlug.get("rhododendron-loderi-king-george"),
      ).includes(18));

  const w23 = byWeek.get(23) ?? "";
  ok("the week-23 note claims poppies and the fire bush together, and they overlap",
    /fire bush/i.test(w23) &&
      S.overlapWeeks(
        ix.bySlug.get("meconopsis-slieve-donard"),
        ix.bySlug.get("embothrium-coccineum"),
      ).includes(23));

  // The pinned week's whole reason for existing.
  const busiest = visitors.indexOf(Math.max(...visitors)) + 1;
  eq("the pinned week is the busiest week", site.thisWeek, busiest);
  ok("the pinned week is nowhere near the best", site.thisWeek !== peak);
  const share = curve[busiest - 1] / curve[peak - 1];
  ok("the busiest week is around half the best week", share > 0.4 && share < 0.65,
    `${(share * 100).toFixed(0)}%`);

  // The claim the /visit page leads with, and the one that changed when
  // a single accession was added — which is exactly why it is asserted
  // rather than trusted.
  const ranked = curve.map((v, i) => ({ v, week: i + 1 })).sort((a, b) => b.v - a.v);
  const bestTen = ranked.slice(0, 10).reduce((s, r) => s + visitors[r.week - 1], 0);
  const worstTen = ranked.slice(-10).reduce((s, r) => s + visitors[r.week - 1], 0);
  ok("MORE visitors come in the ten worst weeks than the ten best",
    worstTen > bestTen, `best ${bestTen}, worst ${worstTen}`);

  // The two things that cannot be seen together, which the plant pages
  // print by name.
  eq("the fire bush and the giant lily never overlap",
    S.overlapWeeks(
      ix.bySlug.get("embothrium-coccineum"),
      ix.bySlug.get("cardiocrinum-giganteum"),
    ).length, 0);
  const gap =
    S.normalise(ix.bySlug.get("cardiocrinum-giganteum").from) -
    S.normalise(ix.bySlug.get("embothrium-coccineum").to);
  ok("and they miss each other by a few weeks", gap >= 2 && gap <= 6, String(gap));

  // The area pages' out-of-season copy against the arithmetic.
  const shore = areas.find((a) => a.slug === "shorewalk");
  ok("the Shore Walk's copy admits over half the year, and the model agrees",
    /over half the year/i.test(shore.outOfSeason) &&
      S.gapsFor(ix, "shorewalk").length > 26);

  ok("every visiting row is a real sentence", visiting.every((v) => v.detail.length > 20));
}

// ─── 5. Time, with no Date in sight ────────────────────────────────
{
  const walk = (dir) => {
    const out = [];
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...walk(full));
      else if (/\.tsx?$/.test(e.name)) out.push(full);
    }
    return out;
  };
  const files = walk(src("."));
  const offenders = files.filter((f) => {
    const text = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    return /\bnew Date\b|\bDate\.now\b|toLocaleDateString|Intl\.DateTimeFormat/.test(text);
  });
  ok("no Date anywhere in src", offenders.length === 0,
    offenders.map((f) => path.relative(root, f)).join(", "));

  eq("week 1 starts on 4 January", C.weekLabel(1), "4–10 January");
  eq("the peak week reads correctly", C.weekLabel(11), "15–21 March");
  eq("a week that straddles two months says so", C.weekLabel(13), "29 March – 4 April");
  eq("the last week is short", C.weekLabel(52), "27–31 December");
  eq("week 53 is week 1", C.normaliseWeek(53), 1);
  eq("week 0 is week 52", C.normaliseWeek(0), 52);
  eq("week -1 is week 51", C.normaliseWeek(-1), 51);
  eq("weeks 51 and 2 are three apart", C.weeksBetween(51, 2), 3);
  eq("weeks 11 and 33 are 22 apart", C.weeksBetween(11, 33), 22);

  // Every week must land in a month, and the twelve month-bands must
  // account for all 52 — hardcoding four weeks per month puts every
  // label after March one column out.
  const banded = Array.from({ length: 12 }, (_, m) => C.weeksInMonth(m + 1).length);
  eq("the month bands cover all 52 weeks", banded.reduce((a, b) => a + b, 0), 52);
  ok("no month band is empty", banded.every((n) => n > 0));

  eq("2027 is not a leap year", C.YEAR % 4 === 0, false);
}

// ─── 6. Imagery ────────────────────────────────────────────────────
{
  const dir = src("content/photos");
  const files = readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));
  const credited = new Set(photos.map((p) => p.file));
  const keys = new Set(photos.map((p) => p.key));

  ok("every committed photograph is credited",
    files.every((f) => credited.has(f)),
    files.filter((f) => !credited.has(f)).join(", "));
  ok("every credit points at a committed file",
    photos.every((p) => files.includes(p.file)),
    photos.filter((p) => !files.includes(p.file)).map((p) => p.file).join(", "));
  eq("no photograph is credited twice", credited.size, photos.length);

  for (const p of photos) {
    ok(`${p.key} has real alt text`, p.alt.length > 30 && p.alt.endsWith("."));
    ok(`${p.key} states its narrative job`, p.job.length > 60);
  }

  // Every reference from the content resolves.
  for (const a of collection) {
    if (a.photo) ok(`${a.slug} points at a real photograph`, keys.has(a.photo), a.photo);
  }
  for (const a of areas) {
    if (a.photo) ok(`${a.slug} points at a real photograph`, keys.has(a.photo), a.photo);
  }

  // THE ONE THAT MATTERS: a photograph captioned into a week its own
  // plant is not out in. Nothing else in the toolchain can see this.
  for (const p of photos) {
    const owner = collection.find((a) => a.photo === p.key);
    if (!owner) continue;
    ok(`${p.key} claims a week its plant is actually out in`,
      S.isOut(owner, p.week),
      `week ${p.week}, ${owner.slug} scores ${S.scoreAt(owner, p.week).toFixed(1)}`);
  }

  const bytes = files.reduce((n, f) => n + statSync(path.join(dir, f)).size, 0);
  ok("the imagery is inside the fleet budget", bytes <= 1_400_000,
    `${bytes} bytes`);
  ok("there are more photographs here than in any earlier template",
    files.length >= 16, String(files.length));
}

// ─── Report ────────────────────────────────────────────────────────
console.log(`\n  Strathdunan — ${pass + fails.length} checks\n`);
if (fails.length === 0) {
  console.log(`  ✓ all ${pass} pass`);
  console.log(`    peak week ${peak} (${C.weekLabel(peak)}) at ${curve[peak - 1].toFixed(1)}`);
  console.log(`    trough week ${trough} (${C.weekLabel(trough)}) at ${curve[trough - 1].toFixed(1)}`);
  console.log(`    ${quiet.length} thin weeks · ${collection.length} accessions · ${photos.length} photographs\n`);
  process.exit(0);
}
console.log(`  ✗ ${fails.length} of ${pass + fails.length} failed:\n`);
for (const f of fails) console.log(`   • ${f}`);
console.log("");
process.exit(1);
