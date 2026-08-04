import type { Coffee, Size } from "./types";

/**
 * Everything the shop sells. The listing, the product pages, the cart
 * and the subscription pitch all read from this one array.
 *
 * Prices are whole pence. See the note on `Size` in types.ts for why.
 *
 * All of it is invented — the roastery, the farms, the producers and
 * the prices. See the footer and the README.
 */

/** Most coffees are sold in the same two sizes, so the shape is shared. */
function standardSizes(smallPence: number, largePence: number): Size[] {
  return [
    { id: "250g", label: "250 g", pence: smallPence },
    { id: "1kg", label: "1 kg", pence: largePence },
  ];
}

export const coffees: Coffee[] = [
  {
    slug: "ridgeline-house",
    name: "House",
    tagline: "The one we drink all day. Chocolate, orange, no argument.",
    country: "Brazil & Colombia",
    region: "Cerrado & Huila",
    producer: "Six smallholders, bought through the same two exporters since 2019",
    altitude: "1,100–1,750 m",
    varietal: "Yellow Bourbon, Caturra, Castillo",
    process: "Washed",
    roast: "medium",
    notes: ["Milk chocolate", "Orange", "Almond"],
    flavour: [
      { label: "Body", score: 4 },
      { label: "Acidity", score: 2 },
      { label: "Sweetness", score: 4 },
      { label: "Fruit", score: 2 },
    ],
    description: [
      "The blend exists because most people want one bag that works in whatever they own, and a roastery that only sells delicate single lots is quietly telling those people to go elsewhere. House is built to survive a cafetière left too long and to still taste like something through milk.",
      "It is two components, both washed, both bought on repeat. The Brazilian gives the body and the nut; the Colombian gives it enough acidity to not be flat. The ratio moves a little through the year as lots change, which is why the tasting notes here are broad rather than specific.",
    ],
    sizes: standardSizes(1150, 3800),
    image: "/images/coffee/house.jpg",
    imageAlt: "Roasted coffee beans spilling from a paper bag onto a pale surface",
    featured: true,
  },
  {
    slug: "kieni",
    name: "Kieni",
    tagline: "Blackcurrant so loud the first time it surprises people.",
    country: "Kenya",
    region: "Nyeri",
    producer: "Kieni Factory, Othaya Farmers Co-operative Society",
    altitude: "1,750–1,900 m",
    varietal: "SL28, SL34, Ruiru 11",
    process: "Washed",
    roast: "light",
    notes: ["Blackcurrant", "Tomato", "Brown sugar"],
    flavour: [
      { label: "Body", score: 3 },
      { label: "Acidity", score: 5 },
      { label: "Sweetness", score: 4 },
      { label: "Fruit", score: 5 },
    ],
    description: [
      "Kenyan SL28 grown high and washed carefully is the reference point for what acidity in coffee can be, and Kieni is a very good example of it. Blackcurrant is not a poetic reach here — it is the note most people land on unprompted, and it arrives before anything else.",
      "The washing station takes cherry from around six hundred smallholders around Othaya and separates by day and by grade. This is the AA screen from the main crop. Brew it hotter than you think and do not grind it too fine; the acidity does not need help.",
    ],
    sizes: standardSizes(1400, 4600),
    image: "/images/coffee/kieni.jpg",
    imageAlt: "A close view of light-roasted coffee beans",
    featured: true,
  },
  {
    slug: "finca-la-soledad",
    name: "Finca La Soledad",
    tagline: "Cocoa and orange peel. The one to give someone who says they don't like coffee.",
    country: "Guatemala",
    region: "Antigua",
    producer: "Familia Ovalle, Finca La Soledad",
    altitude: "1,550–1,700 m",
    varietal: "Bourbon, Caturra",
    process: "Washed",
    roast: "medium-light",
    notes: ["Cocoa", "Orange peel", "Toffee"],
    flavour: [
      { label: "Body", score: 4 },
      { label: "Acidity", score: 3 },
      { label: "Sweetness", score: 5 },
      { label: "Fruit", score: 3 },
    ],
    description: [
      "Antigua sits in a bowl between three volcanoes, which gives it deep soil, cool nights and a long enough ripening period that the sugars have time to develop. La Soledad has been in the same family for four generations and they mill their own cherry.",
      "It is the least demanding coffee we sell that is still unmistakably a single lot. Sweet, round, a clean orange note through the middle, and forgiving of a slightly wrong grind — which is why it is the bag we send when somebody asks us to choose.",
    ],
    sizes: standardSizes(1300, 4200),
    image: "/images/coffee/la-soledad.jpg",
    imageAlt: "A dark measuring scoop of coffee beans on a wooden table",
  },
  {
    slug: "wush-wush",
    name: "Wush Wush",
    tagline: "Peach, jasmine and a finish that goes on for a while.",
    country: "Ethiopia",
    region: "Keffa",
    producer: "Bonga washing station, Keffa Zone",
    altitude: "1,900–2,100 m",
    varietal: "Wush Wush",
    process: "Natural",
    roast: "light",
    notes: ["White peach", "Jasmine", "Apricot"],
    flavour: [
      { label: "Body", score: 3 },
      { label: "Acidity", score: 4 },
      { label: "Sweetness", score: 5 },
      { label: "Fruit", score: 5 },
    ],
    description: [
      "Wush Wush is a varietal, not a place — a rare Ethiopian cultivar named after the village it was identified in, planted in small quantities because it yields poorly and is fussy about altitude. It is expensive for exactly that reason.",
      "Dried on raised beds in whole cherry for around eighteen days, turned by hand. The result is intensely floral without tipping into the boozy over-fermented character that naturals can pick up. Best as filter, and genuinely good as it cools.",
    ],
    sizes: standardSizes(1650, 5400),
    image: "/images/coffee/wush-wush.jpg",
    imageAlt: "A pour-over brewer with coffee blooming in the filter bed",
    featured: true,
  },
  {
    slug: "cerro-azul",
    name: "Cerro Azul",
    tagline: "Anaerobic, tropical, and not remotely subtle.",
    country: "Colombia",
    region: "Valle del Cauca",
    producer: "Camilo Merizalde, Finca Cerro Azul",
    altitude: "1,900–2,000 m",
    varietal: "Pink Bourbon",
    process: "Anaerobic",
    roast: "medium-light",
    notes: ["Mango", "Passionfruit", "Rum"],
    flavour: [
      { label: "Body", score: 4 },
      { label: "Acidity", score: 4 },
      { label: "Sweetness", score: 5 },
      { label: "Fruit", score: 5 },
    ],
    description: [
      "Whole cherry sealed in tanks for around ninety hours before drying, with the temperature logged throughout. The fermentation pushes the fruit a long way past where a washed coffee could go, and the result divides people in this building.",
      "If you like the current wave of loud processed coffee this is one of the better executed examples: the tropical fruit is enormous but it stops short of tasting like solvent, and the sweetness underneath holds it together.",
    ],
    sizes: standardSizes(1700, 5600),
    image: "/images/coffee/cerro-azul.jpg",
    imageAlt: "Dark roasted coffee beans photographed from directly above",
    soldOut: true,
  },
  {
    slug: "nightshift-decaf",
    name: "Nightshift",
    tagline: "Decaf that is not an apology. Sugarcane process, Colombian.",
    country: "Colombia",
    region: "Huila",
    producer: "Descafecol, Manizales — lots from Huila smallholders",
    altitude: "1,600–1,850 m",
    varietal: "Castillo, Colombia",
    process: "Washed",
    roast: "medium",
    notes: ["Red apple", "Caramel", "Walnut"],
    flavour: [
      { label: "Body", score: 4 },
      { label: "Acidity", score: 3 },
      { label: "Sweetness", score: 4 },
      { label: "Fruit", score: 3 },
    ],
    description: [
      "Decaffeinated with ethyl acetate derived from sugarcane fermentation, done in Colombia rather than shipped to Europe and back. The process is gentler on the cup than the solvents it replaced, and the coffee going in is good enough to be worth selling with caffeine in it.",
      "We sell a lot of this to people who want a second cup at four in the afternoon and a lot to people who have been told to stop entirely. It is a proper coffee either way.",
    ],
    sizes: standardSizes(1250, 4000),
    image: "/images/coffee/nightshift.jpg",
    imageAlt: "A cup of black coffee on a dark table, seen from above",
    decaf: true,
  },
];

export function getCoffee(slug: string): Coffee | undefined {
  return coffees.find((coffee) => coffee.slug === slug);
}

export function featuredCoffees(): Coffee[] {
  return coffees.filter((coffee) => coffee.featured);
}

/** The cheapest size, used for the "from £x" line on a card. */
export function fromPence(coffee: Coffee): number {
  return Math.min(...coffee.sizes.map((size) => size.pence));
}

export function getSize(coffee: Coffee, sizeId: string): Size | undefined {
  return coffee.sizes.find((size) => size.id === sizeId);
}

/** Human label for a roast level. Kept next to the data it describes. */
export const ROAST_LABEL: Record<Coffee["roast"], string> = {
  light: "Light",
  "medium-light": "Medium-light",
  medium: "Medium",
  "medium-dark": "Medium-dark",
};

/** Position on the roast scale, 0–3, for the bar on a product page. */
export const ROAST_INDEX: Record<Coffee["roast"], number> = {
  light: 0,
  "medium-light": 1,
  medium: 2,
  "medium-dark": 3,
};
