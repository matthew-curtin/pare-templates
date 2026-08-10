import { Link, useSearchParams } from "react-router-dom";
import { Band } from "@/components/shell";
import { Head, KindMark, Notice, StateLabel } from "@/components/bits";
import {
  bought,
  demand,
  gapOf,
  ix,
  productViews,
  slackOf,
  stateOf,
  stockToday,
  supplierOf,
} from "@/lib/shop";
import { qtyIn } from "@/lib/bom";
import { suppliers } from "@/content/suppliers";
import { money, priceExact, qty as fmtQty } from "@/lib/format";

/**
 * The tree flattened.
 *
 * Same data, same numbers, read across instead of down — which is the
 * view you want when the question is about a SUPPLIER rather than about
 * a bicycle. Filters are links carrying query parameters rather than
 * component state, so a filtered list is a URL somebody can send to the
 * person who has to make the phone call.
 */
export default function PartsPage() {
  const [params] = useSearchParams();
  const supplier = params.get("supplier");
  const state = params.get("state");
  const sort = params.get("sort") ?? "name";

  let rows = bought.filter((p) => {
    if (supplier && p.supplierId !== supplier) return false;
    if (state === "short" && stateOf(p.id) !== "short") return false;
    if (state === "inbound" && stateOf(p.id) !== "inbound") return false;
    if (state === "noslack" && (slackOf(p.id) ?? 1) > 0) return false;
    return true;
  });

  rows = [...rows].sort((a, b) => {
    switch (sort) {
      case "cost":
        return (b.cost ?? 0) - (a.cost ?? 0);
      case "lead":
        return (b.leadDays ?? 0) - (a.leadDays ?? 0);
      case "slack":
        return (slackOf(a.id) ?? 999) - (slackOf(b.id) ?? 999);
      case "spend":
        return (b.cost ?? 0) * (demand.get(b.id) ?? 0) - (a.cost ?? 0) * (demand.get(a.id) ?? 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const spend = (id: string, cost: number) => Math.round(cost * (demand.get(id) ?? 0));

  return (
    <>
      <Band top>
        <h1 className="display max-w-[16ch]">Everything we buy</h1>
        <p className="mt-4 max-w-[64ch] text-[1.0625rem] leading-relaxed text-ink-muted">
          {bought.length} bought lines across {suppliers.length} accounts. The two columns worth
          arguing with are the last ones: what the committed queue wants, and how late this part
          could be before anybody noticed.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          <FilterGroup
            label="Show"
            current={state ?? "all"}
            options={[
              { key: "all", label: "Everything", to: linkTo(params, "state", null) },
              { key: "short", label: "Short", to: linkTo(params, "state", "short") },
              { key: "inbound", label: "On order", to: linkTo(params, "state", "inbound") },
              { key: "noslack", label: "No slack", to: linkTo(params, "state", "noslack") },
            ]}
          />
          <FilterGroup
            label="Order by"
            current={sort}
            options={[
              { key: "name", label: "Name", to: linkTo(params, "sort", null) },
              { key: "spend", label: "Queue spend", to: linkTo(params, "sort", "spend") },
              { key: "cost", label: "Unit price", to: linkTo(params, "sort", "cost") },
              { key: "lead", label: "Lead", to: linkTo(params, "sort", "lead") },
              { key: "slack", label: "Slack", to: linkTo(params, "sort", "slack") },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.8125rem]">
          <span className="text-ink-subtle">Account:</span>
          <FilterLink to={linkTo(params, "supplier", null)} active={!supplier}>
            all
          </FilterLink>
          {suppliers.map((s) => (
            <FilterLink
              key={s.id}
              to={linkTo(params, "supplier", s.id)}
              active={supplier === s.id}
            >
              {s.name}
            </FilterLink>
          ))}
        </div>
      </Band>

      <Band tint>
        <Head
          note={
            rows.length === bought.length
              ? "Every bought line, in one table. Nothing here is rounded — a part that costs three cents is printed as three cents, because the whole argument of this shop is that three cents is sometimes the number that matters."
              : `${rows.length} of ${bought.length} lines.`
          }
        >
          {rows.length === bought.length ? "All parts" : "Filtered"}
        </Head>

        {rows.length === 0 ? (
          <Notice>
            Nothing matches. That is a real answer here rather than an error — filtering to{" "}
            <em>no slack</em> on a single account will usually be empty, because only one part in
            the building has none.{" "}
            <Link to="/parts" className="focus-ring text-inbound underline underline-offset-2">
              Clear the filters
            </Link>
            .
          </Notice>
        ) : (
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-[0.8125rem]">
              <thead>
                <tr className="fig border-b border-line-strong text-left text-[0.6875rem] text-ink-subtle">
                  <th scope="col" className="py-1.5 pr-3 font-normal">
                    Part
                  </th>
                  <th scope="col" className="py-1.5 pr-3 font-normal">
                    Account
                  </th>
                  <th scope="col" className="py-1.5 pr-3 text-right font-normal">
                    Unit
                  </th>
                  {productViews.map((v) => (
                    <th key={v.id} scope="col" className="py-1.5 pr-3 text-right font-normal">
                      Per {v.item.name.split(" ")[0]}
                    </th>
                  ))}
                  <th scope="col" className="py-1.5 pr-3 text-right font-normal">
                    Shelf
                  </th>
                  <th scope="col" className="py-1.5 pr-3 text-right font-normal">
                    Queue wants
                  </th>
                  <th scope="col" className="py-1.5 pr-3 text-right font-normal">
                    Spend
                  </th>
                  <th scope="col" className="py-1.5 pr-3 text-right font-normal">
                    Lead
                  </th>
                  <th scope="col" className="py-1.5 text-right font-normal">
                    Slack
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const st = stateOf(p.id);
                  const free = slackOf(p.id);
                  const gap = gapOf(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-line/70 transition-colors duration-[--dur-quick] hover:bg-sunk/60 ${
                        st === "short" ? "bg-short-wash" : ""
                      }`}
                    >
                      <th scope="row" className="max-w-[16rem] py-1.5 pr-3 text-left font-normal">
                        <span className="flex min-w-0 items-baseline gap-1.5">
                          <KindMark kind="bought" />
                          <Link
                            to={`/parts/${p.id}`}
                            className="focus-ring truncate hover:underline underline-offset-2"
                          >
                            {p.name}
                          </Link>
                          {gap ? <StateLabel state="short" /> : null}
                        </span>
                      </th>
                      <td className="py-1.5 pr-3 text-ink-muted">
                        <Link
                          to={`/parts?supplier=${p.supplierId}`}
                          className="focus-ring hover:underline underline-offset-2"
                        >
                          {supplierOf(p.id)?.name}
                        </Link>
                      </td>
                      <td className="fig py-1.5 pr-3 text-right">{priceExact(p.cost ?? 0)}</td>
                      {productViews.map((v) => {
                        const per = qtyIn(ix, v.id, p.id);
                        return (
                          <td
                            key={v.id}
                            className={`fig py-1.5 pr-3 text-right ${per === 0 ? "text-ink-subtle" : ""}`}
                          >
                            {per === 0 ? "—" : fmtQty(per)}
                          </td>
                        );
                      })}
                      <td className="fig py-1.5 pr-3 text-right">
                        {fmtQty(stockToday.get(p.id) ?? 0)}
                      </td>
                      <td className="fig py-1.5 pr-3 text-right text-ink-muted">
                        {fmtQty(demand.get(p.id) ?? 0)}
                      </td>
                      <td className="fig py-1.5 pr-3 text-right text-ink-muted">
                        {money(spend(p.id, p.cost ?? 0))}
                      </td>
                      <td className="fig py-1.5 pr-3 text-right text-ink-muted">{p.leadDays}d</td>
                      <td
                        className={`fig py-1.5 text-right ${free !== null && free <= 0 ? "text-short" : "text-ink-subtle"}`}
                      >
                        {free === null ? "—" : `${free}d`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Band>
    </>
  );
}

function linkTo(params: URLSearchParams, key: string, value: string | null): string {
  const next = new URLSearchParams(params);
  if (value === null) next.delete(key);
  else next.set(key, value);
  const q = next.toString();
  return q ? `/parts?${q}` : "/parts";
}

function FilterGroup({
  label,
  current,
  options,
}: {
  label: string;
  current: string;
  options: { key: string; label: string; to: string }[];
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.8125rem]">
      <span className="text-ink-subtle">{label}:</span>
      {options.map((o) => (
        <FilterLink key={o.key} to={o.to} active={current === o.key}>
          {o.label}
        </FilterLink>
      ))}
    </div>
  );
}

function FilterLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-current={active ? "true" : undefined}
      className={`focus-ring rounded-sm border px-2 py-0.5 transition-colors duration-[--dur-quick] ${
        active
          ? "border-line-strong bg-sheet text-ink"
          : "border-transparent text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
