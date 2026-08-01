import type { Sound } from "./types";

/**
 * The sound library. Six shown on the home page; the whole list on
 * /features. Images live in /public/images/sounds.
 */
export const sounds: Sound[] = [
  {
    id: "rain-on-glass",
    name: "Rain on glass",
    category: "Rain",
    length: "8 hrs",
    description:
      "Steady rain against a window, recorded from the inside on a night with no wind.",
    image: "/images/sounds/rain-on-glass.jpg",
    imageAlt: "Rain running down a dark window pane",
  },
  {
    id: "slow-tide",
    name: "Slow tide",
    category: "Water",
    length: "6 hrs",
    description:
      "A long swell arriving on shingle. Far enough back that no wave arrives sharply.",
    image: "/images/sounds/slow-tide.jpg",
    imageAlt: "Waves washing over a dark shore at dusk",
  },
  {
    id: "pine-wind",
    name: "Pine wind",
    category: "Nature",
    length: "5 hrs",
    description:
      "Wind moving through a stand of pines, high up, with nothing else in the recording.",
    image: "/images/sounds/pine-wind.jpg",
    imageAlt: "Tall pines silhouetted against a clouded evening sky",
  },
  {
    id: "night-room",
    name: "Night room",
    category: "Ambient",
    length: "10 hrs",
    description:
      "The sound of an empty room at three in the morning. Almost nothing, which is the point.",
    image: "/images/sounds/night-room.jpg",
    imageAlt: "A dark bedroom lit only by a lamp",
    premium: true,
  },
  {
    id: "the-long-drive",
    name: "The long drive",
    category: "Stories",
    length: "48 min",
    description:
      "A story about a road trip that never quite arrives. Read slowly, and left unfinished.",
    image: "/images/sounds/the-long-drive.jpg",
    imageAlt: "An empty road disappearing into darkness and mist",
    premium: true,
  },
  {
    id: "low-fire",
    name: "Low fire",
    category: "Ambient",
    length: "7 hrs",
    description:
      "A fire already burnt down to embers. Occasional settling, no crackle to startle you.",
    image: "/images/sounds/low-fire.jpg",
    imageAlt: "Glowing embers in a dying fire",
    premium: true,
  },
];

/** The categories, in the order the app shows them. */
export const soundCategories = [
  "Rain",
  "Water",
  "Nature",
  "Ambient",
  "Stories",
] as const;
