import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-band text-ink-inverse">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-xl font-semibold">{site.name}</p>
            <p className="mt-2 text-sm text-ink-inverse/70">{site.tagline}</p>
            <p className="mt-4 text-sm text-ink-inverse/70">{site.address}</p>
            <p className="mt-1 text-sm text-ink-inverse/70">{site.email}</p>
          </div>

          {site.footer.columns.map((column) => (
            <div key={column.heading}>
              <h2 className="label text-ink-inverse/50">{column.heading}</h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-ink-inverse/80 hover:text-ink-inverse hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-ink-inverse/15 pt-6 text-sm text-ink-inverse/60">
          {site.footer.note}
        </p>
      </div>
    </footer>
  );
}
