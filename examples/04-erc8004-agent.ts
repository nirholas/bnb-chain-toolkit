/**
 * Example 04 — ERC-8004 Agent (Quick Start)
 *
 * Starts a minimal ERC-8004 agent in dev mode. Demonstrates the
 * agent-runtime package with A2A protocol and discovery.
 *
 * Usage:
 *   cd agent-runtime && bun install
 *   bun run examples/04-erc8004-agent.ts
 *
 * Or with on-chain registration:
 *   PRIVATE_KEY=0x... bun run examples/04-erc8004-agent.ts
 */

console.log("╔══════════════════════════════════════════════════╗");
console.log("║   BNB Chain AI Toolkit — ERC-8004 Agent Demo    ║");
console.log("╚══════════════════════════════════════════════════╝\n");

// ── Check if agent-runtime is available ─────────────────────────

const runtimeAvailable = await checkRuntime();

if (!runtimeAvailable) {
  console.log("ℹ️  The agent-runtime package needs to be built first.\n");
  console.log("  To run this example:\n");
  console.log("    cd agent-runtime");
  console.log("    bun install");
  console.log("    bun run build");
  console.log("    cd ..");
  console.log("    bun run examples/04-erc8004-agent.ts\n");
  console.log("  Or run the pre-built examples directly:\n");
  console.log("    cd agent-runtime");
  console.log("    bun run start:simple    # Minimal agent");
  console.log("    bun run start:defi      # DeFi trading agent");
  console.log("    bun run start:paid      # Paid agent with x402\n");

  // Still show what the agent would do
  showAgentPreview();
  process.exit(0);
}

// ── Start agent ─────────────────────────────────────────────────

try {
  const { ERC8004Agent } = await import("../agent-runtime/src/index.js");

  const agent = new ERC8004Agent({
    name: "BNB Toolkit Demo Agent",
    description:
      "A demo agent showcasing ERC-8004 identity, A2A messaging, and BSC integration",
    privateKey: process.env.PRIVATE_KEY ?? "",
    chain: "bsc-testnet",
    capabilities: ["info", "greeting", "toolkit-stats"],
    trust: ["reputation"],
  });

  agent.onTask("greeting", async (task: any) => {
    const text = task.message?.parts?.[0]?.text ?? "World";
    return {
      status: "completed",
      result: {
        greeting: `Hello, ${text}! I'm an ERC-8004 agent powered by the BNB Chain AI Toolkit.`,
        toolkit: {
          agents: "78",
          mcpServers: 6,
          tools: "1,100+",
          chains: "60+",
        },
      },
    };
  });

  agent.onTask("toolkit-stats", async () => ({
    status: "completed",
    result: {
      name: "BNB Chain AI Toolkit",
      agents: 78,
      mcpServers: 6,
      tools: 900,
      supportedChains: 60,
      languages: 30,
      standard: "ERC-8004",
      deployedOn: 22,
      protocols: ["A2A", "MCP", "x402", "ERC-8004"],
    },
  }));

  agent.onDefault(async () => ({
    status: "completed",
    result: { message: "I received your message! Try 'greeting' or 'toolkit-stats' skills." },
  }));

  const port = parseInt(process.env.PORT ?? "3001");
  await agent.start({
    port,
    skipRegistration: !process.env.PRIVATE_KEY,
    devMode: !process.env.PRIVATE_KEY,
  });

  console.log(`\n🧪 Try these commands:\n`);
  console.log(`  # Agent discovery (A2A protocol)`);
  console.log(`  curl http://localhost:${port}/.well-known/agent.json | jq\n`);
  console.log(`  # Health check`);
  console.log(`  curl http://localhost:${port}/health | jq\n`);
  console.log(`  # Send a task`);
  console.log(`  curl -X POST http://localhost:${port}/a2a \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d '{"jsonrpc":"2.0","id":"1","method":"tasks/send","params":{"id":"demo","message":{"role":"user","parts":[{"type":"text","text":"Hello BNB!"}]},"metadata":{"skill":"greeting"}}}' | jq\n`);
} catch (error) {
  console.error("Failed to start agent:", (error as Error).message);
  console.log("\nFalling back to preview mode...\n");
  showAgentPreview();
}

// ── Helpers ─────────────────────────────────────────────────────

async function checkRuntime(): Promise<boolean> {
  try {
    await import("../agent-runtime/src/index.js");
    return true;
  } catch {
    return false;
  }
}

function showAgentPreview() {
  console.log("─".repeat(55));
  console.log("  ERC-8004 Agent Architecture Preview");
  console.log("─".repeat(55));
  console.log(`
  ┌─────────────────────────────────────────────────────────┐
  │                   ERC-8004 Agent                        │
  │                                                         │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
  │  │   Identity    │  │  Reputation  │  │  Validation  │  │
  │  │   Manager     │  │   Manager    │  │   Manager    │  │
  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
  │         │                 │                  │          │
  │  ┌──────┴─────────────────┴──────────────────┴───────┐  │
  │  │              On-chain Registries (BSC)             │  │
  │  │  IdentityRegistry · ReputationRegistry · Validat… │  │
  │  └───────────────────────────────────────────────────┘  │
  │                                                         │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
  │  │  A2A Server   │  │ x402 Payment │  │  Discovery   │  │
  │  │  (Hono)       │  │  Middleware   │  │  Service     │  │
  │  └──────────────┘  └──────────────┘  └──────────────┘  │
  └─────────────────────────────────────────────────────────┘
`);

  console.log("  Agent Card (/.well-known/agent.json):");
  const card = {
    name: "BNB Toolkit Demo Agent",
    description: "A demo agent showcasing ERC-8004, A2A, and BSC integration",
    url: "http://localhost:3001",
    version: "1.0.0",
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: true,
    },
    skills: [
      { id: "greeting", name: "Greeting" },
      { id: "toolkit-stats", name: "Toolkit Stats" },
    ],
    defaultInputModes: ["text"],
    defaultOutputModes: ["text"],
  };
  console.log(
    JSON.stringify(card, null, 2)
      .split("\n")
      .map((l) => "    " + l)
      .join("\n")
  );
  console.log();
}
