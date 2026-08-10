import Link from "next/link";
import { Wordmark } from "./wordmark";
import { footer, nav, site, TODAY } from "@/content/site";
import { firings } from "@/lib/studio";
import { kilnById } from "@/content/kilns";
import { fromToday, longDate } from "@/lib/format";

/**
 * The chrome.
 *
 * Full-bleed and NOT sticky. Six of the templates in this repo are a
 * sticky bar over a centred column and the register in the repo README
 * says that architecture is spent; this one has no centred column
 * anywhere, so a bar that followed you down the page would be chrome
 * hovering over a drawing rather than sitting above it.
 *
 * The second line is the state of the building: today, and the next
 * kiln that will actually light. It is the one piece of information a
 * member wants on every page, and it is derived rather than written.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const next = firings.find((f) => f.status === "loading" || f.status === "planned");
  const kiln = next ? kilnById.get(next.kilnId) : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-paper">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/" className="focus-ring text-ink">
            <Wordmark />
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring text-[0.875rem] text-ink-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="figure flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line px-4 py-2 text-[0.75rem] text-ink-subtle sm:px-6">
          <span>{longDate(TODAY)}</span>
          {next && kiln ? (
            <span>
              Next to light: <span className="text-fire">{kiln.name}</span>, {fromToday(next.day)}
            </span>
          ) : null}
          <span className="hidden sm:inline">{site.town}</span>
        </div>
      </header>

      <main className="min-w-0 flex-1">{children}</main>

      <footer className="mt-16 border-t border-line bg-paper px-4 py-8 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-[46rem]">
            <Wordmark />
            <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">{footer.note}</p>
          </div>
          <nav className="flex flex-col gap-1 text-[0.875rem] sm:text-right">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="focus-ring text-ink-muted hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

/**
 * A full-bleed band. The site's only layout primitive, because the
 * architecture is packed rows rather than a column.
 */
export function Band({
  children,
  className = "",
  top = false,
}: {
  children: React.ReactNode;
  className?: string;
  top?: boolean;
}) {
  return (
    <section className={`px-4 sm:px-6 ${top ? "pt-8" : "border-t border-line pt-8"} pb-8 ${className}`}>
      {children}
    </section>
  );
}
