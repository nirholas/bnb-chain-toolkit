# Demo Guide

> How to see BNB Chain AI Toolkit in action.

---

## Live Demo

**[bnb-chain-toolkit.vercel.app](https://bnb-chain-toolkit.vercel.app/)**

The live demo showcases the agent explorer, MCP server documentation, and interactive components — no setup required.

---

## Video Demo

_[Insert link to demo video — record with Loom, YouTube, or similar]_

**Suggested demo flow (3–5 minutes):**

1. **Intro** (30s) — What is BNB Chain AI Toolkit and why it exists
2. **Live site walkthrough** (60s) — Show the agent explorer, browse agents, search/filter
3. **MCP server demo** (90s) — Show an MCP server connecting to Claude Desktop and executing a blockchain query
4. **Agent in action** (60s) — Show a specialized agent (e.g., PancakeSwap Trader) answering DeFi questions
5. **Code walkthrough** (30s) — Quick peek at agent JSON structure and how easy it is to add new agents
6. **Closing** (30s) — Key stats (78 agents, 6 MCP servers, 1,100+ tools) and future vision

---

## Recording Tips

- Use **1920x1080** resolution
- Show your terminal + browser side by side
- Keep it under **5 minutes**
- Add captions if possible
- Host on YouTube (unlisted) or Loom

---

## Running the Demo Locally

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+) or Node.js 20+
- Git

### Quick Start

```bash
# Clone
git clone https://github.com/nirholas/bnb-chain-toolkit.git
cd bnb-chain-toolkit

# Install dependencies
bun install

# Start the frontend
bun run dev
# → Opens at http://localhost:5173
```

### MCP Server Demo (Claude Desktop)

```bash
# Start the BNB Chain MCP server
cd mcp-servers/bnbchain-mcp
bun install
bun start
```

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "bnbchain": {
      "command": "npx",
      "args": ["-y", "@nirholas/bnbchain-mcp"],
      "env": {
        "BSC_RPC_URL": "https://bsc-dataseed.binance.org"
      }
    }
  }
}
```

Then ask Claude: *"What's the current BNB price?"* or *"Show me the top PancakeSwap pools."*

---

## Demo Scenarios

### Scenario 1: Agent Explorer
1. Visit the live demo site
2. Browse the 78 agents organized by category
3. Click an agent to see its full definition, capabilities, and tools
4. Filter by protocol (PancakeSwap, Venus, etc.)

### Scenario 2: MCP Server + Claude
1. Configure Claude Desktop with the BNB Chain MCP server
2. Ask: *"What is the current gas price on BSC?"*
3. Ask: *"Get the top 10 tokens by market cap on BNB Chain"*
4. Ask: *"Show me PancakeSwap v3 liquidity pools"*

### Scenario 3: Market Data
```typescript
import { CoinGecko } from './market-data/crypto-market-data';

const btcPrice = await CoinGecko.getPrice('bitcoin');
console.log(`BTC: $${btcPrice.usd}`);
```

### Scenario 4: Dust Sweeper
```bash
cd defi-tools/sweep
bun install
bun run scan --wallet 0xYourAddress --chain bsc
```

---

## Screenshots

_Add screenshots to a `screenshots/` directory and reference them here:_

```
screenshots/
├── agent-explorer.png
├── mcp-claude-demo.png
├── dust-sweeper.png
├── market-data.png
└── architecture-diagram.png
```

<!-- 
![Agent Explorer](screenshots/agent-explorer.png)
![MCP + Claude](screenshots/mcp-claude-demo.png)
-->
