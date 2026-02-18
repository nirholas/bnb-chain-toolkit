# Wallets Guide

Offline-capable wallet operations for BNB Chain and EVM networks.

> **New to crypto wallets?** A wallet is software that holds the keys to your crypto accounts. The wallet doesn't hold your coins — the blockchain does. The wallet holds the *keys* that prove ownership. See the [Glossary](GLOSSARY.md) for definitions of wallet, private key, seed phrase, and other terms.

---

## Ethereum Wallet Toolkit

**Location:** `wallets/ethereum-wallet-toolkit/`

A complete wallet utility that works offline. Fully compatible with BNB Smart Chain (BSC) and all EVM chains.

### Features

| Feature | Description | Needs Internet? |
|---------|-------------|:--------------:|
| HD Wallet Generation | Create wallets from seed phrases (BIP-39/44) | ❌ |
| Vanity Addresses | Generate addresses with custom prefixes | ❌ |
| Message Signing | Sign messages (EIP-191, EIP-712) | ❌ |
| Transaction Signing | Sign transactions (legacy + EIP-1559) | ❌ |
| Keystore Files | Import/export Keystore V3 format | ❌ |
| Balance Checking | Check token balances | ✅ |
| Transaction Broadcasting | Send signed transactions | ✅ |

### Quick Start

```bash
cd wallets/ethereum-wallet-toolkit
bun install
```

### Generate a New Wallet

```typescript
import { generateWallet } from '@nirholas/wallet-toolkit';

const wallet = generateWallet();
console.log('Address:', wallet.address);
console.log('Mnemonic:', wallet.mnemonic);
// ⚠️ Store the mnemonic securely! Anyone with it controls your funds.
```

### Sign a Transaction (Offline)

```typescript
import { signTransaction } from '@nirholas/wallet-toolkit';

const signedTx = signTransaction({
  to: '0xRecipientAddress',
  value: '1000000000000000000', // 1 BNB in wei
  chainId: 56, // BSC mainnet
  gasLimit: 21000,
  gasPrice: '5000000000', // 5 Gwei
}, privateKey);

// Broadcast later when online
```

### MCP Server Integration

The wallet toolkit includes specialized MCP servers:

```json
{
  "mcpServers": {
    "wallet": {
      "command": "node",
      "args": ["wallets/ethereum-wallet-toolkit/dist/mcp-server.js"]
    }
  }
}
```

Now your AI assistant can:
- Generate new wallets
- Sign messages for verification
- Prepare transactions for review

### Security Best Practices

1. **Generate wallets offline** — Disconnect from internet first
2. **Store mnemonics physically** — Write on paper, store in a safe
3. **Never share private keys** — With anyone, ever, for any reason
4. **Use hardware wallets** for large amounts
5. **Test with small amounts** first
6. **Verify addresses** character by character before sending

---

## See Also

- [Glossary](GLOSSARY.md) — Definitions for wallet, private key, seed phrase, and related terms
- [DeFi Tools](defi-tools.md) — Token sweeping and DeFi utilities
- [MCP Servers](mcp-servers.md) — Connect wallets to AI assistants
- [Getting Started](getting-started.md) — Initial setup
- [Security Policy](../SECURITY.md) — Project security guidelines
- [Troubleshooting](troubleshooting.md) — When things go wrong
