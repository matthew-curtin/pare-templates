import type { Metadata } from "next";

import { site } from "@/content/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.full} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.blurb,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
