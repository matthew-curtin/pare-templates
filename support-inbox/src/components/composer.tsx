import { useRef, useState } from "react";
import { addMessage } from "@/lib/inbox-store";
import { useMacros } from "@/lib/use-inbox";
import { Button, MenuItem, Popover } from "./controls";

type Mode = "reply" | "note";

/**
 * Writing back.
 *
 * The two modes are one control rather than two boxes, because the
 * mistake worth preventing is sending an internal note to a customer,
 * and you prevent that by making it impossible to be in both at once
 * and obvious which one you are in.
 *
 * Sending a reply hands the conversation back to the customer;
 * "Send and resolve" is a separate button rather than a checkbox
 * because it is a different decision and gets made after the writing,
 * not before it.
 */
export function Composer({ conversationId }: { conversationId: string }) {
  const [mode, setMode] = useState<Mode>("reply");
  const [text, setText] = useState("");
  const macros = useMacros();
  const boxRef = useRef<HTMLTextAreaElement | null>(null);

  const empty = text.trim().length === 0;

  function send(options: { resolve?: boolean } = {}) {
    if (empty) return;
    const paragraphs = text
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    addMessage(conversationId, mode, paragraphs, options);
    setText("");
  }

  /**
   * Inserting a macro appends rather than replaces, and leaves the
   * cursor after it — a saved reply is an opening, and half of them get
   * something typed underneath.
   */
  function insertMacro(body: string) {
    setText((current) => (current.trim() ? `${current.trimEnd()}\n\n${body}` : body));
    boxRef.current?.focus();
  }

  return (
    <div className="border-t border-line bg-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="What to write"
          className="inline-flex rounded-md border border-line p-0.5"
        >
          {(["reply", "note"] as Mode[]).map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => setMode(candidate)}
              aria-pressed={mode === candidate}
              className={`focus-ring rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors ${
                mode === candidate
                  ? "bg-accent-soft text-accent"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {candidate === "reply" ? "Reply" : "Internal note"}
            </button>
          ))}
        </div>

        <Popover
          width="w-72"
          trigger={(props) => (
            <Button {...props} tone="quiet" icon="macro">
              Saved replies
            </Button>
          )}
        >
          {(close) => (
            <div className="max-h-72 overflow-y-auto">
              {macros.map((macro) => (
                <MenuItem
                  key={macro.id}
                  onClick={() => {
                    insertMacro(macro.body);
                    close();
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px]">
                      {macro.name}
                    </span>
                    <span className="block truncate text-[11px] text-ink-subtle">
                      {macro.hint}
                    </span>
                  </span>
                </MenuItem>
              ))}
            </div>
          )}
        </Popover>
      </div>

      <textarea
        ref={boxRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            send();
          }
        }}
        rows={4}
        placeholder={
          mode === "reply"
            ? "Write a reply to the customer…"
            : "Write a note for the team. The customer will not see this."
        }
        aria-label={mode === "reply" ? "Reply" : "Internal note"}
        className={`focus-ring mt-2 w-full resize-y rounded-md border px-3 py-2 text-[13px] leading-relaxed text-ink placeholder:text-ink-subtle ${
          mode === "note"
            ? "border-dashed border-line-strong bg-sunk"
            : "border-line bg-surface"
        }`}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {mode === "reply" ? (
          <>
            <Button tone="primary" icon="reply" disabled={empty} onClick={() => send()}>
              Send reply
            </Button>
            <Button
              tone="quiet"
              icon="check"
              disabled={empty}
              onClick={() => send({ resolve: true })}
            >
              Send and resolve
            </Button>
          </>
        ) : (
          <Button tone="primary" icon="note" disabled={empty} onClick={() => send()}>
            Add note
          </Button>
        )}
        <span className="tabular ml-auto font-mono text-[11px] text-ink-subtle">
          ⌘↵ to send
        </span>
      </div>
    </div>
  );
}
