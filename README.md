# BNB Chain AI Agents 🟡

> The world's first comprehensive collection of AI agents purpose-built for the BNB Chain ecosystem — powered by live MCP (Model Context Protocol) servers with 800+ tools.

[![BNB Chain](https://img.shields.io/badge/BNB%20Chain-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](https://www.bnbchain.org/)
[![MCP](https://img.shields.io/badge/MCP-Powered-blue?style=for-the-badge)](https://modelcontextprotocol.io/)
[![Agents](https://img.shields.io/badge/Agents-30-green?style=for-the-badge)](#agents)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

## 🏆 Good Vibes Only: OpenClaw Edition Hackathon

Built for the [BNB Chain Hackathon](https://www.bnbchain.org/en/hackathon) — Track 1: Agent.
Live at: **[bnb-agents.sperax.click](https://bnb-agents.sperax.click)**

## Overview

**30 specialized AI agents** covering every corner of the BNB Chain ecosystem:

| Category | Count | Coverage |
|----------|-------|----------|
| **DeFi** | 10 | PancakeSwap, Venus, Thena, Alpaca, Lista DAO, bridging, aggregation, liquid staking |
| **Exchange** | 3 | Binance spot, earn, copy trading |
| **Trading** | 2 | Futures, launchpad analysis |
| **Analytics** | 3 | BSCScan, whale tracking, news & alpha |
| **Development** | 2 | BSC developer tools, MEV & gas optimization |
| **Security** | 2 | Auditing, BEP-20 token analysis |
| **Ecosystem** | 3 | BNB Chain, opBNB L2, Binance Web3 Wallet |
| **Storage** | 1 | BNB Greenfield |
| **Governance** | 1 | Cross-protocol governance |
| **Gaming** | 1 | Web3 gaming on BSC |
| **NFT** | 1 | BEP-721/1155 NFTs |
| **Staking** | 1 | Native + liquid staking comparison |

## 🔌 MCP Integration — The Differentiator

Every agent connects to **live MCP servers** via HTTP transport at `https://modelcontextprotocol.name/mcp/{server-name}`:

| MCP Server | Tools | What It Does |
|------------|-------|--------------|
| **bnbchain-mcp** | 175+ | BSC/opBNB chain queries, DeFi data, contracts, gas, security |
| **Binance-MCP** | 478+ | Exchange data — prices, orderbooks, klines, trading pairs |
| **Binance-US-MCP** | 60+ | US-compliant Binance data and tools |
| **sperax-crypto-mcp** | 85 | Protocol analytics and yield comparison |
| **free-crypto-news** | 40 | Real-time crypto news (no API key needed!) |
| **universal-crypto-mcp** | 50+ | Cross-chain data, multi-chain comparison |
| **XActions** | 12+ | X/Twitter social sentiment analysis |

**Total: 800+ live tools** — no stale data, no hallucinated prices.

## Agents

### DeFi
| Agent | Description | MCP Plugins |
|-------|-------------|-------------|
| 🥞 PancakeSwap Expert | Swaps, V3 liquidity, farming, CAKE staking | bnbchain, binance, news |
| ♀️ Venus Protocol Expert | Lending, borrowing, XVS, health factor | bnbchain, binance, news |
| ⚡ Thena DEX Expert | ve(3,3) liquidity, veTHE voting, bribes | bnbchain, binance, news |
| 🦙 Alpaca Finance Expert | Leveraged farming, Automated Vaults | bnbchain, binance, news |
| 🏛️ Lista DAO Expert | slisBNB staking, lisUSD CDPs, veLISTA | bnbchain, binance, sperax, news |
| 🌉 Cross-Chain Bridge | All BSC bridges compared | bnbchain, universal, binance, news |
| 🧮 DeFi Aggregator | 50+ protocol yield comparison | bnbchain, binance, sperax, universal, news |
| 💧 Liquid Staking Optimizer | slisBNB vs BNBx vs ankrBNB | bnbchain, binance, sperax, news |
| 🌉 Bridge Expert | BSC ↔ opBNB ↔ Ethereum bridging | bnbchain, universal, binance, news |
| 💰 Staking Advisor | Native + liquid staking comparison | bnbchain, binance, sperax, news |

### Exchange & Trading
| Agent | Description | MCP Plugins |
|-------|-------------|-------------|
| 💹 Binance Spot Trader | Spot trading with 478+ live tools | binance, binance-us, news, bnbchain |
| 📈 Binance Futures Expert | Perpetuals, leverage, funding rates | binance, news, bnbchain |
| 🏦 Binance Earn Advisor | Simple Earn, BNB Vault, Launchpool | binance, binance-us, news, bnbchain |
| 👥 Copy Trading | Lead trader analysis and risk management | binance, news |
| 🎯 Earn Specialist | Deep Earn product analysis | binance, binance-us, news, bnbchain |
| 🚀 Launchpad Analyst | IEO/Launchpool evaluation | binance, news, bnbchain |

### Analytics & Intelligence
| Agent | Description | MCP Plugins |
|-------|-------------|-------------|
| 🔍 BSCScan Analytics | Transaction analysis, contract verification | bnbchain, binance, news |
| 🐋 BSC Whale Tracker | Whale movements, smart money flows | bnbchain, binance, news |
| 📰 News & Alpha | Real-time BNB ecosystem intelligence | news, bnbchain, binance, xactions |

### Development & Security
| Agent | Description | MCP Plugins |
|-------|-------------|-------------|
| 👨‍💻 BSC Developer | Solidity, Hardhat, contracts on BSC | bnbchain, news |
| ⛽ MEV & Gas Expert | Gas optimization, sandwich protection | bnbchain, binance, news |
| 🛡️ Security Auditor | Smart contract auditing, GoPlus scans | bnbchain, news |
| 🪙 BEP-20 Token Analyst | Token security, rug-pull detection | bnbchain, binance, news |

### Ecosystem
| Agent | Description | MCP Plugins |
|-------|-------------|-------------|
| ⛓️ BNB Chain Expert | The definitive BSC specialist (175+ tools) | all 6 MCP servers |
| 🚀 opBNB L2 Expert | Layer 2 sub-cent transactions | bnbchain, binance, news |
| 🌿 BNB Greenfield | Decentralized storage, data marketplace | bnbchain, binance, news |
| 👛 Binance Web3 Wallet | MPC wallet, DApp browser, airdrops | binance, bnbchain, universal, news |
| 🗳️ Governance Expert | Cross-protocol governance | bnbchain, binance, news |
| 🎮 Gaming Expert | Web3 gaming on BSC/opBNB | bnbchain, binance, news |
| 🖼️ NFT Expert | BEP-721/1155, marketplaces | bnbchain, binance, news |

## Architecture

```
bnb-agents/
├── src/                    # 30 agent source definitions
│   ├── *.json              # Each agent with MCP plugins config
├── locales/                # Auto-translated to 18 languages
├── public/                 # Built output (GitHub Pages)
├── scripts/
│   ├── builders/           # Build pipeline
│   ├── formatters/         # Validation + i18n translation
│   ├── validators/         # Schema validation
│   └── processors/         # Translation + categorization
└── .github/workflows/      # CI/CD → GitHub Pages
```

### Pipeline

```
src/*.json → bun run format → bun run build → GitHub Pages
                  ↓                 ↓
           Validates schema    Merges src + locales
           + translates to     → public/ with indexes
           18 languages via
           GPT-4.1-nano
```

## Quick Start

```bash
git clone https://github.com/nirholas/bnb-agents.git
cd bnb-agents
bun install
bun run test     # Validate all agents
bun run build    # Build for deployment
bun run format   # Format + translate (requires OPENAI_API_KEY)
```

## Compatible With

- **[SperaxOS](https://sperax.click)** — AI Agent Workspace (primary target)
- Any platform that consumes the agent JSON schema

## How Agents Use MCP

Each agent declares a `plugins` array mapping to live MCP servers:

```json
{
  "config": {
    "systemRole": "...MCP TOOLS AVAILABLE:\n- bnbchain-mcp: get_bsc_defi...",
    "plugins": ["bnbchain-mcp", "binance-mcp", "free-crypto-news"]
  }
}
```

## MCP Server Repositories

| Server | Repository |
|--------|-----------|
| bnbchain-mcp | [github.com/nirholas/bnbchain-mcp](https://github.com/nirholas/bnbchain-mcp) |
| Binance-MCP | [github.com/nirholas/Binance-MCP](https://github.com/nirholas/Binance-MCP) |
| Binance-US-MCP | [github.com/nirholas/Binance-US-MCP](https://github.com/nirholas/Binance-US-MCP) |
| sperax-crypto-mcp | [github.com/nirholas/sperax-crypto-mcp](https://github.com/nirholas/sperax-crypto-mcp) |
| free-crypto-news | [github.com/nirholas/free-crypto-news](https://github.com/nirholas/free-crypto-news) |
| universal-crypto-mcp | [github.com/nirholas/universal-crypto-mcp](https://github.com/nirholas/universal-crypto-mcp) |
| XActions | [github.com/nirholas/XActions](https://github.com/nirholas/XActions) |

## On-Chain Identity (ERC-8004)

Registered on BSC Testnet:
- **Agent Address**: `0xa010e277E3181FCb597914FBe39cF6d4C59A5F16`
- **Identity Contract**: `0x8004A818BFB912233c491871b3d84c89A494BD9e`
- **TX**: [`0xfc55d83d...`](https://testnet.bscscan.com/tx/0xfc55d83d20e6d92ff522f302fd3424d3fd5557f25c06f4bfc38ecf3246dc1962)

## License

MIT © [nirholas](https://github.com/nirholas)
