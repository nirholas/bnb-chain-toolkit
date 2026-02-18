# Architecture

How everything in the BNB Chain AI Toolkit fits together — and *why* it's designed this way.

> **New to this project?** Start with [What Is This?](what-is-this.md) for a non-technical overview, or the [Glossary](GLOSSARY.md) if you encounter unfamiliar terms.

---

## The Big Picture

The toolkit is a **monorepo** (one repository containing many independent projects) with six main component groups. Each group can be used independently, but they're designed to work together.

```
┌──────────────────────────────────────────────────────────────┐
│                     BNB Chain AI Toolkit                      │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│   AI Agents  │ MCP Servers  │  Market Data │   DeFi Tools    │
│   (78)       │   (6)        │  (2)         │   + Wallets     │
│              │              │              │   + Standards    │
│  BNB Chain   │  bnbchain    │  prices      │   sweep         │
│  agents (36) │  binance     │  news        │   wallet-tk     │
│  DeFi        │  binance-us  │  sentiment   │   ERC-8004      │
│  agents (42) │  universal   │              │   W3AG          │
│              │  agenti      │              │                 │
│              │  ucai        │              │                 │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬────────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
   Claude/GPT    Blockchains     CoinGecko      Smart Contracts
   Copilot       BSC, opBNB      DeFiLlama      on BSC/Ethereum
   Any LLM       60+ chains      200+ sources
```

**How to read this diagram:** The top box is the toolkit. Each column is a component group. The bottom row shows what each group connects to in the outside world.

---

## Why a Monorepo?

We chose a monorepo over separate repositories because:

| Benefit | Why It Matters |
|---------|---------------|
| **Single clone** | One `git clone` gives you everything. No hunting for related repos. |
| **Shared tooling** | One set of linting rules, one CI pipeline, one set of docs. |
| **Cross-component examples** | Examples can reference agents + MCP servers + market data in one place. |
| **Independence** | Despite being in one repo, each component has its own `package.json` and can be used alone. |

You can use the MCP servers without the agents, or the market data without the MCP servers. They're separate packages that happen to live together.

---

## Directory Structure

```
bnb-chain-toolkit/
│
├── agents/                          # AI Agent definitions
│   ├── bnb-chain-agents/            # 36 BNB Chain-specific agents
│   │   ├── pancakeswap-trader.json  # PancakeSwap trading agent
│   │   ├── venus-protocol.json      # Venus lending agent
│   │   ├── bnb-staking-advisor.json # Staking optimization
│   │   ├── agent-template.json      # Template for new agents
│   │   └── ...
│   └── defi-agents/                 # 42 general DeFi agents
│       ├── src/                     # Agent source definitions
│       ├── schema/                  # JSON schema validation
│       ├── locales/                 # 30+-language translations
│       └── scripts/                 # Build tools
│
├── mcp-servers/                     # Model Context Protocol servers
│   ├── bnbchain-mcp/                # BNB Chain + EVM (466+ tools)
│   ├── binance-mcp/                 # Binance.com (554+ tools)
│   ├── binance-us-mcp/              # Binance.US (US compliance)
│   ├── universal-crypto-mcp/        # 60+ networks (59+ tools)
│   ├── agenti/                      # EVM + Solana MCP
│   └── ucai/                        # ABI-to-MCP generator (Python)
│
├── market-data/                     # Market data services
│   ├── crypto-market-data/          # Price feeds & analytics
│   └── crypto-news/                 # News aggregation (200+ sources)
│
├── defi-tools/                      # DeFi utilities
│   └── sweep/                       # Multi-chain dust sweeper
│       ├── src/api/                 # Hono REST API + x402 payments
│       ├── src/queue/               # BullMQ workers (sweep, bridge)
│       ├── src/services/bridge/     # 6-provider bridge aggregator
│       ├── src/services/payments/   # x402 facilitator + disputes
│       └── src/config/              # Chain + token configuration
│
├── wallets/                         # Wallet tooling
│   └── ethereum-wallet-toolkit/     # Offline wallet operations
│
├── standards/                       # Web3 standards
│   ├── erc-8004/                    # Agent discovery protocol
│   │   ├── contracts/               # Solidity smart contracts
│   │   └── demo-agent/              # Reference implementation
│   └── w3ag/                        # Web3 accessibility
│
├── src/                             # Original agent source JSONs
├── scripts/                         # Build & formatting tools
├── locales/                         # 30+ language translations
├── schema/                          # JSON Schema definitions
├── public/                          # Built output (index.json)
│
├── docs/                            # Documentation (you are here)
│
├── README.md                        # Main readme
├── CONTRIBUTING.md                  # How to contribute
├── CHANGELOG.md                     # Version history
├── SECURITY.md                      # Security policy
├── LICENSE                          # MIT license
├── AGENTS.md                        # AI agent dev guidelines
├── CLAUDE.md                        # Claude Code instructions
├── GEMINI.md                        # Gemini instructions
├── .github/copilot-instructions.md  # GitHub Copilot instructions
├── llms.txt                         # AI discovery (summary)
├── llms-full.txt                    # AI discovery (full)
├── CITATION.cff                     # Academic citation
├── humans.txt                       # Human-readable credits
└── meta.json                        # Project metadata
```

---

## Data Flow

Understanding how data moves through the system helps you debug issues and build extensions.

### Agent Discovery Flow

**What happens:** When you run `bun run build`, the toolkit reads all agent JSON files, validates them against a schema (to catch errors), and compiles them into a single searchable index.

```
User installs toolkit
       │
       ▼
  bun run build
       │
       ▼
  Reads src/*.json (agent definitions)
       │
       ▼
  Validates against schema/          ← Catches invalid JSON or missing fields
       │
       ▼
  Generates public/index.json        ← All 78 agents in one file
       │
       ▼
  Available as JSON API              ← Frontend reads this, or you query it directly
```

**Why this design:** Agents are static JSON — no code execution, no dependencies. This makes them safe to share, easy to inspect, and portable across any AI platform. The build step is just for bundling and validation.

### MCP Server Flow

**What happens:** When Claude (or another AI) needs blockchain data, it sends a request to an MCP server. The server translates that into a blockchain query, gets the result, and sends it back to the AI.

```
AI Assistant (e.g., Claude)
       │
       │ MCP Protocol (stdio or HTTP+SSE)
       ▼
  MCP Server (e.g., bnbchain-mcp)
       │
       │ JSON-RPC / REST
       ▼
  Blockchain RPC Node (e.g., bsc-dataseed.binance.org)
       │
       │ On-chain query/transaction
       ▼
  Smart Contract or Chain State
       │
       ▼
  Response back to AI ← formatted as a human-readable answer
```

**Why this design:** MCP is a standard protocol, so the same server works with Claude, Cursor, GitHub Copilot, or any MCP-compatible client. The server handles all blockchain complexity — the AI just calls named tools like `get_balance` or `swap_tokens`.

### Market Data Flow

```
  crypto-market-data library
       │
       ├── CoinGecko API ──→ Prices, market caps, volume
       ├── DeFiLlama API ──→ TVL, protocol data, yields
       └── Fear & Greed  ──→ Market sentiment
       │
       ▼
  Cached response with TTL
       │
       ▼
  Your application / AI agent
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Agent Definitions** | JSON | Portable, schema-validated agent configs |
| **MCP Servers** | TypeScript / Node.js | AI-to-blockchain bridges |
| **UCAI** | Python | ABI-to-MCP code generation |
| **Market Data** | TypeScript | Zero-dependency data fetching |
| **Smart Contracts** | Solidity / Foundry | On-chain protocols (ERC-8004) |
| **Wallet Toolkit** | TypeScript | Offline-capable wallet operations |
| **Build System** | bun | Fast builds and script execution |
| **Translations** | JSON (i18n) | 30+ language support |
| **Schema** | JSON Schema | Agent definition validation |

---

## Component Dependencies

```
                ┌─────────────┐
                │  AI Agent   │
                │ Definitions │
                └──────┬──────┘
                       │ uses
           ┌───────────┼───────────┐
           ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │   MCP    │ │  Market  │ │  Wallet  │
    │ Servers  │ │  Data    │ │  Toolkit │
    └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │
         ▼            ▼            ▼
    Blockchains   Data APIs    Key Mgmt
```

Each component is **independent** — you can use MCP servers without agents, market data without MCP servers, etc. They integrate well together but don't require each other.

---

## Design Principles

These principles drove every architectural decision. Understanding them will help you predict how the system behaves and how to extend it.

| # | Principle | What It Means | Why |
|---|-----------|--------------|-----|
| 1 | **Modular** | Use only what you need, skip the rest | Nobody needs all 1,100+ tools. You might only want market data, or just one MCP server. Everything is independently installable. |
| 2 | **Standard Protocols** | MCP for AI, JSON Schema for validation, Solidity for contracts | Using established standards means the toolkit works with existing tools and doesn't lock you into proprietary formats. |
| 3 | **Chain Agnostic** | Built for BNB Chain but works with 60+ networks | BNB Chain is the primary focus because of the hackathon, but the architecture doesn't hard-code any specific chain. |
| 4 | **Offline Capable** | Wallet operations and agent definitions work without internet | Critical for security. You should be able to generate wallets and sign transactions on an air-gapped machine. |
| 5 | **Multi-Language** | 30+ translations for global accessibility | Crypto is global. Agents should speak the user's language. |
| 6 | **AI-First** | Every component is designed for AI assistant consumption | JSON responses, clear tool names, self-descriptive schemas — everything is optimized for LLM comprehension, not just human consumption. |
| 7 | **Secure by Default** | CORS locked, non-root containers, input validation everywhere | The default configuration should be safe. Users opt *in* to less secure settings, never opt *out*. |
| 8 | **No Code in Agents** | Agent definitions are inert JSON, never executable code | Agents are safe to share, inspect, and publish. They can't run code or access your filesystem — they're just text. |

---

## Security Architecture

### Defense in Depth

```
         Internet
            │
            ▼
  ┌──────────────────┐
  │     nginx         │  CSP headers, HTTPS, rate limiting
  │  (non-root user)  │  Permissions-Policy, X-Content-Type-Options
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │   Express/Hono    │  CORS validation, input sanitization
  │   Application     │  Rate limiting (X-Forwarded-For aware)
  └────────┬─────────┘  Error masking (no stack traces)
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
  Routes  MCP   WebSocket
  - Deploy validation    - CORS per-server     - Connection limits
  - IPFS CID checks      - Origin allowlists   - Max 1000 concurrent
  - Network allowlist     - No eval()
     │
     ▼
  ┌──────────────────┐
  │   Data Layer      │  SQL LIKE escaping, cache size limits
  │  (SQLite/Redis)   │  Redis password auth, localhost binding
  └──────────────────┘
```

### Container Security

- All Docker containers run as **non-root** users
- Redis requires password authentication and binds to `127.0.0.1`
- No secrets in container images — all credentials via environment variables

### Configuration

All security controls are configurable via environment variables. See [SECURITY.md](../SECURITY.md#environment-variables-reference) for the complete reference.

---

## Sweep Subsystem Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Hono API Server                     │
│   /wallet  /price  /sweep  /consolidate  /bridge     │
│              │ x402 Payment Middleware │               │
└──────┬───────┴───────────┬────────────┴──────────────┘
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────────┐
│   Redis      │   │   BullMQ Queues   │
│   Cache +    │   │   sweep-execute   │
│   Rate Limit │   │   sweep-track     │
│              │   │   bridge-execute  │
│              │   │   bridge-track    │
└──────────────┘   └────────┬─────────┘
                            │
                   ┌────────┴─────────┐
                   │  Bridge Aggregator │
                   │  6 Providers:      │
                   │  Across, Stargate, │
                   │  Hop, cBridge,     │
                   │  Socket, Synapse   │
                   └────────┬──────────┘
                            │
                   ┌────────┴─────────┐
                   │   viem Clients    │
                   │   (per chain)     │
                   └────────┬──────────┘
                            │
                   ┌────────┴─────────┐
                   │  EVM Chains (8+)  │
                   │  BSC, ETH, ARB,   │
                   │  OP, POLY, BASE,  │
                   │  AVAX, FTM        │
                   └───────────────────┘
```

---

## See Also

- [Glossary](GLOSSARY.md) — Definitions for every term used on this page
- [Getting Started](getting-started.md) — Quick setup guide
- [MCP Servers](mcp-servers.md) — Deep dive into each server
- [Agents](agents.md) — Complete agent catalog
- [Standards](standards.md) — ERC-8004 and W3AG specifications
- [TECHNICAL.md](TECHNICAL.md) — Full technical breakdown (hackathon document)
