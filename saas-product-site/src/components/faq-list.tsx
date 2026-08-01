import type { Faq } from "@/content/types";

/**
 * Accordion built on <details>. No JavaScript, keyboard accessible for
 * free, and it still works before hydration.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium marker:content-none">
            {faq.question}
            <span
              aria-hidden="true"
              className="shrink-0 text-ink-subtle transition-transform group-open:rotate-45"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 4v10M4 9h10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl pr-8 text-[15px] leading-relaxed text-ink-muted">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
