import type { PastFiring, Piece } from "./types";

/**
 * Everything on the shelves.
 *
 * Sizes are BOUNDING BOXES in centimetres, which is how a kiln gets
 * loaded — nobody nests a round bowl inside the gap beside a jug, and
 * the tape measure does not care that a pot is a cylinder. A handle
 * counts, which is why a mug is 13cm across and 10cm deep.
 *
 * The set is tuned so that every state the site can show is actually
 * reached (§7b): a firing that will not light for want of a load, a kiln
 * that fills up and turns work away, a pot nothing in the building is
 * tall enough to fire, five pieces waiting on their own maker rather
 * than on the studio, and four still too wet to go anywhere.
 */
export const pieces: Piece[] = [
  // Glazed and waiting for a stoneware firing. The bulk of the studio.
  { id: "p01", name: "Water jug", memberId: "ik", method: "thrown", width: 15, depth: 12, height: 20, state: "glazed", glazeId: "honey", madeOn: 6 },
  { id: "p02", name: "Milk jug", memberId: "rp", method: "thrown", width: 14, depth: 12, height: 19, state: "glazed", glazeId: "sedge", madeOn: 5 },
  { id: "p03", name: "Teapot, second attempt", memberId: "do", method: "thrown", width: 21, depth: 15, height: 17, state: "glazed", glazeId: "slate", madeOn: 4, note: "The first one cracked at the spout join. This one is thicker there and heavier everywhere." },
  { id: "p04", name: "Lidded jar", memberId: "sw", method: "handbuilt", width: 16, depth: 16, height: 16, state: "glazed", glazeId: "oatmeal", madeOn: 7 },
  { id: "p05", name: "Beaker", memberId: "bh", method: "thrown", width: 9, depth: 9, height: 12, state: "glazed", glazeId: "bone", madeOn: 8 },
  { id: "p06", name: "Beaker", memberId: "bh", method: "thrown", width: 9, depth: 9, height: 12, state: "glazed", glazeId: "honey", madeOn: 8 },
  { id: "p07", name: "Mug", memberId: "nr", method: "thrown", width: 13, depth: 10, height: 10, state: "glazed", glazeId: "oatmeal", madeOn: 9 },
  { id: "p08", name: "Mug", memberId: "nr", method: "thrown", width: 13, depth: 10, height: 10, state: "glazed", glazeId: "slate", madeOn: 9 },
  { id: "p09", name: "Mug, no handle", memberId: "ja", method: "thrown", width: 12, depth: 10, height: 10, state: "glazed", glazeId: "bone", madeOn: 10 },
  { id: "p10", name: "Rice bowl", memberId: "mv", method: "thrown", width: 15, depth: 15, height: 8, state: "glazed", glazeId: "sedge", madeOn: 6 },
  { id: "p11", name: "Serving bowl", memberId: "cs", method: "thrown", width: 22, depth: 22, height: 10, state: "glazed", glazeId: "bone", madeOn: 3 },
  { id: "p12", name: "Dinner plate", memberId: "ik", method: "thrown", width: 25, depth: 25, height: 3, state: "glazed", glazeId: "honey", madeOn: 6 },
  { id: "p13", name: "Butter dish, base", memberId: "fm", method: "handbuilt", width: 19, depth: 19, height: 5, state: "glazed", glazeId: "brick", madeOn: 7 },
  { id: "p14", name: "Salad bowl", memberId: "rp", method: "thrown", width: 26, depth: 26, height: 12, state: "glazed", glazeId: "oatmeal", madeOn: 5 },

  // Glazed for reduction, and therefore waiting on Bramble. These four
  // were bisqued on the 9th and missed the Sunday firing by two days,
  // because a bisque comes out on Monday and glazing happens midweek.
  { id: "p15", name: "Chawan", memberId: "bh", method: "thrown", width: 13, depth: 13, height: 9, state: "glazed", glazeId: "tenmoku", madeOn: 2 },
  { id: "p16", name: "Bottle", memberId: "rp", method: "thrown", width: 14, depth: 14, height: 26, state: "glazed", glazeId: "celadon", madeOn: 1 },
  { id: "p17", name: "Vase, carved", memberId: "do", method: "thrown", width: 18, depth: 18, height: 34, state: "glazed", glazeId: "celadon", madeOn: 2, note: "Carved in vertical flutes so the celadon has somewhere to pool. Pointless in an electric kiln, which is the whole reason it is on this shelf and not in Ash." },
  { id: "p18", name: "Fruit bowl", memberId: "nr", method: "thrown", width: 24, depth: 24, height: 11, state: "glazed", glazeId: "hollow", madeOn: 3 },

  // Glazed for stoneware, and too tall for the kiln that fires it soonest.
  { id: "p19", name: "Urn", memberId: "fm", method: "thrown", width: 30, depth: 30, height: 54, state: "glazed", glazeId: "bone", madeOn: 4, note: "Thrown in three sections and joined leather-hard. It goes in Marl or it goes nowhere." },

  // Bisqued, glaze already chosen. Waiting on the glaze bench, not a kiln.
  { id: "p20", name: "Tumbler", memberId: "ja", method: "thrown", width: 9, depth: 9, height: 11, state: "bisqued", glazeId: "honey", madeOn: 11 },
  { id: "p21", name: "Tumbler", memberId: "ja", method: "thrown", width: 9, depth: 9, height: 11, state: "bisqued", glazeId: "honey", madeOn: 11 },
  { id: "p22", name: "Planter", memberId: "cs", method: "handbuilt", width: 28, depth: 28, height: 24, state: "bisqued", glazeId: "brick", madeOn: 9 },

  // Bisqued, no glaze chosen. The studio can do nothing at all with these.
  { id: "p23", name: "Tile panel", memberId: "mv", method: "handbuilt", width: 30, depth: 22, height: 2, state: "bisqued", glazeId: null, madeOn: 8, note: "Marta has been arguing with herself about Sedge or Slate since the 12th." },
  { id: "p24", name: "Small bowl", memberId: "sw", method: "thrown", width: 14, depth: 14, height: 7, state: "bisqued", glazeId: null, madeOn: 10 },
  { id: "p25", name: "Small bowl", memberId: "sw", method: "thrown", width: 14, depth: 14, height: 7, state: "bisqued", glazeId: null, madeOn: 10 },
  { id: "p26", name: "Spoon rest", memberId: "cs", method: "handbuilt", width: 16, depth: 9, height: 3, state: "bisqued", glazeId: null, madeOn: 12 },
  { id: "p27", name: "Bud vase", memberId: "ik", method: "thrown", width: 8, depth: 8, height: 14, state: "bisqued", glazeId: null, madeOn: 12 },

  // Greenware, dry, bound for a stoneware glaze.
  { id: "p28", name: "Casserole", memberId: "bh", method: "thrown", width: 27, depth: 22, height: 18, state: "greenware", glazeId: "sedge", madeOn: 8 },
  { id: "p29", name: "Casserole lid", memberId: "bh", method: "thrown", width: 24, depth: 24, height: 6, state: "greenware", glazeId: "sedge", madeOn: 8, note: "Fired separately and hoped over. A lid that shrinks differently from its pot is a lid that never fits again." },
  { id: "p30", name: "Jug", memberId: "do", method: "thrown", width: 15, depth: 12, height: 22, state: "greenware", glazeId: "slate", madeOn: 9 },
  { id: "p31", name: "Mug", memberId: "nr", method: "thrown", width: 13, depth: 10, height: 10, state: "greenware", glazeId: "oatmeal", madeOn: 10 },
  { id: "p32", name: "Mug", memberId: "nr", method: "thrown", width: 13, depth: 10, height: 10, state: "greenware", glazeId: "oatmeal", madeOn: 10 },
  { id: "p33", name: "Pasta bowl", memberId: "mv", method: "thrown", width: 24, depth: 24, height: 9, state: "greenware", glazeId: "bone", madeOn: 9 },
  { id: "p34", name: "Pasta bowl", memberId: "mv", method: "thrown", width: 24, depth: 24, height: 9, state: "greenware", glazeId: "bone", madeOn: 9 },
  { id: "p35", name: "Colander", memberId: "ja", method: "handbuilt", width: 21, depth: 21, height: 13, state: "greenware", glazeId: "honey", madeOn: 7 },

  // Greenware, dry, bound for reduction. These are what the fortnight's
  // second Bramble is waiting to accumulate.
  { id: "p36", name: "Storage jar", memberId: "rp", method: "thrown", width: 30, depth: 30, height: 40, state: "greenware", glazeId: "hollow", madeOn: 5 },
  { id: "p37", name: "Bottle", memberId: "do", method: "thrown", width: 16, depth: 16, height: 32, state: "greenware", glazeId: "tenmoku", madeOn: 6 },
  { id: "p38", name: "Wide bowl", memberId: "bh", method: "thrown", width: 32, depth: 32, height: 14, state: "greenware", glazeId: "celadon", madeOn: 4 },
  { id: "p39", name: "Vase", memberId: "ik", method: "thrown", width: 20, depth: 20, height: 30, state: "greenware", glazeId: "hollow", madeOn: 7 },

  // Greenware, still wet. Nothing to do with the kilns at all.
  { id: "p40", name: "Serving dish", memberId: "sw", method: "thrown", width: 28, depth: 20, height: 6, state: "greenware", glazeId: "brick", madeOn: 15 },
  { id: "p41", name: "Mug", memberId: "cs", method: "thrown", width: 13, depth: 10, height: 10, state: "greenware", glazeId: "slate", madeOn: 16 },
  { id: "p42", name: "Mug", memberId: "cs", method: "thrown", width: 13, depth: 10, height: 10, state: "greenware", glazeId: "slate", madeOn: 16 },
  { id: "p43", name: "Jar", memberId: "mv", method: "thrown", width: 17, depth: 17, height: 24, state: "greenware", glazeId: "celadon", madeOn: 14 },
  { id: "p49", name: "Casserole", memberId: "do", method: "thrown", width: 30, depth: 30, height: 26, state: "greenware", glazeId: "sedge", madeOn: 16 },
  { id: "p50", name: "Deep bowl", memberId: "ja", method: "thrown", width: 24, depth: 24, height: 16, state: "greenware", glazeId: "honey", madeOn: 17 },
  { id: "p51", name: "Jug", memberId: "sw", method: "thrown", width: 15, depth: 12, height: 24, state: "greenware", glazeId: "sedge", madeOn: 16 },

  // Taller than the inside of anything in the building.
  { id: "p44", name: "Standing form", memberId: "fm", method: "handbuilt", width: 34, depth: 34, height: 88, state: "greenware", glazeId: null, madeOn: 11, note: "Fen knows. The plan is to cut it into three at the coils and fire it as a stack, and the plan has been the plan for eleven days." },

  // Fired, glazed, and gone home. Kept on the books so a member's page
  // has a past as well as a queue.
  { id: "p45", name: "Cake stand", memberId: "ik", method: "thrown", width: 26, depth: 26, height: 12, state: "collected", glazeId: "honey", madeOn: 0 },
  { id: "p46", name: "Yunomi", memberId: "bh", method: "thrown", width: 8, depth: 8, height: 9, state: "collected", glazeId: "tenmoku", madeOn: 0 },
  { id: "p47", name: "Bread crock", memberId: "rp", method: "thrown", width: 24, depth: 24, height: 26, state: "collected", glazeId: "brick", madeOn: 0 },
  { id: "p48", name: "Tea bowl", memberId: "nr", method: "thrown", width: 12, depth: 12, height: 8, state: "collected", glazeId: "celadon", madeOn: 0 },
];

export const pieceById = new Map(pieces.map((p) => [p.id, p]));

/**
 * The last fortnight of firings.
 *
 * `loaded` lists what is still on the books; `total` is what was
 * actually in the kiln. The difference is work that has been taken home,
 * and pretending otherwise would mean either inventing forty finished
 * pots nobody can look at or claiming every firing was half empty.
 *
 * The logs are the controller's own record, sampled hourly: hours from
 * ignition against °C. They are the one place on this site where the
 * numbers are observations rather than derivations.
 */
export const pastFirings: PastFiring[] = [
  {
    id: "f-marl-4",
    kilnId: "marl",
    programId: "bisque",
    day: 4,
    total: 21,
    loaded: ["p15", "p16", "p17", "p18", "p19"],
    log: [[0, 18], [1, 90], [2, 180], [3, 300], [4, 420], [5, 540], [6, 660], [7, 790], [8, 900], [9, 990], [10, 1060]],
  },
  {
    id: "f-bramble-6",
    kilnId: "bramble",
    programId: "reduction10",
    day: 6,
    total: 26,
    loaded: ["p46", "p48"],
    log: [[0, 17], [1, 95], [2, 200], [3, 330], [4, 470], [5, 610], [6, 750], [7, 880], [8, 990], [9, 1040], [10, 1100], [11, 1160], [12, 1215], [13, 1258], [14, 1285]],
    note: "The flat stretch either side of hour nine is body reduction — the damper goes in, the flame comes out of the spyholes, and the kiln more or less stops climbing for an hour and a half.",
  },
  {
    id: "f-ash-10",
    kilnId: "ash",
    programId: "stoneware6",
    day: 10,
    total: 11,
    loaded: ["p45"],
    log: [[0, 19], [1, 110], [2, 230], [3, 360], [4, 500], [5, 640], [6, 780], [7, 910], [8, 1030], [9, 1130], [10, 1195], [11, 1222]],
  },
  {
    id: "f-marl-11",
    kilnId: "marl",
    programId: "bisque",
    day: 11,
    total: 24,
    loaded: ["p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09", "p10", "p11", "p12", "p13", "p14", "p22", "p23"],
    log: [[0, 18], [1, 88], [2, 176], [3, 296], [4, 418], [5, 536], [6, 658], [7, 788], [8, 898], [9, 988], [10, 1060]],
    note: "The fullest bisque of the year so far, and it still only used two thirds of the height.",
  },
  {
    id: "f-ash-14",
    kilnId: "ash",
    programId: "bisque",
    day: 14,
    total: 9,
    loaded: ["p20", "p21", "p24", "p25", "p26", "p27"],
    log: [[0, 18], [1, 92], [2, 184], [3, 305], [4, 424], [5, 545], [6, 664], [7, 795], [8, 902], [9, 992], [10, 1060]],
  },
  {
    id: "f-marl-15",
    kilnId: "marl",
    programId: "stoneware6",
    day: 15,
    total: 19,
    loaded: ["p47"],
    log: [[0, 19], [1, 108], [2, 226], [3, 355], [4, 496], [5, 638], [6, 776], [7, 908], [8, 1028], [9, 1128], [10, 1196], [11, 1222]],
  },
];

export const pastFiringById = new Map(pastFirings.map((f) => [f.id, f]));
