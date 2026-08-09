import { useState } from "react";
import { Button, Field, inputClasses } from "@/components/controls";
import { NavIcon } from "@/components/nav-icon";
import { createMacro, deleteMacro, saveMacro } from "@/lib/inbox-store";
import { useMacros } from "@/lib/use-inbox";

/**
 * The saved replies, editable in place.
 *
 * Editing writes to the store on every keystroke rather than behind a
 * Save button. There is nothing to lose — the store is in memory and a
 * reload puts `src/content/macros.ts` back — and a Save button on a
 * page like this mostly exists to be forgotten.
 *
 * Deleting is behind a confirm step, because it is the one thing here
 * that cannot be undone by carrying on typing.
 */
export function MacrosPage() {
  const macros = useMacros();
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <div className="scroll-thin h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Saved replies
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-ink-muted">
              Openings rather than whole answers. A macro that reads like a
              finished message gets sent as one, and the customer can tell.
            </p>
          </div>
          <Button tone="primary" icon="plus" onClick={() => createMacro()}>
            New reply
          </Button>
        </header>

        <ul className="mt-5 space-y-3">
          {macros.map((macro) => (
            <li
              key={macro.id}
              className="rounded-lg border border-line bg-surface p-3.5"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  {(id) => (
                    <input
                      id={id}
                      value={macro.name}
                      onChange={(event) =>
                        saveMacro({ ...macro, name: event.target.value })
                      }
                      className={inputClasses}
                    />
                  )}
                </Field>
                <Field label="What it is for">
                  {(id) => (
                    <input
                      id={id}
                      value={macro.hint}
                      onChange={(event) =>
                        saveMacro({ ...macro, hint: event.target.value })
                      }
                      className={inputClasses}
                    />
                  )}
                </Field>
              </div>

              <div className="mt-3">
                <Field label="The reply">
                  {(id) => (
                    <textarea
                      id={id}
                      value={macro.body}
                      rows={5}
                      onChange={(event) =>
                        saveMacro({ ...macro, body: event.target.value })
                      }
                      className={`${inputClasses} resize-y leading-relaxed`}
                    />
                  )}
                </Field>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="tabular font-mono text-[11px] text-ink-subtle">
                  {macro.body.length} characters
                </span>
                {confirming === macro.id ? (
                  <span className="ml-auto flex items-center gap-2">
                    <span className="text-[12px] text-ink-muted">
                      Delete this reply?
                    </span>
                    <Button
                      tone="danger"
                      onClick={() => {
                        deleteMacro(macro.id);
                        setConfirming(null);
                      }}
                    >
                      Delete
                    </Button>
                    <Button tone="ghost" onClick={() => setConfirming(null)}>
                      Keep
                    </Button>
                  </span>
                ) : (
                  <Button
                    tone="ghost"
                    icon="trash"
                    className="ml-auto"
                    onClick={() => setConfirming(macro.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {macros.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-surface px-4 py-10 text-center">
            <NavIcon name="macro" className="mx-auto size-6 text-ink-subtle" />
            <p className="mt-2 text-[13px] font-medium text-ink">
              No saved replies
            </p>
            <p className="mt-1 text-[12px] text-ink-subtle">
              Reload the page to put the originals back.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
