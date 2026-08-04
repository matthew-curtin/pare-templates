import Link from "next/link";
import { CartBadge } from "./cart-badge";
import { Container } from "./container";
import { Logo } from "./logo";
import { primaryNav, site } from "@/content/site";
import { formatPence } from "@/lib/money";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
      {/* The one promise worth putting above the logo. */}
      <div className="bg-inverse py-2 text-center text-xs text-ink-inverse">
        Roasted Monday, posted Tuesday · Free delivery over{" "}
        {formatPence(site.freeShippingOverPence)}
      </div>

      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden gap-7 md:flex">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <CartBadge />
        </div>

        <nav
          aria-label="Main"
          className="-mx-5 flex gap-6 overflow-x-auto px-5 pb-3 md:hidden"
        >
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium whitespace-nowrap text-ink-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
