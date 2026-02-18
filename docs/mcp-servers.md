# MCP Servers Guide

How to set up and use the 6 Model Context Protocol servers in this toolkit.

---

## What Is MCP?

**Model Context Protocol (MCP)** is an open standard that lets AI assistants connect to external tools and data sources. Think of it like USB for AI — a universal way to plug in new capabilities.

When you connect an MCP server to Claude, ChatGPT, or another AI:
- The AI can **read** blockchain data (balances, prices, transactions)
- The AI can **write** to blockchains (send tokens, swap, deploy contracts)
- The AI can **query** exchanges (order books, trading history, portfolio)

---

## Quick Setup

All MCP servers follow the same pattern:

```bash
# 1. Navigate to the server
cd mcp-servers/<server-name>

# 2. Install dependencies
bun install    # or npm install

# 3. Start the server
bun start      # or npm start
```

Then add it to your AI assistant's config.

---

## The 6 Servers

### 1. BNB Chain MCP

**Location:** `mcp-servers/bnbchain-mcp/`
**Tools:** 466+
**Best for:** BNB Smart Chain (BSC), opBNB, BNB Greenfield, Sperax Protocol, and 10+ EVM chains

#### What It Can Do

| Category | Examples |
|----------|---------|
| **Token Operations** | Transfer BNB/BEP-20, check balances, approve tokens |
| **DEX Trading** | Swap on PancakeSwap, add/remove liquidity |
| **Smart Contracts** | Deploy, read, write, verify contracts |
| **Chain Data** | Block info, transaction history, gas prices |
| **BNB Greenfield** | Upload/download files, manage buckets |
| **Staking** | Delegate BNB, check rewards, validator info |
| **Market Data** | CoinGecko prices, OHLCV, trending tokens |
| **DeFi Analytics** | DefiLlama TVL, yields, fees, protocols |
| **Social Sentiment** | LunarCrush metrics, influencers, trending |
| **DEX Analytics** | GeckoTerminal pools, trades, OHLCV |
| **Sperax Protocol** | USDs, SPA, veSPA, Demeter vaults (72 tools) |

#### Setup

```bash
cd mcp-servers/bnbchain-mcp
npm install
npm run build
```

**Claude Desktop config:**
```json
{
  "mcpServers": {
    "bnbchain": {
      "command": "npx",
      "args": ["-y", "@nirholas/bnbchain-mcp"],
      "env": {
        "PRIVATE_KEY": "your-private-key-here"
      }
    }
  }
}
```

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRIVATE_KEY` | For writes | Wallet private key (for transactions) |
| `COINGECKO_API_KEY` | No | CoinGecko Pro API key |
| `LUNARCRUSH_API_KEY` | No | LunarCrush social sentiment API key |
| `CRYPTOCOMPARE_API_KEY` | No | CryptoCompare social data API key |
| `COINSTATS_API_KEY` | No | CoinStats API key |
| `UNIVERSAL_CRYPTO_API_KEY` | No | Tatum / Universal Crypto API key |
| `ARBITRUM_RPC_URL` | No | Arbitrum RPC for Sperax module |
| `PORT` | No | HTTP/SSE server port (default: 3001) |
| `LOG_LEVEL` | No | Logging level (DEBUG, INFO, WARN, ERROR) |

> **Security Note:** Never commit private keys. Use environment variables or a secrets manager.

---

### 2. Binance Exchange MCP

**Location:** `mcp-servers/binance-mcp/`
**Tools:** 478+
**Best for:** Trading on Binance.com, portfolio management, market data

#### What It Can Do

| Category | Examples |
|----------|---------|
| **Spot Trading** | Place orders, cancel orders, order history |
| **Futures Trading** | Open/close positions, set leverage, funding rates |
| **Margin Trading** | Borrow, repay, margin transfers |
| **Portfolio** | Balances, P&L, asset allocation |
| **Market Data** | Order books, candlesticks, ticker data |
| **Staking & Earn** | Stake, savings, Launchpool |
| **NFTs** | Browse, buy, list NFTs |
| **Sub-Accounts** | Create, manage, transfer between |

#### Setup

```bash
cd mcp-servers/binance-mcp
bun install
```

**Claude Desktop config:**
```json
{
  "mcpServers": {
    "binance": {
      "command": "npx",
      "args": ["-y", "@nirholas/binance-mcp"],
      "env": {
        "BINANCE_API_KEY": "your-api-key",
        "BINANCE_SECRET_KEY": "your-secret-key"
      }
    }
  }
}
```

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BINANCE_API_KEY` | Yes | Binance API key |
| `BINANCE_SECRET_KEY` | Yes | Binance API secret |

---

### 3. Binance US MCP

**Location:** `mcp-servers/binance-us-mcp/`
**Best for:** US-based users who need regulatory compliance

Same as Binance MCP but connects to Binance.US servers with US-compliant endpoints. Supports spot trading, staking, and wallet management.

#### Setup

```bash
cd mcp-servers/binance-us-mcp
bun install
```

---

### 4. Universal Crypto MCP

**Location:** `mcp-servers/universal-crypto-mcp/`
**Tools:** 100+
**Networks:** 60+
**Best for:** Multi-chain DeFi, cross-chain operations

#### What It Can Do

| Category | Examples |
|----------|---------|
| **Multi-Chain DEX** | Swap on any chain via aggregators |
| **Cross-Chain Bridging** | Bridge tokens between 60+ networks |
| **DeFi Protocols** | Interact with lending, yield, derivatives |
| **Automated Trading** | Set up strategies across chains |
| **Portfolio Tracking** | Unified view across all chains |

#### Supported Networks (Partial List)

BSC, opBNB, Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, Fantom, Gnosis, zkSync, Scroll, Linea, Mantle, Celo, Moonbeam, Harmony, Cronos, Aurora, NEAR, Solana, and 40+ more.

---

### 5. Agenti

**Location:** `mcp-servers/agenti/`
**Best for:** Simple EVM + Solana access with AI-to-AI payment support

#### What It Can Do

- All EVM chains: BSC, Ethereum, Polygon, Arbitrum, Base, Optimism
- Solana network support
- x402 payment protocol for AI-to-AI transactions
- Smart contract deployment and interaction

---

### 6. UCAI (ABI-to-MCP Generator)

**Location:** `mcp-servers/ucai/`
**Best for:** Converting any smart contract into an MCP server

#### What It Does

Takes a smart contract's ABI (Application Binary Interface) and automatically generates an MCP server that exposes every contract function as a tool.

```bash
# Install
pip install ucai

# Generate an MCP server from a contract ABI
ucai generate --abi ./MyContract.json --chain bsc --output ./my-mcp-server

# Start the generated server
cd my-mcp-server && python server.py
```

This means you can turn **any** deployed smart contract into an AI-accessible tool in seconds.

---

## Using Multiple Servers Together

You can run multiple MCP servers simultaneously:

```json
{
  "mcpServers": {
    "bnbchain": {
      "command": "npx",
      "args": ["-y", "@nirholas/bnbchain-mcp"],
      "env": { "BSC_RPC_URL": "https://bsc-dataseed.binance.org" }
    },
    "binance": {
      "command": "npx",
      "args": ["-y", "@nirholas/binance-mcp"],
      "env": {
        "BINANCE_API_KEY": "your-key",
        "BINANCE_SECRET_KEY": "your-secret"
      }
    },
    "market-data": {
      "command": "npx",
      "args": ["-y", "@nirholas/crypto-market-data"]
    }
  }
}
```

Now Claude can query BNB Chain, trade on Binance, and fetch market data — all in one conversation.

---

## Security Best Practices

1. **Never commit API keys or private keys** to your repository
2. Use **read-only API keys** when you don't need trading
3. Set **IP restrictions** on your Binance API keys
4. Use **testnet** for development (`BSC_TESTNET_RPC_URL`)
5. Start with **small amounts** when testing live trading
6. Review the [Security Policy](../SECURITY.md) for more

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Make sure the server is running (`bun start`) |
| "Invalid API key" | Check your environment variables are set correctly |
| "Rate limited" | Add delays between requests, or upgrade your API plan |
| "Transaction failed" | Check gas settings and wallet balance |
| Server crash on start | Run `bun install` first, check Node.js version (18+) |

---

## See Also

- [Getting Started](getting-started.md) — Initial setup
- [Agents](agents.md) — AI agents that use these servers
- [Examples](examples.md) — Real-world usage patterns
- [Troubleshooting](troubleshooting.md) — More debugging help
