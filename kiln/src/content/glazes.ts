import type { Glaze, Member } from "./types";

/**
 * The glaze shelf.
 *
 * Six run in an electric kiln and three do not, and that division is the
 * one decision a member makes that changes how long they wait. Nothing
 * on this list says so — the glaze page works it out by putting the same
 * mug through the same simulation once per glaze.
 */
export const glazes: Glaze[] = [
  {
    id: "bone",
    name: "Bone",
    programId: "stoneware6",
    colour: "A dry chalk white, slightly blue where it pools.",
    behaviour: "Stiff. It will not move, so it keeps every throwing line you left in.",
  },
  {
    id: "sedge",
    name: "Sedge",
    programId: "stoneware6",
    colour: "Grey-green, browner over an edge.",
    behaviour: "Breaks over rims and handles. Flat on a flat surface, which is to say dull on a tile.",
  },
  {
    id: "oatmeal",
    name: "Oatmeal",
    programId: "stoneware6",
    colour: "Warm off-white with iron speckle coming through from the body.",
    behaviour: "Forgiving. The speckle is the clay, not the glaze, so it looks different on porcelain.",
  },
  {
    id: "slate",
    name: "Slate",
    programId: "stoneware6",
    colour: "Blue-black, satin.",
    behaviour: "Wants two coats. One coat goes patchy and there is no fixing it afterwards.",
  },
  {
    id: "honey",
    name: "Honey",
    programId: "stoneware6",
    colour: "Transparent amber, deeper where it is thick.",
    behaviour: "Runs a little. Keep it 5mm clear of the foot.",
  },
  {
    id: "brick",
    name: "Brick",
    programId: "stoneware6",
    colour: "Matt terracotta, close to the colour of the building.",
    behaviour: "Dry to the touch when fired. Not for the inside of anything you drink from.",
  },
  {
    id: "hollow",
    name: "Hollowmere Ash",
    programId: "reduction10",
    colour: "Straw to olive, and never twice the same.",
    behaviour: "Ash glaze. It runs properly — 8mm clear of the foot and a waster slab underneath, or it welds itself to the shelf.",
  },
  {
    id: "celadon",
    name: "Celadon",
    programId: "reduction10",
    colour: "Pale blue-green, transparent, pooling darker in a carved line.",
    behaviour: "The whole point of it is the iron going green, and iron only goes green in reduction. Fired in an electric kiln it comes out a disappointing grey.",
  },
  {
    id: "tenmoku",
    name: "Tenmoku",
    programId: "reduction10",
    colour: "Black, breaking rust-brown on every edge it is thin over.",
    behaviour: "Thick, and it wants to be. Thin tenmoku is just a brown pot.",
  },
];

export const glazeById = new Map(glazes.map((g) => [g.id, g]));

/**
 * The members.
 *
 * Initials rather than portraits, per CONVENTIONS §6: these ten people
 * are invented, and a real person's face over an invented name is a
 * small lie that sits on the page forever.
 */
export const members: Member[] = [
  { id: "ik", name: "Ines Kadri", initials: "IK", since: "2021", shelf: "A3" },
  { id: "rp", name: "Rowan Petrie", initials: "RP", since: "2019", shelf: "A7" },
  { id: "do", name: "Delia Okonkwo", initials: "DO", since: "2023", shelf: "B1" },
  { id: "sw", name: "Sam Wray", initials: "SW", since: "2024", shelf: "B4" },
  { id: "bh", name: "Bea Halloran", initials: "BH", since: "2018", shelf: "B9" },
  { id: "nr", name: "Nikhil Raman", initials: "NR", since: "2022", shelf: "C2" },
  { id: "fm", name: "Fen Marsdale", initials: "FM", since: "2020", shelf: "C5" },
  { id: "ja", name: "Joss Aturi", initials: "JA", since: "2024", shelf: "C8" },
  { id: "mv", name: "Marta Vinke", initials: "MV", since: "2023", shelf: "D2" },
  { id: "cs", name: "Callum Skeet", initials: "CS", since: "2025", shelf: "D6" },
];

export const memberById = new Map(members.map((m) => [m.id, m]));
