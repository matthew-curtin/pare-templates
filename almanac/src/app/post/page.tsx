import type { Metadata } from "next";
import Link from "next/link";
import { RuleLabel } from "@/components/chips";
import { ListingComposer } from "@/components/listing-composer";
import { postingRules, priceTiers } from "@/content/about";
import { formatMoney } from "@/lib/pay";

export const metadata: Metadata = {
  title: "Advertise a vacancy",
  description:
    "Prices, what a listing has to include, and a composer that shows you exactly how it will look on the board.",
};

export default function PostPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="border-b border-line-strong pb-5">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          Advertise a vacancy
        </h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">
          Thirty days on the board, in the alerts, and on your
          organisation&rsquo;s page. One of us reads every listing before
          it goes up, which usually takes a few hours and never more than
          a working day.
        </p>
      </header>

      <section id="prices" className="mt-10 scroll-mt-6">
        <RuleLabel>Prices</RuleLabel>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {priceTiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col rounded-card border p-5 ${
                tier.highlight
                  ? "border-accent-ring bg-surface"
                  : "border-line bg-surface"
              }`}
            >
              <h3 className="font-serif text-lg font-semibold">{tier.name}</h3>
              <p className="tabular mt-2 text-2xl font-semibold text-ink">
                {formatMoney(tier.price)}
                <span className="text-sm font-normal text-ink-subtle">
                  {" "}
                  · {tier.duration}
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {tier.blurb}
              </p>
              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {tier.includes.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-3 shrink-0 bg-line-strong"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-subtle">
          Prices exclude VAT. We invoice on publication, at thirty days.
        </p>
      </section>

      <section className="mt-12">
        <RuleLabel>What a listing has to include</RuleLabel>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {postingRules.map((rule) => (
            <li
              key={rule}
              className="flex gap-3 rounded-card border border-line bg-surface p-3 text-sm leading-relaxed text-ink-muted"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1 w-3 shrink-0 bg-line-strong"
              />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-ink-subtle">
          The reasoning behind the first one is on the{" "}
          <Link href="/about#policy" className="focus-ring text-accent underline">
            about page
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <RuleLabel>Write it here</RuleLabel>
        <p className="mt-2 mb-6 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Nothing is sent anywhere — this is a template. But the preview
          is real: it is the card the board draws, doing the same
          arithmetic, so what you see is what a reader would see.
        </p>
        <ListingComposer />
      </section>
    </div>
  );
}
