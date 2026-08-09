import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "./inbox-store";
import type { Conversation, Macro } from "@/content/types";

/** Every conversation. Re-renders when any of them changes. */
export function useConversations(): Conversation[] {
  return useSyncExternalStore(subscribe, getSnapshot).conversations;
}

/** One conversation by id, or undefined if it is not in the inbox. */
export function useConversation(
  id: string | undefined,
): Conversation | undefined {
  const conversations = useConversations();
  return id
    ? conversations.find((conversation) => conversation.id === id)
    : undefined;
}

/** The saved replies. */
export function useMacros(): Macro[] {
  return useSyncExternalStore(subscribe, getSnapshot).macros;
}
