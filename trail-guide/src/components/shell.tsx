import Link from "next/link";
import { RouteRail, type RailMode } from "@/components/route-rail";
import { SiteNav } from "@/components/site-nav";
import { Mark } from "@/components/wordmark";
import { site } from "@/content/site";

/**
 * Rail on the left, everything else on the right.
 *
 * Every page renders this itself rather than inheriting it from the
 * root layout, because the rail's mode is a property of the PAGE — a
 * scroll marker belongs on a page that reads in route order and is a
 * lie on one that does not (see route-rail.tsx). Putting the shell in
 * the layout would mean deriving the mode from the pathname in a client
 * component, which is a worse trade than one wrapper per page.
 *
 * The header is deliberately not sticky. It would fight the rail: the
 * rail IS the persistent element on this site, and two things pinned to
 * the top of the screen competing to tell you where you are is one too
 * many. It is also how this template stays out of the "sticky bar over
 * a centred column" architecture that six others already share.
 */
export function Shell({
  children,
  rail = "plain",
  railLabel,
}: {
  children: React.ReactNode;
  rail?: RailMode;
  railLabel: string;
}) {
  return (
    <div className="flex min-h-svh">
      <RouteRail mode={rail} label={railLabel} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-line px-4 py-4 sm:px-8">
          <Link
            href="/"
            className="focus-ring flex items-center gap-2.5 text-ink"
          >
            <Mark className="h-5 w-5 text-water" />
            <span className="head text-[1rem]">{site.name}</span>
          </Link>
          <SiteNav />
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line px-4 py-10 sm:px-8">
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {site.footer.columns.map((col) => (
              <div key={col.head}>
                <h2 className="datum text-[0.75rem] uppercase text-ink-subtle">
                  {col.head}
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="focus-ring text-[0.9375rem] text-ink-muted hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="prose-block mt-10 text-[0.8125rem] leading-relaxed text-ink-subtle">
            {site.footer.body}
          </p>
        </footer>
      </div>
    </div>
  );
}
