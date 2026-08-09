/**
 * Checks for the two pure modules, and for the data tuning they act on.
 *
 *   node scripts/check-sla.mjs
 *
 * Node strips the types out of a `.ts` file on its own, so these call
 * the real `src/lib/sla.ts` and `src/lib/filters.ts` rather than a copy
 * that can drift away from them.
 *
 * Three things are checked, and the third is the one that will save
 * somebody:
 *
 *   1. The rules, against worked examples.
 *   2. Properties that must hold for every input — waiting longer is
 *      never less overdue, a tighter promise is never more forgiving,
 *      the comparator is a total order.
 *   3. The content itself. CONVENTIONS §7b asks for data tuned so each
 *      state appears about as often as it should, and nothing in a
 *      typecheck notices when an edit quietly leaves six conversations
 *      overdue, or none.
 */

import { awaitingSince, msLeftOf, slaState } from "../src/lib/sla.ts";
import {
  compareForSort,
  matchesQuery,
  matchesView,
} from "../src/lib/filters.ts";
import {
  duration,
  messageStamp,
  relativeTime,
  untilLabel,
} from "../src/lib/format.ts";
import { conversations } from "../src/content/conversations.ts";
import { customers } from "../src/content/customers.ts";
import { site, slaPolicies, views } from "../src/content/site.ts";
import { team } from "../src/content/team.ts";

let failures = 0;
let checks = 0;

function ok(condition, label, detail) {
  checks++;
  if (condition) return;
  failures++;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function eq(actual, expected, label) {
  ok(
    actual === expected,
    label,
    actual === expected ? "" : `got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`,
  );
}

const HOUR = 3600_000;
const at = (iso) => Date.parse(iso);

const inbound = (iso) => ({ id: iso, kind: "inbound", authorId: "c", at: iso, body: [] });
const reply = (iso) => ({ id: iso, kind: "reply", authorId: "m", at: iso, body: [] });
const note = (iso) => ({ id: iso, kind: "note", authorId: "m", at: iso, body: [] });

/* ---------- 1. the rules ---------- */

console.log("\nWhich message starts the clock\n");

eq(awaitingSince([]), null, "no messages, no clock");
eq(awaitingSince([reply("2026-03-12T09:00:00Z")]), null, "our message alone starts nothing");

eq(
  awaitingSince([inbound("2026-03-12T09:00:00Z")]),
  at("2026-03-12T09:00:00Z"),
  "one unanswered message starts the clock at it",
);

eq(
  awaitingSince([
    inbound("2026-03-12T07:00:00Z"),
    inbound("2026-03-12T11:00:00Z"),
  ]),
  at("2026-03-12T07:00:00Z"),
  "two unanswered messages start at the FIRST",
);

eq(
  awaitingSince([
    inbound("2026-03-10T09:00:00Z"),
    reply("2026-03-10T10:00:00Z"),
    inbound("2026-03-12T11:00:00Z"),
  ]),
  at("2026-03-12T11:00:00Z"),
  "a reply clears what came before it",
);

eq(
  awaitingSince([inbound("2026-03-12T09:00:00Z"), note("2026-03-12T10:00:00Z")]),
  at("2026-03-12T09:00:00Z"),
  "an internal note does NOT stop the clock",
);

eq(
  awaitingSince([
    inbound("2026-03-12T09:00:00Z"),
    reply("2026-03-12T10:00:00Z"),
    note("2026-03-12T11:00:00Z"),
  ]),
  null,
  "a note after a reply leaves the clock stopped",
);

console.log("\nWhether the clock is past its promise\n");

const base = {
  messages: [inbound("2026-03-12T09:00:00Z")],
  firstResponseHours: 2,
};

eq(
  slaState({ ...base, status: "open", now: at("2026-03-12T10:00:00Z") }).kind,
  "running",
  "an hour in, on a two-hour promise",
);
eq(
  slaState({ ...base, status: "open", now: at("2026-03-12T12:00:00Z") }).kind,
  "overdue",
  "three hours in, on a two-hour promise",
);
eq(
  slaState({ ...base, status: "open", now: at("2026-03-12T11:00:00Z") }).kind,
  "overdue",
  "exactly on the deadline counts as past it",
);
eq(
  slaState({ ...base, status: "resolved", now: at("2026-03-12T23:00:00Z") }).kind,
  "stopped",
  "resolved has no clock however late it is",
);
eq(
  slaState({ ...base, status: "snoozed", now: at("2026-03-12T23:00:00Z") }).kind,
  "stopped",
  "snoozed has no clock however late it is",
);
eq(
  slaState({ ...base, status: "waiting", now: at("2026-03-12T23:00:00Z") }).kind,
  "overdue",
  "a 'waiting' row with an unanswered message still shows a clock",
);

/* ---------- 2. properties ---------- */

console.log("\nProperties that must hold for every input\n");

{
  // Waiting longer is never less overdue.
  let monotonic = true;
  let previous = -Infinity;
  for (let h = 0; h <= 48; h++) {
    const state = slaState({
      ...base,
      status: "open",
      now: at("2026-03-12T09:00:00Z") + h * HOUR,
    });
    const over = state.kind === "overdue" ? state.msOver : -1;
    if (over < previous) monotonic = false;
    previous = over;
  }
  ok(monotonic, "waiting longer is never less overdue");
}

{
  // A tighter promise is never more forgiving: as the promised hours
  // go up, the time left must never go down.
  let monotonic = true;
  let previous = -Infinity;
  for (let hours = 1; hours <= 48; hours++) {
    const left = msLeftOf(
      slaState({
        ...base,
        firstResponseHours: hours,
        status: "open",
        now: at("2026-03-12T20:00:00Z"),
      }),
    );
    if (left < previous) monotonic = false;
    previous = left;
  }
  ok(monotonic, "a tighter promise never leaves more time than a looser one");
}

{
  // The comparator must be a total order, or rows swap on re-render.
  const rows = [];
  for (let i = 0; i < 60; i++) {
    rows.push({
      id: `id-${i}`,
      // Deliberate collisions: several rows share a timestamp, and
      // several share an msLeft, which is where a comparator missing
      // its tie-break gives itself away.
      lastActivityAt: 1000 * (i % 7),
      msLeft: i % 3 === 0 ? null : ((i % 5) - 2) * 1000,
    });
  }
  for (const mode of ["newest", "urgent"]) {
    const cmp = (a, b) => compareForSort(mode, a, b);

    let antisymmetric = true;
    let reflexive = true;
    for (const a of rows) {
      if (cmp(a, a) !== 0) reflexive = false;
      for (const b of rows) {
        if (Math.sign(cmp(a, b)) !== -Math.sign(cmp(b, a))) antisymmetric = false;
      }
    }
    ok(reflexive, `${mode}: a row compares equal to itself`);
    ok(antisymmetric, `${mode}: comparing either way round agrees`);

    let transitive = true;
    for (const a of rows.slice(0, 20))
      for (const b of rows.slice(0, 20))
        for (const c of rows.slice(0, 20))
          if (cmp(a, b) <= 0 && cmp(b, c) <= 0 && cmp(a, c) > 0) transitive = false;
    ok(transitive, `${mode}: ordering is transitive`);

    // Same input in a different starting order must give the same list.
    const shuffled = [...rows].reverse();
    const first = [...rows].sort(cmp).map((r) => r.id).join(",");
    const second = shuffled.sort(cmp).map((r) => r.id).join(",");
    eq(second, first, `${mode}: the order does not depend on the input order`);
  }

  // And the thing the mode exists for.
  const sorted = [...rows].sort((a, b) => compareForSort("urgent", a, b));
  const firstWithoutClock = sorted.findIndex((r) => r.msLeft === null);
  const lastWithClock = sorted.map((r) => r.msLeft !== null).lastIndexOf(true);
  ok(
    lastWithClock < firstWithoutClock,
    "urgent: everything with a clock sorts above everything without one",
  );
}

console.log("\nSearching\n");

ok(matchesQuery("Refund for Fiona Kerr", "kerr refund"), "tokens match in any order");
ok(matchesQuery("anything at all", ""), "an empty query matches everything");
ok(matchesQuery("Battery drains overnight", "BATTERY"), "matching ignores case");
ok(!matchesQuery("Battery drains overnight", "battery shipping"), "every token must appear");
ok(matchesQuery("a", "   "), "whitespace alone is an empty query");

console.log("\nSaved filters\n");

const viewById = (id) => views.find((v) => v.id === id);
ok(
  matchesView({ status: "open", assigneeId: null }, viewById("unassigned"), "m-nadia"),
  "unassigned view takes an unowned open conversation",
);
ok(
  !matchesView({ status: "open", assigneeId: "m-tom" }, viewById("unassigned"), "m-nadia"),
  "unassigned view rejects an owned one",
);
ok(
  matchesView({ status: "resolved", assigneeId: "m-nadia" }, viewById("mine"), "m-nadia"),
  "'assigned to me' spans every status",
);
ok(
  matchesView({ status: "snoozed", assigneeId: null }, viewById("all"), "m-nadia"),
  "'everything' takes everything",
);

/* ---------- 3. the content ---------- */

console.log("\nThe data, tuned per CONVENTIONS §7b\n");

const now = at(site.now);
const hoursFor = (plan) =>
  slaPolicies.find((policy) => policy.plan === plan).firstResponseHours;
const customerOf = (id) => customers.find((c) => c.id === id);

const states = conversations.map((c) => {
  const customer = customerOf(c.customerId);
  ok(Boolean(customer), `${c.ref}: customer ${c.customerId} exists`);
  return {
    conversation: c,
    state: slaState({
      status: c.status,
      messages: c.messages,
      firstResponseHours: hoursFor(customer.plan),
      now,
    }),
  };
});

const overdue = states.filter((s) => s.state.kind === "overdue");
eq(overdue.length, 1, "exactly one conversation is past its promise");
eq(overdue[0]?.conversation.ref, "4118", "and it is the one the comments name");

const dueSoon = states.filter(
  (s) => s.state.kind === "running" && s.state.msLeft <= HOUR,
);
ok(
  dueSoon.length >= 2 && dueSoon.length <= 3,
  "two or three are close to it",
  `${dueSoon.length} are`,
);

const unassigned = conversations.filter((c) => c.assigneeId === null);
ok(unassigned.length >= 2, "at least two are unassigned", `${unassigned.length}`);

for (const status of ["open", "waiting", "snoozed", "resolved"]) {
  ok(
    conversations.some((c) => c.status === status),
    `at least one conversation is ${status}`,
  );
}

for (const channel of ["email", "chat", "social"]) {
  ok(
    conversations.some((c) => c.channel === channel),
    `at least one conversation arrived by ${channel}`,
  );
}

ok(
  conversations.some((c) => c.messages.length === 1),
  "one thread is a single message",
);
ok(
  conversations.some((c) => c.messages.length >= 8),
  "one thread is long enough to need scrolling",
);
ok(
  conversations.some((c) => c.subject.length > 90),
  "one subject is long enough to test truncation",
);
ok(
  conversations.some((c) => c.tagIds.length === 0),
  "one conversation has no tags",
);
ok(
  conversations.some((c) => c.messages.some((m) => m.kind === "note")),
  "internal notes appear in the data",
);
ok(
  conversations.filter((c) => c.unread).length >= 3,
  "several are unread",
);

const idle = team.filter(
  (member) => !conversations.some((c) => c.assigneeId === member.id),
);
ok(idle.length >= 1, "at least one teammate has nothing assigned");

const quiet = customers.filter(
  (customer) => !conversations.some((c) => c.customerId === customer.id),
);
ok(quiet.length >= 1, "at least one customer has never written in");

// Every saved filter must find something, except the ones whose whole
// point is that they can be empty.
for (const view of views) {
  const found = conversations.filter((c) =>
    matchesView(c, view, site.currentMemberId),
  );
  ok(found.length > 0, `the "${view.label}" filter finds something`);
}

const ids = new Set();
for (const c of conversations) {
  ok(!ids.has(c.id), `${c.ref}: id is unique`);
  ids.add(c.id);
  let previous = 0;
  for (const message of c.messages) {
    const stamp = at(message.at);
    ok(!Number.isNaN(stamp), `${c.ref}: ${message.id} has a real date`);
    ok(stamp >= previous, `${c.ref}: messages are in order`);
    ok(stamp <= now, `${c.ref}: no message is from the future`);
    previous = stamp;
  }
  if (c.status === "snoozed") {
    ok(c.snoozedUntil !== null, `${c.ref}: a snoozed conversation says until when`);
    ok(at(c.snoozedUntil) > now, `${c.ref}: and it is in the future`);
  }
}

console.log("\nSaying when\n");

eq(untilLabel("2026-03-12T17:20:00Z", now), "today at 17:20", "later today");
eq(
  untilLabel("2026-03-13T09:20:00Z", now),
  "tomorrow at 09:20",
  "tomorrow morning, which is under 24 hours away",
);
eq(
  untilLabel("2026-03-13T00:10:00Z", now),
  "tomorrow at 00:10",
  "ten past midnight is tomorrow, not ten hours of today",
);
eq(untilLabel("2026-03-12T23:50:00Z", now), "today at 23:50", "late tonight");
eq(untilLabel("2026-03-16T09:00:00Z", now), "16 Mar at 09:00", "further out");

eq(duration(45_000), "under a minute", "under a minute");
eq(duration(25 * 60_000), "25m", "minutes");
eq(duration(3 * HOUR + 20 * 60_000), "3h 20m", "hours and minutes");
eq(duration(2 * HOUR), "2h", "a whole number of hours");
eq(duration(50 * HOUR), "2d 2h", "days and hours");

eq(relativeTime("2026-03-12T14:19:30Z", now), "just now", "seconds ago");
eq(relativeTime("2026-03-12T10:20:00Z", now), "4h ago", "hours ago");
eq(relativeTime("2026-03-09T14:20:00Z", now), "3d ago", "days ago");

// Times are shown in the workspace's timezone, not the reader's, so
// this has to hold whatever TZ the machine running it is set to.
eq(
  messageStamp("2026-03-12T09:00:00Z"),
  "Thu 12 Mar, 09:00",
  "a 09:00 UTC message reads as 09:00 in UK time",
);

console.log(
  failures === 0
    ? `\n✓ ${checks} checks passed\n`
    : `\n✗ ${failures} of ${checks} checks failed\n`,
);
process.exit(failures === 0 ? 0 : 1);
