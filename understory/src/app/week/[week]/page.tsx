import { notFound } from "next/navigation";

import { WeekView } from "@/components/week-view";
import { WEEKS, weekLabel } from "@/lib/calendar";

export function generateStaticParams() {
  return Array.from({ length: WEEKS }, (_, i) => ({ week: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week } = await params;
  const n = Number(week);
  if (!Number.isInteger(n) || n < 1 || n > WEEKS) return {};
  return { title: `Week ${n} · ${weekLabel(n)}` };
}

/** All 52 weeks are real, pre-rendered URLs. That is what makes the
 *  cross-document view transition possible — the wall re-packs because
 *  the browser is genuinely navigating between two documents, with no
 *  client router and no JavaScript involved at all. */
export default async function Week({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week } = await params;
  const n = Number(week);
  if (!Number.isInteger(n) || n < 1 || n > WEEKS) notFound();
  return <WeekView week={n} />;
}
