import Link from "next/link";
import { nav, site } from "@/content/site";

/**
 * The header is the same on every page and the booking button never
 * leaves it. On a restaurant site that button is the whole job — a
 * visitor who cannot find it within a second will ring instead, or go
 * somewhere else.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="focus-ring shrink-0 rounded-sm font-display text-2xl leading-none tracking-tight"
        >
          {site.name}
        </Link>

        <nav
          aria-label="Main"
          className="nav-fade min-w-0 flex-1 overflow-x-auto sm:overflow-visible"
        >
          <ul className="flex items-center gap-4 whitespace-nowrap sm:gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring rounded-sm text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/book"
          className="focus-ring shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          Book a table
        </Link>
      </div>
    </header>
  );
}
