import type { Article, Faq } from "./types";

/**
 * Help-centre articles. Each one gets its own page at
 * /support/[slug], pre-rendered at build time.
 */
export const articles: Article[] = [
  {
    slug: "first-night",
    title: "Setting up your first night",
    summary:
      "What to do the first evening, and what to expect from the numbers.",
    category: "Getting started",
    updated: "2026-07-02",
    body: [
      {
        type: "paragraph",
        text: "Lull needs one thing from you before the first night: the time you want to be awake. Everything else — when the wind-down starts, when the screen warms, when the alarm begins looking for a light moment — is worked backwards from that.",
      },
      { type: "heading", text: "Before you go to bed" },
      {
        type: "steps",
        items: [
          "Open Lull and set your wake time. A window of thirty minutes is a good starting point.",
          "Choose a sound, or skip it — you can add one later from the bedside screen.",
          "Plug the phone in. A night of recording uses about eight per cent of a battery, but the screen stays on dimly and it is better not to find out at six in the morning.",
          "Put the phone face down on the corner of the mattress, on top of the covers rather than under them.",
          "Tap Start night.",
        ],
      },
      {
        type: "note",
        text: "The phone needs to be on the mattress, not the bedside table. It listens for movement through the surface of the bed as well as through the air.",
      },
      { type: "heading", text: "What the first few nights will look like" },
      {
        type: "paragraph",
        text: "The first night is a baseline, not a verdict. Lull is learning what your normal looks like — how much you move, how you breathe when you are properly under — and it will not offer a weekly note until it has five nights to compare.",
      },
      {
        type: "paragraph",
        text: "Expect the stage breakdown to be roughly right and the totals to be close. If you share a bed, see the note on partners below; Lull can usually tell two people apart after about a week, but it is worth telling it there are two of you from the start.",
      },
      { type: "heading", text: "If you share a bed" },
      {
        type: "list",
        items: [
          "Turn on Two in the bed under Settings → Recording. It changes what the app treats as noise.",
          "Keep the phone on your side of the mattress rather than in the middle.",
          "A partner getting up in the night will occasionally show as a wake. Marking it as not-me in the morning teaches it.",
        ],
      },
    ],
  },
  {
    slug: "no-watch",
    title: "Using Lull without a watch",
    summary: "What changes, what doesn't, and how accurate it is.",
    category: "Getting started",
    updated: "2026-06-18",
    body: [
      {
        type: "paragraph",
        text: "Lull is built to work with the phone alone. Nothing is locked behind owning a wearable, and the app does not ask you to buy one.",
      },
      { type: "heading", text: "What the phone can tell on its own" },
      {
        type: "list",
        items: [
          "When you fell asleep and when you woke, usually within a few minutes",
          "How often you woke in the night and roughly how long for",
          "How restless the night was overall",
          "Enough about how deeply you are sleeping to pick a good moment for the alarm",
        ],
      },
      { type: "heading", text: "What a watch adds" },
      {
        type: "paragraph",
        text: "Heart rate. That mainly sharpens two things: the split between light and deep sleep, and the exact minute the alarm chooses inside your window. If you already wear a watch to bed, pair it. If you do not, the phone alone is enough for the app to be useful.",
      },
      {
        type: "note",
        text: "A watch also gives you the silent wrist alarm, which wakes you without waking anyone else in the room. It is the one genuinely watch-only feature.",
      },
    ],
  },
  {
    slug: "alarm-didnt-go-off",
    title: "My alarm didn't go off",
    summary: "The four causes, in the order they're worth checking.",
    category: "Alarm",
    updated: "2026-07-21",
    body: [
      {
        type: "paragraph",
        text: "This is the most serious thing that can go wrong with a sleep app, so it is worth being systematic. In our experience it is almost always one of four things, in this order.",
      },
      { type: "heading", text: "1. The night never started" },
      {
        type: "paragraph",
        text: "The alarm only runs as part of a recorded night. If you set a wake time but did not tap Start night, nothing was scheduled. Open Lull and check whether last night appears in your history — if it does not, this was the cause.",
      },
      { type: "heading", text: "2. Focus or Do Not Disturb silenced it" },
      {
        type: "steps",
        items: [
          "On iPhone: Settings → Focus → Sleep → Apps, and allow Lull.",
          "On Android: Settings → Sound → Do Not Disturb → App exceptions, and allow Lull.",
          "Check any automation that turns a Focus on at a fixed time — that is usually what did it.",
        ],
      },
      { type: "heading", text: "3. Battery optimisation stopped the app" },
      {
        type: "paragraph",
        text: "Some phones aggressively suspend background apps overnight, which stops the recording and takes the alarm with it. Under Settings → Battery, set Lull to unrestricted. On several Android manufacturers this lives under a separate app-management screen rather than the battery one.",
      },
      { type: "heading", text: "4. The phone was not charging and ran flat" },
      {
        type: "paragraph",
        text: "Recording a full night from a low battery can finish the battery before morning. Lull warns you at bedtime if the charge is under thirty per cent and no cable is attached.",
      },
      {
        type: "note",
        text: "If none of these applies, send us the night from History → the night in question → Send diagnostics. It attaches the timing log and nothing else — no audio is recorded or sent at any point.",
      },
    ],
  },
  {
    slug: "cancel-subscription",
    title: "Cancelling your subscription",
    summary: "Two taps, in the store you subscribed through.",
    category: "Account and billing",
    updated: "2026-07-10",
    body: [
      {
        type: "paragraph",
        text: "Subscriptions are handled by the app store you bought through, so cancelling happens there rather than inside Lull. There is no retention flow and nobody you have to email.",
      },
      { type: "heading", text: "On iPhone or iPad" },
      {
        type: "steps",
        items: [
          "Open Settings and tap your name at the top.",
          "Tap Subscriptions.",
          "Tap Lull, then Cancel Subscription.",
        ],
      },
      { type: "heading", text: "On Android" },
      {
        type: "steps",
        items: [
          "Open the Play Store and tap your profile picture.",
          "Tap Payments and subscriptions, then Subscriptions.",
          "Tap Lull, then Cancel subscription.",
        ],
      },
      { type: "heading", text: "What happens next" },
      {
        type: "list",
        items: [
          "You keep Plus until the end of the period you have already paid for.",
          "After that the account moves to Free. Nothing is deleted.",
          "Your full history stays on the device, and stays visible — the fourteen-night limit on Free applies to what syncs, not what you can see.",
          "Downloaded sounds outside the free thirty stop playing, and can be removed from Settings → Downloads.",
        ],
      },
      {
        type: "note",
        text: "If you were charged after cancelling, refunds are handled by the store rather than by us — but tell us anyway and we will chase it with you.",
      },
    ],
  },
  {
    slug: "restore-purchase",
    title: "Restoring Plus on a new phone",
    summary: "When it restores on its own, and what to do when it doesn't.",
    category: "Account and billing",
    updated: "2026-05-29",
    body: [
      {
        type: "paragraph",
        text: "Signing in to Lull with the same account restores Plus automatically, usually before you reach the home screen. If it has not, work through the following.",
      },
      {
        type: "steps",
        items: [
          "Check you are signed in to the same store account you subscribed with — this is the usual cause, especially on a work phone.",
          "Open Settings → Account → Restore purchases in Lull.",
          "If the restore finds nothing, sign out of Lull and back in. Your nights are on the account, not the device, and none are lost.",
        ],
      },
      {
        type: "note",
        text: "Family subscriptions restore per person. Each member signs in with their own account; the plan owner does not need to be involved.",
      },
    ],
  },
  {
    slug: "delete-your-data",
    title: "Deleting your data",
    summary: "How to delete a night, a device or the whole account.",
    category: "Privacy and data",
    updated: "2026-07-14",
    body: [
      {
        type: "paragraph",
        text: "Deletion in Lull is real deletion. A deleted night is removed from every device that has synced, and from our backups within thirty days. It is not archived, hidden or retained in an anonymised form.",
      },
      { type: "heading", text: "A single night" },
      {
        type: "paragraph",
        text: "History → the night → Delete. It disappears from other devices the next time they sync.",
      },
      { type: "heading", text: "Everything on one device" },
      {
        type: "paragraph",
        text: "Settings → Storage → Remove local data. This clears recordings and downloads from that phone but leaves the account alone, which is what you want before selling a device.",
      },
      { type: "heading", text: "The whole account" },
      {
        type: "steps",
        items: [
          "Settings → Account → Delete account.",
          "Confirm with the code we email you. This exists so a lost phone cannot be used to wipe your history.",
          "Everything is removed immediately and purged from backups within thirty days.",
        ],
      },
      {
        type: "note",
        text: "Deleting the account does not cancel a subscription — the store holds that separately. Cancel it first, or you will keep being charged for an account that no longer exists.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/** Articles grouped by category, in the order the categories first appear. */
export function articlesByCategory(): { category: string; items: Article[] }[] {
  const groups: { category: string; items: Article[] }[] = [];
  for (const article of articles) {
    const existing = groups.find((g) => g.category === article.category);
    if (existing) {
      existing.items.push(article);
    } else {
      groups.push({ category: article.category, items: [article] });
    }
  }
  return groups;
}

/** Shown above the article list on /support. */
export const supportFaqs: Faq[] = [
  {
    question: "Does Lull record audio?",
    answer:
      "No. The microphone is used to detect movement and breathing in real time, and the audio is discarded as it is processed — nothing is written to storage and nothing is uploaded. You can turn the microphone off entirely and use motion alone.",
  },
  {
    question: "Will it work if I share a bed?",
    answer:
      "Yes. Turn on Two in the bed under Settings → Recording and keep the phone on your side of the mattress. It takes about a week to reliably tell two people apart.",
  },
  {
    question: "Can I use Lull on a tablet?",
    answer:
      "You can, though a phone is better — a tablet is usually too far from you to pick up breathing reliably. It works well as a second screen for reading your history.",
  },
];
