# Getting Started

> Register your first ERC-8004 agent in under 2 minutes.

---

## What You'll Need

- A Web3 wallet (MetaMask, Rabby, or any injected wallet)
- Some test BNB for gas fees (free from [BNB Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet))
- That's it. No installations, no dependencies, no build tools.

## Step 1: Open the App

Visit **[erc8004.agency](https://erc8004.agency/)** in your browser.

You can also:
```bash
# Clone and open locally
git clone https://github.com/nirholas/erc8004-agent-creator.git
open erc8004-agent-creator/index.html
```

## Step 2: Get Testnet BNB

Before registering, get free test BNB:

1. Visit the [BNB Chain Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)
2. Enter your wallet address
3. Receive free tBNB (enough for ~100+ registrations)

> **Tip:** Always test on BSC Testnet first before using mainnet.

## Step 3: Connect Your Wallet

1. Click **"Connect Wallet"** in the top-right corner
2. Approve the connection in MetaMask
3. The app will automatically switch you to BSC Testnet

## Step 4: Fill In Agent Details

### Agent Identity (Step 1 of 4)
- **Agent Name** — A short, memorable name (e.g., "DeFi Yield Optimizer")
- **Description** — What your agent does, how it works, and how to interact with it
- **Image URL** — Optional avatar/logo (PNG, SVG, or IPFS link)

### Services & Endpoints (Step 2 of 4)
Add at least one service endpoint. These tell other agents how to reach yours:

| Service Type | Example Endpoint | Use Case |
|---|---|---|
| **Web** | `https://myagent.com/` | General web interface |
| **A2A** | `https://myagent.com/.well-known/agent-card.json` | Agent-to-Agent protocol |
| **MCP** | `https://mcp.myagent.com/` | Model Context Protocol |
| **OASF** | `ipfs://Qm...` | Open Agent Service Format |
| **ENS** | `myagent.eth` | Ethereum Name Service |
| **DID** | `did:web:myagent.com` | Decentralized Identifier |

### Configuration (Step 3 of 4)
- **Trust Models** — Select which trust mechanisms your agent supports
- **x402 Payment** — Enable if your agent supports HTTP 402 payments
- **URI Storage** — Choose where to store your agent's registration data
- **Custom Metadata** — Add key-value pairs stored on-chain

### Review & Deploy (Step 4 of 4)
- Review the generated JSON
- See the estimated gas cost
- Click **"Register Agent On-Chain"**
- Approve the transaction in MetaMask

## Step 5: You're Done!

After confirmation (~3 seconds on BSC), you'll see:
- Your **Agent ID** — a unique number
- The **transaction hash** — view on BscScan
- Your agent is now an **ERC-721 NFT** in your wallet

## What's Next?

- **View your agents** — Switch to the "My Agents" tab
- **Register on mainnet** — Switch to "BSC Mainnet" (costs real BNB)
- **Build integrations** — See [Integration Guide](integration.md)
- **Share your agent** — The NFT is visible on BscScan and NFT marketplaces

## Quick Reference

| Action | Where |
|---|---|
| Register an agent | [erc8004.agency](https://erc8004.agency/) |
| Get testnet BNB | [BNB Faucet](https://www.bnbchain.org/en/testnet-faucet) |
| View contracts | [Contract Addresses](contracts.md) |
| Read the spec | [8004.org](https://www.8004.org) |

## Need Help?

- Check [Troubleshooting](troubleshooting.md) for common issues
- Read the [FAQ](faq.md)
- Open an issue on [GitHub](https://github.com/nirholas/erc8004-agent-creator/issues)

---

*See also: [What is ERC-8004?](what-is-erc8004.md) · [Examples](examples.md) · [Architecture](architecture.md)*
