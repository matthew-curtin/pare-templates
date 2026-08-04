import type { BrewGuide } from "./types";

/**
 * Brew guides. Each one drives an interactive timer on its page, so
 * `steps[].at` is the number of seconds from the start of the brew
 * that the step begins — the timer highlights whichever step the clock
 * has most recently passed.
 *
 * Keep steps in ascending `at` order; the timer assumes it.
 */
export const brewGuides: BrewGuide[] = [
  {
    slug: "v60",
    name: "V60",
    summary:
      "The one we use on the bench every morning. Clean, bright, and unforgiving enough to tell you when your grind is wrong.",
    totalLabel: "3 min 00 s",
    totalSeconds: 180,
    kit: [
      "Hario V60, size 02",
      "Paper filter",
      "Scales that read to 0.1 g",
      "A kettle you can pour slowly with",
    ],
    ratio: "15 g coffee : 250 g water",
    grindLabel: "Medium-fine — like table salt",
    waterLabel: "94 °C",
    steps: [
      {
        at: 0,
        title: "Rinse and add coffee",
        detail:
          "Rinse the paper through with hot water and tip it away. Add 15 g of coffee and level the bed with a tap.",
      },
      {
        at: 10,
        title: "Bloom — 50 g",
        detail:
          "Pour to 50 g in a slow spiral, wetting all the grounds. It will swell and smell sweet. Leave it.",
      },
      {
        at: 45,
        title: "Second pour — to 150 g",
        detail:
          "Pour steadily in circles, keeping the water off the paper. Reach 150 g by about a minute fifteen.",
      },
      {
        at: 90,
        title: "Final pour — to 250 g",
        detail:
          "Top up to 250 g. Give the brewer one gentle swirl to flatten the bed, then leave it alone.",
      },
      {
        at: 150,
        title: "Drawdown",
        detail:
          "It should run clear by three minutes. Much slower and your grind is too fine; much faster and it is too coarse.",
      },
    ],
    image: "/images/brewing/v60.jpg",
    imageAlt: "Water being poured in a spiral over a paper filter cone",
  },
  {
    slug: "cafetiere",
    name: "Cafetière",
    summary:
      "Nearly impossible to get badly wrong, and much better than its reputation if you skip the plunging.",
    totalLabel: "9 min 00 s",
    totalSeconds: 540,
    kit: ["A cafetière", "Scales", "A spoon", "A ladle or a second jug"],
    ratio: "60 g coffee : 1000 g water",
    grindLabel: "Coarse — like demerara sugar",
    waterLabel: "95 °C",
    steps: [
      {
        at: 0,
        title: "Add coffee and all the water",
        detail:
          "60 g of coarse coffee, then pour all 1000 g in one go. Do not stir yet.",
      },
      {
        at: 240,
        title: "Break the crust",
        detail:
          "At four minutes, stir the floating crust gently three times. Most of it will sink.",
      },
      {
        at: 270,
        title: "Skim",
        detail:
          "Lift the foam and any floating grounds off the top with two spoons and discard. This is what removes the sludge, not the filter.",
      },
      {
        at: 300,
        title: "Wait",
        detail:
          "Leave it completely still for five more minutes. The grounds settle into a layer at the bottom.",
      },
      {
        at: 540,
        title: "Pour, do not plunge",
        detail:
          "Rest the plunger on the surface without pressing, and pour slowly. Stop before the last centimetre.",
      },
    ],
    image: "/images/brewing/cafetiere.jpg",
    imageAlt: "A glass cafetière of coffee on a kitchen counter",
  },
  {
    slug: "aeropress",
    name: "AeroPress",
    summary:
      "The travelling recipe. Forgiving of bad kettles, bad grinders and unfamiliar kitchens.",
    totalLabel: "2 min 15 s",
    totalSeconds: 135,
    kit: ["AeroPress", "Paper filter", "Scales", "A sturdy mug"],
    ratio: "16 g coffee : 240 g water",
    grindLabel: "Medium — slightly finer than filter",
    waterLabel: "88 °C",
    steps: [
      {
        at: 0,
        title: "Assemble upright, add coffee",
        detail:
          "Chamber on the mug, rinsed paper in the cap. Add 16 g and shake level.",
      },
      {
        at: 10,
        title: "Pour to 240 g",
        detail:
          "Add all the water at once, fairly briskly. Insert the plunger a centimetre to seal it and stop the drip.",
      },
      {
        at: 30,
        title: "Stir",
        detail: "Remove the plunger, stir twice back and forth, reseal.",
      },
      {
        at: 90,
        title: "Press",
        detail:
          "Press slowly and evenly — aim to take about thirty seconds. Stop the moment you hear air.",
      },
      {
        at: 135,
        title: "Dilute if you like",
        detail:
          "It is concentrated. Add 30–50 g of hot water if you want a longer cup.",
      },
    ],
    image: "/images/brewing/aeropress.jpg",
    imageAlt:
      "An AeroPress brewing into a glass carafe on a shelf, beside a houseplant",
  },
];

export function getBrewGuide(slug: string): BrewGuide | undefined {
  return brewGuides.find((guide) => guide.slug === slug);
}
