import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Lets components import from "@/content/…" rather than counting
    // "../../" segments. Mirrored in tsconfig.app.json's `paths`, which
    // is what the editor and `tsc` read — both have to agree.
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});
