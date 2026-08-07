import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = {
  title: "Book a table",
  description:
    "Check availability and book a table. Tables are released eight weeks ahead.",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/*
        `useSearchParams` opts a component into client-side rendering, so
        Next requires a Suspense boundary around it — without one the
        build fails rather than warning. The fallback is deliberately the
        shape of the real thing so the page does not jump.
      */}
      <Suspense fallback={<BookingSkeleton />}>
        <BookingFlow />
      </Suspense>
    </div>
  );
}

function BookingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-ink-subtle">
        Loading availability
      </p>
      <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
        Book a table
      </h1>
      <div className="mt-10 h-11 w-full max-w-md rounded-full bg-surface" />
      <div className="mt-8 h-20 w-full rounded-lg bg-surface" />
    </div>
  );
}
