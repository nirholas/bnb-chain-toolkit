/**
 * Metadata Tools — Read and write on-chain key-value metadata for agents.
 *
 * Each agent (ERC-721 token) can store arbitrary key-value pairs on-chain.
 * Keys are strings; values are ABI-encoded bytes.
 * Common keys: "version", "a2a.endpoint", "mcp.endpoint", "did", "ens"
 */

import { z } from 'zod';
import { ethers } from 'ethers';
import {
  identityRegistry,
  createSigner,
} from '../contracts.js';
import { resolveChain, chainKeys, type ChainConfig } from '../chains.js';

// ─── Schemas ───

export const SetMetadataSchema = z.object({
  chain: z
    .string()
    .describe(`Chain key or ID. Options: ${chainKeys().join(', ')}`),
  agentId: z.string().describe('Agent token ID'),
  key: z
    .string()
    .describe(
      'Metadata key (e.g., "version", "a2a.endpoint", "mcp.endpoint", "did", "ens", "x402.enabled")'
    ),
  value: z.string().describe('Metadata value (will be UTF-8 encoded to bytes)'),
});

export const GetMetadataSchema = z.object({
  chain: z.string().describe('Chain key or ID'),
  agentId: z.string().describe('Agent token ID'),
  key: z
    .string()
    .describe(
      'Metadata key to look up (e.g., "version", "a2a.endpoint")'
    ),
});

export const BatchGetMetadataSchema = z.object({
  chain: z.string().describe('Chain key or ID'),
  agentId: z.string().describe('Agent token ID'),
  keys: z
    .array(z.string())
    .describe('List of metadata keys to look up'),
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

export async function setMetadata(args: z.infer<typeof SetMetadataSchema>) {
  const chain = requireChain(args.chain);
  const pk = requirePrivateKey();
  const signer = createSigner(pk, chain);
  const registry = identityRegistry(chain, signer);

  const valueBytes = ethers.toUtf8Bytes(args.value);

  const tx = await registry.setMetadata(
    BigInt(args.agentId),
    args.key,
    valueBytes
  );
  const receipt = await tx.wait();

  return {
    success: true,
    agentId: args.agentId,
    key: args.key,
    value: args.value,
    transactionHash: receipt.hash,
    chain: chain.name,
    explorer: `${chain.explorer}/tx/${receipt.hash}`,
  };
}

export async function getMetadata(args: z.infer<typeof GetMetadataSchema>) {
  const chain = requireChain(args.chain);
  const registry = identityRegistry(chain);

  const raw = await registry.getMetadata(BigInt(args.agentId), args.key);

  // Decode bytes to UTF-8 string
  let value: string;
  try {
    value = ethers.toUtf8String(raw);
  } catch {
    // Return hex if not valid UTF-8
    value = raw;
  }

  return {
    agentId: args.agentId,
    chain: chain.name,
    key: args.key,
    value,
    rawBytes: raw,
  };
}

export async function batchGetMetadata(
  args: z.infer<typeof BatchGetMetadataSchema>
) {
  const chain = requireChain(args.chain);
  const registry = identityRegistry(chain);
  const agentId = BigInt(args.agentId);

  const results: Record<
    string,
    { value: string; rawBytes: string }
  > = {};

  await Promise.all(
    args.keys.map(async (key) => {
      try {
        const raw = await registry.getMetadata(agentId, key);
        let value: string;
        try {
          value = ethers.toUtf8String(raw);
        } catch {
          value = raw;
        }
        results[key] = { value, rawBytes: raw };
      } catch {
        results[key] = { value: '', rawBytes: '0x' };
      }
    })
  );

  return {
    agentId: args.agentId,
    chain: chain.name,
    metadata: results,
  };
}
