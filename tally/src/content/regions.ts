import type { Region } from "../lib/availability.ts";
import { utc } from "../lib/availability.ts";

/**
 * Five regions, all of them our own hardware in leased space.
 *
 * Frankfurt is deliberately the newest: it turns up inside the ninety
 * days the front page draws, which is what gives the edge network a
 * maintenance window in the strip rather than a hypothetical one.
 */
export const REGIONS: Region[] = [
  {
    id: "us-east",
    code: "iad1",
    city: "Ashburn",
    country: "Virginia, US",
    liveFrom: utc(2019, 4, 8),
    note: "Three availability zones on two utility feeds. The oldest site and still the largest — about half of everything we run.",
  },
  {
    id: "us-west",
    code: "pdx1",
    city: "Hillsboro",
    country: "Oregon, US",
    liveFrom: utc(2020, 9, 21),
    note: "Two zones. Built for the hydro tariff and the cool nights; free cooling for two hundred and ten days of an average year.",
  },
  {
    id: "eu-west",
    code: "dub1",
    city: "Dublin",
    country: "Ireland",
    liveFrom: utc(2021, 6, 14),
    note: "Two zones, and the first site where we owned the fibre into the building rather than leasing a wavelength.",
  },
  {
    id: "ap-south",
    code: "sin1",
    city: "Singapore",
    country: "Singapore",
    liveFrom: utc(2023, 2, 27),
    note: "One zone, three transit providers. The furthest from an engineer, which is why everything here is remote-hands rated.",
  },
  {
    id: "eu-central",
    code: "fra1",
    city: "Frankfurt",
    country: "Germany",
    liveFrom: utc(2026, 7, 15, 2, 30),
    note: "Edge only, for now. Turned up this quarter; compute and storage follow in Q4.",
  },
];

export function regionById(id: string): Region {
  const found = REGIONS.find((r) => r.id === id);
  if (!found) throw new Error(`Unknown region: ${id}`);
  return found;
}

export function regionCodes(ids: string[]): string {
  return ids.map((id) => regionById(id).code).join(", ");
}
