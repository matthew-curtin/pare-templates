import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16.3 writes an AGENTS.md and a CLAUDE.md into the project root
  // every time the dev server starts. Deleting them is not enough —
  // they come back on the next `npm run dev`, and in a starter template
  // they would be committed, shipped, and immediately out of date.
  agentRules: false,
};

export default nextConfig;
