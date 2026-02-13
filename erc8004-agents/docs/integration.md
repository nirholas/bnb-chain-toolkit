# Integration Guide

> Embed ERC-8004 agent registration into your own application.

---

## Quick Integration

### Option 1: Iframe Embed

The simplest way — embed the full creator in your page:

```html
<iframe 
  src="https://erc8004.agency/" 
  width="100%" 
  height="1200px" 
  style="border: none; border-radius: 16px; background: #0a0a0f;"
  title="ERC-8004 Agent Creator"
  allow="clipboard-write"
></iframe>
```

### Option 2: Direct Link

```html
<a href="https://erc8004.agency/" target="_blank">
  Register Agent →
</a>
```

### Option 3: Self-Hosted

Copy `index.html` into your project. It's a single file with zero dependencies.

```bash
curl -o erc8004.html https://raw.githubusercontent.com/nirholas/erc8004-agent-creator/main/index.html
```

---

## Programmatic Integration

### Install ethers.js

```bash
npm install ethers
# or
bun add ethers
```

### Minimal Registration

```javascript
import { ethers } from 'ethers';

const IDENTITY_ADDRESS = '0x8004A818BFB912233c491871b3d84c89A494BD9e'; // BSC Testnet
const IDENTITY_ABI = [
  "function register(string agentURI) external returns (uint256 agentId)",
  "function register(string agentURI, tuple(string metadataKey, bytes metadataValue)[] metadata) external returns (uint256 agentId)",
  "function setAgentURI(uint256 agentId, string newURI) external",
  "function setMetadata(uint256 agentId, string key, bytes value) external",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "event Registered(uint256 indexed agentId, string agentURI, address indexed owner)"
];

async function registerAgent(name, description, services) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const registry = new ethers.Contract(IDENTITY_ADDRESS, IDENTITY_ABI, signer);

  // Build registration JSON
  const registration = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name,
    description,
    services,
    active: true,
    registrations: [{
      agentId: "PENDING",
      agentRegistry: `eip155:97:${IDENTITY_ADDRESS}`
    }]
  };

  // Encode as on-chain data URI
  const uri = `data:application/json;base64,${btoa(JSON.stringify(registration))}`;

  // Submit transaction
  const tx = await registry['register(string)'](uri);
  const receipt = await tx.wait();

  // Extract agentId from Registered event
  const event = receipt.logs
    .map(log => { try { return registry.interface.parseLog(log); } catch { return null; } })
    .find(e => e?.name === 'Registered');

  return {
    agentId: event.args.agentId.toString(),
    txHash: receipt.hash,
    owner: await signer.getAddress()
  };
}

// Usage
const result = await registerAgent(
  'My Agent',
  'An autonomous trading agent',
  [{ name: 'A2A', endpoint: 'https://agent.example/.well-known/agent-card.json' }]
);
console.log(`Registered Agent #${result.agentId}`);
```

### Registration with Metadata

```javascript
async function registerWithMetadata(name, description, services, metadata) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const registry = new ethers.Contract(IDENTITY_ADDRESS, IDENTITY_ABI, signer);

  const registration = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name, description, services, active: true,
    registrations: [{ agentId: "PENDING", agentRegistry: `eip155:97:${IDENTITY_ADDRESS}` }]
  };

  const uri = `data:application/json;base64,${btoa(JSON.stringify(registration))}`;

  // Convert metadata to contract format
  const metaTuples = Object.entries(metadata).map(([key, value]) => ({
    metadataKey: key,
    metadataValue: ethers.toUtf8Bytes(value)
  }));

  const tx = await registry['register(string,(string,bytes)[])'](uri, metaTuples);
  const receipt = await tx.wait();

  // ... extract agentId same as above
}

// Usage
await registerWithMetadata(
  'DeFi Bot',
  'Automated DeFi strategies',
  [{ name: 'MCP', endpoint: 'https://mcp.example.com/' }],
  { category: 'DeFi', pricing: 'free', chain: 'BSC' }
);
```

### Read Agent Data

```javascript
async function getAgent(agentId) {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545');
  const registry = new ethers.Contract(IDENTITY_ADDRESS, IDENTITY_ABI, provider);

  const owner = await registry.ownerOf(agentId);
  const uri = await registry.tokenURI(agentId);

  let registration = null;
  if (uri.startsWith('data:application/json;base64,')) {
    registration = JSON.parse(atob(uri.split(',')[1]));
  }

  return { agentId, owner, uri, registration };
}

const agent = await getAgent(1);
console.log(agent.registration.name);     // "My Agent"
console.log(agent.registration.services); // [{ name: "A2A", ... }]
```

---

## React Integration

```tsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const IDENTITY_ADDRESS = '0x8004A818BFB912233c491871b3d84c89A494BD9e';
const ABI = [
  "function tokenURI(uint256) view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)"
];

function useAgentRegistry() {
  const [provider] = useState(
    () => new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545')
  );
  const [registry] = useState(
    () => new ethers.Contract(IDENTITY_ADDRESS, ABI, provider)
  );

  async function getAgent(id: number) {
    const uri = await registry.tokenURI(id);
    const owner = await registry.ownerOf(id);
    if (uri.startsWith('data:application/json;base64,')) {
      return { ...JSON.parse(atob(uri.split(',')[1])), owner };
    }
    return { uri, owner };
  }

  async function getAgentCount(address: string) {
    return Number(await registry.balanceOf(address));
  }

  return { getAgent, getAgentCount };
}
```

---

## Network Configuration

```javascript
const NETWORKS = {
  bscTestnet: {
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    explorer: 'https://testnet.bscscan.com',
    identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e'
  },
  bscMainnet: {
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.bnbchain.org',
    explorer: 'https://bscscan.com',
    identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432'
  },
  ethereumMainnet: {
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432'
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e'
  }
};
```

---

## See Also

- [Examples](examples.md) — More code patterns
- [Contract Addresses](contracts.md) — All deployment addresses
- [Architecture](architecture.md) — System design
