/**
 * The schedule, checked.
 *
 *   node scripts/check-schedule.mjs
 *
 * Run it with a different machine timezone too, or it will happily
 * agree with a bug on this laptop:
 *
 *   TZ=Asia/Tokyo node scripts/check-schedule.mjs
 *
 * These import the REAL modules rather than a copy — node strips the
 * types on its own — so a rule asserted here is a rule the site obeys.
 * CONVENTIONS §8.
 */

import {
  toMinutes,
  fromMinutes,
  timeLabel,
  hourLabel,
  rangeLabel,
  durationLabel,
  dayKey,
  minutesIntoDay,
  longDate,
} from "../src/lib/time.ts";
import {
  overlaps,
  place,
  placeDay,
  isPlenary,
  isChoosable,
  phaseOf,
  competingWith,
  clashingPairs,
  clashingIds,
  planByDay,
  planMinutes,
  roomDoubleBookings,
  speakerDoubleBookings,
} from "../src/lib/schedule.ts";
import { sessions } from "../src/content/sessions.ts";
import { speakers } from "../src/content/speakers.ts";
import { days, rooms, now, ZONE, topics } from "../src/content/site.ts";
import { tiers } from "../src/content/tickets.ts";

let passed = 0;
const failures = [];

function ok(cond, label, detail) {
  if (cond) {
    passed += 1;
  } else {
    failures.push(detail ? `${label}\n     ${detail}` : label);
  }
}

function eq(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  ok(a === e, label, `expected ${e}\n     got      ${a}`);
}

function section(name) {
  console.log(`\n  ${name}`);
}

const byId = new Map(sessions.map((s) => [s.id, s]));
const dayFor = new Map(days.map((d) => [d.n, d]));
const choosable = sessions.filter(isChoosable);

// ── 1. Clock arithmetic ───────────────────────────────────────────────
section("Clock arithmetic");

eq(toMinutes("09:30"), 570, "09:30 is 570 minutes past midnight");
eq(toMinutes("00:00"), 0, "midnight is zero");
eq(toMinutes("23:59"), 1439, "the last minute of the day");
ok(Number.isNaN(toMinutes("9:30")), "a single-digit hour is rejected");
ok(Number.isNaN(toMinutes("25:00")), "hour 25 is rejected");
ok(Number.isNaN(toMinutes("10:71")), "minute 71 is rejected");
eq(fromMinutes(570), "09:30", "and it round-trips");
eq(fromMinutes(toMinutes("13:05")), "13:05", "afternoon round-trips too");

eq(timeLabel(540), "9:00", "9am has no leading zero in the block label");
eq(timeLabel(720), "12:00", "noon is 12, not 0");
eq(timeLabel(780), "1:00", "1pm is 1, not 13");
eq(timeLabel(0), "12:00", "midnight is 12, not 0");
eq(hourLabel(540), "9 AM", "the rail carries the meridiem");
eq(hourLabel(720), "12 PM", "noon reads PM");
eq(hourLabel(780), "1 PM", "and the afternoon is right");
eq(rangeLabel(660, 705), "11:00 – 11:45", "a range uses an en dash");
eq(durationLabel(45), "45m", "under an hour");
eq(durationLabel(60), "1h", "exactly an hour has no minutes");
eq(durationLabel(90), "1h 30m", "an hour and a half");

// The whole reason dayKey exists: this must not move with the machine.
eq(dayKey(now, ZONE), "2026-10-15", "the pinned now falls on day two");
eq(minutesIntoDay(now, ZONE, "2026-10-15"), 680, "…at 11:20 local");
eq(minutesIntoDay(now, ZONE, "2026-10-14"), null, "and nowhere on day one");
eq(minutesIntoDay(now, ZONE, "2026-10-16"), null, "and nowhere on day three");
eq(
  longDate("2026-10-15", ZONE),
  "Thursday, October 15",
  "a date formats at noon UTC so it cannot slip west",
);

// ── 2. Placement on the grid ──────────────────────────────────────────
section("Placement");

for (const day of days) {
  const open = toMinutes(day.opens);
  const close = toMinutes(day.closes);
  const onDay = sessions.filter((s) => s.day === day.n);

  ok(onDay.length > 0, `day ${day.n} has sessions on it`);

  const outside = onDay.filter(
    (s) => toMinutes(s.start) < open || toMinutes(s.end) > close,
  );
  eq(
    outside.map((s) => s.id),
    [],
    `nothing on day ${day.n} falls outside ${day.opens}–${day.closes}`,
  );

  const backwards = onDay.filter((s) => toMinutes(s.end) <= toMinutes(s.start));
  eq(backwards.map((s) => s.id), [], `nothing on day ${day.n} ends before it starts`);
}

{
  const day2 = dayFor.get(2);
  const placed = placeDay(sessions, 2, day2.opens);
  ok(placed.length > 0, "day two places");
  ok(
    placed.every((p, i) => i === 0 || placed[i - 1].startMins <= p.startMins),
    "placed sessions come back in start order",
  );
  ok(
    placed.every((p) => p.fromMinutes >= 0),
    "nothing is placed above the top of the grid",
  );

  // The grid draws height from `minutes`, so this IS the guarantee that a
  // 90-minute workshop cannot be drawn the same size as a 45-minute talk.
  const workshop = byId.get("d2-16");
  const talk = byId.get("d2-17");
  const pw = place(workshop, toMinutes(day2.opens));
  const pt = place(talk, toMinutes(day2.opens));
  eq(pw.minutes, 90, "the day-two workshop is ninety minutes");
  eq(pt.minutes, 45, "the talk beside it is forty-five");
  ok(pw.minutes === pt.minutes * 2, "so it is drawn exactly twice the height");
  eq(pw.fromMinutes, pt.fromMinutes, "and they start level");
}

// ── 3. Collision ──────────────────────────────────────────────────────
section("Collision");

ok(overlaps(660, 705, 690, 730), "sessions sharing a minute overlap");
ok(!overlaps(660, 705, 705, 750), "back-to-back sessions do NOT overlap");
ok(!overlaps(660, 705, 800, 840), "sessions in different slots do not overlap");
ok(overlaps(660, 780, 690, 700), "a long session contains a short one");
ok(overlaps(690, 700, 660, 780), "and the test is symmetric");

// These two are data errors rather than design states, and both are
// completely invisible on the page — the grid will cheerfully draw two
// blocks on top of each other and look fine.
eq(
  roomDoubleBookings(sessions).map(([a, b]) => `${a.id}+${b.id}`),
  [],
  "no room is booked twice at once",
);
eq(
  speakerDoubleBookings(sessions).map(([a, b, s]) => `${s}: ${a.id}+${b.id}`),
  [],
  "no speaker is in two rooms at once",
);

{
  // A plenary is in every room, so nothing may run against it.
  const plenaries = sessions.filter(isPlenary).filter(isChoosable);
  const clashingWithPlenary = plenaries.flatMap((p) =>
    sessions
      .filter(
        (s) =>
          s.id !== p.id &&
          s.day === p.day &&
          overlaps(
            toMinutes(p.start),
            toMinutes(p.end),
            toMinutes(s.start),
            toMinutes(s.end),
          ),
      )
      .map((s) => `${p.id} vs ${s.id}`),
  );
  eq(clashingWithPlenary, [], "nothing is scheduled against a plenary");
}

// ── 4. The pinned clock ───────────────────────────────────────────────
section("The pinned clock");

{
  const day2 = dayFor.get(2);
  const nowMins = minutesIntoDay(now, ZONE, day2.date);
  const placed = placeDay(sessions, 2, day2.opens);
  const live = placed.filter((p) => phaseOf(p, nowMins) === "live");
  const past = placed.filter((p) => phaseOf(p, nowMins) === "past");
  const soon = placed.filter((p) => phaseOf(p, nowMins) === "upcoming");

  ok(live.length > 0, "something is live at the pinned now");
  eq(live.length, 4, "four things are live — one per room, which is the point");
  eq(
    live.map((p) => p.session.id).sort(),
    ["d2-08", "d2-09", "d2-10", "d2-11"],
    "and they are the 11:00 sessions",
  );
  ok(past.length > 0, "day two has a past, so the finished treatment is real");
  ok(soon.length > 0, "and a future, so the upcoming treatment is real");

  // The other two days must NOT be drawn as though being lived through.
  for (const n of [1, 3]) {
    const d = dayFor.get(n);
    const mins = minutesIntoDay(now, ZONE, d.date);
    const ps = placeDay(sessions, n, d.opens);
    ok(mins === null, `day ${n} is not today`);
    ok(
      ps.every((p) => phaseOf(p, mins) === "other-day"),
      `so nothing on day ${n} claims to be live`,
    );
  }
}

// ── 5. Tuned states (§7b) ─────────────────────────────────────────────
section("Tuned states");

{
  const cancelled = sessions.filter((s) => s.cancelled);
  eq(cancelled.map((s) => s.id), ["d3-05"], "exactly one session is cancelled");
  ok(
    !isChoosable(cancelled[0]),
    "and a cancelled session cannot be put in a plan",
  );

  const workshops = sessions.filter((s) => s.kind === "workshop");
  eq(workshops.length, 2, "there are two workshops");
  eq(
    workshops.filter((w) => w.soldOut).map((w) => w.id),
    ["d1-12"],
    "exactly one is sold out, so both halves of the capacity design exist",
  );
  ok(
    workshops.every((w) => typeof w.capacity === "number"),
    "and both state a capacity",
  );
  ok(
    sessions.filter((s) => s.kind !== "workshop").every((s) => !s.capacity),
    "nothing else is capped",
  );

  const plenaries = sessions.filter(isPlenary).filter(isChoosable);
  eq(
    plenaries.map((s) => s.id),
    ["d1-02", "d3-12"],
    "two plenaries — one opening, one closing — drawn full width",
  );

  const longTitles = sessions.filter((s) => s.title.length > 100);
  eq(longTitles.length, 1, "exactly one title is long enough to test wrapping");
  ok(longTitles[0].title.length > 130, "and it is genuinely long");

  // An empty column: a room with nothing in it while other rooms are busy.
  const emptyColumnSlots = [];
  for (const day of days) {
    for (const room of rooms) {
      const inRoom = sessions.filter(
        (s) => s.day === day.n && s.roomId === room.id,
      );
      for (const other of sessions.filter(
        (s) => s.day === day.n && s.roomId && s.roomId !== room.id,
      )) {
        const busy = inRoom.some((s) =>
          overlaps(
            toMinutes(s.start),
            toMinutes(s.end),
            toMinutes(other.start),
            toMinutes(other.end),
          ),
        );
        if (!busy) emptyColumnSlots.push(`${day.n}/${room.id}@${other.start}`);
      }
    }
  }
  ok(
    emptyColumnSlots.length > 0,
    "at least one room stands empty while others run",
    "the :has() empty-column state would be unreachable",
  );
  ok(
    emptyColumnSlots.includes("1/yard@11:55"),
    "including the Yard on day one at 11:55, which is the designed one",
  );

  // The three-way collision. This is the state the whole template argues
  // for, so it has to actually be in the data.
  const worst = choosable
    .filter((s) => !isPlenary(s))
    .map((s) => ({ s, n: competingWith(s, sessions).length }))
    .sort((a, b) => b.n - a.n)[0];
  ok(worst.n >= 3, "at least one session runs against three others");
  eq(
    competingWith(byId.get("d2-19"), sessions)
      .map((s) => s.id)
      .sort(),
    ["d2-16", "d2-20", "d2-21"],
    "the designed 14:35 collision on day two is four deep, not three",
  );
  // The workshop is the fourth, and it is the interesting one: it started
  // at 13:40 and runs until 15:10, so it is not in the 14:35 row at all
  // and no list-shaped schedule would ever show it as a conflict. Only
  // drawing time to scale makes it visible. That is the template's whole
  // argument, so it is asserted rather than left to be noticed.
  ok(
    byId.get("d2-16").start < byId.get("d2-19").start,
    "and the fourth is a long session that began in an earlier row",
  );

  // A day that is not the same rectangle as the others.
  const spans = days.map((d) => toMinutes(d.closes) - toMinutes(d.opens));
  ok(
    new Set(spans).size > 1,
    "the days are not all the same length",
    `spans: ${spans.join(", ")}`,
  );
  ok(
    spans[2] < spans[0] && spans[2] < spans[1],
    "and the last day is the short one",
  );

  const soldOutTiers = tiers.filter((t) => t.soldOut);
  eq(soldOutTiers.length, 1, "exactly one ticket tier has gone");
  ok(
    tiers.some((t) => t.highlight),
    "and one tier is the one the eye should land on",
  );

  const panels = sessions.filter((s) => s.kind === "panel");
  ok(panels.length > 0, "there is a panel");
  ok(
    panels.some((p) => p.speakerIds.length >= 3),
    "with three or more people on it, so the multi-speaker layout is real",
  );

  const counts = new Map();
  for (const s of choosable) {
    for (const id of s.speakerIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  ok(
    [...counts.values()].some((n) => n >= 2),
    "at least one speaker appears twice, so the speaker page has a list",
  );
  eq(counts.get("s01"), 2, "Rosalind Achebe has the keynote and the panel");
}

// ── 6. Plans ──────────────────────────────────────────────────────────
section("Plans");

{
  // Two things at once is the case the plan page exists to catch.
  const clashPlan = ["d2-19", "d2-20", "d2-08"];
  const chosen = sessions.filter((s) => clashPlan.includes(s.id));
  const bad = clashingIds(chosen);
  eq(
    [...bad].sort(),
    ["d2-19", "d2-20"],
    "a plan with two 14:35 sessions in it flags exactly those two",
  );
  ok(!bad.has("d2-08"), "and leaves the 11:00 session alone");

  const grouped = planByDay(clashPlan, sessions, [1, 2, 3]);
  eq(grouped.map((g) => g.day), [2], "an all-day-two plan renders one day");
  eq(
    grouped[0].sessions.map((s) => s.id),
    ["d2-08", "d2-19", "d2-20"],
    "in time order",
  );
  eq(planMinutes(grouped[0].sessions), 135, "and totals its real minutes");

  eq(planByDay([], sessions, [1, 2, 3]), [], "an empty plan renders no days");
  eq(
    planByDay(["d3-05"], sessions, [1, 2, 3]),
    [],
    "and a cancelled session cannot be planned",
  );
  eq(
    planByDay(["d2-15"], sessions, [1, 2, 3]),
    [],
    "nor can lunch",
  );

  const clean = planByDay(["d2-08", "d2-12"], sessions, [1, 2, 3]);
  eq(clashingIds(clean[0].sessions).size, 0, "a plan with no overlap is clean");

  // The pair form underneath, checked directly: it is what the room and
  // speaker assertions above are built on, so a bug in it would make
  // those two silently pass.
  eq(
    clashingPairs(chosen).map(([a, b]) => `${a.id}+${b.id}`),
    ["d2-19+d2-20"],
    "the pair form reports the collision once, not twice",
  );
  eq(
    clashingPairs(sessions.filter((s) => ["d1-04", "d2-08"].includes(s.id))),
    [],
    "and sessions on different days never pair",
  );
}

// ── 7. Integrity ──────────────────────────────────────────────────────
section("Integrity");

{
  const ids = sessions.map((s) => s.id);
  eq(ids.length, new Set(ids).size, "session ids are unique");
  const slugs = sessions.map((s) => s.slug);
  eq(slugs.length, new Set(slugs).size, "session slugs are unique");
  const spIds = speakers.map((s) => s.id);
  eq(spIds.length, new Set(spIds).size, "speaker ids are unique");
  const spSlugs = speakers.map((s) => s.slug);
  eq(spSlugs.length, new Set(spSlugs).size, "speaker slugs are unique");

  ok(
    slugs.every((s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)),
    "every slug is url-safe",
  );

  const known = new Set(spIds);
  const dangling = sessions.flatMap((s) =>
    s.speakerIds.filter((id) => !known.has(id)).map((id) => `${s.id}→${id}`),
  );
  eq(dangling, [], "every speaker id on a session resolves to a person");

  const roomIds = new Set(rooms.map((r) => r.id));
  const badRooms = sessions
    .filter((s) => s.roomId !== null && !roomIds.has(s.roomId))
    .map((s) => s.id);
  eq(badRooms, [], "every room id resolves to a room");

  const badDays = sessions.filter((s) => !dayFor.has(s.day)).map((s) => s.id);
  eq(badDays, [], "every session is on a day that exists");

  const badTopics = sessions.flatMap((s) =>
    s.topics.filter((t) => !topics.includes(t)).map((t) => `${s.id}: ${t}`),
  );
  eq(badTopics, [], "every topic is one the filter offers");

  // A speaker nobody scheduled would render an empty page.
  const scheduled = new Set(sessions.flatMap((s) => s.speakerIds));
  const idle = speakers.filter((s) => !scheduled.has(s.id)).map((s) => s.slug);
  eq(idle, [], "every speaker is on the programme at least once");

  const thin = choosable.filter(
    (s) => !s.body || s.body.length < 1 || s.summary.length < 40,
  );
  eq(thin.map((s) => s.id), [], "every real session has a summary and a body");

  const breaks = sessions.filter((s) => s.kind === "break");
  ok(breaks.length >= 8, "there are breaks, so the day has no unexplained holes");
  ok(
    breaks.every((s) => isPlenary(s) && s.speakerIds.length === 0),
    "and every break is plenary with nobody speaking",
  );

  ok(
    sessions.every((s) => !isPlenary(s) || s.kind === "break" || s.kind === "keynote"),
    "only keynotes and breaks take the whole building",
  );
}

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
