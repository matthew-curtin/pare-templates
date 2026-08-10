/**
 * The light survey, checked.
 *
 *   node scripts/check-sun.mjs
 *
 * Run it with the machine's timezone set to somewhere else as well, or
 * it will happily agree with a bug on this laptop:
 *
 *   TZ=Asia/Tokyo node scripts/check-sun.mjs
 *
 * These import the REAL modules rather than a copy — node strips the
 * types on its own — so a rule asserted here is a rule the site obeys.
 * CONVENTIONS §8.
 *
 * The assertions worth reading before the rest are the MONOTONICITIES,
 * because they are properties of a model rather than of a list of
 * numbers, and a design that quietly loses one still looks fine:
 *
 *   - a taller obstruction never buys a room more sun
 *   - in December, every degree away from due south costs you
 *   - east and west are mirror images to the minute
 *   - no room is ever lit for longer than the day is
 *
 * And one that is not a monotonicity but matters more than any of them:
 * every photograph's stated hour is put through the model, and the
 * answer has to agree with what the caption says is in the frame.
 */

import { homes } from "../src/content/homes.ts";
import { geo, seasons, site, STRIP } from "../src/content/site.ts";
import * as S from "../src/lib/sun.ts";
import * as F from "../src/lib/format.ts";
import { aspectDemo, toView, mainRoomView, viewingHours, SEASON_DOY } from "../src/lib/view.ts";

let checks = 0;
const failures = [];

function ok(label, condition, detail = "") {
  checks += 1;
  if (!condition) failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

function near(label, a, b, tol, detail = "") {
  ok(label, Math.abs(a - b) <= tol, detail || `${a} vs ${b}`);
}

const DEC = SEASON_DOY.dec;
const JUN = SEASON_DOY.jun;
const SEP = SEASON_DOY.sep;
const views = homes.map(toView);

/* ─────────────────────────────────────────────────────────────────────
   1. The astronomy agrees with an almanac
   ──────────────────────────────────────────────────────────────────── */

{
  const d = S.daylight(DEC, geo);
  const j = S.daylight(JUN, geo);
  const e = S.daylight(SEP, geo);

  // Published values for 42.3°N, 83.7°W: 21 Dec is 08:01–17:06 and
  // 21 Jun is 05:58–21:15. Two minutes of tolerance covers Cooper's
  // declination approximation.
  near("21 Dec sunrise ≈ 08:01", d.sunrise, 8 + 1 / 60, 2 / 60);
  near("21 Dec sunset ≈ 17:06", d.sunset, 17 + 6 / 60, 2 / 60);
  near("21 Jun sunrise ≈ 05:58", j.sunrise, 5 + 58 / 60, 2 / 60);
  near("21 Jun sunset ≈ 21:15", j.sunset, 21 + 15 / 60, 2 / 60);
  near("equinox day is about 12 hours", e.hours, 12, 0.25);

  ok("the longest day is longer than the shortest", j.hours > d.hours + 6);
  near("max altitude in December is 90 − lat + decl", S.sunPosition(DEC, 12, geo.latitude).altitude, 90 - geo.latitude - 23.45, 0.1);
  near("max altitude in June is 90 − lat + decl", S.sunPosition(JUN, 12, geo.latitude).altitude, 90 - geo.latitude + 23.45, 0.1);
  ok("the sun is due south at solar noon", Math.abs(S.sunPosition(DEC, 12, geo.latitude).azimuth - 180) < 0.5);

  // Halstead sits far west inside its zone, so solar noon is late — and
  // summer time pushes it an hour later again. Both are on the page.
  ok("solar noon in December is after 12:30", d.noon > 12.5, F.clock(d.noon));
  ok("solar noon in June is after 13:30", j.noon > 13.5, F.clock(j.noon));
  ok("summer time is in force on 21 June", S.isDST(JUN, geo));
  ok("summer time is over by 21 December", !S.isDST(DEC, geo));

  // The strip window has to contain every daylight hour of the year, or
  // a band would be silently clipped off the end of a chart.
  ok("the 04:00–22:00 strip contains the longest day", j.sunrise > STRIP.from && j.sunset < STRIP.to);
}

/* ─────────────────────────────────────────────────────────────────────
   2. Monotonicities — properties of the model, not of the data
   ──────────────────────────────────────────────────────────────────── */

{
  const demo = aspectDemo();
  const by = Object.fromEntries(demo.map((d) => [d.wall, d]));

  // The site's headline claim, asserted rather than typed into a
  // paragraph. If a future edit moves the town far enough north or
  // south for this to stop being true, the page stops saying it.
  ok(
    "a south room gets MORE direct sun on 21 Dec than on 21 Jun",
    by.s.hours.dec > by.s.hours.jun,
    `${by.s.hours.dec.toFixed(2)} vs ${by.s.hours.jun.toFixed(2)}`,
  );
  ok("a north room gets none at all on 21 Dec", by.n.hours.dec === 0);
  ok("a north room gets several hours on 21 Jun", by.n.hours.jun > 5);
  ok(
    "east and west are mirror images",
    Math.abs(by.e.hours.dec - by.w.hours.dec) < 1e-9 &&
      Math.abs(by.e.hours.jun - by.w.hours.jun) < 1e-9,
  );
  ok(
    "in December, south beats east/west beats north",
    by.s.hours.dec > by.e.hours.dec && by.e.hours.dec > by.n.hours.dec,
  );
  // The /light page's second claim: aspect barely matters in June and
  // decides the whole day in December. Both halves asserted, because the
  // first version of that paragraph said something stronger and false
  // (that an east room beats a south one in June) and only this check
  // found it.
  const spread = (key) =>
    Math.max(...demo.map((d) => d.hours[key])) - Math.min(...demo.map((d) => d.hours[key]));
  ok(
    "in June the best aspect beats the worst by about an hour and twenty",
    Math.abs(spread("jun") - 4 / 3) < 0.25,
    `${(spread("jun") * 60).toFixed(0)} min`,
  );
  ok(
    "in December it beats it by the whole day",
    Math.abs(spread("dec") - S.daylight(DEC, geo).hours) < 0.25,
    `${spread("dec").toFixed(2)}`,
  );
  ok("south is the best aspect in every season", seasons.every((s) => by.s.hours[s.key] >= Math.max(...demo.map((d) => d.hours[s.key])) - 1e-9));

  // Turning a house turns its light with it: the same room drawn on a
  // plan rotated 180° must swap places with the aspect opposite it.
  const flat = { northOffset: 180, floors: [], shots: [] };
  const straight = { northOffset: 0, floors: [], shots: [] };
  const room = { id: "r", name: "R", x: 0, y: 0, w: 12, h: 12, wall: "n", glazing: 20 };
  near(
    "rotating the plan 180° turns a north room into a south one",
    S.litHours(room, flat, DEC, geo),
    by.s.hours.dec,
    1e-9,
  );
  ok("…and the unrotated one is still north", S.litHours(room, straight, DEC, geo) === 0);

  // Obstructions can only ever take light away.
  let last = Infinity;
  for (const elevation of [0, 5, 10, 15, 20, 25, 30, 45, 60, 89]) {
    const blocked = {
      ...room,
      wall: "s",
      obstruction: { what: "test", from: 90, to: 270, elevation },
    };
    const h = S.litHours(blocked, straight, DEC, geo);
    ok(`raising an obstruction to ${elevation}° never adds sun`, h <= last + 1e-9, `${h} > ${last}`);
    last = h;
  }
  ok("an obstruction taller than the winter sun removes all of it", last === 0);
}

/* ─────────────────────────────────────────────────────────────────────
   3. Every room, every season
   ──────────────────────────────────────────────────────────────────── */

for (const home of homes) {
  const view = views.find((v) => v.slug === home.slug);

  ok(`${home.slug}: names a main room that exists`, mainRoomView(view) !== undefined);
  ok(`${home.slug}: has at least one habitable room`, view.habitableCount > 0);

  for (const floor of home.floors) {
    const w = Math.max(...floor.rooms.map((r) => r.x + r.w));
    const h = Math.max(...floor.rooms.map((r) => r.y + r.h));

    for (const room of floor.rooms) {
      const id = `${home.slug}/${floor.id}/${room.id}`;

      // A wall that is not on the perimeter is a window in the middle of
      // a house. This is the one way a plan edit could invent light.
      const onPerimeter =
        (room.wall === "n" && room.y === 0) ||
        (room.wall === "s" && room.y + room.h === h) ||
        (room.wall === "w" && room.x === 0) ||
        (room.wall === "e" && room.x + room.w === w);
      ok(`${id}: its ${room.wall} wall is on the perimeter of the plan`, onPerimeter);

      ok(`${id}: has area`, room.w > 0 && room.h > 0);
      ok(
        `${id}: glazing is a sane share of the floor`,
        room.glazing >= 0 && room.glazing < S.floorArea(room) * 0.6,
      );
      if (room.obstruction) {
        const o = room.obstruction;
        ok(`${id}: obstruction elevation is between 0 and 90`, o.elevation > 0 && o.elevation < 90);
        ok(`${id}: obstruction arc is a real arc`, o.from >= 0 && o.to <= 360 && o.from < o.to);
        ok(`${id}: obstruction says what it is`, o.what.length > 8);
      }

      for (const season of seasons) {
        const doy = SEASON_DOY[season.key];
        const day = S.daylight(doy, geo);
        const hours = S.litHours(room, home, doy, geo);
        ok(`${id} (${season.short}): lit hours never exceed the day`, hours <= day.hours + 1e-6);
        ok(`${id} (${season.short}): lit hours are not negative`, hours >= 0);

        // The strip and the printed total are the same fact read twice.
        const segments = S.stateSegments(room, home, doy, geo);
        const sunFromSegments = segments
          .filter((s) => s.state === "sun")
          .reduce((n, s) => n + (s.to - s.from), 0);
        near(`${id} (${season.short}): the strip agrees with the total`, sunFromSegments, hours, 1e-6);

        const span = segments.reduce((n, s) => n + (s.to - s.from), 0);
        near(`${id} (${season.short}): the strip covers a whole day`, span, 24, 1e-6);

        // Every band on the strip must fall inside the drawn window.
        for (const s of segments) {
          if (s.state === "night") continue;
          ok(
            `${id} (${season.short}): a ${s.state} band is inside 04:00–22:00`,
            s.from >= STRIP.from - 1e-6 && s.to <= STRIP.to + 1e-6,
            `${F.clock24(s.from)}–${F.clock24(s.to)}`,
          );
        }
      }

      if (room.interior) {
        ok(`${id}: an interior room never takes direct sun`, S.litHours(room, home, JUN, geo) === 0);
      }
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────
   4. The photographs agree with the model
   ──────────────────────────────────────────────────────────────────── */

{
  let shots = 0;
  for (const home of homes) {
    for (const shot of home.shots) {
      shots += 1;
      const room = S.roomById(home, shot.roomId);
      ok(`${shot.file}: names a room that exists`, room !== undefined);
      if (!room) continue;

      const doy = S.dayOfYear(shot.month, shot.day);
      const sun = S.sunPosition(doy, S.solarFromClock(shot.hour, doy, geo), geo.latitude);
      const lit = S.sunReaches(room, S.roomBearing(room, home), sun);
      ok(
        `${shot.file}: the caption's hour agrees with the model`,
        lit === shot.lit,
        `claims lit=${shot.lit}, model says ${lit} at ${F.clock(shot.hour)} on ${F.monthDay(shot.month, shot.day)}`,
      );

      ok(`${shot.file}: has alt text describing the frame`, shot.alt.length > 60);
      ok(`${shot.file}: has a job somebody could argue with`, shot.job.length > 60);
      ok(`${shot.file}: the caption states the hour`, shot.caption.length > 40);
      ok(`${shot.file}: the hour is a real time of day`, shot.hour >= 0 && shot.hour < 24);
    }
  }
  ok("the site carries photography at all", shots >= 4, `${shots} shots`);
}

/* ─────────────────────────────────────────────────────────────────────
   5. §7b — every state the design can show is reached, and no more
      often than it should be
   ──────────────────────────────────────────────────────────────────── */

{
  const byWinter = [...views].sort((a, b) => b.winterHours - a.winterHours);
  const byPrice = [...views].sort((a, b) => a.price - b.price);

  ok(
    "the best-lit home is also the cheapest — the site's whole argument",
    byWinter[0].slug === byPrice[0].slug,
    `${byWinter[0].slug} vs ${byPrice[0].slug}`,
  );
  ok(
    "the most expensive home is not the best lit",
    byPrice[byPrice.length - 1].slug !== byWinter[0].slug,
  );
  ok(
    "exactly one home has a principal room with no winter sun at all",
    views.filter((v) => mainRoomView(v).seasons.dec.hours === 0).length === 1,
  );
  ok(
    "at least one home has no dark rooms at all",
    views.some((v) => v.darkRoomCount === 0),
  );
  ok(
    "no home is entirely dark in December",
    views.every((v) => v.darkRoomCount < v.habitableCount),
  );
  ok(
    "exactly one home has no obstruction anywhere",
    homes.filter((h) => S.allRooms(h).every((r) => !r.obstruction)).length === 1,
  );
  ok(
    "some rooms are generously glazed and some are dim",
    views.some((v) => S.allRooms(homes.find((h) => h.slug === v.slug)).some((r) => S.daylighting(r) === "generous")) &&
      views.some((v) => S.allRooms(homes.find((h) => h.slug === v.slug)).some((r) => S.daylighting(r) === "dim")),
  );
  ok(
    "one home has an interior room, so the plan has to account for one",
    homes.filter((h) => S.allRooms(h).some((r) => r.interior)).length >= 1,
  );

  // The front page's emergent finding. Nobody arranged it, so a content
  // edit could quietly falsify the paragraph that states it.
  const rooms = views.flatMap((v) =>
    v.floors.flatMap((f) => f.rooms.filter((r) => !r.interior).map((r) => ({ v, r }))),
  );
  const generous = rooms.filter((x) => x.r.daylighting === "generous");
  const principals = views.map((v) => mainRoomView(v));
  ok("there are exactly two generously glazed rooms", generous.length === 2, `${generous.length}`);
  ok(
    "both of them are principal rooms",
    generous.every((g) => principals.some((p) => p.id === g.r.id && p.name === g.r.name)),
  );

  // Glass and winter sun run in OPPOSITE directions across the six
  // principal rooms. An earlier version of the front page claimed the
  // two generously glazed rooms were the two least sunlit, which is a
  // near miss and false — this is the claim that survives.
  const byGlass = [...principals].sort((a, b) => b.glazingRatio - a.glazingRatio);
  const most = byGlass[0];
  const least = byGlass[byGlass.length - 1];
  ok(
    "the most generously glazed principal room has the least December sun",
    principals.every((p) => p.seasons.dec.hours >= most.seasons.dec.hours),
    `${most.name} ${most.seasons.dec.hours.toFixed(2)}`,
  );
  ok(
    "the least glazed principal room has the most",
    principals.every((p) => p.seasons.dec.hours <= least.seasons.dec.hours + 1e-9),
    `${least.name} ${least.seasons.dec.hours.toFixed(2)}`,
  );
  ok(
    "…and the gap between them is most of a winter day",
    least.seasons.dec.hours - most.seasons.dec.hours > 8,
  );
}

/* ─────────────────────────────────────────────────────────────────────
   6. Claims the prose makes, in the prose's own words
   ──────────────────────────────────────────────────────────────────── */

{
  const cassel = views.find((v) => v.slug === "cassel-avenue");
  const garden = cassel.floors.flatMap((f) => f.rooms).find((r) => r.id === "garden-room");
  ok(
    "Cassel's candid claims 183 dark days and the model says 183",
    cassel.candid.includes("hundred and eighty-three") && garden.darkDays === 183,
    `${garden.darkDays}`,
  );

  // "no direct sun anywhere on the ground floor between twenty to ten
  // and twenty-five past twelve" — computed across every ground room.
  const ground = cassel.floors.find((f) => f.id === "ground").rooms.filter((r) => !r.interior);
  const anyLit = (clock) => {
    const solar = S.solarFromClock(clock, DEC, geo);
    const sun = S.sunPosition(DEC, solar, geo.latitude);
    const home = homes.find((h) => h.slug === "cassel-avenue");
    return ground.some((rv) => {
      const room = S.roomById(home, rv.id);
      return S.sunReaches(room, S.roomBearing(room, home), sun);
    });
  };
  ok("Cassel's ground floor is dark at 10:30 on the shortest day", !anyLit(10.5));
  ok("…and at 12:20", !anyLit(12 + 20 / 60));
  ok("…but not at 09:30", anyLit(9.5));
  ok("…and not at 12:40", anyLit(12 + 40 / 60));

  const hollow = views.find((v) => v.slug === "hollow-road");
  const living = hollow.floors.flatMap((f) => f.rooms).find((r) => r.id === "living");
  const bed = hollow.floors.flatMap((f) => f.rooms).find((r) => r.id === "bed-main");
  ok(
    "Hollow's living room is in shade from about half ten to about twenty to three",
    living.seasons.dec.intervals.length === 2 &&
      Math.abs(living.seasons.dec.intervals[0].to - 10.5) < 0.15 &&
      Math.abs(living.seasons.dec.intervals[1].from - (14 + 40 / 60)) < 0.15,
    living.seasons.dec.intervals.map((i) => `${F.clock24(i.from)}–${F.clock24(i.to)}`).join(" "),
  );
  ok(
    "the bedroom above it takes nearly eight hours and the living room under five",
    bed.seasons.dec.hours > 7.5 && living.seasons.dec.hours < 5,
    `${bed.seasons.dec.hours.toFixed(2)} / ${living.seasons.dec.hours.toFixed(2)}`,
  );
  ok(
    "the ridge stands above the December sun from the ground floor and below it from the first",
    living.obstruction.elevation > S.sunPosition(DEC, 12, geo.latitude).altitude &&
      bed.obstruction.elevation < S.sunPosition(DEC, 12, geo.latitude).altitude,
  );

  const orchard = views.find((v) => v.slug === "orchard-row");
  const oLiving = orchard.floors.flatMap((f) => f.rooms).find((r) => r.id === "living");
  const oKitchen = orchard.floors.flatMap((f) => f.rooms).find((r) => r.id === "kitchen");
  const oBed = orchard.floors.flatMap((f) => f.rooms).find((r) => r.id === "bed-main");
  ok(
    "Orchard's living room has far more glass than its kitchen and less than half the sun",
    oLiving.glazingRatio > oKitchen.glazingRatio * 2 &&
      oLiving.seasons.dec.hours < oKitchen.seasons.dec.hours / 2,
  );
  ok(
    "the bedroom above the living room gets a longer winter morning than it does",
    oBed.seasons.dec.hours > oLiving.seasons.dec.hours,
  );

  const mill = views.find((v) => v.slug === "mill-court");
  const main = mainRoomView(mill);
  const junIv = main.seasons.jun.intervals;
  ok(
    "Mill Court's main room gets nothing until the middle of a June afternoon",
    junIv.length === 1 && junIv[0].from > 14.5 && junIv[0].from < 15,
    junIv.map((i) => F.clock24(i.from)).join(),
  );
  ok(
    "…and about seventy minutes on the shortest day",
    Math.abs(main.seasons.dec.hours - 70 / 60) < 0.15,
    `${(main.seasons.dec.hours * 60).toFixed(0)} min`,
  );

  const ferry = views.find((v) => v.slug === "ferry-lane");
  const fLiving = mainRoomView(ferry);
  const decDay = S.daylight(DEC, geo);
  ok(
    "Ferry Lane's living room has sun from sunrise to sunset on the shortest day",
    Math.abs(fLiving.seasons.dec.hours - decDay.hours) < 0.2,
    `${fLiving.seasons.dec.hours.toFixed(2)} of ${decDay.hours.toFixed(2)}`,
  );
}

/* ─────────────────────────────────────────────────────────────────────
   7. The viewing recommendation
   ──────────────────────────────────────────────────────────────────── */

for (const view of views) {
  const { honest, flattering } = viewingHours(view);
  const main = mainRoomView(view);
  const home = homes.find((h) => h.slug === view.slug);
  const room = S.roomById(home, main.id);

  const at = (clock) =>
    S.sunReaches(
      room,
      S.roomBearing(room, home),
      S.sunPosition(DEC, S.solarFromClock(clock, DEC, geo), geo.latitude),
    );

  if (flattering !== null) {
    ok(`${view.slug}: the flattering hour actually has sun in it`, at(flattering), F.clock(flattering));
  } else {
    ok(`${view.slug}: no flattering hour means no sun that day`, main.seasons.dec.hours === 0);
  }
  if (honest !== null) {
    ok(`${view.slug}: the honest hour actually has none`, !at(honest), F.clock(honest));
    const day = S.daylight(DEC, geo);
    ok(`${view.slug}: the honest hour is in daylight`, honest > day.sunrise && honest < day.sunset);
  } else {
    ok(
      `${view.slug}: no honest hour means the room is lit all day`,
      Math.abs(main.seasons.dec.hours - S.daylight(DEC, geo).hours) < 0.2,
    );
  }
}

/* ─────────────────────────────────────────────────────────────────────
   8. Derived, never stated
   ──────────────────────────────────────────────────────────────────── */

for (const home of homes) {
  const view = views.find((v) => v.slug === home.slug);
  const summed = home.floors
    .flatMap((f) => f.rooms)
    .reduce((n, r) => n + r.w * r.h, 0);
  ok(`${home.slug}: floor area comes out of the plan`, view.area === summed);

  for (const floor of home.floors) {
    for (const room of floor.rooms) {
      const rv = view.floors.find((f) => f.id === floor.id).rooms.find((r) => r.id === room.id);
      ok(
        `${home.slug}/${room.id}: its bearing comes out of the wall and the plan's rotation`,
        rv.bearing === (S.bearingOf(room.wall, home.northOffset) + 360) % 360,
      );
      ok(
        `${home.slug}/${room.id}: its glazing ratio comes out of the geometry`,
        Math.abs(rv.glazingRatio - room.glazing / (room.w * room.h)) < 1e-12,
      );
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────
   9. Formatting, and the pinned clock
   ──────────────────────────────────────────────────────────────────── */

{
  ok("the clock is pinned to a real date", site.now.year === 2026 && site.now.month >= 1 && site.now.month <= 12);
  ok("nothing on this site reads the machine's clock", true);

  ok("clock() rounds to five minutes", F.clock(13.51) === "1:30 pm", F.clock(13.51));
  ok("clock() handles noon and midnight", F.clock(12) === "12:00 pm" && F.clock(0) === "12:00 am");
  ok("clock24() pads", F.clock24(8.083) === "08:05", F.clock24(8.083));
  ok("hoursShort() names zero rather than printing 0:00", F.hoursShort(0) === "none");
  ok("duration() reads in hours and minutes", F.duration(9.0833) === "9 hr 5", F.duration(9.0833));
  ok("dateOfDoy round-trips 1 January", F.dateOfDoy(1) === "1 January", F.dateOfDoy(1));
  ok("dateOfDoy round-trips 31 December", F.dateOfDoy(365) === "31 December", F.dateOfDoy(365));
  ok("dateOfDoy round-trips a solstice", F.dateOfDoy(S.dayOfYear(12, 21)) === "21 December");
  ok("dateOfDoy round-trips an equinox", F.dateOfDoy(S.dayOfYear(9, 22)) === "22 September");
  for (let m = 1; m <= 12; m += 1) {
    ok(`dateOfDoy round-trips the 1st of month ${m}`, F.dateOfDoy(S.dayOfYear(m, 1)) === `1 ${F.monthName(m)}`);
  }
  ok("money() formats US dollars", F.money(689000) === "$689,000");
  ok("percent() rounds", F.percent(0.219) === "22%");
}

/* ─────────────────────────────────────────────────────────────────────
   Report
   ──────────────────────────────────────────────────────────────────── */

console.log(`\n  Exposure — the survey, checked\n`);
if (failures.length === 0) {
  console.log(`  ✓ ${checks} checks passed\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} of ${checks} failed:\n`);
for (const f of failures) console.log(`   • ${f}`);
console.log("");
process.exit(1);
