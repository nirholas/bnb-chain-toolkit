# Contract Addresses

> All ERC-8004 registry addresses across deployed chains.

---

## Deterministic Addresses (CREATE2)

These addresses are **identical on every chain** deployed via the SAFE Singleton Factory:

| Contract | Address |
|---|---|
| **IdentityRegistry** | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| **ReputationRegistry** | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| **ValidationRegistry** | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |

> All addresses share the `0x8004` vanity prefix.

---

## Per-Chain Deployment Status

### BSC Testnet (Chain ID: 97)

| Contract | Address | Status |
|---|---|---|
| **IdentityRegistry** | [`0x8004A818BFB912233c491871b3d84c89A494BD9e`](https://testnet.bscscan.com/address/0x8004A818BFB912233c491871b3d84c89A494BD9e) | ✅ Live |
| **ReputationRegistry** | [`0x8004B663056A597Dffe9eCcC1965A193B7388713`](https://testnet.bscscan.com/address/0x8004B663056A597Dffe9eCcC1965A193B7388713) | ✅ Live |
| **ValidationRegistry** | [`0x8004Cb1BF31DAf7788923b405b754f57acEB4272`](https://testnet.bscscan.com/address/0x8004Cb1BF31DAf7788923b405b754f57acEB4272) | ✅ Live |

### BSC Mainnet (Chain ID: 56)

| Contract | Address | Status |
|---|---|---|
| **IdentityRegistry** | [`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`](https://bscscan.com/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) | ✅ Live |
| **ReputationRegistry** | [`0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`](https://bscscan.com/address/0x8004BAa17C55a88189AE136b182e5fdA19dE9b63) | ✅ Live |

### Ethereum Mainnet (Chain ID: 1)

> ⚠️ Mainnet uses different addresses due to separate deployment bytecode.

| Contract | Address | Status |
|---|---|---|
| **IdentityRegistry** | [`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`](https://etherscan.io/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) | ✅ Live |
| **ReputationRegistry** | [`0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`](https://etherscan.io/address/0x8004BAa17C55a88189AE136b182e5fdA19dE9b63) | ✅ Live |

### Ethereum Sepolia (Chain ID: 11155111)

| Contract | Address | Status |
|---|---|---|
| **IdentityRegistry** | [`0x8004A818BFB912233c491871b3d84c89A494BD9e`](https://sepolia.etherscan.io/address/0x8004A818BFB912233c491871b3d84c89A494BD9e) | ✅ Live |
| **ReputationRegistry** | [`0x8004B663056A597Dffe9eCcC1965A193B7388713`](https://sepolia.etherscan.io/address/0x8004B663056A597Dffe9eCcC1965A193B7388713) | ✅ Live |

### Planned Deployments

The following chains can be deployed using the same CREATE2 salts (identical addresses):

| Chain | Chain ID | Status |
|---|---|---|
| Base Sepolia | 84532 | 🔜 Planned |
| Linea Sepolia | — | 🔜 Planned |
| Polygon Amoy | — | 🔜 Planned |
| Hedera Testnet | — | 🔜 Planned |
| HyperEVM Testnet | — | 🔜 Planned |
| Arbitrum Sepolia | — | 🔜 Planned |
| Optimism Sepolia | — | 🔜 Planned |

## Agent Registry Format (CAIP-10)

The `agentRegistry` field in registration JSON uses [CAIP-10](https://chainagnostic.org/CAIPs/caip-10) format:

```
eip155:{chainId}:{contractAddress}
```

Examples:
```
eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e     # BSC Testnet
eip155:56:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432     # BSC Mainnet
eip155:1:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432      # Ethereum Mainnet
eip155:11155111:0x8004A818BFB912233c491871b3d84c89A494BD9e # Sepolia
```

## Verifying Contracts

All contracts are verified on their respective block explorers. You can also verify by:

```bash
# Read contract version
cast call 0x8004A818BFB912233c491871b3d84c89A494BD9e "getVersion()" --rpc-url https://data-seed-prebsc-1-s1.bnbchain.org:8545
```

## See Also

- [Architecture](architecture.md) — How the registries work
- [ERC-8004 Contracts Repo](https://github.com/erc-8004/erc-8004-contracts) — Source code
