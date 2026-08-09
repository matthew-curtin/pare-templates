import type { Metadata } from "next";
import { AlertBuilder, type AlertRow } from "@/components/alert-builder";
import { ZONE } from "@/content/site";
import { openItems } from "@/lib/board";
import { closingLabel } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Email alerts",
  description:
    "Build a search and see how many current vacancies it would have caught before you commit to it.",
};

export default function AlertsPage() {
  const rows: AlertRow[] = openItems.map((item) => ({
    listing: item.listing,
    title: item.vacancy.title,
    employerName: item.employer.name,
    slug: item.vacancy.slug,
    closingText: closingLabel(item.closing, item.vacancy.closes, ZONE),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Email alerts</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Describe what you are looking for and we will send it as it is
          posted. The count updates as you change the alert, so you can
          see whether you have made it too narrow before you find out the
          slow way.
        </p>
      </header>

      <div className="mt-10">
        <AlertBuilder rows={rows} />
      </div>
    </div>
  );
}
