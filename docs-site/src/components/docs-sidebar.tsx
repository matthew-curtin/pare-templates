"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/docs";

/**
 * The documentation navigation, built from the files on disk rather than a
 * hand-written list.
 *
 * Two components because they sit in different places in the layout: the
 * mobile disclosure spans the full width above the content, the desktop
 * column is a flex item beside it.
 */

/** Small screens: a native <details>, because a disclosure is what this
 *  is. Reimplementing one in state means reimplementing the keyboard
 *  behaviour, the accessibility tree and find-in-page expansion that the
 *  browser gives away. */
export function DocsNavMobile({ nav }: { nav: NavGroup[] }) {
  const pathname = usePathname();
  const current = nav.flatMap((g) => g.items).find((item) => pathname === `/docs/${item.slug}`);

  return (
    <details className="border-b border-border bg-surface lg:hidden">
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium sm:px-6">
        <span className="min-w-0 truncate">{current ? current.title : "Documentation"}</span>
        <span aria-hidden className="ml-3 shrink-0 text-xs text-ink-subtle">
          Browse ▾
        </span>
      </summary>
      <div className="px-4 pb-4 sm:px-6">
        <NavList nav={nav} pathname={pathname} />
      </div>
    </details>
  );
}

export function DocsNavDesktop({ nav }: { nav: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
        <NavList nav={nav} pathname={pathname} />
      </div>
    </aside>
  );
}

function NavList({ nav, pathname }: { nav: NavGroup[]; pathname: string }) {
  return (
    <nav aria-label="Documentation">
      {nav.map((group) => (
        <div key={group.dir} className="mb-6 last:mb-0">
          <h2 className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">
            {group.label}
          </h2>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const href = `/docs/${item.slug}`;
              const active = pathname === href;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`focus-ring block rounded-md px-2 py-1.5 text-sm transition ${
                      active
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-ink-muted hover:bg-surface-hover hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
