import { Container } from "./container";

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
    <div className="border-b border-line bg-surface">
      <Container width="wide" className="py-14 sm:py-18">
        {eyebrow && <p className="eyebrow text-accent">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl leading-[1.05] font-bold text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
