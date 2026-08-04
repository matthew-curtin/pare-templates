import { Container } from "./container";

/** The masthead block at the top of a non-story page. */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-line bg-sunk">
      <Container width="wide" className="py-14 sm:py-20">
        {eyebrow && <p className="eyebrow text-accent">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
