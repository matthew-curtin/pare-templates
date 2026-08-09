import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ConversationRow } from "@/components/conversation-row";
import { Button, MenuItem, Popover, Select } from "@/components/controls";
import { NavIcon } from "@/components/nav-icon";
import { site, tags, views } from "@/content/site";
import { team } from "@/content/team";
import type { Conversation } from "@/content/types";
import { lastActivityAt, NOW, searchTextOf, slaFor } from "@/lib/derive";
import {
  compareForSort,
  matchesQuery,
  matchesView,
  type SortMode,
} from "@/lib/filters";
import { assignMany, setStatusMany } from "@/lib/inbox-store";
import { msLeftOf } from "@/lib/sla";
import { useConversations } from "@/lib/use-inbox";

/**
 * The inbox: a list beside whichever conversation is open.
 *
 * Every filter lives in the query string rather than in component
 * state, so a filtered view is a URL — it survives a refresh, it can be
 * sent to a colleague, and the browser's back button steps through
 * filter changes the way people expect it to.
 *
 * Below `lg` the two panes become one: the list when nothing is
 * selected, the conversation when something is. Showing a 380px list
 * beside a thread on a phone gives you two unreadable columns instead
 * of one readable one.
 */
export function InboxLayout() {
  const conversations = useConversations();
  const [params, setParams] = useSearchParams();
  const { id: openId } = useParams();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const viewId = params.get("view") ?? "open";
  const tagId = params.get("tag") ?? "";
  const channel = params.get("channel") ?? "";
  const query = params.get("q") ?? "";
  const sort = (params.get("sort") ?? "urgent") as SortMode;

  const view = views.find((candidate) => candidate.id === viewId) ?? views[2];

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const visible = useMemo(() => {
    const rows = conversations
      .filter((conversation) =>
        matchesView(conversation, view, site.currentMemberId),
      )
      .filter((conversation) => !tagId || conversation.tagIds.includes(tagId))
      .filter((conversation) => !channel || conversation.channel === channel)
      .filter((conversation) =>
        matchesQuery(searchTextOf(conversation), query),
      );

    // Sorting reads the clock, so the key is computed once per row
    // rather than inside the comparator, which would recompute it on
    // every comparison.
    const keyed = rows.map((conversation) => ({
      conversation,
      sortable: {
        id: conversation.id,
        lastActivityAt: lastActivityAt(conversation),
        msLeft: msLeftOf(slaFor(conversation)),
      },
    }));
    keyed.sort((a, b) => compareForSort(sort, a.sortable, b.sortable));
    return keyed.map((entry) => entry.conversation);
  }, [conversations, view, tagId, channel, query, sort]);

  // A selection is only meaningful for rows you can still see. Without
  // this, filtering down to one row and hitting Resolve silently
  // resolves the nine you selected before and can no longer check.
  useEffect(() => {
    setSelected((current) => {
      const stillVisible = current.filter((id) =>
        visible.some((conversation) => conversation.id === id),
      );
      return stillVisible.length === current.length ? current : stillVisible;
    });
  }, [visible]);

  useKeyboard({ visible, openId, navigate, searchRef });

  const filtersApplied = Boolean(tagId || channel || query);

  return (
    <div className="lg:flex lg:h-full lg:min-h-0">
      <section
        aria-label="Conversations"
        className={`flex min-h-0 flex-col border-line bg-surface lg:w-[24rem] lg:shrink-0 lg:border-r xl:w-[27rem] ${
          openId ? "hidden lg:flex" : "flex"
        }`}
      >
        <ViewStrip
          viewId={view.id}
          counts={conversations}
          onPick={(id) => setParam("view", id)}
        />

        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <div className="relative min-w-0 flex-1">
            <NavIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-ink-subtle"
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setParam("q", event.target.value)}
              placeholder="Search conversations   /"
              aria-label="Search conversations"
              className="focus-ring w-full rounded-md border border-line bg-canvas py-1.5 pr-2 pl-7 text-[13px] text-ink placeholder:text-ink-subtle"
            />
          </div>
          <Select
            label="Sort by"
            value={sort}
            onChange={(value) => setParam("sort", value)}
            options={[
              { value: "urgent", label: "Most urgent" },
              { value: "newest", label: "Newest" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
          <Select
            label="Filter by tag"
            value={tagId}
            onChange={(value) => setParam("tag", value)}
            options={[
              { value: "", label: "All tags" },
              ...tags.map((tag) => ({ value: tag.id, label: tag.name })),
            ]}
          />
          <Select
            label="Filter by channel"
            value={channel}
            onChange={(value) => setParam("channel", value)}
            options={[
              { value: "", label: "All channels" },
              { value: "email", label: "Email" },
              { value: "chat", label: "Live chat" },
              { value: "social", label: "Social" },
            ]}
          />
          {filtersApplied ? (
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(params);
                next.delete("tag");
                next.delete("channel");
                next.delete("q");
                setParams(next, { replace: true });
              }}
              className="focus-ring rounded-sm text-[12px] text-accent hover:text-accent-hover"
            >
              Clear
            </button>
          ) : null}
          <span className="tabular ml-auto font-mono text-[11px] text-ink-subtle">
            {visible.length}
          </span>
        </div>

        {selected.length > 0 ? (
          <SelectionBar
            count={selected.length}
            ids={selected}
            onDone={() => setSelected([])}
          />
        ) : null}

        {visible.length === 0 ? (
          <EmptyList filtersApplied={filtersApplied} label={view.label} />
        ) : (
          <ul className="scroll-thin min-h-0 flex-1 overflow-y-auto">
            {visible.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                now={NOW}
                active={conversation.id === openId}
                selected={selected.includes(conversation.id)}
                onSelectedChange={(isSelected) =>
                  setSelected((current) =>
                    isSelected
                      ? [...current, conversation.id]
                      : current.filter((id) => id !== conversation.id),
                  )
                }
              />
            ))}
          </ul>
        )}
      </section>

      <section
        aria-label="Conversation"
        className={`min-w-0 flex-1 lg:h-full lg:min-h-0 ${
          openId ? "block" : "hidden lg:block"
        }`}
      >
        <Outlet />
      </section>
    </div>
  );
}

/**
 * j and k move down and up the list, Enter opens, and / jumps to the
 * search box.
 *
 * The guard matters more than the shortcuts: a bare letter is only a
 * command when nothing is being typed into, or the j in "jonas" opens
 * a different conversation halfway through a search.
 */
function useKeyboard({
  visible,
  openId,
  navigate,
  searchRef,
}: {
  visible: Conversation[];
  openId: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable === true;

      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "j" && event.key !== "k") return;

      event.preventDefault();
      if (visible.length === 0) return;
      const current = visible.findIndex(
        (conversation) => conversation.id === openId,
      );
      const step = event.key === "j" ? 1 : -1;
      // With nothing open, j starts at the top and k at the bottom,
      // rather than both landing on the same row.
      const next =
        current === -1
          ? step === 1
            ? 0
            : visible.length - 1
          : Math.min(visible.length - 1, Math.max(0, current + step));
      navigate(`/c/${visible[next].id}`);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, openId, navigate, searchRef]);
}

function ViewStrip({
  viewId,
  counts,
  onPick,
}: {
  viewId: string;
  counts: Conversation[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="scroll-thin overflow-x-auto border-b border-line px-3 py-2">
      <div className="flex gap-1.5">
        {views.map((view) => {
          const total = counts.filter((conversation) =>
            matchesView(conversation, view, site.currentMemberId),
          ).length;
          const active = view.id === viewId;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onPick(view.id)}
              aria-pressed={active}
              className={`focus-ring flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] whitespace-nowrap transition-colors ${
                active
                  ? "border-accent-ring bg-accent-soft font-medium text-accent"
                  : "border-line bg-surface text-ink-muted hover:bg-hover hover:text-ink"
              }`}
            >
              {view.label}
              <span className="tabular font-mono text-[11px] opacity-70">
                {total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectionBar({
  count,
  ids,
  onDone,
}: {
  count: number;
  ids: string[];
  onDone: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-accent-soft px-3 py-2">
      <span className="text-[12px] font-medium text-accent">
        {count} selected
      </span>
      <Popover
        trigger={(props) => (
          <Button {...props} tone="quiet" icon="person">
            Assign
          </Button>
        )}
      >
        {(close) => (
          <>
            {team.map((member) => (
              <MenuItem
                key={member.id}
                onClick={() => {
                  assignMany(ids, member.id);
                  close();
                  onDone();
                }}
              >
                {member.name}
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => {
                assignMany(ids, null);
                close();
                onDone();
              }}
            >
              Nobody
            </MenuItem>
          </>
        )}
      </Popover>
      <Button
        tone="quiet"
        icon="check"
        onClick={() => {
          setStatusMany(ids, "resolved");
          onDone();
        }}
      >
        Resolve
      </Button>
      <button
        type="button"
        onClick={onDone}
        className="focus-ring ml-auto rounded-sm text-[12px] text-accent hover:text-accent-hover"
      >
        Cancel
      </button>
    </div>
  );
}

function EmptyList({
  filtersApplied,
  label,
}: {
  filtersApplied: boolean;
  label: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <NavIcon name="inbox" className="size-7 text-ink-subtle" />
      <p className="text-[13px] font-medium text-ink">
        {filtersApplied ? "Nothing matches those filters" : `No ${label.toLowerCase()}`}
      </p>
      <p className="max-w-[24rem] text-[12px] text-ink-subtle">
        {filtersApplied
          ? "Try clearing the search or the tag, or pick a different saved filter."
          : "When something arrives it will appear here."}
      </p>
    </div>
  );
}
