/**
 * Reputation Tools — Submit and query agent reputation on-chain.
 *
 * The ReputationRegistry allows anyone to submit scored feedback for agents,
 * building a decentralized, transparent reputation layer for autonomous AI agents.
 */

import { z } from 'zod';
import {
  reputationRegistry,
  createSigner,
} from '../contracts.js';
import { resolveChain, chainKeys, type ChainConfig } from '../chains.js';

// ─── Schemas ───

export const SubmitReputationSchema = z.object({
  chain: z
    .string()
    .describe(`Chain key or ID. Options: ${chainKeys().join(', ')}`),
  agentId: z.string().describe('Agent token ID'),
  score: z
    .number()
    .int()
    .min(-128)
    .max(127)
    .describe('Reputation score (-128 to 127, int8). Positive = good, negative = bad.'),
  comment: z
    .string()
    .describe('Feedback comment explaining the score'),
});

export const GetReputationSchema = z.object({
  chain: z.string().describe('Chain key or ID'),
  agentId: z.string().describe('Agent token ID'),
  limit: z
    .number()
    .optional()
    .describe('Max feedback entries to return (default: 20)'),
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

export async function submitReputation(
  args: z.infer<typeof SubmitReputationSchema>
) {
  const chain = requireChain(args.chain);
  const pk = requirePrivateKey();
  const signer = createSigner(pk, chain);
  const registry = reputationRegistry(chain, signer);

  const tx = await registry.submitFeedback(
    BigInt(args.agentId),
    args.score,
    args.comment
  );
  const receipt = await tx.wait();

  return {
    success: true,
    agentId: args.agentId,
    score: args.score,
    comment: args.comment,
    transactionHash: receipt.hash,
    chain: chain.name,
    explorer: `${chain.explorer}/tx/${receipt.hash}`,
  };
}

export async function getReputation(
  args: z.infer<typeof GetReputationSchema>
) {
  const chain = requireChain(args.chain);
  const registry = reputationRegistry(chain);
  const agentId = BigInt(args.agentId);
  const limit = args.limit ?? 20;

  // Parallel reads
  const [feedbackCount, averageScore] = await Promise.all([
    registry.getFeedbackCount(agentId).catch(() => BigInt(0)),
    registry.getAverageScore(agentId).catch(() => BigInt(0)),
  ]);

  const count = Number(feedbackCount);
  const entries: Array<{
    reviewer: string;
    score: number;
    comment: string;
    timestamp: number;
  }> = [];

  // Fetch individual feedback entries (most recent first)
  const start = Math.max(0, count - limit);
  for (let i = count - 1; i >= start; i--) {
    try {
      const [reviewer, score, comment, timestamp] =
        await registry.getFeedback(agentId, i);
      entries.push({
        reviewer,
        score: Number(score),
        comment,
        timestamp: Number(timestamp),
      });
    } catch {
      // Skip inaccessible entries
    }
  }

  return {
    agentId: args.agentId,
    chain: chain.name,
    totalFeedback: count,
    averageScore: Number(averageScore),
    recentFeedback: entries,
  };
}
