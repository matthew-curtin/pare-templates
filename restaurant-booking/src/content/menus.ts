import type { DietaryMark, Menu } from "./types";

/**
 * The menus.
 *
 * Written for late August in the west of England, because a menu that
 * could be any month of any year reads as filler. Change the dishes
 * here and every menu on the site follows.
 */

/** The key printed under every menu. Marks are never used without it. */
export const dietaryKey: { mark: DietaryMark; meaning: string }[] = [
  { mark: "v", meaning: "vegetarian" },
  { mark: "vg", meaning: "vegan" },
  { mark: "gf", meaning: "no gluten" },
  { mark: "n", meaning: "contains nuts" },
];

export const menus: Menu[] = [
  {
    id: "dinner",
    name: "Dinner",
    detail: "Wednesday to Saturday, from 18:00. Written weekly.",
    sections: [
      {
        name: "Snacks",
        note: "While you decide.",
        dishes: [
          {
            name: "Marinated olives, fennel seed",
            description: "Nocellara, warmed through by the fire.",
            price: 5,
            marks: ["vg", "gf"],
          },
          {
            name: "Coppice sausage roll",
            description: "Our own pork and fennel, all-butter pastry.",
            price: 6,
            marks: [],
          },
          {
            name: "Smoked cod's roe, grilled sourdough",
            description: "Cured in-house, smoked over oak for four hours.",
            price: 7,
            marks: [],
          },
          {
            name: "Devilled crab on toast",
            description: "Hand-picked white crab, cayenne, a lot of butter.",
            price: 9,
            marks: [],
          },
        ],
      },
      {
        name: "To start",
        dishes: [
          {
            name: "Sweetcorn soup, brown butter",
            description: "Cobs charred over the embers first, chives.",
            price: 9,
            marks: ["v", "gf"],
          },
          {
            name: "Charred courgette, ewe's curd, cobnuts",
            description: "Flowers too, while they last. Lemon thyme.",
            price: 11,
            marks: ["v", "n"],
          },
          {
            name: "Heritage tomatoes, whipped ricotta",
            description: "Six varieties from Tamar Valley, basil oil.",
            price: 12,
            marks: ["v", "gf"],
          },
          {
            name: "Grilled mackerel, cucumber, dill",
            description: "Landed at Brixham, on the coals for ninety seconds.",
            price: 13,
            marks: ["gf"],
          },
        ],
      },
      {
        name: "From the fire",
        note: "One fire, burning oak and ash. Everything below goes over it.",
        dishes: [
          {
            name: "Celeriac cooked in the embers",
            description: "Buried whole for three hours, hazelnut, sage.",
            price: 21,
            marks: ["vg", "n"],
          },
          {
            name: "Chicken over the coals, chanterelles",
            description: "Creedy Carver, brined overnight, tarragon.",
            price: 24,
            marks: ["gf"],
          },
          {
            name: "Whole red mullet, brown shrimp, capers",
            description: "On the bone, burnt butter, a wedge of lemon.",
            price: 26,
            marks: ["gf"],
          },
          {
            name: "Hogget shoulder, runner beans, anchovy",
            description: "Six hours over the embers. Enough for two if asked.",
            price: 28,
            marks: [],
          },
          {
            name: "Aged Longhorn sirloin, bone marrow",
            description: "For two. Sixty days on the bone, dripping potatoes.",
            price: 62,
            marks: ["gf"],
          },
        ],
      },
      {
        name: "Sides",
        dishes: [
          {
            name: "Green leaves, mustard dressing",
            description: "Whatever came up this week.",
            price: 5,
            marks: ["vg", "gf"],
          },
          {
            name: "Fire-roast potatoes, rosemary salt",
            description: "Pink Fir Apple, crushed and returned to the fire.",
            price: 6,
            marks: ["vg", "gf"],
          },
          {
            name: "Grilled hispi cabbage, 'nduja butter",
            description: "Charred hard on the cut side.",
            price: 7,
            marks: ["gf"],
          },
        ],
      },
      {
        name: "Puddings",
        dishes: [
          {
            name: "Burnt honey ice cream, blackberries",
            description: "Honey from the allotments on Ashley Hill.",
            price: 8,
            marks: ["v", "gf"],
          },
          {
            name: "Damson and almond tart, clotted cream",
            description: "Damsons from the hedgerow at Tickenham.",
            price: 9,
            marks: ["v", "n"],
          },
          {
            name: "Somerset cheese, oatcakes, quince",
            description: "Three, kept at room temperature. Ask what is best.",
            price: 12,
            marks: ["v"],
          },
        ],
      },
    ],
  },
  {
    id: "lunch",
    name: "Lunch",
    detail: "Wednesday to Sunday. Two courses £26, three £32.",
    sections: [
      {
        name: "To start",
        dishes: [
          {
            name: "Sweetcorn soup, brown butter",
            description: "Cobs charred over the embers first, chives.",
            price: 0,
            marks: ["v", "gf"],
          },
          {
            name: "Heritage tomatoes, whipped ricotta",
            description: "Six varieties from Tamar Valley, basil oil.",
            price: 0,
            marks: ["v", "gf"],
          },
          {
            name: "Smoked cod's roe, grilled sourdough",
            description: "Cured in-house, smoked over oak for four hours.",
            price: 0,
            marks: [],
          },
        ],
      },
      {
        name: "Mains",
        dishes: [
          {
            name: "Celeriac cooked in the embers",
            description: "Buried whole for three hours, hazelnut, sage.",
            price: 0,
            marks: ["vg", "n"],
          },
          {
            name: "Chicken over the coals, chanterelles",
            description: "Creedy Carver, brined overnight, tarragon.",
            price: 0,
            marks: ["gf"],
          },
          {
            name: "Grilled mackerel, new potatoes, dill",
            description: "Landed at Brixham that morning.",
            price: 0,
            marks: ["gf"],
          },
        ],
      },
      {
        name: "To finish",
        dishes: [
          {
            name: "Burnt honey ice cream, blackberries",
            description: "Honey from the allotments on Ashley Hill.",
            price: 0,
            marks: ["v", "gf"],
          },
          {
            name: "Damson and almond tart, clotted cream",
            description: "Damsons from the hedgerow at Tickenham.",
            price: 0,
            marks: ["v", "n"],
          },
          {
            name: "Somerset cheese, oatcakes, quince",
            description: "A £4 supplement, and worth it.",
            price: 0,
            marks: ["v"],
          },
        ],
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    detail: "A short list. Mostly small growers, mostly nearby.",
    sections: [
      {
        name: "By the glass",
        note: "125ml. Everything here is also available by the bottle.",
        dishes: [
          {
            name: "Pét-nat, Domaine Ravier, Loire 2024",
            description: "Cloudy, bone dry, faintly of bruised apple.",
            price: 9,
            marks: ["vg"],
          },
          {
            name: "Vermentino, Cantina Serra, Sardinia 2023",
            description: "Salty and sharp. What we drink with the plaice.",
            price: 8,
            marks: ["vg"],
          },
          {
            name: "Gamay, Clos du Meunier, Beaujolais 2023",
            description: "Served cold. Do not argue.",
            price: 9,
            marks: ["vg"],
          },
          {
            name: "Nebbiolo, Ca' Bertone, Langhe 2021",
            description: "Tar and roses, and it can take the hogget.",
            price: 12,
            marks: ["vg"],
          },
        ],
      },
      {
        name: "Bottles",
        note: "The full list runs to about forty. Ask, and we will find it.",
        dishes: [
          {
            name: "Riesling, Weingut Hollen, Mosel 2022",
            description: "Off-dry, very low alcohol, absurdly good value.",
            price: 46,
            marks: ["vg"],
          },
          {
            name: "Chenin Blanc, Foudre Nine, Swartland 2022",
            description: "Old vines, a year in barrel, waxy and long.",
            price: 58,
            marks: ["vg"],
          },
          {
            name: "Trousseau, Domaine Berthet, Jura 2022",
            description: "Pale, savoury, smells like the fire.",
            price: 64,
            marks: ["vg"],
          },
          {
            name: "Longhorn's choice — ask the room",
            description: "Whatever we have three bottles of and love.",
            price: 0,
            marks: [],
          },
        ],
      },
      {
        name: "Low and no",
        note: "Made here, and treated as seriously as the wine.",
        dishes: [
          {
            name: "House kombucha, gooseberry",
            description: "Second ferment with fruit from the same hedge.",
            price: 5,
            marks: ["vg", "gf"],
          },
          {
            name: "Smoked apple soda",
            description: "Juice from Long Ashton, smoked over the same oak.",
            price: 5,
            marks: ["vg", "gf"],
          },
          {
            name: "Alcohol-free sparkling, Leitz",
            description: "Riesling, de-alcoholised. Genuinely dry.",
            price: 8,
            marks: ["vg", "gf"],
          },
        ],
      },
    ],
  },
];
