# 🤖 DeFi Agents API - AI Agent Definitions for Web3 
 
> **42 production-ready AI agent definitions for DeFi, portfolio management, trading, and Web3 workflows. RESTful JSON API with 30+ language support.**

A comprehensive, discoverable API hosting specialized AI agent schemas with universal compatibility. Works with any AI platform, LLM, or chatbot that supports agent indexes - no vendor lock-in, no platform restrictions. Perfect for developers, LLMs, and AI systems building Web3 applications.

---

## ✨ Key Features

- ✅ **42 Production-Ready Agents** - DeFi, portfolio, trading, Web3, education
- ✅ **18 Languages** - Automated i18n translation workflow ([Learn More →](./docs/I18N_WORKFLOW.md))
- ✅ **RESTful JSON API** - Easy integration for developers and LLMs ([API Docs →](./docs/API.md))
- ✅ **Machine-Readable Indexes** - Agent manifest for AI crawlers ([agents-manifest.json](./agents-manifest.json))
- ✅ **Universal Format** - Standard JSON schema works with any platform
- ✅ **No Vendor Lock-in** - Switch platforms without losing work
- ✅ **Open Source** - MIT licensed, fully transparent 
- ✅ **SEO & AI Friendly** - robots.txt, structured data, semantic indexing
- ✅ **CDN Hosted** - GitHub Pages for fast global access
- ✅ **Custom Domain Ready** - Easy white-labeling

---

## 🚀 Quick Start

### For AI Systems & LLMs

Discover agents via the API:

```bash
# Get all agents (English)
curl https://sperax.click/index.json

# Get agents in any language
curl https://sperax.click/index.zh-CN.json

# Get agent manifest for indexing
curl https://sperax.click/agents-manifest.json
```

[Complete API Documentation →](./docs/API.md)

### For Users

Add agents to your AI platform:

```
https://sperax.click/index.json
```

Or with language:

```
https://sperax.click/index.{locale}.json
```

### For Developers

```bash
git clone https://github.com/nirholas/defi-agents.git
cd defi-agents
bun install
bun run format
bun run build
```

[Complete Development Workflow Guide →](./docs/WORKFLOW.md)

---

## 📦 Agent Categories

### 🌟 Featured Agent

**🎯 Sperax Portfolio** - All-in-one crypto portfolio management ⭐ **RECOMMENDED**

- Complete portfolio tracking, trading automation, DeFi protocols, and analytics
- ONE agent for 100% of portfolio management features
- Perfect for most users - install once, access everything

⚠️ **Current Status:** Read-only portfolio tracking and analytics available now. Automated trading, bots, and DeFi interactions coming soon in SperaxOS roadmap.

[View Agent →](https://sperax.click/sperax-portfolio.json) | [Try Now →](https://sperax.fun/discover/assistant/sperax-portfolio)

---

### 🪙 DeFi & Crypto (42 Specialized Agents)

**Sperax Ecosystem (8 Agents):**

**Master Agent (Recommended):**

- **Sperax Portfolio** 🎯 - All-in-one portfolio management (dashboard, trading, bots, DeFi, analytics)

**Original Sperax Agents (7):**

- USDs Stablecoin Expert, SPA Tokenomics Analyst, veSPA Lock Optimizer
- Governance Guide, Liquidity Strategist, Bridge Assistant, Yield Aggregator

**SperaxOS Portfolio Specialists (16):**
💡 _For advanced users who prefer focused tools_

- Portfolio Dashboard, Assets Tracker, Analytics Expert, Wallet Manager
- Trading Assistant, AI Trading Bot, Signal Bot, DCA Bot
- Arbitrage Bot, Pump Screener, DeFi Center, DeFi Protocols
- Strategies Marketplace, Bot Templates, Settings Manager, Help Center

> **Note:** SperaxOS portfolio agents currently use `sperax.fun` for testing. The domain may change to `sperax.io` or similar once SperaxOS launches in production. [See FAQ](./docs/FAQ.md#sperax-portfolio-agents) for details.

**General DeFi (34 Agents) + Crypto News:**

- Yield Farming Optimizer, Impermanent Loss Calculator, Gas Optimizer
- Smart Contract Auditor, MEV Protection Advisor, Whale Watcher
- Protocol Comparator, Token Unlock Tracker, Liquidation Risk Manager
- Airdrop Hunter, Alpha Leak Detector, APY vs APR Educator
- Bridge Security Analyst, Crypto Tax Strategist, DeFi Insurance Advisor
- DeFi Onboarding Mentor, DeFi Protocol Comparator, DeFi Risk Scoring Engine
- DEX Aggregator Optimizer, Governance Proposal Analyst, Layer 2 Comparison Guide
- Liquidation Risk Manager, Liquidity Pool Analyzer, Narrative Trend Analyst
- NFT Liquidity Advisor, Portfolio Rebalancing Advisor, Protocol Revenue Analyst
- Protocol Treasury Analyst, Stablecoin Comparator, Staking Rewards Calculator
- Wallet Security Advisor, Yield Dashboard Builder, Yield Sustainability Analyst

[View Full Agent List →](https://nirholas.github.io/AI-Agents-Library/)

---

## 🤝 Agent Teams

Create collaborative teams of specialized agents that work together on complex tasks.

**Example Team - DeFi Strategy:**

```
- Yield Optimizer (finds opportunities)
- Risk Assessment Agent (evaluates safety)
- Portfolio Tracker (monitors performance)
- Gas Optimizer (minimizes costs)
```

The host agent coordinates discussion, ensuring each specialist contributes their expertise while building toward a comprehensive solution.

[Read Teams Guide →](./docs/TEAMS.md)

---

## 🌍 Multi-Language Support

All agents automatically available in 30+ languages:

🇺🇸 English・🇨🇳 简体中文・🇹🇼 繁體中文・🇯🇵 日本語・🇰🇷 한국어・🇩🇪 Deutsch・🇫🇷 Français・🇪🇸 Español・🇷🇺 Русский・🇸🇦 العربية・🇵🇹 Português・🇮🇹 Italiano・🇳🇱 Nederlands・🇵🇱 Polski・🇻🇳 Tiếng Việt・🇹🇷 Türkçe・🇸🇪 Svenska・🇮🇩 Bahasa Indonesia

---

## 🛠️ API Reference

### Endpoints

```bash
# Main index (all agents)
GET https://nirholas.github.io/AI-Agents-Library/index.json

# Individual agent (English)
GET https://nirholas.github.io/AI-Agents-Library/{agent-id}.json

# Localized agent
GET https://nirholas.github.io/AI-Agents-Library/{agent-id}.zh-CN.json

# Language-specific index
GET https://nirholas.github.io/AI-Agents-Library/index.zh-CN.json
```

### Quick Integration

```javascript
// Load all agents
const response = await fetch('https://nirholas.github.io/AI-Agents-Library/index.json');
const { agents } = await response.json();

// Load specific agent
const agent = await fetch(`https://nirholas.github.io/AI-Agents-Library/defi-yield-optimizer.json`);
const agentConfig = await agent.json();
```

[Full API Documentation →](./docs/API.md)

---

## 🤖 Contributing an Agent

We welcome contributions! Submit your agent to expand the library.

### Quick Submit

1. **Fork this repository**
2. **Create your agent** in `src/your-agent-name.json`

```json
{
  "author": "your-github-username",
  "config": {
    "systemRole": "You are a [role] with expertise in [domain]..."
  },
  "identifier": "your-agent-name",
  "meta": {
    "title": "Agent Title",
    "description": "Clear, concise description",
    "avatar": "🤖",
    "tags": ["category", "functionality", "domain"]
  },
  "schemaVersion": 1
}
```

3. **Submit a Pull Request**

Our automated workflow will translate your agent to 30+ languages and deploy it globally.

### Quality Guidelines

✅ Clear purpose - solves a specific problem\
✅ Well-structured prompts - comprehensive but focused\
✅ Appropriate tags - aids discovery\
✅ Tested - verified functionality

[Full Contributing Guide →](./docs/CONTRIBUTING.md)

---

## 📖 Documentation

### For Users

- [Agent Teams Guide](./docs/TEAMS.md) - Multi-agent collaboration
- [FAQ](./docs/FAQ.md) - Common questions
- [Examples](./docs/EXAMPLES.md) - Real-world use cases

### For Developers

- [Complete Workflow Guide](./docs/WORKFLOW.md) - End-to-end development process
- [Contributing Guide](./docs/CONTRIBUTING.md) - How to submit agents
- [API Reference](./docs/API.md) - Complete API documentation
- [Agent Creation Guide](./docs/AGENT_GUIDE.md) - Design effective agents
- [18 Languages i18n Workflow](./docs/I18N_WORKFLOW.md) - Automated translation system
- [Deployment Guide](./docs/DEPLOYMENT.md) - Domain setup and CI/CD
- [Prompt Engineering](./docs/PROMPTS.md) - Writing better prompts
- [Model Parameters](./docs/MODELS.md) - Temperature, top_p explained
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues

---

## 🚀 Deployment

### GitHub Pages (Automatic)

1. **Fork/Clone this repository**
2. **Choose your domain option:**
   - **Default GitHub Pages:** Delete the `CNAME` file
   - **Custom Domain:** Update `CNAME` with your domain
3. **Enable GitHub Pages:**
   - Settings → Pages → Source: `gh-pages` branch
4. **Push to main** - GitHub Actions automatically builds and deploys

Your agents will be at:

- Default: `https://[username].github.io/[repository]/index.json`
- Custom: `https://yourdomain.com/index.json`

### Custom Domain Setup

1. **Update CNAME file:** `echo "yourdomain.com" > CNAME`
2. **Configure DNS:** Add CNAME record → `[username].github.io`
3. **Enable HTTPS** in repository settings after DNS propagates

**Note:** The build process automatically copies your CNAME to the deployment, so your custom domain persists across all deployments. Forks can simply update or delete the CNAME file.

[Full Deployment Guide →](./docs/DEPLOYMENT.md)

---

## 🔧 Development Tools

### Split Agent Batches

```bash
node split-agents.cjs
```

Converts batch JSON into individual agent files.

### Emoji Converter

```bash
node emoji-converter.cjs
```

Converts emoji URLs to native Unicode.

---

## 🌐 Integration Examples

### Custom Application

```javascript
// Fetch agents
const agents = await fetch('https://nirholas.github.io/AI-Agents-Library/index.json').then((r) =>
  r.json(),
);

// Use with your AI model
const systemPrompt = agents.agents[0].config.systemRole;
```

### Python

```python
import requests

# Load agents
response = requests.get('https://nirholas.github.io/AI-Agents-Library/index.json')
agents = response.json()['agents']

# Filter by tag
defi_agents = [a for a in agents if 'defi' in a['meta']['tags']]
```

---

## 🔐 Security & Privacy

- **No data collection** - Static JSON index, zero tracking
- **Agents run locally** - Execute in your AI platform's environment
- **Open source** - Full transparency, audit every line
- **No external calls** - Pure JSON configuration files

---

## 📊 Stats

- **42 Agents** - DeFi-focused coverage
- **18 Languages** - Global accessibility via automated translation
- **8 Sperax Specialists** - Ecosystem-specific agents (7 core + 1 portfolio master)
- **34 General DeFi Agents** - Comprehensive DeFi toolkit
- **\~300 KB Index** - Fast loading (gzipped: \~65 KB)
- **80-120ms** - Global CDN delivery
- **0 Vendor Lock-in** - True interoperability

---

## 🔗 Projects Building with AI Agents Library 🤍

- **SperaxOS** - [Application Branch](https://github.com/nirholas/AI-Agents-Library/tree/speraxos)

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

**Open Source • Open Format • Open Future**

---

<!-- AWESOME PROMPTS -->

### [Sperax Portfolio](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-portfolio.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

All-in-one cryptocurrency portfolio management: tracking, trading, automation, DeFi, and analytics

`portfolio` `trading` `defi` `analytics` `automation` `wallet` `bots` `sperax` `all-in-one` `master`

---

### [Crypto Whale Watcher](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/whale-watcher.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Track and analyze large wallet movements and whale behavior

`on-chain` `whale` `analytics` `trading` `monitoring`

---

### [Cross-Chain Bridge Security Analyst](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/bridge-security-analyst.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Evaluate bridge security and recommend safest cross-chain routes

`bridge` `security` `cross-chain` `risk` `multichain`

---

### [Token Unlock Schedule Tracker](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/token-unlock-tracker.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Monitor and analyze token unlock events and their market impact

`tokenomics` `unlocks` `vesting` `supply` `analysis`

---

### [veSPA Lock Optimizer](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/vespa-optimizer.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Maximize returns through optimal veSPA locking strategies

`sperax` `vespa` `staking` `optimization` `voting-power`

---

### [Sperax Portfolio Tracker](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-portfolio-tracker.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Track and analyze your complete Sperax ecosystem holdings

`sperax` `portfolio` `tracking` `analytics` `dashboard`

---

### [DeFi Insurance & Risk Coverage Advisor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/defi-insurance-advisor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Navigate DeFi insurance options for smart contract protection

`insurance` `protection` `risk` `coverage` `safety`

---

### [NFT Liquidity & Lending Advisor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/nft-liquidity-advisor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Navigate NFT-backed lending and liquidity solutions

`nft` `liquidity` `lending` `collateral` `defi`

---

### [USDs Stablecoin Expert](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/usds-stablecoin-expert.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Specialist in Sperax USDs mechanism, collateralization, and yield strategies

`sperax` `stablecoin` `usds` `defi` `yield`

---

### [DEX Aggregator Route Optimizer](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/dex-aggregator-optimizer.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Find optimal swap routes across DEX aggregators

`dex` `swap` `routing` `aggregator` `optimization`

---

### [Crypto Tax Strategy Advisor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/crypto-tax-strategist.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Optimize crypto taxes and provide tax-efficient DeFi strategies

`tax` `strategy` `accounting` `optimization` `compliance`

---

### [Smart Contract Security Auditor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/smart-contract-auditor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Review and assess smart contract security for DeFi protocols

`security` `smart-contracts` `audit` `solidity` `risk`

---

### [Sperax Yield Aggregator](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-yield-aggregator.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Find and optimize best yield opportunities in Sperax ecosystem

`sperax` `yield` `farming` `optimization` `apy`

---

### [Personal DeFi Dashboard Builder](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/yield-dashboard-builder.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Design and track your custom DeFi portfolio dashboard

`dashboard` `tracking` `portfolio` `analytics` `monitoring`

---

### [Crypto Wallet Security Advisor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/wallet-security-advisor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Best practices for securing crypto wallets and assets

`security` `wallet` `safety` `best-practices` `hardware`

---

### [DeFi Yield Sustainability Analyst](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/yield-sustainability-analyst.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Analyze whether high yields are sustainable or temporary

`defi` `yield` `sustainability` `analysis` `tokenomics`

---

### [Stablecoin Deep Comparator](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/stablecoin-comparator.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Compare stablecoin mechanisms, risks, and use cases

`stablecoin` `usdc` `dai` `usdt` `comparison`

---

### [DeFi Portfolio Rebalancing Advisor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/portfolio-rebalancing-advisor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Optimize portfolio allocation and rebalancing strategies

`portfolio` `rebalancing` `allocation` `strategy` `optimization`

---

### [Sperax Ecosystem Onboarding Guide](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-onboarding-guide.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Help newcomers understand and start using Sperax protocol

`sperax` `education` `onboarding` `beginner` `tutorial`

---

### [DeFi Yield Farming Strategist](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/defi-yield-farmer.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Identify and optimize yield farming opportunities across DeFi protocols

`defi` `yield-farming` `apy` `strategy` `optimization`

---

### [Sperax Governance Guide](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-governance-guide.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Navigate Sperax DAO proposals, voting, and protocol upgrades

`sperax` `governance` `dao` `voting` `proposals`

---

### [DeFi Protocol Comparison Expert](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/defi-protocol-comparator.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Compare similar DeFi protocols across features, risks, and yields

`defi` `comparison` `protocols` `analysis` `research`

---

### [DeFi Beginner Onboarding Mentor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/defi-onboarding-mentor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Guide complete beginners through their first DeFi experiences

`education` `beginner` `onboarding` `tutorial` `defi-basics`

---

### [APY vs APR Educator](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/apy-vs-apr-educator.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Explain and calculate the difference between APY and APR in DeFi

`defi` `education` `apy` `apr` `yields`

---

### [Protocol Revenue & Fundamentals Analyst](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/protocol-revenue-analyst.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Analyze DeFi protocol business models and revenue generation

`defi` `revenue` `analysis` `fundamentals` `tokenomics`

---

### [DAO Governance Proposal Analyst](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/governance-proposal-analyst.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Analyze and explain DAO governance proposals and their implications

`governance` `dao` `voting` `proposals` `analysis`

---

### [Impermanent Loss Calculator](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/impermanent-loss-calculator.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Calculate and explain impermanent loss scenarios for LP positions

`defi` `liquidity` `impermanent-loss` `calculator` `amm`

---

### [DAO Treasury & Resource Analyst](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/protocol-treasury-analyst.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Analyze DAO treasury holdings, runway, and capital allocation

`treasury` `dao` `capital` `runway` `allocation`

---

### [Liquidation Risk Manager](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/liquidation-risk-manager.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Monitor and manage liquidation risks in lending protocols

`lending` `liquidation` `risk` `collateral` `defi`

---

### [Crypto Narrative & Trend Analyst](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/narrative-trend-analyst.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Track and analyze dominant narratives and trends in crypto markets

`narrative` `trends` `analysis` `sentiment` `market-cycles`

---

### [Sperax Protocol Risk Monitor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-risk-monitor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Track and analyze security risks across Sperax smart contracts

`sperax` `security` `risk` `audit` `monitoring`

---

### [Liquidity Pool Deep Analyzer](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/liquidity-pool-analyzer.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Analyze LP pool health, risks, and optimal entry/exit timing

`defi` `liquidity-pools` `amm` `analysis` `risk`

---

### [SPA Tokenomics Analyst](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/spa-tokenomics-analyst.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Expert in SPA token economics, staking rewards, and protocol revenue

`sperax` `spa` `tokenomics` `staking` `governance`

---

### [Gas Cost Optimization Expert](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/gas-optimization-expert.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Minimize gas costs and optimize transaction timing

`ethereum` `gas` `optimization` `layer-2` `efficiency`

---

### [Crypto Alpha & Signal Detector](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/alpha-leak-detector.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Identify trading alpha and early signals in DeFi markets

`alpha` `trading` `signals` `research` `opportunities`

---

### [MEV Protection Advisor](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/mev-protection-advisor.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Protect users from front-running, sandwich attacks, and MEV exploitation

`mev` `security` `front-running` `flashbots` `protection`

---

### [Sperax Liquidity Provider Strategist](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-liquidity-strategist.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Optimize liquidity provision strategies across Sperax pools

`sperax` `liquidity` `amm` `yield-farming` `impermanent-loss`

---

### [Sperax Bridge Assistant](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/sperax-bridge-assistant.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Guide users through cross-chain bridging with optimal routes and costs

`sperax` `bridge` `cross-chain` `arbitrum` `layer-2`

---

### [Staking Rewards Calculator](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/staking-rewards-calculator.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Calculate and optimize staking rewards across protocols

`staking` `rewards` `calculator` `pos` `yields`

---

### [DeFi Protocol Risk Scoring Engine](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/defi-risk-scoring-engine.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Comprehensive risk assessment framework for DeFi protocols

`risk` `assessment` `scoring` `analysis` `framework`

---

### [DeFi Airdrop Hunter](https://github.com/nirholas/bnb-chain-toolkit/blob/main/agents/defi-agents/src/airdrop-hunter.json)

<sup>By **[@sperax](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Identify and strategize for potential protocol airdrops

`airdrop` `rewards` `strategy` `farming` `allocation`

---

## 🌐 Live HTTP Deployment

**DeFi Agents** is deployed and accessible over HTTP via [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport — no local installation required.

**Endpoint:**
```
https://modelcontextprotocol.name/mcp/defi-agents
```

### Connect from any MCP Client

Add to your MCP client configuration (Claude Desktop, Cursor, SperaxOS, etc.):

```json
{
  "mcpServers": {
    "defi-agents": {
      "type": "http",
      "url": "https://modelcontextprotocol.name/mcp/defi-agents"
    }
  }
}
```

### Available Tools (10)

| Tool | Description |
|------|-------------|
| `get_price` | Get crypto prices |
| `get_market_overview` | Market overview |
| `get_trending` | Trending coins |
| `search_coins` | Search |
| `get_coin_detail` | Coin details |
| `get_global_stats` | Global stats |
| `get_defi_protocols` | DeFi protocols by TVL |
| `get_protocol_detail` | Protocol detail |
| `get_chain_tvl` | Chain TVL |
| `get_yield_opportunities` | Yield opportunities |

### Example Requests

**Get crypto prices:**
```bash
curl -X POST https://modelcontextprotocol.name/mcp/defi-agents \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_price","arguments":{"ids":"aave,compound-governance-token","vs_currencies":"usd"}}}'
```

**Market overview:**
```bash
curl -X POST https://modelcontextprotocol.name/mcp/defi-agents \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_market_overview","arguments":{"limit":10}}}'
```

**Trending coins:**
```bash
curl -X POST https://modelcontextprotocol.name/mcp/defi-agents \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_trending","arguments":{}}}'
```

### List All Tools

```bash
curl -X POST https://modelcontextprotocol.name/mcp/defi-agents \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Also Available On

- **[SperaxOS](https://speraxos.vercel.app)** — Browse and install from the [MCP marketplace](https://speraxos.vercel.app/community/mcp)
- **All 27 MCP servers** — See the full catalog at [modelcontextprotocol.name](https://modelcontextprotocol.name)

> Powered by [modelcontextprotocol.name](https://modelcontextprotocol.name) — the open MCP HTTP gateway
