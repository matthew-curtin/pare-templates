import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { contributors } from "@/content/contributors";
import { storiesByContributor } from "@/content/stories";

export const metadata: Metadata = {
  title: "Contributors",
  description: "The people who write and photograph Meridian.",
};

export default function ContributorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The masthead"
        title="Contributors"
        description="Six people make the magazine, in five countries, none of them in an office."
      />

      <Container width="default" className="py-14 sm:py-20">
        <div className="divide-y divide-line">
          {contributors.map((person) => {
            const written = storiesByContributor(person.slug);
            return (
              // The id is the anchor target for bylines elsewhere on
              // the site, which link to /contributors#their-slug.
              <article
                key={person.slug}
                id={person.slug}
                className="scroll-mt-24 py-10 first:pt-0"
              >
                <div className="flex flex-col gap-6 sm:flex-row">
                  <Avatar initials={person.initials} size={64} />
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold">
                      {person.name}
                    </h2>
                    <p className="mt-1 text-sm text-ink-subtle">
                      {person.role} · {person.based}
                    </p>
                    <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted text-pretty">
                      {person.bio}
                    </p>

                    {written.length > 0 && (
                      <div className="mt-5">
                        <p className="eyebrow text-ink-subtle">
                          {written.length}{" "}
                          {written.length === 1 ? "story" : "stories"}
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {written.map((story) => (
                            <li key={story.slug}>
                              <Link
                                href={`/story/${story.slug}`}
                                className="link-rule font-display text-lg font-medium"
                              >
                                {story.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </>
  );
}
