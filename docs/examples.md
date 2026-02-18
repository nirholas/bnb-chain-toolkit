# Examples

Real-world usage patterns for the BNB Chain AI Toolkit.

---

## Beginner Examples

### Check Your BNB Balance

**What you need:** BNB Chain MCP server

Ask Claude: *"What's the BNB balance of 0x1234...?"*

Behind the scenes:
```
You → Claude → BNB Chain MCP → BSC RPC → Balance: 1.5 BNB
```

### Get Today's Crypto Prices

**What you need:** Market Data component

```typescript
import { CoinGecko } from '@nirholas/crypto-market-data';

const prices = await CoinGecko.getPrices(['bitcoin', 'binancecoin', 'ethereum']);
console.log(prices);
// { bitcoin: 95000, binancecoin: 620, ethereum: 3200 }
```

### Read the Latest Crypto News

**What you need:** Crypto News API

```bash
# Start the news server
cd market-data/crypto-news && bun start

# Fetch headlines
curl http://localhost:3000/api/news/latest | jq '.[0:5] | .[].title'
```

---

## Intermediate Examples

### Set Up a Portfolio Tracking Agent

**What you need:** Agents + Market Data components

1. Load the portfolio agent:
```bash
cat agents/defi-agents/src/portfolio-analyst.json | jq '.systemRole'
```

2. Use it as Claude's system prompt in a Project

3. Ask questions like:
   - "My portfolio: 10 BNB, 5000 USDT, 2 ETH. How am I doing?"
   - "What's the total value and 24h change?"
   - "Should I rebalance?"

### Swap Tokens on PancakeSwap via AI

**What you need:** BNB Chain MCP + PancakeSwap Trader agent

1. Start the MCP server
2. Load the PancakeSwap agent
3. Ask: *"Swap 0.1 BNB for CAKE on PancakeSwap"*

The AI will:
- Get the current price quote
- Check slippage
- Ask for your confirmation
- Execute the swap

### Monitor BNB Chain DeFi TVL

```typescript
import { DeFiLlama } from '@nirholas/crypto-market-data';

// Get TVL for major BNB Chain protocols
const protocols = ['pancakeswap', 'venus', 'alpaca-finance', 'biswap'];
for (const p of protocols) {
  const tvl = await DeFiLlama.getProtocolTvl(p);
  console.log(`${p}: $${(tvl / 1e9).toFixed(2)}B`);
}
```

---

## Advanced Examples

### Multi-Server AI Trading Setup

Run all servers together for a complete AI trading terminal:

```json
{
  "mcpServers": {
    "bnbchain": {
      "command": "npx",
      "args": ["-y", "@nirholas/bnbchain-mcp"],
      "env": {
        "BSC_RPC_URL": "https://bsc-dataseed.binance.org",
        "PRIVATE_KEY": "${BSC_PRIVATE_KEY}"
      }
    },
    "binance": {
      "command": "npx",
      "args": ["-y", "@nirholas/binance-mcp"],
      "env": {
        "BINANCE_API_KEY": "${BINANCE_KEY}",
        "BINANCE_SECRET_KEY": "${BINANCE_SECRET}"
      }
    },
    "market": {
      "command": "node",
      "args": ["market-data/crypto-market-data/dist/mcp-server.js"]
    },
    "news": {
      "command": "node",
      "args": ["market-data/crypto-news/dist/mcp-server.js"]
    }
  }
}
```

Now ask Claude:
- *"What's the sentiment around BNB today? Check the news and fear & greed index."*
- *"Show me the best yield opportunities on BSC right now."*
- *"If BNB drops below $600, set up a buy order on Binance for 10 BNB."*

### Convert Any Contract to an AI Tool

Using UCAI to make any BSC contract AI-accessible:

```bash
# 1. Get the contract ABI (from BSCScan or your deployment)
curl "https://api.bscscan.com/api?module=contract&action=getabi&address=0xContractAddress" \
  | jq -r '.result' > MyContract.json

# 2. Generate MCP server
cd mcp-servers/ucai
ucai generate --abi ./MyContract.json --chain bsc --output ./my-contract-mcp

# 3. Start it
cd my-contract-mcp && python server.py

# 4. Add to Claude Desktop config
```

### Automated Dust Sweeping Pipeline

```bash
#!/bin/bash
# sweep-all-chains.sh — Run weekly via cron

CHAINS=("bsc" "ethereum" "polygon" "arbitrum" "base")
WALLET="0xYourAddress"

for chain in "${CHAINS[@]}"; do
  echo "Sweeping $chain..."
  cd defi-tools/sweep
  bun run sweep --wallet "$WALLET" --chain "$chain" --target USDC --threshold 5
done

echo "Done! All dust swept to USDC."
```

### Register an Agent On-Chain (ERC-8004)

```typescript
import { ethers } from 'ethers';
import { IdentityRegistry__factory } from '@erc-8004/contracts';

const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const registry = IdentityRegistry__factory.connect(REGISTRY_ADDRESS, wallet);

// Register your agent
const tx = await registry.registerAgent(
  'My Trading Agent',
  'Automated BNB/USDT grid trading bot',
  'https://my-agent.example.com/mcp',
  ethers.toUtf8Bytes(JSON.stringify({ version: '1.0', capabilities: ['trade', 'analyze'] }))
);
await tx.wait();
console.log('Agent registered on-chain!');
```

---

## Integration Patterns

### Pattern 1: Read-Only Intelligence

```
News API → AI Agent → Human-readable insights
```

No blockchain writes. Safe for exploration and learning.

### Pattern 2: Monitored Trading

```
Market Data → AI Agent → Trade Recommendation → Human Approval → Exchange API
```

AI suggests, human approves. Good for learning and trust-building.

### Pattern 3: Autonomous Agent

```
Market Data + Chain Data → AI Agent → Automated Execution → Exchange/Chain
```

Fully automated. Only for experienced users with proper risk management.

---

## See Also

- [Getting Started](getting-started.md) — Initial setup
- [Agents](agents.md) — All available agents
- [MCP Servers](mcp-servers.md) — Server setup details
- [Troubleshooting](troubleshooting.md) — When things go wrong
