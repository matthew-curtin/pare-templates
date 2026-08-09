import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import "./globals.css";

/**
 * One family, and a width axis instead of a second typeface.
 *
 * Archivo carries a real `wdth` axis (62–125), which this template uses
 * to do the work a font pairing usually does: signage is set wide
 * because a wallchart headline is a painted sign, and column labels are
 * set narrow so they fit a 150px track without shrinking. Asking for
 * the axis explicitly matters — without `axes` you get the variable
 * weight only and every `font-variation-settings: "wdth"` in the
 * stylesheet silently does nothing.
 *
 * Self-hosted by next/font at build time, so there is no request to a
 * font CDN at runtime and no flash of fallback text.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="flex min-h-screen flex-col">
        {/* No plan provider: the plan is a module-level external store
            read through useSyncExternalStore, so there is exactly one
            copy of it and nothing to wrap the tree in. See
            src/lib/plan-store.ts. */}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
