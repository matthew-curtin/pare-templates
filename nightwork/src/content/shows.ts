import type { Show } from "@/lib/ballistics";

/**
 * Six displays, written as SEGMENTS rather than as cue lists.
 *
 * This is how a script is actually built. Nobody types four hundred
 * lines; they write "twenty green peonies, one point one seconds apart,
 * starting at 0:52" and the firing system expands it. `expandShow` in
 * `src/lib/ballistics.ts` does the same expansion, which means changing
 * `count: 20` to `count: 30` here changes the sky, the cue sheet, the
 * peak rate, the colour budget and the price — all of them, correctly,
 * from one number.
 *
 * TUNED (CONVENTIONS §7b) so that each of the three ways a show gets
 * constrained is reachable and exactly one show is the clear example of
 * each: Ravensmoor is limited by GROUND (an 88-metre lawn caps it at a
 * four-inch shell), Six Bells is limited by MONEY (an eight-inch site
 * fired with four-inch shells), and Blue Hour is limited by nothing at
 * all and chose the most expensive colour there is anyway.
 *
 * Times are tenths of a second from the announced start. `The Long
 * Field` opens with a twelve-inch shell breaking at 0:04.0, and a
 * twelve-inch shell takes 6.3 seconds to climb — so its first cue fires
 * at −0:02.3, which is to say the show starts before it starts.
 */
export const SHOWS: readonly Show[] = [
  {
    slug: "harbour-nine",
    title: "Harbour Nine",
    client: "Blyth Town Council",
    siteId: "north-quay",
    crowdM: 240,
    cueTo: "light",
    standfirst:
      "New Year over the harbour, fired from the north quay with the crowd on the opposite bank. Two hundred and forty metres of open water between us, which makes it the loudest thing this company does and the least synchronised.",
    notes: [
      "The council asks for green every year and has never been told why they get it: green is the one colour that survives a lit town behind it, and Blyth's front is very lit.",
      "The rings are aimed at the far bank rather than at the sky. A ring shell lays its stars in a plane, so it only reads as a ring from one direction, and the direction has to be chosen on the ground weeks earlier.",
      "Nothing quiet was written into this show after the first year. Across that much water the quiet passages simply read as the show having stopped.",
    ],
    segments: [
      { id: "open-high", label: "Opening — high silver", atTenths: 25, shellId: "c8-silver", count: 3, spacingTenths: 10 },
      { id: "open-low", label: "Opening — low crackle", atTenths: 20, shellId: "p3-silver", count: 14, spacingTenths: 5 },
      { id: "first-rings", label: "First rings", atTenths: 200, shellId: "r6-green", count: 4, spacingTenths: 60, note: "Aimed at the far bank." },
      { id: "green-run", label: "Green run", atTenths: 520, shellId: "p3-green", count: 20, spacingTenths: 11 },
      { id: "gold-body", label: "Gold body", atTenths: 900, shellId: "c6-gold", count: 14, spacingTenths: 30 },
      { id: "red-answer", label: "Red answer", atTenths: 1400, shellId: "p3-red", count: 16, spacingTenths: 12 },
      { id: "willows", label: "Willows", atTenths: 1800, shellId: "w6-gold", count: 5, spacingTenths: 50 },
      { id: "blue-passage", label: "Blue passage", atTenths: 2200, shellId: "p3-blue", count: 10, spacingTenths: 42, note: "The only blue in the show, and it cost more than the rings." },
      { id: "rings-two", label: "Rings, second set", atTenths: 2700, shellId: "r6-green", count: 6, spacingTenths: 45 },
      { id: "build", label: "Build", atTenths: 3200, shellId: "c6-gold", count: 20, spacingTenths: 24 },
      { id: "green-wall", label: "Green wall", atTenths: 3900, shellId: "p3-green", count: 28, spacingTenths: 9 },
      { id: "salvo-high", label: "Salvo — high", atTenths: 4600, shellId: "c8-silver", count: 4, spacingTenths: 90 },
      { id: "salvo-mid", label: "Salvo — middle", atTenths: 4600, shellId: "c4-amber", count: 4, spacingTenths: 90 },
      { id: "salvo-low", label: "Salvo — low", atTenths: 4600, shellId: "p2-gold", count: 4, spacingTenths: 90, note: "Three tiers, one instant. Fired 2.7 seconds apart." },
      { id: "orange", label: "Orange", atTenths: 5100, shellId: "p5-orange", count: 6, spacingTenths: 40 },
      { id: "pre-finale", label: "Last rings", atTenths: 5500, shellId: "r6-green", count: 5, spacingTenths: 30 },
      { id: "finale-a", label: "Finale — gold", atTenths: 5900, shellId: "p2-gold", count: 70, spacingTenths: 1 },
      { id: "finale-b", label: "Finale — amber", atTenths: 5910, shellId: "p2-amber", count: 44, spacingTenths: 3 },
      { id: "finale-c", label: "Finale — crackle", atTenths: 5900, shellId: "p3-silver", count: 26, spacingTenths: 4 },
      { id: "last", label: "Last shell", atTenths: 6480, shellId: "c8-silver", count: 1, spacingTenths: 0 },
    ],
  },
  {
    slug: "the-long-field",
    title: "The Long Field",
    client: "Kirkwhelpington Agricultural Society",
    siteId: "bracken-fell",
    crowdM: 300,
    cueTo: "light",
    standfirst:
      "Fourteen minutes off the top of Bracken Fell, which is the only ground we hold that will take a twelve-inch shell. Everything that makes this show what it is follows from that one permission.",
    notes: [
      "The largest shell here is four hundred metres across when it opens and takes 6.3 seconds to get where it is going. Every other shell in the show is written around that number.",
      "The show's first cue fires 2.3 seconds before the announced start. There is no way around it: the opening shell has to be in the air before the show can begin, and the audience hears the mortar before they see anything at all.",
      "Twelve willows in three sets. A twelve-inch willow burns for 5.5 seconds after it breaks, so the sky is never empty in the second half — there is always something falling out of the last thing.",
    ],
    segments: [
      { id: "open-twelve", label: "Opening — twelve-inch", atTenths: 40, shellId: "c12-gold", count: 1, spacingTenths: 0, note: "Fires at −0:02.3." },
      { id: "open-low", label: "Opening — low", atTenths: 25, shellId: "p3-silver", count: 16, spacingTenths: 5 },
      { id: "climb", label: "Climb", atTenths: 300, shellId: "c6-gold", count: 12, spacingTenths: 32 },
      { id: "willows-one", label: "Willows, first set", atTenths: 700, shellId: "w12-gold", count: 4, spacingTenths: 80 },
      { id: "red", label: "Red", atTenths: 1200, shellId: "p3-red", count: 18, spacingTenths: 13 },
      { id: "amber", label: "Amber", atTenths: 1700, shellId: "c4-amber", count: 12, spacingTenths: 26 },
      { id: "quiet-purple", label: "Quiet — purple", atTenths: 2200, shellId: "x4-purple", count: 8, spacingTenths: 55 },
      { id: "quiet-blue", label: "Quiet — blue", atTenths: 2260, shellId: "p3-blue", count: 10, spacingTenths: 48 },
      { id: "ring", label: "Rings", atTenths: 2900, shellId: "r6-green", count: 5, spacingTenths: 50 },
      { id: "willows-two", label: "Willows, second set", atTenths: 3400, shellId: "w6-gold", count: 8, spacingTenths: 40 },
      { id: "body", label: "Body", atTenths: 4000, shellId: "c6-gold", count: 22, spacingTenths: 25 },
      { id: "double", label: "Double-petal", atTenths: 4700, shellId: "d10-double", count: 3, spacingTenths: 110 },
      { id: "green", label: "Green", atTenths: 5100, shellId: "p3-green", count: 20, spacingTenths: 12 },
      { id: "salvo-high", label: "Salvo — twelve-inch", atTenths: 5700, shellId: "c12-gold", count: 3, spacingTenths: 400 },
      { id: "salvo-mid", label: "Salvo — six-inch", atTenths: 5700, shellId: "c6-gold", count: 3, spacingTenths: 400 },
      { id: "salvo-low", label: "Salvo — two-inch", atTenths: 5700, shellId: "p2-gold", count: 3, spacingTenths: 400, note: "The three tiers break together and are fired 4.2 seconds apart. This is the show." },
      { id: "willows-three", label: "Willows, third set", atTenths: 6900, shellId: "w12-gold", count: 5, spacingTenths: 60 },
      { id: "finale-a", label: "Finale — gold", atTenths: 7500, shellId: "p2-gold", count: 80, spacingTenths: 1 },
      { id: "finale-b", label: "Finale — amber", atTenths: 7510, shellId: "p2-amber", count: 50, spacingTenths: 2 },
      { id: "finale-c", label: "Finale — crackle", atTenths: 7500, shellId: "p3-silver", count: 30, spacingTenths: 2 },
      { id: "finale-top", label: "Last two", atTenths: 8180, shellId: "c12-gold", count: 2, spacingTenths: 60 },
    ],
  },
  {
    slug: "blue-hour",
    title: "Blue Hour",
    client: "Private commission",
    siteId: "north-quay",
    crowdM: 240,
    cueTo: "light",
    standfirst:
      "Seven minutes, almost entirely copper. It is the most expensive show per minute this company has ever fired and it is not the biggest, the longest or the loudest. It is just blue.",
    notes: [
      "The client asked for a blue show and was told what a blue show costs. They asked again. This page exists because that conversation happens once every few years and it is easier to have it with arithmetic on the table.",
      "Nine silver peonies sit in the middle of it, at 5:20. They are there so that the blue either side of them has something to be blue against — take them out and the eye adapts within about a minute and the whole show goes grey.",
      "Copper burns cool, so the stars are short-lived: every break here is out of the sky faster than the gold equivalent would be. A blue show is not only dimmer, it is briefer.",
    ],
    segments: [
      { id: "open", label: "Opening", atTenths: 40, shellId: "c6-blue", count: 3, spacingTenths: 12 },
      { id: "open-low", label: "Opening — low", atTenths: 30, shellId: "p3-blue", count: 14, spacingTenths: 6 },
      { id: "drift", label: "Drift", atTenths: 400, shellId: "p3-blue", count: 18, spacingTenths: 22 },
      { id: "purple-one", label: "Purple crossettes", atTenths: 900, shellId: "x4-purple", count: 10, spacingTenths: 40 },
      { id: "double", label: "Double-petal", atTenths: 1300, shellId: "d10-double", count: 4, spacingTenths: 90 },
      { id: "body", label: "Body", atTenths: 1800, shellId: "c6-blue", count: 16, spacingTenths: 28 },
      { id: "quiet", label: "Quiet", atTenths: 2400, shellId: "p3-blue", count: 12, spacingTenths: 45 },
      { id: "purple-two", label: "Purple, second set", atTenths: 2900, shellId: "x4-purple", count: 8, spacingTenths: 42 },
      { id: "silver-cut", label: "Silver", atTenths: 3200, shellId: "p3-silver", count: 9, spacingTenths: 20, note: "The reset. Nine shells, and the show does not work without them." },
      { id: "salvo-high", label: "Salvo — ten-inch", atTenths: 3500, shellId: "d10-double", count: 2, spacingTenths: 200 },
      { id: "salvo-mid", label: "Salvo — six-inch", atTenths: 3500, shellId: "c6-blue", count: 2, spacingTenths: 200 },
      { id: "salvo-low", label: "Salvo — three-inch", atTenths: 3500, shellId: "p3-blue", count: 2, spacingTenths: 200 },
      { id: "finale-a", label: "Finale", atTenths: 3750, shellId: "c6-blue", count: 18, spacingTenths: 12 },
      { id: "finale-b", label: "Finale — purple", atTenths: 3760, shellId: "x4-purple", count: 12, spacingTenths: 18 },
      { id: "last", label: "Last shell", atTenths: 4120, shellId: "d10-double", count: 1, spacingTenths: 0 },
    ],
  },
  {
    slug: "cold-open",
    title: "Cold Open",
    client: "Northern Counties Broadcasting",
    siteId: "carrow-bowl",
    crowdM: 130,
    cueTo: "sound",
    standfirst:
      "The only show on this list cued to the SOUND rather than the light, because it was fired for a camera. Everything the crowd in the ground saw was four-tenths of a second early, and nobody in the ground was the client.",
    notes: [
      "A broadcast camera and its microphone are in the same place, so the delay between flash and bang is baked into the transmission whatever we do. Cue to the light and the broadcast is late; cue to the sound and the broadcast is right and the live audience is wrong.",
      "Carrow Bowl returns its own sound off the far stand about four-tenths later, so every break is heard twice. Nothing delicate was written into this show and nothing needed to be — the venue would have flattened it.",
      "Six-inch is the ceiling here. A hundred and thirty metres to the front row means a hundred and twenty-six metres of required radius, and there is no seven-inch shell in the world that fits in four metres of margin.",
    ],
    segments: [
      { id: "open", label: "Opening", atTenths: 20, shellId: "c4-silver", count: 6, spacingTenths: 8 },
      { id: "crack", label: "Crackle", atTenths: 60, shellId: "p3-silver", count: 20, spacingTenths: 6 },
      { id: "body-one", label: "First body", atTenths: 500, shellId: "c6-gold", count: 12, spacingTenths: 28 },
      { id: "silver-run", label: "Silver run", atTenths: 900, shellId: "c4-silver", count: 16, spacingTenths: 20 },
      { id: "red", label: "Red", atTenths: 1400, shellId: "p3-red", count: 14, spacingTenths: 14 },
      { id: "quiet", label: "Quiet", atTenths: 1800, shellId: "p3-blue", count: 8, spacingTenths: 40 },
      { id: "ring", label: "Rings", atTenths: 2100, shellId: "r6-green", count: 4, spacingTenths: 48 },
      { id: "silver-wall", label: "Silver wall", atTenths: 2400, shellId: "p3-silver", count: 30, spacingTenths: 7 },
      { id: "salvo-high", label: "Salvo — six-inch", atTenths: 2900, shellId: "c6-gold", count: 3, spacingTenths: 150 },
      { id: "salvo-mid", label: "Salvo — four-inch", atTenths: 2900, shellId: "c4-silver", count: 3, spacingTenths: 150 },
      { id: "salvo-low", label: "Salvo — two-inch", atTenths: 2900, shellId: "p2-amber", count: 3, spacingTenths: 150 },
      { id: "finale-a", label: "Finale — gold", atTenths: 3200, shellId: "p2-gold", count: 54, spacingTenths: 2 },
      { id: "finale-b", label: "Finale — crackle", atTenths: 3200, shellId: "p3-silver", count: 24, spacingTenths: 3 },
      { id: "finale-c", label: "Finale — amber", atTenths: 3210, shellId: "p2-amber", count: 30, spacingTenths: 2 },
    ],
  },
  {
    slug: "six-bells",
    title: "Six Bells",
    client: "Widdrington Village Hall Committee",
    siteId: "six-bells-rec",
    crowdM: 180,
    cueTo: "light",
    standfirst:
      "Bonfire night on a football pitch, for a committee that raises the money in a pub over eleven months. Room here for an eight-inch shell and a budget for a four-inch, which is the only site on our list where the limit is money rather than ground.",
    notes: [
      "Every shell in this show is two, three or four inches. It costs less per minute than anything else we fire and it gets the loudest reaction of the six, which is a fact worth sitting with before commissioning anything larger.",
      "Amber does the work a bigger shell would have done. Sodium puts out nearly five times the light of copper for a tenth of the trouble, so a four-inch amber chrysanthemum reads at 180 metres like something twice its size.",
      "The salvo fires 1.0 seconds apart. On Bracken Fell the same three tiers are fired 4.2 seconds apart, and that difference — not the shell count, not the budget — is what makes a big show hard to write.",
    ],
    segments: [
      { id: "open", label: "Opening", atTenths: 30, shellId: "c4-amber", count: 4, spacingTenths: 12 },
      { id: "open-low", label: "Opening — low", atTenths: 25, shellId: "p3-gold", count: 12, spacingTenths: 6 },
      { id: "body-one", label: "First body", atTenths: 400, shellId: "p3-gold", count: 20, spacingTenths: 20 },
      { id: "amber-run", label: "Amber run", atTenths: 900, shellId: "c4-amber", count: 14, spacingTenths: 26 },
      { id: "red", label: "Red", atTenths: 1500, shellId: "p3-red", count: 14, spacingTenths: 15 },
      { id: "green", label: "Green", atTenths: 2000, shellId: "p3-green", count: 12, spacingTenths: 18 },
      { id: "silver", label: "Silver", atTenths: 2400, shellId: "p3-silver", count: 10, spacingTenths: 24 },
      { id: "amber-two", label: "Amber, second run", atTenths: 2800, shellId: "c4-amber", count: 16, spacingTenths: 22 },
      { id: "salvo-high", label: "Salvo — four-inch", atTenths: 3400, shellId: "c4-amber", count: 4, spacingTenths: 120 },
      { id: "salvo-mid", label: "Salvo — three-inch", atTenths: 3400, shellId: "p3-gold", count: 4, spacingTenths: 120 },
      { id: "salvo-low", label: "Salvo — two-inch", atTenths: 3400, shellId: "p2-amber", count: 4, spacingTenths: 120, note: "One second of spread, against Bracken Fell's 4.2." },
      { id: "body-two", label: "Second body", atTenths: 3900, shellId: "p3-gold", count: 18, spacingTenths: 16 },
      { id: "finale-a", label: "Finale — gold", atTenths: 4300, shellId: "p2-gold", count: 60, spacingTenths: 1 },
      { id: "finale-b", label: "Finale — amber", atTenths: 4310, shellId: "p2-amber", count: 40, spacingTenths: 2 },
    ],
  },
  {
    slug: "ravensmoor",
    title: "Ravensmoor",
    client: "Private commission",
    siteId: "ravensmoor-lawn",
    crowdM: 88,
    cueTo: "light",
    standfirst:
      "Four minutes over a croquet lawn, with the guests eighty-eight metres away on a terrace. That distance caps every shell at four inches and every break at a hundred and twenty metres, so the whole display happens almost directly overhead.",
    notes: [
      "Eighty-eight metres of clear ground permits a four-inch shell and nothing larger. This is not a preference and it is not negotiable — it is 21 metres of radius per inch of diameter, and the lawn is the size the lawn is.",
      "Looking up at sixty degrees changes what works. A ring shell is useless here because nobody is in the plane to see it as a ring, and a willow is wasted because the stars fall out of view behind the roofline.",
      "Purple, because it is the one colour that reads properly at close range. At 88 metres you are near enough to see the copper and the strontium as two things rather than as one muddy colour, which is exactly what you cannot see from across a harbour.",
    ],
    segments: [
      { id: "open", label: "Opening", atTenths: 30, shellId: "c4-silver", count: 3, spacingTenths: 10 },
      { id: "open-low", label: "Opening — low", atTenths: 25, shellId: "p3-silver", count: 8, spacingTenths: 7 },
      { id: "purple-one", label: "Purple", atTenths: 300, shellId: "x4-purple", count: 6, spacingTenths: 45 },
      { id: "red", label: "Red", atTenths: 700, shellId: "p3-red", count: 10, spacingTenths: 18 },
      { id: "purple-two", label: "Purple, second set", atTenths: 1050, shellId: "x4-purple", count: 8, spacingTenths: 40 },
      { id: "blue", label: "Blue", atTenths: 1400, shellId: "p3-blue", count: 8, spacingTenths: 30 },
      { id: "salvo-high", label: "Salvo — four-inch silver", atTenths: 1700, shellId: "c4-silver", count: 3, spacingTenths: 90 },
      { id: "salvo-mid", label: "Salvo — four-inch purple", atTenths: 1700, shellId: "x4-purple", count: 3, spacingTenths: 90 },
      { id: "salvo-low", label: "Salvo — three-inch", atTenths: 1700, shellId: "p3-red", count: 3, spacingTenths: 90, note: "Half a second of spread. On a lawn this small the inversion barely matters." },
      { id: "finale-a", label: "Finale", atTenths: 1950, shellId: "p3-gold", count: 28, spacingTenths: 4 },
      { id: "finale-b", label: "Finale — purple", atTenths: 1960, shellId: "x4-purple", count: 10, spacingTenths: 10 },
      { id: "last", label: "Last two", atTenths: 2280, shellId: "c4-silver", count: 2, spacingTenths: 40 },
    ],
  },
];

export function showBySlug(slug: string): Show | undefined {
  return SHOWS.find((s) => s.slug === slug);
}
