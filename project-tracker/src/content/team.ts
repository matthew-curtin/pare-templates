import type { Member } from "./types";

/**
 * The workspace's members.
 *
 * Avatars are drawn from `initials` rather than photographed. A real
 * face attached to an invented person sits badly, and it means this
 * template ships no image files at all.
 *
 * `capacity` is points per two-week cycle. The team page compares it
 * against what each person is actually carrying.
 *
 * These numbers are tuned so that exactly ONE person is over — Priya,
 * who picked up the thirteen-point migration. That is deliberate: if
 * everybody is over, the warning state stops meaning anything and the
 * board reads as broken data rather than as a busy team. A template has
 * to show a feature working, not just present.
 */
export const members: Member[] = [
  {
    id: "priya",
    name: "Priya Raghunathan",
    role: "Engineering lead",
    initials: "PR",
    capacity: 14,
  },
  {
    id: "amara",
    name: "Amara Osei",
    role: "Senior engineer",
    initials: "AO",
    capacity: 18,
  },
  {
    id: "jonas",
    name: "Jonas Weiler",
    role: "Engineer",
    initials: "JW",
    capacity: 16,
  },
  {
    id: "mei",
    name: "Mei Lundqvist",
    role: "Engineer",
    initials: "ML",
    capacity: 15,
  },
  {
    id: "tomas",
    name: "Tomas Beck",
    role: "Product designer",
    initials: "TB",
    capacity: 12,
  },
  {
    id: "simone",
    name: "Simone Fontana",
    role: "Product manager",
    initials: "SF",
    capacity: 6,
  },
];

export const memberById = new Map(members.map((m) => [m.id, m]));
