# Changelog

All notable changes to the BNB Chain AI Toolkit are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2026-02-18

### Added

#### DeFi Tools — Sweep Subsystem Completion

- **Sweep API endpoints** — Implemented `/api/sweep/quote`, `/api/sweep/execute`, `/api/consolidate/execute` with x402 payment gates, input validation, BullMQ job queuing, and Redis caching
- **Sweep execution worker** — Real on-chain execution via viem: ERC-20 approvals, transaction submission, per-chain wallet clients
- **Transaction tracking worker** — On-chain confirmation monitoring via `getTransactionReceipt()` with automatic retry and timeout handling
- **Bridge execution worker** — Real cross-chain bridge transaction submission using aggregator-built calldata, replacing mock implementations
- **Bridge notification system** — Webhook dispatch (POST to user-configured URLs), email notifications (configurable SMTP/API), push notifications (Firebase/OneSignal) for bridge lifecycle events
- **Synapse Protocol bridge provider** — Full `IBridgeProvider` implementation: quote via Synapse REST API, transaction building via SynapseRouter ABI, status tracking via bridge explorer API. Supports ETH, ARB, OP, BASE, POLY, BSC, AVAX
- **Payment dispute refunds** — Wired `processRefund()` into `resolveDispute()` with automatic USDC transfer on Base when disputes are approved

### Changed

- **Bridge aggregator** — Added Synapse to default enabled providers (now 6 total: Across, Stargate, Hop, cBridge, Socket, Synapse)
- **Documentation** — Updated `docs/defi-tools.md` with API endpoints, bridge providers, queue workers, payment facilitator, and environment variables; updated `docs/architecture.md` with sweep subsystem diagram; updated `docs/TECHNICAL.md` with subsystem table

### Fixed

#### Code Quality

- **Zero lint errors** — Fixed all 62 ESLint errors across 50+ source files (hoisting, purity, set-state-in-effect, memoization, unused vars/imports)
- **Reduced warnings** — Brought lint warnings down from 562 to ~414 (remaining are `no-explicit-any` and `no-unused-vars`)

#### Documentation Accuracy

- **Tool counts** — Standardized MCP server tool counts across all docs to match verified file counts: bnbchain-mcp (466+), binance-mcp (554+), universal-crypto-mcp (59+), agenti (58+); total 1,100+
- **Contract names** — Updated `docs/standards.md` and `docs/examples.md` to reference actual deployed contracts (`IdentityRegistryUpgradeable`, `ReputationRegistryUpgradeable`, `ValidationRegistryUpgradeable`) instead of outdated placeholders
- **meta.json** — Fixed agent count (72 → 78) and tool count (600 → 1,100) to match actual inventory
- **npm namespace** — Corrected `@anthropic/universal-crypto-mcp` → `@nirholas/universal-crypto-mcp` in `docs/TECHNICAL.md` and `docs/EXTRAS.md`
- **Doc file count** — Updated references from "17 files" to "18 files" in `AI_BUILD_LOG.md` and `EXTRAS.md`
- **Language count** — Fixed "42-language" → "30+" in `docs/market-data.md`; clarified DeFi agents use 18 locale files while BNB Chain agents have 30 locale directories in `llms-full.txt`
- **Hackathon track** — Aligned `docs/PROJECT.md` track name with `HACKATHON.md` ("Agent" track)
- **Timeline formatting** — Fixed broken table row in `docs/AI_BUILD_LOG.md`

---

## [2.1.0] - 2026-02-18

### Added

#### opBNB Chain Support (Chain ID: 204 + 5611)

- **ERC-8004 Contracts deployed on opBNB** — Both mainnet (204) and testnet (5611) with deterministic `0x8004` vanity addresses via CREATE2
- **CLI support for 26 chains** — Expanded from 6 to 26 chains: BSC, opBNB, Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche, Linea, Scroll, zkSync Era, Mantle, Fantom, Gnosis, Celo, Moonbeam (testnets + mainnets)
- **opBNB in erc8004-agents web app** — Full chain support in the agent creator UI
- **Agent Runtime SDK** — Production-ready TypeScript runtime with A2A protocol, x402 micropayments, ERC-8004 on-chain identity, and discovery endpoints

#### Documentation & Submission

- **JUDGES.md** — Enhanced evaluator guide with agent runtime walkthrough
- **contracts.md** — 24-chain deployment list (up from 22) including opBNB
- **HACKATHON.md** — Complete on-chain proof table with opBNB testnet + mainnet
- **Docker support** — Server environment configuration for docker-compose

### Security

#### Critical

- **Command injection fix** — `auto-submit.ts` scripts (both copies) replaced `execSync` with `execFileSync` using argument arrays; added strict regex validation (`^[a-zA-Z0-9_-]+$`) for agent names and branch names

#### High

- **CORS hardening** — All HTTP servers (agent runtime, MCP servers, translate API, search service) now restrict cross-origin requests via `CORS_ORIGINS` / `CORS_ORIGIN` environment variables; wildcard only in dev mode
- **XSS prevention** — Replaced `innerHTML` assignments with safe DOM APIs (`textContent`, `createElement`, `appendChild`) in web templates (3 locations) and VS Code extension webview
- **Input validation** — Deploy route enforces network allowlist, hex bytecode format, ABI array check, and constructor args limit (max 20); IPFS route validates CID format and enforces 5 MB content limit
- **SQL injection mitigation** — Search service escapes LIKE metacharacters (`%`, `_`, `\`) in user queries

#### Medium

- **Docker hardening** — Nginx and agent-runtime containers run as non-root users; Redis requires password and binds to localhost only
- **CSP tightening** — Removed `unsafe-eval` from nginx Content-Security-Policy; added `Permissions-Policy` and `strict-origin-when-cross-origin` referrer policy
- **Rate limiter fix** — Enabled `X-Forwarded-For` validation in production for all 4 rate limiters; proxy trust is now opt-in via `TRUST_PROXY` env var
- **Error handler** — Stack traces no longer leak in production; opt-in via `SHOW_STACK_TRACES` env var
- **API key masking** — Deploy marketplace script now masks API keys in log output

#### Low

- **WebSocket limits** — Search service enforces max 1,000 concurrent WebSocket connections (configurable via `MAX_WS_CONNECTIONS`)
- **Cache limits** — In-memory cache capped at 10,000 entries with LRU-style eviction (configurable via `MAX_CACHE_SIZE`)
- **Wallet warnings** — Python wallet toolkit displays security warnings when outputting private keys or mnemonics

---

## [2.0.0] - 2026-02-11

### Added

#### BNB Chain AI Toolkit v2.0 — Complete Monorepo Transformation

Consolidated 14 independent repositories into one comprehensive AI toolkit for BNB Chain:

**AI Agents (78)**
- 36 BNB Chain-specific agents (PancakeSwap, Venus, staking, bridging, etc.)
- 42 general DeFi agents with 30+ language support

**MCP Servers (6)**
- `bnbchain-mcp` — BNB Chain + EVM operations (100+ tools)
- `binance-mcp` — Binance.com exchange (478+ tools)
- `binance-us-mcp` — Binance.US (US compliance)
- `universal-crypto-mcp` — 60+ networks (100+ tools)
- `agenti` — Universal EVM + Solana MCP
- `ucai` — ABI-to-MCP generator (Python)

**Market Data**
- `crypto-market-data` — CoinGecko, DeFiLlama, Fear & Greed Index
- `crypto-news` — 200+ sources, 150+ API endpoints, sentiment analysis

**DeFi Tools**
- `sweep` — Multi-chain dust sweeper (8 chains)

**Wallets**
- `ethereum-wallet-toolkit` — Offline-capable, BSC-compatible wallet operations

**Standards**
- `erc-8004` — Agent discovery & trust protocol (Solidity contracts + demo)
- `w3ag` — Web3 Accessibility Guidelines

**Documentation**
- Comprehensive docs/ directory with 12 guides
- Beginner-friendly "What Is This?" guide
- Progressive complexity (non-technical → advanced)
- Animated SVG header
- ASCII art README
- Full FAQ, troubleshooting, examples, awesome list

**Meta Files**
- `llms.txt` and `llms-full.txt` for AI discovery
- `CITATION.cff` for academic citation
- `humans.txt` for human-readable credits
- Agent instruction files for all major AI coding assistants
- Comprehensive SECURITY.md, CONTRIBUTING.md

### Changed

- Renamed from `defi-agents` to `BNB Chain AI Toolkit`
- Package name: `@nirholas/bnb-chain-ai-toolkit`
- Complete README rewrite with ASCII art + SVG header
- Updated all branding across meta files

---

## [1.1.0] - 2025-12-21

### Added

#### Master Agent for Simplified UX

- **sperax-portfolio** — All-in-one cryptocurrency portfolio management master agent
  - Combines ALL 16 portfolio plugin features into ONE comprehensive agent
  - Portfolio tracking, trading automation, DeFi protocols, analytics
  - Recommended as primary agent for most use cases

### Changed

- **Total Agents**: 57 → 58 (added master agent)

---

## [1.0.0] - 2025-12-21

### Added

#### Initial Release

- 57 AI agent definitions
- JSON Schema validation
- 30+ language translation support
- Build pipeline (format, build, validate)
- Vercel deployment
- GitHub Pages support
- SEO optimization
- API documentation

#### Agent Categories

- 16 Sperax Portfolio Plugin agents
- 7 Core Sperax agents
- 34 General DeFi agents

---

[2.2.0]: https://github.com/nirholas/bnb-chain-toolkit/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/nirholas/bnb-chain-toolkit/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/nirholas/bnb-chain-toolkit/compare/v1.0.0...v2.0.0
[1.1.0]: https://github.com/nirholas/bnb-chain-toolkit/releases/tag/v1.1.0
[1.0.0]: https://github.com/nirholas/bnb-chain-toolkit/releases/tag/v1.0.0
