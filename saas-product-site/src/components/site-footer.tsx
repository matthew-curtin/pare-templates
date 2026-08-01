import Link from "next/link";
import { Container } from "./container";
import { Logo } from "./logo";
import { footerNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container width="wide">
        <div className="grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {site.tagline} Delivery insight for teams who would rather fix the
              process than measure the people.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-ink">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${group.heading}-${link.label}`}>
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

        <div className="flex flex-col gap-4 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-subtle">
            © {new Date().getFullYear()} {site.name}. A sample site — not a real
            company.
          </p>
          <div className="flex gap-6 text-sm text-ink-subtle">
            <Link href="/contact" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Terms
            </Link>
            <a href={`mailto:${site.email}`} className="hover:text-ink">
              {site.email}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
