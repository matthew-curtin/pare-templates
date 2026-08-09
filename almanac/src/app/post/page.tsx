import type { Metadata } from "next";
import Link from "next/link";
import { Bullet, RuleLabel } from "@/components/chips";
import { ListingComposer } from "@/components/listing-composer";
import { postingRules, priceTiers } from "@/content/about";
import { formatMoney } from "@/lib/pay";

export const metadata: Metadata = {
  title: "Post a job",
  description:
    "Prices, what a posting has to include, and a composer that shows you exactly how it will look on the board.",
};

export default function PostPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Post a job</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Thirty days on the board, in the alerts, and on your
          organization&rsquo;s page. One of us reads every posting before it
          goes up, which usually takes a few hours and never more than a
          business day.
        </p>
      </header>

      <section id="prices" className="mt-12 scroll-mt-24">
        <RuleLabel>Prices</RuleLabel>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {priceTiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col rounded-card bg-surface p-6 shadow-card ${
                tier.highlight ? "ring-1 ring-primary/15" : ""
              }`}
            >
              <h3 className="text-lg font-bold tracking-tight">{tier.name}</h3>
              <p className="tabular mt-2 text-3xl font-extrabold tracking-tight text-ink">
                {formatMoney(tier.price)}
                <span className="text-sm font-medium text-ink-subtle">
                  {" "}
                  · {tier.duration}
                </span>
              </p>
              <p className="mt-3.5 text-sm leading-relaxed text-ink-muted">
                {tier.blurb}
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {tier.includes.map((line) => (
                  <li key={line} className="flex gap-3 text-sm text-ink-muted">
                    <Bullet />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3.5 text-xs text-ink-subtle">
          We invoice on publication, net 30.
        </p>
      </section>

      <section className="mt-14">
        <RuleLabel>What a posting has to include</RuleLabel>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {postingRules.map((rule) => (
            <li
              key={rule}
              className="flex gap-3 rounded-card bg-surface p-4 text-sm leading-relaxed text-ink-muted shadow-card"
            >
              <Bullet />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3.5 text-sm text-ink-subtle">
          The reasoning behind the first one is on the{" "}
          <Link
            href="/about#policy"
            className="focus-ring font-medium text-accent underline underline-offset-2"
          >
            about page
          </Link>
          .
        </p>
      </section>

      <section className="mt-14">
        <RuleLabel>Write it here</RuleLabel>
        <p className="mt-2 mb-8 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Nothing is sent anywhere — this is a template. But the preview is
          real: it is the card the board draws, doing the same arithmetic,
          so what you see is what a reader would see.
        </p>
        <ListingComposer />
      </section>
    </div>
  );
}
