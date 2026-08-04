import type { Metadata } from "next";
import { ArchiveList } from "@/components/archive-list";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { sections } from "@/content/sections";
import { stories } from "@/content/stories";

export const metadata: Metadata = {
  title: "The archive",
  description:
    "Everything Meridian has published, filterable by department and year.",
};

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Everything we have run"
        title="The archive"
        description="Every story, newest first. Subscribers can read all of it; nothing goes behind a wall after publication."
      />
      <Container width="wide" className="py-12 sm:py-16">
        <ArchiveList stories={stories} sections={sections} />
      </Container>
    </>
  );
}
