import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import "./globals.css";

/* One family, not two.
   next/font downloads and self-hosts it at build time, so there is no
   request to a font CDN at runtime and no flash of a fallback.

   A serif for headings and a sans for everything else is the obvious
   pairing for anything that calls itself a gazette, and it is also
   about a decade out of date for an interface. The headings here are
   job titles — some of them eleven words long — not article titles, and
   they want the same voice as the rest of the page, one size up and a
   little tighter. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
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
    <html lang="en-GB">
      <body
        className={`${jakarta.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
