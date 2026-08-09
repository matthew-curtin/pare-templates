import { NavIcon } from "@/components/nav-icon";

/**
 * What the right-hand pane shows before anything is picked.
 *
 * Only ever seen on a wide screen — below `lg` the list takes the whole
 * width and this pane is not rendered at all, so there is nothing for
 * this to be empty beside.
 */
export function InboxEmptyPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <NavIcon name="chat" className="size-8 text-ink-subtle" />
      <p className="text-[14px] font-medium text-ink">
        Pick a conversation to read it
      </p>
      <p className="max-w-[26rem] text-[13px] leading-relaxed text-ink-subtle">
        The most urgent are at the top. Anything with a red edge is past
        the time we promised that customer.
      </p>
      <p className="tabular mt-1 font-mono text-[11px] text-ink-subtle">
        j and k to move · / to search
      </p>
    </div>
  );
}
