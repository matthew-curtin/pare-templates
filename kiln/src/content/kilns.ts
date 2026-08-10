import type { Kiln, Program } from "./types";

/**
 * Three kilns and three programmes.
 *
 * The rota is written as slots in a FORTNIGHT rather than a week,
 * because Bramble only fires every other Sunday and a weekly rota cannot
 * say that without a second mechanism. A weekly firing is simply two
 * entries, seven apart.
 *
 * `minLoad` is the number this whole studio turns on. It is the fraction
 * of the kiln's interior that has to be spoken for before anybody will
 * light it, and it is different per kiln for one plain reason: the bar
 * is set by what the firing costs. Ash is small and cheap and will go
 * out nearly empty; Bramble burns propane for fourteen hours and will
 * not.
 */

export const programs: Program[] = [
  {
    id: "bisque",
    name: "Bisque",
    cone: "04",
    peak: 1060,
    atmosphere: "oxidation",
    hours: 10,
    coolHours: 14,
    note: "Turns clay into ceramic. It comes out porous and chalky, strong enough to handle and thirsty enough to take glaze.",
  },
  {
    id: "stoneware6",
    name: "Stoneware",
    cone: "6",
    peak: 1222,
    atmosphere: "oxidation",
    hours: 11,
    coolHours: 16,
    note: "The studio's ordinary glaze firing. Vitrified, food-safe, and dependable enough that nobody watches it.",
  },
  {
    id: "reduction10",
    name: "Reduction",
    cone: "10",
    peak: 1285,
    atmosphere: "reduction",
    hours: 14,
    coolHours: 20,
    note: "Gas, starved of air from 1000°C so the flame pulls oxygen out of the glaze instead. It is the only way to get a celadon to go green.",
  },
];

export const kilns: Kiln[] = [
  {
    id: "ash",
    name: "Ash",
    fuel: "electric",
    width: 40,
    depth: 40,
    height: 42,
    shelfThickness: 2,
    clearance: 3,
    minLoad: 0.11,
    energy: { unit: "kWh", perFiring: 24 },
    rota: [
      { day: 0, programId: "bisque" },
      { day: 3, programId: "stoneware6" },
      { day: 7, programId: "bisque" },
      { day: 10, programId: "stoneware6" },
    ],
    note: "A top-loader that came with the building. Small enough to fire twice a week without anybody arguing about it, and shallow enough that nothing over 37cm goes in.",
  },
  {
    id: "marl",
    name: "Marl",
    fuel: "electric",
    width: 58,
    depth: 52,
    height: 86,
    shelfThickness: 2,
    clearance: 3,
    minLoad: 0.15,
    energy: { unit: "kWh", perFiring: 71 },
    rota: [
      { day: 1, programId: "stoneware6" },
      { day: 4, programId: "bisque" },
      { day: 8, programId: "stoneware6" },
      { day: 11, programId: "bisque" },
    ],
    note: "The front-loader, and the tallest chamber in the building. It does the bulk of the bisque because a bisque can be packed tight — nothing is glazed yet, so pieces can touch.",
  },
  {
    id: "bramble",
    name: "Bramble",
    fuel: "gas",
    width: 66,
    depth: 66,
    height: 78,
    shelfThickness: 2,
    clearance: 3,
    minLoad: 0.2,
    energy: { unit: "kg", perFiring: 34 },
    rota: [{ day: 6, programId: "reduction10" }],
    // "Three times as long" is a claim about the model rather than a
    // sentence somebody liked, and check-load.mjs asserts it. The first
    // version of this line said "a fortnight against four days", written
    // before the simulation had ever been run; the real answer turned
    // out to be eighteen days against six (§8).
    note: "Propane, in the yard, under a lean-to. Every other Sunday, fourteen hours, and somebody has to be there for all of them. It is the reason a celadon takes three times as long as a white glaze.",
  },
];

export const kilnById = new Map(kilns.map((k) => [k.id, k]));
export const programById = new Map(programs.map((p) => [p.id, p]));
