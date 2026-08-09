import { conversations as seedConversations } from "@/content/conversations";
import { macros as seedMacros } from "@/content/macros";
import { site } from "@/content/site";
import type {
  Conversation,
  Macro,
  Message,
  MessageKind,
  Status,
} from "@/content/types";

/**
 * The inbox's live state.
 *
 * A plain module store rather than a context and `useState`, matching
 * `project-tracker`: components subscribe through
 * `useSyncExternalStore`, which is the supported way to read something
 * outside React and needs no provider wrapped around the tree.
 *
 * It deliberately does NOT persist. Reload and the inbox returns to
 * `src/content/`. A shopping basket should survive a refresh because it
 * is the user's; these conversations are the template's *content*, and
 * content that a stray storage entry can override has stopped being
 * editable — which is the one thing a template has to be.
 */

interface State {
  conversations: Conversation[];
  macros: Macro[];
}

let state: State = {
  conversations: seedConversations,
  macros: seedMacros,
};

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Must return the same reference until something actually changes, or
 * `useSyncExternalStore` re-renders forever.
 */
export function getSnapshot(): State {
  return state;
}

function updateConversation(
  id: string,
  change: (conversation: Conversation) => Conversation,
): void {
  let touched = false;
  const next = state.conversations.map((conversation) => {
    if (conversation.id !== id) return conversation;
    const updated = change(conversation);
    if (updated !== conversation) touched = true;
    return updated;
  });
  // No-op guard: without it, opening an already-read conversation
  // notifies every subscriber for nothing.
  if (!touched) return;
  state = { ...state, conversations: next };
  emit();
}

export function markRead(id: string): void {
  updateConversation(id, (conversation) =>
    conversation.unread ? { ...conversation, unread: false } : conversation,
  );
}

export function setStatus(
  id: string,
  status: Status,
  snoozedUntil: string | null = null,
): void {
  updateConversation(id, (conversation) =>
    conversation.status === status && conversation.snoozedUntil === snoozedUntil
      ? conversation
      : {
          ...conversation,
          status,
          // Only a snoozed conversation carries a date, so leaving a
          // stale one behind would have "Snoozed until Monday" showing
          // on something that was reopened on Friday.
          snoozedUntil: status === "snoozed" ? snoozedUntil : null,
        },
  );
}

export function assign(id: string, memberId: string | null): void {
  updateConversation(id, (conversation) =>
    conversation.assigneeId === memberId
      ? conversation
      : { ...conversation, assigneeId: memberId },
  );
}

export function toggleTag(id: string, tagId: string): void {
  updateConversation(id, (conversation) => ({
    ...conversation,
    tagIds: conversation.tagIds.includes(tagId)
      ? conversation.tagIds.filter((candidate) => candidate !== tagId)
      : [...conversation.tagIds, tagId],
  }));
}

let messageCounter = 0;

/**
 * Add a message to a thread.
 *
 * The status change is part of sending, not a separate step the caller
 * has to remember: a reply hands the conversation back to the customer,
 * whereas a note changes nothing about whose turn it is. Getting that
 * wrong in one of the several places a message can be sent from is
 * exactly how an inbox ends up with rows in the wrong column.
 */
export function addMessage(
  id: string,
  kind: MessageKind,
  body: string[],
  options: { resolve?: boolean } = {},
): void {
  messageCounter += 1;
  const message: Message = {
    id: `m-live-${messageCounter}`,
    kind,
    authorId: site.currentMemberId,
    at: new Date(Date.parse(site.now)).toISOString(),
    body,
  };
  updateConversation(id, (conversation) => {
    const status: Status =
      kind === "note"
        ? conversation.status
        : options.resolve
          ? "resolved"
          : "waiting";
    return {
      ...conversation,
      unread: false,
      status,
      snoozedUntil: null,
      messages: [...conversation.messages, message],
    };
  });
}

/** Bulk actions from the list's selection bar. */
export function assignMany(ids: string[], memberId: string | null): void {
  for (const id of ids) assign(id, memberId);
}

export function setStatusMany(ids: string[], status: Status): void {
  for (const id of ids) setStatus(id, status);
}

/* ---------- saved replies ---------- */

export function saveMacro(macro: Macro): void {
  state = {
    ...state,
    macros: state.macros.map((candidate) =>
      candidate.id === macro.id ? macro : candidate,
    ),
  };
  emit();
}

let macroCounter = 0;

export function createMacro(): string {
  macroCounter += 1;
  const id = `mac-new-${macroCounter}`;
  state = {
    ...state,
    macros: [
      { id, name: "Untitled reply", hint: "What it is for", body: "" },
      ...state.macros,
    ],
  };
  emit();
  return id;
}

export function deleteMacro(id: string): void {
  state = {
    ...state,
    macros: state.macros.filter((macro) => macro.id !== id),
  };
  emit();
}

/** Back to the contents of `src/content/`. */
export function resetInbox(): void {
  state = { conversations: seedConversations, macros: seedMacros };
  emit();
}
