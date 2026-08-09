import type { Metadata } from "next";
import Link from "next/link";
import { Monogram } from "@/components/wordmark";
import { employers } from "@/content/employers";
import { itemsForEmployer } from "@/lib/board";

export const metadata: Metadata = {
  title: "Employers",
  description:
    "The councils, trusts, universities, housing associations, museums and charities currently advertising on Almanac.",
};

export default function EmployersPage() {
  const rows = employers
    .map((employer) => {
      const items = itemsForEmployer(employer.id);
      return {
        employer,
        open: items.filter((item) => !item.listing.closed).length,
        total: items.length,
      };
    })
    .sort((a, b) => b.open - a.open || a.employer.name.localeCompare(b.employer.name));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="border-b border-line-strong pb-5">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          Employers
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Twelve organisations, all of them invented for this template.
          We list employers directly and not the agencies that recruit
          for them, which is why the same job never appears here four
          times.
        </p>
      </header>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map(({ employer, open, total }) => (
          <li key={employer.id}>
            <Link
              href={`/employers/${employer.slug}`}
              className="focus-ring group flex h-full gap-4 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-strong"
            >
              <Monogram name={employer.name} />
              <div className="min-w-0">
                <p className="font-serif text-lg leading-snug font-semibold tracking-tight text-ink group-hover:text-accent group-hover:underline">
                  {employer.name}
                </p>
                <p className="mt-0.5 text-sm text-ink-subtle">
                  {employer.kind} · {employer.place}
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                  {employer.about}
                </p>
                <p className="tabular mt-3 text-sm font-semibold text-ink">
                  {open > 0
                    ? `${open} open ${open === 1 ? "vacancy" : "vacancies"}`
                    : "No current vacancies"}
                  {open === 0 && total > 0 && (
                    <span className="font-normal text-ink-subtle">
                      {" "}
                      · {total} recently closed
                    </span>
                  )}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
