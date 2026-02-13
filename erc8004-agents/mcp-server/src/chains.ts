/**
 * ERC-8004 Chain Configurations
 *
 * Deterministic CREATE2 addresses share the 0x8004 vanity prefix.
 * BSC Mainnet / Ethereum Mainnet use a separate deployment bytecode.
 *
 * @see https://erc8004.agency
 * @see https://github.com/erc-8004/erc-8004-contracts
 */

export interface ChainConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorer: string;
  currency: { name: string; symbol: string; decimals: number };
  contracts: {
    identity: string;
    reputation: string;
    validation?: string;
  };
  agentRegistry: string;
  testnet: boolean;
}

/**
 * Deterministic CREATE2 addresses — identical on every testnet chain.
 */
const TESTNET_CONTRACTS = {
  identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
  validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
} as const;

/**
 * Mainnet addresses — separate deployment bytecode, still 0x8004 prefix.
 */
const MAINNET_CONTRACTS = {
  identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
} as const;

export const CHAINS: Record<string, ChainConfig> = {
  // ─── BSC ───
  'bsc-testnet': {
    name: 'BSC Testnet',
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    explorer: 'https://testnet.bscscan.com',
    currency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
    contracts: { ...TESTNET_CONTRACTS },
    agentRegistry: `eip155:97:${TESTNET_CONTRACTS.identity}`,
    testnet: true,
  },
  'bsc-mainnet': {
    name: 'BSC Mainnet',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.bnbchain.org',
    explorer: 'https://bscscan.com',
    currency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    contracts: { ...MAINNET_CONTRACTS },
    agentRegistry: `eip155:56:${MAINNET_CONTRACTS.identity}`,
    testnet: false,
  },

  // ─── Ethereum ───
  'ethereum': {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    currency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    contracts: { ...MAINNET_CONTRACTS },
    agentRegistry: `eip155:1:${MAINNET_CONTRACTS.identity}`,
    testnet: false,
  },
  'sepolia': {
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    currency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    contracts: { ...TESTNET_CONTRACTS },
    agentRegistry: `eip155:11155111:${TESTNET_CONTRACTS.identity}`,
    testnet: true,
  },

  // ─── L2s (planned — same deterministic addresses) ───
  'base-sepolia': {
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    currency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    contracts: { ...TESTNET_CONTRACTS },
    agentRegistry: `eip155:84532:${TESTNET_CONTRACTS.identity}`,
    testnet: true,
  },
  'arbitrum-sepolia': {
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: 'https://sepolia.arbiscan.io',
    currency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    contracts: { ...TESTNET_CONTRACTS },
    agentRegistry: `eip155:421614:${TESTNET_CONTRACTS.identity}`,
    testnet: true,
  },
  'optimism-sepolia': {
    name: 'Optimism Sepolia',
    chainId: 11155420,
    rpcUrl: 'https://sepolia.optimism.io',
    explorer: 'https://sepolia-optimistic.etherscan.io',
    currency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    contracts: { ...TESTNET_CONTRACTS },
    agentRegistry: `eip155:11155420:${TESTNET_CONTRACTS.identity}`,
    testnet: true,
  },
  'polygon-amoy': {
    name: 'Polygon Amoy',
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorer: 'https://amoy.polygonscan.com',
    currency: { name: 'POL', symbol: 'POL', decimals: 18 },
    contracts: { ...TESTNET_CONTRACTS },
    agentRegistry: `eip155:80002:${TESTNET_CONTRACTS.identity}`,
    testnet: true,
  },
};

/**
 * Resolve a chain config by chain ID, name, or key.
 */
export function resolveChain(input: string | number): ChainConfig | undefined {
  // Direct key match
  if (typeof input === 'string' && CHAINS[input]) return CHAINS[input];

  // Chain ID match
  const chainId = typeof input === 'number' ? input : parseInt(input, 10);
  if (!isNaN(chainId)) {
    return Object.values(CHAINS).find((c) => c.chainId === chainId);
  }

  // Fuzzy name match
  const normalized = String(input).toLowerCase().replace(/[\s-_]/g, '');
  return Object.values(CHAINS).find(
    (c) => c.name.toLowerCase().replace(/[\s-_]/g, '') === normalized
  );
}

/**
 * Get all supported chain IDs.
 */
export function supportedChainIds(): number[] {
  return Object.values(CHAINS).map((c) => c.chainId);
}

/**
 * Get all chain keys (e.g., "bsc-testnet", "ethereum").
 */
export function chainKeys(): string[] {
  return Object.keys(CHAINS);
}
