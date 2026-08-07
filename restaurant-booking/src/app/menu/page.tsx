import type { Metadata } from "next";
import Link from "next/link";
import { dietaryKey, menus } from "@/content/menus";
import type { Dish } from "@/content/types";

export const metadata: Metadata = {
  title: "Menus",
  description:
    "Dinner, lunch and drinks. The menu is written weekly, on a Tuesday, once the growers have said what they have.",
};

/**
 * The three menus, switched by a search parameter rather than by client
 * state. That keeps the whole page a server component — no JavaScript
 * ships for it at all — and gives each menu its own shareable URL.
 */
export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const active = menus.find((menu) => menu.id === m) ?? menus[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">
        Menus
      </h1>
      <p className="mt-3 max-w-prose text-ink-muted">
        Written on a Tuesday, once the growers have told us what they
        actually have, and up until the following Tuesday. Occasionally
        something comes off on a Friday because we ran out.
      </p>

      <nav aria-label="Menus" className="mt-8 flex flex-wrap gap-2">
        {menus.map((menu) => {
          const isActive = menu.id === active.id;
          return (
            <Link
              key={menu.id}
              href={`/menu?m=${menu.id}`}
              aria-current={isActive ? "page" : undefined}
              className={[
                "focus-ring rounded-full border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line-strong text-ink-muted hover:border-ink-subtle hover:text-ink",
              ].join(" ")}
            >
              {menu.name}
            </Link>
          );
        })}
      </nav>

      <p className="mt-4 text-sm text-ink-subtle">{active.detail}</p>

      <div className="mt-10 space-y-12">
        {active.sections.map((section) => (
          <section key={section.name}>
            <h2 className="font-display text-2xl">{section.name}</h2>
            {section.note && (
              <p className="mt-1 text-sm text-ink-subtle">{section.note}</p>
            )}
            <ul className="mt-5 space-y-5">
              {section.dishes.map((dish) => (
                <li key={dish.name}>
                  <DishRow dish={dish} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-14 border-t border-line pt-6">
        <h2 className="text-xs uppercase tracking-widest text-ink-subtle">
          Key
        </h2>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
          {dietaryKey.map((entry) => (
            <li key={entry.mark}>
              <span className="font-medium text-herb">{entry.mark}</span>{" "}
              {entry.meaning}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-prose text-sm text-ink-subtle">
          Tell us about allergies when you book. We handle nuts, gluten and
          dairy every service, but the kitchen is one room and we cannot
          promise a dish is free of any trace of them.
        </p>
        <Link
          href="/book"
          className="focus-ring mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          Book a table
        </Link>
      </footer>
    </div>
  );
}

function DishRow({ dish }: { dish: Dish }) {
  return (
    <>
      <div className="flex items-baseline">
        <h3 className="text-[17px]">{dish.name}</h3>
        {/* The dotted leader is drawn rather than typed, so it stretches
            to whatever space is left on the line. */}
        <span aria-hidden="true" className="leader" />
        {dish.price > 0 && (
          <span className="tabular shrink-0 text-[17px] text-ink-muted">
            {dish.price}
          </span>
        )}
      </div>
      <p className="mt-0.5 max-w-prose text-sm text-ink-muted">
        {dish.description}
        {dish.marks.length > 0 && (
          <span className="ml-2 text-herb">{dish.marks.join(" · ")}</span>
        )}
      </p>
    </>
  );
}
