import { Link, useParams } from "react-router-dom";
import { Avatar } from "@/components/avatar";
import {
  ChannelBadge,
  PlanBadge,
  SlaLabel,
  StatusPill,
} from "@/components/chips";
import { NavIcon } from "@/components/nav-icon";
import { customers } from "@/content/customers";
import { customerById, hoursForPlan, NOW, slaFor } from "@/lib/derive";
import { longDate, relativeTime } from "@/lib/format";
import { useConversations } from "@/lib/use-inbox";

export function ContactDetailPage() {
  const { id } = useParams();
  const customer = id ? customerById(id) : undefined;
  const conversations = useConversations();

  if (!customer) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-[15px] font-semibold">No such contact</h1>
        <Link
          to="/contacts"
          className="focus-ring rounded-sm text-[13px] text-accent hover:text-accent-hover"
        >
          Back to contacts
        </Link>
      </div>
    );
  }

  const theirs = conversations
    .filter((conversation) => conversation.customerId === customer.id)
    .sort((a, b) => Number(b.ref) - Number(a.ref));

  const index = customers.findIndex(
    (candidate) => candidate.id === customer.id,
  );
  const next = customers[(index + 1) % customers.length];

  return (
    <div className="scroll-thin h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link
          to="/contacts"
          className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-[13px] text-ink-muted hover:text-ink"
        >
          <NavIcon name="back" className="size-3.5" />
          Contacts
        </Link>

        <header className="mt-4 flex flex-wrap items-start gap-3">
          <Avatar
            initials={customer.initials}
            name={customer.name}
            size="lg"
            tone="customer"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold tracking-tight">
              {customer.name}
            </h1>
            <p className="prose-wrap mt-0.5 text-[13px] text-ink-muted">
              {customer.company === "—" ? "" : `${customer.company} · `}
              {customer.email}
            </p>
          </div>
          <PlanBadge plan={customer.plan} />
        </header>

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Where">{customer.location}</Stat>
          <Stat label="Customer since">{longDate(customer.since)}</Stat>
          <Stat label="Reply promised">
            <span className="tabular font-mono">
              {hoursForPlan(customer.plan)}h
            </span>
          </Stat>
          <Stat label="Conversations">
            <span className="tabular font-mono">{theirs.length}</span>
          </Stat>
        </dl>

        {customer.note ? (
          <div className="mt-5 rounded-lg border border-line bg-surface p-3.5">
            <div className="text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
              Worth knowing
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-ink">
              {customer.note}
            </p>
          </div>
        ) : null}

        <section className="mt-6">
          <h2 className="text-[13px] font-semibold tracking-wide text-ink-subtle uppercase">
            History
          </h2>
          {theirs.length === 0 ? (
            <div className="mt-2 rounded-lg border border-dashed border-line-strong bg-surface px-4 py-8 text-center">
              <p className="text-[13px] font-medium text-ink">
                They have never written in
              </p>
              <p className="mt-1 text-[12px] text-ink-subtle">
                Bought something {longDate(customer.since)} and has not needed
                anything since, which is the best kind of customer to have.
              </p>
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {theirs.map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    to={`/c/${conversation.id}`}
                    className="focus-ring block rounded-lg border border-line bg-surface px-3 py-2.5 hover:bg-hover"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                        {conversation.subject}
                      </span>
                      <span className="tabular shrink-0 font-mono text-[11px] text-ink-subtle">
                        #{conversation.ref}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <StatusPill status={conversation.status} short />
                      <ChannelBadge channel={conversation.channel} withLabel />
                      <SlaLabel state={slaFor(conversation, NOW)} />
                      <span className="tabular ml-auto font-mono text-[11px] text-ink-subtle">
                        {relativeTime(
                          conversation.messages[
                            conversation.messages.length - 1
                          ].at,
                          NOW,
                        )}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <nav className="mt-8 border-t border-line pt-4">
          <Link
            to={`/contacts/${next.id}`}
            className="focus-ring rounded-sm text-[13px] text-accent hover:text-accent-hover"
          >
            Next contact: {next.name} →
          </Link>
        </nav>
      </div>
    </div>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface px-3 py-2">
      <dt className="text-[11px] tracking-wide text-ink-subtle uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-[13px] text-ink">{children}</dd>
    </div>
  );
}
