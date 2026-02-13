/**
 * Wallet connection and management utilities.
 * Private keys are stored in VSCode SecretStorage for security.
 */

import * as vscode from 'vscode';
import { ethers } from 'ethers';
import { getChain, type ChainConfig } from './chains';
import { getContracts, IDENTITY_ABI, REPUTATION_ABI } from './contracts';

let currentWallet: ethers.Wallet | null = null;
let currentProvider: ethers.JsonRpcProvider | null = null;
let currentChainKey: string = 'bsc-testnet';

const WALLET_SECRET_KEY = 'erc8004.privateKey';

/**
 * Initialize wallet from stored secret.
 */
export async function initWallet(
  context: vscode.ExtensionContext
): Promise<ethers.Wallet | null> {
  const privateKey = await context.secrets.get(WALLET_SECRET_KEY);
  if (!privateKey) {
    return null;
  }
  return connectWithKey(privateKey);
}

/**
 * Connect wallet with a private key.
 */
export function connectWithKey(privateKey: string): ethers.Wallet {
  const chain = getActiveChain();
  const rpcUrl = getCustomRpcUrl() || chain.rpcUrl;
  currentProvider = new ethers.JsonRpcProvider(rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  currentWallet = new ethers.Wallet(privateKey, currentProvider);
  return currentWallet;
}

/**
 * Store private key in VSCode secrets and connect.
 */
export async function connectWallet(
  context: vscode.ExtensionContext,
  privateKey: string
): Promise<ethers.Wallet> {
  await context.secrets.store(WALLET_SECRET_KEY, privateKey);
  return connectWithKey(privateKey);
}

/**
 * Disconnect and clear stored wallet.
 */
export async function disconnectWallet(
  context: vscode.ExtensionContext
): Promise<void> {
  await context.secrets.delete(WALLET_SECRET_KEY);
  currentWallet = null;
  currentProvider = null;
}

/**
 * Get current connected wallet.
 */
export function getWallet(): ethers.Wallet | null {
  return currentWallet;
}

/**
 * Get current provider.
 */
export function getProvider(): ethers.JsonRpcProvider | null {
  return currentProvider;
}

/**
 * Get or create a provider (read-only, no wallet needed).
 */
export function ensureProvider(): ethers.JsonRpcProvider {
  if (currentProvider) {
    return currentProvider;
  }
  const chain = getActiveChain();
  const rpcUrl = getCustomRpcUrl() || chain.rpcUrl;
  currentProvider = new ethers.JsonRpcProvider(rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  return currentProvider;
}

/**
 * Set active chain and reconnect if wallet exists.
 */
export function setActiveChain(chainKey: string): void {
  currentChainKey = chainKey;
  // Reconnect provider with new chain
  const chain = getChain(chainKey);
  const rpcUrl = getCustomRpcUrl() || chain.rpcUrl;
  currentProvider = new ethers.JsonRpcProvider(rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  if (currentWallet) {
    currentWallet = currentWallet.connect(currentProvider);
  }
}

/**
 * Get active chain key.
 */
export function getActiveChainKey(): string {
  return currentChainKey;
}

/**
 * Get active chain config.
 */
export function getActiveChain(): ChainConfig {
  return getChain(currentChainKey);
}

/**
 * Get custom RPC URL from settings.
 */
function getCustomRpcUrl(): string | undefined {
  const config = vscode.workspace.getConfiguration('erc8004');
  const url = config.get<string>('rpcUrl');
  return url && url.length > 0 ? url : undefined;
}

/**
 * Get identity registry contract instance.
 */
export function getIdentityContract(signerOrProvider?: ethers.Signer | ethers.Provider): ethers.Contract {
  const contracts = getContracts(currentChainKey);
  const provider = signerOrProvider || currentWallet || ensureProvider();
  return new ethers.Contract(contracts.identity, IDENTITY_ABI, provider);
}

/**
 * Get reputation registry contract instance.
 */
export function getReputationContract(signerOrProvider?: ethers.Signer | ethers.Provider): ethers.Contract {
  const contracts = getContracts(currentChainKey);
  const provider = signerOrProvider || currentWallet || ensureProvider();
  return new ethers.Contract(contracts.reputation, REPUTATION_ABI, provider);
}

/**
 * Get wallet balance.
 */
export async function getBalance(): Promise<string> {
  if (!currentWallet || !currentProvider) {
    return '0';
  }
  const balance = await currentProvider.getBalance(currentWallet.address);
  return ethers.formatEther(balance);
}

/**
 * Shortened address for display.
 */
export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if wallet is connected.
 */
export function isConnected(): boolean {
  return currentWallet !== null;
}
