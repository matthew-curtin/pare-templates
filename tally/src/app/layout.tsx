import type { Metadata } from "next";

// Self-hosted variable faces. Archivo carries `wght` AND `wdth` (the
// `standard.css` entry point is the one with both axes); Roboto Mono
// carries every figure on the site.
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/roboto-mono";

import "./globals.css";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} status`,
    template: `%s · ${SITE.name} status`,
  },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
