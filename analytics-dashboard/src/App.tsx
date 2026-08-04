import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { AudiencePage } from "@/pages/audience";
import { EventDetailPage } from "@/pages/event-detail";
import { EventsPage } from "@/pages/events";
import { FunnelsPage } from "@/pages/funnels";
import { OverviewPage } from "@/pages/overview";
import { SettingsPage } from "@/pages/settings";

/**
 * Real routes with real URLs, so the back button and a refresh both
 * behave — the date range rides in the query string for the same
 * reason (see lib/use-range.ts).
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/audience" element={<AudiencePage />} />
          <Route path="/funnels" element={<FunnelsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
