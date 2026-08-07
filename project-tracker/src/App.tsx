import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { BacklogPage } from "@/pages/backlog";
import { BoardPage } from "@/pages/board";
import { IssueDetailPage } from "@/pages/issue-detail";
import { RoadmapPage } from "@/pages/roadmap";
import { SettingsPage } from "@/pages/settings";
import { TeamPage } from "@/pages/team";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<BoardPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/issue/:id" element={<IssueDetailPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

/**
 * A new page starts at the top.
 *
 * Keyed on `pathname` only, so changing a filter — which writes to the
 * query string — does not yank a half-read table back to the top.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
        Back to the board
      </Link>
    </div>
  );
}
