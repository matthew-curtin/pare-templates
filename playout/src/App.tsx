import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Shell } from "@/components/shell";
import { DayPage } from "@/pages/day";
import { LibraryPage } from "@/pages/library";
import { OnAirPage } from "@/pages/on-air";
import { RulesPage } from "@/pages/rules";
import { ShowsPage } from "@/pages/shows";
import { SpotsPage } from "@/pages/spots";
import { TrackPage } from "@/pages/track";

/**
 * Seven routes under one shell.
 *
 * There is deliberately no scroll-to-top on navigation: the scroller is
 * the middle region rather than the page, and it remounts per route
 * anyway. The console below it never moves, which is the whole point of
 * docking it there.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<OnAirPage />} />
          <Route path="/day" element={<DayPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:id" element={<TrackPage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/spots" element={<SpotsPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <h1 className="text-[var(--text-title)] leading-tight">Dead air</h1>
      <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        Nothing is scheduled at that address. The one thing a station never wants
        is silence where something should be, so here is a link out of it.
      </p>
      <Link
        to="/"
        className="focus-ring mt-4 inline-block text-[0.9375rem] text-signal underline underline-offset-2"
      >
        Back to what is on air
      </Link>
    </div>
  );
}
