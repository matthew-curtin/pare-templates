import type { Metadata } from "next";
import { Public_Sans, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import { getSearchIndex } from "@/lib/docs";
import "./globals.css";

/* next/font downloads and self-hosts both faces at build time, so there
   is no request to a font CDN at runtime and no flash of a fallback. */
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} documentation`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Built once, on the server, from the same markdown files the pages
  // render. The search dialog is a client component, so this crosses the
  // boundary as plain data.
  const searchIndex = getSearchIndex();

  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col`}
      >
        <SiteHeader searchIndex={searchIndex} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
