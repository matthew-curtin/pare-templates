import type { Area } from "./types";

/**
 * Six areas, and each one carries an `outOfSeason` line.
 *
 * That field is the honest half and it is why this file is not a list of
 * blurbs. Every garden's website describes its areas at their best; the
 * model here can work out exactly how many weeks a given area has
 * nothing above the bar in it, so a description that only says what the
 * place is like in May is contradicted by the site's own arithmetic on
 * the same page. `scripts/check-season.mjs` asserts that each area's
 * quoted gap matches what `gapsFor` actually returns.
 */
export const areas: Area[] = [
  {
    slug: "hollow",
    name: "The Hollow",
    where: "Down the steps behind the house, in the old oak wood.",
    blurb:
      "The reason the garden exists. A steep bowl of leaf mould under two-hundred-year-old oaks, where Marchbank put the first rhododendrons in 1881 because it was the one place on the estate the wind could not reach. Everything in it is an understorey plant: nothing here is meant to be looked at against the sky.",
    outOfSeason:
      "From midsummer it is a green room with nothing flowering in it, and it stays that way until the acers turn. Cool on a hot day, which is not nothing.",
    minutes: 40,
    photo: "hollow",
  },
  {
    slug: "burnside",
    name: "Burnside Walk",
    where: "Follow the water down from the Hollow to the shore.",
    blurb:
      "Six hundred metres of wet ground either side of a burn that has never once run dry. Candelabra primulas have seeded themselves the length of it since about 1950 and we have stopped pretending we planted them where they are. The blue poppies are at the top end, in the shade, where they last longest.",
    outOfSeason:
      "Under water in February. The path is a stream for about six weeks a year and we close it rather than resurface it every spring.",
    minutes: 35,
    photo: "burnside",
  },
  {
    slug: "terrace",
    name: "The South Terrace",
    where: "The level walk along the front of the house.",
    blurb:
      "A stone wall facing due south with the loch throwing light back at it, which adds perhaps two degrees and takes the whole garden out of Argyll and somewhere off the coast of Chile. The tender things live here. When one dies it is because of wind, never cold.",
    outOfSeason:
      "Bare wall and wet stone in November. It is the first thing visitors see and the least of it.",
    minutes: 20,
    /* No photograph. Every candidate for "a stone terrace with tender
       things against a warm wall" was somebody's courtyard with pots in
       it, and the Terrace's own plants — the fire bush, the eucryphia,
       the daphne — are the six things in this collection no honest
       frame exists for. §6: change the subject or drop it, never
       caption a photograph as something it is not. */
    photo: null,
  },
  {
    slug: "arboretum",
    name: "The Arboretum",
    where: "The open ground above the house, up the track.",
    blurb:
      "Ninety trees on a hillside, planted mostly between 1902 and 1938 and spaced by a man who understood he was making something for people not yet born. It is the only part of the garden with a horizon in it, and the only part that is better in October than in March.",
    outOfSeason:
      "Exposed and cold, and the wind comes straight off the hill. Worth it in January for the bark and for very little else.",
    minutes: 55,
    photo: "arboretum",
  },
  {
    slug: "shorewalk",
    name: "The Shore Walk",
    where: "Through the gate at the bottom of the Burnside, along the water.",
    blurb:
      "A mile of salt wind. Almost nothing ornamental will grow here and the things that do are tough, grey-leaved and mostly white-flowered, which is what a coastal flora looks like everywhere in the world. The griselinia hedge along the top of it is the reason the rest of the garden is possible.",
    outOfSeason:
      "For over half the year this is a windbreak with a path through it rather than a garden, and the arithmetic on this page says so plainly. Come for the view and the dogs.",
    minutes: 50,
    photo: "shore",
  },
  {
    slug: "glasshouse",
    name: "The Long Glasshouse",
    where: "Behind the walled garden. Follow the smell.",
    blurb:
      "Sixty-two metres of Victorian ironwork, re-glazed in 1994 and heated to a minimum of four degrees, which costs more than every other thing the garden does put together. It exists so that there is somewhere to send people in the first week of January.",
    outOfSeason:
      "Dull in high summer, when everything in it is a green leaf and everything outside is better. We turn the heat off in May.",
    minutes: 25,
    photo: "glasshouse",
  },
];
