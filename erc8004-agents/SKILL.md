---
name: erc8004-agent-creator
description: "Register AI agents as on-chain NFTs (ERC-721) on BNB Chain and EVM networks using the ERC-8004 standard. Use when creating verifiable agent identity, minting agent NFTs, managing on-chain reputation, or integrating A2A/MCP endpoints with blockchain identity."
---

# ERC-8004 Agent Creator

Register AI agents as on-chain NFTs (ERC-721) on BNB Chain (BSC), Ethereum, and EVM-compatible networks using the ERC-8004 standard for trustless AI agent identity.

- **MCP Server**: `npx @nirholas/erc8004-mcp`
- **Web UI**: https://erc8004.agency
- **Standard**: [EIP-8004](https://eips.ethereum.org/EIPS/eip-8004)

## Capabilities

- Register agents on BSC (56), BSC Testnet (97), Ethereum (1), or Sepolia (11155111)
- Mint ERC-721 NFTs with metadata URIs (HTTPS, IPFS, or on-chain base64 JSON)
- Query agents by token ID, wallet address, or search by name/service type
- Submit/query on-chain reputation feedback (scored -128 to +127)
- Set key-value metadata: `version`, `a2a.endpoint`, `mcp.endpoint`, `did`, `ens`, `x402.enabled`
- Register A2A, MCP, OASF, DID, ENS, and x402 protocol endpoints

## Workflow

1. **Connect wallet** — Ensure MetaMask is connected to the target chain
2. **Register agent** — Call `register_agent` with chain, URI, and metadata
3. **Verify registration** — Call `get_agent` with the returned token ID to confirm on-chain state
4. **Set metadata** — Attach key-value pairs via `set_metadata`, then read back with `get_metadata` to verify
5. **Query agents** — Use `get_agent_count`, `list_agents`, or `search_agents` for discovery
6. **Manage reputation** — Submit feedback with `submit_reputation`, query with `get_reputation`

**Error handling**: If a transaction fails, check gas balance, network connectivity, and that the wallet is on the correct chain. Duplicate registrations will revert.

## Examples

### Register an agent on BSC Testnet

```json
// MCP tool: register_agent
{
  "chain": "bsc-testnet",
  "uri": "https://example.com/agent-metadata.json",
  "metadata": {
    "version": "1.0",
    "a2a.endpoint": "https://agent.example.com/a2a"
  }
}
// Returns: { "tokenId": 42, "txHash": "0x..." }
// Verify: call get_agent with tokenId 42 to confirm registration
```

### Search for DeFi agents

```json
// MCP tool: search_agents
{
  "query": "defi",
  "chain": "bsc-mainnet"
}
// Returns: array of matching agent records with tokenId, owner, uri, metadata
```

### Submit reputation feedback

```json
// MCP tool: submit_reputation
{
  "agentId": 42,
  "score": 5,
  "comment": "Reliable DeFi portfolio management"
}
// Returns: { "txHash": "0x..." }
```

## Contract Addresses

All contracts share the `0x8004` vanity prefix (deterministic CREATE2):

| Contract | Testnet | Mainnet |
|---|---|---|
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |
| ValidationRegistry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` | — |

## References

- **Repository**: https://github.com/nirholas/erc8004-agent-creator
- **Docs**: https://erc8004.agency/docs
- **Contracts**: https://github.com/erc-8004/erc-8004-contracts
