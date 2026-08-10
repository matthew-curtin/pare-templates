import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — a ceramics studio in ${site.town}`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
