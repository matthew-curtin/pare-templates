"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import type { SearchEntry } from "@/lib/docs";
import { SearchDialog } from "./search-dialog";

export function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="focus-ring flex shrink-0 items-center gap-2">
            <Wordmark />
            <span className="text-[15px] font-semibold tracking-tight">{site.name}</span>
          </Link>

          <span className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle sm:inline">
            v{site.currentVersion}
          </span>

          {/* The nav scrolls horizontally rather than collapsing into a
              menu — four links fit, and a menu button to reveal four
              links is a tap nobody should have to make. min-w-0 lets it
              shrink; without it the flex child refuses to go below its
              content and pushes the page sideways. */}
          <nav className="min-w-0 flex-1 overflow-x-auto">
            <ul className="flex items-center gap-1">
              {site.nav.map((link) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`focus-ring block rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition ${
                        active
                          ? "bg-accent-soft font-medium text-accent"
                          : "text-ink-muted hover:bg-surface hover:text-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="focus-ring flex shrink-0 items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-ink-subtle transition hover:border-border-strong hover:text-ink-muted"
          >
            <span aria-hidden>⌕</span>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-border bg-canvas px-1 font-mono text-[10px] md:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      {/* Mounted only while open, so each open starts from a clean
          search box without an effect resetting it. */}
      {searchOpen && (
        <SearchDialog index={searchIndex} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}

/** Drawn, not shipped as an image — so it stays sharp and stays editable. */
function Wordmark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="text-accent">
      <rect x="0.75" y="0.75" width="20.5" height="20.5" rx="5.5" className="fill-accent-soft" />
      <rect
        x="0.75"
        y="0.75"
        width="20.5"
        height="20.5"
        rx="5.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 15.5V6.5h4.2a2.9 2.9 0 0 1 0 5.8H6.5m5.2 0 3.8 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
