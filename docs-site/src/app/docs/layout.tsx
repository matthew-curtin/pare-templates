import { DocsNavDesktop, DocsNavMobile } from "@/components/docs-sidebar";
import { getNav } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  // Read once here rather than in every page under /docs. The sidebar is
  // the same on all of them.
  const nav = getNav();

  return (
    <>
      <DocsNavMobile nav={nav} />
      {/* Pages render their own <main> and, where they have one, their
          table of contents — both are flex items in this row. */}
      <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6">
        <DocsNavDesktop nav={nav} />
        {children}
      </div>
    </>
  );
}
