/**
 * ERC-8004 Contract ABIs and Helpers
 *
 * Three registries form the on-chain identity layer:
 *   - IdentityRegistry (ERC-721 NFT — agent identity)
 *   - ReputationRegistry (feedback & scoring)
 *   - ValidationRegistry (attestation & verification)
 *
 * @see https://erc8004.agency
 */

import { ethers } from 'ethers';
import { resolveChain, type ChainConfig } from './chains.js';

// ─── Identity Registry ABI ───
export const IDENTITY_ABI = [
  // Registration
  'function register() external returns (uint256 agentId)',
  'function register(string agentURI) external returns (uint256 agentId)',
  'function register(string agentURI, tuple(string metadataKey, bytes metadataValue)[] metadata) external returns (uint256 agentId)',

  // URI management
  'function setAgentURI(uint256 agentId, string newURI) external',
  'function tokenURI(uint256 tokenId) external view returns (string)',

  // Metadata
  'function setMetadata(uint256 agentId, string metadataKey, bytes metadataValue) external',
  'function getMetadata(uint256 agentId, string metadataKey) external view returns (bytes)',

  // Ownership
  'function getAgentWallet(uint256 agentId) external view returns (address)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)',

  // Enumeration
  'function getVersion() external pure returns (string)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',

  // Events
  'event Registered(uint256 indexed agentId, string agentURI, address indexed owner)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

// ─── Reputation Registry ABI ───
export const REPUTATION_ABI = [
  'function submitFeedback(uint256 agentId, int8 score, string comment) external',
  'function getFeedbackCount(uint256 agentId) external view returns (uint256)',
  'function getAverageScore(uint256 agentId) external view returns (int256)',
  'function getFeedback(uint256 agentId, uint256 index) external view returns (address reviewer, int8 score, string comment, uint256 timestamp)',

  'event FeedbackSubmitted(uint256 indexed agentId, address indexed reviewer, int8 score, string comment)',
];

// ─── Validation Registry ABI ───
export const VALIDATION_ABI = [
  'function validate(uint256 agentId, string attestationType, bytes attestationData) external',
  'function isValidated(uint256 agentId, string attestationType) external view returns (bool)',
  'function getValidation(uint256 agentId, string attestationType) external view returns (address validator, bytes attestationData, uint256 timestamp)',

  'event Validated(uint256 indexed agentId, address indexed validator, string attestationType)',
];

/**
 * Create a read-only provider for a chain.
 */
export function createProvider(
  chainOrRpc: string | number | ChainConfig
): ethers.JsonRpcProvider {
  if (typeof chainOrRpc === 'object' && 'rpcUrl' in chainOrRpc) {
    return new ethers.JsonRpcProvider(chainOrRpc.rpcUrl);
  }
  const chain = resolveChain(chainOrRpc as string | number);
  if (!chain) throw new Error(`Unknown chain: ${chainOrRpc}`);
  return new ethers.JsonRpcProvider(chain.rpcUrl);
}

/**
 * Create a wallet-connected signer for a chain.
 */
export function createSigner(
  privateKey: string,
  chainOrRpc: string | number | ChainConfig
): ethers.Wallet {
  const provider = createProvider(chainOrRpc);
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Get the Identity Registry contract (read-only or signer).
 */
export function identityRegistry(
  chain: ChainConfig,
  signerOrProvider?: ethers.Signer | ethers.Provider
): ethers.Contract {
  const backend =
    signerOrProvider ?? new ethers.JsonRpcProvider(chain.rpcUrl);
  return new ethers.Contract(chain.contracts.identity, IDENTITY_ABI, backend);
}

/**
 * Get the Reputation Registry contract (read-only or signer).
 */
export function reputationRegistry(
  chain: ChainConfig,
  signerOrProvider?: ethers.Signer | ethers.Provider
): ethers.Contract {
  if (!chain.contracts.reputation) {
    throw new Error(`Reputation registry not deployed on ${chain.name}`);
  }
  const backend =
    signerOrProvider ?? new ethers.JsonRpcProvider(chain.rpcUrl);
  return new ethers.Contract(
    chain.contracts.reputation,
    REPUTATION_ABI,
    backend
  );
}

/**
 * Get the Validation Registry contract (read-only or signer).
 */
export function validationRegistry(
  chain: ChainConfig,
  signerOrProvider?: ethers.Signer | ethers.Provider
): ethers.Contract {
  if (!chain.contracts.validation) {
    throw new Error(`Validation registry not deployed on ${chain.name}`);
  }
  const backend =
    signerOrProvider ?? new ethers.JsonRpcProvider(chain.rpcUrl);
  return new ethers.Contract(
    chain.contracts.validation,
    VALIDATION_ABI,
    backend
  );
}

/**
 * Decode a base64-encoded on-chain URI (data:application/json;base64,...).
 */
export function decodeOnChainURI(uri: string): Record<string, unknown> | null {
  try {
    if (uri.startsWith('data:application/json;base64,')) {
      const base64 = uri.replace('data:application/json;base64,', '');
      const json = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(json);
    }
    return JSON.parse(uri);
  } catch {
    return null;
  }
}
