"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

/**
 * The only thing in the header that needs to know where it is, so the
 * only thing that is a client component. The header itself stays on the
 * server.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {site.nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`focus-ring border-b-2 pb-0.5 text-[0.875rem] transition-colors ${
              active
                ? "border-water text-ink"
                : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
