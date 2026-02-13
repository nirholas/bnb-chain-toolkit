# Architecture

> How ERC-8004 registries and the Agent Creator work together.

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERC-8004 Agent Creator                       │
│                   (Single HTML File — UI)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐ │
│  │  Wallet  │───▶│  Wizard  │───▶│  Builder  │───▶│  Deploy  │ │
│  │ Connect  │    │   Form   │    │ JSON/URI  │    │   Tx     │ │
│  └──────────┘    └──────────┘    └───────────┘    └────┬─────┘ │
│                                                        │       │
└────────────────────────────────────────────────────────┼───────┘
                                                         │
                         ┌───────────────────────────────┼───────┐
                         │         EVM Blockchain         │       │
                         │                               ▼       │
                         │  ┌─────────────────────────────────┐  │
                         │  │       Identity Registry          │  │
                         │  │     (ERC-721 + Metadata)         │  │
                         │  │  register() → mint NFT          │  │
                         │  │  setAgentURI() → update data    │  │
                         │  │  setMetadata() → on-chain KV    │  │
                         │  └─────────────┬───────────────────┘  │
                         │                │                       │
                         │    ┌───────────┴───────────┐          │
                         │    ▼                       ▼          │
                         │  ┌────────────┐  ┌──────────────┐    │
                         │  │ Reputation │  │  Validation  │    │
                         │  │  Registry  │  │  Registry    │    │
                         │  │ (Feedback) │  │  (Hooks)     │    │
                         │  └────────────┘  └──────────────┘    │
                         └───────────────────────────────────────┘
```

## Smart Contract Architecture

### Identity Registry (ERC-721)

The core contract. Each registered agent is an NFT.

```
IdentityRegistryUpgradeable (UUPS Proxy)
├── ERC-721 (NFT standard)
├── ERC-721URIStorage (per-token URIs)
├── OwnableUpgradeable (admin functions)
└── UUPSUpgradeable (upgradeable proxy)

Key Functions:
├── register()                          → Mint agent NFT (no URI)
├── register(string agentURI)           → Mint with URI
├── register(string, MetadataEntry[])   → Mint with URI + metadata
├── setAgentURI(agentId, newURI)        → Update agent URI
├── setMetadata(agentId, key, value)    → Set on-chain metadata
├── getMetadata(agentId, key)           → Read metadata
├── getAgentWallet(agentId)             → Get agent's wallet
├── setAgentWallet(agentId, wallet, deadline, sig) → Set wallet (EIP-712)
├── tokenURI(tokenId)                   → Read agent URI
└── getVersion()                        → Contract version
```

### MetadataEntry Struct
```solidity
struct MetadataEntry {
    string metadataKey;    // e.g., "category"
    bytes metadataValue;   // e.g., abi.encode("DeFi")
}
```

### Events
```solidity
event Registered(uint256 indexed agentId, string agentURI, address indexed owner);
event MetadataSet(uint256 indexed agentId, string indexed indexedMetadataKey, string metadataKey, bytes metadataValue);
event URIUpdated(uint256 indexed agentId, string newURI, address indexed updatedBy);
```

## Deterministic Deployment (CREATE2)

All contracts are deployed via the SAFE Singleton Factory using CREATE2, producing **the same vanity addresses on every chain**:

```
Identity:    0x8004A818BFB912233c491871b3d84c89A494BD9e
Reputation:  0x8004B663056A597Dffe9eCcC1965A193B7388713
Validation:  0x8004Cb1BF31DAf7788923b405b754f57acEB4272
                ^^^^
                Vanity prefix: 8004
```

**Exception:** Ethereum Mainnet uses different bytecode → different addresses.

## Data Flow

### Registration Flow
```
User fills form
    ↓
buildRegistrationJson()
    → Creates ERC-8004 registration JSON
    ↓
buildAgentUri(json)
    → On-chain: base64 data URI
    → IPFS: ipfs://Qm...
    → HTTPS: https://...
    ↓
identityContract.register(uri, metadata?)
    → Transaction submitted to blockchain
    ↓
Parse Registered event
    → Extract agentId from logs
    ↓
(Optional) setAgentURI with correct agentId
    → Update the "PENDING" agentId in on-chain URI
```

### Agent Discovery Flow
```
External agent/service wants to find agents
    ↓
Query IdentityRegistry
    → balanceOf(address) — how many agents?
    → tokenURI(agentId)  — get registration JSON
    → getMetadata(agentId, key) — read metadata
    ↓
Parse registration JSON
    → services[].endpoint — discover A2A/MCP/web endpoints
    → supportedTrust[]    — check trust mechanisms
    ↓
Connect to agent's service endpoint
```

## URI Storage Options

| Method | Stored | Pros | Cons |
|---|---|---|---|
| **On-chain (base64)** | In contract storage | No hosting needed, permanent, censorship-resistant | Slightly higher gas cost |
| **IPFS** | On IPFS network | Permanent, decentralized, content-addressed | Needs pinning service |
| **HTTPS** | On web server | Easy to update, low gas cost | Centralized, can go offline |

## Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | Vanilla HTML/CSS/JS (single file) |
| **Wallet** | ethers.js v6 (CDN) |
| **Typography** | Inter + JetBrains Mono (Google Fonts) |
| **Smart Contracts** | Solidity 0.8.20+ (OpenZeppelin) |
| **Proxy Pattern** | UUPS (EIP-1822) |
| **Deployment** | CREATE2 via SAFE Singleton Factory |
| **Networks** | BSC, Ethereum, any EVM chain |

## Design Principles

1. **Zero Dependencies** — No npm, no build tools. Single HTML file.
2. **Chain Agnostic** — Works on any EVM chain where contracts are deployed.
3. **Self-Sovereign** — Your agent NFT belongs to you. No platform lock-in.
4. **On-Chain First** — Default storage is fully on-chain (base64 data URI).
5. **Standards-Based** — ERC-721, ERC-8004, EIP-712, A2A, MCP.
6. **Progressive** — Works without a wallet (read-only), full features with wallet.

## See Also

- [Contract Addresses](contracts.md) — All deployed addresses
- [Integration Guide](integration.md) — Build on ERC-8004
- [ERC-8004 Specification](https://www.8004.org) — The full standard
