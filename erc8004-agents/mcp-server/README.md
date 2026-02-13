# @nirholas/erc8004-mcp

> MCP server for ERC-8004 trustless AI agent on-chain identity — register, discover, and manage agents across BSC, Ethereum, and 60+ networks.

[![npm](https://img.shields.io/npm/v/@nirholas/erc8004-mcp)](https://www.npmjs.com/package/@nirholas/erc8004-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blueviolet)](https://modelcontextprotocol.io)
[![ERC-8004](https://img.shields.io/badge/ERC-8004-F0B90B)](https://erc8004.agency)

---

## What is this?

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that gives AI assistants (Claude, ChatGPT, Cursor, Windsurf, VS Code Copilot) direct access to **ERC-8004 on-chain agent identity** — the open standard for trustless AI agent registration, reputation, and discovery.

**11 tools** across three on-chain registries:

| Category | Tools | Description |
|---|---|---|
| **Identity** | `register_agent`, `get_agent`, `list_agents`, `get_agent_count`, `set_uri`, `search_agents` | Mint agent NFTs, look up identities, discover agents |
| **Reputation** | `submit_reputation`, `get_reputation` | On-chain feedback scoring (-128 to +127) |
| **Metadata** | `set_metadata`, `get_metadata`, `batch_get_metadata` | Key-value on-chain storage (version, endpoints, DID) |

---

## Quick Start

### Install

```bash
npm install @nirholas/erc8004-mcp
# or
bun add @nirholas/erc8004-mcp
```

### Run

```bash
# Read-only (no private key needed)
npx @nirholas/erc8004-mcp

# Read + write (registration, metadata updates)
PRIVATE_KEY=0x... npx @nirholas/erc8004-mcp
```

### Build from source

```bash
cd mcp-server
npm install
npm run build
node dist/index.js
```

---

## Claude Desktop Configuration

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "erc8004": {
      "command": "npx",
      "args": ["@nirholas/erc8004-mcp"],
      "env": {
        "PRIVATE_KEY": "0xYOUR_PRIVATE_KEY_HERE"
      }
    }
  }
}
```

### Cursor / Windsurf / VS Code

Add to your MCP settings:

```json
{
  "mcpServers": {
    "erc8004": {
      "command": "npx",
      "args": ["@nirholas/erc8004-mcp"],
      "env": {
        "PRIVATE_KEY": "0xYOUR_PRIVATE_KEY_HERE"
      }
    }
  }
}
```

> **Security**: Never commit private keys. Use environment variables or secrets managers.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PRIVATE_KEY` | For write ops | Wallet private key (0x-prefixed). Required for `register_agent`, `set_uri`, `set_metadata`, `submit_reputation`. |
| `RPC_URL` | No | Override default RPC endpoint. Chain-specific RPCs are built in. |
| `CHAIN_ID` | No | Default chain ID (tools accept chain per-call). |

---

## Supported Chains

| Chain | Chain ID | Status | Contracts |
|---|---|---|---|
| **BSC Testnet** | 97 | ✅ Live | Identity + Reputation + Validation |
| **BSC Mainnet** | 56 | ✅ Live | Identity + Reputation |
| **Ethereum Mainnet** | 1 | ✅ Live | Identity + Reputation |
| **Ethereum Sepolia** | 11155111 | ✅ Live | Identity + Reputation |
| Base Sepolia | 84532 | 🔜 Planned | — |
| Arbitrum Sepolia | 421614 | 🔜 Planned | — |
| Optimism Sepolia | 11155420 | 🔜 Planned | — |
| Polygon Amoy | 80002 | 🔜 Planned | — |

All contracts share the `0x8004` vanity prefix via deterministic CREATE2 deployment.

---

## Tool Reference

### `register_agent`

Register a new AI agent on-chain. Mints an ERC-721 NFT.

```
Input:
  chain: "bsc-testnet"          # Required
  agentURI: "https://..."       # Optional metadata URI
  metadata:                     # Optional key-value pairs
    - key: "a2a.endpoint"
      value: "https://myagent.com/.well-known/agent.json"
    - key: "version"
      value: "1.0.0"

Output:
  agentId: "42"
  transactionHash: "0x..."
  explorer: "https://testnet.bscscan.com/tx/0x..."
```

### `get_agent`

Look up an agent by token ID.

```
Input:
  chain: "bsc-testnet"
  agentId: "42"

Output:
  owner: "0x..."
  uri: "data:application/json;base64,..."
  metadata: { name: "My Agent", ... }
```

### `list_agents`

List all agents owned by an address.

```
Input:
  chain: "bsc-testnet"
  address: "0x..."

Output:
  count: 3
  agents: [{ agentId: "1", uri: "...", metadata: {...} }, ...]
```

### `get_agent_count`

Get total registered agents on a chain.

```
Input:
  chain: "bsc-testnet"

Output:
  count: 156
```

### `set_uri`

Update an agent's metadata URI (owner only).

```
Input:
  chain: "bsc-testnet"
  agentId: "42"
  newURI: "ipfs://Qm..."
```

### `search_agents`

Search agents by name, service, or metadata content.

```
Input:
  chain: "bsc-testnet"
  query: "defi"           # Optional filter
  limit: 20               # Max results
```

### `submit_reputation`

Submit on-chain reputation feedback.

```
Input:
  chain: "bsc-testnet"
  agentId: "42"
  score: 100              # -128 to 127
  comment: "Excellent DeFi agent, fast responses"
```

### `get_reputation`

Get reputation data for an agent.

```
Input:
  chain: "bsc-testnet"
  agentId: "42"

Output:
  averageScore: 85
  totalFeedback: 12
  recentFeedback: [{ reviewer: "0x...", score: 100, comment: "...", timestamp: 1706... }]
```

### `set_metadata` / `get_metadata` / `batch_get_metadata`

Read and write on-chain key-value pairs.

```
Input (set):
  chain: "bsc-testnet"
  agentId: "42"
  key: "a2a.endpoint"
  value: "https://myagent.com/.well-known/agent.json"

Input (batch_get):
  chain: "bsc-testnet"
  agentId: "42"
  keys: ["version", "a2a.endpoint", "did"]
```

---

## Contract Addresses

All addresses share the `0x8004` vanity prefix:

| Contract | Testnet Address | Mainnet Address |
|---|---|---|
| **IdentityRegistry** | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| **ReputationRegistry** | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |
| **ValidationRegistry** | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` | — |

---

## Architecture

```
┌─────────────┐     stdio      ┌──────────────────┐     JSON-RPC     ┌───────────────┐
│  AI Client  │ ◄────────────► │  ERC-8004 MCP    │ ◄──────────────► │  EVM Chain    │
│  (Claude,   │                │  Server          │                  │  (BSC, ETH)   │
│   Cursor)   │                │                  │                  │               │
└─────────────┘                │  11 tools:       │                  │  0x8004...    │
                               │  - Identity (6)  │                  │  Contracts    │
                               │  - Reputation(2) │                  └───────────────┘
                               │  - Metadata (3)  │
                               └──────────────────┘
```

---

## Related

- [ERC-8004 Agent Creator](https://erc8004.agency) — Zero-dependency web UI
- [ERC-8004 Contracts](https://github.com/erc-8004/erc-8004-contracts) — Solidity source
- [EIP-8004 Specification](https://eips.ethereum.org/EIPS/eip-8004) — Ethereum standard
- [BNB Chain AI Toolkit](https://github.com/nirholas/bnb-chain-toolkit) — 72+ AI agents, 6 MCP servers

## License

MIT © [nirholas](https://github.com/nirholas)
