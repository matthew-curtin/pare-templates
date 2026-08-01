import { Button } from "@/components/button";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance">
        Nothing here. Go back to sleep.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink-muted text-pretty">
        The page you were looking for has either moved or never existed. Try
        the help centre, or start again from the beginning.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button href="/">Back to the home page</Button>
        <Button href="/support" variant="secondary">
          Help centre
        </Button>
      </div>
    </Container>
  );
}
