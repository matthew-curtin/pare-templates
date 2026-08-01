import type { LegalDoc } from "./types";

/**
 * Privacy policy and terms, rendered at /legal/[doc].
 *
 * These are written as plain-English placeholders so the page has real
 * shape and length to design against. They are not legal advice and
 * have not been reviewed by a lawyer — replace them before you ship
 * anything to real users.
 */
export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: "2026-07-01",
    intro:
      "Lull records how you sleep, which is about as personal as data gets. This page says exactly what we hold, where it lives and what we do with it — in the plainest words we can manage.",
    body: [
      { type: "heading", text: "What stays on your phone" },
      {
        type: "paragraph",
        text: "Sync is off until you turn it on. With it off, every recorded night lives on your device only. We cannot see it, restore it, or hand it to anybody, because we do not have it.",
      },
      {
        type: "note",
        text: "The microphone is used to detect movement and breathing as they happen. Audio is processed in memory and discarded. No recording is written to storage and none is ever uploaded.",
      },
      { type: "heading", text: "What we hold if you turn sync on" },
      {
        type: "list",
        items: [
          "Your email address, so you can sign in on another device",
          "Your nights: times, stages, movement and wake events — never audio",
          "Which sounds you have downloaded, so they follow you between devices",
          "Crash reports, if you agree to send them, with no sleep data attached",
        ],
      },
      { type: "heading", text: "What we never do" },
      {
        type: "list",
        items: [
          "Sell your data, or share it with advertisers or data brokers",
          "Use your sleep data to train models",
          "Give it to an insurer or an employer",
          "Show you advertising, on any plan",
        ],
      },
      { type: "heading", text: "Deleting things" },
      {
        type: "paragraph",
        text: "Delete a night and it is gone from every synced device. Delete your account and everything is removed immediately and purged from backups within thirty days. There is no archived copy, and no anonymised remainder that we keep.",
      },
      { type: "heading", text: "Companies we rely on" },
      {
        type: "paragraph",
        text: "We use a hosting provider and a payment processor, and where a subscription runs through an app store, that store handles the payment and we never see your card. Each of them holds the minimum needed to do their job.",
      },
      { type: "heading", text: "Your rights" },
      {
        type: "paragraph",
        text: "You can ask for a copy of everything we hold about you, ask us to correct it, or ask us to delete it. Write to privacy@lull.example and we will do it within thirty days, usually much sooner.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of use",
    updated: "2026-07-01",
    intro:
      "The agreement between you and Lull. Short, because it does not need to be long.",
    body: [
      { type: "heading", text: "The account" },
      {
        type: "paragraph",
        text: "You need to be sixteen or over to hold an account. Keep your sign-in details to yourself; anything done from your account is treated as done by you.",
      },
      { type: "heading", text: "Subscriptions" },
      {
        type: "list",
        items: [
          "Plus and Family renew automatically until you cancel them.",
          "Cancel through the app store you subscribed with, at any time.",
          "Cancelling stops the next payment; it does not refund the current period.",
          "If we raise the price, we will tell you at least thirty days before it affects you.",
        ],
      },
      { type: "heading", text: "What Lull is not" },
      {
        type: "note",
        text: "Lull is not a medical device and does not diagnose anything. If you are worried about your sleep, or about a condition such as apnoea, talk to a doctor rather than to an app.",
      },
      { type: "heading", text: "Acceptable use" },
      {
        type: "paragraph",
        text: "Do not attempt to break the service, resell access to it, or reverse-engineer the app. The sound library is licensed for personal listening only — it may not be used in anything you publish or broadcast.",
      },
      { type: "heading", text: "Ending it" },
      {
        type: "paragraph",
        text: "You can close your account whenever you like, from inside the app. We can close an account that is being used to attack the service or to break the law, and we will tell you why.",
      },
      { type: "heading", text: "Changes to these terms" },
      {
        type: "paragraph",
        text: "If we change anything that matters, we will email you and show a notice in the app before it takes effect. Carrying on using Lull after that means you accept the change.",
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}
