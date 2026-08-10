/**
 * The studio, asserted.
 *
 *   node scripts/check-load.mjs
 *   TZ=Asia/Tokyo node scripts/check-load.mjs
 *
 * It imports the REAL modules — `src/lib/pack.ts`, `schedule.ts`,
 * `studio.ts` and the content — rather than a copy of them, because a
 * checker testing a duplicate is testing the duplicate (CONVENTIONS §8).
 * Node strips the types itself, which is the whole reason those files
 * carry relative imports with explicit `.ts` extensions and never touch
 * the `@/` alias.
 *
 * Four kinds of thing are checked here, and the middle two are the ones
 * worth having:
 *
 *   1. PROPERTIES OF THE MODEL — no pot is ever in two places on one
 *      shelf, no load exceeds its chamber, a firing that ran was over
 *      its threshold and one that did not was under it. These hold for
 *      any content and would catch a bug in the arithmetic.
 *   2. CLAIMS THE SITE MAKES — the kiln note says a celadon takes three
 *      times as long as a white glaze; the front page says the glaze
 *      inside a programme makes no difference; the join page says a full
 *      kiln is cheaper per piece than a thin one. Every one of those is
 *      a sentence somebody wrote, and every one is checked against the
 *      numbers the pages render, so a nudge to the content that
 *      falsifies the prose fails the run instead of shipping.
 *   3. §7B STATES — all eight reasons reached, exactly one pot nothing
 *      will take, at least one firing that will not light. A state the
 *      data never reaches is dead code with a nice name on it.
 *   4. CONTENT CONSISTENCY — a piece in a past bisque cannot still be
 *      wet clay, and a firing cannot list more survivors than it held.
 *
 * Run it with the machine's timezone set to something else too. It
 * should not matter, because there is no `Date` anywhere in `src` and
 * this file asserts that — but a test that agrees with the bug on your
 * laptop is worth nothing.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { kilns, programs } from "../src/content/kilns.ts";
import { glazes, members } from "../src/content/glazes.ts";
import { pastFirings, pieces } from "../src/content/pieces.ts";
import { HORIZON, TODAY, tariff } from "../src/content/site.ts";
import * as P from "../src/lib/pack.ts";
import * as S from "../src/lib/schedule.ts";
import * as Studio from "../src/lib/studio.ts";
import { REASON_LABEL, REASON_ORDER } from "../src/lib/reasons.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

let pass = 0;
const failures = [];

function ok(label, condition, detail = "") {
  if (condition) {
    pass += 1;
  } else {
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function eq(label, actual, expected) {
  ok(label, actual === expected, `expected ${expected}, got ${actual}`);
}

function section(name) {
  console.log(`\n  ${name}`);
}

// ── 1. Content consistency ────────────────────────────────────────────
section("Content");

const pieceIds = new Set(pieces.map((p) => p.id));
const kilnIds = new Set(kilns.map((k) => k.id));
const programIds = new Set(programs.map((p) => p.id));
const glazeIds = new Set(glazes.map((g) => g.id));
const memberIds = new Set(members.map((m) => m.id));

eq("every piece id is unique", pieceIds.size, pieces.length);
ok(
  "every piece has a real member",
  pieces.every((p) => memberIds.has(p.memberId)),
);
ok(
  "every chosen glaze exists",
  pieces.every((p) => p.glazeId === null || glazeIds.has(p.glazeId)),
);
ok(
  "a glazed piece has a glaze",
  pieces.every((p) => p.state !== "glazed" || p.glazeId !== null),
);
ok(
  "every glaze fires a real programme",
  glazes.every((g) => programIds.has(g.programId)),
);
ok(
  "every rota slot names a real programme",
  kilns.every((k) => k.rota.every((s) => programIds.has(s.programId))),
);
ok(
  "every rota slot is inside the fortnight",
  kilns.every((k) => k.rota.every((s) => s.day >= 0 && s.day < S.CYCLE_DAYS)),
);
ok(
  "past firings name real kilns and programmes",
  pastFirings.every((f) => kilnIds.has(f.kilnId) && programIds.has(f.programId)),
);
ok(
  "past firings only list pieces that exist",
  pastFirings.every((f) => f.loaded.every((id) => pieceIds.has(id))),
);
ok(
  "a firing cannot have more survivors than it held",
  pastFirings.every((f) => f.loaded.length <= f.total),
);
ok(
  "nothing in a past bisque is still wet clay",
  pastFirings
    .filter((f) => f.programId === S.BISQUE)
    .every((f) => f.loaded.every((id) => pieces.find((p) => p.id === id).state !== "greenware")),
);
ok(
  "everything through a past GLAZE firing has gone home",
  pastFirings
    .filter((f) => f.programId !== S.BISQUE)
    .every((f) => f.loaded.every((id) => pieces.find((p) => p.id === id).state === "collected")),
);
ok(
  "every past firing's log ends at its programme's peak",
  pastFirings.every((f) => {
    const program = programs.find((p) => p.id === f.programId);
    return f.log[f.log.length - 1][1] === program.peak;
  }),
);
ok(
  "every log climbs and never falls",
  pastFirings.every((f) => f.log.every(([, c], i) => i === 0 || c >= f.log[i - 1][1])),
);

// ── 2. Properties of the packer ───────────────────────────────────────
section("The packer");

for (const firing of Studio.firings) {
  const kiln = kilns.find((k) => k.id === firing.kilnId);
  const load = firing.load;
  const placed = P.loadedIds(load);

  ok(
    `${firing.id}: no piece is shelved twice`,
    new Set(placed).size === placed.length,
  );

  ok(
    `${firing.id}: the stack fits the chamber`,
    load.usedHeight <= kiln.height,
    `${load.usedHeight}cm in ${kiln.height}cm`,
  );

  eq(
    `${firing.id}: layer heights sum to the used height`,
    load.layers.reduce((n, l) => n + l.height, 0),
    load.usedHeight,
  );

  for (const layer of load.layers) {
    for (const p of layer.placements) {
      ok(
        `${firing.id}: ${p.pieceId} is inside the floor`,
        p.x >= 0 && p.y >= 0 && p.x + p.width <= kiln.width && p.y + p.depth <= kiln.depth,
        `${p.x},${p.y} ${p.width}×${p.depth} in ${kiln.width}×${kiln.depth}`,
      );
    }
    // No two pots on one shelf may share floor. Rectangles overlap when
    // they overlap on BOTH axes; a strip packer that got its row depth
    // wrong would pass every other check here and fail this one.
    for (let i = 0; i < layer.placements.length; i += 1) {
      for (let j = i + 1; j < layer.placements.length; j += 1) {
        const a = layer.placements[i];
        const b = layer.placements[j];
        const overlap =
          a.x < b.x + b.width &&
          b.x < a.x + a.width &&
          a.y < b.y + b.depth &&
          b.y < a.y + a.depth;
        ok(`${firing.id}: ${a.pieceId} and ${b.pieceId} do not overlap`, !overlap);
      }
    }
    ok(
      `${firing.id}: nothing on a shelf is taller than the shelf`,
      layer.placements.every(
        (p) => p.height <= layer.height - kiln.shelfThickness - kiln.clearance,
      ),
    );
  }

  ok(
    `${firing.id}: nothing loaded that does not fit`,
    placed.every((id) => P.fits(kiln, pieces.find((p) => p.id === id))),
  );
}

// A firing lights if and only if it is over its threshold. This is the
// rule the entire site is about, so it is asserted rather than assumed.
for (const firing of Studio.firings) {
  const kiln = kilns.find((k) => k.id === firing.kilnId);
  if (firing.status === "postponed") {
    ok(
      `${firing.id}: postponed, and genuinely short`,
      firing.load.load < kiln.minLoad,
      `${firing.load.load} vs ${kiln.minLoad}`,
    );
    eq(`${firing.id}: a postponed firing carries nothing`, firing.pieces.length, 0);
  }
  if (firing.status === "loading" || firing.status === "planned") {
    ok(
      `${firing.id}: lit, and genuinely over`,
      firing.load.load >= kiln.minLoad,
      `${firing.load.load} vs ${kiln.minLoad}`,
    );
    ok(`${firing.id}: a lit firing carries something`, firing.pieces.length > 0);
  }
  if (firing.status === "open") {
    eq(`${firing.id}: an open slot has nothing waiting`, firing.pieces.length, 0);
  }
}

// Adding a pot to a load can never make the kiln emptier. Cheap to
// state, and it is the property that would break first if `occupancy`
// were ever rewritten to divide by something that moves.
{
  const kiln = kilns[1];
  const two = pieces.slice(0, 2);
  const three = pieces.slice(0, 3);
  ok(
    "occupancy rises when work is added",
    P.occupancy(kiln, three) > P.occupancy(kiln, two),
  );
  eq("an empty kiln is empty", P.occupancy(kiln, []), 0);
}

// Drying is monotone in height, which is the only thing the rule of
// thumb has to be.
ok(
  "a taller pot never dries faster",
  [5, 12, 24, 40, 88].every((h, i, all) =>
    i === 0 ? true : S.dryingDays({ height: h }) >= S.dryingDays({ height: all[i - 1] }),
  ),
);

// The loading order IS the fairness policy, so it is asserted rather
// than described. Anything a kiln turned away outranks everything else.
{
  const sample = pieces.slice(0, 6);
  const bumps = new Map([[sample[5].id, 1]]);
  const available = new Map(sample.map((p) => [p.id, TODAY]));
  const ordered = S.queueOrder(sample, bumps, available);
  eq("a bumped piece goes to the front", ordered[0].id, sample[5].id);

  const noBumps = S.queueOrder(sample, new Map(), available);
  ok(
    "otherwise the tallest goes first",
    noBumps.every((p, i) => i === 0 || p.height <= noBumps[i - 1].height),
  );
}

// ── 3. Determinism, and no clock ──────────────────────────────────────
section("Determinism");

{
  const a = S.simulate(pieces, kilns, Studio.look, TODAY, HORIZON);
  const b = S.simulate(pieces, kilns, Studio.look, TODAY, HORIZON);
  const shape = (r) =>
    JSON.stringify(r.firings.map((f) => [f.id, f.status, f.pieces, f.bumped]));
  ok("the same studio produces the same fortnight", shape(a) === shape(b));
  eq(
    "and the same answer for every piece",
    JSON.stringify([...a.tracks.values()].map((t) => [t.pieceId, t.readyOn, t.reason])),
    JSON.stringify([...b.tracks.values()].map((t) => [t.pieceId, t.readyOn, t.reason])),
  );
}

{
  // There is no Date in the application, which is what makes the answer
  // the same in Hollowmere and in Tokyo. Asserted rather than trusted,
  // because a single `new Date()` added later would be invisible until
  // somebody in another timezone opened the site.
  const offenders = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry.name)) {
        const text = readFileSync(full, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ");
        if (/new Date\(|Date\.now\(|Intl\.DateTimeFormat|toLocaleDate/.test(text)) {
          offenders.push(path.relative(root, full));
        }
      }
    }
  };
  walk(path.join(root, "src"));
  ok("no Date anywhere in src", offenders.length === 0, offenders.join(", "));
}

// ── 4. §7b: every state the design can show is reached ────────────────
section("States (§7b)");

for (const reason of REASON_ORDER) {
  const list = Studio.byReason.get(reason) ?? [];
  ok(
    `something is "${REASON_LABEL[reason]}"`,
    list.length > 0,
    "a reason nothing reaches is dead copy",
  );
}

eq(
  "exactly one pot nothing in the building will fire",
  (Studio.byReason.get("nothing") ?? []).length,
  1,
);
eq(
  "exactly one pot is too big for the kiln firing soonest",
  (Studio.byReason.get("size") ?? []).length,
  1,
);
ok(
  "at least one firing will not light",
  Studio.firings.some((f) => f.status === "postponed"),
);
ok(
  "at least one firing turns work away",
  Studio.firings.some((f) => f.bumped.length > 0),
);
ok(
  "at least one rota slot has nothing on it",
  Studio.firings.some((f) => f.status === "open"),
);
ok("at least one firing is being packed today", Studio.loadingNow.length > 0);
ok(
  "some pieces have no date at all",
  Studio.withoutDate > 0 && Studio.withoutDate < Studio.onShelf,
);
ok(
  "and some of those are stranded by an unlit kiln specifically",
  Studio.strandedByLoad > 0 && Studio.strandedByLoad < Studio.withoutDate,
  "the front page attributes exactly these to the gas kiln",
);
ok(
  "at least one shelf is packed past four fifths of its floor",
  Studio.firings.some((f) => {
    const kiln = kilns.find((k) => k.id === f.kilnId);
    return f.load.layers.some((l) => P.shelfUsed(kiln, l) > 0.8);
  }),
  "otherwise the plan views never show a full shelf",
);

// ── 5. The claims the pages make ──────────────────────────────────────
section("Claims");

{
  const electric = glazes.filter((g) => g.programId === "stoneware6");
  const reduction = glazes.filter((g) => g.programId === "reduction10");
  eq("six glazes fire in an electric kiln", electric.length, 6);
  eq("three do not", reduction.length, 3);

  const eDays = electric.map((g) => Studio.quoteDays(g.id));
  const rDays = reduction.map((g) => Studio.quoteDays(g.id));

  ok(
    "every electric glaze quotes the same wait",
    new Set(eDays).size === 1,
    eDays.join("/"),
  );
  ok(
    "every reduction glaze quotes the same wait",
    new Set(rDays).size === 1,
    rDays.join("/"),
  );
  ok(
    "which is the front page's whole point: the glaze is not the decision",
    eDays[0] !== rDays[0],
  );

  // kilns.ts says Bramble "is the reason a celadon takes three times as
  // long as a white glaze". The first version of that sentence said "a
  // fortnight against four days" and was written before the simulation
  // had ever been run. This is why it is asserted.
  eq("a reduction glaze takes three times as long", rDays[0], eDays[0] * 3);

  const note = kilns.find((k) => k.id === "bramble").note;
  ok(
    "and Bramble's own note says so",
    note.includes("three times as long"),
    "the prose and the model have to agree",
  );
}

{
  const tallest = Math.max(...kilns.map(P.tallestPossible));
  const marl = kilns.find((k) => k.id === "marl");
  eq("Marl is the tallest chamber, as its note claims", P.tallestPossible(marl), tallest);
  ok(
    "and its note says chamber rather than 'the only one'",
    marl.note.includes("tallest chamber"),
  );
}

{
  const ash = kilns.find((k) => k.id === "ash");
  const bramble = kilns.find((k) => k.id === "bramble");
  eq("Ash fires twice a week, as its note claims", ash.rota.length, 4);
  eq("Bramble fires once a fortnight", bramble.rota.length, 1);
  ok(
    "and Bramble's Sunday really is a Sunday",
    S.weekday(bramble.rota[0].day) === "Sunday",
    S.weekday(bramble.rota[0].day),
  );
  ok(
    "the gas kiln has the highest bar of the three",
    kilns.every((k) => k.id === "bramble" || k.minLoad < bramble.minLoad),
  );
}

{
  // /join says the cost per piece has run from one figure to another
  // over the last six firings, and that a full kiln is cheaper than a
  // thin one. Both are divisions the page performs in public.
  const each = pastFirings.map((f) => ({
    id: f.id,
    each: Studio.costOf(f.kilnId) / f.total,
    total: f.total,
  }));
  const cheapest = [...each].sort((a, b) => a.each - b.each)[0];
  const dearest = [...each].sort((a, b) => b.each - a.each)[0];
  ok("the cheapest firing per piece is not the dearest", cheapest.id !== dearest.id);
  ok(
    "a fuller kiln is cheaper per piece than a thinner one of the same kiln",
    (() => {
      const byKiln = new Map();
      for (const f of pastFirings) {
        const list = byKiln.get(f.kilnId) ?? [];
        list.push(f);
        byKiln.set(f.kilnId, list);
      }
      return [...byKiln.values()].every((list) =>
        list.every((a) =>
          list.every(
            (b) =>
              a.total === b.total ||
              (a.total > b.total) ===
                (Studio.costOf(a.kilnId) / a.total < Studio.costOf(b.kilnId) / b.total),
          ),
        ),
      );
    })(),
  );
  ok("the spread is worth printing", dearest.each / cheapest.each > 1.5);
}

{
  // A piece's share of a firing is its share of the SPACE, and the
  // shares must add up to the firing. A division by head count would
  // pass a naive "do they sum" test too, so the second assertion checks
  // that a bigger pot really does pay more.
  const firing = Studio.firings.find((f) => f.pieces.length > 3);
  const shares = firing.pieces.map((id) => Studio.shareOf(firing, id));
  const sum = shares.reduce((n, s) => n + s, 0);
  ok(
    "every share of a firing adds up to the firing",
    Math.abs(sum - Studio.costOf(firing.kilnId)) < 0.01,
    `${sum} vs ${Studio.costOf(firing.kilnId)}`,
  );
  const sized = firing.pieces
    .map((id) => ({ id, v: P.volume(pieces.find((p) => p.id === id)) }))
    .sort((a, b) => b.v - a.v);
  ok(
    "and the biggest pot in it pays the most",
    Studio.shareOf(firing, sized[0].id) >= Studio.shareOf(firing, sized[sized.length - 1].id),
  );
}

{
  // The tariff is in pence, and a firing's cost is derived from the
  // kiln's own energy figure rather than typed in anywhere.
  for (const kiln of kilns) {
    eq(
      `${kiln.name}'s firing cost is derived`,
      Studio.costOf(kiln.id),
      Math.round(kiln.energy.perFiring * tariff[kiln.energy.unit]),
    );
  }
  ok(
    "the gas firing is the expensive one",
    Studio.costOf("bramble") > Studio.costOf("marl") &&
      Studio.costOf("marl") > Studio.costOf("ash"),
  );
}

{
  // Every piece that has a date has a route that leads to it, and every
  // step of that route is a firing that actually lights.
  let checked = 0;
  for (const [id, track] of Studio.tracks) {
    if (track.readyOn === null) continue;
    const last = track.steps[track.steps.length - 1];
    ok(`${id}: comes out the day after its last firing`, track.readyOn === last.day + S.COOL_DAYS);
    ok(
      `${id}: every step is a firing that lights`,
      track.steps.every((s) => {
        const f = Studio.firingById.get(s.firingId);
        return f && f.status !== "postponed" && f.status !== "open";
      }),
    );
    ok(
      `${id}: its steps are in order`,
      track.steps.every((s, i) => i === 0 || s.day > track.steps[i - 1].day),
    );
    checked += 1;
  }
  ok("most of the shelf has a date", checked > pieces.length / 2, `${checked} of ${pieces.length}`);
}

{
  // A wet pot is never in a kiln before it is dry. The one rule in the
  // model that would silently ruin real work.
  for (const [id, track] of Studio.tracks) {
    const piece = pieces.find((p) => p.id === id);
    if (piece.state !== "greenware" || track.steps.length === 0) continue;
    ok(
      `${id}: is not fired before it is dry`,
      track.steps[0].day >= S.dryOn(piece),
      `fired day ${track.steps[0].day}, dry day ${S.dryOn(piece)}`,
    );
  }
}

// ── Report ────────────────────────────────────────────────────────────
console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${pass} checks passed\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${pass + failures.length} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
