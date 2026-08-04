"use client";

import { useEffect, useState } from "react";

/**
 * A hairline at the top of the window showing how far through the
 * story you are.
 *
 * Measures the article element rather than the whole document, so the
 * bar reaches 100% at the end of the text and not somewhere inside the
 * footer.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      // Distance we can actually scroll through the article: its height
      // minus one viewport. Guarded because a very short article on a
      // very tall window has none, and would divide by zero.
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 1 : 0);
        return;
      }
      const passed = -rect.top;
      setProgress(Math.min(1, Math.max(0, passed / scrollable)));
    };

    // Coalesce to one measurement per frame; scroll fires far more
    // often than the screen updates.
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      role="progressbar"
      aria-label="Story progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
