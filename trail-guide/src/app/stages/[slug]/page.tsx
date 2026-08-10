import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Stat } from "@/components/stat";
import { Plate } from "@/components/plate";
import { LegProfile } from "@/components/leg-profile";
import { TerrainLegend } from "@/components/terrain-bar";
import peatAndSedge from "@/photos/peat-and-sedge.jpg";
import talus from "@/photos/talus.jpg";
import { legs, shelters } from "@/content/route";
import { model } from "@/content/site";
import { ascentOf, descentOf, hoursOf, mileposts } from "@/lib/route";
import { feet, hoursLabel, miles } from "@/lib/format";

const byId = new Map(shelters.map((s) => [s.id, s]));
const posts = mileposts(legs);

/**
 * Two legs carry a photograph, and both are there to settle a claim the
 * prose can only assert — §6's test is whether you could say what the
 * image is FOR, and these two have the shortest answers on the site.
 *
 * The other nine have none, deliberately. A photograph on every leg
 * would be nine photographs of upland, which is the decoration §6 warns
 * about: an image you could swap for another of the same subject
 * without anybody noticing.
 */
/** The image type comes off `Plate` rather than from `next/image`,
 *  because `scripts/check-imagery.mjs` at the repo root counts FILES
 *  importing next/image and a type-only import counts. That is the
 *  check being blunt rather than wrong: one component owning the
 *  treatment is the property worth keeping, and borrowing the type from
 *  that component is a truer expression of it anyway. */
type PlateSrc = Parameters<typeof Plate>[0]["src"];

const PHOTO: Record<
  string,
  { src: PlateSrc; alt: string; caption: string; aspect: string; width: string; sizes: string }
> = {
  "the-ninebark-flats": {
    src: peatAndSedge,
    aspect: "3 / 2",
    width: "max-w-3xl",
    sizes: "(min-width: 1024px) 48rem, 100vw",
    alt: "Bare black peat under a heavy grey sky, broken up by hundreds of separate hummocks of pale dead sedge, with standing water lying between them and reaching to the horizon.",
    caption:
      "This is what fourteen downhill miles look like. There is no line through it, every hummock is a step up and a step down, and it is why the flats take longer than the Slate Ladder.",
  },
  /** Capped narrower than the landscape one, and not by taste: the
   *  source is 700px wide, so displaying it at the 768px this column
   *  allows would upscale it on an ordinary screen and badly on a
   *  retina one. Match the display width to the file you have. */
  "the-rime-steps": {
    src: talus,
    aspect: "2 / 3",
    width: "max-w-sm",
    sizes: "24rem",
    alt: "A boulder field filling the whole frame from edge to edge — angular pale blocks a foot to a yard across, tipped at every angle, with no path, no soil and no sky in the picture.",
    caption:
      "Six of the twelve miles are this. A mile of it takes an hour, and the hour is the same whether the mile is going up or down.",
  },
};

export function generateStaticParams() {
  return legs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const leg = legs.find((l) => l.slug === slug);
  if (!leg) return { title: "Not found" };
  return { title: leg.name, description: leg.summary };
}

export default async function LegPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = legs.findIndex((l) => l.slug === slug);
  if (index === -1) notFound();

  const leg = legs[index];
  const from = byId.get(leg.from);
  const to = byId.get(leg.to);
  const prev = legs[index - 1];
  const next = legs[index + 1];
  const photo = PHOTO[leg.slug];
  const hours = hoursOf(leg, model);

  return (
    <Shell
      rail={{ from: posts[index], to: posts[index + 1] }}
      railLabel={`Elevation profile of the whole traverse, with ${leg.name} lit.`}
    >
      <article className="px-4 py-12 sm:px-8">
        <p className="datum text-[0.75rem] uppercase text-ink-subtle">
          Leg {index + 1} of {legs.length} · from mile {posts[index].toFixed(1)}
        </p>
        <h1 className="head mt-3 text-display">{leg.name}</h1>
        <p className="mt-3 text-lede text-ink-muted">
          {from?.name} → {to?.name}
        </p>

        {/* The big figure gets its own line rather than sharing a
            flex row with the small ones. Mixed sizes in one wrapping
            row leave the tall item's label stranded below everything
            else's, which looks like a layout bug because it is one. */}
        <div className="mt-10">
          <Stat value={hoursLabel(hours)} label="on the day" size="lg" />
        </div>
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
          <Stat value={miles(leg.distance)} label="on the map" />
          <Stat value={feet(ascentOf(leg))} label="of climb" />
          <Stat value={feet(descentOf(leg))} label="of descent" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <LegProfile leg={leg} legs={legs} />
            <div className="mt-4">
              <TerrainLegend leg={leg} />
            </div>
          </div>

          {/* `self-start` matters: the hairlines between these three
              panels are the container's own background showing through
              a 1px gap, so a container stretched to the grid row's
              height paints a stray grey block under the last one. */}
          <div className="space-y-px self-start bg-line">
            <div className="bg-surface p-4">
              <p className="datum text-[0.75rem] uppercase text-ink-subtle">
                Water
              </p>
              <p
                className={`mt-1.5 text-[0.9375rem] leading-relaxed ${
                  leg.dry ? "text-warn" : "text-ink-muted"
                }`}
              >
                {leg.dry
                  ? `Nothing between ${from?.name} and ${to?.name}. Carry what you need for ${hoursLabel(hours)}.`
                  : `Running water on the leg. ${to?.name} has ${to?.water === "cistern" ? "a rainwater tank" : to?.water === "seasonal" ? "a spring that can fail in August" : to?.water === "none" ? "none at all" : "a reliable source"}.`}
              </p>
            </div>
            <div className="bg-surface p-4">
              <p className="datum text-[0.75rem] uppercase text-ink-subtle">
                Getting off
              </p>
              <p
                className={`mt-1.5 text-[0.9375rem] leading-relaxed ${
                  leg.escape === null ? "text-warn" : "text-ink-muted"
                }`}
              >
                {leg.escape ??
                  "No escape route. Once you are on this leg the only ways out are the two ends of it."}
              </p>
            </div>
            <div className="bg-surface p-4">
              <p className="datum text-[0.75rem] uppercase text-ink-subtle">
                Sleeping at the end
              </p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {to?.name} —{" "}
                {to?.bunks === 0
                  ? "no bunks"
                  : `${to?.bunks} bunks`}
                , {to?.booking === "required" ? "booked ahead" : "first come"}.
              </p>
              <Link
                href="/shelters"
                className="focus-ring mt-2 inline-block text-[0.875rem] text-water hover:underline"
              >
                All twelve fixed points
              </Link>
            </div>
          </div>
        </div>

        {photo ? (
          <Plate
            className={`mt-12 ${photo.width}`}
            src={photo.src}
            aspect={photo.aspect}
            sizes={photo.sizes}
            alt={photo.alt}
            caption={photo.caption}
          />
        ) : null}

        <div className="prose-block mt-12 space-y-5 text-[1rem] leading-relaxed text-ink-muted">
          {leg.detail.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>

        <nav className="mt-14 flex flex-wrap justify-between gap-6 border-t border-line pt-6">
          {prev ? (
            <Link href={`/stages/${prev.slug}`} className="focus-ring group">
              <span className="datum block text-[0.75rem] uppercase text-ink-subtle">
                Before this
              </span>
              <span className="mt-1 block text-[1rem] group-hover:text-water">
                {prev.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/stages/${next.slug}`} className="focus-ring group text-right">
              <span className="datum block text-[0.75rem] uppercase text-ink-subtle">
                After this
              </span>
              <span className="mt-1 block text-[1rem] group-hover:text-water">
                {next.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </Shell>
  );
}
