"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./wordmark";
import { usePlan } from "@/lib/plan-store";
import { nav, site } from "@/content/site";

/**
 * Full-bleed, hard-ruled, and deliberately NOT sticky.
 *
 * On the schedule the sticky things are the hour rail and the room
 * headers — the grid's own axes — and a second sticky bar above them
 * would steal the height they need and put two competing fixed edges on
 * one screen. So the masthead scrolls away and the wallchart keeps its
 * frame. Every other page inherits that for consistency rather than
 * because it needs to.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { ids, ready } = usePlan();

  return (
    <header className="border-b border-ink bg-canvas">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="focus-ring -m-1 p-1"
          aria-label={`${site.name} home`}
        >
          <Wordmark />
        </Link>

        <p className="narrow hidden text-[0.8125rem] text-ink-muted md:block">
          Pittsburgh · 14–16 October 2026
        </p>

        <nav className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isPlan = item.href === "/plan";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`focus-ring narrow text-[0.9375rem] transition-colors ${
                  active
                    ? "text-ink underline decoration-2 underline-offset-[6px]"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
                {isPlan && ready && ids.length > 0 ? (
                  <span className="tabular ml-1.5 inline-block bg-ink px-1.5 py-0.5 text-[0.6875rem] leading-none text-ink-inverse">
                    {ids.length}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <Link
            href="/tickets"
            className="focus-ring bg-live px-3 py-1.5 text-[0.9375rem] font-semibold text-on-live transition-colors hover:bg-live-deep hover:text-ink-inverse"
          >
            Get a ticket
          </Link>
        </nav>
      </div>
    </header>
  );
}
