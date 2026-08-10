import type { Home, Obstruction, Room, Shot } from "../content/types";
import { geo, seasons, type SeasonKey } from "../content/site.ts";
import {
  compassOf,
  darkRooms,
  darkSeason,
  daylight,
  daylighting,
  dayOfYear,
  floorArea,
  glazingRatio,
  habitableRooms,
  homeArea,
  litIntervals,
  hoursOf,
  mainRoom,
  planBounds,
  roomBearing,
  stateSegments,
  sunArc,
  type Daylighting,
  type Interval,
  type Segment,
} from "./sun.ts";

/**
 * Everything the pages need, computed once on the server.
 *
 * The season control switches between three PRECOMPUTED answers rather
 * than recomputing in the browser, which keeps the sun model on the
 * server, keeps the client bundle small, and — the part that matters for
 * a template — means every number is in the delivered HTML where a
 * search engine and the repo's route sweep can both see it.
 */

export type SeasonData = {
  hours: number;
  intervals: Interval[];
  segments: Segment[];
};

export type RoomView = {
  id: string;
  name: string;
  floorId: string;
  floorName: string;
  x: number;
  y: number;
  w: number;
  h: number;
  interior: boolean;
  bearing: number;
  compass: string;
  area: number;
  glazing: number;
  glazingRatio: number;
  daylighting: Daylighting;
  note: string | null;
  obstruction: Obstruction | null;
  seasons: Record<SeasonKey, SeasonData>;
  darkDays: number;
  firstLit: number | null;
  lastLit: number | null;
  shot: Shot | null;
};

export type FloorView = {
  id: string;
  name: string;
  w: number;
  h: number;
  rooms: RoomView[];
};

export type HomeView = {
  slug: string;
  address: string;
  kind: string;
  price: number;
  built: number;
  beds: number;
  baths: number;
  listedDaysAgo: number;
  northOffset: number;
  blurb: string;
  candid: string;
  works: string[];
  area: number;
  floors: FloorView[];
  mainRoomId: string;
  /** Hours of direct sun on the shortest day, averaged over the floor
   *  area of the habitable rooms. The column the list sorts by, and the
   *  column the list shows — §7b, the hard way round. */
  winterHours: number;
  summerHours: number;
  darkRoomCount: number;
  habitableCount: number;
};

export const SEASON_DOY: Record<SeasonKey, number> = {
  jun: dayOfYear(6, 21),
  sep: dayOfYear(9, 22),
  dec: dayOfYear(12, 21),
};

export function seasonMeta(key: SeasonKey) {
  const s = seasons.find((x) => x.key === key);
  if (!s) throw new Error(`no season ${key}`);
  return s;
}

/** Sunrise, sunset, length and the compass arc, per season. Shared by
 *  every dial and every strip on the site. */
export function dayFacts(key: SeasonKey) {
  const doy = SEASON_DOY[key];
  const d = daylight(doy, geo);
  const arc = sunArc(doy, geo);
  return { doy, ...d, arc };
}

function roomView(room: Room, home: Home, floorId: string, floorName: string): RoomView {
  const bearing = roomBearing(room, home);
  const season = darkSeason(room, home, geo);
  const seasonData = {} as Record<SeasonKey, SeasonData>;
  for (const s of seasons) {
    const intervals = litIntervals(room, home, SEASON_DOY[s.key], geo);
    seasonData[s.key] = {
      hours: hoursOf(intervals),
      intervals,
      segments: stateSegments(room, home, SEASON_DOY[s.key], geo),
    };
  }
  return {
    id: room.id,
    name: room.name,
    floorId,
    floorName,
    x: room.x,
    y: room.y,
    w: room.w,
    h: room.h,
    interior: room.interior === true,
    bearing,
    compass: compassOf(bearing),
    area: floorArea(room),
    glazing: room.glazing,
    glazingRatio: glazingRatio(room),
    daylighting: daylighting(room),
    note: room.note ?? null,
    obstruction: room.obstruction ?? null,
    seasons: seasonData,
    darkDays: season.darkDays,
    firstLit: season.first,
    lastLit: season.last,
    shot: home.shots.find((s) => s.roomId === room.id) ?? null,
  };
}

/** Area-weighted mean hours of direct sun across the habitable rooms. */
function weightedHours(home: Home, key: SeasonKey): number {
  const rooms = habitableRooms(home);
  const total = rooms.reduce((n, r) => n + floorArea(r), 0);
  if (total === 0) return 0;
  const sum = rooms.reduce(
    (n, r) => n + floorArea(r) * hoursOf(litIntervals(r, home, SEASON_DOY[key], geo)),
    0,
  );
  return sum / total;
}

export function toView(home: Home): HomeView {
  return {
    slug: home.slug,
    address: home.address,
    kind: home.kind,
    price: home.price,
    built: home.built,
    beds: home.beds,
    baths: home.baths,
    listedDaysAgo: home.listedDaysAgo,
    northOffset: home.northOffset,
    blurb: home.blurb,
    candid: home.candid,
    works: home.works,
    area: homeArea(home),
    mainRoomId: home.mainRoomId,
    floors: home.floors.map((f) => ({
      id: f.id,
      name: f.name,
      ...planBounds(f),
      rooms: f.rooms.map((r) => roomView(r, home, f.id, f.name)),
    })),
    winterHours: weightedHours(home, "dec"),
    summerHours: weightedHours(home, "jun"),
    darkRoomCount: darkRooms(home, SEASON_DOY.dec, geo).length,
    habitableCount: habitableRooms(home).length,
  };
}

/**
 * Four identical rooms, one facing each way, nothing in front of any of
 * them — computed rather than asserted, because it is the site's whole
 * claim and the two surprising numbers in it are the reason the claim is
 * worth making. A south room takes MORE direct sun on the shortest day
 * of the year than on the longest, because in June the sun rises and
 * sets behind it. A north room takes most of a working day in June and
 * nothing at all in December.
 *
 * If somebody moves the town, these numbers move with it and the
 * paragraph beside them stays true.
 */
export function aspectDemo() {
  const walls = [
    { wall: "n" as const, name: "North" },
    { wall: "e" as const, name: "East" },
    { wall: "s" as const, name: "South" },
    { wall: "w" as const, name: "West" },
  ];
  const home = {
    slug: "demo",
    northOffset: 0,
    floors: [],
    shots: [],
  } as unknown as Home;

  return walls.map(({ wall, name }) => {
    const room: Room = {
      id: wall,
      name,
      x: 0,
      y: 0,
      w: 14,
      h: 14,
      wall,
      glazing: 28,
    };
    const hours = {} as Record<SeasonKey, number>;
    for (const s of seasons) {
      hours[s.key] = hoursOf(litIntervals(room, home, SEASON_DOY[s.key], geo));
    }
    return { wall, name, bearing: roomBearing(room, home), hours };
  });
}

/**
 * The two hours a house can be viewed at, and the reason the viewings
 * page defaults to the wrong one.
 *
 * `flattering` is the middle of the longest stretch of direct sun in the
 * principal room on the shortest day — the hour an agent books. `honest`
 * is the middle of the longest stretch of daylight with no sun in it,
 * which is the hour you would find out something. A room that has sun
 * all day has no honest hour and gets null, which is a good answer.
 */
export function viewingHours(view: HomeView): {
  flattering: number | null;
  honest: number | null;
} {
  const main = mainRoomView(view);
  const day = dayFacts("dec");
  const longest = (segs: { from: number; to: number }[]) =>
    segs.length === 0
      ? null
      : segs.reduce((a, b) => (b.to - b.from > a.to - a.from ? b : a));

  const lit = longest(main.seasons.dec.intervals);
  const dark = longest(
    main.seasons.dec.segments.filter(
      (s) => s.state !== "sun" && s.state !== "night" && s.to > day.sunrise && s.from < day.sunset,
    ),
  );
  const mid = (i: { from: number; to: number } | null) =>
    i === null ? null : (i.from + i.to) / 2;
  return { flattering: mid(lit), honest: mid(dark) };
}

export function allRoomViews(view: HomeView): RoomView[] {
  return view.floors.flatMap((f) => f.rooms);
}

export function mainRoomView(view: HomeView): RoomView {
  const r = allRoomViews(view).find((x) => x.id === view.mainRoomId);
  if (!r) throw new Error(`${view.slug} names no main room`);
  return r;
}

export { mainRoom };
