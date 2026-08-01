import { Container } from "@/components/container";
import { Button } from "@/components/button";

export default function NotFound() {
  return (
    <Container width="narrow">
      <div className="py-32 text-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          We can&rsquo;t find that page
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          It may have moved, or the link might be out of date.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/blog" variant="secondary">
            Read the blog
          </Button>
        </div>
      </div>
    </Container>
  );
}
