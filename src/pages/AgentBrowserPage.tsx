/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Agent Browser
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit | 🌐 https://bnbchaintoolkit.com
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Bot,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plug,
  Tag,
  MessageSquare,
  HelpCircle,
  Code2,
  Shield,
  BarChart3,
  Wallet,
  GraduationCap,
  Wrench,
  Zap,
  ArrowRight,
  Github,
  Sparkles,
  Users,
  Server,
  FolderOpen,
} from 'lucide-react';
import {
  Spotlight,
  TextGenerateEffect,
  BackgroundGradient,
  SparklesCore,
  InfiniteMovingCards,
  MovingBorder,
} from '@/components/ui';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';

// ─── Hooks ──────────────────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface AgentConfig {
  openingMessage: string;
  openingQuestions: string[];
  plugins: string[];
}

interface AgentMeta {
  title: string;
  description: string;
  avatar: string;
  tags: string[];
  category: string;
}

interface Agent {
  identifier: string;
  meta: AgentMeta;
  config: AgentConfig;
  author?: string;
}

// ─── Categories ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  'all',
  'defi',
  'trading',
  'security',
  'analysis',
  'general',
  'development',
  'education',
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_META: Record<
  Category,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  all: { label: 'All', icon: Layers, color: 'text-gray-600 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-white/10' },
  defi: { label: 'DeFi', icon: Wallet, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10' },
  trading: { label: 'Trading', icon: BarChart3, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
  security: { label: 'Security', icon: Shield, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/10' },
  analysis: { label: 'Analysis', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
  general: { label: 'General', icon: Bot, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-500/10' },
  development: { label: 'Development', icon: Code2, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-500/10' },
  education: { label: 'Education', icon: GraduationCap, color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-50 dark:bg-pink-500/10' },
};

// ─── Agent Data ─────────────────────────────────────────────────────────────

const bnbChainAgents: Agent[] = [
  {
    identifier: 'pancakeswap-expert',
    meta: { title: 'PancakeSwap Expert', description: 'Expert in PancakeSwap DEX — swaps, farming, V3 liquidity, CAKE staking with live MCP data', avatar: '🥞', tags: ['bnb-chain', 'pancakeswap', 'dex', 'farming', 'liquidity', 'defi'], category: 'defi' },
    config: { openingMessage: "Welcome! I'm your PancakeSwap specialist with live MCP data.", openingQuestions: ['What are the highest APR farms on PancakeSwap right now?', 'How do I provide concentrated liquidity on V3?', 'Should I stake CAKE or farm with it?', 'Help me find the best swap route for a large trade'], plugins: ['bnbchain-mcp', 'binance-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'venus-protocol-expert',
    meta: { title: 'Venus Protocol Expert', description: 'Expert in Venus Protocol — lending, borrowing, VAI stablecoin, and XVS governance on BSC', avatar: '♀️', tags: ['bnb-chain', 'venus', 'lending', 'borrowing', 'stablecoin'], category: 'defi' },
    config: { openingMessage: 'Welcome to Venus! I can help with lending, borrowing, and VAI operations.', openingQuestions: ['What are the current supply/borrow rates on Venus?', 'How do I avoid liquidation?', 'Explain Venus Isolated Pools vs Core Pool', 'What is XVS staking and governance?'], plugins: ['bnbchain-mcp', 'binance-mcp'] },
  },
  {
    identifier: 'lista-dao-expert',
    meta: { title: 'Lista DAO Expert', description: 'Expert in Lista DAO — liquid staking, lisUSD/slisBNB, and CDP on BNB Chain', avatar: '📋', tags: ['bnb-chain', 'lista', 'liquid-staking', 'stablecoin', 'cdp'], category: 'defi' },
    config: { openingMessage: "I'm your Lista DAO specialist for slisBNB and lisUSD strategies.", openingQuestions: ['How does slisBNB liquid staking work?', 'What is lisUSD and how to mint it?', 'Lista DAO yield strategies', 'Compare Lista vs other liquid staking'], plugins: ['bnbchain-mcp', 'binance-mcp'] },
  },
  {
    identifier: 'thena-dex-expert',
    meta: { title: 'Thena DEX Expert', description: 'Expert in Thena DEX — ve(3,3) model, concentrated liquidity, and THE token on BSC', avatar: '⚡', tags: ['bnb-chain', 'thena', 'dex', 've33', 'liquidity'], category: 'defi' },
    config: { openingMessage: "Welcome! I'm your Thena specialist for ve(3,3) strategies.", openingQuestions: ['How does the ve(3,3) model work on Thena?', 'Best liquidity pools on Thena?', 'How to lock THE for veTHE?', 'Compare Thena vs PancakeSwap'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'alpaca-finance-expert',
    meta: { title: 'Alpaca Finance Expert', description: 'Expert in Alpaca Finance — leveraged yield farming, lending, and ALPACA token on BSC', avatar: '🦙', tags: ['bnb-chain', 'alpaca', 'leveraged-farming', 'lending'], category: 'defi' },
    config: { openingMessage: "I'm your Alpaca Finance specialist for leveraged yield farming.", openingQuestions: ['How does leveraged yield farming work?', 'Best Alpaca farming positions?', 'Liquidation risks with leverage', 'ALPACA tokenomics and staking'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bep20-token-analyst',
    meta: { title: 'BEP-20 Token Analyst', description: 'Expert in BEP-20 token analysis — tokenomics, holder distribution, security checks', avatar: '🔬', tags: ['bnb-chain', 'token', 'analysis', 'bep20', 'security'], category: 'analysis' },
    config: { openingMessage: 'I analyze BEP-20 tokens — security, tokenomics, and holder distribution.', openingQuestions: ['Analyze this token contract for risks', 'What is the holder distribution?', 'Check if this token has a honeypot', "Explain this token's tax structure"], plugins: ['bnbchain-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'binance-copy-trading',
    meta: { title: 'Binance Copy Trading', description: 'Expert in Binance Copy Trading — finding top traders, managing copy portfolios', avatar: '📋', tags: ['binance', 'copy-trading', 'portfolio', 'automation'], category: 'trading' },
    config: { openingMessage: 'I help you find and follow the best traders on Binance.', openingQuestions: ['Who are the top copy traders?', 'How to set up copy trading?', 'Risk management for copy trading', 'Compare copy traders by returns'], plugins: ['binance-mcp'] },
  },
  {
    identifier: 'binance-earn-advisor',
    meta: { title: 'Binance Earn Advisor', description: 'Expert in Binance Earn — Simple Earn, Locked Products, and yield optimization', avatar: '💰', tags: ['binance', 'earn', 'savings', 'yield', 'staking'], category: 'defi' },
    config: { openingMessage: 'I help optimize your Binance Earn positions for maximum yield.', openingQuestions: ['Best Binance Earn products right now?', 'Flexible vs locked savings comparison', 'Auto-Invest DCA strategies', 'How to maximize earn APY?'], plugins: ['binance-mcp'] },
  },
  {
    identifier: 'binance-earn-specialist',
    meta: { title: 'Binance Earn Specialist', description: 'Deep specialist in all Binance Earn products — Dual Investment, Auto-Invest, Staking', avatar: '🏦', tags: ['binance', 'earn', 'dual-investment', 'auto-invest'], category: 'defi' },
    config: { openingMessage: "I'm your Binance Earn specialist for all earn products.", openingQuestions: ['Explain Dual Investment products', 'Set up Auto-Invest plan', 'Compare all staking products', 'Best strategies for Binance Earn'], plugins: ['binance-mcp'] },
  },
  {
    identifier: 'binance-futures-expert',
    meta: { title: 'Binance Futures Expert', description: 'Expert in Binance Futures — perpetuals, leverage, funding rates, risk management', avatar: '📈', tags: ['binance', 'futures', 'leverage', 'perpetual', 'trading', 'risk'], category: 'trading' },
    config: { openingMessage: "I'm your Binance Futures specialist. ⚠️ Futures are high-risk.", openingQuestions: ['Current funding rate for BTC perpetual?', 'Calculate my liquidation price', 'What leverage should I use as a beginner?', 'Explain cross vs isolated margin'], plugins: ['binance-mcp', 'free-crypto-news', 'bnbchain-mcp'] },
  },
  {
    identifier: 'binance-launchpad-analyst',
    meta: { title: 'Binance Launchpad Analyst', description: 'Expert in Binance Launchpad/Launchpool — IEOs, token launches, participation strategies', avatar: '🚀', tags: ['binance', 'launchpad', 'launchpool', 'ieo', 'token-launch'], category: 'analysis' },
    config: { openingMessage: 'I analyze Binance Launchpad and Launchpool opportunities.', openingQuestions: ['Current Launchpool projects?', 'Historical Launchpad ROI analysis', 'How to maximize allocation?', 'Launchpad vs Launchpool explained'], plugins: ['binance-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'binance-margin-expert',
    meta: { title: 'Binance Margin Expert', description: 'Expert in Binance Margin trading — cross/isolated margin, borrowing, risk management', avatar: '💱', tags: ['binance', 'margin', 'trading', 'leverage', 'borrowing'], category: 'trading' },
    config: { openingMessage: "I'm your Binance Margin trading specialist.", openingQuestions: ['Current margin borrow rates?', 'Cross vs isolated margin explained', 'Calculate margin call price', 'Best margin trading strategies'], plugins: ['binance-mcp'] },
  },
  {
    identifier: 'binance-spot-trader',
    meta: { title: 'Binance Spot Trader', description: 'Expert in Binance Spot trading — order types, market analysis, portfolio management', avatar: '💹', tags: ['binance', 'spot', 'trading', 'orders', 'portfolio'], category: 'trading' },
    config: { openingMessage: "I'm your Binance Spot trading assistant with live market data.", openingQuestions: ['Current BTC/USDT market conditions?', 'Place a limit order strategy', 'Best spot trading pairs?', 'Technical analysis for a pair'], plugins: ['binance-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'binance-web3-wallet',
    meta: { title: 'Binance Web3 Wallet', description: 'Expert in Binance Web3 Wallet — DApp browser, DeFi access, cross-chain operations', avatar: '🔐', tags: ['binance', 'web3', 'wallet', 'dapp', 'defi'], category: 'general' },
    config: { openingMessage: 'I help you navigate the Binance Web3 Wallet ecosystem.', openingQuestions: ['How to use Binance Web3 Wallet?', 'Connect to DeFi protocols', 'Cross-chain swaps in wallet', 'Security best practices'], plugins: ['binance-mcp', 'bnbchain-mcp'] },
  },
  {
    identifier: 'bnb-agent-builder',
    meta: { title: 'BNB Agent Builder', description: 'Helps create custom AI agents for BNB Chain protocols using MCP servers', avatar: '🤖', tags: ['bnb-chain', 'agent', 'builder', 'mcp', 'development'], category: 'development' },
    config: { openingMessage: 'I help you build custom AI agents for BNB Chain.', openingQuestions: ['How to create a custom BNB agent?', 'MCP server integration guide', 'Agent template structure', 'Best practices for agent system prompts'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bnb-bridge-expert',
    meta: { title: 'BNB Bridge Expert', description: 'Expert in bridging assets to/from BNB Chain — official bridge, LayerZero, Stargate', avatar: '🌉', tags: ['bnb-chain', 'bridge', 'cross-chain', 'layerzero'], category: 'defi' },
    config: { openingMessage: 'I help with bridging assets to and from BNB Chain.', openingQuestions: ['Best bridge for ETH to BSC?', 'Compare bridge fees and speed', 'How to use the official BNB bridge?', 'Bridge security best practices'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bnb-chain-expert',
    meta: { title: 'BNB Chain Expert', description: 'The definitive BNB Smart Chain specialist — architecture, DeFi, staking, development', avatar: '⛓️', tags: ['bnb-chain', 'bsc', 'blockchain', 'ecosystem', 'staking', 'development'], category: 'general' },
    config: { openingMessage: "I'm your ultimate BNB Smart Chain expert with access to 175+ live MCP tools!", openingQuestions: ['What makes BNB Chain different from Ethereum?', 'Top DeFi protocols on BSC by TVL?', 'How does BNB staking work?', 'Current BNB price and gas rates'], plugins: ['bnbchain-mcp', 'binance-mcp', 'binance-us-mcp', 'free-crypto-news', 'universal-crypto-mcp'] },
  },
  {
    identifier: 'bnb-chain-news-alpha',
    meta: { title: 'BNB Chain News & Alpha', description: 'Real-time BNB Chain news, alpha opportunities, and market intelligence', avatar: '📰', tags: ['bnb-chain', 'news', 'alpha', 'market-intelligence'], category: 'analysis' },
    config: { openingMessage: 'I deliver real-time BNB Chain news and alpha signals.', openingQuestions: ['Latest BNB Chain news?', 'Any upcoming BSC catalysts?', 'Alpha opportunities on BSC now?', 'BNB ecosystem sentiment'], plugins: ['free-crypto-news', 'bnbchain-mcp', 'binance-mcp'] },
  },
  {
    identifier: 'bnb-crosschain-bridge',
    meta: { title: 'BNB Cross-Chain Bridge', description: 'Expert in cross-chain bridging from/to BNB Chain — route optimization, fee comparison', avatar: '🔗', tags: ['bnb-chain', 'bridge', 'cross-chain', 'multichain'], category: 'defi' },
    config: { openingMessage: 'I optimize cross-chain transfers to and from BNB Chain.', openingQuestions: ['Cheapest bridge from ETH to BSC?', 'Best bridging route for stablecoins?', 'How long do bridges take?', 'Bridge security comparison'], plugins: ['bnbchain-mcp', 'universal-crypto-mcp'] },
  },
  {
    identifier: 'bnb-defi-aggregator',
    meta: { title: 'BNB DeFi Aggregator', description: 'Aggregates and compares DeFi opportunities across all BNB Chain protocols', avatar: '🔄', tags: ['bnb-chain', 'defi', 'aggregator', 'yield', 'comparison'], category: 'defi' },
    config: { openingMessage: 'I aggregate DeFi opportunities across all BNB Chain protocols.', openingQuestions: ['Best yield opportunities on BSC?', 'Compare lending rates across protocols', 'Where to get best swap rates?', 'DeFi protocol TVL rankings'], plugins: ['bnbchain-mcp', 'binance-mcp'] },
  },
  {
    identifier: 'bnb-gaming-expert',
    meta: { title: 'BNB Gaming Expert', description: 'Expert in BNB Chain gaming — GameFi, NFT games, play-to-earn, game tokens', avatar: '🎮', tags: ['bnb-chain', 'gaming', 'gamefi', 'nft', 'play-to-earn'], category: 'general' },
    config: { openingMessage: "I'm your BNB Chain gaming and GameFi specialist.", openingQuestions: ['Top GameFi projects on BSC?', 'Play-to-earn earning potential?', 'Gaming NFT marketplace overview', 'BSC gaming ecosystem analysis'], plugins: ['bnbchain-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'bnb-governance-expert',
    meta: { title: 'BNB Governance Expert', description: 'Expert in BNB Chain governance — BEPs, validator elections, protocol governance', avatar: '🏛️', tags: ['bnb-chain', 'governance', 'bep', 'validator', 'voting'], category: 'general' },
    config: { openingMessage: 'I specialize in BNB Chain governance and validator operations.', openingQuestions: ['How does BSC governance work?', 'Current BEP proposals?', 'Validator election process', 'How to participate in governance'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bnb-greenfield-expert',
    meta: { title: 'BNB Greenfield Expert', description: 'Expert in BNB Greenfield — decentralized storage, data operations, SP nodes', avatar: '🌿', tags: ['bnb-chain', 'greenfield', 'storage', 'decentralized-storage'], category: 'general' },
    config: { openingMessage: "I'm your BNB Greenfield decentralized storage specialist.", openingQuestions: ['What is BNB Greenfield?', 'How to store data on Greenfield?', 'Greenfield vs IPFS/Filecoin', 'Storage Provider (SP) economics'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bnb-liquid-staking',
    meta: { title: 'BNB Liquid Staking', description: 'Expert in BNB liquid staking — slisBNB, BNBx, ankrBNB comparison and strategies', avatar: '💧', tags: ['bnb-chain', 'liquid-staking', 'slisbnb', 'bnbx', 'staking'], category: 'defi' },
    config: { openingMessage: "I'm your BNB liquid staking specialist.", openingQuestions: ['Compare slisBNB vs BNBx vs ankrBNB', 'Best liquid staking strategies?', 'How does liquid staking work?', 'DeFi strategies with liquid staked BNB'], plugins: ['bnbchain-mcp', 'binance-mcp'] },
  },
  {
    identifier: 'bnb-nft-expert',
    meta: { title: 'BNB NFT Expert', description: 'Expert in BNB Chain NFTs — marketplaces, collections, minting, trading', avatar: '🖼️', tags: ['bnb-chain', 'nft', 'marketplace', 'collections', 'minting'], category: 'general' },
    config: { openingMessage: "I'm your BNB Chain NFT specialist.", openingQuestions: ['Top NFT collections on BSC?', 'How to mint NFTs on BNB Chain?', 'BSC NFT marketplace comparison', 'NFT trading strategies on BSC'], plugins: ['bnbchain-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'bnb-rwa-stablecoin-expert',
    meta: { title: 'BNB RWA & Stablecoin Expert', description: 'Expert in RWA tokenization and stablecoins on BNB Chain', avatar: '🏢', tags: ['bnb-chain', 'rwa', 'stablecoin', 'tokenization'], category: 'defi' },
    config: { openingMessage: 'I specialize in RWA tokenization and stablecoins on BNB Chain.', openingQuestions: ['RWA projects on BNB Chain?', 'Stablecoin comparison on BSC', 'How does RWA tokenization work?', 'Regulatory landscape for RWAs'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bnb-staking-advisor',
    meta: { title: 'BNB Staking Advisor', description: 'Expert in BNB staking — native staking, validators, rewards, delegation strategies', avatar: '🥩', tags: ['bnb-chain', 'staking', 'validator', 'delegation', 'rewards'], category: 'defi' },
    config: { openingMessage: 'I help optimize your BNB staking strategy.', openingQuestions: ['How much can I earn staking BNB?', 'Best validators to delegate to?', 'Native vs liquid staking?', 'Staking rewards calculator'], plugins: ['bnbchain-mcp', 'binance-mcp'] },
  },
  {
    identifier: 'bnb-token-launcher',
    meta: { title: 'BNB Token Launcher', description: 'Guides you through launching a BEP-20 token on BNB Chain', avatar: '🎯', tags: ['bnb-chain', 'token-launch', 'bep20', 'deployment'], category: 'development' },
    config: { openingMessage: 'I help you launch tokens on BNB Chain.', openingQuestions: ['How to launch a BEP-20 token?', 'Token contract best practices', 'Liquidity pool setup guide', 'Marketing strategy for token launch'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bsc-developer',
    meta: { title: 'BSC Developer', description: 'Expert BSC developer — Solidity, Hardhat, contract deployment, testing on BNB Chain', avatar: '👨‍💻', tags: ['bnb-chain', 'development', 'solidity', 'hardhat', 'smart-contracts'], category: 'development' },
    config: { openingMessage: "I'm your BSC development assistant. Let's build on BNB Chain!", openingQuestions: ['Set up a Hardhat project for BSC', 'Deploy a contract to BSC testnet', 'BSC contract verification guide', 'Best development practices for BSC'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bsc-mev-gas-expert',
    meta: { title: 'BSC MEV & Gas Expert', description: 'Expert in BSC MEV, gas optimization, sandwich attacks, and front-running protection', avatar: '⛽', tags: ['bnb-chain', 'mev', 'gas', 'optimization', 'front-running'], category: 'security' },
    config: { openingMessage: 'I specialize in BSC MEV and gas optimization.', openingQuestions: ['How does MEV work on BSC?', 'Protect against sandwich attacks', 'Gas optimization techniques', 'BSC block producer dynamics'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'bsc-portfolio-tracker',
    meta: { title: 'BSC Portfolio Tracker', description: 'Tracks and analyzes your BNB Chain portfolio — balances, PnL, DeFi positions', avatar: '📊', tags: ['bnb-chain', 'portfolio', 'tracking', 'pnl', 'analytics'], category: 'analysis' },
    config: { openingMessage: 'I track and analyze your BSC portfolio in real-time.', openingQuestions: ['Analyze my BSC wallet portfolio', 'Show my DeFi positions', 'Calculate my PnL', 'Token holding breakdown'], plugins: ['bnbchain-mcp', 'binance-mcp'] },
  },
  {
    identifier: 'bsc-security-auditor',
    meta: { title: 'BSC Security Auditor', description: 'Expert in BNB Chain smart contract security — vulnerability detection, rug-pull analysis', avatar: '🛡️', tags: ['bnb-chain', 'security', 'audit', 'vulnerability', 'exploit', 'defi'], category: 'security' },
    config: { openingMessage: "I'm your BSC smart contract security specialist.", openingQuestions: ['Audit this BSC contract', 'How to detect honeypots?', 'Common BSC DeFi exploits?', 'Review access control patterns'], plugins: ['bnbchain-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'bsc-whale-tracker',
    meta: { title: 'BSC Whale Tracker', description: 'Tracks whale wallets, large transactions, and smart money flows on BNB Chain', avatar: '🐋', tags: ['bnb-chain', 'whale', 'tracking', 'smart-money', 'flows'], category: 'analysis' },
    config: { openingMessage: 'I track whale activity and smart money flows on BSC.', openingQuestions: ['Recent whale movements on BSC?', 'Track a specific whale wallet', 'Smart money flow analysis', 'Large token transfers today'], plugins: ['bnbchain-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'bscscan-analytics',
    meta: { title: 'BSCScan Analytics', description: 'Expert in BSCScan data — contract verification, token analytics, on-chain metrics', avatar: '🔍', tags: ['bnb-chain', 'bscscan', 'analytics', 'on-chain', 'metrics'], category: 'analysis' },
    config: { openingMessage: 'I help you analyze BSCScan data and on-chain metrics.', openingQuestions: ['Analyze this contract on BSCScan', 'Token holder distribution', 'Transaction volume trends', 'Contract verification status'], plugins: ['bnbchain-mcp'] },
  },
  {
    identifier: 'cz-binance',
    meta: { title: 'CZ Binance', description: 'A CZ (Changpeng Zhao) style advisor — crypto wisdom, Binance ecosystem insights', avatar: '👨‍💼', tags: ['binance', 'cz', 'crypto', 'wisdom', 'ecosystem'], category: 'general' },
    config: { openingMessage: 'Hey! CZ here. What crypto question do you have?', openingQuestions: ["What's your take on the current market?", 'BNB ecosystem future?', 'Advice for crypto beginners', 'Binance roadmap insights'], plugins: ['binance-mcp', 'free-crypto-news'] },
  },
  {
    identifier: 'opbnb-l2-expert',
    meta: { title: 'opBNB L2 Expert', description: 'Expert in opBNB Layer 2 — OP Stack, bridging, low-cost transactions, DApp deployment', avatar: '🔺', tags: ['bnb-chain', 'opbnb', 'layer2', 'op-stack', 'scaling'], category: 'general' },
    config: { openingMessage: "I'm your opBNB Layer 2 specialist.", openingQuestions: ['What is opBNB and how does it work?', 'How to bridge to opBNB?', 'Deploy a contract on opBNB', 'opBNB vs other L2s comparison'], plugins: ['bnbchain-mcp'] },
  },
];

const defiAgents: Agent[] = [
  { identifier: 'airdrop-hunter', meta: { title: 'Airdrop Hunter', description: 'Track and qualify for crypto airdrops across protocols', avatar: '🎯', tags: ['airdrop', 'farming', 'defi', 'rewards'], category: 'defi' }, config: { openingMessage: 'I help you find and qualify for crypto airdrops.', openingQuestions: ['Upcoming airdrop opportunities?', 'How to qualify for top airdrops?', 'Airdrop farming strategies', 'Track my airdrop eligibility'], plugins: [] } },
  { identifier: 'alpha-leak-detector', meta: { title: 'Alpha Leak Detector', description: 'Detect early alpha signals and emerging trends in DeFi', avatar: '🔎', tags: ['alpha', 'trends', 'defi', 'signals'], category: 'analysis' }, config: { openingMessage: 'I detect early alpha signals and emerging DeFi trends.', openingQuestions: ['Any alpha signals today?', 'Emerging DeFi trends?', 'Early-stage protocols to watch', 'On-chain alpha detection'], plugins: [] } },
  { identifier: 'apy-vs-apr-educator', meta: { title: 'APY vs APR Educator', description: 'Explains the difference between APY and APR with interactive calculations', avatar: '📐', tags: ['education', 'apy', 'apr', 'yield', 'math'], category: 'education' }, config: { openingMessage: 'I help you understand APY vs APR and compound interest.', openingQuestions: ['What is the difference between APY and APR?', 'Calculate compound interest', 'Convert APR to APY', 'Real yield vs advertised APY'], plugins: [] } },
  { identifier: 'bridge-security-analyst', meta: { title: 'Bridge Security Analyst', description: 'Analyze cross-chain bridge security, risks, and historical exploits', avatar: '🔐', tags: ['bridge', 'security', 'cross-chain', 'risk'], category: 'security' }, config: { openingMessage: 'I analyze bridge security and cross-chain risks.', openingQuestions: ['Is this bridge safe to use?', 'Historical bridge exploits', 'Bridge security comparison', 'Cross-chain risk assessment'], plugins: [] } },
  { identifier: 'crypto-news-analyst', meta: { title: 'Crypto News Analyst', description: 'Analyze crypto news for market impact and trading signals', avatar: '📰', tags: ['news', 'analysis', 'market', 'signals'], category: 'analysis' }, config: { openingMessage: 'I analyze crypto news for market impact.', openingQuestions: ['Latest market-moving news?', 'News sentiment analysis', 'How will this news affect prices?', 'Upcoming events to watch'], plugins: [] } },
  { identifier: 'crypto-tax-strategist', meta: { title: 'Crypto Tax Strategist', description: 'Optimize crypto tax strategies — harvesting, reporting, jurisdiction planning', avatar: '📋', tags: ['tax', 'strategy', 'reporting', 'compliance'], category: 'general' }, config: { openingMessage: 'I help optimize your crypto tax strategy.', openingQuestions: ['Tax-loss harvesting strategies?', 'How to report DeFi income?', 'Cross-border crypto tax rules', 'FIFO vs LIFO for crypto'], plugins: [] } },
  { identifier: 'defi-insurance-advisor', meta: { title: 'DeFi Insurance Advisor', description: 'Advise on DeFi insurance — Nexus Mutual, InsurAce, coverage optimization', avatar: '🛡️', tags: ['insurance', 'defi', 'risk', 'coverage', 'nexus'], category: 'defi' }, config: { openingMessage: 'I advise on DeFi insurance and risk coverage.', openingQuestions: ['Should I insure my DeFi positions?', 'Compare DeFi insurance protocols', 'Coverage cost vs risk analysis', 'What does DeFi insurance cover?'], plugins: [] } },
  { identifier: 'defi-onboarding-mentor', meta: { title: 'DeFi Onboarding Mentor', description: 'Guide newcomers through DeFi — wallets, swaps, lending, safety basics', avatar: '🎓', tags: ['education', 'onboarding', 'beginner', 'defi'], category: 'education' }, config: { openingMessage: "Welcome to DeFi! I'll guide you through everything safely.", openingQuestions: ['How do I get started with DeFi?', 'Setting up a Web3 wallet', 'First DeFi swap walkthrough', 'DeFi safety essentials'], plugins: [] } },
  { identifier: 'defi-protocol-comparator', meta: { title: 'DeFi Protocol Comparator', description: 'Compare DeFi protocols side-by-side — TVL, yields, fees, security', avatar: '⚖️', tags: ['comparison', 'protocols', 'defi', 'analysis'], category: 'analysis' }, config: { openingMessage: 'I compare DeFi protocols to help you choose the best option.', openingQuestions: ['Compare Aave vs Compound', 'DEX comparison by fees', 'Best lending protocol for stables?', 'Protocol TVL and security ranking'], plugins: [] } },
  { identifier: 'defi-risk-scoring-engine', meta: { title: 'DeFi Risk Scoring Engine', description: 'Score and rank DeFi protocols by risk — smart contract, economic, governance', avatar: '📊', tags: ['risk', 'scoring', 'defi', 'security', 'analysis'], category: 'security' }, config: { openingMessage: 'I score DeFi protocols by comprehensive risk analysis.', openingQuestions: ['Risk score for this protocol?', 'What risk factors do you analyze?', 'Safest DeFi protocols?', 'Compare risk across protocols'], plugins: [] } },
  { identifier: 'defi-yield-farmer', meta: { title: 'DeFi Yield Farming Strategist', description: 'Identify and optimize yield farming opportunities across DeFi', avatar: '🚜', tags: ['defi', 'yield-farming', 'apy', 'strategy', 'optimization'], category: 'defi' }, config: { openingMessage: 'I identify the most profitable yield farming opportunities.', openingQuestions: ['Your risk tolerance for yield farming?', 'Stablecoin or volatile strategies?', 'Leveraged yield strategies?', 'Capital allocation advice'], plugins: [] } },
  { identifier: 'dex-aggregator-optimizer', meta: { title: 'DEX Aggregator Optimizer', description: 'Optimize DEX trades across aggregators — 1inch, 0x, ParaSwap routing', avatar: '🔀', tags: ['dex', 'aggregator', 'routing', 'optimization'], category: 'defi' }, config: { openingMessage: 'I optimize your DEX trades for best execution.', openingQuestions: ['Best route for this swap?', 'Compare aggregator quotes', 'Slippage optimization tips', 'Large trade execution strategy'], plugins: [] } },
  { identifier: 'gas-optimization-expert', meta: { title: 'Gas Optimization Expert', description: 'Optimize gas costs — timing, batching, L2 strategies', avatar: '⛽', tags: ['gas', 'optimization', 'cost', 'l2', 'timing'], category: 'general' }, config: { openingMessage: 'I help you minimize gas costs across chains.', openingQuestions: ['Best time to transact for low gas?', 'Gas optimization techniques', 'L2 gas comparison', 'Batch transaction strategies'], plugins: [] } },
  { identifier: 'governance-proposal-analyst', meta: { title: 'Governance Proposal Analyst', description: 'Analyze DAO governance proposals — impact assessment, voting strategies', avatar: '🗳️', tags: ['governance', 'dao', 'voting', 'proposals', 'analysis'], category: 'general' }, config: { openingMessage: 'I analyze governance proposals and their potential impact.', openingQuestions: ['Active governance proposals?', 'Proposal impact analysis', 'Should I vote for this?', 'DAO governance best practices'], plugins: [] } },
  { identifier: 'impermanent-loss-calculator', meta: { title: 'Impermanent Loss Calculator', description: 'Calculate and minimize impermanent loss for LP positions', avatar: '📉', tags: ['impermanent-loss', 'liquidity', 'calculator', 'defi'], category: 'defi' }, config: { openingMessage: 'I calculate and help minimize impermanent loss.', openingQuestions: ['Calculate IL for this pool', 'When does IL become permanent?', 'Strategies to minimize IL', 'IL vs trading fees comparison'], plugins: [] } },
  { identifier: 'layer2-comparison-guide', meta: { title: 'Layer 2 Comparison Guide', description: 'Compare L2 solutions — Optimistic rollups, ZK rollups, sidechains', avatar: '🏗️', tags: ['layer2', 'rollup', 'scaling', 'comparison'], category: 'general' }, config: { openingMessage: 'I compare Layer 2 scaling solutions.', openingQuestions: ['Compare popular L2s', 'Optimistic vs ZK rollups?', 'Best L2 for my use case?', 'L2 cost comparison'], plugins: [] } },
  { identifier: 'liquidation-risk-manager', meta: { title: 'Liquidation Risk Manager', description: 'Monitor and manage liquidation risks across lending protocols', avatar: '⚠️', tags: ['liquidation', 'risk', 'lending', 'monitoring'], category: 'security' }, config: { openingMessage: 'I monitor your liquidation risks across protocols.', openingQuestions: ['Am I at risk of liquidation?', 'Safe collateral ratios?', 'Liquidation price calculator', 'Auto-deleverage strategies'], plugins: [] } },
  { identifier: 'liquidity-pool-analyzer', meta: { title: 'Liquidity Pool Analyzer', description: 'Analyze LP pools — APR, TVL, volume, impermanent loss risk', avatar: '🏊', tags: ['liquidity', 'pool', 'analysis', 'apy', 'tvl'], category: 'defi' }, config: { openingMessage: 'I analyze liquidity pools for optimal returns.', openingQuestions: ['Best pools by risk-adjusted return?', 'Pool TVL and volume analysis', 'Compare pools across DEXes', 'New pool opportunities'], plugins: [] } },
  { identifier: 'mev-protection-advisor', meta: { title: 'MEV Protection Advisor', description: 'Protect against MEV — front-running, sandwich attacks, private transactions', avatar: '🛡️', tags: ['mev', 'protection', 'front-running', 'security'], category: 'security' }, config: { openingMessage: 'I help protect your transactions from MEV extraction.', openingQuestions: ['Am I vulnerable to MEV?', 'How to use private transactions?', 'MEV protection tools comparison', 'Sandwich attack prevention'], plugins: [] } },
  { identifier: 'narrative-trend-analyst', meta: { title: 'Narrative Trend Analyst', description: 'Track crypto narratives and rotations — AI, RWA, DePIN, L2 trends', avatar: '📈', tags: ['narrative', 'trends', 'rotation', 'analysis'], category: 'analysis' }, config: { openingMessage: 'I track crypto narratives and sector rotations.', openingQuestions: ['Current dominant narratives?', 'Upcoming narrative rotations?', 'Hot sector analysis', 'How to position for trend shifts'], plugins: [] } },
  { identifier: 'nft-liquidity-advisor', meta: { title: 'NFT Liquidity Advisor', description: 'Optimize NFT liquidity — floor price analysis, lending, fractionalization', avatar: '🎨', tags: ['nft', 'liquidity', 'floor-price', 'lending'], category: 'general' }, config: { openingMessage: 'I help optimize NFT liquidity and valuation.', openingQuestions: ['NFT floor price analysis', 'NFT lending options?', 'Fractionalization strategies', 'Most liquid NFT collections'], plugins: [] } },
  { identifier: 'portfolio-rebalancing-advisor', meta: { title: 'Portfolio Rebalancing Advisor', description: 'Optimize portfolio allocation — rebalancing strategies, risk parity', avatar: '⚖️', tags: ['portfolio', 'rebalancing', 'allocation', 'risk'], category: 'analysis' }, config: { openingMessage: 'I help optimize your crypto portfolio allocation.', openingQuestions: ['Should I rebalance my portfolio?', 'Optimal allocation strategy?', 'Risk parity approach', 'Tax-efficient rebalancing'], plugins: [] } },
  { identifier: 'protocol-revenue-analyst', meta: { title: 'Protocol Revenue Analyst', description: 'Analyze protocol revenue — fees, token burns, value accrual mechanisms', avatar: '💲', tags: ['revenue', 'protocol', 'fees', 'tokenomics'], category: 'analysis' }, config: { openingMessage: 'I analyze protocol revenue and token value accrual.', openingQuestions: ['Top protocols by revenue?', 'Revenue vs token price correlation', 'Fee structure comparison', 'Sustainable revenue models'], plugins: [] } },
  { identifier: 'protocol-treasury-analyst', meta: { title: 'Protocol Treasury Analyst', description: 'Analyze DAO treasuries — holdings, diversification, runway', avatar: '🏦', tags: ['treasury', 'dao', 'analysis', 'diversification'], category: 'analysis' }, config: { openingMessage: 'I analyze DAO treasuries and financial health.', openingQuestions: ['Largest DAO treasuries?', 'Treasury diversification analysis', 'Protocol runway calculation', 'Treasury management best practices'], plugins: [] } },
  { identifier: 'smart-contract-auditor', meta: { title: 'Smart Contract Auditor', description: 'General smart contract auditing — Solidity vulnerabilities, best practices', avatar: '🔒', tags: ['audit', 'security', 'smart-contract', 'solidity'], category: 'security' }, config: { openingMessage: 'I audit smart contracts for vulnerabilities.', openingQuestions: ['Audit this contract', 'Common Solidity vulnerabilities?', 'Access control best practices', 'Reentrancy prevention patterns'], plugins: [] } },
  { identifier: 'stablecoin-comparator', meta: { title: 'Stablecoin Comparator', description: 'Compare stablecoins — collateral, peg stability, yield, risks', avatar: '💵', tags: ['stablecoin', 'comparison', 'defi', 'yield'], category: 'defi' }, config: { openingMessage: 'I compare stablecoins across key metrics.', openingQuestions: ['Safest stablecoins?', 'Stablecoin yield comparison', 'Algo vs collateralized stables', 'Depeg risk assessment'], plugins: [] } },
  { identifier: 'staking-rewards-calculator', meta: { title: 'Staking Rewards Calculator', description: 'Calculate staking rewards across networks and validators', avatar: '🧮', tags: ['staking', 'rewards', 'calculator', 'yield'], category: 'defi' }, config: { openingMessage: 'I calculate staking rewards across networks.', openingQuestions: ['Calculate my staking rewards', 'Best staking opportunities?', 'Validator comparison', 'Compound vs simple staking'], plugins: [] } },
  { identifier: 'token-unlock-tracker', meta: { title: 'Token Unlock Tracker', description: 'Track token unlock schedules — vesting, cliff, market impact analysis', avatar: '🔓', tags: ['token-unlock', 'vesting', 'supply', 'analysis'], category: 'analysis' }, config: { openingMessage: 'I track token unlock schedules and their market impact.', openingQuestions: ['Upcoming token unlocks?', 'Impact of unlock on price?', 'Vesting schedule analysis', 'Largest unlocks this month'], plugins: [] } },
  { identifier: 'wallet-security-advisor', meta: { title: 'Wallet Security Advisor', description: 'Crypto wallet security — seed phrases, hardware wallets, approval revocation', avatar: '🔑', tags: ['wallet', 'security', 'seed-phrase', 'hardware-wallet'], category: 'security' }, config: { openingMessage: 'I help you secure your crypto wallets.', openingQuestions: ['Check my wallet for risks', 'Hardware wallet setup guide', 'Revoke suspicious approvals', 'Wallet security best practices'], plugins: [] } },
  { identifier: 'whale-watcher', meta: { title: 'Whale Watcher', description: 'Track whale wallets and large movements across chains', avatar: '🐳', tags: ['whale', 'tracking', 'smart-money', 'on-chain'], category: 'analysis' }, config: { openingMessage: 'I track whale movements and smart money activity.', openingQuestions: ['Recent whale movements?', 'Track a whale wallet', 'Smart money flow analysis', 'Exchange inflow/outflow'], plugins: [] } },
  { identifier: 'yield-sustainability-analyst', meta: { title: 'Yield Sustainability Analyst', description: 'Analyze whether DeFi yields are sustainable — emission models, real yield', avatar: '🌱', tags: ['yield', 'sustainability', 'real-yield', 'analysis'], category: 'analysis' }, config: { openingMessage: 'I analyze yield sustainability in DeFi.', openingQuestions: ['Is this yield sustainable?', 'Real yield vs emissions?', 'Yield source breakdown', 'Red flags for unsustainable APY'], plugins: [] } },
  { identifier: 'yield-dashboard-builder', meta: { title: 'Yield Dashboard Builder', description: 'Build custom yield tracking dashboards — aggregation, alerts, analytics', avatar: '📊', tags: ['yield', 'dashboard', 'analytics', 'tracking'], category: 'defi' }, config: { openingMessage: 'I help you build yield tracking dashboards.', openingQuestions: ['Track all my yield positions', 'Set up yield alerts', 'Aggregate yields across protocols', 'Yield performance analytics'], plugins: [] } },
];

const ALL_AGENTS: Agent[] = [
  ...bnbChainAgents.map((a) => ({ ...a, author: 'nirholas' })),
  ...defiAgents.map((a) => ({ ...a, author: 'nirholas' })),
];

const FEATURED_IDS = [
  'pancakeswap-expert',
  'bnb-chain-expert',
  'bsc-security-auditor',
  'binance-futures-expert',
  'cz-binance',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

type Collection = 'all' | 'bnb' | 'defi';

function getTopTags(agents: Agent[], limit = 15): string[] {
  const counts = new Map<string, number>();
  for (const a of agents) {
    for (const t of a.meta.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

function getCategoryCounts(agents: Agent[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of agents) {
    const cat = a.meta.category;
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts;
}

const TOP_TAGS = getTopTags(ALL_AGENTS);
const CATEGORY_COUNTS = getCategoryCounts(ALL_AGENTS);

// ─── Sub-components ─────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const meta = CATEGORY_META[category as Category] ?? CATEGORY_META.general;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        meta.bgColor,
        meta.color,
      )}
    >
      <meta.icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function PluginBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#F0B90B]/10 px-2 py-0.5 text-xs font-medium text-[#F0B90B] dark:bg-[#F0B90B]/20">
      <Plug className="h-3 w-3" />
      {name}
    </span>
  );
}

function TagChip({
  tag,
  active,
  onClick,
}: {
  tag: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-all',
        active
          ? 'border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B]'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-neutral-400 dark:hover:border-white/20',
      )}
    >
      {tag}
    </button>
  );
}

// ─── Agent Card ─────────────────────────────────────────────────────────────

function AgentCard({
  agent,
  idx,
}: {
  agent: Agent;
  idx: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, delay: idx * 0.05 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border transition-all',
        'border-gray-200 bg-white dark:border-white/[0.08] dark:bg-neutral-900',
        'hover:border-[#F0B90B]/40 hover:shadow-lg hover:shadow-[#F0B90B]/5',
      )}
      aria-label={`${agent.meta.title} agent card`}
    >
      {/* Card content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header: Avatar + Title */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-4xl dark:bg-white/[0.05]">
            {agent.meta.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
              {agent.meta.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-neutral-400">
              {agent.meta.description}
            </p>
          </div>
        </div>

        {/* Opening message preview */}
        <div className="mt-3 flex items-start gap-1.5">
          <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400 dark:text-neutral-500" />
          <p className="line-clamp-1 text-sm italic text-gray-400 dark:text-neutral-500">
            &ldquo;{agent.config.openingMessage}&rdquo;
          </p>
        </div>

        {/* Opening questions (first 2) */}
        {agent.config.openingQuestions.length > 0 && (
          <div className="mt-3">
            <div className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-neutral-500">
              <HelpCircle className="h-3 w-3" />
              Opening Questions
            </div>
            <ul className="space-y-0.5">
              {agent.config.openingQuestions.slice(0, 2).map((q, i) => (
                <li
                  key={i}
                  className="truncate text-xs text-gray-500 before:mr-1.5 before:content-['•'] dark:text-neutral-400"
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MCP Plugins */}
        {agent.config.plugins.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agent.config.plugins.map((p) => (
              <PluginBadge key={p} name={p} />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={agent.meta.category} />
          {agent.meta.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-white/[0.05] dark:text-neutral-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Details link */}
        <div className="mt-auto pt-4">
          <Link
            to={`/explore/agent/${agent.identifier}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F0B90B] transition-colors hover:text-[#d4a20a]"
            aria-label={`View details for ${agent.meta.title}`}
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Featured Agent Card ────────────────────────────────────────────────────

function FeaturedAgentCard({
  agent,
  onSelect,
}: {
  agent: Agent;
  onSelect: () => void;
}) {
  return (
    <BackgroundGradient className="rounded-2xl bg-white p-5 dark:bg-neutral-900">
      <button
        onClick={onSelect}
        className="w-full text-left"
        aria-label={`View ${agent.meta.title}`}
      >
        <div className="mb-3 text-4xl">{agent.meta.avatar}</div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {agent.meta.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-neutral-400">
          {agent.meta.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <CategoryBadge category={agent.meta.category} />
          {agent.config.plugins.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F0B90B]/10 px-2 py-0.5 text-xs font-medium text-[#F0B90B]">
              <Plug className="h-3 w-3" />
              {agent.config.plugins.length} MCP
            </span>
          )}
        </div>
      </button>
    </BackgroundGradient>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AgentBrowserPage() {
  useSEO({
    title: 'Agent Browser',
    description:
      '72+ AI agents for BNB Chain, DeFi, trading, security, and more. Browse, filter, and deploy agents with MCP server connections.',
    path: '/agents',
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [category, setCategory] = useState<Category>('all');
  const [collection, setCollection] = useState<Collection>('all');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleTag = useCallback((tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('all');
    setCollection('all');
    setActiveTags(new Set());
  }, []);

  const filteredAgents = useMemo(() => {
    let agents = ALL_AGENTS;

    // Collection filter
    if (collection === 'bnb') {
      agents = agents.filter((a) =>
        bnbChainAgents.some((b) => b.identifier === a.identifier),
      );
    } else if (collection === 'defi') {
      agents = agents.filter((a) =>
        defiAgents.some((b) => b.identifier === a.identifier),
      );
    }

    // Category filter
    if (category !== 'all') {
      agents = agents.filter((a) => a.meta.category === category);
    }

    // Tag filter
    if (activeTags.size > 0) {
      agents = agents.filter((a) =>
        [...activeTags].every((t) => a.meta.tags.includes(t)),
      );
    }

    // Search (debounced)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      agents = agents.filter(
        (a) =>
          a.meta.title.toLowerCase().includes(q) ||
          a.meta.description.toLowerCase().includes(q) ||
          a.meta.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.identifier.toLowerCase().includes(q),
      );
    }

    return agents;
  }, [debouncedSearch, category, collection, activeTags]);

  const featuredAgents = useMemo(
    () => ALL_AGENTS.filter((a) => FEATURED_IDS.includes(a.identifier)),
    [],
  );

  const marqueeItems = useMemo(
    () =>
      featuredAgents.map((a) => ({
        quote: a.meta.description,
        name: a.meta.title,
        title: a.meta.category.charAt(0).toUpperCase() + a.meta.category.slice(1),
        icon: <span className="text-2xl">{a.meta.avatar}</span>,
      })),
    [featuredAgents],
  );

  const hasFilters = search !== '' || category !== 'all' || collection !== 'all' || activeTags.size > 0;

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCategoryClick = (cat: Category) => {
    setCategory(cat);
    scrollToGrid();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* ── Section 1: Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-4 flex items-center justify-center gap-2">
              <Bot className="h-8 w-8 text-[#F0B90B]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              <span className="text-[#F0B90B]">72+</span> AI Agents
            </h1>
            <TextGenerateEffect
              words="Browse, filter, and deploy specialized AI agents for BNB Chain, DeFi, trading, security, and more — each with curated system prompts,  opening questions, and MCP server connections."
              className="mx-auto mt-6 max-w-3xl text-lg text-gray-500 dark:text-neutral-400"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { label: 'Agents', value: '72+', icon: Bot },
              { label: 'Categories', value: `${Object.keys(CATEGORY_COUNTS).length}`, icon: Layers },
              { label: 'MCP Servers', value: '6', icon: Server },
              { label: 'Collections', value: '2', icon: FolderOpen },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200 bg-white/50 p-4 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.03]"
              >
                <stat.icon className="mx-auto mb-1 h-5 w-5 text-[#F0B90B]" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 1b: Featured Agents Marquee ────────────────────────── */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
            Featured Agents
          </h2>
          <InfiniteMovingCards
            items={marqueeItems}
            direction="left"
            speed="slow"
            pauseOnHover
            className="mx-auto"
          />
        </div>
      </section>

      {/* ── Section 2: Search + Filter Bar ─────────────────────────────── */}
      <section ref={gridRef} className="mx-auto max-w-6xl px-4 pb-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-neutral-900 sm:p-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents by name, description, or tags..."
              aria-label="Search agents"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#F0B90B] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/20 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white dark:placeholder:text-neutral-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Collection toggle */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              Collection:
            </span>
            {([
              ['all', 'All Agents', ALL_AGENTS.length],
              ['bnb', 'BNB Chain', bnbChainAgents.length],
              ['defi', 'DeFi', defiAgents.length],
            ] as const).map(([key, label, count]) => (
              collection === key ? (
                <MovingBorder
                  key={key}
                  duration={3}
                  borderRadius="0.5rem"
                  containerClassName="h-auto rounded-lg"
                  className="rounded-lg bg-[#F0B90B] px-3 py-1.5 text-xs font-medium text-black"
                  onClick={() => setCollection(key)}
                  aria-pressed
                  aria-label={`Collection: ${label}`}
                >
                  {label} ({count})
                </MovingBorder>
              ) : (
                <button
                  key={key}
                  onClick={() => setCollection(key)}
                  aria-pressed={false}
                  aria-label={`Collection: ${label}`}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-200 dark:bg-white/[0.05] dark:text-neutral-400 dark:hover:bg-white/[0.1]"
                >
                  {label} ({count})
                </button>
              )
            ))}
          </div>

          {/* Category pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const count = cat === 'all' ? ALL_AGENTS.length : (CATEGORY_COUNTS[cat] ?? 0);
              return (
                <motion.button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                  aria-label={`Filter by ${meta.label}`}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                    category === cat
                      ? 'bg-[#F0B90B] text-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-neutral-400 dark:hover:bg-white/[0.1]',
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <meta.icon className="h-3.5 w-3.5" />
                  {meta.label}
                  <span className="ml-0.5 opacity-60">({count})</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tag chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              Tags:
            </span>
            {TOP_TAGS.map((tag) => (
              <TagChip
                key={tag}
                tag={tag}
                active={activeTags.has(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>

          {/* Result count + clear */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/[0.06]">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Showing{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredAgents.length}
              </span>{' '}
              agent{filteredAgents.length !== 1 ? 's' : ''}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-[#F0B90B] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Section 3: Agent Grid ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {filteredAgents.length === 0 ? (
          <div className="py-20 text-center">
            <Bot className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-neutral-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No agents found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-[#F0B90B] px-4 py-2 text-sm font-medium text-black hover:bg-[#d4a20a]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredAgents.map((agent, idx) => (
                <AgentCard
                  key={agent.identifier}
                  agent={agent}
                  idx={idx}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ── Section 4: Featured Agents (cards with BackgroundGradient) ─── */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Featured Agents
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Our most popular and powerful AI agents
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredAgents.map((agent) => (
              <FeaturedAgentCard
                key={agent.identifier}
                agent={agent}
                onSelect={() => scrollToGrid()}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Agent Categories Overview ───────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Agent Categories
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Browse agents by specialization
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(CATEGORY_META) as Category[])
              .filter((cat) => cat !== 'all')
              .map((cat) => {
                const meta = CATEGORY_META[cat];
                const count = CATEGORY_COUNTS[cat] ?? 0;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={cn(
                      'group rounded-2xl border p-5 text-left transition-all',
                      'border-gray-200 bg-white hover:border-[#F0B90B]/40 hover:shadow-md dark:border-white/[0.08] dark:bg-neutral-900 dark:hover:border-[#F0B90B]/30',
                    )}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={cn(
                        'mb-3 flex h-10 w-10 items-center justify-center rounded-xl',
                        meta.bgColor,
                      )}
                    >
                      <meta.icon className={cn('h-5 w-5', meta.color)} />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {meta.label}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                      {count} agent{count !== 1 ? 's' : ''}
                    </p>
                    <ArrowRight className="mt-2 h-4 w-4 text-gray-300 transition-colors group-hover:text-[#F0B90B] dark:text-neutral-600" />
                  </motion.button>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── Section 6: How Agents Work ─────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              How Agents Work
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Pre-built AI personas with expert domain knowledge
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Bot,
                title: 'Expert Personas',
                description:
                  'Agents are pre-built AI personas with expert knowledge in specific domains — DeFi, trading, security, and more.',
              },
              {
                icon: MessageSquare,
                title: 'Curated Prompts',
                description:
                  'Each agent has a curated system prompt, suggested questions, and opening messages to get you started instantly.',
              },
              {
                icon: Plug,
                title: 'MCP Connected',
                description:
                  'Agents connect to MCP servers for live blockchain data — prices, gas, TVL, and on-chain analytics.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.08] dark:bg-neutral-900"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0B90B]/10">
                  <item.icon className="h-5 w-5 text-[#F0B90B]" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Agent JSON schema example */}
          <div className="mt-8">
            <h3 className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              Agent JSON Schema
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-black p-5 dark:border-white/[0.08]">
              <pre className="text-xs leading-relaxed text-gray-300">
                <code>{`{
  "identifier": "pancakeswap-expert",
  "meta": {
    "title": "PancakeSwap Expert",
    "description": "Expert in PancakeSwap DEX...",
    "avatar": "🥞",
    "tags": ["bnb-chain", "pancakeswap", "dex"],
    "category": "defi"
  },
  "config": {
    "systemRole": "You are a PancakeSwap expert...",
    "openingMessage": "Welcome! I'm your specialist.",
    "openingQuestions": [...],
    "plugins": ["bnbchain-mcp", "binance-mcp"]
  },
  "schemaVersion": 1
}`}</code>
              </pre>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400 dark:text-neutral-500">
              Add agents to Claude, ChatGPT, or Cursor for instant expertise
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 7: CTA ─────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-white/[0.08] dark:bg-neutral-900 sm:p-12">
            <div className="pointer-events-none absolute inset-0">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={30}
                className="h-full w-full"
                particleColor="#F0B90B"
              />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Build Your Own Agent
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 dark:text-neutral-400">
                Use the BNB Agent Builder to create custom AI agents for any BNB Chain protocol.
                Connect to MCP servers for live data and deploy your agent in minutes.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <MovingBorder
                  as="a"
                  duration={3}
                  borderRadius="0.75rem"
                  containerClassName="h-auto rounded-xl"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F0B90B] px-6 py-3 text-sm font-semibold text-black"
                  {...({ href: 'https://github.com/nirholas/bnb-chain-toolkit/blob/main/agent-template.json', target: '_blank', rel: 'noopener noreferrer' } as Record<string, string>)}
                  aria-label="Build your own agent on GitHub"
                >
                  <Wrench className="h-4 w-4" />
                  Agent Template on GitHub
                  <ExternalLink className="h-3 w-3" />
                </MovingBorder>
                <Link
                  to="/mcp"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-neutral-300 dark:hover:bg-white/[0.06]"
                  aria-label="Browse MCP Servers"
                >
                  <Plug className="h-4 w-4" />
                  Browse MCP Servers
                </Link>
                <a
                  href="https://github.com/nirholas/bnb-chain-toolkit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-neutral-300 dark:hover:bg-white/[0.06]"
                  aria-label="View GitHub repository"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
