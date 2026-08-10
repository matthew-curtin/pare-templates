import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "./wordmark";
import { footerNote, nav, site } from "@/content/site";

/**
 * The architecture, and the only layout in this template.
 *
 * A drawing stays and a document moves. `pane` is the pinned half —
 * a plan, a compass, a sun's arc — and `children` is the half you read.
 * Below 1024px the drawing goes on top and stops being pinned, because
 * a pinned drawing on a phone is a drawing and no document.
 *
 * Registered in the repo README as "split view — a pinned drawing beside
 * a scrolling document", and no other template may claim it (§4c).
 */
export function Shell({
  pane,
  children,
}: {
  pane: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line px-4 py-3.5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <Link href="/" className="focus-ring">
            <Wordmark />
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="focus-ring datum text-[0.8125rem] text-ink-muted transition-colors hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="split">
        <div className="split-pinned border-b border-line lg:border-b-0 lg:border-r">
          <div className="p-4 sm:p-6">{pane}</div>
        </div>
        <main className="min-w-0">{children}</main>
      </div>

      <footer className="border-t border-line px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-md">
            <Wordmark />
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-subtle">
              {footerNote}
            </p>
          </div>
          <div className="datum text-[0.8125rem] leading-relaxed text-ink-muted">
            <div>{site.office}</div>
            <div>{site.phone}</div>
            <div>{site.email}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** A plain band of page. Every route is built out of these so the
 *  rhythm of the scrolling half is the same everywhere. */
export function Band({
  children,
  last,
  className = "",
}: {
  children: ReactNode;
  last?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`px-4 py-10 sm:px-8 sm:py-12 ${last ? "" : "border-b border-line"} ${className}`}
    >
      {children}
    </section>
  );
}
