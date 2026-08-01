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
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
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
