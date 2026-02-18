/**
 * CLI configuration management.
 * Stores config at ~/.erc8004/config.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ethers } from 'ethers';
import inquirer from 'inquirer';
import chalk from 'chalk';

const CONFIG_DIR = path.join(os.homedir(), '.erc8004');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export interface CliConfig {
  defaultChain: string;
  /** @deprecated Use `keystore` instead. Will be auto-migrated. */
  privateKey?: string;
  /** Encrypted JSON keystore (ethers v6 format) */
  keystore?: string;
  customRpcUrls: Record<string, string>;
}

const DEFAULT_CONFIG: CliConfig = {
  defaultChain: 'bsc-testnet',
  customRpcUrls: {},
};

/**
 * Load config from disk.
 * Automatically migrates plaintext privateKey → encrypted keystore on first access.
 */
export function loadConfig(): CliConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // Fall through to default
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Check for legacy plaintext privateKey and migrate to encrypted keystore.
 * Should be called once at CLI startup for write commands.
 */
export async function migrateConfigIfNeeded(): Promise<void> {
  const config = loadConfig();
  if (config.privateKey && !config.keystore) {
    console.log(chalk.yellow('\n  ⚠ Migrating plaintext private key to encrypted keystore...'));
    console.log(chalk.yellow('  Your private key is currently stored in plaintext. This is insecure.\n'));

    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Set an encryption password for your keystore (min 8 chars):',
        mask: '*',
        validate: (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
      },
    ]);
    const { confirm } = await inquirer.prompt([
      {
        type: 'password',
        name: 'confirm',
        message: 'Confirm password:',
        mask: '*',
      },
    ]);
    if (password !== confirm) {
      console.log(chalk.red('  Passwords do not match. Migration skipped. Will retry next run.\n'));
      return;
    }

    try {
      const wallet = new ethers.Wallet(config.privateKey);
      const keystoreJson = await wallet.encrypt(password);
      config.keystore = keystoreJson;
      delete config.privateKey;
      saveConfig(config);
      console.log(chalk.green('  ✔ Private key encrypted and stored as keystore.'));
      console.log(chalk.green(`  ✔ Wallet address: ${wallet.address}\n`));
    } catch (err: any) {
      console.log(chalk.red(`  Migration failed: ${err.message}. Plaintext key left unchanged.\n`));
    }
  }
}

/**
 * Prompt the user for a keystore password interactively.
 */
export async function promptKeystorePassword(): Promise<string> {
  const { password } = await inquirer.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Keystore password:',
      mask: '*',
    },
  ]);
  return password;
}

/**
 * Resolve a wallet from the available sources (in priority order):
 * 1. --key flag (deprecated, with warning)
 * 2. --keystore + --keystore-password flags
 * 3. ERC8004_PRIVATE_KEY env var (for CI)
 * 4. Encrypted keystore in config (prompts for password)
 * 5. Legacy plaintext privateKey in config (deprecated)
 *
 * Returns null if no wallet can be resolved.
 */
export async function getWallet(options: {
  key?: string;
  keystore?: string;
  keystorePassword?: string;
}): Promise<ethers.Wallet | null> {
  // 1. --key flag (deprecated)
  if (options.key) {
    console.log(chalk.yellow('  ⚠ Warning: Passing private keys via CLI flags is insecure. Consider using `erc8004 wallet import` instead.'));
    return new ethers.Wallet(options.key);
  }

  // 2. --keystore file flag
  if (options.keystore) {
    const ksPath = path.resolve(options.keystore);
    if (!fs.existsSync(ksPath)) {
      console.log(chalk.red(`  Keystore file not found: ${ksPath}`));
      return null;
    }
    const ksContent = fs.readFileSync(ksPath, 'utf-8');
    const password = options.keystorePassword || await promptKeystorePassword();
    try {
      return (await ethers.Wallet.fromEncryptedJson(ksContent, password)) as ethers.Wallet;
    } catch {
      console.log(chalk.red('  Failed to decrypt keystore file. Wrong password?'));
      return null;
    }
  }

  // 3. Env var
  if (process.env.ERC8004_PRIVATE_KEY) {
    return new ethers.Wallet(process.env.ERC8004_PRIVATE_KEY);
  }

  // 4. Encrypted keystore in config
  const config = loadConfig();
  if (config.keystore) {
    const password = await promptKeystorePassword();
    try {
      return (await ethers.Wallet.fromEncryptedJson(config.keystore, password)) as ethers.Wallet;
    } catch {
      console.log(chalk.red('  Failed to decrypt stored keystore. Wrong password?'));
      return null;
    }
  }

  // 5. Legacy plaintext key (deprecated)
  if (config.privateKey) {
    console.log(chalk.yellow('  ⚠ Using legacy plaintext key from config. Run `erc8004 wallet import` to encrypt it.'));
    return new ethers.Wallet(config.privateKey);
  }

  return null;
}

/**
 * Save config to disk.
 */
export function saveConfig(config: CliConfig): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  // Restrict permissions on config file (contains private key)
  fs.chmodSync(CONFIG_FILE, 0o600);
}

/**
 * Update a single config field.
 */
export function updateConfig(updates: Partial<CliConfig>): CliConfig {
  const config = loadConfig();
  Object.assign(config, updates);
  saveConfig(config);
  return config;
}

/**
 * Chain configurations — shared with the extension.
 */
export interface ChainConfig {
  key: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  explorer: string;
  currency: string;
  isTestnet: boolean;
  contracts: {
    identity: string;
    reputation: string;
    validation: string;
  };
  agentRegistry: string;
}

export const CHAINS: Record<string, ChainConfig> = {
  'bsc-testnet': {
    key: 'bsc-testnet',
    name: 'BSC Testnet',
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    explorer: 'https://testnet.bscscan.com',
    currency: 'tBNB',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'bsc-mainnet': {
    key: 'bsc-mainnet',
    name: 'BSC Mainnet',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.bnbchain.org',
    explorer: 'https://bscscan.com',
    currency: 'BNB',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:56:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'opbnb-testnet': {
    key: 'opbnb-testnet',
    name: 'opBNB Testnet',
    chainId: 5611,
    rpcUrl: 'https://opbnb-testnet-rpc.bnbchain.org',
    explorer: 'https://testnet.opbnbscan.com',
    currency: 'tBNB',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:5611:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'opbnb-mainnet': {
    key: 'opbnb-mainnet',
    name: 'opBNB',
    chainId: 204,
    rpcUrl: 'https://opbnb-mainnet-rpc.bnbchain.org',
    explorer: 'https://opbnbscan.com',
    currency: 'BNB',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:204:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'eth-sepolia': {
    key: 'eth-sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:11155111:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'eth-mainnet': {
    key: 'eth-mainnet',
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    currency: 'ETH',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:1:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'base-sepolia': {
    key: 'base-sepolia',
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    currency: 'ETH',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:84532:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'base-mainnet': {
    key: 'base-mainnet',
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    currency: 'ETH',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'arb-sepolia': {
    key: 'arb-sepolia',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: 'https://sepolia.arbiscan.io',
    currency: 'ETH',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:421614:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'arb-mainnet': {
    key: 'arb-mainnet',
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    currency: 'ETH',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:42161:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'op-sepolia': {
    key: 'op-sepolia',
    name: 'Optimism Sepolia',
    chainId: 11155420,
    rpcUrl: 'https://sepolia.optimism.io',
    explorer: 'https://sepolia-optimism.etherscan.io',
    currency: 'ETH',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:11155420:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'op-mainnet': {
    key: 'op-mainnet',
    name: 'Optimism',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    currency: 'ETH',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:10:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'polygon-amoy': {
    key: 'polygon-amoy',
    name: 'Polygon Amoy',
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorer: 'https://amoy.polygonscan.com',
    currency: 'MATIC',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:80002:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'polygon-mainnet': {
    key: 'polygon-mainnet',
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    currency: 'MATIC',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:137:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'avax-fuji': {
    key: 'avax-fuji',
    name: 'Avalanche Fuji',
    chainId: 43113,
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorer: 'https://testnet.snowtrace.io',
    currency: 'AVAX',
    isTestnet: true,
    contracts: {
      identity: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      reputation: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:43113:0x8004A818BFB912233c491871b3d84c89A494BD9e',
  },
  'avax-mainnet': {
    key: 'avax-mainnet',
    name: 'Avalanche C-Chain',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    currency: 'AVAX',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:43114:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'linea': {
    key: 'linea',
    name: 'Linea',
    chainId: 59144,
    rpcUrl: 'https://rpc.linea.build',
    explorer: 'https://lineascan.build',
    currency: 'ETH',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:59144:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'scroll': {
    key: 'scroll',
    name: 'Scroll',
    chainId: 534352,
    rpcUrl: 'https://rpc.scroll.io',
    explorer: 'https://scrollscan.com',
    currency: 'ETH',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:534352:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'zksync': {
    key: 'zksync',
    name: 'zkSync Era',
    chainId: 324,
    rpcUrl: 'https://mainnet.era.zksync.io',
    explorer: 'https://explorer.zksync.io',
    currency: 'ETH',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:324:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'mantle': {
    key: 'mantle',
    name: 'Mantle',
    chainId: 5000,
    rpcUrl: 'https://rpc.mantle.xyz',
    explorer: 'https://explorer.mantle.xyz',
    currency: 'MNT',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:5000:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'fantom': {
    key: 'fantom',
    name: 'Fantom',
    chainId: 250,
    rpcUrl: 'https://rpc.ftm.tools',
    explorer: 'https://ftmscan.com',
    currency: 'FTM',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:250:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'gnosis': {
    key: 'gnosis',
    name: 'Gnosis',
    chainId: 100,
    rpcUrl: 'https://rpc.gnosischain.com',
    explorer: 'https://gnosisscan.io',
    currency: 'xDAI',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:100:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'celo': {
    key: 'celo',
    name: 'Celo',
    chainId: 42220,
    rpcUrl: 'https://forno.celo.org',
    explorer: 'https://celoscan.io',
    currency: 'CELO',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:42220:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
  'moonbeam': {
    key: 'moonbeam',
    name: 'Moonbeam',
    chainId: 1284,
    rpcUrl: 'https://rpc.api.moonbeam.network',
    explorer: 'https://moonbeam.moonscan.io',
    currency: 'GLMR',
    isTestnet: false,
    contracts: {
      identity: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      reputation: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
      validation: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    },
    agentRegistry: 'eip155:1284:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  },
};

/** Identity Registry ABI */
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
];

/**
 * Get a chain config, falling back to config default.
 */
export function getChain(chainKey?: string): ChainConfig {
  const key = chainKey || loadConfig().defaultChain;
  const chain = CHAINS[key];
  if (!chain) {
    throw new Error(`Unknown chain: ${key}. Use 'erc8004 chains' to list available chains.`);
  }
  return chain;
}
