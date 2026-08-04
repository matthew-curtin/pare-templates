import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { aboutBlocks, aboutIntro } from "@/content/pages";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Roasting since ${site.founded}`}
        title="Four people and a 15 kg roaster"
        description={aboutIntro}
      />

      <Container width="wide" className="py-12 sm:py-16">
        <div className="relative aspect-[16/7] overflow-hidden rounded-xl bg-surface">
          <Image
            src="/images/coffee/roastery.jpg"
            alt="Hessian coffee sacks stacked in a warehouse"
            fill
            priority
            sizes="(min-width: 1152px) 64rem, 92vw"
            className="object-cover"
          />
        </div>
      </Container>

      <Container width="prose" className="pb-16">
        <div className="space-y-12">
          {aboutBlocks.map((block) => (
            <section key={block.heading}>
              <h2 className="font-display text-2xl font-bold text-balance">
                {block.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {block.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-relaxed text-ink-muted text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-line bg-surface p-6 text-center">
          <p className="font-display text-xl font-bold">
            Six coffees, roasted this week
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            {site.standfirst}
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
          >
            Shop the coffee
          </Link>
        </div>
      </Container>
    </>
  );
}
