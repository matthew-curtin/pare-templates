import type { Customer, Message } from "@/content/types";
import { memberById } from "@/lib/derive";
import { messageStamp } from "@/lib/format";
import { Avatar } from "./avatar";
import { NavIcon } from "./nav-icon";

/**
 * One message in a thread.
 *
 * The three kinds have to be told apart at a glance and without reading
 * the label, because the cost of mistaking one for another is real:
 * answering a colleague's note as though the customer wrote it, or
 * worse, writing something meant for the team into a reply.
 *
 * They are separated by surface rather than by hue. A note is sunk into
 * the page with a dashed edge and says so in words; it deliberately
 * borrows none of the four status colours, which mean something else
 * entirely.
 */
export function MessageBubble({
  message,
  customer,
}: {
  message: Message;
  customer: Customer | undefined;
}) {
  const member = memberById(message.authorId);

  if (message.kind === "note") {
    return (
      <li className="flex gap-3">
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-ink-subtle">
          <NavIcon name="note" className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 rounded-lg border border-dashed border-line-strong bg-sunk px-3.5 py-2.5">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[13px] font-medium text-ink">
              {member ? member.name : "Someone"}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
              Internal note · not sent to the customer
            </span>
            <span className="tabular ml-auto font-mono text-[11px] text-ink-subtle">
              {messageStamp(message.at)}
            </span>
          </div>
          <Body paragraphs={message.body} />
        </div>
      </li>
    );
  }

  const outbound = message.kind === "reply";
  return (
    <li className="flex gap-3">
      <span className="mt-1">
        {outbound ? (
          <Avatar
            initials={member ? member.initials : "??"}
            name={member ? member.name : "Someone"}
            size="md"
          />
        ) : (
          <Avatar
            initials={customer ? customer.initials : "??"}
            name={customer ? customer.name : "Customer"}
            size="md"
            tone="customer"
          />
        )}
      </span>
      <div
        className={`min-w-0 flex-1 rounded-lg border px-3.5 py-2.5 ${
          outbound
            ? "border-accent-ring bg-accent-soft"
            : "border-line bg-surface"
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[13px] font-medium text-ink">
            {outbound
              ? member
                ? member.name
                : "Someone"
              : customer
                ? customer.name
                : "Customer"}
          </span>
          <span className="text-[11px] text-ink-subtle">
            {outbound ? "replied" : "wrote"}
          </span>
          <span className="tabular ml-auto font-mono text-[11px] text-ink-subtle">
            {messageStamp(message.at)}
          </span>
        </div>
        <Body paragraphs={message.body} />
      </div>
    </li>
  );
}

function Body({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="prose-wrap mt-1.5 space-y-2 text-[13px] leading-relaxed text-ink">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
