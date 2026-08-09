import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/avatar";
import { PlanBadge } from "@/components/chips";
import { NavIcon } from "@/components/nav-icon";
import { customers } from "@/content/customers";
import { matchesQuery } from "@/lib/filters";
import { longDate } from "@/lib/format";
import { useConversations } from "@/lib/use-inbox";

type SortKey = "name" | "conversations" | "plan";

const PLAN_ORDER = { Pro: 0, Standard: 1, Free: 2 } as const;

export function ContactsPage() {
  const conversations = useConversations();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const rows = useMemo(() => {
    const counted = customers.map((customer) => ({
      customer,
      total: conversations.filter(
        (conversation) => conversation.customerId === customer.id,
      ).length,
      open: conversations.filter(
        (conversation) =>
          conversation.customerId === customer.id &&
          conversation.status === "open",
      ).length,
    }));

    const filtered = counted.filter((row) =>
      matchesQuery(
        `${row.customer.name} ${row.customer.company} ${row.customer.email} ${row.customer.location}`,
        query,
      ),
    );

    // Every comparator ends on the name, so the order is total and the
    // table does not reshuffle rows that tie.
    return filtered.sort((a, b) => {
      if (sort === "conversations" && a.total !== b.total) {
        return b.total - a.total;
      }
      if (sort === "plan" && a.customer.plan !== b.customer.plan) {
        return PLAN_ORDER[a.customer.plan] - PLAN_ORDER[b.customer.plan];
      }
      return a.customer.name.localeCompare(b.customer.name);
    });
  }, [conversations, query, sort]);

  return (
    <div className="scroll-thin h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <header>
          <h1 className="text-lg font-semibold tracking-tight">Contacts</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            Everyone who has bought something. The plan is what decides how
            fast we have promised to answer them.
          </p>
        </header>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <NavIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-ink-subtle"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search contacts"
              aria-label="Search contacts"
              className="focus-ring w-full rounded-md border border-line bg-surface py-1.5 pr-2 pl-7 text-[13px] placeholder:text-ink-subtle"
            />
          </div>
          <div
            role="group"
            aria-label="Sort contacts"
            className="inline-flex rounded-md border border-line bg-surface p-0.5"
          >
            {(
              [
                ["name", "Name"],
                ["conversations", "Most conversations"],
                ["plan", "Plan"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`focus-ring rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap transition-colors ${
                  sort === key
                    ? "bg-accent-soft text-accent"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="mt-8 text-center text-[13px] text-ink-subtle">
            Nobody matches “{query}”.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {rows.map(({ customer, total, open }) => (
              <li key={customer.id}>
                <Link
                  to={`/contacts/${customer.id}`}
                  className="focus-ring flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 hover:bg-hover"
                >
                  <Avatar
                    initials={customer.initials}
                    name={customer.name}
                    size="md"
                    tone="customer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-ink">
                      {customer.name}
                    </div>
                    <div className="truncate text-[12px] text-ink-subtle">
                      {customer.company === "—"
                        ? customer.location
                        : `${customer.company} · ${customer.location}`}
                    </div>
                  </div>
                  <PlanBadge plan={customer.plan} />
                  <div className="hidden w-32 shrink-0 text-right text-[12px] text-ink-muted sm:block">
                    {total === 0 ? (
                      <span className="text-ink-subtle">Never written in</span>
                    ) : (
                      <>
                        <span className="tabular font-mono">{total}</span>{" "}
                        {total === 1 ? "conversation" : "conversations"}
                        {open > 0 ? (
                          <span className="block text-[11px] text-ink-subtle">
                            <span className="tabular font-mono">{open}</span>{" "}
                            open
                          </span>
                        ) : null}
                      </>
                    )}
                  </div>
                  <div className="hidden w-28 shrink-0 text-right text-[11px] text-ink-subtle md:block">
                    since {longDate(customer.since)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
