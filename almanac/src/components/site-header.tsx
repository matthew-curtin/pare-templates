import Link from "next/link";
import { site } from "@/content/site";
import { AlmanacMark } from "./wordmark";

/**
 * The masthead: a dark band across the top with the title in it, the
 * way a printed gazette carries its name. It is the only heavy element
 * on the page, which is what lets everything below it be quiet.
 */
export function SiteHeader() {
  return (
    <header className="bg-band text-ink-inverse">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-end md:justify-between">
        <Link
          href="/"
          className="focus-ring group flex items-center gap-3 self-start"
        >
          <AlmanacMark className="h-9 w-9" />
          <span className="flex flex-col">
            <span className="font-serif text-2xl leading-none font-semibold tracking-tight group-hover:underline">
              {site.name}
            </span>
            <span className="mt-1 text-xs text-ink-inverse/70">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring label text-ink-inverse/80 transition-colors hover:text-ink-inverse"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
