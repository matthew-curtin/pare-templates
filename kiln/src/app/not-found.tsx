import Link from "next/link";
import { Band } from "@/components/shell";
import { nav } from "@/content/site";

export default function NotFound() {
  return (
    <Band top>
      <h1 className="display max-w-[14ch]">Nothing on this shelf</h1>
      <p className="mt-5 max-w-[52ch] text-lede leading-relaxed text-ink-muted">
        Either it was collected, or it never existed. Both happen, and only one of them is
        anybody&rsquo;s fault.
      </p>
      <ul className="mt-8 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[0.9375rem]">
        {nav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="focus-ring text-fire underline underline-offset-2"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </Band>
  );
}
