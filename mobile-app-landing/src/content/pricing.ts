import type { Faq, PricingPlan } from "./types";

export const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "The whole app, with a smaller library.",
    cta: "Download Lull",
    features: [
      "Sleep recording, every night",
      "Wake window and gentle alarm",
      "Thirty sounds from the library",
      "Your last fourteen nights",
      "No advertising, ever",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 6,
    yearly: 4,
    tagline: "The full library and the whole history.",
    featured: true,
    cta: "Start 30 days free",
    features: [
      "Everything in Free",
      "All four hundred hours of sound",
      "Sleep stories, added weekly",
      "Unlimited history and month-on-month comparison",
      "Mix your own tracks and save them",
      "Offline downloads",
      "Export to CSV",
    ],
  },
  {
    id: "family",
    name: "Family",
    monthly: 10,
    yearly: 7,
    tagline: "Plus, for up to six people.",
    cta: "Start 30 days free",
    features: [
      "Everything in Plus",
      "Up to six accounts",
      "Separate, private histories",
      "One bill, cancel any time",
      "Shared sound collections",
    ],
  },
];

export const pricingFaqs: Faq[] = [
  {
    question: "Is the free plan a trial?",
    answer:
      "No. Free is a permanent plan, not a countdown. Sleep recording, the wake window and the alarm are all in it and always will be — Plus adds the rest of the sound library and the full history.",
  },
  {
    question: "What happens when the 30 days are up?",
    answer:
      "We remind you three days before, and again on the morning it ends. If you do nothing, the subscription starts. If you cancel, the account drops back to Free — nothing is deleted and no night is lost.",
  },
  {
    question: "How do I cancel?",
    answer:
      "Through whichever store you subscribed in, in two taps, at any point. There is no retention flow and nobody to email. See Support for the exact steps on each platform.",
  },
  {
    question: "Do I need a watch?",
    answer:
      "No. Lull is built to work with the phone alone, resting on the mattress. A watch gives it heart rate as well, which sharpens the sleep stages and the moment the alarm picks, but nothing is hidden behind owning one.",
  },
  {
    question: "Can I use one subscription on my phone and my tablet?",
    answer:
      "Yes. Plus covers every device signed in to the same account. Family covers six separate accounts, each with its own private history.",
  },
  {
    question: "What do you do with my sleep data?",
    answer:
      "Nothing. It is not sold, not shared with advertisers and not used to train anything. Sync is off until you turn it on, and with it off a recording never leaves your phone. The privacy policy says this in more detail and in plainer words than most.",
  },
];
