import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16.3+ rewrites AGENTS.md and CLAUDE.md into the project root
  // on every dev-server start. Deleting them is not enough; this is.
  agentRules: false,
};

export default nextConfig;
