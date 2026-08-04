import Link from "next/link";
import { Container } from "./container";
import { Logo } from "./logo";
import { primaryNav, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line bg-canvas/85 backdrop-blur-sm">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
            <Logo />
          </Link>

          {/* The section links are the whole navigation. A magazine
              with a hamburger menu on a laptop has too many sections. */}
          <nav aria-label="Sections" className="hidden gap-7 md:flex">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="eyebrow text-ink-muted transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/subscribe"
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
          >
            Subscribe
          </Link>
        </div>

        {/* Below the fold of the header on small screens, where the
            nav above is hidden. Scrolls rather than collapsing. */}
        <nav
          aria-label="Sections"
          className="-mx-5 flex gap-6 overflow-x-auto px-5 pb-3 md:hidden"
        >
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow whitespace-nowrap text-ink-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
