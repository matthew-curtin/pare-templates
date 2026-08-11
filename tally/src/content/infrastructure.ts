/**
 * The metal.
 *
 * Every claim on this page is one a photograph on it is asked to settle —
 * see CREDITS.md. That is the §6 test applied at authoring time rather
 * than afterwards: if a paragraph makes an assertion no picture supports,
 * either the picture is decoration or the paragraph is a brochure.
 */

export const INFRA_INTRO = [
  "We buy the machines, we rack them, and when a transfer switch does not close at nine in the morning it is our transfer switch.",
  "That is a commercial decision rather than an ideological one — at our size the margin on rented capacity is larger than the margin on running it — and it has one consequence worth publishing: when something physical fails, the post-mortem can say what part it was.",
];

export interface Claim {
  id: string;
  title: string;
  body: string;
  /** The figure the page prints beside it, and its unit. */
  figure: string;
  unit: string;
}

export const REDUNDANCY: Claim[] = [
  {
    id: "power",
    title: "Two utility feeds and a generator per zone",
    body: "Every zone takes power from two independent utility feeds and carries a generator sized for the whole zone. In June the generator serving one zone in Ashburn started, ran for twenty-two minutes and was connected to nothing, because a control relay fitted during a maintenance window had the right rating and the wrong coil voltage. Transfer tests now run under load.",
    figure: "2 + 1",
    unit: "feeds plus a generator, per zone",
  },
  {
    id: "network",
    title: "Three transit providers, and probes outside all of them",
    body: "Each site buys transit from three providers and peers publicly where there is an exchange. That is ordinary. What is not is where we watch from: our external probes run on four networks we buy nothing from, because in June a provider withdrew our European routes and every probe inside the other two saw a perfectly healthy network.",
    figure: "3",
    unit: "transit providers per site",
  },
  {
    id: "storage",
    title: "Erasure coding across zones, not copies",
    body: "Objects are split into twelve data and four parity fragments spread across every zone in the region, so a whole zone can be lost without a read failing. It is why April's failed drive produced slow reads rather than missing ones — reconstruction is the normal operation of the system, not the emergency.",
    figure: "12 + 4",
    unit: "data and parity fragments",
  },
  {
    id: "cooling",
    title: "Free cooling wherever the climate pays for it",
    body: "Hillsboro runs on outside air for about two hundred and ten days of an average year and Ashburn for around ninety. Chillers exist in both and are a fallback rather than the design. Nothing in the published record has been caused by cooling, which is worth saying precisely because it is the failure everyone expects.",
    figure: "210",
    unit: "days a year of free cooling in Hillsboro",
  },
];

export const HARDWARE = [
  { label: "Compute hosts", value: "Dual-socket, 512 GB, NVMe only" },
  { label: "Storage nodes", value: "60-bay, spinning, NVMe write cache" },
  { label: "Rack density", value: "8–14 kW, hot aisle contained" },
  { label: "Network fabric", value: "Leaf-spine, 100G to the host" },
  { label: "Oldest hardware in service", value: "Six years, in Ashburn" },
  { label: "Replacement cycle", value: "Five years for compute, seven for storage" },
];

export const SITE_NOTE =
  "Frankfurt is edge only until Q4, when compute and object storage follow. It is our first new site in three years and the turn-up is in the incident history above, listed as maintenance, because it moved European traffic around for ninety minutes and pretending otherwise would make the record less useful.";
