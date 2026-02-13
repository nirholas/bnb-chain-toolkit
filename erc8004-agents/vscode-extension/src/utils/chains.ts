/**
 * Supported chain configurations for ERC-8004 agent operations.
 */

export interface ChainConfig {
  key: string;
  name: string;
  chainId: number;
  chainIdHex: string;
  rpcUrl: string;
  explorer: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  faucetUrl?: string;
  agentRegistry: string;
}

export const CHAINS: Record<string, ChainConfig> = {
  'bsc-testnet': {
    key: 'bsc-testnet',
    name: 'BSC Testnet',
    chainId: 97,
    chainIdHex: '0x61',
    rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    explorer: 'https://testnet.bscscan.com',
    currency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
    isTestnet: true,
    faucetUrl: 'https://www.bnbchain.org/en/testnet-faucet',
    agentRegistry: 'eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'bsc-mainnet': {
    key: 'bsc-mainnet',
    name: 'BSC Mainnet',
    chainId: 56,
    chainIdHex: '0x38',
    rpcUrl: 'https://bsc-dataseed.bnbchain.org',
    explorer: 'https://bscscan.com',
    currency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    isTestnet: false,
    agentRegistry: 'eip155:56:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'eth-sepolia': {
    key: 'eth-sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    currency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    faucetUrl: 'https://sepoliafaucet.com',
    agentRegistry: 'eip155:11155111:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'eth-mainnet': {
    key: 'eth-mainnet',
    name: 'Ethereum Mainnet',
    chainId: 1,
    chainIdHex: '0x1',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    currency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    agentRegistry: 'eip155:1:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
};

/**
 * Get chain config by key name.
 */
export function getChain(key: string): ChainConfig {
  const chain = CHAINS[key];
  if (!chain) {
    throw new Error(`Unknown chain: ${key}. Supported: ${Object.keys(CHAINS).join(', ')}`);
  }
  return chain;
}

/**
 * Get chain config by chain ID.
 */
export function getChainById(chainId: number): ChainConfig | undefined {
  return Object.values(CHAINS).find((c) => c.chainId === chainId);
}

/**
 * Get all chain keys.
 */
export function getChainKeys(): string[] {
  return Object.keys(CHAINS);
}

/**
 * Get explorer URL for a transaction hash.
 */
export function getTxUrl(chainKey: string, txHash: string): string {
  const chain = getChain(chainKey);
  return `${chain.explorer}/tx/${txHash}`;
}

/**
 * Get explorer URL for an address.
 */
export function getAddressUrl(chainKey: string, address: string): string {
  const chain = getChain(chainKey);
  return `${chain.explorer}/address/${address}`;
}

/**
 * Get explorer URL for a token ID.
 */
export function getTokenUrl(chainKey: string, contractAddress: string, tokenId: string): string {
  const chain = getChain(chainKey);
  return `${chain.explorer}/token/${contractAddress}?a=${tokenId}`;
}
