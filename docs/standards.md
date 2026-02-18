# Standards Guide

Open standards for AI agents and Web3 accessibility — both proposed by this project.

> **New to standards?** Think of standards as shared rule books that everyone agrees to follow. ERC-8004 is like a phone directory for AI agents on the blockchain. W3AG is like building codes that ensure buildings are wheelchair-accessible — but for crypto apps. See the [Glossary](GLOSSARY.md) for term definitions.

---

## ERC-8004: Agent Discovery & Trust

**Location:** `standards/erc-8004/`

### What Is It?

ERC-8004 is an Ethereum standard (EIP) for on-chain AI agent discovery and trust. It defines a smart contract protocol that lets AI agents:

1. **Register** themselves on the blockchain
2. **Discover** other agents
3. **Build reputation** through verified interactions
4. **Establish trust** without centralized authorities

### Why Does It Matter?

Right now, if you want to use an AI agent, you have to trust the developer who made it. There's no way to verify:
- Is this agent legitimate?
- Has it performed well in the past?
- Can other agents vouch for it?

ERC-8004 solves this by putting agent registration and reputation on-chain — transparent, immutable, and verifiable by anyone.

### How It Works

```
Agent Developer
       │
       ▼
  Register Agent (on-chain)
       │
       ▼
  Agent Registry Contract
       │
       ├── Agent metadata (name, capabilities, version)
       ├── Reputation score
       ├── Verification status
       └── Trust attestations from other agents
       │
       ▼
  Anyone can discover and verify agents
```

### Smart Contracts

Located in `standards/erc-8004/contracts/`:

| Contract | Description |
|----------|-------------|
| `IdentityRegistryUpgradeable.sol` | Main registry for agent registration |
| `ReputationRegistryUpgradeable.sol` | Trust attestation and reputation |
| `ValidationRegistryUpgradeable.sol` | Validation and attestation registry |

**Deployed on:**
- BSC Mainnet & Testnet
- opBNB Mainnet & Testnet
- Ethereum Mainnet & Sepolia Testnet
- Base, Arbitrum, Optimism, Polygon, Avalanche, Linea, Scroll, zkSync Era, Mantle, Fantom, Gnosis, Celo, Moonbeam (mainnets + testnets)
- **24 chains total** with deterministic `0x8004` vanity addresses via CREATE2

### Demo Agent

Located in `standards/erc-8004/demo-agent/`:

A reference implementation showing how to:
1. Register an agent on-chain
2. Query the registry for other agents
3. Submit and receive trust attestations

```bash
cd standards/erc-8004/demo-agent
bun install
bun start
```

### For Developers

```solidity
// Simplified ERC-8004 interface
interface IIdentityRegistry {
    function registerAgent(
        string calldata name,
        string calldata description,
        string calldata endpoint,
        bytes calldata metadata
    ) external returns (uint256 agentId);

    function getAgent(uint256 agentId) external view returns (Agent memory);

    function attestTrust(uint256 agentId, uint8 score) external;

    function getReputation(uint256 agentId) external view returns (uint256);
}
```

---

## W3AG: Web3 Accessibility Guidelines

**Location:** `standards/w3ag/`

### What Is It?

W3AG (Web3 Accessibility Guidelines) is the first open standard for making Web3 applications accessible to people with disabilities. It's modeled after [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) but specifically designed for crypto and DeFi.

### Why Does It Matter?

Over 1 billion people worldwide have some form of disability. Most DeFi apps are inaccessible:
- Complex token approval dialogs with no screen reader support
- Gas estimation with no alternative text
- Network switching with no keyboard navigation
- Wallet connection flows that fail with assistive technology

W3AG provides specific, actionable guidelines to fix these issues.

### Guidelines Overview

| Principle | What It Means | Examples |
|-----------|--------------|---------|
| **Perceivable** | Users can perceive all information | Alt text for charts, captions for videos |
| **Operable** | Users can operate all controls | Keyboard navigation, no time limits |
| **Understandable** | Users can understand content | Plain language, consistent design |
| **Robust** | Works with assistive technology | ARIA labels, semantic HTML |

### Conformance Levels

| Level | Description | Target |
|-------|-------------|--------|
| **A** | Minimum accessibility | Basic usability for all |
| **AA** | Standard accessibility | Recommended for all projects |
| **AAA** | Enhanced accessibility | Best possible experience |

### Included React Components

```tsx
import { GasEstimator, NetworkSwitcher, TokenApprovalDialog } from '@w3ag/react';

// Accessible gas estimation with screen reader support
<GasEstimator chainId={56} transaction={tx} />

// Keyboard-navigable network switcher
<NetworkSwitcher currentChain={56} onSwitch={handleSwitch} />

// WCAG-compliant token approval with clear warnings
<TokenApprovalDialog token={token} spender={spender} amount={amount} />
```

### Testing Checklist

W3AG includes a testing checklist for DeFi apps:

- [ ] All interactive elements are keyboard accessible
- [ ] Token amounts are announced by screen readers
- [ ] Gas estimates include alternative text
- [ ] Error messages are descriptive and actionable
- [ ] Network switching is operable without a mouse
- [ ] Transaction confirmation has sufficient time
- [ ] Color is not the only indicator of status

---

## See Also

- [Glossary](GLOSSARY.md) — Definitions for ERC-8004, W3AG, CREATE2, NFT, and related terms
- [Agents](agents.md) — AI agents that can be registered via ERC-8004
- [Architecture](architecture.md) — How standards fit in the overall system
- [Examples](examples.md) — Register an agent on-chain (advanced example)
- [Contributing](../CONTRIBUTING.md) — Help improve these standards
- [TECHNICAL.md](TECHNICAL.md) — Full technical breakdown
