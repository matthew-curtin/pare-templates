import { Container } from "./container";
import { StoreBadge } from "./store-badge";
import { site } from "@/content/site";

/** The closing invitation. Sits at the foot of most pages. */
export function CtaBand({
  title = "Tonight would be a good night to start.",
  subtitle = "Free to use, and free to stay that way. Thirty days of Plus if you want the rest of the library.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="border-t border-line bg-aurora">
      <Container className="py-20 text-center sm:py-24">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
          {subtitle}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <StoreBadge platform="ios" />
          <StoreBadge platform="android" />
        </div>
        <p className="mt-6 text-sm text-ink-subtle">{site.app.price}</p>
      </Container>
    </section>
  );
}
