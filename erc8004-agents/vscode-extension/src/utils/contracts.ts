/**
 * ERC-8004 Contract ABIs and addresses for all supported networks.
 */

/** Minimal Identity Registry ABI for agent operations */
export const IDENTITY_ABI = [
  'function register() external returns (uint256 agentId)',
  'function register(string agentURI) external returns (uint256 agentId)',
  'function register(string agentURI, tuple(string metadataKey, bytes metadataValue)[] metadata) external returns (uint256 agentId)',
  'function setAgentURI(uint256 agentId, string newURI) external',
  'function setMetadata(uint256 agentId, string metadataKey, bytes metadataValue) external',
  'function getMetadata(uint256 agentId, string metadataKey) external view returns (bytes)',
  'function getAgentWallet(uint256 agentId) external view returns (address)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function getVersion() external pure returns (string)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'event Registered(uint256 indexed agentId, string agentURI, address indexed owner)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

/** Reputation Registry ABI */
export const REPUTATION_ABI = [
  'function submitFeedback(uint256 agentId, uint8 rating, string comment) external',
  'function getFeedbackCount(uint256 agentId) external view returns (uint256)',
  'function getAverageRating(uint256 agentId) external view returns (uint256)',
  'function getFeedback(uint256 agentId, uint256 index) external view returns (address reviewer, uint8 rating, string comment, uint256 timestamp)',
  'event FeedbackSubmitted(uint256 indexed agentId, address indexed reviewer, uint8 rating)',
];

/** Validation Registry ABI */
export const VALIDATION_ABI = [
  'function validate(uint256 agentId) external view returns (bool)',
  'function addValidator(address validator) external',
  'function removeValidator(address validator) external',
  'function isValidator(address account) external view returns (bool)',
];

/** Contract addresses per network */
export const CONTRACT_ADDRESSES: Record<string, {
  identity: string;
  reputation: string;
  validation: string;
}> = {
  'bsc-testnet': {
    identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
    validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
  },
  'bsc-mainnet': {
    identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
    validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
  },
  'eth-sepolia': {
    identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
    validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
  },
  'eth-mainnet': {
    identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
    validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
  },
};

/**
 * Get contract addresses for a given chain key.
 */
export function getContracts(chainKey: string) {
  const addresses = CONTRACT_ADDRESSES[chainKey];
  if (!addresses) {
    throw new Error(`Unsupported chain: ${chainKey}`);
  }
  return addresses;
}
