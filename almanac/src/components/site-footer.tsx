import Link from "next/link";
import { site } from "@/content/site";
import { AlmanacMark } from "./wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-primary text-ink-inverse">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <AlmanacMark className="h-7 w-7" />
              <span className="text-[1.0625rem] font-bold tracking-tight">
                {site.name}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-inverse/60">
              {site.tagline}
            </p>
            <p className="mt-5 text-sm text-ink-inverse/60">{site.address}</p>
            <p className="mt-1 text-sm text-ink-inverse/60">{site.email}</p>
          </div>

          {site.footer.columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-sm font-semibold">{column.heading}</h2>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-ink-inverse/60 transition-colors hover:text-ink-inverse"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-ink-inverse/10 pt-6 text-sm leading-relaxed text-ink-inverse/50">
          {site.footer.note}
        </p>
      </div>
    </footer>
  );
}
