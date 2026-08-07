import Link from "next/link";
import { footerNote, nav, openingHours, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl leading-none">{site.name}</p>
          <p className="mt-2 text-sm text-ink-muted">{site.tagline}</p>
          <address className="mt-4 text-sm not-italic text-ink-muted">
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            <a
              href={site.address.phoneHref}
              className="focus-ring mt-2 inline-block rounded-sm hover:text-ink"
            >
              {site.address.phone}
            </a>
            <br />
            <a
              href={`mailto:${site.address.email}`}
              className="focus-ring rounded-sm hover:text-ink"
            >
              {site.address.email}
            </a>
          </address>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
            Opening
          </h2>
          <dl className="mt-3 space-y-1 text-sm">
            {openingHours.map((day) => (
              <div key={day.day} className="flex justify-between gap-4">
                <dt className="text-ink-muted">{day.day}</dt>
                <dd className="tabular text-right text-ink-subtle">
                  {day.lunch === null && day.dinner === null ? (
                    "Closed"
                  ) : (
                    <>
                      {day.lunch ?? "—"}
                      {day.dinner ? ` · ${day.dinner}` : ""}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
            Elsewhere
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring rounded-sm text-ink-muted hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/book"
                className="focus-ring rounded-sm text-ink-muted hover:text-ink"
              >
                Book a table
              </Link>
            </li>
            <li className="pt-2 text-ink-subtle">{site.social.instagram}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-ink-subtle sm:px-6">
          {footerNote}
        </p>
      </div>
    </footer>
  );
}
