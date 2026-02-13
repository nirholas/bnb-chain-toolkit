# Frequently Asked Questions

> Common questions about ERC-8004 and the Agent Creator.

---

## General

<details>
<summary><strong>What is ERC-8004?</strong></summary>

ERC-8004 is an Ethereum standard (EIP) for trustless agent identity. It defines three on-chain registries — Identity, Reputation, and Validation — that enable AI agents to discover, interact with, and trust each other across organizational boundaries without intermediaries.

Each registered agent gets an ERC-721 NFT identity that's portable, transferable, and censorship-resistant.

→ [Read more: What is ERC-8004?](what-is-erc8004.md)
</details>

<details>
<summary><strong>Do I need to know how to code?</strong></summary>

**No.** The [Agent Creator](https://erc8004.agency/) is a visual wizard — just fill in a form and click Deploy. You do need a Web3 wallet (MetaMask) and some BNB for gas fees.

If you want to register agents programmatically, see the [Integration Guide](integration.md).
</details>

<details>
<summary><strong>Is it free?</strong></summary>

The tool itself is free and open-source. Registration costs a small gas fee:
- **BSC Testnet:** Free (use [faucet](https://www.bnbchain.org/en/testnet-faucet) for tBNB)
- **BSC Mainnet:** ~0.001-0.005 BNB (~$0.30-$1.50)
- **Ethereum Mainnet:** ~0.001-0.01 ETH (varies with gas prices)
</details>

<details>
<summary><strong>Which wallets are supported?</strong></summary>

Any Web3 wallet that supports the Ethereum provider API:
- MetaMask
- Rabby
- Coinbase Wallet
- Trust Wallet (browser)
- WalletConnect (coming soon)
- Any injected `window.ethereum` provider
</details>

<details>
<summary><strong>Which blockchains are supported?</strong></summary>

Currently deployed and available in the UI:
- **BNB Smart Chain Testnet** (Chain ID: 97)
- **BNB Smart Chain Mainnet** (Chain ID: 56)

Also deployed (can be added):
- Ethereum Mainnet (Chain ID: 1)
- Ethereum Sepolia (Chain ID: 11155111)

The contracts use deterministic CREATE2 addresses and can be deployed to **any EVM-compatible chain**.

→ [See all addresses: Contract Addresses](contracts.md)
</details>

---

## Security

<details>
<summary><strong>Is it safe to use?</strong></summary>

Yes. The tool:
- **Never touches your private keys** — all transactions are signed in your wallet
- **Has no backend** — it's a static HTML file
- **Is open-source** — [verify the code yourself](https://github.com/nirholas/erc8004-agent-creator)
- **Uses audited contracts** — built on OpenZeppelin's ERC-721 implementation

The only blockchain interaction is calling `register()` on the ERC-8004 IdentityRegistry contract.
</details>

<details>
<summary><strong>Does it store my data?</strong></summary>

**No.** The tool has no server, no database, no analytics, and no tracking. Everything happens between your browser and the blockchain.

Your agent registration data is stored either:
- On-chain (in the smart contract)
- On IPFS (if you choose IPFS storage)
- On your web server (if you choose HTTPS storage)
</details>

<details>
<summary><strong>Can someone steal my agent NFT?</strong></summary>

Only if they have access to your wallet. The agent NFT is a standard ERC-721 token — it follows the same security model as any other NFT. Only the token owner can:
- Transfer the NFT
- Update the agent URI
- Set metadata
</details>

---

## Technical

<details>
<summary><strong>What is the MetadataEntry struct?</strong></summary>

```solidity
struct MetadataEntry {
    string metadataKey;    // The key (e.g., "category")
    bytes metadataValue;   // The value as bytes (e.g., encoded "DeFi")
}
```

In JavaScript, you encode values as:
```javascript
const entry = {
  metadataKey: "category",
  metadataValue: ethers.toUtf8Bytes("DeFi")
};
```
</details>

<details>
<summary><strong>What's the difference between tokenURI and agentURI?</strong></summary>

They're the same thing. `tokenURI()` is the standard ERC-721 function. In ERC-8004, this returns the agent's registration JSON (or a URI pointing to it). `setAgentURI()` is the ERC-8004-specific setter function.
</details>

<details>
<summary><strong>How does on-chain storage work?</strong></summary>

When you select "On-Chain (Base64)", the registration JSON is encoded as:
```
data:application/json;base64,eyJ0eXBlIjoiaHR0cHM6Ly9laXBz...
```

This data URI is stored in the contract's token URI storage. It's slightly more expensive gas-wise (~50-100k gas extra) but requires no external hosting.
</details>

<details>
<summary><strong>Can I update my agent after registration?</strong></summary>

Yes! As the NFT owner, you can:
```javascript
// Update the agent URI
await registry.setAgentURI(agentId, newUri);

// Update metadata
await registry.setMetadata(agentId, "category", ethers.toUtf8Bytes("new-category"));
```

Both emit events (`URIUpdated`, `MetadataSet`) so indexers can track changes.
</details>

<details>
<summary><strong>What are the gas costs?</strong></summary>

Approximate costs on BSC (gas price ~3 gwei):

| Operation | Gas | Cost (BSC) |
|---|---|---|
| `register()` (no URI) | ~150,000 | ~$0.15 |
| `register(string)` (short URI) | ~200,000 | ~$0.20 |
| `register(string)` (on-chain JSON) | ~300,000 | ~$0.30 |
| `register(string, metadata[])` | ~350,000+ | ~$0.35+ |
| `setAgentURI()` | ~50,000 | ~$0.05 |
| `setMetadata()` | ~50,000 | ~$0.05 |
</details>

---

## Troubleshooting

<details>
<summary><strong>MetaMask won't connect</strong></summary>

1. Make sure MetaMask is unlocked
2. Refresh the page
3. Check if another dApp is blocking the connection
4. Try disconnecting all sites in MetaMask → Settings → Connected Sites
</details>

<details>
<summary><strong>Transaction fails or reverts</strong></summary>

Common causes:
- **Insufficient gas** — increase gas limit in MetaMask
- **Wrong network** — make sure you're on BSC Testnet (chain ID 97)
- **No tBNB** — get free tBNB from the [faucet](https://www.bnbchain.org/en/testnet-faucet)
- **Contract paused** — check BscScan for contract status
</details>

<details>
<summary><strong>My agents don't show in the dashboard</strong></summary>

The dashboard scans recent blocks (last ~5000) for Transfer events. If your agent was registered long ago, it may not appear. You can:
1. Click "Refresh" to re-scan
2. Check [BscScan](https://testnet.bscscan.com) directly for your NFTs
3. Your `balanceOf` count will still be accurate
</details>

<details>
<summary><strong>The page is blank / ethers.js won't load</strong></summary>

1. Check your internet connection
2. Make sure you're not blocking CDN scripts (ad blockers, corporate firewalls)
3. Try opening directly from a local file: `open index.html`
4. Check the browser console for errors
</details>

---

## Contributing

<details>
<summary><strong>How can I contribute?</strong></summary>

1. Fork the [repository](https://github.com/nirholas/erc8004-agent-creator)
2. Make your changes
3. Submit a pull request

We welcome contributions for:
- New network support
- UI improvements
- Documentation
- Bug fixes
- Translations
</details>

<details>
<summary><strong>How do I add a new network?</strong></summary>

Add an entry to the `NETWORKS` object in `index.html`:

```javascript
NETWORKS.arbitrum = {
  name: 'Arbitrum One',
  chainId: 42161,
  chainIdHex: '0xa4b1',
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  explorer: 'https://arbiscan.io',
  currency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  contracts: {
    identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
    validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272'
  },
  agentRegistry: 'eip155:42161:0x8004A818BFB912233c491871b3d84c89A494BD9e'
};
```

Then add a button in the network bar HTML.
</details>

---

## See Also

- [What is ERC-8004?](what-is-erc8004.md) — Plain-English overview
- [Troubleshooting](troubleshooting.md) — Detailed fixes
- [Getting Started](getting-started.md) — First-time guide
