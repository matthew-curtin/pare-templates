import Link from "next/link";
import { site } from "@/content/site";
import { AlmanacMark } from "./wordmark";

/**
 * A slim, light, sticky header.
 *
 * The first version was a full-bleed dark masthead with the title and a
 * row of letterspaced capitals in it — a printed-gazette idea, and the
 * single most dated thing on the page. A heavy band across the top of
 * every screen spends a lot of attention on saying the site's own name,
 * which the reader knows, and it makes everything below it feel like a
 * document rather than a tool.
 *
 * This one stays out of the way: translucent, blurred, one hairline, and
 * a single primary action at the right-hand end.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="focus-ring group flex items-center gap-2.5">
          <AlmanacMark className="h-7 w-7" />
          <span className="text-[1.0625rem] font-bold tracking-tight text-ink">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Main" className="min-w-0 flex-1">
          <ul className="flex items-center gap-1 overflow-x-auto">
            {site.nav.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="focus-ring block rounded-lg px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-sunk hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/post"
          className="focus-ring hidden shrink-0 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover sm:block"
        >
          Post a job
        </Link>
      </div>
    </header>
  );
}
