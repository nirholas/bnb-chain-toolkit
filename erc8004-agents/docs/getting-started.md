# Getting Started

> Register your first ERC-8004 agent in under 2 minutes.

---

## What You'll Need

- A Web3 wallet (MetaMask, Rabby, Coinbase Wallet, Rainbow, or any EIP-6963 wallet)
- Some native tokens for gas fees (free from testnet faucets)
- That's it. No installations, no dependencies, no build tools.

## Step 1: Open the App

Visit **[erc8004.agency](https://erc8004.agency/)** in your browser.

You can also:
```bash
# Clone and open locally
git clone https://github.com/nirholas/erc8004-agent-creator.git
open erc8004-agent-creator/index.html
```

## Step 2: Choose Your Chain

Use the **chain selector dropdown** in the header to pick a network. For your first agent, we recommend a testnet:

| Chain | Token | Faucet |
|-------|-------|--------|
| BSC Testnet | tBNB | [bnbchain.org](https://www.bnbchain.org/en/testnet-faucet) |
| Ethereum Sepolia | ETH | [sepoliafaucet.com](https://sepoliafaucet.com) |
| Base Sepolia | ETH | [coinbase.com faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) |
| Polygon Amoy | POL | [faucet.polygon.technology](https://faucet.polygon.technology) |
| Avalanche Fuji | AVAX | [faucet.avax.network](https://faucet.avax.network) |

> **Tip:** The chain selector groups chains by family (BNB, Ethereum, L2s, Alt-L1s) and shows testnet/mainnet icons.

## Step 3: Get Testnet Tokens

Click the faucet link for your chosen testnet and claim free tokens. You only need a tiny amount for gas (~$0.01).

## Step 4: Connect Your Wallet

1. Click **"Connect Wallet"** in the top-right corner
2. If you have multiple wallets installed, the app detects them via **EIP-6963** — choose the one you want
3. Approve the connection in your wallet
4. The app will automatically switch you to the selected chain

## Step 5: Fill In Agent Details

### Use a Template (Fastest)

Switch to the **Templates** tab → Choose a pre-built template (DeFi Trading, Customer Support, Code Review, etc.) → Click "Use Template" → The form is auto-filled.

### Or Fill Manually

#### Agent Identity (Step 1 of 4)
- **Agent Name** — A short, memorable name (e.g., "DeFi Yield Optimizer")
- **Description** — What your agent does, how it works, and how to interact with it
- **Image URL** — Optional avatar/logo (PNG, SVG, or IPFS link)

#### Services & Endpoints (Step 2 of 4)
Add at least one service endpoint:

| Service Type | Example Endpoint | Use Case |
|---|---|---|
| **Web** | `https://myagent.com/` | General web interface |
| **A2A** | `https://myagent.com/.well-known/agent-card.json` | Agent-to-Agent protocol |
| **MCP** | `https://mcp.myagent.com/` | Model Context Protocol |
| **OASF** | `ipfs://Qm...` | Open Agent Service Format |
| **ENS** | `myagent.eth` | Ethereum Name Service |
| **DID** | `did:web:myagent.com` | Decentralized Identifier |

#### Configuration (Step 3 of 4)
- **Trust Models** — Select which trust mechanisms your agent supports
- **x402 Payment** — Enable if your agent supports HTTP 402 micropayments (set price, accepted tokens)
- **URI Storage** — Choose where to store your agent's registration data (on-chain, IPFS, or HTTPS)
- **Custom Metadata** — Add key-value pairs stored on-chain, with presets available

#### Review & Deploy (Step 4 of 4)
- Review the generated JSON
- See the estimated gas cost
- Click **"Register Agent On-Chain"**
- Approve the transaction in your wallet

## Step 6: You're Done!

After confirmation (speed varies by chain), you'll see:
- Your **Agent ID** — a unique NFT token ID
- The **transaction hash** — view on the block explorer
- Options to **generate a QR code**, **export JSON**, or **copy the badge HTML**
- Your agent is now an **ERC-721 NFT** in your wallet

## What's Next?

| Action | How |
|---|---|
| View your agents | Switch to the **My Agents** tab |
| Search for agents | Switch to the **Search** tab |
| Register on mainnet | Select a mainnet chain from the chain selector |
| Register multiple agents | Use the **Batch** tab with CSV or JSON import |
| Generate QR code | Click "QR Code" on any agent in your dashboard |
| Export agent data | Click "Export" for JSON, badge, or CLI command |
| Submit reputation | Find an agent → use the reputation form |
| View past transactions | Switch to the **History** tab |
| Switch theme | Click the 🌙/☀️ toggle in the header |

## Quick Reference

| Action | Where |
|---|---|
| Register an agent | [erc8004.agency](https://erc8004.agency/) |
| Get testnet tokens | See faucet table above |
| View contracts | [Contract Addresses](contracts.md) |
| Read the spec | [8004.org](https://www.8004.org) |
| Supported chains | 22 EVM chains (7 testnets + 15 mainnets) |

## Need Help?

- Check [Troubleshooting](troubleshooting.md) for common issues
- Read the [FAQ](faq.md)
- Open an issue on [GitHub](https://github.com/nirholas/erc8004-agent-creator/issues)

---

*See also: [What is ERC-8004?](what-is-erc8004.md) · [Examples](examples.md) · [Architecture](architecture.md)*
