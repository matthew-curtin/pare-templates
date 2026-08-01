import type { Review } from "./types";

/** App-store style reviews. All invented. */
export const reviews: Review[] = [
  {
    id: "r1",
    rating: 5,
    title: "The alarm is the whole thing",
    body: "I have been woken up by an alarm clock every day for twenty years and I did not know it was possible to not hate it. The light comes up first and by the time there is any sound I am already most of the way there.",
    author: "Priya N.",
    source: "iPhone · United Kingdom",
  },
  {
    id: "r2",
    rating: 5,
    title: "Finally one that doesn't nag",
    body: "Every other sleep app I have tried wanted me to log things and gave me a score to feel bad about. This one tells me one thing a week and is right about it more often than not.",
    author: "Daniel O.",
    source: "Android · Canada",
  },
  {
    id: "r3",
    rating: 4,
    title: "Sound library is genuinely good",
    body: "Rain on glass is the only rain recording I have found that does not obviously loop. Knocking a star off because I want to be able to set a different alarm for Saturdays, which I gather is coming.",
    author: "Marta K.",
    source: "iPhone · Poland",
  },
  {
    id: "r4",
    rating: 5,
    title: "It works without a watch",
    body: "I did not want to wear anything to bed, and every app I tried assumed I would. Phone on the corner of the mattress and it has been accurate enough to be useful all month.",
    author: "Tom B.",
    source: "Android · Australia",
  },
];

/** Rating distribution shown next to the reviews, out of 100. */
export const ratingBreakdown = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];
