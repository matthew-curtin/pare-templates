import Image from "next/image";
import type { Sound } from "@/content/types";

export function SoundCard({ sound }: { sound: Sound }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={sound.image}
          alt={sound.imageAlt}
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Darkens the foot of the image so the label always reads. */}
        <div className="absolute inset-0 bg-linear-to-t from-canvas/90 via-canvas/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">
              {sound.category}
            </p>
            <h3 className="mt-0.5 font-bold text-ink">{sound.name}</h3>
          </div>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
              <path d="M1 1.5v11l10-5.5z" fill="currentColor" />
            </svg>
          </span>
        </div>

        {sound.premium && (
          <span className="absolute top-3 right-3 rounded-full bg-canvas/85 px-2.5 py-1 text-[10px] font-bold tracking-wide text-accent uppercase backdrop-blur-sm">
            Plus
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm leading-relaxed text-ink-muted">
          {sound.description}
        </p>
        <p className="mt-3 text-xs text-ink-subtle">{sound.length}</p>
      </div>
    </article>
  );
}
