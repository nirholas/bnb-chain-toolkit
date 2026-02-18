/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 The future is being built right here 🏗️
 */

import { ethers } from 'ethers';
import { AppError } from '../middleware/errorHandler.js';

interface FundResult {
  transactionHash: string;
  amount: string;
  network: string;
  explorerUrl: string;
}

// Network configurations — BNB Chain testnets prioritised
const networks: Record<string, { rpc: string; chainId: number; explorer: string; nativeSymbol: string; fundAmount: string }> = {
  'bsc-testnet': {
    rpc: process.env.BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: 97,
    explorer: 'https://testnet.bscscan.com',
    nativeSymbol: 'tBNB',
    fundAmount: '0.1'
  },
  'opbnb-testnet': {
    rpc: process.env.OPBNB_TESTNET_RPC || 'https://opbnb-testnet-rpc.bnbchain.org',
    chainId: 5611,
    explorer: 'https://testnet.opbnbscan.com',
    nativeSymbol: 'tBNB',
    fundAmount: '0.01'
  },
  sepolia: {
    rpc: process.env.ALCHEMY_API_KEY
      ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      : 'https://rpc.sepolia.org',
    chainId: 11155111,
    explorer: 'https://sepolia.etherscan.io',
    nativeSymbol: 'ETH',
    fundAmount: '0.1'
  }
};

export async function fundAddress(address: string, network: string): Promise<FundResult> {
  // Check if faucet is configured
  const privateKey = process.env.FUNDER_PRIVATE_KEY;
  if (!privateKey) {
    throw new AppError('Faucet service not configured', 503);
  }

  // Get network config
  const networkConfig = networks[network];
  if (!networkConfig) {
    throw new AppError(`Unsupported network: ${network}`, 400);
  }

  try {
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    const wallet = new ethers.Wallet(privateKey, provider);

    const amount = networkConfig.fundAmount;

    // Check faucet balance
    const balance = await provider.getBalance(wallet.address);
    const fundAmount = ethers.parseEther(amount);

    if (balance < fundAmount) {
      throw new AppError('Faucet has insufficient funds', 503);
    }

    // Send transaction
    const tx = await wallet.sendTransaction({
      to: address,
      value: fundAmount
    });

    await tx.wait();

    return {
      transactionHash: tx.hash,
      amount: `${amount} ${networkConfig.nativeSymbol}`,
      network,
      explorerUrl: `${networkConfig.explorer}/tx/${tx.hash}`
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new AppError(`Faucet transaction failed: ${message}`, 500);
  }
}
