"use client";

import { useState } from "react";

import { collection } from "@/content/collection";
import { weekLabel } from "@/lib/calendar";
import { bestWeekFor, index } from "@/lib/season";

const ix = index(collection);

/** Only things that are genuinely worth choosing between. A picker with
 *  fifty-eight boxes in it is a database, and half of them would be a
 *  hedge. Strength 6 and above is the line the garden itself draws. */
const CHOOSABLE = collection
  .filter((a) => a.strength >= 6)
  .sort((a, b) => a.peak - b.peak);

/**
 * "I want to see these five things — when do I come?"
 *
 * The interesting half is `missing`, and it is the reason this is not a
 * gimmick: with any real list of favourites there is NO week that has
 * all of it, so the honest answer is always a winner plus a list of
 * what you are giving up. A planner that printed only the winner would
 * be lying by omission in exactly the way the rest of the site argues
 * against.
 *
 * The show/hide of the result is done in CSS by `:has()` rather than by
 * this component — see `.picker` in globals.css. React is here for the
 * arithmetic, which genuinely needs it (the answer depends on an
 * arbitrary subset, so there is nothing to precompute), and not for
 * presentation a selector already does.
 */
export function Planner() {
  const [picked, setPicked] = useState<string[]>([]);
  const plan = picked.length > 0 ? bestWeekFor(ix, picked) : null;

  function toggle(slug: string) {
    setPicked((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  return (
    <div className="picker">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
          margin: "1.5rem 0 2rem",
        }}
      >
        {CHOOSABLE.map((a) => (
          <label key={a.slug} className="chip">
            <input
              type="checkbox"
              checked={picked.includes(a.slug)}
              onChange={() => toggle(a.slug)}
            />
            <span className="binomial">{a.name}</span>
            <span className="figure" style={{ opacity: 0.6, fontSize: "var(--text-small)" }}>
              wk {a.peak}
            </span>
          </label>
        ))}
      </div>

      <p className="plan-empty prose-note" style={{ color: "var(--color-ink-muted)" }}>
        Pick anything above. Choose three or four things you would actually
        drive for, rather than everything — the more you ask for, the more the
        answer becomes a compromise, and the point of this page is to show you
        what the compromise costs.
      </p>

      {plan ? (
        <div className="plan-result">
          <div className="label" style={{ color: "var(--color-ink-muted)" }}>
            Come in
          </div>
          <a
            href={`/week/${plan.week}`}
            className="monument"
            style={{
              display: "block",
              color: "inherit",
              textDecoration: "none",
              marginTop: "0.3rem",
            }}
          >
            Week {plan.week}
          </a>
          <p className="display" style={{ fontSize: "var(--text-title)", marginTop: "0.5rem" }}>
            {weekLabel(plan.week)}
          </p>

          <div
            style={{
              display: "grid",
              gap: "clamp(1rem, 2vw, 2rem)",
              gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
              marginTop: "2rem",
            }}
          >
            <div className="panel">
              <div className="label">
                Out that week · <span className="figure">{plan.out.length}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0.6rem 0 0" }}>
                {plan.out.map((a) => (
                  <li key={a.slug} style={{ padding: "0.25rem 0" }}>
                    <a href={`/plants/${a.slug}`} className="link-quiet binomial">
                      {a.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="panel"
              style={
                plan.missing.length > 0
                  ? { background: "var(--color-thin)", color: "white" }
                  : undefined
              }
            >
              <div className="label">
                You would miss · <span className="figure">{plan.missing.length}</span>
              </div>
              {plan.missing.length === 0 ? (
                <p style={{ marginTop: "0.6rem" }}>
                  Nothing. Everything you picked is out at once that week, which
                  is rarer than it sounds.
                </p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: "0.6rem 0 0" }}>
                  {plan.missing.map((a) => (
                    <li key={a.slug} style={{ padding: "0.25rem 0" }}>
                      <a href={`/plants/${a.slug}`} className="link-quiet binomial">
                        {a.name}
                      </a>
                      <span className="figure" style={{ opacity: 0.8 }}>
                        {" "}
                        — best in week {a.peak}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
