import type { Leg, Shelter } from "./types";

/**
 * The route, as data. CONVENTIONS §3 and §7b.
 *
 * Two things about the numbers here are worth knowing before editing
 * them.
 *
 * FIRST, ascent and descent are not in this file. They are derived from
 * `profile` in `src/lib/route.ts`, so the shape drawn in the rail and
 * the climb quoted beside it are the same fact read twice. The version
 * that stated both got them out of step within an afternoon.
 *
 * SECOND, the set is tuned so every state the design can draw is
 * reachable, and roughly as often as it should be:
 *
 *   - The Ninebark flats is 14.6 miles, loses 1,190 feet, and is the
 *     longest DAY on the route at over eleven hours. It is the whole
 *     argument of the site in one row, and it is why the planner cannot
 *     offer anybody a route where no day is long.
 *   - Coldwater riverside is 2h50 — so the fastest and slowest legs
 *     differ by a factor of four, and a card showing hours reads
 *     differently from a card showing miles.
 *   - Two legs are dry and nine are not, so the water warning means
 *     something when it appears.
 *   - Four legs have no escape route at all. Marked absent rather than
 *     omitted, because "there is no way off this" is information.
 *   - Long Sedge has no bunks, which is the tent-platform state the
 *     `:has([data-bunks="0"])` rule in globals.css exists for.
 *   - Two shelters have seasonal water and one has none at all, which
 *     with the clock pinned to mid-August is a live problem rather than
 *     a theoretical one.
 */

export const shelters: Shelter[] = [
  {
    id: "kettleback",
    slug: "kettleback-landing",
    name: "Kettleback Landing",
    kind: "trailhead",
    elevation: 1180,
    bunks: 0,
    water: "reliable",
    booking: "first-come",
    note: "Gravel turning circle, a gate, and a board with the season's closures on it. The last place with a phone signal until Coldwater.",
  },
  {
    id: "pike-hollow",
    slug: "pike-hollow-hut",
    name: "Pike Hollow Hut",
    kind: "staffed",
    elevation: 2340,
    bunks: 18,
    water: "reliable",
    booking: "required",
    note: "Warden through the season. Two rooms and a drying rack that works, which matters more here than it sounds.",
  },
  {
    id: "slatefall",
    slug: "slatefall-hut",
    name: "Slatefall Hut",
    kind: "staffed",
    elevation: 3720,
    bunks: 16,
    water: "seasonal",
    booking: "required",
    note: "The spring behind the hut has failed in three of the last eight Augusts. The warden carries up from the fall when it does, and asks that you fill at the crossing an hour below.",
  },
  {
    id: "cairnwell",
    slug: "cairnwell-hut",
    name: "Cairnwell Hut",
    kind: "open",
    elevation: 4910,
    bunks: 8,
    water: "none",
    booking: "first-come",
    note: "A stone box on the shoulder with a door that has to be barred from inside. No water of any kind — the last is the outflow forty minutes below, and everyone who arrives thirsty arrives having read this.",
  },
  {
    id: "cistern",
    slug: "the-cistern",
    name: "The Cistern",
    kind: "open",
    elevation: 4240,
    bunks: 10,
    water: "cistern",
    booking: "first-come",
    note: "Named for the tank, which is the only reason a shelter stands here. Two thousand gallons off a roof, shared by everyone on the ridge, and it is the first thing to check when you arrive rather than the last.",
  },
  {
    id: "ninebark",
    slug: "ninebark-hut",
    name: "Ninebark Hut",
    kind: "staffed",
    elevation: 3050,
    bunks: 22,
    water: "reliable",
    booking: "required",
    note: "The biggest hut on the route and the one everybody reaches late. The warden holds supper back an hour in August for exactly that reason.",
  },
  {
    id: "coldwater",
    slug: "coldwater-hut",
    name: "Coldwater Hut",
    kind: "staffed",
    elevation: 2880,
    bunks: 20,
    water: "reliable",
    booking: "required",
    note: "Road access for supplies, so this is where a resupply box can be posted ahead. Also where most people who quit, quit.",
  },
  {
    id: "ember-notch",
    slug: "ember-notch-hut",
    name: "Ember Notch Hut",
    kind: "open",
    elevation: 4470,
    bunks: 6,
    water: "seasonal",
    booking: "first-come",
    note: "Six bunks and no warden, at the top of the longest climb on the traverse. It fills, and there is nowhere else, which is the single strongest argument for walking this route in the direction everybody else does not.",
  },
  {
    id: "long-sedge",
    slug: "long-sedge-platforms",
    name: "Long Sedge Platforms",
    kind: "tent",
    elevation: 3610,
    bunks: 0,
    water: "reliable",
    booking: "required",
    note: "Eight wooden platforms and a roof over the cooking area, put in because the ground here will not drain and forty years of tents were killing it. Bring a shelter; there is nothing to sleep under.",
  },
  {
    id: "rimeplace",
    slug: "rimeplace-hut",
    name: "Rimeplace Hut",
    kind: "open",
    elevation: 5120,
    bunks: 12,
    water: "cistern",
    booking: "first-come",
    note: "The highest building on the range and the coldest night on the route by a wide margin. The tank freezes solid by the second week of October, which is what actually closes the season.",
  },
  {
    id: "fallowdyke",
    slug: "fallowdyke-hut",
    name: "Fallowdyke Hut",
    kind: "staffed",
    elevation: 2760,
    bunks: 24,
    water: "reliable",
    booking: "required",
    note: "Below the tree line again, warm, and with a warden who will drive you out in the morning if the last leg has stopped appealing.",
  },
  {
    id: "sable-gate",
    slug: "sable-gate",
    name: "Sable Gate",
    kind: "trailhead",
    elevation: 1040,
    bunks: 0,
    water: "none",
    booking: "first-come",
    note: "A cattle grid, a lay-by for nine cars, and the shuttle stop. Nothing else, and no shelter if the shuttle has gone.",
  },
];

export const legs: Leg[] = [
  {
    id: "l1",
    slug: "into-the-hollow",
    from: "kettleback",
    to: "pike-hollow",
    name: "Into the Hollow",
    distance: 11.4,
    terrain: { trail: 8.6, rough: 2.8, talus: 0, bog: 0 },
    profile: [1180, 1420, 1350, 1660, 1540, 1830, 1750, 2040, 1920, 2180, 2080, 2340],
    dry: false,
    escape: "Forest road at mile 6.2, then three miles down to the county road.",
    summary:
      "Graded trail the whole way, under trees, gaining height in a series of steps with a rest between each.",
    detail: [
      "The easiest leg on the traverse and the one people most often ruin, by treating a graded trail as a reason to start late. It climbs 1,650 feet without ever feeling like it is climbing, which is pleasant on the day and expensive the next morning.",
      "Water is everywhere for the first eight miles and then stops. Fill at the last crossing, which is signed, rather than at the hut, where the queue at six is twenty minutes long.",
    ],
  },
  {
    id: "l2",
    slug: "out-of-the-trees",
    from: "pike-hollow",
    to: "slatefall",
    name: "Out of the trees",
    distance: 12.1,
    terrain: { trail: 5.2, rough: 4.4, talus: 0, bog: 2.5 },
    profile: [
      2340, 2600, 2510, 2840, 2720, 3060, 2940, 3280, 3140, 3450, 3330, 3620, 3510, 3720,
    ],
    dry: false,
    escape: "Fire road at mile 9.5, gated but driveable.",
    summary:
      "The tree line goes somewhere around mile seven, and the last two and a half miles are the first real bog.",
    detail: [
      "Two thirds of this is ordinary walking. The last third is not: the path leaves the trees, the drainage stops working, and 2.5 miles of sedge take longer than the 5.2 miles of graded trail that preceded them. This is the leg that teaches people to read the terrain bar rather than the mileage.",
      "Fill at the crossing an hour below Slatefall whatever the forecast says. The spring behind the hut has failed in three of the last eight Augusts and there is no second option up there.",
    ],
  },
  {
    id: "l3",
    slug: "the-slate-ladder",
    from: "slatefall",
    to: "cairnwell",
    name: "The Slate Ladder",
    distance: 9.8,
    terrain: { trail: 1.9, rough: 3.6, talus: 4.3, bog: 0 },
    profile: [3720, 3980, 3860, 4210, 4080, 4420, 4290, 4620, 4480, 4790, 4660, 4910],
    dry: false,
    escape: null,
    summary:
      "Under ten miles, and most of a day. Four miles of it is boulder, and none of that is optional.",
    detail: [
      "The Ladder is the first leg where the profile and the clock disagree loudly. It gains 1,840 feet, which is not exceptional, over 9.8 miles, which is short — and takes over eight hours, because 4.3 of those miles are talus and talus is walked at a mile and a bit an hour with your hands out of your pockets.",
      "There is no way off. The nearest road from the middle of this leg is the one you started from, and going back is genuinely faster than going on until about mile six.",
    ],
  },
  {
    id: "l4",
    slug: "the-cairnwell-ridge",
    from: "cairnwell",
    to: "cistern",
    name: "The Cairnwell ridge",
    distance: 7.6,
    terrain: { trail: 0.8, rough: 2.4, talus: 4.4, bog: 0 },
    profile: [4910, 5080, 4890, 5140, 4930, 5180, 4960, 5020, 4740, 4560, 4380, 4240],
    dry: true,
    escape: null,
    summary:
      "The shortest leg with a full day in it. Four tops, no water, and nowhere to shelter between the two huts.",
    detail: [
      "Seven and a half miles that lose 670 feet overall and climb 730 getting there, in four separate goes. It is the most exposed ground on the traverse and the only leg with no escape and no water at once, which is why the two huts either end of it are eight bunks and ten rather than twenty.",
      "In weather this is the leg to sit out. Cairnwell has a door that bars from the inside and a day spent behind it is a day spent well; the ridge in cloud is navigable but there is no margin in it for a mistake.",
    ],
  },
  {
    id: "l5",
    slug: "the-ninebark-flats",
    from: "cistern",
    to: "ninebark",
    name: "The Ninebark flats",
    distance: 14.6,
    terrain: { trail: 3.1, rough: 4.2, talus: 0, bog: 7.3 },
    profile: [
      4240, 4080, 4180, 3900, 3990, 3720, 3810, 3560, 3640, 3420, 3500, 3300, 3380, 3190,
      3260, 3050,
    ],
    dry: false,
    escape: "Old logging track at mile 8.4, four miles down to Ninebark Road.",
    summary:
      "Downhill all the way and the longest day on the route by two hours. Half of it is peat.",
    detail: [
      "The leg that this whole site exists to describe. It is 14.6 miles, it loses 1,190 feet, it climbs almost nothing, and it takes eleven hours and thirteen minutes — because 7.3 of those miles are bog, and bog is walked at a mile an hour whichever way it tilts.",
      "It cannot be broken. There is no shelter, no platform and no legal camping between The Cistern and Ninebark, which is why no itinerary this planner can produce has a day shorter than eleven hours in it. People plan around the distance, arrive at the flats at two in the afternoon with six miles left, and walk the last of it in the dark.",
    ],
  },
  {
    id: "l6",
    slug: "coldwater-riverside",
    from: "ninebark",
    to: "coldwater",
    name: "Coldwater riverside",
    distance: 6.2,
    terrain: { trail: 5.4, rough: 0.8, talus: 0, bog: 0 },
    profile: [3050, 2960, 3040, 2930, 3010, 2890, 2960, 2880],
    dry: false,
    escape: "The road is within a mile of the path for the whole leg.",
    summary:
      "Under three hours, flat, beside water the entire way. The one leg that is genuinely a rest.",
    detail: [
      "Six miles of graded trail along the Coldwater with the road audible on the far bank. Most people walk it in the morning after the flats and spend the afternoon at the hut, and every one of them says it was the best decision they made.",
      "It is also the resupply point. A box posted to the warden a week ahead will be waiting, which is the difference between carrying five days of food and carrying nine.",
    ],
  },
  {
    id: "l7",
    slug: "the-ember-climb",
    from: "coldwater",
    to: "ember-notch",
    name: "The Ember climb",
    distance: 13.0,
    terrain: { trail: 4.0, rough: 5.1, talus: 3.9, bog: 0 },
    profile: [
      2880, 3140, 3040, 3390, 3280, 3630, 3510, 3870, 3750, 4100, 3980, 4310, 4200, 4470,
    ],
    dry: false,
    escape: null,
    summary:
      "The biggest climb on the traverse — 2,270 feet — onto a notch with six bunks and no warden.",
    detail: [
      "Thirteen miles and 2,270 feet, the last four of them over boulder, arriving at the smallest shelter on the route. The climb is honest and well graded and nobody has ever complained about it. What people complain about is the arithmetic at the top: six bunks, first come, and nine hours between here and anywhere else.",
      "Walking the traverse north to south, as almost everybody does, puts you at Ember Notch in the evening in a crowd. South to north puts you there in the morning, alone, and is the single best argument for going the unpopular way.",
    ],
  },
  {
    id: "l8",
    slug: "off-the-notch",
    from: "ember-notch",
    to: "long-sedge",
    name: "Off the notch",
    distance: 10.4,
    terrain: { trail: 2.6, rough: 4.0, talus: 1.8, bog: 2.0 },
    profile: [
      4470, 4620, 4430, 4610, 4380, 4520, 4270, 4390, 4120, 4210, 3960, 4040, 3800, 3610,
    ],
    dry: false,
    escape: "Snowmobile trail at mile 7.1, six miles out to the highway.",
    summary:
      "A descending traverse in a dozen small steps, ending on the platforms at Long Sedge.",
    detail: [
      "Ten miles that lose 860 feet and climb 760 doing it, which is what a traverse across the grain of a range actually looks like — you drop into a drainage and climb the far side of it, seven times. The profile in the rail shows this better than any sentence can.",
      "Long Sedge is platforms, not bunks. It catches people out every season: they book it, walk to it, and discover at seven in the evening that there is nothing to sleep under.",
    ],
  },
  {
    id: "l9",
    slug: "the-rime-steps",
    from: "long-sedge",
    to: "rimeplace",
    name: "The Rime steps",
    distance: 12.8,
    terrain: { trail: 2.2, rough: 4.6, talus: 6.0, bog: 0 },
    profile: [
      3610, 3870, 3760, 4090, 3980, 4320, 4190, 4530, 4400, 4740, 4610, 4930, 4820, 5120,
    ],
    dry: true,
    escape: null,
    summary:
      "Six miles of boulder, 2,230 feet of climb, no water from the platforms to the tank. Ten and three quarter hours.",
    detail: [
      "The hardest leg on the traverse on every measure except distance, which is exactly the point being made. Six of its 12.8 miles are talus, it climbs 2,230 feet, there is no running water anywhere on it, and it finishes at the highest and coldest building on the range.",
      "Carry four litres. The tank at Rimeplace is rainwater and it is shared with everyone else who arrives, and there have been Augusts when it was three inches from the bottom by the middle of the month.",
    ],
  },
  {
    id: "l10",
    slug: "the-long-drop",
    from: "rimeplace",
    to: "fallowdyke",
    name: "The long drop",
    distance: 15.2,
    terrain: { trail: 6.4, rough: 5.2, talus: 2.4, bog: 1.2 },
    profile: [
      5120, 4930, 5040, 4740, 4850, 4520, 4620, 4290, 4380, 4050, 4130, 3800, 3880, 3560,
      3630, 3310, 3380, 3060, 2900, 2760,
    ],
    dry: false,
    escape: "The Fallowdyke fire road joins the path at mile 11.3.",
    summary:
      "The longest leg, 15.2 miles, and 3,070 feet of descent — which is not the free ride it looks on the profile.",
    detail: [
      "Everybody looks at this one on the profile and books it as an easy day. It takes ten hours. Losing three thousand feet costs an hour on its own before the terrain is counted, and the first six miles are the sort of stepped boulder descent that is slower than the climb would have been.",
      "It gets easier as it goes, which is the right way round. By the fire road at mile 11 you are back under trees on graded trail with four miles left and a staffed hut at the end of them.",
    ],
  },
  {
    id: "l11",
    slug: "out-at-sable-gate",
    from: "fallowdyke",
    to: "sable-gate",
    name: "Out at Sable Gate",
    distance: 9.0,
    terrain: { trail: 7.8, rough: 1.2, talus: 0, bog: 0 },
    profile: [
      2760, 2610, 2700, 2440, 2530, 2270, 2350, 2090, 2160, 1900, 1970, 1700, 1480, 1260,
      1040,
    ],
    dry: false,
    escape: "The path is within walking distance of the road from mile 5.",
    summary: "Nine miles downhill on graded trail. Under five hours, and most of it is trees.",
    detail: [
      "A gentle walk out, losing 1,720 feet on a well-made path, with the last three miles beside a road you can hear. It is the leg people remember least and the one the wardens are most protective of, because it is the only part of the traverse a family can walk in an afternoon.",
      "The shuttle from Sable Gate runs three times a day in season and once in the shoulder weeks. There is no shelter at the gate and nothing to do there, so missing the last one is a genuine problem rather than an inconvenience.",
    ],
  },
];
