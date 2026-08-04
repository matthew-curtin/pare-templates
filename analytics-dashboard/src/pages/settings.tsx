import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { members, workspace } from "@/content/site";

export function SettingsPage() {
  const [name, setName] = useState(workspace.name);
  const [retention, setRetention] = useState(String(workspace.retentionMonths));
  const [sampling, setSampling] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(submitEvent: React.FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    if (name.trim() === "") {
      setError("A workspace needs a name.");
      setSaved(false);
      return;
    }
    setError(null);
    setSaved(true);
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Workspace, data retention and who can see it."
      />

      <div className="max-w-3xl space-y-5 p-6">
        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-xl border border-line bg-surface p-5"
        >
          <h2 className="font-semibold text-ink">Workspace</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-ink-muted">Name</span>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                  setSaved(false);
                }}
                aria-invalid={error !== null}
                className={`mt-1.5 w-full rounded-lg border bg-surface px-3 py-2 text-sm outline-none focus:border-accent ${
                  error ? "border-critical" : "border-line-strong"
                }`}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-ink-muted">
                Data retention
              </span>
              <select
                value={retention}
                onChange={(e) => {
                  setRetention(e.target.value);
                  setSaved(false);
                }}
                className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
              >
                {["6", "12", "24", "36"].map((months) => (
                  <option key={months} value={months}>
                    {months} months
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-critical">
              {error}
            </p>
          )}

          <div className="mt-5 space-y-3 border-t border-line pt-5">
            <Toggle
              label="Sample high-volume events"
              help="Keeps one in ten page_viewed events once a team passes a million a month. Reduces the bill; makes small segments noisier."
              checked={sampling}
              onChange={(next) => {
                setSampling(next);
                setSaved(false);
              }}
            />
            <Toggle
              label="Email me when an alert fires"
              help="Only alerts you own. Everything is in the app regardless."
              checked={alerts}
              onChange={(next) => {
                setAlerts(next);
                setSaved(false);
              }}
            />
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Save changes
            </button>
            <p aria-live="polite" className="text-sm text-ink-subtle">
              {saved ? "Saved. Nothing left this browser — it is a template." : ""}
            </p>
          </div>
        </form>

        <section className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-semibold text-ink">Members</h2>
          <p className="mt-0.5 text-sm text-ink-subtle">
            {members.length} people, in {workspace.region}.
          </p>

          <ul className="mt-4 divide-y divide-line">
            {members.map((member) => (
              <li
                key={member.email}
                className="flex flex-wrap items-center gap-3 py-3"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent"
                >
                  {member.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {member.name}
                  </p>
                  <p className="truncate text-xs text-ink-subtle">
                    {member.email}
                  </p>
                </div>
                <span className="rounded-full bg-sunk px-2.5 py-1 text-xs font-medium text-ink-muted">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function Toggle({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? "bg-accent" : "bg-line-strong"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-subtle">{help}</p>
      </div>
    </div>
  );
}
