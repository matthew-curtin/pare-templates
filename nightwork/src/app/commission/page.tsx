import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Masthead } from "@/components/chrome";
import { StockStyle } from "@/components/stock-style";
import { ABOUT, COMMISSION, SITE } from "@/content/site";
import { SHOW_DATA } from "@/lib/show-data";

export const metadata: Metadata = {
  title: "Commission",
  description:
    "Four questions, and the last one is the only one that matters. We come back with a shape and a price before we write a cue.",
};

export default function CommissionPage() {
  const cheapest = [...SHOW_DATA].sort((a, b) => a.costUsd - b.costUsd)[0];
  const dearest = [...SHOW_DATA].sort((a, b) => b.costPerMinute - a.costPerMinute)[0];

  return (
    <>
      <StockStyle emission="gold" />
      <Masthead standfirst={COMMISSION.standfirst} />

      <main className="px-4 sm:px-6 lg:px-10">
        <div className="rule grid gap-12 pt-6 lg:grid-cols-[1.1fr_1fr]">
          <section>
            <h1 className="display">{COMMISSION.heading}</h1>

            {/*
              noValidate, because the error messages below are designed.
              Left on, the browser shows its own bubble instead — one that
              looks nothing like this page and cannot be positioned — and
              the handler's own branches never run (CONVENTIONS §8).
            */}
            <form className="mt-8 space-y-8" noValidate>
              <div className="field-group">
                <label htmlFor="name" className="eyebrow block opacity-60">
                  Who you are
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name and organisation"
                  className="mt-2 w-full border-b border-current/25 bg-transparent py-2 text-lg outline-none placeholder:opacity-35 focus:border-current"
                />
              </div>

              <div className="field-group">
                <label htmlFor="email" className="eyebrow block opacity-60">
                  Where to reply
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full border-b border-current/25 bg-transparent py-2 text-lg outline-none placeholder:opacity-35 focus:border-current"
                />
                <p className="field-hint prose-body mt-2 text-xs opacity-55">
                  An address we can actually reach you on.
                </p>
              </div>

              <fieldset className="picker">
                <legend className="eyebrow opacity-60">What the ground is like</legend>
                <p className="prose-body mt-1 text-sm opacity-65">
                  The distance from where we would fire to the nearest person
                  watching. It decides the largest shell before anything else
                  does — see{" "}
                  <Link href="/sites" className="underline underline-offset-4">
                    sites
                  </Link>
                  .
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COMMISSION.groundOptions.map((option) => (
                    <label
                      key={option.value}
                      className="chip flex cursor-pointer items-center gap-2 px-3.5 py-1.5 text-sm select-none has-checked:bg-[var(--stock-ink)] has-checked:text-[var(--stock-paper)]"
                    >
                      <input
                        type="radio"
                        name="ground"
                        value={option.value}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="picker">
                <legend className="eyebrow opacity-60">
                  What you are willing to spend
                </legend>
                <p className="picker-empty prose-body mt-1 text-sm opacity-65">
                  The only question that changes the answer. Pick one and we
                  will tell you what it buys.
                </p>
                <div className="mt-3 space-y-2">
                  {COMMISSION.budgetOptions.map((option) => (
                    <label
                      key={option.value}
                      className="card block cursor-pointer p-3 select-none has-checked:border-current/50"
                    >
                      <span className="flex items-baseline gap-3">
                        <input
                          type="radio"
                          name="budget"
                          value={option.value}
                          className="mt-1 accent-current"
                        />
                        <span className="min-w-0">
                          <span className="block">{option.label}</span>
                          <span className="prose-body block text-sm opacity-65">
                            {option.note}
                          </span>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="field-group">
                <label htmlFor="brief" className="eyebrow block opacity-60">
                  Anything else
                </label>
                <textarea
                  id="brief"
                  name="brief"
                  rows={4}
                  placeholder="The occasion, roughly when, and anything you have already been told is impossible."
                  className="mt-2 w-full border-b border-current/25 bg-transparent py-2 outline-none placeholder:opacity-35 focus:border-current"
                />
              </div>

              <button
                type="submit"
                className="eyebrow bg-[var(--stock-ink)] px-6 py-3 text-[var(--stock-paper)] transition-opacity hover:opacity-85"
              >
                Send it
              </button>
              <p className="prose-body text-xs opacity-50">
                This form is a demonstration and does not submit anywhere.
              </p>
            </form>
          </section>

          <aside>
            <h2 className="display-sm">{ABOUT.heading}</h2>
            {ABOUT.paragraphs.map((p) => (
              <p key={p} className="prose-body mt-4 opacity-80">
                {p}
              </p>
            ))}

            <div className="rule mt-10 pt-6">
              <h3 className="eyebrow opacity-55">For a sense of scale</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/shows/${cheapest.show.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {cheapest.show.title}
                  </Link>
                  <span className="num opacity-65">
                    £{cheapest.costUsd.toLocaleString("en-GB")} · {cheapest.cues.length} shells
                  </span>
                </li>
                <li className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/shows/${dearest.show.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {dearest.show.title}
                  </Link>
                  <span className="num opacity-65">
                    £{dearest.costPerMinute.toLocaleString("en-GB")} a minute
                  </span>
                </li>
              </ul>
              <p className="prose-body mt-4 text-sm opacity-65">
                Both are published in full, shell by shell, with what each one
                cost. That is unusual and it is deliberate: it is much easier to
                talk about a display when there is a cue sheet on the table.
              </p>
            </div>

            <div className="rule mt-10 pt-6">
              <p className="num text-sm opacity-75">{SITE.email}</p>
              <p className="num text-sm opacity-75">{SITE.phone}</p>
              <p className="prose-body mt-2 text-sm opacity-60">{SITE.where}</p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
