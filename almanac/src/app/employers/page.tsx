import type { Metadata } from "next";
import Link from "next/link";
import { Monogram } from "@/components/wordmark";
import { employers } from "@/content/employers";
import { itemsForEmployer } from "@/lib/board";

export const metadata: Metadata = {
  title: "Employers",
  description:
    "The counties, health systems, universities, housing authorities, museums and nonprofits currently hiring on Almanac.",
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
    .sort(
      (a, b) => b.open - a.open || a.employer.name.localeCompare(b.employer.name),
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Employers</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Twelve organizations, all invented for this template. We list
          employers directly and not the agencies that recruit for them,
          which is why the same job never appears here four times.
        </p>
      </header>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {rows.map(({ employer, open, total }) => (
          <li key={employer.id}>
            <Link
              href={`/employers/${employer.slug}`}
              className="focus-ring group flex h-full gap-4 rounded-card bg-surface p-5 shadow-card transition-shadow duration-200 hover:shadow-lift"
            >
              <Monogram name={employer.name} />
              <div className="min-w-0">
                <p className="text-lg leading-snug font-bold tracking-tight text-ink transition-colors group-hover:text-accent">
                  {employer.name}
                </p>
                <p className="mt-0.5 text-sm text-ink-subtle">
                  {employer.kind} · {employer.place}
                </p>
                <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                  {employer.about}
                </p>
                <p className="tabular mt-3.5 text-sm font-semibold text-ink">
                  {open > 0
                    ? `${open} open ${open === 1 ? "position" : "positions"}`
                    : "No current openings"}
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
