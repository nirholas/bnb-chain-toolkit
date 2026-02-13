# Tutorials

> Complete walkthroughs for common tasks.

---

## Tutorial 1: Register Your First Agent (5 minutes)

### Overview
You'll register a test AI agent on BSC Testnet, see it as an NFT, and verify it on BscScan.

### Prerequisites
- MetaMask browser extension installed
- 5 minutes of your time

### Steps

**1. Get testnet BNB**

Visit [BNB Chain Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet), paste your MetaMask address, and claim free tBNB.

**2. Open the creator**

Go to [erc8004.agency](https://erc8004.agency/)

**3. Connect wallet**

Click "Connect Wallet" → approve in MetaMask. The app switches you to BSC Testnet automatically.

**4. Step 1 — Identity**

```
Name:        My Test Agent
Description: A simple test agent to learn ERC-8004 registration.
Image:       (leave blank)
```

Click "Next: Services →"

**5. Step 2 — Services**

The default service is "Web". Set the endpoint:
```
Type:     Web
Endpoint: https://example.com
Version:  (leave blank)
```

Click "Next: Configuration →"

**6. Step 3 — Configuration**

- Leave trust models unchecked for now
- Keep URI storage as "On-Chain (Base64)" — this is the simplest option
- Skip custom metadata

Click "Next: Review →"

**7. Step 4 — Review & Deploy**

- Check the generated JSON looks correct
- See the estimated gas cost
- Click **"🚀 Register Agent On-Chain"**
- Confirm the transaction in MetaMask (~0.001 tBNB)

**8. Done!**

After ~3 seconds, you'll see:
- ✅ Your Agent ID (e.g., #7)
- Link to view on BscScan
- Options to create another or view your agents

**9. Verify on BscScan**

Click "View on BscScan" → you'll see your transaction with the `Registered` event.

---

## Tutorial 2: Build a Multi-Protocol Agent (10 minutes)

### Overview
Create an agent discoverable via both A2A and MCP protocols, with custom metadata.

### Steps

**1. Connect and start** (same as Tutorial 1)

**2. Identity**
```
Name:        DeFi Analytics Suite
Description: Multi-protocol agent providing DeFi analytics via A2A and MCP. 
             Supports portfolio tracking, yield comparison, and risk analysis 
             on BSC, Ethereum, and Base.
Image:       https://your-domain.com/agent-icon.png
```

**3. Services — Add two endpoints**

Service 1:
```
Type:     A2A
Endpoint: https://defi-agent.example/.well-known/agent-card.json
Version:  0.3.0
```

Click "+ Add Service"

Service 2:
```
Type:     MCP
Endpoint: https://mcp.defi-agent.example/
Version:  2025-06-18
```

**4. Configuration**

Trust models: ☑ Reputation-based, ☑ Crypto-economic

x402 Payments: ☑ Enable (if your agent charges per request)

URI Storage: On-Chain (Base64)

Custom metadata:
```
Key: category     Value: DeFi
Key: chains       Value: BSC, Ethereum, Base
Key: pricing      Value: 0.0001 BNB per request
```

**5. Review & Deploy**

Verify the JSON includes all services and metadata, then deploy.

---

## Tutorial 3: Integrate ERC-8004 into Your Website (15 minutes)

### Overview
Add an "Register as Agent" button to your existing website.

### Option A: Embed via iframe

```html
<iframe 
  src="https://erc8004.agency/" 
  width="100%" 
  height="900px" 
  style="border: none; border-radius: 12px;"
  title="ERC-8004 Agent Creator"
></iframe>
```

### Option B: Link to the creator

```html
<a href="https://erc8004.agency/" 
   target="_blank" 
   class="register-button">
  Register Your Agent On-Chain →
</a>
```

### Option C: Build custom registration

See the [Integration Guide](integration.md) for programmatic registration using ethers.js.

---

## Tutorial 4: Verify and Read Agent Data (10 minutes)

### Using BscScan

1. Go to the Identity Registry on BscScan:
   - Testnet: [`0x8004A818...BD9e`](https://testnet.bscscan.com/address/0x8004A818BFB912233c491871b3d84c89A494BD9e#readContract)
2. Click "Read Contract"
3. Try these functions:
   - `tokenURI(1)` — reads the registration JSON for Agent #1
   - `ownerOf(1)` — who owns Agent #1
   - `balanceOf(yourAddress)` — how many agents you own
   - `getVersion()` — contract version

### Using ethers.js

```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545');
const registry = new ethers.Contract(
  '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  ['function tokenURI(uint256) view returns (string)', 'function ownerOf(uint256) view returns (address)'],
  provider
);

const uri = await registry.tokenURI(1);
console.log('Agent URI:', uri);

// Decode on-chain base64
if (uri.startsWith('data:application/json;base64,')) {
  const json = JSON.parse(atob(uri.split(',')[1]));
  console.log('Name:', json.name);
  console.log('Services:', json.services);
}
```

### Using cast (Foundry)

```bash
# Read agent URI
cast call 0x8004A818BFB912233c491871b3d84c89A494BD9e \
  "tokenURI(uint256)" 1 \
  --rpc-url https://data-seed-prebsc-1-s1.bnbchain.org:8545

# Read owner
cast call 0x8004A818BFB912233c491871b3d84c89A494BD9e \
  "ownerOf(uint256)" 1 \
  --rpc-url https://data-seed-prebsc-1-s1.bnbchain.org:8545
```

---

## See Also

- [Examples](examples.md) — More code examples
- [Getting Started](getting-started.md) — Quick start
- [Integration Guide](integration.md) — Build on ERC-8004
