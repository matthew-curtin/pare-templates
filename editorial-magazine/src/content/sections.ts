import type { Section } from "./types";

/**
 * The three departments the magazine is organised into. A story
 * belongs to exactly one, by slug.
 */
export const sections: Section[] = [
  {
    slug: "cities",
    name: "Cities",
    summary: "How places get rearranged, and who by.",
    description:
      "Cities are the largest thing most people help build, and almost nobody remembers deciding to. This section is about the decisions anyway — the zoning line, the ferry timetable, the one-way street that emptied a parade of shops.",
  },
  {
    slug: "craft",
    name: "Craft",
    summary: "Things still made slowly, by people who can explain why.",
    description:
      "Not nostalgia. The work in this section survives because it is genuinely better at something — a bell that rings true for four hundred years, a joint that outlives the glue. We are interested in what the makers know that the factory does not.",
  },
  {
    slug: "land",
    name: "Land",
    summary: "The ground underneath everything else.",
    description:
      "Farms, forests, salt flats and floodplains, and the people reading them for a living. Land changes on a timescale that makes news reporting useless, which is precisely why it wants long stories.",
  },
];

export function getSection(slug: string): Section | undefined {
  return sections.find((section) => section.slug === slug);
}
