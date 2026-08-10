import type { Spot } from "./types.ts";

/**
 * Underwriting.
 *
 * A non-commercial station does not sell advertisements, it sells
 * acknowledgements: who paid, what they do, where they are, and nothing
 * that sounds like a sales pitch. The copy below is written to that
 * limit on purpose — no prices, no calls to action, no superlatives —
 * because it is the constraint that makes the form what it is.
 *
 * `flightFrom` / `flightTo` are weekdays with Monday at zero. Today is
 * Thursday, so a spot whose flight ended on Wednesday should not be in
 * today's log at all — and one of them is, which `/spots` catches by
 * counting rather than by being told.
 */
export const spots: Spot[] = [
  {
    id: "coop",
    underwriter: "Wren Valley Co-op",
    seconds: 30,
    flightFrom: 0,
    flightTo: 6,
    contractedPerDay: 6,
  },
  {
    id: "boatworks",
    underwriter: "Cape Wren Boatworks",
    seconds: 30,
    flightFrom: 0,
    flightTo: 6,
    contractedPerDay: 5,
  },
  {
    id: "books",
    underwriter: "Harbour Light Books",
    seconds: 30,
    flightFrom: 0,
    flightTo: 6,
    contractedPerDay: 4,
  },
  {
    id: "vet",
    underwriter: "Ridgeway Veterinary",
    seconds: 20,
    flightFrom: 0,
    flightTo: 6,
    contractedPerDay: 3,
  },
  {
    id: "ferry",
    underwriter: "Wren Point Ferry District",
    seconds: 15,
    flightFrom: 0,
    flightTo: 6,
    contractedPerDay: 4,
  },
  {
    id: "physio",
    underwriter: "Coast Line Physical Therapy",
    seconds: 20,
    flightFrom: 0,
    flightTo: 6,
    contractedPerDay: 3,
  },
  {
    id: "chowder",
    underwriter: "Chowder Hall Winter Festival",
    seconds: 30,
    flightFrom: 3,
    flightTo: 5,
    contractedPerDay: 4,
  },
  {
    id: "cider",
    underwriter: "Kestrel Ridge Cider",
    seconds: 30,
    flightFrom: 0,
    flightTo: 2,
    contractedPerDay: 2,
  },
];

export const spotById = new Map(spots.map((s) => [s.id, s]));

export function spotOf(id: string): Spot | undefined {
  return spotById.get(id);
}

/** The acknowledgement as it is read. Kept beside the schedule rather
 *  than inside it, because the words are edited by one person and the
 *  rotation by another, and they should not fight over one file. */
export const spotCopy: Record<string, string> = {
  coop: "Support for Wren 91.5 comes from the Wren Valley Co-op on Cannery Road — member-owned since 1974, open seven days.",
  boatworks:
    "Cape Wren Boatworks, at the head of the slip. Wooden hull repair, rigging and winter storage. On the water since 1961.",
  books:
    "Harbour Light Books on Front Street. New and second-hand, and the tide tables, which they will give you for nothing.",
  vet: "Ridgeway Veterinary, Ferry Road. Small animals and large, with an on-call service for the outer valley.",
  ferry:
    "The Wren Point Ferry District. Sailings on the hour, and the winter timetable is on the board at the slip.",
  physio:
    "Coast Line Physical Therapy, above the hardware store. Backs, shoulders, and the things fishing does to both.",
  chowder:
    "The Chowder Hall Winter Festival, this weekend at the old cannery. Doors at noon, and the hall is warm.",
  cider:
    "Kestrel Ridge Cider, pressed at the farm on the ridge road. The tasting room is open Friday through Sunday.",
};
