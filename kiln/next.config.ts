import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16.3 rewrites AGENTS.md and CLAUDE.md into the project root on
  // every dev-server start, so deleting them is not enough — they come
  // back and get committed. CONVENTIONS §1.
  agentRules: false,
};

export default nextConfig;
