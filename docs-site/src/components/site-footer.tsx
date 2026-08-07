import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold tracking-tight">{site.name}</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-ink-muted">{site.tagline}</p>
            <p className="mt-4 font-mono text-xs text-ink-subtle">
              API version {site.currentVersion}
            </p>
          </div>

          {site.footer.map((column) => (
            <div key={column.heading} className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-ink uppercase">
                {column.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-ink-muted transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-border pt-6 text-xs leading-6 text-ink-subtle">
          {site.name} is not a real company and this is not a real service. Every product name,
          endpoint, key, statistic and release note on this site is invented, and none of the URLs
          resolve. It is a template — replace the content before showing it to anyone.
        </p>
      </div>
    </footer>
  );
}
