import type { Supplier } from "./types.ts";

/**
 * Nine accounts. Everything here is invented — the firms, the towns and
 * the lead times — but the SHAPE is the thing that matters: a workshop
 * buys fasteners from someone round the corner who delivers in four
 * days and wound hub shells from a specialist who takes six and a half
 * weeks, and no amount of chasing changes which is which.
 */
export const suppliers: Supplier[] = [
  {
    id: "boutenmoer",
    name: "Bout & Moer",
    place: "Merwesluis",
    note: "Fasteners, ferrules, spade terminals. Two streets away, and they will drop a box round the same afternoon if we run out mid-build — which is the only reason a shop can hold four days of bolts and sleep at night.",
    typicalLead: 4,
  },
  {
    id: "noordkant",
    name: "Noordkant Onderdelen",
    place: "Rotterdam",
    note: "The general components account: brakes, drivetrain, contact points, tyres. Everything here has an alternative, which is why nothing here has ever held up a frame.",
    typicalLead: 10,
  },
  {
    id: "bergen",
    name: "Bergen Wielen",
    place: "Deventer",
    note: "Rims, spokes cut to length, and brass nipples by the thousand. We buy nipples in units of two thousand and still manage to be the reason a bike is not finished.",
    typicalLead: 12,
  },
  {
    id: "houtwerk",
    name: "Houtwerk van Dijk",
    place: "Sliedrecht",
    note: "Ash for the cargo decks, kiln-dried and cut to the slat. Seasonal: they will not sell green timber, and we would not buy it.",
    typicalLead: 16,
  },
  {
    id: "stellinga",
    name: "Stellinga Metaalwerk",
    place: "Merwesluis",
    note: "Machined steel — dropouts, head tubes, bottom bracket shells, carrier tube sets. Three weeks because they batch our work in with everybody else's, which is also why it costs what it does.",
    typicalLead: 21,
  },
  {
    id: "elektrolicht",
    name: "Elektrolicht",
    place: "Eindhoven",
    note: "Dynamo lamps front and rear, and the wire between them. A lamp is the one component on this bike we do not think we could better ourselves.",
    typicalLead: 24,
  },
  {
    id: "vanacker",
    name: "Van Acker Coatings",
    place: "Dordrecht",
    note: "Powder coating, outworked. Frames go over on a Tuesday and come back the following week — an operation rather than a part, which is why it appears in the tree with no stock against it.",
    typicalLead: 9,
  },
  {
    id: "kamphuis",
    name: "Kamphuis Buizen",
    place: "Zwijndrecht",
    note: "Drawn steel tube sets, cut and mitred to our drawings. Five weeks, and the first question every new customer asks is whether we could go faster by paying more. We could not; it is a mill run.",
    typicalLead: 35,
  },
  {
    id: "wikkelwerk",
    name: "Wikkelwerk",
    place: "Delft",
    note: "Hub shells, wound by hand. Six and a half weeks, one of them, every time — and the whole delivery date of both bikes is decided by this one line of this one account.",
    typicalLead: 45,
  },
];

export const supplierById = new Map(suppliers.map((s) => [s.id, s]));
