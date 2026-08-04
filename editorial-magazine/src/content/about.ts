import type { AboutBlock } from "./types";

/** The magazine explaining itself, on /about. */
export const aboutIntro =
  "Meridian began in 2019 as an argument about pace. Everything we wanted to read about cities, craft and land was being published at the speed of news, and almost none of it was about things that move at the speed of news.";

export const aboutBlocks: AboutBlock[] = [
  {
    heading: "What we publish",
    body: [
      "Long stories about the built and grown world: the decisions that rearrange a city, the work that is still done by hand because hands are genuinely better at it, and the land underneath both.",
      "We run between nine and twelve stories an issue. A typical one takes four months and involves at least two visits. The story about Nieuwhaven took eleven months, three trips and one abandoned draft, which is unusual but not rare.",
    ],
  },
  {
    heading: "How we pay for it",
    body: [
      "Subscriptions, and nothing else. There is no advertising in the magazine or on the site, no sponsored content, no affiliate links and no proprietor with an interest in what we conclude.",
      "This is not a moral position so much as a practical one. A magazine that takes eleven months over a story cannot also promise an advertiser a publication date.",
    ],
  },
  {
    heading: "Corrections",
    body: [
      "We correct errors at the top of the story, dated, describing what was wrong rather than quietly fixing it. If we have got something wrong, write to us and we will say so in public.",
      "Since 2019 we have published forty-one corrections. Two of them were serious enough that we asked the subject to review the amended text before it went up.",
    ],
  },
  {
    heading: "Where we are",
    body: [
      "The magazine is registered in Nairobi and has no office. Six of us work on it, in five countries, and we meet twice a year in whichever city has the cheapest flights that month.",
      "Post reaches us care of the subscription address on the back of the print edition, and is genuinely read.",
    ],
  },
];

/** The one-line honesty note that sits in the footer of every page. */
export const disclaimer =
  "Meridian is a fictional magazine, made as a website template. The publication, its writers, the people quoted, the places described and every number on this site are invented.";
