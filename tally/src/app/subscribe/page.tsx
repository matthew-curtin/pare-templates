"use client";

import { useState } from "react";
import { PageHead, Shell } from "@/components/shell";
import { SERVICES } from "@/content/services";
import { PAGE_INTROS, SITE } from "@/content/site";

/**
 * Notification preferences.
 *
 * `noValidate` is deliberate: the browser validates `type="email"` before a
 * submit handler ever runs, so a form that styles its own errors mostly
 * shows a native bubble instead — one that looks nothing like the page and
 * cannot be positioned. It also leaves the handler's own branches
 * unreachable, so they go untested and then wrong. §8.
 */

type Channel = "email" | "webhook" | "rss";

const CHANNELS: { id: Channel; label: string; hint: string }[] = [
  { id: "email", label: "Email", hint: "One message per state change. Nothing else, ever." },
  { id: "webhook", label: "Webhook", hint: "A POST with the incident as JSON, retried for an hour." },
  { id: "rss", label: "RSS", hint: "No address needed — copy the feed and go." },
];

const FEED_URL = "https://status.coldharbour.example/feed.xml";

export default function SubscribePage() {
  const [channel, setChannel] = useState<Channel>("email");
  const [target, setTarget] = useState("");
  const [chosen, setChosen] = useState<string[]>(SERVICES.map((s) => s.id));
  const [maintenance, setMaintenance] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const needsTarget = channel !== "rss";

  function toggle(id: string) {
    setChosen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (needsTarget && target.trim() === "") {
      setError(
        channel === "email"
          ? "We need an address to send to."
          : "We need a URL to POST to.",
      );
      return;
    }
    if (channel === "email" && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(target.trim())) {
      setError("That does not look like an email address.");
      return;
    }
    if (channel === "webhook" && !/^https:\/\/\S+$/.test(target.trim())) {
      setError("Webhook URLs have to start with https://.");
      return;
    }
    if (chosen.length === 0) {
      setError("Choose at least one service, or there is nothing to send.");
      return;
    }

    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <Shell>
        <PageHead eyebrow="Notifications" title="That is set up" />
        <section className="frame pb-20">
          <div className="panel measure p-6">
            <p className="prose-body text-ink-dim">
              {channel === "rss" ? (
                <>
                  Nothing to confirm — an RSS feed has no subscription. Point
                  your reader at{" "}
                  <span className="num text-ink">{FEED_URL}</span>.
                </>
              ) : (
                <>
                  We have sent a confirmation to{" "}
                  <span className="num text-ink">{target.trim()}</span>. Nothing
                  is delivered until you click it, which is the only way to be
                  sure we are not the ones filling your inbox.
                </>
              )}
            </p>
            <p className="prose-body mt-4 text-micro text-ink-faint">
              You chose {chosen.length} of {SERVICES.length} services
              {maintenance ? ", including announced maintenance" : ", excluding announced maintenance"}.
              Nothing here is real — this is a template, and no message will
              arrive.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="btn btn-quiet mt-6"
            >
              Change it
            </button>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHead
        eyebrow="Notifications"
        title="Hear about it before you notice it"
        intro={PAGE_INTROS.subscribe}
      />

      <section className="frame pb-20">
        <form noValidate onSubmit={submit} className="measure-wide">
          <fieldset>
            <legend className="eyebrow">How</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {CHANNELS.map((c) => (
                <label
                  key={c.id}
                  className="panel cursor-pointer p-4 transition-colors"
                  style={
                    channel === c.id
                      ? { borderColor: "var(--color-accent)" }
                      : undefined
                  }
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="channel"
                      value={c.id}
                      checked={channel === c.id}
                      onChange={() => {
                        setChannel(c.id);
                        setError(null);
                      }}
                      className="accent-accent"
                    />
                    <span className="font-medium text-ink">{c.label}</span>
                  </span>
                  <span className="prose-body mt-2 block text-micro text-ink-faint">
                    {c.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {needsTarget && (
            <div className="mt-8">
              <label htmlFor="target" className="eyebrow">
                {channel === "email" ? "Address" : "Endpoint"}
              </label>
              <input
                id="target"
                name="target"
                type={channel === "email" ? "email" : "url"}
                value={target}
                onChange={(e) => {
                  setTarget(e.target.value);
                  setError(null);
                }}
                placeholder={
                  channel === "email"
                    ? "oncall@your-company.example"
                    : "https://hooks.your-company.example/coldharbour"
                }
                className="field mt-2 num"
                aria-describedby={error ? "form-error" : undefined}
                aria-invalid={error ? true : undefined}
              />
            </div>
          )}

          <fieldset className="mt-8">
            <legend className="eyebrow">Which services</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2 text-ink-dim hover:text-ink transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={chosen.includes(s.id)}
                    onChange={() => {
                      toggle(s.id);
                      setError(null);
                    }}
                    className="accent-accent"
                  />
                  {s.name}
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-4">
              <button
                type="button"
                onClick={() => setChosen(SERVICES.map((s) => s.id))}
                className="text-micro text-accent hover:underline"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setChosen([])}
                className="text-micro text-accent hover:underline"
              >
                None
              </button>
            </div>
          </fieldset>

          <label className="mt-8 flex cursor-pointer items-start gap-2.5 text-ink-dim hover:text-ink transition-colors">
            <input
              type="checkbox"
              checked={maintenance}
              onChange={() => setMaintenance((m) => !m)}
              className="mt-1 accent-accent"
            />
            <span>
              Announced maintenance
              <span className="prose-body block text-micro text-ink-faint">
                Sent at least seven days ahead. Turning this off means the first
                you hear of a window is the strip on the front page.
              </span>
            </span>
          </label>

          {error && (
            <p
              id="form-error"
              role="alert"
              className="prose-body mt-6 border-l-2 pl-3"
              style={{ borderColor: "var(--color-partial)", color: "var(--color-ink)" }}
            >
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-primary">
              {channel === "rss" ? "Show me the feed" : "Subscribe"}
            </button>
            <p className="text-micro text-ink-faint">
              Or write to{" "}
              <span className="num text-ink-dim">{SITE.supportEmail}</span>.
            </p>
          </div>
        </form>
      </section>
    </Shell>
  );
}
