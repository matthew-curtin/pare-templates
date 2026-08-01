import { Container } from "./container";
import { clsx } from "@/lib/clsx";

/** The eyebrow / title / subtitle block that opens most sections. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Standard vertical rhythm for a page section. */
export function Section({
  children,
  className,
  width,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
  id?: string;
}) {
  return (
    <section id={id} className={clsx("py-20 sm:py-28", className)}>
      <Container width={width}>{children}</Container>
    </section>
  );
}

/** The heading block at the top of an inner page. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-line bg-aurora">
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
