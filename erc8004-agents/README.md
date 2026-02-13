# ERC-8004 Agent Creator

> Create ERC-8004 Trustless Agents on BNB Smart Chain — dead simple.

A standalone, single-page application for registering AI agent identities on-chain using the [ERC-8004: Trustless Agents](https://www.8004.org) standard. Each agent gets a portable, censorship-resistant ERC-721 NFT identity, discoverable across the entire agent economy.

## What is ERC-8004?

ERC-8004 is a standard for **discovering, choosing, and interacting with agents across organizational boundaries** without pre-existing trust. It defines three on-chain registries:

- **Identity Registry** — ERC-721 agent identities (portable, browsable, transferable)
- **Reputation Registry** — Standardized feedback signals for trust
- **Validation Registry** — Hooks for validator smart contracts

## Features

- **One-click wallet connection** — MetaMask and any injected Web3 wallet
- **Step-by-step wizard** — Agent identity → Services → Configuration → Deploy
- **On-chain URI storage** — No hosting needed (base64 data URI)
- **IPFS & HTTPS support** — Bring your own hosting
- **Multi-service endpoints** — A2A, MCP, OASF, ENS, DID, email, web
- **Custom on-chain metadata** — Key-value pairs stored directly on-chain
- **Trust model configuration** — Reputation, crypto-economic, TEE attestation
- **Agent dashboard** — View your registered agents
- **BSC Testnet & Mainnet** — Switch networks instantly

## Contract Addresses

### BSC Testnet (Chain ID: 97)
| Contract | Address |
|---|---|
| **IdentityRegistry** | [`0x8004A818BFB912233c491871b3d84c89A494BD9e`](https://testnet.bscscan.com/address/0x8004A818BFB912233c491871b3d84c89A494BD9e) |
| **ReputationRegistry** | [`0x8004B663056A597Dffe9eCcC1965A193B7388713`](https://testnet.bscscan.com/address/0x8004B663056A597Dffe9eCcC1965A193B7388713) |
| **ValidationRegistry** | [`0x8004Cb1BF31DAf7788923b405b754f57acEB4272`](https://testnet.bscscan.com/address/0x8004Cb1BF31DAf7788923b405b754f57acEB4272) |

### BSC Mainnet (Chain ID: 56)
| Contract | Address |
|---|---|
| **IdentityRegistry** | [`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`](https://bscscan.com/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) |
| **ReputationRegistry** | [`0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`](https://bscscan.com/address/0x8004BAa17C55a88189AE136b182e5fdA19dE9b63) |

## Usage

### Option 1: Open directly
Just open `index.html` in a browser. That's it. No build step, no server, no dependencies.

```bash
open index.html
# or
python3 -m http.server 8080
# then visit http://localhost:8080
```

### Option 2: Deploy to any static host
Drop the `index.html` file on Vercel, Netlify, GitHub Pages, IPFS, or any static host.

### Option 3: Integrate into your app
The page is fully standalone — copy `index.html` into any project.

## How It Works

1. **Connect wallet** — MetaMask or any Web3 wallet
2. **Fill in agent details** — Name, description, image, services
3. **Configure trust models** — Reputation, crypto-economic, TEE
4. **Deploy on-chain** — Calls `register()` on the ERC-8004 IdentityRegistry
5. **Get your Agent ID** — An ERC-721 NFT minted to your address

The registration creates a JSON document following the ERC-8004 spec:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "My AI Agent",
  "description": "An agent that does amazing things",
  "image": "https://example.com/avatar.png",
  "services": [
    { "name": "A2A", "endpoint": "https://agent.example/.well-known/agent-card.json", "version": "0.3.0" },
    { "name": "MCP", "endpoint": "https://mcp.agent.example/", "version": "2025-06-18" }
  ],
  "active": true,
  "registrations": [
    { "agentId": 42, "agentRegistry": "eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e" }
  ],
  "supportedTrust": ["reputation"]
}
```

## Tech Stack

- **Zero dependencies** — Single HTML file, no build step
- **Ethers.js v6** — Loaded from CDN for wallet interaction
- **Inter + JetBrains Mono** — Google Fonts for typography
- **Vanilla JS** — No framework, no React, no Vue
- **CSS Custom Properties** — Themeable design system

## Links

- [ERC-8004 Specification](https://www.8004.org)
- [ERC-8004 Contracts](https://github.com/erc-8004/erc-8004-contracts)
- [BNB Chain AI Toolkit](https://bnbchaintoolkit.com)
- [Our BSC Testnet Deployment TX](https://testnet.bscscan.com/tx/0xfc55d83d20e6d92ff522f302fd3424d3fd5557f25c06f4bfc38ecf3246dc1962)

## License

MIT — Built by [nich](https://x.com/nichxbt) · [BNB Chain AI Toolkit](https://bnbchaintoolkit.com)
