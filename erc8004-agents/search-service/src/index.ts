/**
 * ERC-8004 Agent Search & Discovery Service
 *
 * Indexes on-chain agent registrations across multiple chains and provides
 * full-text search, filtering, ranking, and a real-time WebSocket feed.
 *
 * Usage:
 *   bun run src/index.ts            # Development
 *   node dist/index.js              # Production
 *   PORT=4000 node dist/index.js    # Custom port
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createServer } from "http";

import { AgentDatabase } from "./storage/database.js";
import { Cache } from "./storage/cache.js";
import { SearchEngine } from "./search/engine.js";
import { ChainListener } from "./indexer/listener.js";
import { createRoutes } from "./api/routes.js";
import { AgentFeed } from "./api/websocket.js";
import { getAllChains } from "./utils/chains.js";

const PORT = parseInt(process.env.PORT || "3100");
const DB_PATH = process.env.DB_PATH || "./data/agents.db";
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || "15000");

async function main(): Promise<void> {
  console.log("🚀 Starting ERC-8004 Agent Search Service…");

  // ── Initialise core services ──────────────────────────────────────

  const db = new AgentDatabase(DB_PATH);
  const cache = new Cache();
  const searchEngine = new SearchEngine();
  const feed = new AgentFeed(db);

  // Hydrate search index from existing database records
  const existing = db.searchAgents("", 10_000, 0);
  for (const agent of existing) {
    searchEngine.addAgent(agent);
  }
  console.log(`  📦 Loaded ${existing.length} agents into search index`);

  // ── Build Hono app ────────────────────────────────────────────────

  const app = new Hono();
  app.use("*", cors());
  app.use("*", logger());

  // Mount REST routes
  const routes = createRoutes(db, searchEngine, cache);
  app.route("/", routes);

  // Root endpoint
  app.get("/", (c) =>
    c.json({
      name: "ERC-8004 Agent Search Service",
      version: "1.0.0",
      docs: "https://erc8004.agency",
      endpoints: {
        search: "GET /api/agents?q=&chain=&service=&minReputation=&owner=&limit=&offset=",
        agent: "GET /api/agents/:chainId/:tokenId",
        byOwner: "GET /api/agents/owner/:address",
        reputation: "GET /api/reputation/:chainId/:tokenId",
        stats: "GET /api/stats",
        health: "GET /api/health",
        feed: "WS /api/feed",
      },
    })
  );

  // ── Start HTTP + WebSocket server ─────────────────────────────────

  const server = createServer(serve({ fetch: app.fetch, port: PORT }).server);
  feed.attach(server);

  console.log(`  🌐 HTTP  → http://localhost:${PORT}`);
  console.log(`  🔌 WS    → ws://localhost:${PORT}/api/feed`);

  // ── Start chain listeners ─────────────────────────────────────────

  const chains = getAllChains();
  const listeners: ChainListener[] = [];

  for (const chain of chains) {
    const listener = new ChainListener(chain, db, (agent) => {
      searchEngine.addAgent(agent);
      cache.clear();
      feed.notifyRegistration(
        agent.chainId,
        agent.tokenId,
        agent.owner,
        agent.name
      );
    });

    listeners.push(listener);

    try {
      await listener.start();
      console.log(`  ⛓  Listener started for ${chain.name} (${chain.chainId})`);
    } catch (err) {
      console.error(`  ⚠  Failed to start listener for ${chain.name}:`, err);
    }
  }

  console.log(`\n✅ Search service ready — ${chains.length} chain(s) indexed\n`);

  // ── Graceful shutdown ─────────────────────────────────────────────

  const shutdown = async (): Promise<void> => {
    console.log("\n🛑 Shutting down…");
    for (const l of listeners) l.stop();
    feed.close();
    db.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
