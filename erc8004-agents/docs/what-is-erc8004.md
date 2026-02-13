# What is ERC-8004?

> A plain-English guide to trustless agent identity on the blockchain.

---

## The Problem

AI agents are everywhere — they trade tokens, analyze data, automate workflows, and interact with other agents. But there's a fundamental problem: **how do you trust an agent you've never interacted with before?**

Today, agent identity is fragmented:
- Agents are tied to specific platforms
- There's no standard way to discover what an agent can do
- Reputation data is siloed and non-portable
- You can't verify an agent's identity without trusting a third party

## The Solution: ERC-8004

ERC-8004 is an Ethereum standard (EIP) that defines **three on-chain registries** for agent identity:

### 1. Identity Registry
Every agent gets an **ERC-721 NFT** — a unique, ownable, transferable identity token. This NFT contains:
- The agent's name and description
- Service endpoints (how to reach the agent)
- Metadata (capabilities, pricing, categories)
- A URI pointing to the agent's full registration document

**Think of it like:** A passport for your AI agent — portable, verifiable, and yours.

### 2. Reputation Registry
A standardized feedback system where:
- Anyone who interacts with an agent can leave structured feedback
- Reputation data is on-chain and transparent
- Agents build track records that follow them across platforms

**Think of it like:** An on-chain Yelp for AI agents — but trustless and permanent.

### 3. Validation Registry
Hooks for external validation smart contracts that can:
- Verify agent behavior meets certain criteria
- Provide attestation from trusted validators
- Enable programmable trust policies

**Think of it like:** A certification authority — but decentralized and permissionless.

## Why Does This Matter?

| Before ERC-8004 | After ERC-8004 |
|---|---|
| Agents locked to one platform | Agents portable across all platforms |
| No standard discovery | Discovered via on-chain registry |
| Trust requires intermediaries | Trustless verification on-chain |
| Reputation can't transfer | Reputation follows the agent |
| Agent identity is centralized | Agent identity is self-sovereign |

## How the Creator Tool Helps

The [ERC-8004 Agent Creator](https://erc8004.agency/) is a zero-dependency UI that makes it dead simple to:
1. Connect your wallet
2. Fill in your agent's details
3. Register on-chain in one transaction
4. Get an ERC-721 NFT identity

No coding required. No build tools. No servers.

## Key Concepts

### Agent URI
A URI pointing to a JSON document that describes the agent. Can be stored:
- **On-chain** — As a base64 data URI (no hosting needed)
- **IPFS** — Decentralized, permanent storage
- **HTTPS** — Traditional web hosting

### Service Endpoints
How other agents and users can reach your agent:
- **A2A** — Agent-to-Agent protocol (Google's standard)
- **MCP** — Model Context Protocol (Anthropic's standard)
- **Web** — Standard HTTPS endpoint
- **ENS/DID** — Decentralized identifiers

### Registration JSON
The standardized document format:
```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "My Agent",
  "description": "What this agent does",
  "services": [
    { "name": "A2A", "endpoint": "https://..." }
  ],
  "active": true,
  "registrations": [
    { "agentId": 42, "agentRegistry": "eip155:97:0x8004..." }
  ]
}
```

## See Also

- [Getting Started](getting-started.md) — Create your first agent
- [Architecture](architecture.md) — Technical deep dive
- [ERC-8004 Specification](https://www.8004.org) — The full standard
