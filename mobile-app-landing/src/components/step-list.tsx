import type { Step } from "@/content/types";

/** The numbered "how it works" sequence on the home page. */
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-8 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="relative">
          {/* The rule running to the next step. Hidden on the last one. */}
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-6 left-14 hidden h-px w-[calc(100%-2rem)] bg-line md:block"
            />
          )}

          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-raised text-lg font-bold text-accent">
            {index + 1}
          </span>
          <h3 className="mt-5 font-bold text-ink">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
