# DeFi Tools Guide

Practical DeFi utilities included in the toolkit.

> **New to DeFi?** "DeFi" means Decentralized Finance — financial services run by code on blockchains instead of banks. See the [Glossary](GLOSSARY.md) for full definitions of DeFi terms like dust, slippage, bridge, and TVL.

---

## Dust Sweeper

**Location:** `defi-tools/sweep/`

### What Is "Dust"?

"Dust" refers to tiny token balances left in your wallet — often worth just cents or a few dollars each. Over time, you accumulate tokens from:
- Airdrops you forgot about
- Remainder of trades that didn't sell 100%
- Reward tokens from DeFi protocols
- Test transactions

Individually they're worthless, but combined they could be worth hundreds of dollars.

### What the Dust Sweeper Does

1. **Scans** your wallet across 8 chains for tokens below a threshold (e.g., $5)
2. **Identifies** which tokens have liquidity (can be sold)
3. **Batch swaps** them into a single asset (stablecoin or yield position)
4. **Bridges** assets cross-chain to a single destination via 6 bridge providers
5. **Reports** total recovered value

### Supported Chains

| Chain | Network ID | Status |
|-------|-----------|--------|
| BNB Smart Chain | 56 | ✅ |
| Ethereum | 1 | ✅ |
| Polygon | 137 | ✅ |
| Arbitrum | 42161 | ✅ |
| Base | 8453 | ✅ |
| Optimism | 10 | ✅ |
| Avalanche | 43114 | ✅ |
| Fantom | 250 | ✅ |

### Quick Start

```bash
cd defi-tools/sweep
bun install

# Scan for dust (read-only, safe)
bun run scan --wallet 0xYourAddress --chain bsc

# Sweep dust tokens into USDC
bun run sweep --wallet 0xYourAddress --chain bsc --target USDC
```

### API Server

The sweep tool includes a Hono-based REST API server with x402 micropayments:

```bash
cd defi-tools/sweep
bun run dev
# API available at http://localhost:3000
```

#### Key Endpoints

| Endpoint | Method | Cost (x402) | Description |
|----------|--------|-------------|-------------|
| `/api/wallet/:address/balances` | GET | Free | Get token balances across all chains |
| `/api/wallet/:address/dust` | GET | Free | Identify sweepable dust tokens |
| `/api/price` | GET | Free | Get validated token price |
| `/api/sweep/quote` | POST | $0.05 | Generate sweep quote with route optimization |
| `/api/sweep/execute` | POST | $0.10 | Execute a sweep (queues BullMQ job) |
| `/api/consolidate/execute` | POST | $0.25 | Multi-chain consolidation execution |
| `/api/bridge/quote` | GET | — | Get cross-chain bridge quotes |
| `/api/defi/*` | Various | — | DeFi protocol interactions |

### Cross-Chain Bridge Aggregator

The sweep tool includes a bridge aggregator that finds the optimal route across 6 providers:

| Provider | Protocol | Typical Speed | Chains |
|----------|----------|---------------|--------|
| **Across** | Intent-based | ~2 min | ETH, ARB, OP, BASE, POLY |
| **Stargate** | LayerZero | ~3 min | ETH, ARB, OP, BASE, POLY, BSC, AVAX |
| **Hop** | Bonder network | ~3 min | ETH, ARB, OP, POLY |
| **cBridge** | Celer | ~5 min | ETH, ARB, OP, POLY, BSC |
| **Socket** | Aggregator | ~5 min | Multi-chain |
| **Synapse** | AMM pools | ~5 min | ETH, ARB, OP, BASE, POLY, BSC, AVAX |

The aggregator compares quotes from all providers and selects the best route based on priority (speed, cost, or reliability).

### Queue Workers (BullMQ)

Background job processing for sweep and bridge execution:

| Worker | Purpose |
|--------|---------|
| **Sweep Execute** | Executes token approvals + swaps via viem |
| **Sweep Track** | Monitors transaction confirmations on-chain |
| **Bridge Execute** | Submits cross-chain bridge transactions |
| **Bridge Track** | Polls bridge providers for completion status |
| **Subscription Monitor** | Auto-sweeps for subscription users |

### Payment Facilitator (x402)

The sweep tool uses the x402 payment protocol for monetization:

- **USDC on Base** — All payments settle in USDC on Base chain
- **TransferWithAuthorization** — Gasless payment approvals
- **Dispute resolution** — File disputes, admin review, automated refunds via `processRefund()`
- **External facilitator support** — Optional delegation to hosted x402 facilitator

### Configuration

```json
{
  "threshold": 5.00,
  "targetToken": "USDC",
  "chains": ["bsc", "ethereum", "polygon"],
  "slippage": 1.0,
  "dryRun": true
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `threshold` | `5.00` | Max value ($) to consider as dust |
| `targetToken` | `USDC` | Token to consolidate into |
| `chains` | All | Which chains to sweep |
| `slippage` | `1.0` | Max slippage percentage |
| `dryRun` | `true` | Preview without executing |

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `REDIS_URL` | BullMQ queue backend | Yes (for API/workers) |
| `RPC_BASE` | Base chain RPC for payments | No (defaults to public) |
| `FACILITATOR_PRIVATE_KEY` | Direct settlement key | No (uses external facilitator) |
| `X402_FACILITATOR_URL` | External facilitator URL | No |
| `ALCHEMY_API_KEY` | Token balance scanning | Recommended |

### Safety Features

- **Dry run by default** — Won't execute trades unless you explicitly enable it
- **Whitelist/blacklist** — Never sell specific tokens
- **Slippage protection** — Skips tokens with bad liquidity
- **Gas estimation** — Only sweeps if profit > gas cost
- **Rate limiting** — Redis-based per-IP rate limiting (100 req/min)
- **Price validation** — Multi-source price verification before execution

---

## See Also

- [Glossary](GLOSSARY.md) — Definitions for dust, bridge, slippage, and other DeFi terms
- [Wallets](wallets.md) — Wallet management tools
- [MCP Servers](mcp-servers.md) — Connect DeFi tools to AI
- [Examples](examples.md) — Dust sweeping examples and scripts
- [Getting Started](getting-started.md) — Initial setup
- [Troubleshooting](troubleshooting.md) — When things go wrong
