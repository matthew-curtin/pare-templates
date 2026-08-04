import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Byline } from "@/components/byline";
import { Container } from "@/components/container";
import { ReadingProgress } from "@/components/reading-progress";
import { StoryBody } from "@/components/story-body";
import { StoryCard } from "@/components/story-card";
import { getContributor } from "@/content/contributors";
import { getSection } from "@/content/sections";
import { getStory, stories, storiesInSection } from "@/content/stories";

type Props = { params: Promise<{ slug: string }> };

/** Pre-renders every story at build time — one static page each. */
export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return { title: story.title, description: story.dek };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const section = getSection(story.section);
  const author = getContributor(story.author);

  // Other stories from the same section, then anything else, so the
  // footer always has three even in a thinly-populated section.
  const related = [
    ...storiesInSection(story.section).filter((s) => s.slug !== story.slug),
    ...stories.filter(
      (s) => s.section !== story.section && s.slug !== story.slug
    ),
  ].slice(0, 3);

  return (
    <>
      <ReadingProgress targetId="story-body" />

      <article>
        <Container width="prose" className="pt-12 pb-8 sm:pt-16">
          {section && (
            <Link
              href={`/section/${section.slug}`}
              className="eyebrow text-accent transition-colors hover:text-accent-hover"
            >
              {section.name}
            </Link>
          )}
          <h1 className="mt-4 font-display text-4xl leading-[1.06] font-semibold text-balance sm:text-5xl">
            {story.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-ink-muted text-pretty">
            {story.dek}
          </p>
          <div className="mt-8 border-t border-line pt-6">
            <Byline
              author={story.author}
              date={story.date}
              readingMinutes={story.readingMinutes}
            />
          </div>
        </Container>

        <figure className="my-4">
          <Container width="wide">
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-sunk">
              <Image
                src={story.image}
                alt={story.imageAlt}
                fill
                priority
                sizes="(min-width: 1152px) 64rem, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-subtle">
              {story.imageCredit}
            </figcaption>
          </Container>
        </figure>

        {/* The progress bar measures this element, so it reaches 100%
            at the end of the text rather than inside the footer. */}
        <div id="story-body">
          <Container width="prose" className="py-10">
            <StoryBody blocks={story.body} />
          </Container>
        </div>

        {author && (
          <Container width="prose" className="pb-12">
            <div className="rounded-sm border border-line bg-surface p-6">
              <p className="eyebrow text-ink-subtle">About the writer</p>
              <p className="mt-3 font-display text-xl font-semibold">
                {author.name}
              </p>
              <p className="text-sm text-ink-subtle">
                {author.role} · {author.based}
              </p>
              <p className="mt-3 leading-relaxed text-ink-muted text-pretty">
                {author.bio}
              </p>
            </div>
          </Container>
        )}
      </article>

      <section className="border-t border-line bg-sunk">
        <Container width="wide" className="py-16">
          <h2 className="eyebrow text-ink-subtle">Read next</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <StoryCard key={item.slug} story={item} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
