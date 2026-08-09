import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16.3 rewrites AGENTS.md and CLAUDE.md into the project root every
  // time the dev server starts. Deleting them is not enough; they come back
  // and get committed.
  agentRules: false,
};

export default nextConfig;
