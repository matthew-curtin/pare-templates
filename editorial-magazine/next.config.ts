import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16.3 writes an AGENTS.md and a CLAUDE.md into the project root
  // every time the dev server starts. Deleting them is not enough —
  // they come back on the next `npm run dev`. This is a starter
  // template, so those files would be checked in, shipped to whoever
  // uses it, and immediately out of date.
  agentRules: false,
};

export default nextConfig;
