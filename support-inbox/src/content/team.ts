import type { Member } from "./types";

/**
 * The support team.
 *
 * Ama has nothing assigned, deliberately. A dashboard where every
 * person has work in flight never shows what the empty case looks
 * like — CONVENTIONS §7b — and "started on Monday" is the honest
 * reason for it rather than a gap in the data.
 */
export const team: Member[] = [
  {
    id: "m-nadia",
    name: "Nadia Osei",
    role: "Support lead",
    initials: "NO",
    email: "nadia@thornburyaudio.example",
  },
  {
    id: "m-tom",
    name: "Tom Baird",
    role: "Support",
    initials: "TB",
    email: "tom@thornburyaudio.example",
  },
  {
    id: "m-priya",
    name: "Priya Raman",
    role: "Support",
    initials: "PR",
    email: "priya@thornburyaudio.example",
  },
  {
    id: "m-jonas",
    name: "Jonas Feld",
    role: "Technical support",
    initials: "JF",
    email: "jonas@thornburyaudio.example",
  },
  {
    id: "m-ruth",
    name: "Ruth Callan",
    role: "Returns and billing",
    initials: "RC",
    email: "ruth@thornburyaudio.example",
  },
  {
    id: "m-ama",
    name: "Ama Boateng",
    role: "Support · started Monday",
    initials: "AB",
    email: "ama@thornburyaudio.example",
  },
];
