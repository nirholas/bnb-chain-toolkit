/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Tool Reference
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit | 🌐 https://bnbchaintoolkit.com
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Server,
  Wrench,
  Layers,
  Globe,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Code2,
  Star,
  Copy,
  Check,
  Command,
} from 'lucide-react';
import { Spotlight, TextGenerateEffect, LampContainer, HoverEffect } from '@/components/ui';
import { toolCatalog, allServersConfig } from '@/data/mcpServers';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tool {
  name: string;
  description: string;
  category: string;
  server: string;
}

interface ToolCategory {
  name: string;
  server: string;
  serverName: string;
  count: string;
  description: string;
  tools: Tool[];
  color: string;
}

// ─── Debounce Hook ───────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ─── Copy Hook ───────────────────────────────────────────────────────────────

function useCopyToClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiedKey(null), 2000);
    });
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return { copiedKey, copy };
}

// ─── Hand-Crafted Tool Examples (50+) ────────────────────────────────────────

const TOOL_EXAMPLES: Record<string, string> = {
  // bnbchain-mcp — Core Blockchain
  'get_balance': 'Get the BNB balance of wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  'get_transaction': 'Get the details of transaction 0xabc123def456...',
  'get_block': 'Get the latest block data on BNB Chain',
  'get_gas_price': 'What is the current gas price on BSC?',
  'estimate_gas': 'Estimate the gas cost to transfer 1 BNB to 0x742d...',
  'send_transaction': 'Send 0.5 BNB from my wallet to 0x742d35Cc...',
  'get_transaction_receipt': 'Get the receipt and logs for transaction 0xabc...',
  'get_contract_code': 'Get the bytecode of the PancakeSwap Router contract',
  'call_contract': 'Call the balanceOf function on the CAKE token contract',
  'deploy_contract': 'Deploy my ERC-20 token contract to BSC mainnet',
  'resolve_ens': 'Resolve vitalik.eth to an Ethereum address',
  'get_chain_info': 'Get current BNB Smart Chain network info and latest block',
  // bnbchain-mcp — Token Operations
  'get_token_info': 'Get info about the CAKE token (0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82)',
  'get_token_balance': 'Get my USDT balance on BSC for wallet 0x742d...',
  'transfer_token': 'Transfer 100 USDT to address 0x742d35Cc...',
  'approve_token': 'Approve PancakeSwap to spend my CAKE tokens',
  'get_nft_metadata': 'Get the metadata and traits of Pancake Squad NFT #1234',
  'transfer_nft': 'Transfer my Pancake Squad NFT #42 to 0x742d...',
  'get_token_holders': 'Show the top 10 holders of the CAKE token',
  'get_token_transfers': 'Get recent CAKE token transfers in the last hour',
  // bnbchain-mcp — DeFi
  'get_swap_quote': 'Get a quote for swapping 1 BNB to USDT on PancakeSwap',
  'execute_swap': 'Swap 100 USDT for BNB on PancakeSwap with 1% slippage',
  'add_liquidity': 'Add liquidity to the BNB/USDT pool on PancakeSwap',
  'get_lending_rates': 'Get the current lending rates for USDT on Venus Protocol',
  'supply_to_lending': 'Supply 1000 USDT to Venus Protocol for yield',
  'get_farming_apy': 'What is the current APY for the CAKE-BNB farm?',
  'get_pool_info': 'Get details of the BNB/USDT liquidity pool on PancakeSwap',
  'get_tvl': 'Get the total value locked in PancakeSwap from DefiLlama',
  // bnbchain-mcp — Security
  'check_token_security': 'Check if token 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82 is safe to trade',
  'detect_honeypot': 'Is token 0x1234... a honeypot? Can I sell after buying?',
  'check_rug_pull': 'Assess the rug pull risk for token 0xDEAD...',
  'get_holder_distribution': 'Show the holder distribution for CAKE token',
  'check_contract_verified': 'Is the contract at 0x1234... verified on BscScan?',
  'screen_address': 'Check the risk score for address 0x742d...',
  // bnbchain-mcp — Market Data
  'get_price': 'What is the current price of BNB in USD?',
  'get_price_history': 'Get the 30-day price history for BNB with daily candles',
  'get_trending_coins': 'Show me trending tokens on BNB Chain right now',
  'get_dex_pools': 'List the top liquidity pools on PancakeSwap by volume',
  'get_social_metrics': 'Get the LunarCrush social sentiment score for BNB',
  'get_fear_greed': 'What is today\'s Crypto Fear and Greed Index?',
  // bnbchain-mcp — DEX/Swap
  'get_1inch_quote': 'Get a 1inch quote for swapping 10 BNB to USDC',
  'get_0x_quote': 'Get a 0x API quote for 1000 USDT to BNB swap',
  'get_paraswap_quote': 'Get a ParaSwap quote for 5 BNB to BUSD',
  'compare_swap_routes': 'Compare swap routes for 1 BNB to USDT across all DEX aggregators',
  // binance-mcp — Spot Trading
  'get_ticker_price': 'Get the current BTC/USDT price on Binance',
  'get_order_book': 'Show the BTC/USDT order book with 20 levels of depth',
  'place_order': 'Place a limit buy order for 0.1 BTC at $60,000 on Binance',
  'cancel_order': 'Cancel my open BTC/USDT order #12345',
  'get_open_orders': 'Show all my open orders on Binance spot',
  'get_trade_history': 'Get my recent BTC/USDT trade history',
  'get_klines': 'Get 4-hour candlestick data for ETH/USDT on Binance',
  'get_24h_stats': 'Get 24-hour price change statistics for BNB/USDT',
  // binance-mcp — Futures
  'get_futures_price': 'Get the current BTC perpetual futures price',
  'get_funding_rate': 'What is the current BTC perpetual funding rate on Binance?',
  'place_futures_order': 'Open a long BTC position with 10x leverage at market price',
  'set_leverage': 'Set leverage to 20x for BTC/USDT perpetual',
  'get_position': 'Show my current BTC/USDT futures position details',
  'get_open_interest': 'Get the total open interest for BTC perpetual',
  // binance-mcp — Earn & Other
  'get_earn_products': 'List the best Binance Earn products with over 5% APY',
  'subscribe_earn': 'Subscribe 1000 USDT to Binance Simple Earn flexible',
  'get_staking_products': 'List available ETH staking products on Binance',
  'create_auto_invest': 'Create an Auto-Invest plan to buy $100 of BTC weekly',
  'get_lead_traders': 'Show top copy traders by 30-day returns on Binance',
  'start_copy': 'Start copying the lead trader with ID 12345',
  'get_account_balance': 'Show all my asset balances on Binance',
  'get_deposit_address': 'Get my BNB deposit address on Binance',
  // universal-crypto-mcp
  'bridge_tokens': 'Bridge 100 USDT from BSC to Ethereum via LayerZero',
  'get_bridge_quote': 'Get a quote for bridging 1 ETH from Ethereum to BSC',
  'get_bridge_status': 'Check the status of my bridge transaction 0xabc...',
  'x402_get_balance': 'Check my x402 payment balance for AI services',
  'x402_pay': 'Make an x402 payment of 0.01 USDT for API access',
  'x402_register_service': 'Register my AI translation service on x402',
  'x402_discover_services': 'Discover available AI services on the x402 marketplace',
  // ucai
  'generate': 'Generate an MCP server from the PancakeSwap Router ABI',
  'generate_from_address': 'Auto-generate an MCP server from contract 0x10ED...',
  'scan_contract': 'Run a full security scan on contract 0x1234...',
  'check_ownership': 'Analyze the ownership structure of contract 0xDEAD...',
  'detect_risks': 'Detect common risk patterns in contract 0x5678...',
  'explain_contract': 'Explain the PancakeSwap Router contract in plain English',
  'explain_function': 'Explain what the swapExactTokensForTokens function does',
  'flash_loan_template': 'Generate a flash loan MCP server template for Aave',
  'arbitrage_template': 'Generate a DEX arbitrage server for PancakeSwap and BiSwap',
};

// ─── Tool Data: BNB Chain MCP (150+ tools) ──────────────────────────────────

const bnbchainTools: ToolCategory[] = [
  {
    name: 'Core Blockchain', server: 'bnbchain-mcp', serverName: 'BNB Chain MCP', count: '45+', description: 'Fundamental blockchain operations', color: '#F0B90B',
    tools: [
      { name: 'get_balance', description: 'Get native token balance for any address', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'get_transaction', description: 'Get transaction details by hash', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'get_block', description: 'Get block information by number or hash', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'get_gas_price', description: 'Get current gas price on network', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'estimate_gas', description: 'Estimate gas for a transaction', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'send_transaction', description: 'Send a native token transaction', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'get_transaction_receipt', description: 'Get transaction receipt with logs', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'get_contract_code', description: 'Get deployed bytecode of contract', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'call_contract', description: 'Call a read-only contract function', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'deploy_contract', description: 'Deploy a smart contract', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'resolve_ens', description: 'Resolve ENS name to address', category: 'Core Blockchain', server: 'bnbchain-mcp' },
      { name: 'get_chain_info', description: 'Get current chain information', category: 'Core Blockchain', server: 'bnbchain-mcp' },
    ],
  },
  {
    name: 'Token Operations', server: 'bnbchain-mcp', serverName: 'BNB Chain MCP', count: '30+', description: 'ERC-20 and NFT token operations', color: '#F59E0B',
    tools: [
      { name: 'get_token_info', description: 'Get name, symbol, decimals, supply', category: 'Token Operations', server: 'bnbchain-mcp' },
      { name: 'get_token_balance', description: 'Get token balance for address', category: 'Token Operations', server: 'bnbchain-mcp' },
      { name: 'transfer_token', description: 'Transfer ERC-20 tokens', category: 'Token Operations', server: 'bnbchain-mcp' },
      { name: 'approve_token', description: 'Approve spending allowance', category: 'Token Operations', server: 'bnbchain-mcp' },
      { name: 'get_nft_metadata', description: 'Get NFT metadata and traits', category: 'Token Operations', server: 'bnbchain-mcp' },
      { name: 'transfer_nft', description: 'Transfer ERC-721 NFT', category: 'Token Operations', server: 'bnbchain-mcp' },
      { name: 'get_token_holders', description: 'Get top token holders', category: 'Token Operations', server: 'bnbchain-mcp' },
      { name: 'get_token_transfers', description: 'Get recent token transfers', category: 'Token Operations', server: 'bnbchain-mcp' },
    ],
  },
  {
    name: 'DeFi', server: 'bnbchain-mcp', serverName: 'BNB Chain MCP', count: '50+', description: 'Swaps, lending, yield farming, liquidity', color: '#10B981',
    tools: [
      { name: 'get_swap_quote', description: 'Get swap quote from DEX aggregators', category: 'DeFi', server: 'bnbchain-mcp' },
      { name: 'execute_swap', description: 'Execute token swap', category: 'DeFi', server: 'bnbchain-mcp' },
      { name: 'add_liquidity', description: 'Add liquidity to DEX pools', category: 'DeFi', server: 'bnbchain-mcp' },
      { name: 'get_lending_rates', description: 'Get Aave/Compound rates', category: 'DeFi', server: 'bnbchain-mcp' },
      { name: 'supply_to_lending', description: 'Supply assets to lending protocol', category: 'DeFi', server: 'bnbchain-mcp' },
      { name: 'get_farming_apy', description: 'Get yield farming APY', category: 'DeFi', server: 'bnbchain-mcp' },
      { name: 'get_pool_info', description: 'Get liquidity pool details', category: 'DeFi', server: 'bnbchain-mcp' },
      { name: 'get_tvl', description: 'Get protocol TVL from DefiLlama', category: 'DeFi', server: 'bnbchain-mcp' },
    ],
  },
  {
    name: 'Security', server: 'bnbchain-mcp', serverName: 'BNB Chain MCP', count: '15+', description: 'GoPlus analysis, honeypot detection, risk checks', color: '#EF4444',
    tools: [
      { name: 'check_token_security', description: 'GoPlus token security analysis', category: 'Security', server: 'bnbchain-mcp' },
      { name: 'detect_honeypot', description: 'Check if token is honeypot', category: 'Security', server: 'bnbchain-mcp' },
      { name: 'check_rug_pull', description: 'Assess rug pull risk', category: 'Security', server: 'bnbchain-mcp' },
      { name: 'get_holder_distribution', description: 'Get top holder breakdown', category: 'Security', server: 'bnbchain-mcp' },
      { name: 'check_contract_verified', description: 'Verify contract source', category: 'Security', server: 'bnbchain-mcp' },
      { name: 'screen_address', description: 'Check address risk score', category: 'Security', server: 'bnbchain-mcp' },
    ],
  },
  {
    name: 'Market Data', server: 'bnbchain-mcp', serverName: 'BNB Chain MCP', count: '25+', description: 'Prices, charts, trending, social metrics', color: '#8B5CF6',
    tools: [
      { name: 'get_price', description: 'Get current token price', category: 'Market Data', server: 'bnbchain-mcp' },
      { name: 'get_price_history', description: 'Get historical OHLCV data', category: 'Market Data', server: 'bnbchain-mcp' },
      { name: 'get_trending_coins', description: 'Get trending tokens', category: 'Market Data', server: 'bnbchain-mcp' },
      { name: 'get_dex_pools', description: 'Get DEX pool data', category: 'Market Data', server: 'bnbchain-mcp' },
      { name: 'get_social_metrics', description: 'Get LunarCrush sentiment', category: 'Market Data', server: 'bnbchain-mcp' },
      { name: 'get_fear_greed', description: 'Fear & Greed Index', category: 'Market Data', server: 'bnbchain-mcp' },
    ],
  },
  {
    name: 'DEX/Swap', server: 'bnbchain-mcp', serverName: 'BNB Chain MCP', count: '10+', description: '1inch, 0x, ParaSwap DEX aggregators', color: '#EC4899',
    tools: [
      { name: 'get_1inch_quote', description: '1inch swap quote', category: 'DEX/Swap', server: 'bnbchain-mcp' },
      { name: 'get_0x_quote', description: '0x API swap quote', category: 'DEX/Swap', server: 'bnbchain-mcp' },
      { name: 'get_paraswap_quote', description: 'ParaSwap swap quote', category: 'DEX/Swap', server: 'bnbchain-mcp' },
      { name: 'compare_swap_routes', description: 'Compare quotes across aggregators', category: 'DEX/Swap', server: 'bnbchain-mcp' },
    ],
  },
];

// ─── Tool Data: Binance MCP (478+ tools) ────────────────────────────────────

const binanceTools: ToolCategory[] = [
  {
    name: 'Spot Trading', server: 'binance-mcp', serverName: 'Binance MCP', count: '35+', description: 'Market data, order management, trade history', color: '#F3BA2F',
    tools: [
      { name: 'get_ticker_price', description: 'Get current spot price', category: 'Spot Trading', server: 'binance-mcp' },
      { name: 'get_order_book', description: 'Get order book depth', category: 'Spot Trading', server: 'binance-mcp' },
      { name: 'place_order', description: 'Place a new spot order', category: 'Spot Trading', server: 'binance-mcp' },
      { name: 'cancel_order', description: 'Cancel an open order', category: 'Spot Trading', server: 'binance-mcp' },
      { name: 'get_open_orders', description: 'Get all open orders', category: 'Spot Trading', server: 'binance-mcp' },
      { name: 'get_trade_history', description: 'Get recent trades', category: 'Spot Trading', server: 'binance-mcp' },
      { name: 'get_klines', description: 'Get candlestick/kline data', category: 'Spot Trading', server: 'binance-mcp' },
      { name: 'get_24h_stats', description: '24-hour price change statistics', category: 'Spot Trading', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Futures (USD-M)', server: 'binance-mcp', serverName: 'Binance MCP', count: '40+', description: 'Perpetual futures, positions, leverage', color: '#F97316',
    tools: [
      { name: 'get_futures_price', description: 'Get futures contract price', category: 'Futures (USD-M)', server: 'binance-mcp' },
      { name: 'get_funding_rate', description: 'Get current funding rate', category: 'Futures (USD-M)', server: 'binance-mcp' },
      { name: 'place_futures_order', description: 'Place futures order', category: 'Futures (USD-M)', server: 'binance-mcp' },
      { name: 'set_leverage', description: 'Set leverage for a symbol', category: 'Futures (USD-M)', server: 'binance-mcp' },
      { name: 'get_position', description: 'Get open position details', category: 'Futures (USD-M)', server: 'binance-mcp' },
      { name: 'get_open_interest', description: 'Get open interest data', category: 'Futures (USD-M)', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Futures (COIN-M)', server: 'binance-mcp', serverName: 'Binance MCP', count: '35+', description: 'Coin-margined futures contracts', color: '#D97706',
    tools: [
      { name: 'get_coinm_price', description: 'Get COIN-M contract price', category: 'Futures (COIN-M)', server: 'binance-mcp' },
      { name: 'place_coinm_order', description: 'Place COIN-M order', category: 'Futures (COIN-M)', server: 'binance-mcp' },
      { name: 'get_coinm_position', description: 'Get COIN-M position', category: 'Futures (COIN-M)', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Margin Trading', server: 'binance-mcp', serverName: 'Binance MCP', count: '41', description: 'Cross & isolated margin, borrowing', color: '#DC2626',
    tools: [
      { name: 'margin_borrow', description: 'Borrow on margin', category: 'Margin Trading', server: 'binance-mcp' },
      { name: 'margin_repay', description: 'Repay margin loan', category: 'Margin Trading', server: 'binance-mcp' },
      { name: 'place_margin_order', description: 'Place margin trade order', category: 'Margin Trading', server: 'binance-mcp' },
      { name: 'get_margin_account', description: 'Get margin account info', category: 'Margin Trading', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Options', server: 'binance-mcp', serverName: 'Binance MCP', count: '27', description: 'European-style options trading', color: '#7C3AED',
    tools: [
      { name: 'get_option_info', description: 'Get option contract info', category: 'Options', server: 'binance-mcp' },
      { name: 'place_option_order', description: 'Place option order', category: 'Options', server: 'binance-mcp' },
      { name: 'get_option_positions', description: 'Get option positions', category: 'Options', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Wallet', server: 'binance-mcp', serverName: 'Binance MCP', count: '40+', description: 'Deposits, withdrawals, transfers, assets', color: '#2563EB',
    tools: [
      { name: 'get_account_balance', description: 'Get all asset balances', category: 'Wallet', server: 'binance-mcp' },
      { name: 'withdraw', description: 'Withdraw assets', category: 'Wallet', server: 'binance-mcp' },
      { name: 'get_deposit_address', description: 'Get deposit address', category: 'Wallet', server: 'binance-mcp' },
      { name: 'get_deposit_history', description: 'Get deposit history', category: 'Wallet', server: 'binance-mcp' },
      { name: 'universal_transfer', description: 'Transfer between sub-accounts', category: 'Wallet', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Earn & Staking', server: 'binance-mcp', serverName: 'Binance MCP', count: '50+', description: 'Simple Earn, Auto-Invest, Staking, Dual Investment', color: '#059669',
    tools: [
      { name: 'get_earn_products', description: 'List Simple Earn products', category: 'Earn & Staking', server: 'binance-mcp' },
      { name: 'subscribe_earn', description: 'Subscribe to earn product', category: 'Earn & Staking', server: 'binance-mcp' },
      { name: 'get_staking_products', description: 'List staking products', category: 'Earn & Staking', server: 'binance-mcp' },
      { name: 'create_auto_invest', description: 'Create Auto-Invest plan', category: 'Earn & Staking', server: 'binance-mcp' },
      { name: 'get_dual_investment', description: 'Get Dual Investment products', category: 'Earn & Staking', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Algo Trading', server: 'binance-mcp', serverName: 'Binance MCP', count: '11+', description: 'TWAP, VP, algorithmic orders', color: '#0EA5E9',
    tools: [
      { name: 'place_twap_order', description: 'Place TWAP algorithmic order', category: 'Algo Trading', server: 'binance-mcp' },
      { name: 'place_vp_order', description: 'Place Volume Participation order', category: 'Algo Trading', server: 'binance-mcp' },
      { name: 'get_algo_orders', description: 'Get algorithmic order status', category: 'Algo Trading', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Copy Trading', server: 'binance-mcp', serverName: 'Binance MCP', count: '10+', description: 'Lead trader and copy features', color: '#14B8A6',
    tools: [
      { name: 'get_lead_traders', description: 'Get top lead traders', category: 'Copy Trading', server: 'binance-mcp' },
      { name: 'start_copy', description: 'Start copying a trader', category: 'Copy Trading', server: 'binance-mcp' },
      { name: 'stop_copy', description: 'Stop copying a trader', category: 'Copy Trading', server: 'binance-mcp' },
    ],
  },
  {
    name: 'Other', server: 'binance-mcp', serverName: 'Binance MCP', count: '50+', description: 'NFT, Mining, P2P, Pay, Gift Cards, Convert, Rebate', color: '#6B7280',
    tools: [
      { name: 'get_mining_stats', description: 'Get mining statistics', category: 'Other', server: 'binance-mcp' },
      { name: 'get_p2p_ads', description: 'Get P2P trading ads', category: 'Other', server: 'binance-mcp' },
      { name: 'convert_trade', description: 'Instant asset conversion', category: 'Other', server: 'binance-mcp' },
      { name: 'create_gift_card', description: 'Create a Binance gift card', category: 'Other', server: 'binance-mcp' },
    ],
  },
];

// ─── Tool Data: Binance US MCP (120+ tools) ─────────────────────────────────

const binanceUsTools: ToolCategory[] = [
  {
    name: 'Market Data', server: 'binance-us-mcp', serverName: 'Binance US MCP', count: '10+', description: 'Tickers, order books, trades, klines', color: '#F3BA2F',
    tools: [
      { name: 'get_ticker_price', description: 'Get price on Binance.US', category: 'Market Data', server: 'binance-us-mcp' },
      { name: 'get_24h_stats', description: '24h statistics', category: 'Market Data', server: 'binance-us-mcp' },
      { name: 'get_order_book', description: 'Order book depth', category: 'Market Data', server: 'binance-us-mcp' },
      { name: 'get_recent_trades', description: 'Recent trade history', category: 'Market Data', server: 'binance-us-mcp' },
      { name: 'get_klines', description: 'Candlestick data', category: 'Market Data', server: 'binance-us-mcp' },
    ],
  },
  {
    name: 'Spot Trading', server: 'binance-us-mcp', serverName: 'Binance US MCP', count: '15+', description: 'Limit, market, stop-limit orders', color: '#10B981',
    tools: [
      { name: 'place_order', description: 'Place a spot order', category: 'Spot Trading', server: 'binance-us-mcp' },
      { name: 'cancel_order', description: 'Cancel an order', category: 'Spot Trading', server: 'binance-us-mcp' },
      { name: 'get_open_orders', description: 'Get open orders', category: 'Spot Trading', server: 'binance-us-mcp' },
    ],
  },
  {
    name: 'Wallet & Staking', server: 'binance-us-mcp', serverName: 'Binance US MCP', count: '25+', description: 'Balances, deposits, withdrawals, staking', color: '#3B82F6',
    tools: [
      { name: 'get_balance', description: 'Get account balances', category: 'Wallet & Staking', server: 'binance-us-mcp' },
      { name: 'get_deposit_address', description: 'Get deposit address', category: 'Wallet & Staking', server: 'binance-us-mcp' },
      { name: 'get_staking_products', description: 'Available staking products', category: 'Wallet & Staking', server: 'binance-us-mcp' },
    ],
  },
  {
    name: 'OTC & Institutional', server: 'binance-us-mcp', serverName: 'Binance US MCP', count: '20+', description: 'OTC, sub-accounts, custodial, credit line', color: '#8B5CF6',
    tools: [
      { name: 'get_otc_quote', description: 'Get OTC trading quote', category: 'OTC & Institutional', server: 'binance-us-mcp' },
      { name: 'create_sub_account', description: 'Create sub-account', category: 'OTC & Institutional', server: 'binance-us-mcp' },
    ],
  },
];

// ─── Tool Data: Universal Crypto MCP (380+ tools) ───────────────────────────

const universalTools: ToolCategory[] = [
  {
    name: 'Core Blockchain', server: 'universal-crypto-mcp', serverName: 'Universal Crypto MCP', count: '45+', description: 'Cross-chain blockchain operations', color: '#6366F1',
    tools: [
      { name: 'get_balance', description: 'Get balance on any chain', category: 'Core Blockchain', server: 'universal-crypto-mcp' },
      { name: 'send_transaction', description: 'Send transaction on any chain', category: 'Core Blockchain', server: 'universal-crypto-mcp' },
      { name: 'get_block', description: 'Get block data from any chain', category: 'Core Blockchain', server: 'universal-crypto-mcp' },
      { name: 'deploy_contract', description: 'Deploy contract to any EVM', category: 'Core Blockchain', server: 'universal-crypto-mcp' },
    ],
  },
  {
    name: 'DeFi', server: 'universal-crypto-mcp', serverName: 'Universal Crypto MCP', count: '50+', description: 'Multi-chain DeFi operations', color: '#10B981',
    tools: [
      { name: 'get_swap_quote', description: 'Cross-chain swap quote', category: 'DeFi', server: 'universal-crypto-mcp' },
      { name: 'execute_swap', description: 'Execute cross-chain swap', category: 'DeFi', server: 'universal-crypto-mcp' },
      { name: 'get_lending_rates', description: 'Multi-chain lending rates', category: 'DeFi', server: 'universal-crypto-mcp' },
    ],
  },
  {
    name: 'x402 Payments', server: 'universal-crypto-mcp', serverName: 'Universal Crypto MCP', count: '14', description: 'AI-to-AI payments, service marketplace', color: '#8B5CF6',
    tools: [
      { name: 'x402_get_balance', description: 'Check x402 payment balance', category: 'x402 Payments', server: 'universal-crypto-mcp' },
      { name: 'x402_pay', description: 'Make x402 payment', category: 'x402 Payments', server: 'universal-crypto-mcp' },
      { name: 'x402_register_service', description: 'Register AI service', category: 'x402 Payments', server: 'universal-crypto-mcp' },
      { name: 'x402_discover_services', description: 'Discover AI services', category: 'x402 Payments', server: 'universal-crypto-mcp' },
    ],
  },
  {
    name: 'Bridges', server: 'universal-crypto-mcp', serverName: 'Universal Crypto MCP', count: '10+', description: 'LayerZero, Stargate, Wormhole', color: '#EC4899',
    tools: [
      { name: 'bridge_tokens', description: 'Bridge tokens across chains', category: 'Bridges', server: 'universal-crypto-mcp' },
      { name: 'get_bridge_quote', description: 'Get bridge transfer quote', category: 'Bridges', server: 'universal-crypto-mcp' },
      { name: 'get_bridge_status', description: 'Check bridge transaction status', category: 'Bridges', server: 'universal-crypto-mcp' },
    ],
  },
  {
    name: 'Security', server: 'universal-crypto-mcp', serverName: 'Universal Crypto MCP', count: '15+', description: 'GoPlus, honeypot, rug pull detection', color: '#EF4444',
    tools: [
      { name: 'check_token_security', description: 'Cross-chain token security', category: 'Security', server: 'universal-crypto-mcp' },
      { name: 'detect_honeypot', description: 'Honeypot detection', category: 'Security', server: 'universal-crypto-mcp' },
    ],
  },
  {
    name: 'Market Data', server: 'universal-crypto-mcp', serverName: 'Universal Crypto MCP', count: '25+', description: 'CoinGecko, DefiLlama, GeckoTerminal', color: '#F59E0B',
    tools: [
      { name: 'get_price', description: 'Get token price (any chain)', category: 'Market Data', server: 'universal-crypto-mcp' },
      { name: 'get_trending', description: 'Trending tokens', category: 'Market Data', server: 'universal-crypto-mcp' },
      { name: 'get_tvl', description: 'Protocol TVL data', category: 'Market Data', server: 'universal-crypto-mcp' },
    ],
  },
];

// ─── Tool Data: Agenti (380+ tools) ─────────────────────────────────────────

const agentiTools: ToolCategory[] = [
  {
    name: 'Core Blockchain', server: 'agenti', serverName: 'Agenti', count: '45+', description: 'Cross-chain blockchain operations', color: '#6366F1',
    tools: [
      { name: 'get_balance', description: 'Get balance on any chain', category: 'Core Blockchain', server: 'agenti' },
      { name: 'send_transaction', description: 'Send transaction on any chain', category: 'Core Blockchain', server: 'agenti' },
      { name: 'get_block', description: 'Get block data from any chain', category: 'Core Blockchain', server: 'agenti' },
      { name: 'deploy_contract', description: 'Deploy contract to any EVM', category: 'Core Blockchain', server: 'agenti' },
    ],
  },
  {
    name: 'DeFi', server: 'agenti', serverName: 'Agenti', count: '50+', description: 'Multi-chain DeFi operations', color: '#10B981',
    tools: [
      { name: 'get_swap_quote', description: 'Cross-chain swap quote', category: 'DeFi', server: 'agenti' },
      { name: 'execute_swap', description: 'Execute cross-chain swap', category: 'DeFi', server: 'agenti' },
      { name: 'get_lending_rates', description: 'Multi-chain lending rates', category: 'DeFi', server: 'agenti' },
    ],
  },
  {
    name: 'x402 Payments', server: 'agenti', serverName: 'Agenti', count: '14', description: 'AI-to-AI payments, service marketplace', color: '#8B5CF6',
    tools: [
      { name: 'x402_get_balance', description: 'Check x402 payment balance', category: 'x402 Payments', server: 'agenti' },
      { name: 'x402_pay', description: 'Make x402 payment', category: 'x402 Payments', server: 'agenti' },
      { name: 'x402_register_service', description: 'Register AI service', category: 'x402 Payments', server: 'agenti' },
      { name: 'x402_discover_services', description: 'Discover AI services', category: 'x402 Payments', server: 'agenti' },
    ],
  },
  {
    name: 'Bridges', server: 'agenti', serverName: 'Agenti', count: '10+', description: 'LayerZero, Stargate, Wormhole', color: '#EC4899',
    tools: [
      { name: 'bridge_tokens', description: 'Bridge tokens across chains', category: 'Bridges', server: 'agenti' },
      { name: 'get_bridge_quote', description: 'Get bridge transfer quote', category: 'Bridges', server: 'agenti' },
      { name: 'get_bridge_status', description: 'Check bridge transaction status', category: 'Bridges', server: 'agenti' },
    ],
  },
  {
    name: 'Security', server: 'agenti', serverName: 'Agenti', count: '15+', description: 'GoPlus, honeypot, rug pull detection', color: '#EF4444',
    tools: [
      { name: 'check_token_security', description: 'Cross-chain token security', category: 'Security', server: 'agenti' },
      { name: 'detect_honeypot', description: 'Honeypot detection', category: 'Security', server: 'agenti' },
    ],
  },
  {
    name: 'Market Data', server: 'agenti', serverName: 'Agenti', count: '25+', description: 'CoinGecko, DefiLlama, GeckoTerminal', color: '#F59E0B',
    tools: [
      { name: 'get_price', description: 'Get token price (any chain)', category: 'Market Data', server: 'agenti' },
      { name: 'get_trending', description: 'Trending tokens', category: 'Market Data', server: 'agenti' },
      { name: 'get_tvl', description: 'Protocol TVL data', category: 'Market Data', server: 'agenti' },
    ],
  },
];

// ─── Tool Data: UCAI (Dynamic tools) ────────────────────────────────────────

const ucaiTools: ToolCategory[] = [
  {
    name: 'Server Generation', server: 'ucai', serverName: 'UCAI', count: 'Dynamic', description: 'Generate MCP servers from contract ABIs', color: '#10B981',
    tools: [
      { name: 'generate', description: 'Generate MCP server from contract ABI', category: 'Server Generation', server: 'ucai' },
      { name: 'generate_from_address', description: 'Auto-fetch ABI and generate server', category: 'Server Generation', server: 'ucai' },
    ],
  },
  {
    name: 'Security Scanner', server: 'ucai', serverName: 'UCAI', count: '50+', description: '50+ risk checks, honeypot, rugpull analysis', color: '#EF4444',
    tools: [
      { name: 'scan_contract', description: 'Run full security scan', category: 'Security Scanner', server: 'ucai' },
      { name: 'check_ownership', description: 'Analyze contract ownership', category: 'Security Scanner', server: 'ucai' },
      { name: 'detect_risks', description: 'Detect common risk patterns', category: 'Security Scanner', server: 'ucai' },
    ],
  },
  {
    name: 'Contract Whisperer', server: 'ucai', serverName: 'UCAI', count: '\u2014', description: 'Plain English contract explanations', color: '#3B82F6',
    tools: [
      { name: 'explain_contract', description: 'Explain contract in plain English', category: 'Contract Whisperer', server: 'ucai' },
      { name: 'explain_function', description: 'Explain a specific function', category: 'Contract Whisperer', server: 'ucai' },
    ],
  },
  {
    name: 'Pro Templates', server: 'ucai', serverName: 'UCAI', count: '5+', description: 'Flash Loans, Arbitrage, Yield Aggregators', color: '#8B5CF6',
    tools: [
      { name: 'flash_loan_template', description: 'Generate flash loan server', category: 'Pro Templates', server: 'ucai' },
      { name: 'arbitrage_template', description: 'Generate arbitrage server', category: 'Pro Templates', server: 'ucai' },
      { name: 'yield_aggregator_template', description: 'Generate yield aggregator server', category: 'Pro Templates', server: 'ucai' },
    ],
  },
];

// ─── Combined data ──────────────────────────────────────────────────────────

const ALL_CATEGORIES: ToolCategory[] = [
  ...bnbchainTools,
  ...binanceTools,
  ...binanceUsTools,
  ...universalTools,
  ...agentiTools,
  ...ucaiTools,
];

const ALL_TOOLS: Tool[] = ALL_CATEGORIES.flatMap(c => c.tools);

// ─── Server metadata ────────────────────────────────────────────────────────

interface ServerMeta {
  id: string;
  name: string;
  count: string;
  color: string;
  icon: typeof Server;
}

const SERVERS: ServerMeta[] = [
  { id: 'bnbchain-mcp', name: 'BNB Chain MCP', count: '150+', color: '#F0B90B', icon: Zap },
  { id: 'binance-mcp', name: 'Binance MCP', count: '478+', color: '#F3BA2F', icon: TrendingUp },
  { id: 'binance-us-mcp', name: 'Binance US MCP', count: '120+', color: '#3B82F6', icon: Globe },
  { id: 'universal-crypto-mcp', name: 'Universal Crypto MCP', count: '380+', color: '#6366F1', icon: Layers },
  { id: 'agenti', name: 'Agenti', count: '380+', color: '#10B981', icon: Code2 },
  { id: 'ucai', name: 'UCAI', count: 'Dynamic', color: '#8B5CF6', icon: Wrench },
];

const SERVER_MAP = Object.fromEntries(SERVERS.map(s => [s.id, s]));

// ─── Popular tools ──────────────────────────────────────────────────────────

const POPULAR_TOOLS: Tool[] = [
  { name: 'get_price', description: 'Get current token price on any chain', category: 'Market Data', server: 'bnbchain-mcp' },
  { name: 'get_balance', description: 'Get native token balance for any address', category: 'Core Blockchain', server: 'bnbchain-mcp' },
  { name: 'check_token_security', description: 'GoPlus token security analysis', category: 'Security', server: 'bnbchain-mcp' },
  { name: 'get_swap_quote', description: 'Get swap quote from DEX aggregators', category: 'DeFi', server: 'bnbchain-mcp' },
  { name: 'execute_swap', description: 'Execute token swap on DEX', category: 'DeFi', server: 'bnbchain-mcp' },
  { name: 'get_token_info', description: 'Get name, symbol, decimals, supply', category: 'Token Operations', server: 'bnbchain-mcp' },
  { name: 'detect_honeypot', description: 'Check if token is honeypot', category: 'Security', server: 'bnbchain-mcp' },
  { name: 'get_ticker_price', description: 'Get current spot price on Binance', category: 'Spot Trading', server: 'binance-mcp' },
  { name: 'bridge_tokens', description: 'Bridge tokens across chains', category: 'Bridges', server: 'universal-crypto-mcp' },
  { name: 'get_funding_rate', description: 'Get current funding rate for futures', category: 'Futures (USD-M)', server: 'binance-mcp' },
  { name: 'scan_contract', description: 'Run full security scan on contract', category: 'Security Scanner', server: 'ucai' },
  { name: 'get_tvl', description: 'Get protocol TVL from DefiLlama', category: 'DeFi', server: 'bnbchain-mcp' },
];

// ─── Example generation helper ──────────────────────────────────────────────

function getToolExample(tool: Tool): string {
  if (TOOL_EXAMPLES[tool.name]) return TOOL_EXAMPLES[tool.name];
  const serverName = SERVER_MAP[tool.server]?.name ?? tool.server;
  return `Use the ${tool.name} tool from ${serverName} to ${tool.description.toLowerCase()}`;
}

// ─── Server stats computation ────────────────────────────────────────────────

function getTopCategories(categories: ToolCategory[], limit = 5) {
  return [...categories]
    .sort((a, b) => b.tools.length - a.tools.length)
    .slice(0, limit);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ToolReferencePage() {
  useSEO({
    title: 'Tool Reference',
    description: '900+ tools across 6 MCP servers — searchable index with descriptions, categories, example calls, and copy functionality.',
    path: '/tools',
  });

  const [searchInput, setSearchInput] = useState('');
  const searchQuery = useDebounce(searchInput, 200);
  const [activeServer, setActiveServer] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    // First 3 categories expanded by default
    const initial = new Set<string>();
    ALL_CATEGORIES.slice(0, 3).forEach(cat => {
      initial.add(`${cat.server}::${cat.name}`);
    });
    return initial;
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { copiedKey, copy } = useCopyToClipboard();

  // Cmd+K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Select a server filter tab
  const selectServer = useCallback((serverId: string) => {
    setActiveServer(serverId);
  }, []);

  // Toggle expand/collapse for a category section
  const toggleExpanded = useCallback((key: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Filter categories and tools based on debounced search + server filter
  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return ALL_CATEGORIES.map(cat => {
      // Server filter
      if (activeServer !== 'all' && cat.server !== activeServer) return null;

      // Search filter — match on category name, tool name, description, or server name
      if (query) {
        const serverName = (SERVER_MAP[cat.server]?.name ?? '').toLowerCase();
        const matchingTools = cat.tools.filter(
          t =>
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            serverName.includes(query)
        );
        const categoryMatches =
          cat.name.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query) ||
          serverName.includes(query);

        if (matchingTools.length === 0 && !categoryMatches) return null;

        return {
          ...cat,
          tools: matchingTools.length > 0 ? matchingTools : cat.tools,
        };
      }

      return cat;
    }).filter((c): c is ToolCategory => c !== null);
  }, [searchQuery, activeServer]);

  // Count totals
  const totalFilteredTools = useMemo(
    () => filteredCategories.reduce((sum, cat) => sum + cat.tools.length, 0),
    [filteredCategories]
  );

  // Server tab counts
  const serverToolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of ALL_CATEGORIES) {
      counts[cat.server] = (counts[cat.server] || 0) + cat.tools.length;
    }
    return counts;
  }, []);

  const topCategories = useMemo(() => getTopCategories(ALL_CATEGORIES), []);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setActiveServer('all');
  }, []);

  const hasActiveFilters = searchInput.length > 0 || activeServer !== 'all';

  // Standalone tools data for HoverEffect
  const standaloneItems = useMemo(
    () =>
      toolCatalog.map(t => ({
        title: t.name,
        description: t.description,
        link: `https://github.com/nirholas/bnb-chain-toolkit/tree/main/${t.repoPath}`,
      })),
    []
  );

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#F0B90B" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F0B90B]/10 px-4 py-2 text-sm font-medium text-[#F0B90B]">
              <Wrench className="h-4 w-4" />
              Complete Tool Reference
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-[#F0B90B]">900+</span> Tools
            </h1>

            <TextGenerateEffect
              words="Every tool across all 6 MCP servers — search, browse, copy, and try."
              className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-neutral-400 font-normal"
            />
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { label: 'Tools', value: '900+', icon: Wrench },
              { label: 'Servers', value: '6', icon: Server },
              { label: 'Categories', value: `${ALL_CATEGORIES.length}`, icon: Layers },
              { label: 'Chains', value: '60+', icon: Globe },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0B90B]/10">
                  <stat.icon className="h-5 w-5 text-[#F0B90B]" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sticky Search + Server Filter ──────────────────────── */}
      <section className="sticky top-0 z-30 border-b border-gray-200 dark:border-white/[0.08] bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Search input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search tools by name, description, or server..."
              aria-label="Search tools by name, description, or server"
              className={cn(
                'w-full rounded-xl border bg-white dark:bg-neutral-900 py-3 pl-12 pr-24 text-sm',
                'border-gray-200 dark:border-white/[0.08] placeholder-gray-400 dark:placeholder-neutral-500',
                'focus:border-[#F0B90B] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/20',
                'text-gray-900 dark:text-white transition-shadow duration-200'
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchInput ? (
                <button
                  onClick={() => setSearchInput('')}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                  <Command className="h-3 w-3" />K
                </kbd>
              )}
            </div>
          </div>

          {/* Server filter tabs */}
          <div className="mt-3 -mb-px flex items-center gap-1 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Filter by server">
            <button
              role="tab"
              aria-selected={activeServer === 'all'}
              aria-label="Show all servers"
              onClick={() => selectServer('all')}
              className={cn(
                'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150',
                activeServer === 'all'
                  ? 'bg-[#F0B90B] text-black'
                  : 'bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-white/[0.08]'
              )}
            >
              All ({ALL_TOOLS.length})
            </button>
            {SERVERS.map(srv => {
              const active = activeServer === srv.id;
              const count = serverToolCounts[srv.id] || 0;
              return (
                <button
                  key={srv.id}
                  role="tab"
                  aria-selected={active}
                  aria-label={`Filter by ${srv.name}`}
                  onClick={() => selectServer(srv.id)}
                  className={cn(
                    'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150',
                    active
                      ? 'text-black'
                      : 'bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-white/[0.08]'
                  )}
                  style={active ? { backgroundColor: srv.color, color: '#000' } : undefined}
                >
                  {srv.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Result count + clear */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-neutral-400">
              Showing{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{totalFilteredTools}</span>{' '}
              tools in{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{filteredCategories.length}</span>{' '}
              categories
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-medium text-[#F0B90B] hover:underline"
                aria-label="Clear all filters"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content: Sidebar + Categories ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar — Desktop only */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-40 space-y-6">
              {/* Total tools */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Server Stats</h3>
                <div className="space-y-3">
                  {SERVERS.map(srv => {
                    const count = serverToolCounts[srv.id] || 0;
                    const maxCount = Math.max(...Object.values(serverToolCounts));
                    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => selectServer(srv.id)}
                        className="w-full text-left group"
                        aria-label={`Jump to ${srv.name}`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-gray-700 dark:text-neutral-300 group-hover:text-[#F0B90B] transition-colors truncate">{srv.name}</span>
                          <span className="text-gray-400 dark:text-neutral-500">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/[0.05] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%`, backgroundColor: srv.color }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Top categories */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Top Categories</h3>
                <div className="space-y-2">
                  {topCategories.map(cat => {
                    const catKey = `${cat.server}::${cat.name}`;
                    return (
                      <button
                        key={catKey}
                        onClick={() => {
                          setExpandedCategories(prev => new Set(prev).add(catKey));
                          document.getElementById(`cat-${catKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="flex items-center justify-between w-full text-left text-xs group"
                        aria-label={`Jump to ${cat.name}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-gray-700 dark:text-neutral-300 group-hover:text-[#F0B90B] transition-colors truncate">{cat.name}</span>
                        </div>
                        <span className="text-gray-400 dark:text-neutral-500 shrink-0 ml-2">{cat.tools.length}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick jump links */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Jump</h3>
                <div className="space-y-1.5">
                  {SERVERS.map(srv => (
                    <button
                      key={srv.id}
                      onClick={() => {
                        selectServer(srv.id);
                        window.scrollTo({ top: document.getElementById('tool-categories')?.offsetTop ?? 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 w-full text-left text-xs text-gray-600 dark:text-neutral-400 hover:text-[#F0B90B] transition-colors"
                      aria-label={`Jump to ${srv.name} section`}
                    >
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: srv.color }} />
                      {srv.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Popular Tools (only when no filters) */}
            {!hasActiveFilters && (
              <div className="mb-8">
                <motion.h2
                  className="mb-6 text-2xl font-bold sm:text-3xl"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Star className="mr-2 inline-block h-6 w-6 text-[#F0B90B]" />
                  Popular Tools
                </motion.h2>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {POPULAR_TOOLS.map((tool, i) => {
                    const srv = SERVER_MAP[tool.server];
                    return (
                      <motion.div
                        key={`pop-${tool.server}-${tool.name}`}
                        className="group rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 p-4 transition-all duration-200 hover:border-[#F0B90B]/40 hover:shadow-lg hover:shadow-[#F0B90B]/5"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <code className="font-mono text-sm font-semibold text-[#F0B90B]">
                            {tool.name}
                          </code>
                          <span
                            className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                            style={{
                              backgroundColor: `${srv?.color ?? '#6B7280'}15`,
                              color: srv?.color ?? '#6B7280',
                            }}
                          >
                            {srv?.name ?? tool.server}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400 line-clamp-2">
                          {tool.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400 dark:text-neutral-500">{tool.category}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => copy(tool.name, `pop-name-${tool.server}-${tool.name}`)}
                              className="rounded-md p-1 text-gray-400 hover:text-[#F0B90B] transition-colors"
                              aria-label={`Copy tool name ${tool.name}`}
                            >
                              {copiedKey === `pop-name-${tool.server}-${tool.name}` ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Accordions */}
            <div id="tool-categories" className="space-y-4">
              {filteredCategories.length === 0 ? (
                /* No results state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-lg font-medium text-gray-500 dark:text-neutral-400">
                    No tools match your search
                  </p>
                  <p className="mt-2 text-sm text-gray-400 dark:text-neutral-500">
                    Try a different search term or clear filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 rounded-xl bg-[#F0B90B] px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#F0B90B]/80"
                    aria-label="Clear search and filters"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredCategories.map(cat => {
                  const catKey = `${cat.server}::${cat.name}`;
                  const isExpanded = expandedCategories.has(catKey);
                  const srv = SERVER_MAP[cat.server];

                  return (
                    <motion.div
                      key={catKey}
                      id={`cat-${catKey}`}
                      className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900"
                      layout
                    >
                      {/* Category header */}
                      <button
                        onClick={() => toggleExpanded(catKey)}
                        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${cat.name} category with ${cat.tools.length} tools`}
                        aria-expanded={isExpanded}
                      >
                        <div
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-semibold">{cat.name}</span>
                            <span className="rounded-md bg-[#F0B90B]/10 px-2 py-0.5 text-xs font-semibold text-[#F0B90B]">
                              {cat.tools.length}
                            </span>
                            <span className="rounded-md bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-gray-400 dark:text-neutral-500">
                              {cat.count} total
                            </span>
                            <span
                              className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                              style={{
                                backgroundColor: `${srv?.color ?? '#6B7280'}15`,
                                color: srv?.color ?? '#6B7280',
                              }}
                            >
                              {cat.serverName}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400 truncate">
                            {cat.description}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0 text-gray-400"
                        >
                          <ChevronDown className="h-5 w-5" />
                        </motion.div>
                      </button>

                      {/* Tools list */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-100 dark:border-white/[0.05]">
                              {cat.tools.map((tool, toolIdx) => {
                                const copyNameKey = `name-${cat.server}-${tool.name}`;
                                const copyExampleKey = `ex-${cat.server}-${tool.name}`;
                                return (
                                  <motion.div
                                    key={`${tool.server}-${tool.name}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.15, delay: toolIdx * 0.02 }}
                                    className={cn(
                                      'group flex items-start justify-between gap-3 px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]',
                                      toolIdx < cat.tools.length - 1 && 'border-b border-gray-100 dark:border-white/[0.04]'
                                    )}
                                  >
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                      <ChevronRight
                                        className="mt-0.5 h-4 w-4 shrink-0"
                                        style={{ color: cat.color }}
                                      />
                                      <div className="min-w-0">
                                        <code className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                                          {tool.name}
                                        </code>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                                          {tool.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); copy(tool.name, copyNameKey); }}
                                        className={cn(
                                          'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all duration-200',
                                          copiedKey === copyNameKey
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]'
                                        )}
                                        aria-label={`Copy tool name ${tool.name}`}
                                      >
                                        {copiedKey === copyNameKey ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        {copiedKey === copyNameKey ? 'Copied' : 'Name'}
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); copy(getToolExample(tool), copyExampleKey); }}
                                        className={cn(
                                          'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all duration-200',
                                          copiedKey === copyExampleKey
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]'
                                        )}
                                        aria-label={`Copy example call for ${tool.name}`}
                                      >
                                        {copiedKey === copyExampleKey ? <Check className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
                                        {copiedKey === copyExampleKey ? 'Copied' : 'Example'}
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Standalone Tools Section ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 dark:border-white/[0.08] pt-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold sm:text-3xl text-center mb-2">
              <Shield className="mr-2 inline-block h-6 w-6 text-[#F0B90B]" />
              Standalone Tools
            </h2>
            <p className="text-center text-gray-500 dark:text-neutral-400 mb-8 max-w-xl mx-auto">
              Independent utilities for wallets, market data, DeFi, and Web3 standards — no MCP server required.
            </p>
          </motion.div>

          <HoverEffect items={standaloneItems} className="max-w-5xl mx-auto" />
        </div>
      </section>

      {/* ── CTA Section with LampContainer ──────────────────────── */}
      <LampContainer className="min-h-[auto] py-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">
            Add All Servers to Start Using These Tools
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-neutral-400">
            Copy the configuration to your claude_desktop_config.json and start using 900+ tools instantly.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => copy(allServersConfig, 'cta-config')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200',
                copiedKey === 'cta-config'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#F0B90B] text-black hover:bg-[#F0B90B]/80 hover:shadow-lg hover:shadow-[#F0B90B]/20'
              )}
              aria-label="Copy all servers configuration JSON"
            >
              {copiedKey === 'cta-config' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedKey === 'cta-config' ? 'Copied!' : 'Copy Config'}
            </button>
            <Link
              to="/mcp"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-[#F0B90B]/40 hover:shadow-lg"
              aria-label="Browse MCP servers"
            >
              <Server className="h-4 w-4" />
              Server Explorer
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-[#F0B90B]/40 hover:shadow-lg"
              aria-label="Browse AI agents"
            >
              <Layers className="h-4 w-4" />
              Agent Browser
            </Link>
          </div>
        </motion.div>
      </LampContainer>

      {/* Footer attribution */}
      <div className="py-8 text-center text-xs text-gray-400 dark:text-neutral-600">
        BNB Chain AI Toolkit &mdash; 900+ tools &middot; 6 MCP servers &middot; 60+ chains
      </div>
    </main>
  );
}
