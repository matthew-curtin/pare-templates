/**
 * The model, measured.
 *
 * This loads the REAL modules — `availability.ts` has no runtime imports
 * and node strips its types, so what is checked here is the arithmetic the
 * pages actually run rather than a transcription of it.
 *
 * Four things it is for, in descending order of how likely they are to
 * save somebody:
 *
 *   1. Every figure quoted in the PROSE is asserted against the model.
 *      Nudge one impact fraction and three sentences stop being true
 *      silently; this names the sentence.
 *   2. The §7b tuned states — one service over budget, one perfect, one
 *      partial window, one open incident — are asserted to be exactly one
 *      each. A state that is never reached is dead design; a state that is
 *      always reached has stopped being a warning.
 *   3. The arithmetic itself, worked independently of the module.
 *   4. That no `Date` has crept into `src`, verified by running the whole
 *      file again under three timezones.
 *
 *   node scripts/check-availability.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

import * as A from "../src/lib/availability.ts";
import { SERVICES, serviceById } from "../src/content/services.ts";
import { INCIDENTS } from "../src/content/incidents.ts";
import { REGIONS } from "../src/content/regions.ts";
import { CLAIMS, SITE, FOOTER } from "../src/content/site.ts";
import { DEFINITIONS, CLAIM_STEPS, METHOD, EXCLUSIONS } from "../src/content/sla.ts";
import { REDUNDANCY, HARDWARE, INFRA_INTRO } from "../src/content/infrastructure.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

let failures = 0;
let checks = 0;

function ok(label, reading = "") {
  checks += 1;
  console.log(`  ✓ ${label}${reading ? `  ${reading}` : ""}`);
}
function fail(label, detail) {
  checks += 1;
  failures += 1;
  console.log(`  ✗ ${label}\n      ${detail}`);
}
function is(cond, label, reading = "") {
  if (cond) ok(label, reading);
  else fail(label, reading || "failed");
}
function section(t) {
  console.log(`\n${t}`);
}

/**
 * Prose hard-wraps in the source, so a phrase that straddles a line break
 * fails a naive match while the page renders it perfectly — which is this
 * surface's whole failure mode. Normalise first, always.
 */
const squash = (s) => String(s).replace(/\s+/g, " ").trim();
const allClaims = squash(Object.values(CLAIMS).flat().join(" "));

function claims(phrase, label) {
  is(allClaims.includes(squash(phrase)), label || `prose says “${phrase}”`, `“${phrase}”`);
}

const NOW = A.NOW;
const QUARTER = A.quarterOf(NOW);
const STRIP = A.stripPeriod(NOW);

console.log("\nTALLY — model check");
console.log(`  pinned clock: ${A.fmtStamp(NOW)} (${A.weekdayOf(A.dayOf(NOW))})`);

// ---------------------------------------------------------------------
section("Integrity");
// ---------------------------------------------------------------------

{
  const ids = INCIDENTS.map((i) => i.id);
  const slugs = INCIDENTS.map((i) => i.slug);
  is(new Set(ids).size === ids.length, "incident ids are unique", `${ids.length} incidents`);
  is(new Set(slugs).size === slugs.length, "incident slugs are unique");

  const serviceIds = new Set(SERVICES.map((s) => s.id));
  const regionIds = new Set(REGIONS.map((r) => r.id));
  const badService = INCIDENTS.flatMap((i) =>
    i.impacts.filter((m) => !serviceIds.has(m.serviceId)).map((m) => `${i.id}→${m.serviceId}`),
  );
  is(badService.length === 0, "every impact names a real service", badService.join(", "));

  const badRegion = INCIDENTS.flatMap((i) =>
    i.regionIds.filter((r) => !regionIds.has(r)).map((r) => `${i.id}→${r}`),
  );
  is(badRegion.length === 0, "every incident names real regions", badRegion.join(", "));

  const svcRegion = SERVICES.flatMap((s) =>
    s.regionIds.filter((r) => !regionIds.has(r)).map((r) => `${s.id}→${r}`),
  );
  is(svcRegion.length === 0, "every service names real regions", svcRegion.join(", "));
}

{
  const bad = [];
  for (const inc of INCIDENTS) {
    if (inc.endMin !== null && inc.endMin <= inc.startMin) bad.push(`${inc.id}: ends before it starts`);
    if (inc.detectedMin < inc.startMin) bad.push(`${inc.id}: detected before it started`);
    if (inc.endMin !== null && inc.detectedMin > inc.endMin) bad.push(`${inc.id}: detected after it ended`);
    for (const m of inc.impacts) {
      if (!(m.fraction > 0 && m.fraction <= 1)) bad.push(`${inc.id}: impact ${m.fraction}`);
    }
  }
  is(bad.length === 0, "every incident's clock is coherent", bad.join("; "));
}

{
  // A `scheduled` update legitimately predates the window it announces;
  // everything else has to sit inside the incident.
  const bad = [];
  for (const inc of INCIDENTS) {
    const times = inc.updates.map((u) => u.atMin);
    for (let i = 1; i < times.length; i += 1) {
      if (times[i] < times[i - 1]) bad.push(`${inc.id}: updates out of order`);
    }
    for (const u of inc.updates) {
      if (u.status === "scheduled") continue;
      if (u.atMin < inc.startMin) bad.push(`${inc.id}: update before the incident`);
      if (inc.endMin !== null && u.atMin > inc.endMin + 60) {
        bad.push(`${inc.id}: update long after it closed`);
      }
    }
    if (inc.endMin !== null && inc.severity !== "maintenance") {
      const last = inc.updates[inc.updates.length - 1];
      if (!last || last.status !== "resolved") bad.push(`${inc.id}: closed without a resolved update`);
    }
  }
  is(bad.length === 0, "update timelines are ordered and bounded", bad.join("; "));
}

{
  const maint = INCIDENTS.filter((i) => i.severity === "maintenance");
  const spend = maint.map((i) =>
    i.impacts.reduce(
      (a, m) => a + A.budgetSpent(i, m.serviceId, i.startMin, i.endMin ?? NOW, NOW),
      0,
    ),
  );
  is(
    maint.length > 0 && spend.every((s) => s === 0),
    "announced maintenance spends no error budget",
    `${maint.length} windows, ${spend.reduce((a, b) => a + b, 0)} minutes charged`,
  );
  is(
    maint.every((i) => i.updates.some((u) => u.status === "scheduled")),
    "and every maintenance window was announced in advance",
  );
}

// ---------------------------------------------------------------------
section("Arithmetic, worked independently");
// ---------------------------------------------------------------------

{
  // Recompute a fully-contained incident's spend by hand.
  const inc = INCIDENTS.find((i) => i.id === "postgres-replica-lag");
  const impact = inc.impacts[0];
  const byHand = (inc.endMin - inc.startMin) * impact.fraction;
  const byModel = A.budgetSpent(inc, "postgres", inc.startMin, inc.endMin, NOW);
  is(
    Math.abs(byHand - byModel) < 1e-9,
    "budget spent = duration × impact fraction",
    `${(inc.endMin - inc.startMin)} min × ${impact.fraction} = ${byHand.toFixed(2)}`,
  );
}

{
  const bad = [];
  for (const s of SERVICES) {
    const w = A.windowFor(s, INCIDENTS, QUARTER, NOW);
    const expectAllowance = w.totalMin * (1 - s.target);
    if (Math.abs(w.allowanceMin - expectAllowance) > 1e-9) bad.push(`${s.id}: allowance`);

    const expectAvail = (w.totalMin - w.lostMin) / w.totalMin;
    if (Math.abs(w.availability - expectAvail) > 1e-12) bad.push(`${s.id}: availability`);

    const sumByHand = INCIDENTS.reduce(
      (a, inc) => a + A.budgetSpent(inc, s.id, w.fromMin, w.toMin, NOW),
      0,
    );
    if (Math.abs(sumByHand - w.lostMin) > 1e-9) bad.push(`${s.id}: lost minutes`);

    const burn = A.burnRate(s, INCIDENTS, NOW);
    if (w.allowanceMin > 0 && Math.abs(burn - w.lostMin / w.allowanceMin) > 1e-12) {
      bad.push(`${s.id}: burn rate`);
    }
  }
  is(bad.length === 0, "windows, allowances, availability and burn all reconcile", bad.join("; "));
}

{
  // Windows clamp to a service's own launch rather than pretending it
  // existed. This is the difference between an honest partial figure and
  // fifty days of invented green.
  const queues = serviceById("queues");
  const w = A.windowFor(queues, INCIDENTS, STRIP, NOW);
  is(w.fromMin === queues.liveFrom, "a young service's window starts at its launch");
  is(w.partial === true, "and is flagged partial", `${Math.round(w.totalMin / 1440)} days of 90`);

  const cells = A.dayCells(queues, INCIDENTS, NOW);
  const none = cells.filter((c) => c.state === "none").length;
  is(none > 0, "its strip draws the days before it existed as absent", `${none} days`);
  is(
    cells.length === A.STRIP_DAYS,
    "and still draws exactly ninety cells",
    `${cells.length}`,
  );
}

{
  const s = serviceById("postgres");
  const bands = A.bandThresholds(s);
  const expect = A.CREDIT_BANDS.map((b) => s.target - b.belowTargetPp / 100);
  is(
    bands.every((b, i) => Math.abs(b.threshold - expect[i]) < 1e-12),
    "credit bands are derived from each service's own target",
    bands.map((b) => `${b.percent}% below ${A.fmtPct(b.threshold, 2)}`).join(", "),
  );

  // The hole this closes: a 99.99% service under an absolute 99.95% band.
  const net = serviceById("network");
  const netBands = A.bandThresholds(net);
  is(
    netBands[0].threshold === net.target,
    "so a 99.99% service owes a credit the moment it misses 99.99%",
    A.fmtPct(netBands[0].threshold, 2),
  );
}

// ---------------------------------------------------------------------
section("§7b — every state is reached, and only as often as it should be");
// ---------------------------------------------------------------------

const rows = SERVICES.map((s) => ({
  s,
  strip: A.windowFor(s, INCIDENTS, STRIP, NOW),
  quarter: A.windowFor(s, INCIDENTS, QUARTER, NOW),
  burn: A.burnRate(s, INCIDENTS, NOW),
  cells: A.dayCells(s, INCIDENTS, NOW),
}));

{
  const over = rows.filter((r) => r.burn > 1);
  is(
    over.length === 1,
    "exactly one service is over budget",
    over.map((r) => `${r.s.id} at ${r.burn.toFixed(2)}×`).join(", ") || "none — the warning is dead",
  );
  is(over[0]?.s.id === "postgres", "and it is the one the prose names");
}

{
  const perfect = rows.filter((r) => r.strip.lostMin === 0 && !r.strip.partial);
  is(
    perfect.length === 1,
    "exactly one service has an unbroken ninety days",
    perfect.map((r) => r.s.id).join(", ") || "none — the clean state is never seen",
  );
}

{
  const partial = rows.filter((r) => r.strip.partial);
  is(partial.length === 1, "exactly one service has a partial window", partial.map((r) => r.s.id).join(", "));
}

{
  const open = INCIDENTS.filter((i) => A.isOpen(i, NOW));
  is(open.length === 1, "exactly one incident is open at the pinned clock", open.map((i) => i.id).join(", "));
  is(
    A.durationMin(open[0], NOW) > 0 && A.durationMin(open[0], NOW) < 240,
    "and it has been running long enough to matter, briefly enough to be live",
    A.fmtDuration(A.durationMin(open[0], NOW)),
  );
}

{
  // Every mark the legend documents has to actually occur somewhere on the
  // board, or the key is describing states the data never produces.
  const seen = new Set();
  for (const r of rows) for (const c of r.cells) seen.add(c.state);
  const wanted = ["ok", "degraded", "partial", "major", "maintenance", "none"];
  const missing = wanted.filter((w) => !seen.has(w));
  is(missing.length === 0, "every state in the legend occurs on the board", `missing: ${missing.join(", ") || "none"}`);
}

{
  const inStrip = INCIDENTS.filter(
    (i) => A.overlapMinutes(i, STRIP.fromMin, STRIP.toMin, NOW) > 0 && i.severity !== "maintenance",
  );
  const longest = inStrip.reduce((a, b) => (A.durationMin(b, NOW) > A.durationMin(a, NOW) ? b : a));
  const spendOf = (i) =>
    i.impacts.reduce((a, m) => a + A.budgetSpent(i, m.serviceId, i.startMin, i.endMin ?? NOW, NOW), 0);
  const costliest = inStrip.reduce((a, b) => (spendOf(b) > spendOf(a) ? b : a));

  is(
    longest.id !== costliest.id,
    "the longest incident is NOT the most expensive one",
    `${longest.id} (${A.fmtDuration(A.durationMin(longest, NOW))}, ${A.fmtBudget(spendOf(longest))}) vs ` +
      `${costliest.id} (${A.fmtDuration(A.durationMin(costliest, NOW))}, ${A.fmtBudget(spendOf(costliest))})`,
  );
  is(
    spendOf(longest) < spendOf(costliest),
    "and it costs less, which is the argument the front page makes",
  );
  is(
    longest.impacts[0].serviceId === costliest.impacts[0].serviceId,
    "both on the same service, so the comparison is like for like",
  );
}

{
  const slow = A.slowerToNotice(INCIDENTS, NOW);
  is(slow.length === 1, "exactly one incident took longer to notice than to fix", slow.map((i) => i.id).join(", "));
  const byCustomer = INCIDENTS.filter((i) => i.detectedBy === "customer");
  is(byCustomer.length === 1, "exactly one was reported by a customer first", byCustomer.map((i) => i.id).join(", "));
  is(
    slow[0]?.id === byCustomer[0]?.id,
    "and they are the same incident, which is why it is the one worth writing about",
  );
}

// ---------------------------------------------------------------------
section("Credits");
// ---------------------------------------------------------------------

const MONTHS = A.completeMonthsBack(NOW, 6);
const CREDITS = A.creditsOwed(SERVICES, INCIDENTS, MONTHS, NOW);
const totalUsd = CREDITS.reduce((a, c) => a + c.usd, 0);
const expiredUsd = CREDITS.filter((c) => !c.claimable).reduce((a, c) => a + c.usd, 0);

{
  is(
    MONTHS.every((m) => m.toMin <= NOW),
    "only complete months get a verdict",
    MONTHS.map((m) => m.label).join(" | "),
  );
  is(
    A.creditFor(serviceById("postgres"), INCIDENTS, A.monthOf(NOW), NOW) === null,
    "the month still running produces no credit",
    A.monthOf(NOW).label,
  );
}

{
  const claimable = CREDITS.filter((c) => c.claimable);
  const expired = CREDITS.filter((c) => !c.claimable);
  is(claimable.length > 0, "some credits are still claimable", `${claimable.length}`);
  is(expired.length > 0, "and some have passed their window", `${expired.length}`);
  is(
    CREDITS.every((c) => c.claimByMin === c.period.toMin + A.CLAIM_DAYS * 1440),
    `the claim window is ${A.CLAIM_DAYS} days from the end of the month`,
  );
  is(
    CREDITS.every((c) => c.usd === Math.round((c.service.monthlyUsd * c.percent) / 100)),
    "every credit is its percentage of that service's fee",
  );
}

{
  const bands = new Set(CREDITS.map((c) => c.percent));
  is(bands.has(10), "the 10% band is reached");
  is(bands.has(25), "the 25% band is reached", CREDITS.filter((c) => c.percent === 25).map((c) => `${c.period.label} ${c.service.id}`).join(", "));
  // Deliberately unreached, and the page SAYS so rather than leaving an
  // empty column to be inferred from — §7b's "never reached" case handled
  // in content instead of by inventing a catastrophe.
  is(!bands.has(50), "the 50% band is not, and /sla states that in words");
  const sla = readFileSync(path.join(root, "src/app/sla/page.tsx"), "utf8");
  is(/No month in the published record has reached/.test(squash(sla)), "the sentence exists");
}

// ---------------------------------------------------------------------
section("Prose — every quoted figure is the model's");
// ---------------------------------------------------------------------

{
  const pg = rows.find((r) => r.s.id === "postgres");
  const consumed = A.quarterConsumedFraction(pg.s, INCIDENTS, NOW);
  const elapsed = A.quarterElapsedFraction(pg.s, NOW);
  is(A.fmtPct(consumed, 1) === "70.8%", "budget claim: 70.8% consumed", A.fmtPct(consumed, 1));
  is(A.fmtPct(elapsed, 1) === "45.0%", "budget claim: 45.0% elapsed", A.fmtPct(elapsed, 1));
  claims("has spent 70.8% of this quarter's budget with 45.0% of the quarter gone");

  // A 99.95% target over a full 92-day quarter.
  const wholeQuarterAllowance = (QUARTER.toMin - QUARTER.fromMin) * (1 - 0.9995);
  is(
    wholeQuarterAllowance.toFixed(1) === "66.2",
    "budget claim: 66.2 minutes a quarter at 99.95%",
    wholeQuarterAllowance.toFixed(2),
  );
  claims("permission slip for 66.2 minutes of failure a quarter");
}

{
  const lag = INCIDENTS.find((i) => i.id === "postgres-replica-lag");
  const fail = INCIDENTS.find((i) => i.id === "postgres-failover-loop");
  const spend = (i) => i.impacts.reduce((a, m) => a + A.budgetSpent(i, m.serviceId, i.startMin, i.endMin, NOW), 0);

  is(A.fmtDuration(A.durationMin(lag, NOW)) === "4h 51m", "pair: the long one is 4h 51m", A.fmtDuration(A.durationMin(lag, NOW)));
  is(A.fmtDuration(A.durationMin(fail, NOW)) === "22m", "pair: the short one is 22m");
  is(A.fmtBudget(spend(lag)) === "11.6 min", "pair: the long one costs 11.6 min", A.fmtBudget(spend(lag)));
  is(A.fmtBudget(spend(fail)) === "22.0 min", "pair: the short one costs 22.0 min", A.fmtBudget(spend(fail)));

  const ratio = A.durationMin(lag, NOW) / A.durationMin(fail, NOW);
  is(Math.round(ratio) === 13, "pair: thirteen times longer", ratio.toFixed(2) + "×");
  is(lag.impacts[0].fraction === 0.04, "pair: four per cent of requests");
  is(fail.impacts[0].fraction === 1, "pair: and all of them");
  claims("thirteen times longer and cost 11.6 minutes of error budget. The second cost 22.0");
  claims("four hours and fifty-one minutes");
}

{
  const pg = serviceById("postgres");
  const strip = A.windowFor(pg, INCIDENTS, STRIP, NOW);
  const quarter = A.windowFor(pg, INCIDENTS, QUARTER, NOW);
  is(A.fmtPct(strip.availability) === "99.962%", "windows: 99.962% over ninety days", A.fmtPct(strip.availability));
  is(A.fmtPct(quarter.availability) === "99.921%", "windows: 99.921% over the quarter", A.fmtPct(quarter.availability));
  is(strip.meetsTarget && !quarter.meetsTarget, "and the two windows genuinely disagree");
  claims("met its target over the last ninety days, at 99.962%, and missed it over this quarter, at 99.921%");
}

{
  const closed = INCIDENTS.filter((i) => i.severity !== "maintenance" && i.endMin !== null);
  const md = A.meanMinutes(closed.map(A.detectMin));
  const mr = A.meanMinutes(closed.map((i) => A.repairMin(i, NOW)));
  const unplanned = INCIDENTS.filter((i) => i.severity !== "maintenance");
  is(closed.length === 15, "detection: fifteen CLOSED unplanned incidents", `${closed.length}`);
  is(
    unplanned.length === closed.length + 1,
    "and one more still running, which is why the means are over fifteen",
    `${unplanned.length} unplanned`,
  );
  is(md.toFixed(1) === "3.8", "detection: mean 3.8 minutes to notice", md.toFixed(2));
  is(mr.toFixed(1) === "98.6", "detection: mean 98.6 minutes to fix", mr.toFixed(2));
  claims("fifteen unplanned incidents we have closed, we have averaged 3.8 minutes to notice and 98.6 minutes to fix");

  const bgp = INCIDENTS.find((i) => i.id === "edge-bgp-withdrawal");
  is(A.detectMin(bgp) === 23, "detection: twenty-three minutes to notice", `${A.detectMin(bgp)}`);
  is(A.repairMin(bgp, NOW) === 15, "detection: fifteen to fix", `${A.repairMin(bgp, NOW)}`);
  is(A.fmtDate(bgp.startMin) === "25 June 2026", "detection: on 25 June", A.fmtDate(bgp.startMin));
  claims("a customer told us twenty-three minutes later and we fixed it in fifteen");
}

{
  is(totalUsd === 1012, "credits: $1,012 owed", `$${totalUsd}`);
  is(expiredUsd === 699, "credits: $699 expired", `$${expiredUsd}`);
  is(CREDITS.length === 5, "credits: five of the last six months produced one", `${CREDITS.length}`);
  claims("We owe $1,012 in service credits across the last six complete months — five of which produced one");
  claims("$699 of that can no longer be claimed");
}

{
  const feb = INCIDENTS.find((i) => i.id === "postgres-storage-exhaustion");
  const febMonth = A.monthOf(feb.startMin);
  const credit = A.creditFor(serviceById("postgres"), INCIDENTS, febMonth, NOW);
  is(A.fmtDuration(A.durationMin(feb, NOW)) === "5h 41m", "february: 5h 41m", A.fmtDuration(A.durationMin(feb, NOW)));
  is(A.fmtPct(credit.availability) === "99.391%", "february: 99.391% for the month", A.fmtPct(credit.availability));
  is(credit.percent === 25, "february: a 25% credit", `${credit.percent}%`);
  is(credit.usd === 495, "february: $495", `$${credit.usd}`);
  is(serviceById("postgres").monthlyUsd === 1980, "february: against a $1,980 bill");
  claims("five hours and forty-one minutes");
  claims("99.391%, which put it two bands down the schedule: a 25% credit, $495 against a $1,980 bill");
}

{
  // The comment in services.ts quotes the two extreme budgets. It is a
  // comment rather than page copy, and it is exactly the kind of number
  // that rots quietly, so it is checked too.
  const q = QUARTER.toMin - QUARTER.fromMin;
  is(((q * 0.0001).toFixed(1)) === "13.2", "services.ts: 99.99% buys 13.2 minutes a quarter");
  is(((q * 0.001).toFixed(1)) === "132.5", "services.ts: 99.9% buys 132.5");
  const src = squash(readFileSync(path.join(root, "src/content/services.ts"), "utf8"));
  is(src.includes("13.2 minutes of budget and 99.9% buys the queues 132.5"), "and the comment says so");
}

// ---------------------------------------------------------------------
section("Content is written, not stubbed");
// ---------------------------------------------------------------------

{
  const short = INCIDENTS.filter((i) => i.summary.length < 80 || i.cause.length < 80);
  is(short.length === 0, "every incident has a real summary and cause", short.map((i) => i.id).join(", "));
  is(
    INCIDENTS.every((i) => i.prevention.length > 0),
    "and says what changes because of it",
  );
  is(
    DEFINITIONS.length === SERVICES.length,
    "every service has an SLA definition",
    `${DEFINITIONS.length}/${SERVICES.length}`,
  );
  is(
    DEFINITIONS.every((d) => SERVICES.some((s) => s.id === d.serviceId)),
    "and each one names a real service",
  );
  is(METHOD.length >= 4 && EXCLUSIONS.length >= 3 && CLAIM_STEPS.length >= 3, "the SLA page has its method, exclusions and claim steps");
  is(REDUNDANCY.length >= 4 && HARDWARE.length >= 4 && INFRA_INTRO.length >= 2, "the infrastructure page has its claims");
  is(
    /not a real company/i.test(FOOTER.fictionNote) && SITE.fictional === true,
    "§7: the footer says plainly that none of it is real",
  );
}

// ---------------------------------------------------------------------
section("No Date anywhere in src");
// ---------------------------------------------------------------------

{
  const files = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry)) files.push(full);
    }
  })(path.join(root, "src"));

  const banned = /\bnew Date\b|\bDate\.(now|parse|UTC)\b|toLocaleDateString|toLocaleTimeString|Intl\.DateTimeFormat/;
  const offenders = files.filter((f) => banned.test(readFileSync(f, "utf8")));
  is(
    offenders.length === 0,
    "no source file reads the machine's clock",
    `${files.length} files scanned`,
  );
}

// ---------------------------------------------------------------------
section("Imagery");
// ---------------------------------------------------------------------

{
  const dir = path.join(root, "src/images");
  const imgs = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  const bytes = imgs.reduce((a, f) => a + statSync(path.join(dir, f)).size, 0);
  is(imgs.length >= 3, "the template ships photography", `${imgs.length} images`);
  is(bytes < 1_200_000, "inside the ~1MB weight budget", `${(bytes / 1024).toFixed(0)}KB`);

  const srcAll = readdirSync(path.join(root, "src/app"), { recursive: true })
    .filter((f) => typeof f === "string" && /\.tsx$/.test(f))
    .map((f) => readFileSync(path.join(root, "src/app", f), "utf8"))
    .join("\n");
  const unused = imgs.filter((f) => !srcAll.includes(f.replace(/\.[^.]+$/, "")));
  is(unused.length === 0, "every image is actually used", unused.join(", "));

  const plate = readFileSync(path.join(root, "src/components/plate.tsx"), "utf8");
  is(/alt=\{alt\}/.test(plate), "the one renderer requires alt text");
  const renderers = [...readdirSync(path.join(root, "src"), { recursive: true })]
    .filter((f) => typeof f === "string" && /\.tsx$/.test(f))
    .filter((f) => /<Image\b|<img\b/.test(readFileSync(path.join(root, "src", f), "utf8")));
  is(
    renderers.length === 1 && renderers[0].endsWith("plate.tsx"),
    "and it is the only component that renders one",
    renderers.join(", "),
  );
}

// ---------------------------------------------------------------------
// Timezones. The whole point of writing the calendar arithmetic longhand.
// ---------------------------------------------------------------------

if (!process.env.TALLY_TZ_CHILD) {
  section("The same answers in three timezones");
  const fingerprint = JSON.stringify({
    now: A.fmtStamp(NOW),
    quarter: QUARTER.label,
    strip: A.fmtDate(STRIP.fromMin),
    credits: totalUsd,
    rows: rows.map((r) => [r.s.id, A.fmtPct(r.quarter.availability), r.burn.toFixed(4)]),
    months: MONTHS.map((m) => m.label),
  });

  for (const tz of ["Pacific/Auckland", "America/Los_Angeles", "UTC"]) {
    try {
      // Both streams: a failing child writes its reason to stderr, and a
      // checker that reads only stdout concludes the child said nothing.
      const out = execFileSync(process.execPath, [fileURLToPath(import.meta.url)], {
        env: { ...process.env, TZ: tz, TALLY_TZ_CHILD: "1", TALLY_FINGERPRINT: "1" },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      const got = out.trim().split("\n").pop();
      is(got === fingerprint, `identical under ${tz}`);
    } catch (err) {
      fail(`identical under ${tz}`, `${err.stdout ?? ""}${err.stderr ?? ""}`.slice(-500) || String(err));
    }
  }
} else if (process.env.TALLY_FINGERPRINT) {
  process.stdout.write(
    JSON.stringify({
      now: A.fmtStamp(NOW),
      quarter: QUARTER.label,
      strip: A.fmtDate(STRIP.fromMin),
      credits: totalUsd,
      rows: rows.map((r) => [r.s.id, A.fmtPct(r.quarter.availability), r.burn.toFixed(4)]),
      months: MONTHS.map((m) => m.label),
    }) + "\n",
  );
  process.exit(0);
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"} — ${checks - failures}/${checks} checks`);
process.exit(failures === 0 ? 0 : 1);
