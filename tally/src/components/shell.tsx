import Link from "next/link";
import { FOOTER, NAV, SITE } from "@/content/site";
import { CLOCK, OPEN_INCIDENTS } from "@/lib/board";
import { fmtStamp } from "@/lib/availability";

/**
 * The page frame.
 *
 * Not a sticky bar. A status page is a document somebody reads once with
 * their heart rate up, and pinning six navigation links over the thing
 * they came for is the wrong trade — the masthead scrolls away like the
 * masthead of a newspaper.
 *
 * `.shell` exists so the `:has(.is-live)` rule in globals.css has an
 * ancestor to hang off: when an incident is open anywhere in the page
 * content, the masthead's bottom rule warms up. One live incident should
 * be visible from the chrome, not only from the content.
 */

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* The logo is the product: five marks, one of them short. Drawn
          rather than shipped as an image, so it stays sharp and stays
          editable (§5). */}
      <span aria-hidden="true" className="flex items-end gap-[2px] h-4">
        <i className="w-[3px] h-full rounded-[1px] bg-ok" />
        <i className="w-[3px] h-full rounded-[1px] bg-ok" />
        <i className="w-[3px] h-[40%] rounded-[1px] bg-partial" />
        <i className="w-[3px] h-full rounded-[1px] bg-ok" />
        <i className="w-[3px] h-full rounded-[1px] bg-ok" />
      </span>
      <span className="font-semibold text-ink">
        {SITE.name}
        <span className="text-ink-faint font-normal"> {SITE.product}</span>
      </span>
    </Link>
  );
}

export function Masthead() {
  return (
    <header className="masthead border-b border-line-soft transition-colors">
      <div className="frame flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Wordmark />
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink-dim hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line-soft">
      <div className="frame py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Wordmark />
            <p className="prose-body mt-4 max-w-sm text-ink-dim">{FOOTER.blurb}</p>
          </div>
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow">{col.title}</p>
              <ul className="mt-3 space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-ink-dim hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-line-soft pt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="prose-body max-w-3xl text-micro text-ink-faint">
            {FOOTER.fictionNote}
          </p>
          <p className="num text-micro text-ink-faint">
            All times UTC · rendered against {fmtStamp(CLOCK)}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell flex min-h-full flex-col">
      <Masthead />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Present only while something is actually open. The `:has()` rule
          in globals.css reads it; nothing else does. */}
      {OPEN_INCIDENTS.length > 0 && <span className="is-live sr-only" />}
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="frame pt-12 pb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold">{title}</h1>
      {intro && <p className="prose-body measure mt-3 text-lede text-ink-dim">{intro}</p>}
      {children}
    </div>
  );
}
