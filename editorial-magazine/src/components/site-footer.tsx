import Link from "next/link";
import { Container } from "./container";
import { disclaimer } from "@/content/about";
import { footerNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-line bg-sunk">
      <Container width="wide" className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl font-semibold text-ink">
              {site.name}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
              {site.tagline}. Founded {site.founded}.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="eyebrow text-ink-subtle">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line-strong pt-6">
          <p className="max-w-2xl text-xs leading-relaxed text-ink-subtle">
            {disclaimer}
          </p>
          <p className="mt-3 text-xs text-ink-subtle">
            © {site.founded}–2026 {site.name}. A website template.
          </p>
        </div>
      </Container>
    </footer>
  );
}
