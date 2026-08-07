import { useState } from "react";
import { PageHeader } from "@/components/controls";
import { Avatar } from "@/components/avatar";
import { site } from "@/content/site";
import { members } from "@/content/team";
import { resetBoard } from "@/lib/board-store";

interface Values {
  workspace: string;
  prefix: string;
  cycleLength: string;
  digestTo: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const PREFIX_PATTERN = /^[A-Z]{2,5}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation runs on submit rather than on every keystroke.
 *
 * Telling someone their email address is invalid while they are still
 * typing the second character of it is technically true and useless.
 * Once a field has been marked wrong it re-checks as they type, so the
 * error clears the moment it is fixed.
 */
function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.workspace.trim()) {
    errors.workspace = "Give the workspace a name.";
  }
  if (!PREFIX_PATTERN.test(values.prefix)) {
    errors.prefix = "Two to five capital letters, like LAN.";
  }
  if (!EMAIL_PATTERN.test(values.digestTo)) {
    errors.digestTo = "That does not look like an email address.";
  }
  return errors;
}

export function SettingsPage() {
  const [values, setValues] = useState<Values>({
    workspace: site.workspace,
    prefix: site.issuePrefix,
    cycleLength: "2",
    digestTo: "team@lantern.example",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({
    enforceWip: true,
    autoAssign: false,
    digest: true,
  });
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (key: keyof Values, next: string) => {
    const updated = { ...values, [key]: next };
    setValues(updated);
    setSaved(false);
    // Only re-validate once they have tried to submit — see validate().
    if (submitted) setErrors(validate(updated));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    setSaved(Object.keys(found).length === 0);
  };

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <PageHeader
        title="Settings"
        description="Workspace preferences. Nothing here talks to a server — this is a template, so saving just validates and tells you it worked."
      />

      <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-5">
        <section className="rounded-lg border border-line bg-surface p-4">
          <h2 className="text-[13px] font-semibold">Workspace</h2>

          <Field
            id="workspace"
            label="Name"
            hint="Shown in the sidebar and on every notification."
            error={errors.workspace}
          >
            <input
              id="workspace"
              value={values.workspace}
              onChange={(event) => update("workspace", event.target.value)}
              aria-invalid={Boolean(errors.workspace)}
              aria-describedby={errors.workspace ? "workspace-error" : undefined}
              className="focus-ring w-full rounded-md border border-line bg-raised px-2.5 py-1.5 text-[13px]"
            />
          </Field>

          <Field
            id="prefix"
            label="Issue prefix"
            hint="Every issue key starts with this."
            error={errors.prefix}
          >
            <input
              id="prefix"
              value={values.prefix}
              onChange={(event) =>
                update("prefix", event.target.value.toUpperCase())
              }
              aria-invalid={Boolean(errors.prefix)}
              aria-describedby={errors.prefix ? "prefix-error" : undefined}
              className="tabular focus-ring w-32 rounded-md border border-line bg-raised px-2.5 py-1.5 font-mono text-[13px]"
            />
          </Field>

          <Field
            id="cycleLength"
            label="Cycle length"
            hint="How long a cycle runs before it rolls over."
          >
            <select
              id="cycleLength"
              value={values.cycleLength}
              onChange={(event) => update("cycleLength", event.target.value)}
              className="focus-ring rounded-md border border-line bg-raised px-2.5 py-1.5 text-[13px]"
            >
              <option value="1">One week</option>
              <option value="2">Two weeks</option>
              <option value="3">Three weeks</option>
              <option value="4">Four weeks</option>
            </select>
          </Field>
        </section>

        <section className="rounded-lg border border-line bg-surface p-4">
          <h2 className="text-[13px] font-semibold">Behaviour</h2>
          <div className="mt-3 space-y-1">
            <Toggle
              label="Enforce work-in-progress limits"
              hint="Warn when a column goes over its limit."
              checked={toggles.enforceWip}
              onChange={(next) => {
                setToggles({ ...toggles, enforceWip: next });
                setSaved(false);
              }}
            />
            <Toggle
              label="Assign on first reply"
              hint="Whoever answers first takes the issue."
              checked={toggles.autoAssign}
              onChange={(next) => {
                setToggles({ ...toggles, autoAssign: next });
                setSaved(false);
              }}
            />
            <Toggle
              label="Weekly digest"
              hint="A Monday summary of what moved."
              checked={toggles.digest}
              onChange={(next) => {
                setToggles({ ...toggles, digest: next });
                setSaved(false);
              }}
            />
          </div>

          {toggles.digest && (
            <div className="mt-3">
              <Field
                id="digestTo"
                label="Send the digest to"
                error={errors.digestTo}
              >
                <input
                  id="digestTo"
                  type="email"
                  value={values.digestTo}
                  onChange={(event) => update("digestTo", event.target.value)}
                  aria-invalid={Boolean(errors.digestTo)}
                  aria-describedby={
                    errors.digestTo ? "digestTo-error" : undefined
                  }
                  className="focus-ring w-full rounded-md border border-line bg-raised px-2.5 py-1.5 text-[13px]"
                />
              </Field>
            </div>
          )}
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="focus-ring rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Save changes
          </button>
          <span aria-live="polite" className="text-[12px]">
            {saved && <span className="text-accent">Saved.</span>}
            {submitted && Object.keys(errors).length > 0 && (
              <span className="text-urgent">
                Fix the fields marked above and try again.
              </span>
            )}
          </span>
        </div>
      </form>

      <section className="max-w-xl rounded-lg border border-line bg-surface p-4">
        <h2 className="text-[13px] font-semibold">Members</h2>
        <ul className="mt-3 divide-y divide-line">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-3 py-2.5">
              <Avatar member={member} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px]">{member.name}</div>
                <div className="text-[11px] text-ink-subtle">{member.role}</div>
              </div>
              <span className="tabular font-mono text-[11px] text-ink-subtle">
                {member.capacity} pts
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-xl rounded-lg border border-urgent-soft bg-surface p-4">
        <h2 className="text-[13px] font-semibold">Reset the board</h2>
        <p className="mt-1 text-[12px] text-ink-muted">
          Puts every card back where <code className="font-mono">
            src/content/issues.ts
          </code>{" "}
          says it belongs. The board never persists, so a refresh does this
          too.
        </p>
        {confirmReset ? (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetBoard();
                setConfirmReset(false);
              }}
              className="focus-ring rounded-md bg-urgent px-3 py-1.5 text-[12px] font-medium text-canvas"
            >
              Yes, reset it
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="focus-ring rounded-md border border-line px-3 py-1.5 text-[12px] text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="focus-ring mt-3 rounded-md border border-line px-3 py-1.5 text-[12px] text-ink-muted transition-colors hover:border-urgent hover:text-urgent"
          >
            Reset board
          </button>
        )}
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="text-[12px] font-medium">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-[11px] text-ink-subtle">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11px] text-urgent">
          {error}
        </p>
      )}
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors hover:bg-raised">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="focus-ring mt-0.5 h-3.5 w-3.5 shrink-0 accent-accent"
      />
      <span>
        <span className="block text-[13px]">{label}</span>
        <span className="block text-[11px] text-ink-subtle">{hint}</span>
      </span>
    </label>
  );
}
