import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { StoryCard } from "@/components/story-card";
import { getSection, sections } from "@/content/sections";
import { storiesInSection } from "@/content/stories";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) return {};
  return { title: section.name, description: section.summary };
}

export default async function SectionPage({ params }: Props) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const inSection = storiesInSection(section.slug);
  const [lead, ...rest] = inSection;

  return (
    <>
      <PageHeader
        eyebrow="Department"
        title={section.name}
        description={section.description}
      />

      {lead ? (
        <>
          <section className="border-b border-line">
            <Container width="wide" className="py-14 sm:py-20">
              <StoryCard story={lead} variant="lead" />
            </Container>
          </section>

          {rest.length > 0 && (
            <section>
              <Container width="wide" className="py-14 sm:py-20">
                <h2 className="eyebrow text-ink-subtle">
                  More from {section.name}
                </h2>
                <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((story) => (
                    <StoryCard key={story.slug} story={story} />
                  ))}
                </div>
              </Container>
            </section>
          )}
        </>
      ) : (
        <Container width="wide" className="py-20">
          <p className="text-ink-muted">
            Nothing published in this department yet.
          </p>
        </Container>
      )}
    </>
  );
}
