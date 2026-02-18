<div align="center">

<img src="header.svg" alt="ERC-8004 Agent Creator" width="800" />

<br>

<br>

<a href="https://github.com/nirholas/erc8004-agent-creator/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache_2.0-blue.svg?style=for-the-badge&labelColor=000" alt="Apache 2.0 License" /></a>
<a href="https://github.com/nirholas/erc8004-agent-creator/stargazers"><img src="https://img.shields.io/github/stars/nirholas/erc8004-agent-creator?style=for-the-badge&logo=github&color=yellow&labelColor=000" alt="Stars" /></a>
<a href="https://github.com/nirholas/erc8004-agent-creator/network/members"><img src="https://img.shields.io/github/forks/nirholas/erc8004-agent-creator?style=for-the-badge&logo=github&color=purple&labelColor=000" alt="Forks" /></a>
<a href="https://github.com/nirholas/erc8004-agent-creator/issues"><img src="https://img.shields.io/github/issues/nirholas/erc8004-agent-creator?style=for-the-badge&labelColor=000" alt="Issues" /></a>
<a href="https://github.com/nirholas/erc8004-agent-creator"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&labelColor=000" alt="PRs Welcome" /></a>
<a href="https://erc8004.agency/"><img src="https://img.shields.io/badge/app-live-00C853?style=for-the-badge&logo=vercel&labelColor=000" alt="Live App" /></a>

<br>

<img src="https://img.shields.io/badge/build-none_needed-F0B90B?style=for-the-badge&labelColor=000" alt="Zero Build" />
<img src="https://img.shields.io/badge/deps-zero-7C3AED?style=for-the-badge&labelColor=000" alt="Zero Deps" />
<img src="https://img.shields.io/badge/file-1_HTML-00B4D8?style=for-the-badge&labelColor=000" alt="Single File" />
<img src="https://img.shields.io/badge/chains-24_EVM-22C55E?style=for-the-badge&labelColor=000" alt="24 Chains" />
<img src="https://img.shields.io/badge/standard-ERC--8004-FF6B6B?style=for-the-badge&labelColor=000" alt="ERC-8004" />

<br><br>

<a href="https://erc8004.agency/"><b>▶ Launch App</b></a> · 
<a href="#-quick-start">Quick Start</a> · 
<a href="#-what-is-erc-8004">What Is ERC-8004?</a> · 
<a href="#-features">Features</a> · 
<a href="docs/">Docs</a> · 
<a href="#-supported-chains">Chains</a> · 
<a href="docs/faq.md">FAQ</a>

</div>

---

## 🧐 What Is ERC-8004?

**ERC-8004** gives AI agents a **portable, on-chain identity** — like a passport for the agent economy.

It's a standard for **discovering, choosing, and interacting with agents across organizational boundaries** without pre-existing trust. No API keys. No vendor lock-in. Just smart contracts.

**In plain English:** Your AI agent gets an NFT (ERC-721) that says who it is, what it can do, and where to reach it. Anyone can verify it on-chain. Forever.

> **New to Web3?** Start with our [What Is ERC-8004?](docs/what-is-erc8004.md) guide — written in plain English.

### Why ERC-8004?

| Problem | Solution |
|---------|----------|
| Agents can't prove who they are | **On-chain identity** via ERC-721 NFT |
| No standard way to discover agents | **Three registries** — Identity, Reputation, Validation |
| Trust requires centralized directories | **Trustless verification** on any EVM chain |
| Agent metadata disappears when hosts go down | **Immutable on-chain storage** (base64 data URIs) |
| No interoperability between agent protocols | **Multi-protocol** — A2A, MCP, OASF, ENS, DID |

---

## ⚡ Quick Start

**Option 1: Just use it** (recommended)

Visit **[erc8004.agency](https://erc8004.agency/)** → Connect wallet → Select chain → Create agent → Done.

**Option 2: Run locally**

```bash
git clone https://github.com/nirholas/erc8004-agent-creator.git
cd erc8004-agent-creator
open index.html
# That's literally it. No npm. No build. No config.
```

**Option 3: Self-host**

Drop `index.html` on Vercel, Netlify, GitHub Pages, IPFS, or any static host. One file.

> 📚 **Full setup guide:** [Getting Started](docs/getting-started.md)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔗 Multi-Chain & Wallet Support
- **24 EVM chains** — BSC, opBNB, Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche, Linea, Scroll, zkSync Era, Mantle, Fantom, Gnosis, Celo, Moonbeam
- Beautiful chain selector with family grouping & search
- EIP-6963 multi-wallet detection (MetaMask, Coinbase, Rainbow, Rabby, Brave)
- Testnet & mainnet with safety warnings
- One-click network switching

</td>
<td width="50%">

### 🧙 Step-by-Step Wizard
- Agent identity (name, description, image)
- Multi-service endpoints (A2A, MCP, OASF, ENS, DID)
- Trust model configuration
- x402 payment configuration
- Review & deploy with gas estimate
- On-chain metadata key-value editor with presets

</td>
</tr>
<tr>
<td width="50%">

### 📦 Storage & Export Options
- On-chain URI (base64 data URI — no hosting)
- IPFS and HTTPS support
- Export as raw JSON
- Export as `.well-known/agent-card.json`
- Copy CLI registration command
- Generate embeddable HTML badge

</td>
<td width="50%">

### 📊 Agent Dashboard & Analytics
- View all registered agents per chain
- Agent analytics (total agents, services, x402 status)
- Click-through agent detail modal
- Update agent URI (setURI flow)
- Direct block explorer links

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Search & Discovery
- Search agents by ID, name, or address
- Filter by service type (A2A, MCP, OASF, x402)
- View agent details with full metadata
- Browse agents registered on any chain

</td>
<td width="50%">

### ⭐ Reputation System
- View reputation scores for any agent
- Submit star ratings (1-5) with comments
- Reputation history timeline
- Average score & approval percentage

</td>
</tr>
<tr>
<td width="50%">

### 📋 Agent Templates
- **6 pre-built templates** — DeFi Trading, Customer Support, Code Review, Data Analysis, Content Creator, Research Assistant
- One-click auto-fill with sensible defaults
- Template gallery with descriptions
- Instant customization after applying

</td>
<td width="50%">

### 🚀 Batch Registration
- Register multiple agents in one session
- CSV and JSON file import
- Drag-and-drop file upload
- Progress tracker with per-agent status
- Format guide with examples

</td>
</tr>
<tr>
<td width="50%">

### 📱 QR Code & Identity
- Generate QR code for any agent's on-chain identity
- Scannable link to block explorer
- Downloadable PNG
- Shareable agent links

</td>
<td width="50%">

### 🎨 UI & UX
- **Dark/Light mode** toggle with persistent preference
- Responsive design for mobile & desktop
- Collapsible sections for progressive disclosure
- Transaction history with local storage
- Professional, uncluttered interface

</td>
</tr>
<tr>
<td width="50%">

### 💳 x402 Payment Support
- Configure x402 micropayment endpoints
- Set price per request
- Configure accepted tokens
- x402 badge on enabled agents

</td>
<td width="50%">

### 📜 Transaction History
- All past registrations & updates
- Per-chain filtering
- Block explorer links
- Gas usage tracking
- Timestamps & agent names

</td>
</tr>
</table>

---

## 🌐 Supported Chains

### Testnets

| Chain | Chain ID | Native Token | Faucet |
|-------|----------|-------------|--------|
| BSC Testnet | 97 | tBNB | [bnbchain.org](https://www.bnbchain.org/en/testnet-faucet) |
| Ethereum Sepolia | 11155111 | ETH | [sepoliafaucet.com](https://sepoliafaucet.com) |
| Base Sepolia | 84532 | ETH | [coinbase.com](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) |
| Arbitrum Sepolia | 421614 | ETH | — |
| Optimism Sepolia | 11155420 | ETH | — |
| Polygon Amoy | 80002 | POL | [faucet.polygon.technology](https://faucet.polygon.technology) |
| Avalanche Fuji | 43113 | AVAX | [faucet.avax.network](https://faucet.avax.network) |

### Mainnets

| Chain | Chain ID | Native Token | Explorer |
|-------|----------|-------------|----------|
| BSC Mainnet | 56 | BNB | [bscscan.com](https://bscscan.com) |
| Ethereum | 1 | ETH | [etherscan.io](https://etherscan.io) |
| Base | 8453 | ETH | [basescan.org](https://basescan.org) |
| Arbitrum One | 42161 | ETH | [arbiscan.io](https://arbiscan.io) |
| Optimism | 10 | ETH | [optimistic.etherscan.io](https://optimistic.etherscan.io) |
| Polygon | 137 | POL | [polygonscan.com](https://polygonscan.com) |
| Avalanche C-Chain | 43114 | AVAX | [snowtrace.io](https://snowtrace.io) |
| Linea | 59144 | ETH | [lineascan.build](https://lineascan.build) |
| Scroll | 534352 | ETH | [scrollscan.com](https://scrollscan.com) |
| zkSync Era | 324 | ETH | [explorer.zksync.io](https://explorer.zksync.io) |
| Mantle | 5000 | MNT | [explorer.mantle.xyz](https://explorer.mantle.xyz) |
| Fantom | 250 | FTM | [ftmscan.com](https://ftmscan.com) |
| Gnosis | 100 | xDAI | [gnosisscan.io](https://gnosisscan.io) |
| Celo | 42220 | CELO | [celoscan.io](https://celoscan.io) |
| Moonbeam | 1284 | GLMR | [moonbeam.moonscan.io](https://moonbeam.moonscan.io) |

---

## 📜 Contract Addresses

### Testnet Contracts (Shared across all testnets)

| Contract | Address |
|---|---|
| **IdentityRegistry** | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| **ReputationRegistry** | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| **ValidationRegistry** | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |

### Mainnet Contracts (Shared across all mainnets)

| Contract | Address |
|---|---|
| **IdentityRegistry** | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| **ReputationRegistry** | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

> All contracts use **CREATE2 vanity deployment** with `0x8004` prefix via the SAFE Singleton Factory, ensuring identical addresses across all chains.

---

## 🏗️ How It Works

```
┌──────────────────────────────────────────────────────────────┐
│                    ERC-8004 Agent Creator                     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 1. Agent  │→ │2. Service│→ │3. Config │→ │4. Deploy │    │
│  │ Identity  │  │Endpoints │  │  & Trust │  │ On-Chain │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│       │                                          │           │
│       ▼                                          ▼           │
│  Name, Desc,                              register() call    │
│  Image URL                                on IdentityRegistry│
│                                                │             │
│                                                ▼             │
│                                     ERC-721 NFT minted       │
│                                     to your wallet           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │ 24 EVM Chains · Templates · Batch · x402 · QR · ★  │     │
│  └─────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

1. **Select chain** — Choose from 24 EVM networks (testnets & mainnets)
2. **Connect wallet** — MetaMask, Coinbase, Rainbow, Rabby, or any EIP-6963 wallet
3. **Fill in agent details** — Or use a pre-built template
4. **Configure trust models** — Reputation, crypto-economic, TEE attestation, x402 payments
5. **Deploy on-chain** — Calls `register()` on the ERC-8004 IdentityRegistry
6. **Get your Agent ID** — An ERC-721 NFT minted to your address, with QR code

<details>
<summary><b>📄 Example registration JSON</b> — Click to expand</summary>

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "My AI Agent",
  "description": "An agent that does amazing things",
  "image": "https://example.com/avatar.png",
  "services": [
    {
      "name": "A2A",
      "endpoint": "https://agent.example/.well-known/agent-card.json",
      "version": "0.3.0"
    },
    {
      "name": "MCP",
      "endpoint": "https://mcp.agent.example/",
      "version": "2025-06-18"
    }
  ],
  "x402Support": true,
  "x402": {
    "paymentEndpoint": "https://pay.agent.example/x402",
    "pricePerRequest": "0.001",
    "acceptedTokens": ["USDC", "native"]
  },
  "active": true,
  "registrations": [
    {
      "agentId": 42,
      "agentRegistry": "eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

</details>

---

## 🛠️ Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| **Build system** | None | Just open the file |
| **Dependencies** | Zero | Nothing to install or update |
| **Framework** | Vanilla JS | No React, Vue, or Angular |
| **Blockchain** | Ethers.js v6 (CDN) | Industry standard, loaded on demand |
| **Fonts** | Inter + JetBrains Mono | Google Fonts CDN |
| **Styling** | CSS Custom Properties | Dark/Light mode theming |
| **File count** | 1 | Single `index.html` — that's the whole app |
| **Wallet detection** | EIP-6963 | Auto-discovers all injected wallets |
| **QR codes** | QR Server API | No library needed |

---

## 📖 Documentation

| Guide | For | Description |
|-------|-----|-------------|
| [What Is ERC-8004?](docs/what-is-erc8004.md) | Everyone | Plain-English explainer |
| [Getting Started](docs/getting-started.md) | Beginners | 5-minute first agent |
| [Architecture](docs/architecture.md) | Developers | Smart contract design |
| [Contracts](docs/contracts.md) | Developers | All deployed addresses (24 chains) |
| [Examples](docs/examples.md) | Everyone | Beginner → advanced recipes |
| [Tutorials](docs/tutorials.md) | Everyone | Step-by-step guides |
| [Integration](docs/integration.md) | Developers | Embed, iframe, React hook |
| [FAQ](docs/faq.md) | Everyone | Common questions |
| [Troubleshooting](docs/troubleshooting.md) | Everyone | Problem solving |

---

## 🔗 Links

| | |
|---|---|
| **▶ Live App** | [erc8004.agency](https://erc8004.agency/) |
| **📋 ERC-8004 Spec** | [8004.org](https://www.8004.org) |
| **📦 Contracts Repo** | [erc-8004/erc-8004-contracts](https://github.com/erc-8004/erc-8004-contracts) |
| **🌟 Awesome ERC-8004** | [awesome-erc8004](https://github.com/sudeepb02/awesome-erc8004) |
| **🧾 First Testnet TX** | [BscScan ↗](https://testnet.bscscan.com/tx/0xfc55d83d20e6d92ff522f302fd3424d3fd5557f25c06f4bfc38ecf3246dc1962) |

---

## 🤝 Contributing

Contributions welcome! Whether it's a bug fix, new feature, or documentation improvement.

1. Fork the repo
2. Create your branch: `git checkout -b feat/my-improvement`
3. Commit: `git commit -m "✨ feat: add amazing feature"`
4. Push: `git push origin feat/my-improvement`
5. [Open a Pull Request](https://github.com/nirholas/erc8004-agent-creator/pulls)

---

## 📄 License

Apache 2.0 © [nirholas](https://github.com/nirholas)

---

<p align="center">
  <b>Built with 🔶 for the agent economy</b><br>
  <sub>Zero deps · Single file · 24 chains · On-chain forever · ERC-8004 standard</sub>
</p>

<p align="center">
  <br>
  ⭐ <b>Found this useful? Star the repo!</b> ⭐<br>
  <sub>It helps others discover ERC-8004 and keeps development active</sub><br><br>
  <a href="https://github.com/nirholas/erc8004-agent-creator/stargazers">
    <img src="https://img.shields.io/github/stars/nirholas/erc8004-agent-creator?style=social" alt="Star on GitHub">
  </a>
</p>
