import type { Contributor } from "./types";

/**
 * The people whose names appear on stories. Invented, like everything
 * else here — see the note in the footer and the README.
 *
 * Avatars are drawn from `initials` rather than photographs, on
 * purpose: a real face attached to a made-up person is the one part of
 * a template that feels dishonest.
 */
export const contributors: Contributor[] = [
  {
    slug: "ada-fenwick",
    name: "Ada Fenwick",
    role: "Contributing editor",
    based: "Rotterdam",
    bio: "Ada writes about ports, water and the engineering that keeps the two apart. She spent nine years at a coastal planning authority before deciding she would rather describe the decisions than defend them.",
    initials: "AF",
  },
  {
    slug: "jonah-mbeki",
    name: "Jonah Mbeki",
    role: "Staff writer",
    based: "Lisbon",
    bio: "Jonah covers transport and the way a timetable quietly decides who can afford to live where. He is the reason this magazine has a standing rule against the phrase 'transit-oriented'.",
    initials: "JM",
  },
  {
    slug: "ines-caballero",
    name: "Inés Caballero",
    role: "Contributing photographer",
    based: "Oaxaca",
    bio: "Inés photographs workshops, kitchens and the hands in them. She works almost entirely in available light and will wait most of a day for it.",
    initials: "IC",
  },
  {
    slug: "toma-ishikawa",
    name: "Toma Ishikawa",
    role: "Contributing editor",
    based: "Kanazawa",
    bio: "Toma writes about craft, chiefly lacquer and metal. He trained for two years under a lacquer master before concluding, in his words, that he was a far better writer than he was a finisher.",
    initials: "TI",
  },
  {
    slug: "greta-lindqvist",
    name: "Greta Lindqvist",
    role: "Staff writer",
    based: "Skåne",
    bio: "Greta reports on farming and the slow arithmetic of climate — which crops are moving north, which are simply going. She grew up on an apple farm and says she is still not over it.",
    initials: "GL",
  },
  {
    slug: "sam-oduya",
    name: "Sam Oduya",
    role: "Editor",
    based: "Nairobi",
    bio: "Sam founded Meridian in 2019 on the theory that there was room for one more quarterly if it was genuinely unhurried. He edits every story in the magazine and writes about two a year.",
    initials: "SO",
  },
];

export function getContributor(slug: string): Contributor | undefined {
  return contributors.find((person) => person.slug === slug);
}
