# Extras

> Supplementary materials for the BNB Chain AI Toolkit hackathon submission.

---

## Demo Video

**Self-guided walkthrough** — follow these exact steps to experience the full product in under 5 minutes:

| Step | Action | Time |
|------|--------|------|
| 1 | Open [bnb-chain-toolkit.vercel.app](https://bnb-chain-toolkit.vercel.app/) | 0:00 |
| 2 | Browse the agent catalog — click any agent to see its full JSON config | 0:30 |
| 3 | Filter agents by category (Trading, Staking, Security, etc.) | 1:00 |
| 4 | Open [erc8004.agency](https://erc8004.agency/) — the Agent Creator platform | 1:30 |
| 5 | Connect MetaMask (BSC Testnet) and walk through agent registration flow | 2:00 |
| 6 | Verify the ERC-8004 contract on [BscScan](https://bscscan.com/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) — source code is verified | 3:00 |
| 7 | Open [mcp.ucai.tech](https://mcp.ucai.tech) — paste any ABI and generate an MCP server _(temporarily unavailable)_ | 3:30 |
| 8 | Clone the repo locally → `bun install && bun run dev` → see it run | 4:00 |

> **No video recording needed** — the live deployments *are* the demo. Judges can interact with everything in real-time.

## Slide Deck

The submission is code-first. For a narrative overview, see these documents in order:

1. **[PITCH.md](../PITCH.md)** — One-page pitch (problem → solution → competitive landscape → vision)
2. **[docs/PROJECT.md](PROJECT.md)** — Full project document (problem, solution, impact, roadmap)
3. **[docs/TECHNICAL.md](TECHNICAL.md)** — Architecture deep-dive with Mermaid diagrams
4. **[docs/AI_BUILD_LOG.md](AI_BUILD_LOG.md)** — How AI built an AI toolkit (recursive, yes)
5. **[HACKATHON.md](../HACKATHON.md)** — Primary submission with on-chain proof

Together these five documents cover: **Problem → Solution → Architecture → On-chain Proof → AI Usage → Roadmap**.

## Live Deployments

| Deployment | URL | Description |
|---|---|---|
| Agent Browser | https://bnb-chain-toolkit.vercel.app/ | Browse 78 AI agent definitions |
| ERC-8004 Agent Creator | https://erc8004.agency/ | Register AI agents as on-chain NFTs |
| UCAI Web Builder | https://mcp.ucai.tech _(temporarily unavailable)_ | Convert any ABI to an MCP server |
| GitHub Repo | https://github.com/nirholas/bnb-chain-toolkit | Full source code |

## Onchain Proof Links

| Network | Contract | Explorer Link |
|---|---|---|
| BSC Mainnet | IdentityRegistry | [0x8004A169…a432](https://bscscan.com/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) |
| BSC Mainnet | ReputationRegistry | [0x8004BAa1…b63](https://bscscan.com/address/0x8004BAa17C55a88189AE136b182e5fdA19dE9b63) |
| BSC Testnet | IdentityRegistry | [0x8004A818…d9e](https://testnet.bscscan.com/address/0x8004A818BFB912233c491871b3d84c89A494BD9e) |
| BSC Testnet | ReputationRegistry | [0x8004B663…713](https://testnet.bscscan.com/address/0x8004B663056A597Dffe9eCcC1965A193B7388713) |
| BSC Testnet | ValidationRegistry | [0x8004Cb1B…272](https://testnet.bscscan.com/address/0x8004Cb1BF31DAf7788923b405b754f57acEB4272) |
| BSC Testnet | First Deployment TX | [0xfc55d83d…962](https://testnet.bscscan.com/tx/0xfc55d83d20e6d92ff522f302fd3424d3fd5557f25c06f4bfc38ecf3246dc1962) |
| opBNB Testnet | IdentityRegistry | [0x8004A818…d9e](https://testnet.opbnbscan.com/address/0x8004A818BFB912233c491871b3d84c89A494BD9e) |
| opBNB Testnet | ReputationRegistry | [0x8004B663…713](https://testnet.opbnbscan.com/address/0x8004B663056A597Dffe9eCcC1965A193B7388713) |
| opBNB Testnet | ValidationRegistry | [0x8004Cb1B…272](https://testnet.opbnbscan.com/address/0x8004Cb1BF31DAf7788923b405b754f57acEB4272) |
| opBNB Mainnet | IdentityRegistry | [0x8004A169…a432](https://opbnbscan.com/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) |
| opBNB Mainnet | ReputationRegistry | [0x8004BAa1…b63](https://opbnbscan.com/address/0x8004BAa17C55a88189AE136b182e5fdA19dE9b63) |

> Contracts are deployed on 24 chains total — see `erc8004-agents/docs/contracts.md` for the full list.

## npm Packages

| Package | Install |
|---|---|
| BNB Chain MCP | `npx -y @nirholas/bnbchain-mcp` |
| Universal Crypto MCP | `npx -y @nirholas/universal-crypto-mcp` |

## Related Standards

| Standard | Description |
|---|---|
| ERC-8004 | On-chain AI agent identity & reputation protocol |
| W3AG | Web3 Accessibility Guidelines |

## Press & Community

| Type | Link | Description |
|------|------|-------------|
| GitHub | [github.com/nirholas/bnb-chain-toolkit](https://github.com/nirholas/bnb-chain-toolkit) | Source code — star to show support |
| npm | @nirholas/bnbchain-mcp _(coming soon)_ | MCP server package |
| X/Twitter | [@nichxbt](https://x.com/nichxbt) | Builder updates and announcements |
| BscScan | [0x8004A169…a432](https://bscscan.com/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) | Verified ERC-8004 contract |
| ERC-8004 Spec | [erc8004.md](../erc8004.md) | Full standard specification |
| llms.txt | [llms.txt](../llms.txt) | AI-discoverable project summary |

---

## Project Stats

| Metric | Count |
|--------|------:|
| AI Agents | 78 |
| MCP Servers | 6 |
| Total Tools | 1,100+ |
| Supported Chains | 60+ |
| Languages | 30+ |
| Original Standards | 2 |
| Test Suites | 888 tests passing |
| Documentation Files | 18 |
| On-chain Deployments | 24 chains |
| License | MIT |
