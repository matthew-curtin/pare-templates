import type { Post } from "./types";

/** Newest first. The blog index renders these in order. */
export const posts: Post[] = [
  {
    slug: "cycle-time-is-not-a-target",
    title: "Cycle time is a thermometer, not a target",
    excerpt:
      "The moment you set a cycle time goal, you stop measuring how work flows and start measuring how well people game a number.",
    date: "2026-07-16",
    category: "Metrics",
    readingMinutes: 6,
    author: { name: "Elena Marsh", role: "Co-founder & CEO" },
    cover: "/images/blog/cycle-time.jpg",
    coverAlt: "Five small pastel alarm clocks arranged on a white surface",
    body: [
      {
        type: "paragraph",
        text: "Every team that starts measuring delivery eventually arrives at cycle time — the stretch between starting a piece of work and getting it in front of users. It is a genuinely useful number. It is also the number most likely to be quietly ruined within a quarter of adopting it.",
      },
      {
        type: "paragraph",
        text: "The ruin is always the same shape. Someone puts cycle time on a slide. Someone else asks why it went up. Within a month, work is being sliced into smaller pieces not because that helps anyone, but because smaller pieces move the average down.",
      },
      { type: "heading", text: "What the number is actually for" },
      {
        type: "paragraph",
        text: "Cycle time is a thermometer. It tells you something is wrong; it does not tell you what. A fever is information, but nobody treats a fever by holding ice to the thermometer.",
      },
      {
        type: "quote",
        text: "When a measure becomes a target, it ceases to be a good measure.",
        attribution: "Goodhart's law, roughly",
      },
      {
        type: "paragraph",
        text: "Used well, a rise in cycle time is the beginning of a conversation. Which stage got longer? Was it one team or all of them? Did it coincide with a reorganisation, a release freeze, a departure? The number is the prompt for those questions, and it is worth very little on its own.",
      },
      { type: "heading", text: "Three healthier ways to use it" },
      {
        type: "list",
        items: [
          "Break it into stages. A cycle time of nine days means nothing; seven of those days sitting in review means quite a lot.",
          "Watch the spread, not the average. A team with a consistent five days is in far better shape than one averaging four with a long tail of thirty.",
          "Compare a team to its own past, never to another team. Different work has different natural rhythms and cross-team league tables punish the people doing the hardest problems.",
        ],
      },
      { type: "heading", text: "When to actually worry" },
      {
        type: "paragraph",
        text: "Sustained upward drift over two or three months, in a team whose work has not obviously changed, is worth investigating. A single bad fortnight almost never is. Most of the alarming spikes we see turn out to be a holiday, an incident, or one large piece of work that was always going to take a while.",
      },
      {
        type: "paragraph",
        text: "The teams that get the most out of this are the ones who treat the chart as a question rather than a verdict. Ask what happened before deciding what it means.",
      },
    ],
  },
  {
    slug: "review-is-a-cultural-problem",
    title: "Slow code review is a cultural problem wearing a process costume",
    excerpt:
      "Teams try to fix review with rules and automation. It usually turns out to be about who feels allowed to say no.",
    date: "2026-06-28",
    category: "Practice",
    readingMinutes: 8,
    author: { name: "Yuki Tanaka", role: "Engineering Manager" },
    cover: "/images/blog/review.jpg",
    coverAlt: "Two colleagues talking over a laptop in a bright office",
    body: [
      {
        type: "paragraph",
        text: "Ask a team why review is slow and you will hear about process. Not enough reviewers. No rotation. Notifications getting lost. All of that is real, and none of it is usually the reason.",
      },
      {
        type: "paragraph",
        text: "Sit in on the actual reviews and a different picture shows up. Changes sit because nobody wants to be the person who blocks a colleague. Or they sit because the only person who understands that part of the system is the person who wrote it, and everyone knows it.",
      },
      { type: "heading", text: "The signals worth watching" },
      {
        type: "list",
        items: [
          "Time to first comment, not time to merge. A change that gets a response in an hour and merges in two days is healthy. One that sits silent for two days and merges in three is not.",
          "How many reviews land on the same two people. Concentration is the strongest predictor of a slowdown when someone takes leave.",
          "How often a review is a single approval with no comments. Sometimes that is trust. Often it is a rubber stamp.",
        ],
      },
      { type: "heading", text: "What actually helped" },
      {
        type: "paragraph",
        text: "The intervention that worked best for us was unglamorous: we made it explicit that a review could end in questions rather than a verdict. Reviewers stopped feeling they had to render judgement, and changes started getting looked at much sooner.",
      },
      {
        type: "paragraph",
        text: "The second was capping work in progress. When everyone has four open changes, reviewing someone else's is always the fifth priority. Lower the cap and review stops competing with authoring.",
      },
      {
        type: "quote",
        text: "We did not make review faster. We made it less frightening, and it got faster on its own.",
      },
      {
        type: "paragraph",
        text: "Automation still has a place. Assigning reviewers automatically removes a small daily decision, and reminding someone about a change that has been open for three days is genuinely useful. But automation applied to a trust problem just produces faster reminders about the same stuck work.",
      },
    ],
  },
  {
    slug: "what-we-refuse-to-measure",
    title: "What we refuse to measure, and why",
    excerpt:
      "A short list of the metrics customers ask us for that we have decided not to build.",
    date: "2026-06-09",
    category: "Product",
    readingMinutes: 5,
    author: { name: "Sam Adeyemi", role: "Co-founder & CTO" },
    cover: "/images/blog/refuse.jpg",
    coverAlt: "A blank notebook and pencil laid out on a dark blue desk",
    body: [
      {
        type: "paragraph",
        text: "We get asked for individual productivity scores about once a fortnight. It is a reasonable-sounding request and we have said no to it every time. Here is the list of things we will not build, and the reasoning, so nobody has to guess.",
      },
      { type: "heading", text: "Lines of code, in any form" },
      {
        type: "paragraph",
        text: "Including the dressed-up versions: weighted diffs, complexity-adjusted output, churn scores. Deleting code is often the best work anyone does all month, and every one of these measures punishes it.",
      },
      { type: "heading", text: "Individual rankings" },
      {
        type: "paragraph",
        text: "We report at team level. The instant a per-person leaderboard exists, it ends up in a performance review, and from that moment every number in the system starts being managed rather than measured. This one constraint has cost us deals and we would make the same call again.",
      },
      { type: "heading", text: "Anything derived from working hours" },
      {
        type: "paragraph",
        text: "Commit timestamps are a terrible proxy for effort and a worse proxy for commitment. We do surface after-hours patterns at team level as a burnout signal, but never attached to a name.",
      },
      { type: "heading", text: "What we build instead" },
      {
        type: "list",
        items: [
          "Where work waits, broken out by stage",
          "How predictable a team's delivery is over time",
          "Where knowledge is concentrated in one person",
          "Which parts of the codebase slow every change that touches them",
        ],
      },
      {
        type: "paragraph",
        text: "All four are about the system rather than the people inside it, and all four point at something a team can actually change on a Monday.",
      },
    ],
  },
  {
    slug: "onboarding-ramp",
    title: "How long should it take a new engineer to ship?",
    excerpt:
      "We looked at first-commit-to-first-deploy across a few hundred teams. The spread was much wider than we expected.",
    date: "2026-05-24",
    category: "Research",
    readingMinutes: 7,
    author: { name: "Theo Lindqvist", role: "Head of Customer Engineering" },
    cover: "/images/blog/onboarding.jpg",
    coverAlt: "A person working on a laptop at a counter in a bright modern office",
    body: [
      {
        type: "paragraph",
        text: "Onboarding is one of the few things every engineering organisation does and almost nobody measures. We were curious what the real distribution looked like, so we went and found out across a large anonymised sample.",
      },
      { type: "heading", text: "The headline numbers" },
      {
        type: "list",
        items: [
          "Median time to first merged change: 4 days",
          "Median time to first production deploy: 11 days",
          "Median time to a steady pace matching the team: 9 weeks",
        ],
      },
      {
        type: "paragraph",
        text: "That last figure surprised us most. Nine weeks is a long time, and it is roughly triple what the managers we spoke to guessed when we asked them beforehand.",
      },
      { type: "heading", text: "What separated the fast teams" },
      {
        type: "paragraph",
        text: "It was not documentation quality, which was the thing we expected. The strongest correlation was whether a new joiner had a specific named person to ask, and whether that person had explicit time set aside for it.",
      },
      {
        type: "quote",
        text: "The teams that onboarded fastest treated the first fortnight as the buddy's job, not the new person's.",
      },
      {
        type: "paragraph",
        text: "Second was the size of the first task. Teams that handed over something small, real and shippable in week one consistently beat teams that started with a fortnight of reading. Both groups read the same amount in the end; the order simply mattered.",
      },
      { type: "heading", text: "A caveat worth stating" },
      {
        type: "paragraph",
        text: "This is observational, drawn from teams who had already chosen to measure their own delivery, which is not a random sample of the industry. Treat the numbers as a rough shape rather than a benchmark to hold anyone to.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
