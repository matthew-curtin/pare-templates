import Link from "next/link";
import { Container } from "./container";
import { Logo } from "./logo";
import { disclaimer } from "@/content/pages";
import { footerNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-inverse text-ink-inverse">
      <Container width="wide" className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-inverse/70">
              {site.tagline}. Roasting since {site.founded}.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="eyebrow text-ink-inverse/50">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-inverse/80 transition-colors hover:text-ink-inverse"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/15 pt-6">
          <p className="max-w-2xl text-xs leading-relaxed text-ink-inverse/50">
            {disclaimer}
          </p>
          <p className="mt-3 text-xs text-ink-inverse/50">
            © {site.founded}–2026 {site.legalName}. A website template.
          </p>
        </div>
      </Container>
    </footer>
  );
}
