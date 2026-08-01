import type { Faq, TeamMember } from "./types";

export const team: TeamMember[] = [
  {
    name: "Elena Marsh",
    role: "Co-founder & CEO",
    bio: "Spent a decade leading platform teams and building the same spreadsheet at every job. Started Cadence to stop rebuilding it.",
    photo: "/images/team/elena.jpg",
  },
  {
    name: "Sam Adeyemi",
    role: "Co-founder & CTO",
    bio: "Distributed systems engineer. Cares more about the honesty of a metric than the beauty of the chart it sits in.",
    photo: "/images/team/sam.jpg",
  },
  {
    name: "Marco Reyes",
    role: "Head of Design",
    bio: "Believes a dashboard that needs a training session is a dashboard that failed. Previously design lead at two developer tools companies.",
    photo: "/images/team/marco.jpg",
  },
  {
    name: "Theo Lindqvist",
    role: "Head of Customer Engineering",
    bio: "Has onboarded several hundred teams and can usually name your bottleneck before the first sync finishes.",
    photo: "/images/team/theo.jpg",
  },
];

export const values = [
  {
    title: "Measure the system, not the person",
    body: "Individual leaderboards make people optimise for the metric instead of the work. Every number we report is about the process, and that constraint has shaped the product more than any other decision.",
  },
  {
    title: "A number needs a story",
    body: "A figure with no explanation gets misread. Wherever we show a metric we try to show what moved it, so the conversation starts from something real.",
  },
  {
    title: "Boring reliability",
    body: "This is a tool people check on a Monday morning. It should be dull, fast and correct, and it should not be the reason anyone's week starts badly.",
  },
];

export const companyFaqs: Faq[] = [
  {
    question: "Are you hiring?",
    answer:
      "Usually. We are a small remote team across Europe and North America, and we list open roles on our careers page as they come up.",
  },
  {
    question: "Are you funded?",
    answer:
      "We raised a seed round in 2024 and have been deliberate about growth since. The company is small on purpose.",
  },
  {
    question: "Do you use Cadence yourselves?",
    answer:
      "Every day. The weekly digest goes to the whole company, and a fair number of features started as something we wanted on a Monday morning.",
  },
];
