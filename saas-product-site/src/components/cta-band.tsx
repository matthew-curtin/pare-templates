import { Button } from "./button";
import { Container } from "./container";

export function CtaBand({
  title = "See where your work actually waits",
  subtitle = "Connect a repository and get a picture of the last six months in about ten minutes. No card, no sales call.",
  primary = { label: "Start free", href: "/pricing" },
  secondary = { label: "Talk to us", href: "/contact" },
}: {
  title?: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="rounded-2xl bg-inverse px-8 py-14 text-center sm:px-16">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink-inverse sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-pretty text-white/65">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={primary.href} size="lg">
              {primary.label}
            </Button>
            <Button
              href={secondary.href}
              size="lg"
              variant="secondary"
              className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
            >
              {secondary.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
