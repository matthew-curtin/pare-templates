import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { ContactDetailPage } from "@/pages/contact-detail";
import { ContactsPage } from "@/pages/contacts";
import { ConversationPage } from "@/pages/conversation";
import { InboxEmptyPage } from "@/pages/inbox-empty";
import { InboxLayout } from "@/pages/inbox-layout";
import { MacrosPage } from "@/pages/macros";
import { SettingsPage } from "@/pages/settings";

/**
 * The inbox is a layout route rather than one page, so the list stays
 * mounted while you move between conversations. That is not only for
 * speed: an unmounting list loses its scroll position, so working down
 * a long queue would send you back to the top after every reply.
 *
 * There is deliberately no scroll-to-top on navigation, which the other
 * templates in this fleet do have. Here the panes scroll inside the
 * layout rather than the page scrolling, and each pane's position is
 * exactly what should be preserved.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<InboxLayout />}>
            <Route path="/" element={<InboxEmptyPage />} />
            <Route path="/c/:id" element={<ConversationPage />} />
          </Route>
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
          <Route path="/macros" element={<MacrosPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Nothing here</h1>
      <p className="mt-1 text-[13px] text-ink-muted">
        That address does not match a page in this workspace.
      </p>
      <Link
        to="/"
        className="focus-ring mt-4 inline-block rounded-sm text-[13px] text-accent hover:text-accent-hover"
      >
        Back to the inbox
      </Link>
    </div>
  );
}
