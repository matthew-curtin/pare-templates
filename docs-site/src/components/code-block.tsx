"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The chrome around a code sample: the language label and the copy button.
 *
 * A client component wrapping server-rendered children — the highlighted
 * code is produced on the server and passed in as `children`, so none of
 * Shiki reaches the browser. Only the copy button ships.
 */
export function CodeBlock({
  code,
  label,
  children,
}: {
  code: string;
  label: string | null;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The timer is owned here and cleared on unmount, so navigating away
  // mid-countdown cannot set state on a component that is gone.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function settle(next: "copied" | "failed") {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1600);
  }

  async function copy() {
    // The clipboard API needs a secure context, so it is simply absent
    // over plain HTTP — which includes a colleague opening your dev server
    // by LAN address. Falling back rather than throwing keeps the button
    // working there.
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        settle("copied");
        return;
      }
    } catch {
      // Refused; try the older path below rather than giving up.
    }

    try {
      const scratch = document.createElement("textarea");
      scratch.value = code;
      scratch.setAttribute("readonly", "");
      scratch.style.cssText = "position:fixed;top:0;left:-9999px";
      document.body.appendChild(scratch);
      scratch.select();
      const ok = document.execCommand("copy");
      scratch.remove();
      settle(ok ? "copied" : "failed");
    } catch {
      // Never a blocking prompt() — it stops the page dead, and the button
      // saying so is enough. The code is on screen and selectable.
      settle("failed");
    }
  }

  const copyLabel = state === "copied" ? "Copied" : state === "failed" ? "Press ⌘C" : "Copy";

  return (
    <div className="group/code my-5 overflow-hidden rounded-lg border border-code-border bg-code">
      <div className="flex items-center justify-between border-b border-code-border bg-code-chrome px-3 py-1.5">
        <span className="font-mono text-[11px] tracking-wide text-code-ink/60 uppercase">
          {label ?? "text"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="focus-ring rounded px-2 py-0.5 font-mono text-[11px] text-code-ink/70 transition hover:bg-white/10 hover:text-code-ink"
        >
          {copyLabel}
        </button>
      </div>
      {children}
    </div>
  );
}
