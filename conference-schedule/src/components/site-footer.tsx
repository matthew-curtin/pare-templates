import Link from "next/link";
import { OverlapMark } from "./wordmark";
import { footer, nav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-inverse">
      <div className="grid gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="sign flex items-center gap-3 text-[2rem]">
            <OverlapMark className="h-7 w-7" />
            Overlap
          </p>
          <p className="prose-block mt-4 text-[0.9375rem] leading-relaxed text-ink-inverse/70">
            {site.description}
          </p>
          <p className="prose-block mt-6 text-[0.8125rem] leading-relaxed text-ink-inverse/50">
            {footer.note}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring narrow text-[0.9375rem] text-ink-inverse/70 transition-colors hover:text-ink-inverse"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="focus-ring narrow text-[0.9375rem] text-ink-inverse/70 transition-colors hover:text-ink-inverse"
          >
            {site.email}
          </a>
        </div>
      </div>

      <div className="border-t border-ink-inverse/15 px-4 py-5 sm:px-6">
        {footer.lines.map((line) => (
          <p key={line} className="text-[0.8125rem] text-ink-inverse/50">
            {line}
          </p>
        ))}
      </div>
    </footer>
  );
}
