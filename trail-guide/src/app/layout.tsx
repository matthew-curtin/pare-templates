import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";

/**
 * One family, self-hosted by `next/font` at build time — so there is no
 * request to a font CDN at runtime and no flash of fallback text.
 *
 * `axes` is the load-bearing part. Recursive's variable font carries
 * MONO and CASL alongside weight, and without asking for them here you
 * get the weight axis only: every `font-variation-settings: "MONO" 1`
 * in the stylesheet then silently does nothing, the page looks
 * perfectly fine, and the entire typographic idea is absent.
 */
const recursive = Recursive({
  subsets: ["latin"],
  axes: ["MONO", "CASL"],
  variable: "--font-recursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Sable Traverse",
    template: "%s · The Sable Traverse",
  },
  description:
    "A 142-mile high route across the Sable Range, planned the way you actually walk it: hut to hut, in hours rather than miles.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={recursive.variable}>
      <body>{children}</body>
    </html>
  );
}
