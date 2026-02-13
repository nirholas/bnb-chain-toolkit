#!/usr/bin/env node

/**
 * @nirholas/erc8004-mcp — MCP Server for ERC-8004 Trustless AI Agent Identity
 *
 * Exposes on-chain ERC-8004 contract interactions as Model Context Protocol
 * tools for AI assistants (Claude, ChatGPT, Cursor, Windsurf, etc.).
 *
 * Three registries:
 *   - IdentityRegistry — ERC-721 NFT agent identity
 *   - ReputationRegistry — On-chain reputation & feedback
 *   - ValidationRegistry — Attestation & verification
 *
 * Supports BSC, Ethereum, Sepolia, and planned L2 deployments.
 *
 * @see https://erc8004.agency
 * @see https://eips.ethereum.org/EIPS/eip-8004
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Identity tools
import {
  RegisterAgentSchema,
  GetAgentSchema,
  ListAgentsSchema,
  GetAgentCountSchema,
  SetURISchema,
  SearchAgentsSchema,
  registerAgent,
  getAgent,
  listAgents,
  getAgentCount,
  setURI,
  searchAgents,
} from './tools/identity.js';

// Reputation tools
import {
  SubmitReputationSchema,
  GetReputationSchema,
  submitReputation,
  getReputation,
} from './tools/reputation.js';

// Metadata tools
import {
  SetMetadataSchema,
  GetMetadataSchema,
  BatchGetMetadataSchema,
  setMetadata,
  getMetadata,
  batchGetMetadata,
} from './tools/metadata.js';

// Chain info
import { CHAINS, chainKeys } from './chains.js';

// ─── Create MCP Server ───

const server = new McpServer({
  name: 'erc8004-mcp',
  version: '1.0.0',
});

// ─── Identity Tools ───

server.tool(
  'register_agent',
  'Register a new ERC-8004 AI agent on-chain. Mints an ERC-721 NFT as the agent\'s on-chain identity. Supports optional metadata URI (HTTPS/IPFS/base64) and key-value metadata pairs. Requires PRIVATE_KEY env var.',
  RegisterAgentSchema.shape,
  async (args) => {
    try {
      const result = await registerAgent(RegisterAgentSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'get_agent',
  'Look up an ERC-8004 agent by token ID. Returns owner address, metadata URI (decoded if on-chain base64), contract version, and explorer link. Read-only — no private key required.',
  GetAgentSchema.shape,
  async (args) => {
    try {
      const result = await getAgent(GetAgentSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'list_agents',
  'List all ERC-8004 agents owned by a wallet address. Scans Transfer events and verifies current ownership. Returns agent IDs, URIs, and decoded metadata.',
  ListAgentsSchema.shape,
  async (args) => {
    try {
      const result = await listAgents(ListAgentsSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'get_agent_count',
  'Get the total number of registered ERC-8004 agents on a given chain. Uses binary search on sequential token IDs.',
  GetAgentCountSchema.shape,
  async (args) => {
    try {
      const result = await getAgentCount(GetAgentCountSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'set_uri',
  'Update an agent\'s metadata URI on-chain. Only the agent owner can call this. Requires PRIVATE_KEY env var.',
  SetURISchema.shape,
  async (args) => {
    try {
      const result = await setURI(SetURISchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'search_agents',
  'Search registered ERC-8004 agents by name, service type, or metadata content. Scans on-chain Registered events and optionally filters by query string.',
  SearchAgentsSchema.shape,
  async (args) => {
    try {
      const result = await searchAgents(SearchAgentsSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

// ─── Reputation Tools ───

server.tool(
  'submit_reputation',
  'Submit reputation feedback for an ERC-8004 agent. Score is int8 (-128 to 127). Feedback is stored on-chain in the ReputationRegistry. Requires PRIVATE_KEY env var.',
  SubmitReputationSchema.shape,
  async (args) => {
    try {
      const result = await submitReputation(SubmitReputationSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'get_reputation',
  'Get the on-chain reputation for an ERC-8004 agent. Returns total feedback count, average score, and recent feedback entries with reviewer address, score, comment, and timestamp.',
  GetReputationSchema.shape,
  async (args) => {
    try {
      const result = await getReputation(GetReputationSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

// ─── Metadata Tools ───

server.tool(
  'set_metadata',
  'Set on-chain key-value metadata for an ERC-8004 agent. Common keys: "version", "a2a.endpoint", "mcp.endpoint", "did", "ens", "x402.enabled". Only the agent owner can set metadata. Requires PRIVATE_KEY.',
  SetMetadataSchema.shape,
  async (args) => {
    try {
      const result = await setMetadata(SetMetadataSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'get_metadata',
  'Read a single on-chain metadata value for an ERC-8004 agent by key. Returns the decoded UTF-8 value and raw hex bytes. Read-only.',
  GetMetadataSchema.shape,
  async (args) => {
    try {
      const result = await getMetadata(GetMetadataSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

server.tool(
  'batch_get_metadata',
  'Read multiple on-chain metadata values for an ERC-8004 agent in one call. Provide a list of keys to look up. Returns a map of key → {value, rawBytes}.',
  BatchGetMetadataSchema.shape,
  async (args) => {
    try {
      const result = await batchGetMetadata(BatchGetMetadataSchema.parse(args));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

// ─── Resources ───

server.resource(
  'chains',
  'erc8004://chains',
  async () => ({
    contents: [
      {
        uri: 'erc8004://chains',
        mimeType: 'application/json',
        text: JSON.stringify(CHAINS, null, 2),
      },
    ],
  })
);

// ─── Start ───

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ERC-8004 MCP Server running on stdio');
  console.error(`Supported chains: ${chainKeys().join(', ')}`);
  console.error(`Write operations: ${process.env.PRIVATE_KEY ? 'enabled' : 'disabled (set PRIVATE_KEY)'}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
