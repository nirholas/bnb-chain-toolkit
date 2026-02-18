# AI Agents Guide

Everything you need to know about the 78 AI agents in this toolkit.

---

## What Are AI Agents?

AI agents are pre-configured personality definitions for AI assistants. Each agent has:

- **A specific role** — What it specializes in (trading, analysis, staking, etc.)
- **System prompt** — Instructions that shape how the AI behaves
- **Tool access** — Which MCP tools it can use
- **Knowledge** — Domain-specific context and expertise

You load an agent into your AI assistant, and it becomes a specialist in that domain.

---

## Agent Categories

### BNB Chain Agents (36)

Purpose-built for the BNB Chain ecosystem. Located in `agents/bnb-chain-agents/`.

| # | Agent | What It Does |
|---|-------|-------------|
| 1 | **PancakeSwap Trader** | DEX trading, liquidity, yield farming on PancakeSwap v3 |
| 2 | **Venus Protocol Expert** | Lending, borrowing, liquidation on Venus |
| 3 | **BNB Staking Advisor** | Liquid staking optimization across validators |
| 4 | **Binance Earn Specialist** | Savings, staking, Launchpool yields |
| 5 | **BSC Bridge Navigator** | Cross-chain bridging (BSC ↔ opBNB ↔ L2s) |
| 6 | **BEP-20 Token Analyst** | Token security, smart money tracking |
| 7 | **Binance Copy Trading** | Mirror top performers' strategies |
| 8 | **opBNB Scaling Expert** | L2 gas optimization |
| 9 | **Greenfield Storage** | Decentralized storage on BNB Greenfield |
| 10 | **Thena DEX Expert** | ve(3,3) DEX trading on Thena |
| 11 | **BiSwap DeFi Agent** | BiSwap DEX operations |
| 12 | **BNB Liquid Staking** | stkBNB, BNBx, ankrBNB strategies |
| 13 | **BSC NFT Specialist** | NFT trading and analysis on BSC |
| 14 | **Binance Launchpad** | IEO and token sale participation |
| 15 | **opBNB Gaming Expert** | GameFi on opBNB |
| 16 | **BSC MEV Protection** | Front-running protection strategies |
| 17 | **BNB Chain Governance** | DAO voting and proposals |
| 18 | **BSC Yield Aggregator** | Auto-compounding yield strategies |
| 19 | **Binance P2P Trading** | Peer-to-peer crypto trading |
| 20 | **BSC Smart Contract Auditor** | Contract security analysis |
| 21 | **BNB Chain News Alpha** | Real-time BNB Chain news, alpha signals |
| 22 | **BNB Cross-Chain Bridge** | Cross-chain bridging between BSC and other networks |
| 23 | **BNB RWA Stablecoin Expert** | Real-world asset tokenization and stablecoins |
| 24 | **BNB Token Launcher** | Token creation and launch strategies on BSC |
| 25 | **BSC Developer** | Smart contract development on BSC |
| 26 | **BSC Portfolio Tracker** | Portfolio tracking across BSC protocols |
| 27 | **BSC Whale Tracker** | Smart money and whale wallet monitoring |
| 28 | **BscScan Analytics** | On-chain analytics via BscScan |
| 29 | **CZ / Binance Expert** | Binance ecosystem knowledge and history |
| 30 | **Lista DAO Expert** | Lista DAO lending and liquid staking |
| 31 | **opBNB L2 Expert** | Layer 2 scaling on opBNB |
| 32 | **BNB Agent Builder** | Building and deploying AI agents for BNB Chain |
| 33 | **Binance Margin Expert** | Margin trading strategies on Binance |
| 34 | **Binance Earn Specialist** | Advanced Binance Earn products and yields |
| 35 | **Binance Web3 Wallet** | Binance Web3 Wallet operations |
| 36 | **Alpaca Finance Expert** | Leveraged yield farming on Alpaca Finance |

### General DeFi Agents (42)

Cross-chain agents that work on any supported network. Located in `agents/defi-agents/`.

**Categories:**

| Category | Agents | Description |
|----------|--------|-------------|
| Portfolio Management | 8 | Tracking, rebalancing, tax, risk |
| Trading Automation | 7 | Grid, DCA, arbitrage, signals |
| Yield Optimization | 6 | Compounding, IL protection, rotation |
| Risk & Security | 5 | Auditing, rug detection, exposure |
| Market Intelligence | 5 | Sentiment, whale tracking, analytics |
| DeFi Protocols | 6 | Lending, DEX, derivatives |
| Infrastructure | 5 | Bridge, gas, RPC, indexing |

---

## How to Use an Agent

### Option 1: With Claude Desktop (Recommended)

1. Choose an agent from the list above
2. Open the agent's JSON file (e.g., `agents/bnb-chain-agents/pancakeswap-trader.json`)
3. Copy the `systemRole` field
4. Paste it into Claude's custom instructions or a "Project" prompt

### Option 2: With Any AI Platform

The `systemRole` field in each agent JSON works with any AI platform:

```json
{
  "identifier": "pancakeswap-trader",
  "meta": {
    "title": "PancakeSwap Trader",
    "description": "Expert DEX trading agent for PancakeSwap v3"
  },
  "systemRole": "You are a PancakeSwap trading expert..."
}
```

Copy the `systemRole` value and use it as a system prompt in:
- ChatGPT (Custom Instructions)
- Claude (Projects → Instructions)
- Gemini
- Any LLM API

### Option 3: Via the JSON API

After running `bun run build`, all agents are available at `public/index.json`:

```bash
# Get all agents
cat public/index.json | jq '.agents | length'  # → 78

# Find a specific agent
cat public/index.json | jq '.agents[] | select(.identifier == "pancakeswap-trader")'
```

---

## Agent JSON Format

Every agent follows this schema:

```json
{
  "identifier": "unique-agent-id",
  "author": "nirholas",
  "createdAt": "2025-12-21",
  "meta": {
    "title": "Agent Display Name",
    "description": "One-line description",
    "tags": ["defi", "trading", "bnb"],
    "avatar": "🥞",
    "category": "trading"
  },
  "config": {
    "model": "gpt-4o",
    "temperature": 0.7,
    "maxTokens": 4096
  },
  "systemRole": "You are a specialized AI agent that..."
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `identifier` | string | Unique ID (kebab-case) |
| `meta.title` | string | Display name |
| `meta.description` | string | Short description |
| `systemRole` | string | The agent's personality and expertise |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `meta.tags` | string[] | Searchable tags |
| `meta.avatar` | string | Emoji avatar |
| `meta.category` | string | Category for grouping |
| `config.model` | string | Preferred LLM model |
| `config.temperature` | number | Creativity (0-1) |

---

## Creating Your Own Agent

### Step 1: Copy the Template

```bash
cp agents/bnb-chain-agents/agent-template.json agents/bnb-chain-agents/my-agent.json
```

### Step 2: Edit the Definition

```json
{
  "identifier": "my-custom-agent",
  "meta": {
    "title": "My Custom Agent",
    "description": "A specialized agent for my use case",
    "tags": ["custom", "bnb"],
    "avatar": "🤖"
  },
  "systemRole": "You are an expert in [your domain]. You help users with [specific tasks]. You always [key behaviors]."
}
```

### Step 3: Rebuild the Index

```bash
bun run build
```

### Tips for Good System Prompts

1. **Be specific** — "You are a PancakeSwap v3 liquidity expert" beats "You know about DeFi"
2. **Define boundaries** — Tell the agent what it should NOT do
3. **Include context** — Reference specific protocols, contracts, or APIs
4. **Set tone** — Professional? Casual? Technical? Define it
5. **Add safety rails** — "Always warn about risks before recommending trades"

---

## Multi-Language Support

DeFi agents support 30+ languages:

| Language | Code | Status |
|----------|------|--------|
| English | en-US | ✅ Complete |
| Chinese (Simplified) | zh-CN | ✅ Complete |
| Japanese | ja-JP | ✅ Complete |
| Korean | ko-KR | ✅ Complete |
| Spanish | es-ES | ✅ Complete |
| French | fr-FR | ✅ Complete |
| German | de-DE | ✅ Complete |
| Portuguese (BR) | pt-BR | ✅ Complete |
| Russian | ru-RU | ✅ Complete |
| Arabic | ar | ✅ Complete |
| Turkish | tr-TR | ✅ Complete |
| Vietnamese | vi-VN | ✅ Complete |
| Thai | th-TH | ✅ Complete |
| Hindi | hi-IN | ✅ Complete |
| Polish | pl-PL | ✅ Complete |
| Italian | it-IT | ✅ Complete |
| Dutch | nl-NL | ✅ Complete |
| Indonesian | id-ID | ✅ Complete |
| Czech | cs-CZ | ✅ Complete |
| Danish | da-DK | ✅ Complete |
| Finnish | fi-FI | ✅ Complete |
| Greek | el-GR | ✅ Complete |
| Hebrew | he-IL | ✅ Complete |
| Hungarian | hu-HU | ✅ Complete |
| Malay | ms-MY | ✅ Complete |
| Norwegian | nb-NO | ✅ Complete |
| Romanian | ro-RO | ✅ Complete |
| Serbian | sr-RS | ✅ Complete |
| Swedish | sv-SE | ✅ Complete |
| Ukrainian | uk-UA | ✅ Complete |

---

## See Also

- [MCP Servers](mcp-servers.md) — Connect agents to blockchains
- [Examples](examples.md) — Real-world agent usage
- [Architecture](architecture.md) — How agents fit in the system
