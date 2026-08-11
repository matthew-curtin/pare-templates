import Link from "next/link";
import { FOOTER_NOTE, NAV, SITE } from "@/content/site";

/**
 * The masthead is the wordmark and a rule of links, at the top of a
 * sheet of coloured paper. There is no sticky bar: six templates in
 * this repo already have one and this page is a document, not an app.
 */
export function Masthead({ standfirst }: { standfirst?: string }) {
  return (
    <header className="px-4 pt-8 pb-6 sm:px-6 lg:px-10">
      <Link href="/" className="block no-underline">
        <span className="wordmark block">nightwork</span>
      </Link>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="prose-lead max-w-xl opacity-80">{standfirst ?? SITE.tagline}</p>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="eyebrow underline decoration-1 underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 px-4 pt-8 pb-14 sm:px-6 lg:px-10">
      <div className="rule pt-6">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="display-sm">{SITE.legalName}</p>
            <p className="prose-body mt-2 max-w-md text-sm opacity-70">{SITE.where}</p>
            <p className="prose-body max-w-md text-sm opacity-70">{SITE.licence}</p>
          </div>
          <div>
            <p className="eyebrow opacity-60">Office</p>
            <p className="num mt-2 text-sm opacity-80">{SITE.email}</p>
            <p className="num text-sm opacity-80">{SITE.phone}</p>
            <p className="prose-body mt-2 text-sm opacity-60">{SITE.founded}</p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow opacity-60">Pages</p>
            <ul className="mt-2 space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="prose-body mt-10 max-w-2xl text-xs opacity-55">{FOOTER_NOTE}</p>
      </div>
    </footer>
  );
}

/** A single figure with its label under it — the site's one data unit. */
export function Figure({
  value,
  label,
  tone = "ink",
}: {
  value: string;
  label: string;
  tone?: "ink" | "sky";
}) {
  return (
    <div>
      <p
        className={`num text-2xl leading-none sm:text-3xl ${tone === "sky" ? "text-white" : ""}`}
      >
        {value}
      </p>
      <p
        className={`eyebrow mt-2 ${tone === "sky" ? "text-white/55" : "opacity-55"}`}
      >
        {label}
      </p>
    </div>
  );
}
