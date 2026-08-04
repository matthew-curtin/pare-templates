import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { coffees, fromPence } from "@/content/coffees";
import { plans, subscribeFaq, subscribeIntro } from "@/content/pages";
import { applyDiscount, formatPence } from "@/lib/money";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Pick a frequency and a grind. We choose the coffee, roast it the night before, and post it.",
};

export default function SubscribePage() {
  // Priced against the House blend, which is what a subscription
  // defaults to — so the number on the card is one somebody could
  // actually pay rather than an average of things.
  const house = coffees.find((c) => c.slug === "ridgeline-house") ?? coffees[0];
  const basePence = fromPence(house);

  return (
    <>
      <PageHeader
        eyebrow="Subscriptions"
        title={subscribeIntro.title}
        description={subscribeIntro.body}
      />

      <Container width="wide" className="py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => {
            const perBag = applyDiscount(basePence, plan.discountPercent);
            return (
              <div
                key={plan.id}
                className={`flex h-full flex-col rounded-xl border p-7 ${
                  plan.featured
                    ? "border-accent shadow-[0_0_0_1px_var(--color-accent)]"
                    : "border-line"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl font-bold">
                    {plan.name}
                  </h2>
                  {plan.featured && (
                    <span className="eyebrow rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                      Most picked
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-ink-subtle">{plan.cadence}</p>

                <p className="tnum mt-6">
                  <span className="font-display text-4xl font-bold">
                    {formatPence(perBag)}
                  </span>
                  <span className="ml-2 text-sm text-ink-subtle">
                    per 250 g bag
                  </span>
                </p>
                <p className="tnum mt-1 text-sm text-ink-subtle">
                  <s>{formatPence(basePence)}</s> — save {plan.discountPercent}%
                </p>

                <p className="mt-5 flex-1 text-sm leading-relaxed text-ink-muted">
                  {plan.blurb}
                </p>

                <button
                  type="button"
                  className={`mt-7 w-full rounded-full px-5 py-3 font-semibold transition-colors ${
                    plan.featured
                      ? "bg-accent text-ink-inverse hover:bg-accent-hover"
                      : "border border-line-strong hover:border-accent hover:text-accent"
                  }`}
                >
                  Start {plan.name.toLowerCase()}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-ink-subtle">
          Prices shown against the House blend. Single lots cost a little more.
          Nothing on this page takes a payment — it is a template.
        </p>

        {/* How it works */}
        <div className="mt-16 grid gap-8 border-t border-line pt-12 sm:grid-cols-3">
          {[
            {
              step: "One",
              title: "Pick a rhythm",
              body: "Weekly, fortnightly or monthly, and the grind you brew with.",
            },
            {
              step: "Two",
              title: "We choose the bag",
              body: "Whatever is best that week. Pin it to one coffee if you would rather.",
            },
            {
              step: "Three",
              title: "Roasted Monday, posted Tuesday",
              body: "Skip, pause or cancel any time before the Sunday.",
            },
          ].map((item) => (
            <div key={item.step}>
              <p className="eyebrow text-accent">{item.step}</p>
              <h3 className="mt-2 font-display text-xl font-bold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-2xl font-bold">
            Questions people actually ask
          </h2>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {subscribeFaq.map((item) => (
              <div key={item.question} className="py-5">
                <dt className="font-semibold">{item.question}</dt>
                <dd className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Or just buy a bag →
          </Link>
        </div>
      </Container>
    </>
  );
}
