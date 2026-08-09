import { Avatar } from "@/components/avatar";
import { StatusPill } from "@/components/chips";
import { Button } from "@/components/controls";
import { site, slaPolicies, statusMeanings, tags } from "@/content/site";
import { team } from "@/content/team";
import type { Status } from "@/content/types";
import { resetInbox } from "@/lib/inbox-store";
import { useConversations } from "@/lib/use-inbox";

export function SettingsPage() {
  const conversations = useConversations();

  return (
    <div className="scroll-thin h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <header>
          <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            {site.workspace} · {site.workspaceDetail}
          </p>
        </header>

        <Section
          title="What we have promised"
          blurb="The only reason two identical questions can have different deadlines. Changing a number here changes which rows in the inbox turn red."
        >
          <ul className="divide-y divide-line">
            {slaPolicies.map((policy) => (
              <li
                key={policy.plan}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="text-[13px] font-medium text-ink">
                  {policy.plan}
                </span>
                <span className="text-[13px] text-ink-muted">
                  first reply within{" "}
                  <span className="tabular font-mono text-ink">
                    {policy.firstResponseHours} hours
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-ink-subtle">
            First reply rather than resolution: how long something takes to
            fix depends on the customer answering, and measuring that would
            put half the inbox permanently in the red through nobody’s fault.
          </p>
        </Section>

        <Section
          title="What the statuses mean"
          blurb="Four states, and none of them is a stage of another — waiting and snoozed both mean “not on you”, and differ only in what brings them back."
        >
          <ul className="space-y-2.5">
            {statusMeanings.map((entry) => (
              <li key={entry.status} className="flex flex-wrap items-baseline gap-2">
                <StatusPill status={entry.status as Status} />
                <span className="min-w-0 flex-1 text-[13px] text-ink-muted">
                  {entry.meaning}
                </span>
                <span className="tabular font-mono text-[11px] text-ink-subtle">
                  {
                    conversations.filter(
                      (conversation) => conversation.status === entry.status,
                    ).length
                  }
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="The team" blurb="Who can be assigned a conversation.">
          <ul className="divide-y divide-line">
            {team.map((member) => {
              const load = conversations.filter(
                (conversation) =>
                  conversation.assigneeId === member.id &&
                  conversation.status === "open",
              ).length;
              return (
                <li key={member.id} className="flex items-center gap-3 py-2.5">
                  <Avatar
                    initials={member.initials}
                    name={member.name}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-ink">
                      {member.name}
                      {member.id === site.currentMemberId ? (
                        <span className="ml-1.5 text-[11px] font-normal text-ink-subtle">
                          (you)
                        </span>
                      ) : null}
                    </div>
                    <div className="truncate text-[12px] text-ink-subtle">
                      {member.role}
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-[12px]">
                    {load === 0 ? (
                      <span className="text-ink-subtle">nothing open</span>
                    ) : (
                      <span className="text-ink-muted">
                        <span className="tabular font-mono text-ink">
                          {load}
                        </span>{" "}
                        open
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          title="Tags"
          blurb="Used to group conversations and to filter the list."
        >
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const used = conversations.filter((conversation) =>
                conversation.tagIds.includes(tag.id),
              ).length;
              return (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-canvas px-2 py-1 text-[12px] text-ink-muted"
                >
                  {tag.name}
                  <span className="tabular font-mono text-[11px] text-ink-subtle">
                    {used}
                  </span>
                </span>
              );
            })}
          </div>
        </Section>

        <Section
          title="This is a template"
          blurb="Everything here is invented — the company, the people, the conversations and the numbers. Replace them before showing this to anyone."
        >
          <p className="text-[13px] text-ink-muted">
            Nothing is saved. Replying, assigning, tagging and editing a saved
            reply all change the app in memory only; reloading the page puts
            the contents of{" "}
            <code className="rounded bg-sunk px-1 py-0.5 font-mono text-[12px]">
              src/content/
            </code>{" "}
            back exactly as they were.
          </p>
          <div className="mt-3">
            <Button tone="quiet" onClick={resetInbox}>
              Reset the inbox now
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-lg border border-line bg-surface p-4">
      <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
      <p className="mt-1 mb-3 max-w-2xl text-[12px] leading-relaxed text-ink-subtle">
        {blurb}
      </p>
      {children}
    </section>
  );
}
