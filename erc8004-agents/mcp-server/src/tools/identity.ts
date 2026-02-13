/**
 * Identity Tools — Register, discover, and manage ERC-8004 agent identities.
 *
 * Each agent is an ERC-721 NFT on-chain with a URI pointing to metadata.
 * Supports BSC, Ethereum, and multiple L2 networks.
 */

import { z } from 'zod';
import { ethers } from 'ethers';
import {
  identityRegistry,
  createSigner,
  createProvider,
  decodeOnChainURI,
} from '../contracts.js';
import { resolveChain, chainKeys, type ChainConfig } from '../chains.js';

// ─── Schemas ───

export const RegisterAgentSchema = z.object({
  chain: z
    .string()
    .describe(
      `Chain key or ID. Options: ${chainKeys().join(', ')}`
    ),
  agentURI: z
    .string()
    .optional()
    .describe(
      'Agent metadata URI (HTTPS, IPFS, or base64-encoded data URI). If omitted, registers without URI.'
    ),
  metadata: z
    .array(
      z.object({
        key: z.string().describe('Metadata key (e.g., "version", "a2a.endpoint")'),
        value: z.string().describe('Metadata value (will be ABI-encoded as bytes)'),
      })
    )
    .optional()
    .describe('Optional on-chain key-value metadata entries.'),
});

export const GetAgentSchema = z.object({
  chain: z.string().describe('Chain key or ID'),
  agentId: z.string().describe('Agent token ID (numeric string)'),
});

export const ListAgentsSchema = z.object({
  chain: z.string().describe('Chain key or ID'),
  address: z.string().describe('Owner wallet address (0x...)'),
});

export const GetAgentCountSchema = z.object({
  chain: z.string().describe('Chain key or ID'),
});

export const SetURISchema = z.object({
  chain: z.string().describe('Chain key or ID'),
  agentId: z.string().describe('Agent token ID'),
  newURI: z.string().describe('New metadata URI'),
});

export const SearchAgentsSchema = z.object({
  chain: z.string().describe('Chain key or ID'),
  query: z
    .string()
    .optional()
    .describe('Search query to match against agent URIs/names'),
  fromBlock: z
    .number()
    .optional()
    .describe('Starting block number (default: 0)'),
  limit: z
    .number()
    .optional()
    .describe('Max results to return (default: 50)'),
});

// ─── Helpers ───

function requireChain(input: string): ChainConfig {
  const chain = resolveChain(input);
  if (!chain) {
    throw new Error(
      `Unknown chain "${input}". Supported: ${chainKeys().join(', ')}`
    );
  }
  return chain;
}

function requirePrivateKey(): string {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) {
    throw new Error(
      'PRIVATE_KEY environment variable required for write operations.'
    );
  }
  return pk;
}

// ─── Tool Implementations ───

export async function registerAgent(
  args: z.infer<typeof RegisterAgentSchema>
) {
  const chain = requireChain(args.chain);
  const pk = requirePrivateKey();
  const signer = createSigner(pk, chain);
  const registry = identityRegistry(chain, signer);

  let tx: ethers.TransactionResponse;

  if (args.metadata && args.metadata.length > 0) {
    // Register with URI + metadata
    const metadataEntries = args.metadata.map((m) => ({
      metadataKey: m.key,
      metadataValue: ethers.toUtf8Bytes(m.value),
    }));
    tx = await registry['register(string,tuple(string,bytes)[])'](
      args.agentURI ?? '',
      metadataEntries
    );
  } else if (args.agentURI) {
    // Register with URI only
    tx = await registry['register(string)'](args.agentURI);
  } else {
    // Register with no URI
    tx = await registry['register()']();
  }

  const receipt = await tx.wait();
  if (!receipt) throw new Error('Transaction failed — no receipt');

  // Parse Registered event
  const iface = new ethers.Interface([
    'event Registered(uint256 indexed agentId, string agentURI, address indexed owner)',
  ]);
  let agentId: string | null = null;
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
      if (parsed?.name === 'Registered') {
        agentId = parsed.args.agentId.toString();
        break;
      }
    } catch {
      // Skip non-matching logs
    }
  }

  return {
    success: true,
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    agentId,
    chain: chain.name,
    explorer: `${chain.explorer}/tx/${receipt.hash}`,
    agentRegistry: chain.agentRegistry,
  };
}

export async function getAgent(args: z.infer<typeof GetAgentSchema>) {
  const chain = requireChain(args.chain);
  const registry = identityRegistry(chain);

  const tokenId = BigInt(args.agentId);

  // Parallel reads
  const [owner, uri, version] = await Promise.all([
    registry.ownerOf(tokenId).catch(() => null),
    registry.tokenURI(tokenId).catch(() => null),
    registry.getVersion().catch(() => 'unknown'),
  ]);

  if (!owner) {
    return { found: false, agentId: args.agentId, chain: chain.name };
  }

  // Decode on-chain URI if applicable
  const decoded = uri ? decodeOnChainURI(uri) : null;

  return {
    found: true,
    agentId: args.agentId,
    chain: chain.name,
    owner,
    uri,
    metadata: decoded,
    contractVersion: version,
    explorer: `${chain.explorer}/token/${chain.contracts.identity}?a=${args.agentId}`,
  };
}

export async function listAgents(args: z.infer<typeof ListAgentsSchema>) {
  const chain = requireChain(args.chain);
  const provider = createProvider(chain);
  const registry = identityRegistry(chain, provider);

  // Get balance
  const balance = await registry.balanceOf(args.address);
  const count = Number(balance);

  if (count === 0) {
    return { address: args.address, chain: chain.name, agents: [], count: 0 };
  }

  // Scan Transfer events to find owned tokens
  const filter = registry.filters.Transfer(null, args.address);
  const events = await registry.queryFilter(filter, 0, 'latest');

  const ownedAgents: Array<{
    agentId: string;
    uri: string | null;
    metadata: Record<string, unknown> | null;
  }> = [];

  for (const event of events) {
    const log = event as ethers.EventLog;
    const agentId = log.args[2].toString(); // tokenId

    // Verify current ownership
    try {
      const currentOwner = await registry.ownerOf(agentId);
      if (currentOwner.toLowerCase() === args.address.toLowerCase()) {
        const uri = await registry.tokenURI(agentId).catch(() => null);
        ownedAgents.push({
          agentId,
          uri,
          metadata: uri ? decodeOnChainURI(uri) : null,
        });
      }
    } catch {
      // Token was transferred away
    }
  }

  return {
    address: args.address,
    chain: chain.name,
    count: ownedAgents.length,
    agents: ownedAgents,
  };
}

export async function getAgentCount(
  args: z.infer<typeof GetAgentCountSchema>
) {
  const chain = requireChain(args.chain);
  const registry = identityRegistry(chain);

  // Binary search for highest token ID (ERC-721 sequential minting)
  let low = 1;
  let high = 100000;
  let count = 0;

  // First, check if token 1 exists
  try {
    await registry.ownerOf(1);
  } catch {
    return { chain: chain.name, count: 0 };
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    try {
      await registry.ownerOf(mid);
      count = mid;
      low = mid + 1;
    } catch {
      high = mid - 1;
    }
  }

  return { chain: chain.name, count };
}

export async function setURI(args: z.infer<typeof SetURISchema>) {
  const chain = requireChain(args.chain);
  const pk = requirePrivateKey();
  const signer = createSigner(pk, chain);
  const registry = identityRegistry(chain, signer);

  const tx = await registry.setAgentURI(BigInt(args.agentId), args.newURI);
  const receipt = await tx.wait();

  return {
    success: true,
    agentId: args.agentId,
    newURI: args.newURI,
    transactionHash: receipt.hash,
    explorer: `${chain.explorer}/tx/${receipt.hash}`,
  };
}

export async function searchAgents(
  args: z.infer<typeof SearchAgentsSchema>
) {
  const chain = requireChain(args.chain);
  const provider = createProvider(chain);
  const registry = identityRegistry(chain, provider);

  const fromBlock = args.fromBlock ?? 0;
  const limit = args.limit ?? 50;

  // Query Registered events
  const filter = registry.filters.Registered();
  const events = await registry.queryFilter(filter, fromBlock, 'latest');

  const results: Array<{
    agentId: string;
    owner: string;
    uri: string;
    blockNumber: number;
  }> = [];

  for (const event of events) {
    if (results.length >= limit) break;

    const log = event as ethers.EventLog;
    const agentId = log.args[0].toString();
    const uri = log.args[1] as string;
    const owner = log.args[2] as string;

    // Filter by query if provided
    if (args.query) {
      const q = args.query.toLowerCase();
      const matchURI = uri.toLowerCase().includes(q);

      // Try to decode and search metadata
      let matchMeta = false;
      if (uri) {
        const decoded = decodeOnChainURI(uri);
        if (decoded) {
          matchMeta = JSON.stringify(decoded).toLowerCase().includes(q);
        }
      }

      if (!matchURI && !matchMeta) continue;
    }

    results.push({
      agentId,
      owner,
      uri,
      blockNumber: log.blockNumber,
    });
  }

  return {
    chain: chain.name,
    query: args.query ?? null,
    count: results.length,
    results,
  };
}
