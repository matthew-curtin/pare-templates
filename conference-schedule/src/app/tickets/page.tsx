import type { Metadata } from "next";
import { TicketForm } from "@/components/ticket-form";
import { questions, ticketNotes, tiers } from "@/content/tickets";

export const metadata: Metadata = {
  title: "Tickets",
  description:
    "Four tiers, one of them free and gone. Everything is included once you are through the door.",
};

export default function TicketsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="sign text-display">Tickets</h1>
        <p className="prose-block mt-4 text-lede leading-snug text-ink-muted">
          Everything is included once you are through the door — lunch on
          all three days, coffee throughout, the reception, childcare.
          Nothing at Overlap costs extra.
        </p>
      </header>

      <ul className="mt-12 grid gap-px bg-line lg:grid-cols-4">
        {tiers.map((tier) => (
          <li
            key={tier.id}
            className={`flex flex-col p-6 ${
              tier.highlight ? "bg-ink text-ink-inverse" : "bg-canvas"
            } ${tier.soldOut ? "opacity-60" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="wide text-[1.25rem] font-semibold">{tier.name}</h2>
              {tier.soldOut ? (
                <span className="narrow border border-current px-2 py-0.5 text-[0.75rem]">
                  Gone
                </span>
              ) : null}
            </div>
            <p className="sign tabular mt-3 text-[2.5rem]">
              {tier.price === 0 ? "Free" : `$${tier.price.toLocaleString()}`}
            </p>
            <p
              className={`mt-3 text-[0.9375rem] leading-relaxed ${
                tier.highlight ? "text-ink-inverse/75" : "text-ink-muted"
              }`}
            >
              {tier.blurb}
            </p>
            <ul className="mt-5 space-y-2 border-t pt-4 text-[0.875rem] leading-snug"
                style={{ borderColor: tier.highlight ? "rgb(255 255 255 / 0.18)" : "var(--color-line)" }}>
              {tier.includes.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden="true">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <TicketForm />
          <ul className="mt-8 space-y-4">
            {ticketNotes.map((note) => (
              <li
                key={note.slice(0, 40)}
                className="prose-block text-[0.9375rem] leading-relaxed text-ink-muted"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>

        <section>
          <h2 className="sign text-title">Questions</h2>
          <dl className="mt-6">
            {questions.map((q) => (
              <div key={q.q} className="border-b border-line py-5 first:pt-0">
                <dt className="wide text-[1.0625rem] font-semibold">{q.q}</dt>
                {q.a.map((para) => (
                  <dd
                    key={para.slice(0, 30)}
                    className="prose-block mt-2 text-[0.9375rem] leading-relaxed text-ink-muted"
                  >
                    {para}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
