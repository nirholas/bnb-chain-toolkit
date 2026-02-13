# Examples

> Step-by-step examples from simple to advanced.

---

## Beginner Examples

### Register a Simple Agent

The fastest path — just a name and description.

1. Open [erc8004.agency](https://erc8004.agency/)
2. Connect wallet → Select BSC Testnet
3. Fill in:
   - **Name:** `My First Agent`
   - **Description:** `A test agent to learn ERC-8004`
4. Click **Next** → Add a web endpoint: `https://example.com`
5. Skip configuration → Review → Deploy

Your agent is now on-chain as an NFT.

### Register an A2A Agent

For agents that speak [Google's Agent-to-Agent protocol](https://google.github.io/A2A/):

| Field | Value |
|---|---|
| Name | `A2A Trading Bot` |
| Description | `Autonomous trading agent with A2A discovery` |
| Service Type | `A2A` |
| Endpoint | `https://mybot.example/.well-known/agent-card.json` |
| Version | `0.3.0` |

### Register an MCP Server

For [Model Context Protocol](https://modelcontextprotocol.io/) servers:

| Field | Value |
|---|---|
| Name | `DeFi Analytics MCP` |
| Description | `MCP server providing DeFi analytics tools` |
| Service Type | `MCP` |
| Endpoint | `https://mcp.myagent.example/` |
| Version | `2025-06-18` |
| Trust Models | ☑ Reputation |

---

## Intermediate Examples

### Multi-Service Agent

Register an agent with multiple service endpoints:

1. **Service 1:** A2A — `https://agent.example/.well-known/agent-card.json`
2. **Service 2:** MCP — `https://mcp.agent.example/`
3. **Service 3:** Web — `https://agent.example/`

This makes your agent discoverable via multiple protocols.

### Agent with Custom Metadata

Add on-chain key-value metadata:

| Key | Value |
|---|---|
| `category` | `DeFi` |
| `pricing` | `0.001 BNB per request` |
| `version` | `2.0.0` |
| `chain` | `BSC` |

Metadata is stored directly on the blockchain and queryable by anyone:
```javascript
const value = await registry.getMetadata(agentId, "category");
// Returns bytes → decode to string
```

### IPFS-Hosted Registration

Instead of on-chain storage, host your registration JSON on IPFS:

1. Create your registration JSON (the app generates it for you)
2. Pin it to IPFS via [Pinata](https://pinata.cloud/), [web3.storage](https://web3.storage/), or `ipfs add`
3. Select **IPFS** as URI option in Step 3
4. Paste your IPFS URI: `ipfs://QmYourCID...`
5. Deploy — the contract stores only the IPFS pointer (cheaper gas)

---

## Advanced Examples

### Programmatic Registration (ethers.js)

Register agents directly from code:

```javascript
import { ethers } from 'ethers';

const IDENTITY_ABI = [
  "function register(string agentURI) external returns (uint256 agentId)",
  "function register(string agentURI, tuple(string metadataKey, bytes metadataValue)[] metadata) external returns (uint256 agentId)",
  "event Registered(uint256 indexed agentId, string agentURI, address indexed owner)"
];

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const registry = new ethers.Contract(
  '0x8004A818BFB912233c491871b3d84c89A494BD9e', // BSC Testnet
  IDENTITY_ABI,
  signer
);

// Build registration JSON
const registration = {
  type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  name: "My Programmatic Agent",
  description: "Registered via code",
  services: [
    { name: "A2A", endpoint: "https://agent.example/.well-known/agent-card.json" }
  ],
  active: true,
  registrations: [{ agentId: "PENDING", agentRegistry: "eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e" }]
};

// Encode as data URI
const uri = `data:application/json;base64,${btoa(JSON.stringify(registration))}`;

// Register
const tx = await registry['register(string)'](uri);
const receipt = await tx.wait();

// Get agent ID from event
const event = receipt.logs
  .map(log => { try { return registry.interface.parseLog(log); } catch { return null; } })
  .find(e => e?.name === 'Registered');

console.log('Agent ID:', event.args.agentId.toString());
```

### Register with Metadata (ethers.js)

```javascript
const metadata = [
  { metadataKey: "category", metadataValue: ethers.toUtf8Bytes("DeFi") },
  { metadataKey: "version", metadataValue: ethers.toUtf8Bytes("1.0.0") }
];

const tx = await registry['register(string,(string,bytes)[])'](uri, metadata);
const receipt = await tx.wait();
```

### Read Agent Data

```javascript
// Read agent URI
const uri = await registry.tokenURI(agentId);

// Decode if on-chain base64
if (uri.startsWith('data:application/json;base64,')) {
  const json = JSON.parse(atob(uri.split(',')[1]));
  console.log('Agent:', json.name);
  console.log('Services:', json.services);
}

// Read specific metadata
const category = await registry.getMetadata(agentId, "category");
console.log('Category:', ethers.toUtf8String(category));

// Check owner
const owner = await registry.ownerOf(agentId);
console.log('Owner:', owner);
```

### Batch Agent Discovery

```javascript
// Find all agents by scanning Transfer events (mint = from 0x0)
const filter = registry.filters.Transfer(ethers.ZeroAddress);
const events = await registry.queryFilter(filter, -5000);

for (const event of events) {
  const agentId = event.args[2].toString();
  const owner = event.args[1];
  const uri = await registry.tokenURI(agentId);
  console.log(`Agent #${agentId} owned by ${owner}`);
}
```

---

## Integration Patterns

### Pattern 1: Agent Discovery Service

Build a directory that indexes all registered agents:

```
Your Service
    ↓
Query IdentityRegistry (Transfer events)
    → Get all agentIds
    ↓
For each agentId:
    → tokenURI() → parse registration JSON
    → Index services, metadata, capabilities
    ↓
Expose search API
    → Other agents can discover yours
```

### Pattern 2: Reputation-Gated Interaction

Before interacting with an agent, check its reputation:

```
Incoming request from Agent #42
    ↓
Check IdentityRegistry
    → ownerOf(42) → verify identity
    → tokenURI(42) → check capabilities
    ↓
Check ReputationRegistry
    → Get feedback scores
    → Apply trust threshold
    ↓
Accept or reject interaction
```

### Pattern 3: Autonomous Registration

Deploy agents that self-register on startup:

```
Agent boots up
    ↓
Check if already registered
    → balanceOf(agentWallet) > 0?
    ↓
If not registered:
    → Build registration JSON
    → register(uri, metadata)
    → Store agentId
    ↓
Update URI periodically
    → setAgentURI(agentId, newUri)
```

## See Also

- [Getting Started](getting-started.md) — First-time setup
- [Integration Guide](integration.md) — Embed in your app
- [Architecture](architecture.md) — Deep technical details
