import type { Faq, PricingPlan } from "./types";

export const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    yearly: 0,
    tagline: "For small teams finding their rhythm.",
    cta: "Start for free",
    features: [
      "Up to 10 contributors",
      "2 connected repositories",
      "30 days of history",
      "Weekly email digest",
      "Community support",
    ],
  },
  {
    id: "team",
    name: "Team",
    monthly: 18,
    yearly: 15,
    tagline: "For engineering teams that ship every week.",
    featured: true,
    cta: "Start free trial",
    features: [
      "Unlimited contributors",
      "Unlimited repositories",
      "12 months of history",
      "Review insights and stale PR alerts",
      "Slack and webhook delivery",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    yearly: null,
    tagline: "For organisations with security and scale requirements.",
    cta: "Talk to sales",
    features: [
      "Everything in Team",
      "SAML single sign-on and SCIM",
      "Regional data residency",
      "Audit log export",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
  },
];

export const pricingFaqs: Faq[] = [
  {
    question: "How does the free trial work?",
    answer:
      "Every paid plan starts with a 14-day trial. No card is required to begin, and nothing is charged until you decide to keep going.",
  },
  {
    question: "What counts as a contributor?",
    answer:
      "Anyone who authored or reviewed a change in the billing month. People who only read reports are always free, so managers and stakeholders never add to your bill.",
  },
  {
    question: "Can we change plans later?",
    answer:
      "Yes, at any time. Upgrades take effect immediately and we prorate the difference. Downgrades apply at the start of your next billing period.",
  },
  {
    question: "Do you offer discounts?",
    answer:
      "Annual billing saves roughly two months. We also offer discounted pricing for registered non-profits and for teams at companies under ten people.",
  },
  {
    question: "Where is our data stored?",
    answer:
      "In the region you choose at setup — currently the United States, the European Union or Australia. Enterprise plans can pin data to a single region permanently.",
  },
  {
    question: "How do we cancel?",
    answer:
      "From your billing settings, in one click, with no phone call. You keep access until the end of the period you have already paid for.",
  },
];
