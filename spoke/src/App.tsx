import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Shell } from "@/components/shell";
import BoardPage from "@/pages/board";
import TreePage from "@/pages/tree";
import PartsPage from "@/pages/parts";
import PartPage from "@/pages/part";
import OrdersPage from "@/pages/orders";
import BuildsPage from "@/pages/builds";
import MethodPage from "@/pages/method";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Shell>
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/tree/:productId" element={<TreePage />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/parts/:partId" element={<PartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/builds" element={<BuildsPage />} />
          <Route path="/method" element={<MethodPage />} />
          <Route path="*" element={<BoardPage />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

/**
 * A client-side route change leaves the scroll position where it was,
 * which on a site of very long tables means arriving at a new page
 * halfway down it. Keyed on pathname only — the parts list uses the
 * query string for its filters, and re-scrolling to the top every time
 * somebody changes a sort would throw away their place in the table
 * they are reading.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
