import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

/**
 * Two faces, and one variable axis doing a real job.
 *
 * `opsz` — optical size — exists so a face can be drawn differently at
 * 14px and at 72px: looser spacing and thicker joins when it is small,
 * tighter and finer when it is large. Almost nobody wires it up, because
 * it needs the axis to be set in step with the type scale rather than
 * left at its default. `.head`, `.head-display`, `.head-small`, `.datum`
 * and `.figure` in globals.css each set it to match the size they are
 * used at. `wdth` is the second job: the labels inside the drawings sit
 * in columns a few characters wide, and a narrower cut is how they fit
 * without shrinking to unreadable.
 */
// Neither declares a `weight`: next/font only allows `axes` on a fully
// variable face, and the whole point here is that the axes move. The
// weights actually used are 400 and 500 and nothing else — there is no
// bold on this site, which `scripts/check-colours.mjs` asserts.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "A brokerage in Halstead, Michigan that publishes the hours of direct sun in every room of every house it sells, on the longest day, an ordinary one, and the shortest.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables go on <html>, NOT on <body>, and this is
    // load-bearing rather than a preference. `@theme` declares
    // `--font-display: var(--font-bricolage), …` on :root, and a custom
    // property substitutes its var() references at COMPUTED-VALUE time on
    // the element it is declared on — so with the fonts scoped to <body>,
    // :root resolves `--font-display` to nothing, that emptiness inherits
    // to every heading, and the whole site silently renders in the system
    // stack. It builds, it typechecks, and it looks like a font that
    // failed to download. Same shape of trap as CONVENTIONS §4c's note
    // about webfonts being dropped from the CSS pipeline: nothing errors.
    <html lang="en" className={`${bricolage.variable} ${geist.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
