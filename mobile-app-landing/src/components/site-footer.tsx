import Link from "next/link";
import { Container } from "./container";
import { Logo } from "./logo";
import { StoreBadge } from "./store-badge";
import { footerNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container width="wide" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              {site.tagline} Free to use, with an optional subscription. No
              advertising, on any plan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <StoreBadge platform="ios" />
              <StoreBadge platform="android" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.heading}>
                <h3 className="text-xs font-bold tracking-[0.14em] text-ink-subtle uppercase">
                  {group.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. A fictional company —
            every name, quote and number on this site is invented.
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-ink"
            >
              {site.email}
            </a>
            <Link
              href="/legal/privacy"
              className="transition-colors hover:text-ink"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="transition-colors hover:text-ink"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
