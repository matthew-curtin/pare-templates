import type { Floor, Home, Room, Wall } from "../content/types";

/**
 * Where the sun is, and which rooms it reaches.
 *
 * This module has no runtime imports and reads no content of its own —
 * every function takes the site, the home or the room as an argument.
 * That is what lets `scripts/check-sun.mjs` import the REAL functions
 * rather than a copy that drifts away from them, which is the only way
 * an assertion there is also a property of the site. CONVENTIONS §8.
 *
 * The astronomy is the standard textbook set: Cooper's declination, the
 * hour-angle form of solar altitude and azimuth, and the equation of
 * time. It is accurate to a few minutes, which is far inside the honesty
 * of the rest of the model — a tree is not a shape and a window is not a
 * plane. `/light` says all of that on the page rather than hiding it.
 *
 * Two conventions run through it. Angles are degrees, bearings are true
 * and measured clockwise from north, and hours are decimal. And nothing
 * states a number that can be derived from another one: floor areas come
 * out of the plan, compass bearings come out of the plan's rotation, and
 * a home's size comes out of its rooms — so the drawing and the figure
 * printed beside it cannot disagree.
 */

const DEG = Math.PI / 180;
const sin = (d: number) => Math.sin(d * DEG);
const cos = (d: number) => Math.cos(d * DEG);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * A window is a plane, so the beam reaches it while the sun is anywhere
 * in the 180° in front of the glass. Right at the limit that light is
 * grazing the pane and worth very little, which the model does not
 * pretend otherwise about — it counts hours, and hours near the edge are
 * thin ones. Said plainly on `/light`.
 */
export const ACCEPTANCE = 90;

/** Two minutes. Fine enough that a printed time is honest to the nearest
 *  five, coarse enough that a whole fleet of homes resolves instantly. */
export const STEP_MINUTES = 2;

/**
 * Sunrise is not the moment the sun's centre crosses the horizon: the
 * atmosphere bends the light, so it is already up when it looks like it
 * is arriving, and the almanac counts the upper limb rather than the
 * middle. Together that is 50 arcminutes and about four minutes at each
 * end of the day.
 *
 * It is applied to sunrise and sunset ONLY, and deliberately not to
 * whether a beam is reaching a room — light arriving at a tenth of a
 * degree above the horizon has crossed forty times the atmosphere and is
 * stopped by anything at all, which is what obstructions are for.
 */
export const HORIZON = -0.833;

export type SiteGeo = {
  latitude: number;
  /** Degrees east; negative in the Americas. */
  longitude: number;
  /** Standard-time meridian, degrees east. */
  meridian: number;
  /** Meridian while summer time is in force. */
  dstMeridian: number;
  /** Day of year summer time starts, and the day it ends. */
  dstFrom: number;
  dstTo: number;
};

export type Sun = { altitude: number; azimuth: number };
export type Interval = { from: number; to: number };

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function dayOfYear(month: number, day: number): number {
  let n = day;
  for (let m = 0; m < month - 1; m += 1) n += MONTH_DAYS[m];
  return n;
}

/** Cooper's approximation, ±0.5°. */
export function declination(doy: number): number {
  return 23.45 * sin((360 * (284 + doy)) / 365);
}

/** Minutes the sun runs ahead of the clock, from the earth's tilt and
 *  the eccentricity of its orbit. Worth up to a quarter of an hour, and
 *  the reason solar noon wanders through the year. */
export function equationOfTime(doy: number): number {
  const b = (360 * (doy - 81)) / 365;
  return 9.87 * sin(2 * b) - 7.53 * cos(b) - 1.5 * sin(b);
}

export function isDST(doy: number, geo: SiteGeo): boolean {
  return doy >= geo.dstFrom && doy < geo.dstTo;
}

/**
 * Minutes to add to the clock to get solar time.
 *
 * This is the part every "south-facing" claim quietly ignores. A house
 * on the western edge of a time zone runs well behind its clock, and
 * summer time adds a whole hour on top — so the sun is due south at
 * about twenty-five past one in June here, not at noon.
 */
export function timeCorrection(doy: number, geo: SiteGeo): number {
  const meridian = isDST(doy, geo) ? geo.dstMeridian : geo.meridian;
  return 4 * (geo.longitude - meridian) + equationOfTime(doy);
}

export function solarFromClock(clock: number, doy: number, geo: SiteGeo): number {
  return clock + timeCorrection(doy, geo) / 60;
}

export function clockFromSolar(solar: number, doy: number, geo: SiteGeo): number {
  return solar - timeCorrection(doy, geo) / 60;
}

/** Altitude above the horizon and true bearing, at a solar hour. */
export function sunPosition(doy: number, solarHour: number, latitude: number): Sun {
  const d = declination(doy);
  const hourAngle = 15 * (solarHour - 12);
  const sinAlt = clamp(
    sin(latitude) * sin(d) + cos(latitude) * cos(d) * cos(hourAngle),
    -1,
    1,
  );
  const altitude = Math.asin(sinAlt) / DEG;

  const cosAz = clamp(
    (sin(d) - sinAlt * sin(latitude)) / (Math.cos(altitude * DEG) * cos(latitude)),
    -1,
    1,
  );
  const az = Math.acos(cosAz) / DEG;
  return { altitude, azimuth: hourAngle > 0 ? 360 - az : az };
}

/** Sunrise, sunset and solar noon, in CLOCK hours — because that is the
 *  clock the reader lives by, and the gap between the two is the point. */
export function daylight(
  doy: number,
  geo: SiteGeo,
): { sunrise: number; sunset: number; hours: number; noon: number } {
  const d = declination(doy);
  const cosH = clamp(
    (sin(HORIZON) - sin(geo.latitude) * sin(d)) / (cos(geo.latitude) * cos(d)),
    -1,
    1,
  );
  const h = Math.acos(cosH) / DEG / 15;
  return {
    sunrise: clockFromSolar(12 - h, doy, geo),
    sunset: clockFromSolar(12 + h, doy, geo),
    hours: 2 * h,
    noon: clockFromSolar(12, doy, geo),
  };
}

/** Where on the compass the sun comes up and goes down that day. The
 *  two numbers the dial is drawn from — and the reason a north window
 *  gets a June morning and no December at all. */
export function sunArc(doy: number, geo: SiteGeo): { from: number; to: number } {
  const d = daylight(doy, geo);
  const at = (clock: number) =>
    sunPosition(doy, solarFromClock(clock, doy, geo), geo.latitude).azimuth;
  return { from: at(d.sunrise + 0.03), to: at(d.sunset - 0.03) };
}

export function sunAtClock(doy: number, clock: number, geo: SiteGeo): Sun {
  return sunPosition(doy, solarFromClock(clock, doy, geo), geo.latitude);
}

const WALL_ANGLE: Record<Wall, number> = { n: 0, e: 90, s: 180, w: 270 };

/** The plan is drawn with its own "up". This is where that wall actually
 *  points once the house is put back on its street. */
export function bearingOf(wall: Wall, northOffset: number): number {
  return (WALL_ANGLE[wall] + northOffset + 360) % 360;
}

export function roomBearing(room: Room, home: Home): number {
  return bearingOf(room.wall, home.northOffset);
}

/** Shortest angle between two bearings, 0–180. */
export function angleBetween(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
}

/** Whether a bearing falls inside an arc that may wrap through north. */
export function arcContains(from: number, to: number, bearing: number): boolean {
  const norm = (v: number) => ((v % 360) + 360) % 360;
  const f = norm(from);
  const t = norm(to);
  const b = norm(bearing);
  return f <= t ? b >= f && b <= t : b >= f || b <= t;
}

/** Does the beam reach this glass, at this instant? */
export function sunReaches(room: Room, bearing: number, sun: Sun): boolean {
  if (room.interior) return false;
  if (sun.altitude <= 0) return false;
  if (angleBetween(sun.azimuth, bearing) >= ACCEPTANCE) return false;
  const o = room.obstruction;
  if (o && arcContains(o.from, o.to, sun.azimuth) && sun.altitude <= o.elevation) {
    return false;
  }
  return true;
}

/**
 * Every stretch of direct sun the room gets that day, in clock hours.
 *
 * Intervals rather than a total, because a room that takes three hours
 * in one go and a room that takes twenty minutes six times are not the
 * same room, and only one of them is somewhere to sit.
 */
export function litIntervals(
  room: Room,
  home: Home,
  doy: number,
  geo: SiteGeo,
): Interval[] {
  const bearing = roomBearing(room, home);
  const step = STEP_MINUTES / 60;
  const out: Interval[] = [];
  let open: number | null = null;

  for (let solar = 0; solar <= 24; solar += step) {
    const lit = sunReaches(room, bearing, sunPosition(doy, solar, geo.latitude));
    if (lit && open === null) open = solar;
    if (!lit && open !== null) {
      out.push({
        from: clockFromSolar(open, doy, geo),
        to: clockFromSolar(solar, doy, geo),
      });
      open = null;
    }
  }
  if (open !== null) {
    out.push({ from: clockFromSolar(open, doy, geo), to: clockFromSolar(24, doy, geo) });
  }
  return out;
}

export function hoursOf(intervals: Interval[]): number {
  return intervals.reduce((n, i) => n + (i.to - i.from), 0);
}

/**
 * The four states the light in a room can be in, across a whole day.
 *
 * This is what every strip on the site is drawn from, and the reason the
 * legend has four entries rather than two: "no direct sun" is three
 * different situations, and they are not interchangeable. A room in
 * `sky` is behind the house and will be bright and even; a room in
 * `shade` has the sun in front of it and a gable in the way, and could
 * be fixed by a chainsaw or a planning objection.
 */
export type LightState = "sun" | "sky" | "shade" | "night";
export type Segment = { from: number; to: number; state: LightState };

function stateAt(room: Room, bearing: number, sun: Sun): LightState {
  if (sun.altitude <= 0) return "night";
  if (angleBetween(sun.azimuth, bearing) >= ACCEPTANCE) return "sky";
  const o = room.obstruction;
  if (o && arcContains(o.from, o.to, sun.azimuth) && sun.altitude <= o.elevation) {
    return "shade";
  }
  return "sun";
}

export function stateSegments(
  room: Room,
  home: Home,
  doy: number,
  geo: SiteGeo,
): Segment[] {
  const bearing = roomBearing(room, home);
  const step = STEP_MINUTES / 60;
  const out: Segment[] = [];
  let open: LightState | null = null;
  let start = 0;

  for (let solar = 0; solar <= 24 + step / 2; solar += step) {
    const s = room.interior
      ? "night"
      : stateAt(room, bearing, sunPosition(doy, solar, geo.latitude));
    if (s !== open) {
      if (open !== null) {
        out.push({
          from: clockFromSolar(start, doy, geo),
          to: clockFromSolar(solar, doy, geo),
          state: open,
        });
      }
      open = s;
      start = solar;
    }
  }
  if (open !== null) {
    out.push({
      from: clockFromSolar(start, doy, geo),
      to: clockFromSolar(24, doy, geo),
      state: open,
    });
  }
  return out;
}

export function litHours(room: Room, home: Home, doy: number, geo: SiteGeo): number {
  return hoursOf(litIntervals(room, home, doy, geo));
}

export function floorArea(room: Room): number {
  return room.w * room.h;
}

/** Glass as a share of floor. The rule of thumb architects actually use:
 *  a fifth reads as generously glazed, under an eighth reads as dim, and
 *  it is the only thing that speaks for a room the sun never enters. */
export function glazingRatio(room: Room): number {
  return room.glazing / floorArea(room);
}

export type Daylighting = "generous" | "adequate" | "dim";

export function daylighting(room: Room): Daylighting {
  const r = glazingRatio(room);
  if (r >= 0.2) return "generous";
  if (r >= 0.12) return "adequate";
  return "dim";
}

export function allRooms(home: Home): Room[] {
  return home.floors.flatMap((f) => f.rooms);
}

/** Rooms a person spends time in — the ones a light survey is about.
 *  A windowless closet dragging the average down would be a number that
 *  is true and says nothing. */
export function habitableRooms(home: Home): Room[] {
  return allRooms(home).filter((r) => !r.interior);
}

export function homeArea(home: Home): number {
  return allRooms(home).reduce((n, r) => n + floorArea(r), 0);
}

export function planBounds(floor: Floor): { w: number; h: number } {
  return {
    w: Math.max(...floor.rooms.map((r) => r.x + r.w)),
    h: Math.max(...floor.rooms.map((r) => r.y + r.h)),
  };
}

export function roomById(home: Home, id: string): Room | undefined {
  return allRooms(home).find((r) => r.id === id);
}

export function mainRoom(home: Home): Room {
  const r = roomById(home, home.mainRoomId);
  if (!r) throw new Error(`${home.slug} names no main room`);
  return r;
}

/**
 * The headline: how much of the house the sun reaches on the day it
 * reaches least.
 *
 * Weighted by FLOOR AREA rather than counted by room, and that is the
 * whole design of the number. Cassel Avenue has six small rooms the sun
 * reaches and one enormous one it does not — counted by room it scores
 * better than anything on the books, which would be a true figure
 * answering a question nobody asked. Weighted by area it says what a
 * person standing in the house would say.
 */
export function winterShare(home: Home, doy: number, geo: SiteGeo): number {
  const rooms = habitableRooms(home);
  const total = rooms.reduce((n, r) => n + floorArea(r), 0);
  if (total === 0) return 0;
  const lit = rooms
    .filter((r) => litHours(r, home, doy, geo) > 0)
    .reduce((n, r) => n + floorArea(r), 0);
  return lit / total;
}

/** Ten minutes. A year is scanned a day at a time to find the edges of a
 *  room's dark season, and the answer wanted is a DATE — so the sampling
 *  only has to be fine enough not to miss a short winter appearance. */
export const DAY_SCAN_STEP = 10;

/**
 * The first and last day of the year the room takes any direct sun, and
 * how many days it takes none.
 *
 * This is the number that turns an aspect into something a person can
 * picture: not "north-facing" but "no direct sun from 3 October to 9
 * March". It is a scan rather than a formula because an obstruction can
 * carve the year up in ways a closed form will not describe.
 */
export function darkSeason(
  room: Room,
  home: Home,
  geo: SiteGeo,
): { first: number | null; last: number | null; darkDays: number } {
  const bearing = roomBearing(room, home);
  const step = DAY_SCAN_STEP / 60;
  const litDays: number[] = [];

  for (let doy = 1; doy <= 365; doy += 1) {
    for (let solar = 3; solar <= 22; solar += step) {
      if (sunReaches(room, bearing, sunPosition(doy, solar, geo.latitude))) {
        litDays.push(doy);
        break;
      }
    }
  }
  if (litDays.length === 0) return { first: null, last: null, darkDays: 365 };
  return {
    first: litDays[0],
    last: litDays[litDays.length - 1],
    darkDays: 365 - litDays.length,
  };
}

/** Room-hours: every habitable room's direct sun, added up. The tiebreak
 *  under `winterShare`, and the number that separates a house where four
 *  rooms get twenty minutes from one where four rooms get all afternoon. */
export function roomHours(home: Home, doy: number, geo: SiteGeo): number {
  return habitableRooms(home).reduce((n, r) => n + litHours(r, home, doy, geo), 0);
}

export function darkRooms(home: Home, doy: number, geo: SiteGeo): Room[] {
  return habitableRooms(home).filter((r) => litHours(r, home, doy, geo) === 0);
}

export const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

export function compassOf(bearing: number): (typeof COMPASS)[number] {
  return COMPASS[Math.round((((bearing % 360) + 360) % 360) / 45) % 8];
}
