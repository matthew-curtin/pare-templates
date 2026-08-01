import type { Feature, Step } from "./types";

export const features: Feature[] = [
  {
    id: "wind-down",
    title: "A wind-down that starts itself",
    summary:
      "Lull dims, quietens and reminds you at the same time every night.",
    description:
      "Pick a bedtime and Lull takes over the hour before it. The screen warms, notifications go quiet, and a short routine appears — a breathing exercise, a stretch, a page of something slow. You're not deciding what to do at eleven at night; the decision was already made.",
    icon: "moon",
    points: [
      "Fades your screen warm over the last hour",
      "Silences everything except the people you choose",
      "A different three-minute routine each night, so it doesn't go stale",
      "Skips itself on the nights you're out",
    ],
  },
  {
    id: "sound",
    title: "Sound that doesn't loop",
    summary: "Four hundred hours of rain, water and quiet stories.",
    description:
      "Every track in the library is recorded long and mixed to drift, so you never hear the seam where it starts again. Set a fade and it lowers itself over twenty minutes rather than cutting out and waking you up.",
    icon: "wave",
    points: [
      "Rain, water, wind, fire and room tone",
      "Sleep stories read slowly, and left unfinished on purpose",
      "Mix two tracks together and save it as your own",
      "Fades out over 10, 20 or 45 minutes",
    ],
  },
  {
    id: "alarm",
    title: "An alarm that waits for the right moment",
    summary: "It watches for light sleep and wakes you inside your window.",
    description:
      "Give Lull a half-hour window instead of a single minute. It listens for movement and breathing, finds the lightest point in that window, and wakes you there — with light first, then sound, over ninety seconds.",
    icon: "alarm",
    points: [
      "A window, not a minute",
      "Light for ninety seconds before any sound",
      "Falls back to the end of the window, so you're never late",
      "A separate weekend schedule",
    ],
  },
  {
    id: "insight",
    title: "Numbers you can act on",
    summary: "Four things that actually moved your sleep, not forty charts.",
    description:
      "Lull records the night and then does the harder part: telling you which of your habits made a difference. It looks for patterns across weeks rather than reacting to a single bad night, and it says so in a sentence.",
    icon: "chart",
    points: [
      "Time asleep, time awake, and how long you took to drop off",
      "One weekly note in plain language",
      "Compare a month against the one before it",
      "Export everything as CSV whenever you want",
    ],
  },
  {
    id: "offline",
    title: "Works with the phone face down",
    summary: "Download what you need. Nothing has to leave the device.",
    description:
      "Sound downloads for offline use, and recording a night never needs a connection. If you turn off sync, the recording stays on your phone and is never uploaded anywhere.",
    icon: "offline",
    points: [
      "Download any track, or a whole collection",
      "Recording works in aeroplane mode",
      "Sync is optional and off until you turn it on",
      "Delete a night, and it's gone from every device",
    ],
  },
  {
    id: "wearables",
    title: "Reads your watch, if you wear one",
    summary: "Better numbers when you have a wearable. Fine without one.",
    description:
      "Lull works using the phone on the mattress alone. Pair a watch and it uses heart rate as well, which sharpens both the sleep stages and the moment the alarm picks. Everything else behaves identically.",
    icon: "watch",
    points: [
      "Apple Watch and Wear OS",
      "Reads from Apple Health and Health Connect",
      "Silent wrist alarm, so you don't wake anyone else",
      "Never required — the phone alone is enough",
    ],
  },
];

/** The three-step sequence on the home page. */
export const steps: Step[] = [
  {
    title: "Tell it when you want to be up",
    description:
      "One number. Lull works backwards from there to build the evening — when to start winding down, when to put the light out.",
  },
  {
    title: "Put the phone on the mattress",
    description:
      "Face down, on the corner of the bed. It listens for movement and breathing through the night. No band, no strap, nothing to charge.",
  },
  {
    title: "Wake up inside your window",
    description:
      "Light first, then sound, at the lightest point Lull can find. In the morning there's one screen: how you slept, and one thing to try tonight.",
  },
];
