/**
 * WalletButton — NavBar wallet connect/disconnect button
 * Supports BSC Mainnet + Testnet with MetaMask/injected wallets
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Wallet,
  LogOut,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { BrowserProvider } from 'ethers';
import { useWalletStore } from '@/stores/walletStore';
import { truncateAddress, formatBalance } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

// ── BSC Chain Definitions ──────────────────────────────────────────────
export const BSC_MAINNET = {
  chainId: 56,
  chainIdHex: '0x38',
  name: 'BNB Smart Chain',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  blockExplorer: 'https://bscscan.com',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
};

export const BSC_TESTNET = {
  chainId: 97,
  chainIdHex: '0x61',
  name: 'BSC Testnet',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  blockExplorer: 'https://testnet.bscscan.com',
  nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
};

const SUPPORTED_CHAINS = [BSC_MAINNET, BSC_TESTNET];

function getChainConfig(chainId: number) {
  return SUPPORTED_CHAINS.find((c) => c.chainId === chainId);
}

function getExplorerUrl(chainId: number | null) {
  const chain = chainId ? getChainConfig(chainId) : null;
  return chain?.blockExplorer || BSC_MAINNET.blockExplorer;
}

// ── Component ──────────────────────────────────────────────────────────
export default function WalletButton() {
  const { address, chainId, balance, isConnected, disconnect, setWallet } =
    useWalletStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Connect ────────────────────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('No wallet detected. Install MetaMask or Trust Wallet.');
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length === 0) throw new Error('No accounts found');

      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const rawBalance = await provider.getBalance(userAddress);

      setWallet({
        address: userAddress,
        chainId: Number(network.chainId),
        balance: formatBalance(Number(rawBalance) / 1e18),
        isConnected: true,
        provider: window.ethereum,
      });

      // Try switching to BSC Mainnet if on an unsupported chain
      const currentChainId = Number(network.chainId);
      if (!getChainConfig(currentChainId)) {
        await switchChain(BSC_MAINNET.chainIdHex);
      }

      // Listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } catch (err: any) {
      console.error('Wallet connect error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setWallet({ address: accounts[0] });
        refreshBalance(accounts[0]);
      }
    },
    [disconnect, setWallet],
  );

  const handleChainChanged = useCallback(
    async (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setWallet({ chainId: newChainId });
      if (address) refreshBalance(address);
    },
    [address, setWallet],
  );

  const refreshBalance = async (addr?: string) => {
    const target = addr || address;
    if (!target || !window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const raw = await provider.getBalance(target);
      setWallet({ balance: formatBalance(Number(raw) / 1e18) });
    } catch {
      /* silent */
    }
  };

  // ── Switch / Add chain ─────────────────────────────────────────────
  const switchChain = async (chainIdHex: string) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      // Chain not added yet — add it
      if (switchError.code === 4902) {
        const chain =
          chainIdHex === BSC_MAINNET.chainIdHex ? BSC_MAINNET : BSC_TESTNET;
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chain.chainIdHex,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: [chain.blockExplorer],
            },
          ],
        });
      }
    }
  };

  // ── Disconnect ─────────────────────────────────────────────────────
  const handleDisconnect = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    disconnect();
    setIsOpen(false);
  };

  // ── Copy address ───────────────────────────────────────────────────
  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Current chain info ─────────────────────────────────────────────
  const currentChain = chainId ? getChainConfig(chainId) : null;
  const isUnsupportedChain = isConnected && chainId && !currentChain;

  // ═══════════════════════════════════════════════════════════════════
  // RENDER — Not connected
  // ═══════════════════════════════════════════════════════════════════
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F0B90B] to-[#F8D12F] hover:from-[#F0B90B]/90 hover:to-[#F8D12F]/90 text-black rounded-lg font-medium transition-all shadow-lg shadow-[#F0B90B]/20 disabled:opacity-60"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          <span className="text-sm">
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </span>
        </button>
        {error && (
          <div className="absolute top-full right-0 mt-2 w-72 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 z-50 shadow-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER — Connected
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
          isUnsupportedChain
            ? 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50'
            : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-800',
        )}
      >
        {/* Chain indicator dot */}
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            isUnsupportedChain
              ? 'bg-red-500'
              : chainId === BSC_MAINNET.chainId
                ? 'bg-[#F0B90B]'
                : 'bg-blue-400',
          )}
        />
        <span className="text-sm font-medium">
          {truncateAddress(address!)}
        </span>
        <ChevronDown
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* ── Dropdown ──────────────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {/* Wallet info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentChain?.name || `Chain ${chainId}`}
              </span>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-sm break-all">{address}</p>
            {balance && (
              <p className="mt-2 text-lg font-semibold">
                {balance} {currentChain?.nativeCurrency.symbol || 'ETH'}
              </p>
            )}
          </div>

          {/* Unsupported chain warning */}
          {isUnsupportedChain && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-300 mb-2">
                Unsupported network. Switch to BSC:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => switchChain(BSC_MAINNET.chainIdHex)}
                  className="flex-1 text-xs px-2 py-1.5 bg-[#F0B90B] text-black rounded font-medium"
                >
                  BSC Mainnet
                </button>
                <button
                  onClick={() => switchChain(BSC_TESTNET.chainIdHex)}
                  className="flex-1 text-xs px-2 py-1.5 bg-gray-200 dark:bg-zinc-800 rounded font-medium"
                >
                  BSC Testnet
                </button>
              </div>
            </div>
          )}

          {/* Chain switcher (when on supported chain) */}
          {!isUnsupportedChain && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <p className="px-3 py-1 text-xs text-gray-400 font-medium">
                Switch Network
              </p>
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.chainId}
                  onClick={() => switchChain(chain.chainIdHex)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors',
                    chainId === chain.chainId
                      ? 'bg-gray-100 dark:bg-zinc-800 font-medium'
                      : 'hover:bg-gray-50 dark:hover:bg-zinc-900/50',
                  )}
                >
                  <span>{chain.name}</span>
                  {chainId === chain.chainId && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={() => refreshBalance()}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Balance</span>
            </button>

            <a
              href={`${getExplorerUrl(chainId)}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on BscScan</span>
            </a>
          </div>

          {/* Disconnect */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
