/**
 * Example 03 — MCP Client Demo
 *
 * Demonstrates how MCP tools work by simulating calls to the
 * BNB Chain MCP server's tool interface. Shows the same JSON-RPC
 * patterns that Claude, Cursor, and other AI clients use.
 *
 * Usage:
 *   bun run examples/03-mcp-client-demo.ts
 *   npx tsx examples/03-mcp-client-demo.ts
 */

// ── Simulated MCP tool definitions ──────────────────────────────

interface ToolCall {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  mockResult: unknown;
}

const mcpTools: ToolCall[] = [
  {
    name: "chain_getBalance",
    description: "Get native token balance for an address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Wallet address" },
        chain: { type: "string", enum: ["bsc", "opbnb", "bsc-testnet"] },
      },
      required: ["address"],
    },
    mockResult: {
      address: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
      chain: "bsc",
      balance: "2,847,392.15 BNB",
      balanceWei: "2847392150000000000000000",
      usdValue: "$1,706,835,290",
      note: "Binance Hot Wallet — one of the largest BNB holders",
    },
  },
  {
    name: "chain_getGasPrice",
    description: "Get current gas price on BSC",
    inputSchema: {
      type: "object",
      properties: {
        chain: { type: "string", default: "bsc" },
      },
    },
    mockResult: {
      chain: "bsc",
      gasPrice: "1.0 Gwei",
      gasPriceWei: "1000000000",
      baseFee: "0.0 Gwei",
      estimatedCosts: {
        transfer: "0.000021 BNB (~$0.013)",
        erc20Transfer: "0.000065 BNB (~$0.041)",
        swap: "0.00015 BNB (~$0.094)",
        contractDeploy: "0.001-0.01 BNB ($0.63-$6.30)",
      },
    },
  },
  {
    name: "defi_getProtocol",
    description: "Get DeFi protocol TVL and metrics from DefiLlama",
    inputSchema: {
      type: "object",
      properties: {
        protocol: { type: "string", description: "Protocol slug" },
      },
      required: ["protocol"],
    },
    mockResult: {
      name: "PancakeSwap",
      slug: "pancakeswap",
      chain: "BSC",
      tvl: "$1,850,000,000",
      category: "DEX",
      change24h: "+2.1%",
      chains: ["BSC", "Ethereum", "Arbitrum", "Base", "zkSync", "Aptos"],
      token: "CAKE",
      url: "https://pancakeswap.finance",
    },
  },
  {
    name: "token_getInfo",
    description: "Get BEP-20 token information on BSC",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Token contract address" },
      },
      required: ["address"],
    },
    mockResult: {
      address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      name: "PancakeSwap Token",
      symbol: "CAKE",
      decimals: 18,
      totalSupply: "389,246,112",
      chain: "bsc",
      verified: true,
      proxy: false,
    },
  },
  {
    name: "nft_getCollection",
    description: "Get NFT collection data on BSC",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Collection contract address" },
      },
      required: ["address"],
    },
    mockResult: {
      address: "0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07",
      name: "Pancake Squad",
      symbol: "PS",
      totalSupply: 10000,
      chain: "bsc",
      owners: 5847,
      floorPrice: "2.5 BNB",
    },
  },
];

// ── Simulate MCP calls ──────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════╗");
console.log("║   BNB Chain AI Toolkit — MCP Client Demo        ║");
console.log("╚══════════════════════════════════════════════════╝\n");

console.log("This demo simulates how AI clients (Claude, Cursor, etc.)");
console.log("call MCP server tools via JSON-RPC 2.0.\n");

// Show available tools
console.log("📦 Available MCP Tools (from bnbchain-mcp):\n");
console.log("  Tool Name                Description");
console.log("  ──────────────────────── ─────────────────────────────────────");
for (const tool of mcpTools) {
  console.log(`  ${tool.name.padEnd(25)} ${tool.description}`);
}
console.log(`\n  ... and 200+ more tools across 6 MCP servers\n`);

// Simulate each call
console.log("═".repeat(55));
console.log("  Simulating MCP Tool Calls");
console.log("═".repeat(55));

for (const tool of mcpTools) {
  console.log(`\n\n🔧 Tool: ${tool.name}`);
  console.log("─".repeat(50));

  // Show the JSON-RPC request
  const request = {
    jsonrpc: "2.0",
    id: Math.floor(Math.random() * 1000),
    method: "tools/call",
    params: {
      name: tool.name,
      arguments: getExampleArgs(tool),
    },
  };

  console.log("\n  📤 Request (JSON-RPC 2.0):");
  console.log(indent(JSON.stringify(request, null, 2), 4));

  // Show the response
  const response = {
    jsonrpc: "2.0",
    id: request.id,
    result: {
      content: [
        {
          type: "text",
          text: JSON.stringify(tool.mockResult, null, 2),
        },
      ],
    },
  };

  console.log("\n  📥 Response:");
  console.log(indent(JSON.stringify(tool.mockResult, null, 2), 4));
}

// ── Architecture diagram ────────────────────────────────────────

console.log("\n\n═".repeat(55));
console.log("  How It Works");
console.log("═".repeat(55));
console.log(`
  ┌──────────────┐    JSON-RPC     ┌──────────────────┐
  │   AI Client   │ ──────────────→ │  BNB Chain MCP   │
  │ (Claude, etc) │ ←────────────── │     Server       │
  └──────────────┘                  └────────┬─────────┘
                                             │
                        ┌────────────────────┼────────────────────┐
                        ↓                    ↓                    ↓
                 ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
                 │   BSC RPC    │   │  DefiLlama   │   │  BscScan     │
                 │  (on-chain)  │   │   (DeFi)     │   │  (explorer)  │
                 └──────────────┘   └──────────────┘   └──────────────┘
`);

console.log("💡 To run the real MCP server:");
console.log("   cd mcp-servers/bnbchain-mcp && npm install && npm run build\n");
console.log("✅ Demo complete!\n");

// ── Helpers ─────────────────────────────────────────────────────

function getExampleArgs(tool: ToolCall): Record<string, string> {
  const args: Record<string, string> = {};
  const props = (tool.inputSchema.properties ?? {}) as Record<
    string,
    { type: string; default?: string }
  >;
  if ("address" in props) {
    if (tool.name.includes("token"))
      {args.address = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";}
    else if (tool.name.includes("nft"))
      {args.address = "0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07";}
    else args.address = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
  }
  if ("chain" in props) args.chain = "bsc";
  if ("protocol" in props) args.protocol = "pancakeswap";
  return args;
}

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => pad + line)
    .join("\n");
}
