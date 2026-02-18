/**
 * MCP Server & Tool Catalog Data
 * ═══════════════════════════════════════════════════
 * Static data for all 6 MCP servers and 9 standalone tools.
 * Data extracted from each server's README.md.
 *
 * @author nich (@nichxbt)
 * @license MIT
 * @preserve
 */

// ── Interfaces ──────────────────────────────────────────────────────────

export interface ToolCategory {
  name: string;
  count: number;
  tools: string[];
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  language: "TypeScript" | "Python";
  toolCount: string;
  repoPath: string;
  npmPackage?: string;
  features: string[];
  toolCategories: ToolCategory[];
  installCommand: string;
  configSnippet: string;
  chains?: string[];
  highlights: string[];
}

export interface ToolEntry {
  id: string;
  name: string;
  description: string;
  category: "Market Data" | "DeFi Tools" | "Wallets" | "Standards" | "Packages";
  detail: string;
  repoPath: string;
  featured: boolean;
  icon: string;
}

// ── MCP Servers ─────────────────────────────────────────────────────────

export const mcpServers: MCPServer[] = [
  {
    id: "bnbchain-mcp",
    name: "BNB Chain MCP",
    description:
      "BNB Chain + EVM — balances, transfers, contract calls, GoPlus security, gas tracking",
    longDescription:
      "The most comprehensive Model Context Protocol server for BNB Chain & EVM blockchains. Enable AI agents to interact with BNB Chain, opBNB, and other EVM networks through natural language — covering DeFi, security, market data, and smart contract operations.",
    language: "TypeScript",
    toolCount: "150+",
    repoPath: "mcp-servers/bnbchain-mcp",
    npmPackage: "@nirholas/bnb-chain-mcp",
    features: [
      "Token swaps via 1inch, 0x, ParaSwap DEX aggregators",
      "Cross-chain transfers via LayerZero & Stargate bridges",
      "GoPlus security — honeypot detection, rug pull analysis",
      "Aave & Compound lending positions and borrow rates",
      "CoinGecko & DefiLlama market data and TVL tracking",
      "Flashbots MEV protection and private transactions",
      "ENS/domain registration, transfers, and records",
      "Smart contract deployment, CREATE2, upgradeable proxies",
    ],
    toolCategories: [
      {
        name: "Core Blockchain",
        count: 45,
        tools: [
          "get_chain_info",
          "get_block",
          "get_transaction",
          "send_transaction",
          "estimate_gas",
          "get_balance",
          "call_contract",
        ],
      },
      {
        name: "Token Operations",
        count: 30,
        tools: [
          "get_token_info",
          "get_token_balance",
          "transfer_token",
          "approve_token",
          "get_nft_metadata",
          "transfer_nft",
        ],
      },
      {
        name: "DeFi",
        count: 50,
        tools: [
          "get_swap_quote",
          "execute_swap",
          "add_liquidity",
          "get_lending_rates",
          "supply_to_lending",
          "get_farming_apy",
        ],
      },
      {
        name: "Security",
        count: 15,
        tools: [
          "check_token_security",
          "detect_honeypot",
          "check_rug_pull",
          "get_holder_distribution",
          "screen_address",
        ],
      },
      {
        name: "Market Data",
        count: 25,
        tools: [
          "get_price",
          "get_price_history",
          "get_trending_coins",
          "get_tvl",
          "get_dex_pools",
          "get_social_metrics",
        ],
      },
    ],
    installCommand: "npx -y @nirholas/bnb-chain-mcp@latest",
    configSnippet: JSON.stringify(
      {
        mcpServers: {
          "bnb-chain-mcp": {
            command: "npx",
            args: ["-y", "@nirholas/bnb-chain-mcp@latest"],
          },
        },
      },
      null,
      2,
    ),
    chains: [
      "BNB Chain",
      "opBNB",
      "Ethereum",
      "Arbitrum",
      "Polygon",
      "Base",
      "Optimism",
      "Avalanche",
      "Fantom",
    ],
    highlights: [
      "150+ tools",
      "BNB Chain native",
      "GoPlus security",
      "DEX aggregation",
      "DeFi analytics",
    ],
  },
  {
    id: "binance-mcp",
    name: "Binance MCP",
    description:
      "Binance.com — spot, futures, options, algo trading, copy trading, earn, staking, NFT, Pay",
    longDescription:
      "The most comprehensive Model Context Protocol server for the Binance exchange — 478+ tools covering the entire Binance.com API. Execute trades, manage portfolios, analyze markets, and automate strategies through natural language with Claude, ChatGPT, or any MCP client.",
    language: "TypeScript",
    toolCount: "478+",
    repoPath: "mcp-servers/binance-mcp",
    npmPackage: "@nirholas/binance-mcp",
    features: [
      "Spot, margin, and futures trading with full order management",
      "USD-M & COIN-M perpetual futures contracts",
      "European-style options and portfolio margin",
      "Algo trading — TWAP, VP algorithms",
      "Simple Earn flexible & locked products",
      "Copy trading — lead trader and copy features",
      "NFT marketplace operations and gift cards",
      "Sub-accounts, mining pools, and fiat on/off ramps",
    ],
    toolCategories: [
      {
        name: "Spot Trading",
        count: 35,
        tools: [
          "get_ticker",
          "place_order",
          "cancel_order",
          "get_open_orders",
          "get_order_book",
        ],
      },
      {
        name: "Futures (USD-M)",
        count: 40,
        tools: [
          "get_futures_position",
          "place_futures_order",
          "set_leverage",
          "get_funding_rate",
        ],
      },
      {
        name: "Futures (COIN-M)",
        count: 35,
        tools: [
          "get_coin_futures_position",
          "place_coin_futures_order",
          "get_coin_funding_rate",
        ],
      },
      {
        name: "Wallet",
        count: 40,
        tools: [
          "get_account_balance",
          "withdraw",
          "get_deposit_history",
          "transfer_between_accounts",
        ],
      },
      {
        name: "Margin Trading",
        count: 41,
        tools: [
          "borrow_margin",
          "repay_margin",
          "get_margin_account",
          "get_margin_pairs",
        ],
      },
      {
        name: "Options",
        count: 27,
        tools: [
          "get_options_info",
          "place_options_order",
          "get_options_positions",
        ],
      },
      {
        name: "Earn & Staking",
        count: 50,
        tools: [
          "get_earn_products",
          "subscribe_earn",
          "get_staking_products",
          "stake_asset",
          "get_auto_invest_plans",
        ],
      },
      {
        name: "Algo Trading",
        count: 11,
        tools: [
          "create_twap_order",
          "create_vp_order",
          "get_algo_orders",
        ],
      },
      {
        name: "Copy Trading",
        count: 10,
        tools: [
          "get_lead_traders",
          "copy_trade",
          "get_copy_positions",
        ],
      },
      {
        name: "Additional Services",
        count: 48,
        tools: [
          "get_mining_stats",
          "get_nft_assets",
          "create_gift_card",
          "get_p2p_ads",
          "get_fiat_orders",
          "send_pay",
          "get_convert_quote",
        ],
      },
    ],
    installCommand: "npm install && npm run build && npm start",
    configSnippet: JSON.stringify(
      {
        mcpServers: {
          binance: {
            command: "node",
            args: ["/path/to/Binance-MCP/build/index.js"],
            env: {
              BINANCE_API_KEY: "your_api_key",
              BINANCE_API_SECRET: "your_api_secret",
            },
          },
        },
      },
      null,
      2,
    ),
    highlights: [
      "478+ tools",
      "Full Binance API",
      "Algo trading",
      "Copy trading",
      "Earn & staking",
    ],
  },
  {
    id: "binance-us-mcp",
    name: "Binance.US MCP",
    description:
      "Binance.US — spot, staking, OTC, custodial (US regulatory compliant)",
    longDescription:
      "A Model Context Protocol server purpose-built for the US-regulated Binance.US exchange. Access market data, spot trading, wallet management, staking, OTC trading, and custodial solutions — all fully compliant with US SEC and FinCEN regulations.",
    language: "TypeScript",
    toolCount: "120+",
    repoPath: "mcp-servers/binance-us-mcp",
    features: [
      "Real-time prices, order books, trade history, and kline data",
      "Spot trading — limit, market, and stop-limit orders",
      "Wallet deposits, withdrawals, and balance management",
      "Staking products with reward tracking",
      "OTC over-the-counter trading",
      "Sub-account creation and management",
      "Custodial solution API for custody partners",
      "US SEC / FinCEN regulatory compliant",
    ],
    toolCategories: [
      {
        name: "Market Data",
        count: 25,
        tools: [
          "get_ticker_price",
          "get_order_book",
          "get_recent_trades",
          "get_kline_data",
          "get_24hr_stats",
          "get_exchange_info",
        ],
      },
      {
        name: "Spot Trading",
        count: 30,
        tools: [
          "place_order",
          "cancel_order",
          "get_open_orders",
          "get_order_status",
          "get_trade_history",
        ],
      },
      {
        name: "Wallet",
        count: 25,
        tools: [
          "get_balances",
          "get_deposit_address",
          "get_deposit_history",
          "get_withdrawal_history",
          "withdraw_funds",
        ],
      },
      {
        name: "Account & Staking",
        count: 20,
        tools: [
          "get_account_info",
          "get_api_permissions",
          "get_staking_products",
          "stake_asset",
          "get_staking_history",
        ],
      },
      {
        name: "OTC & Sub-Accounts",
        count: 20,
        tools: [
          "get_otc_quote",
          "place_otc_order",
          "create_sub_account",
          "get_sub_account_balances",
        ],
      },
    ],
    installCommand: "npm install && npm run build && npm start",
    configSnippet: JSON.stringify(
      {
        mcpServers: {
          "binance-us-mcp": {
            command: "node",
            args: ["/path/to/binance-us-mcp-server/build/index.js"],
            env: {
              BINANCE_US_API_KEY: "your_api_key",
              BINANCE_US_API_SECRET: "your_api_secret",
            },
          },
        },
      },
      null,
      2,
    ),
    highlights: [
      "120+ tools",
      "US compliant",
      "Spot trading",
      "OTC trading",
      "Custodial API",
    ],
  },
  {
    id: "universal-crypto-mcp",
    name: "Universal Crypto MCP",
    description:
      "Multi-chain — multi-aggregator DEX, Aave, Compound, Lido, LayerZero bridges, x402",
    longDescription:
      "A universal Model Context Protocol server supporting multiple blockchain networks. Features multi-aggregator DEX swaps, DeFi protocol integration, cross-chain bridges, GoPlus security scanning, and the x402 payment protocol — enabling AI agents to transact autonomously across chains.",
    language: "TypeScript",
    toolCount: "380+",
    repoPath: "mcp-servers/universal-crypto-mcp",
    npmPackage: "@nirholas/universal-crypto-mcp",
    features: [
      "380+ tools across multiple blockchain networks",
      "Multi-aggregator DEX swaps — 1inch, 0x, ParaSwap",
      "DeFi protocols — Aave, Compound, Lido, Uniswap",
      "Cross-chain bridges — LayerZero, Stargate, Wormhole",
      "GoPlus security scanning and honeypot detection",
      "x402 payment protocol — AI agents pay for APIs autonomously",
      "AI Service Marketplace for monetisation and discovery",
      "Technical indicators — RSI, MACD, Bollinger Bands, 50+ more",
    ],
    toolCategories: [
      {
        name: "DEX & Swaps",
        count: 40,
        tools: [
          "get_swap_quote",
          "execute_swap",
          "get_dex_pools",
          "get_pool_liquidity",
          "find_best_route",
        ],
      },
      {
        name: "DeFi Protocols",
        count: 60,
        tools: [
          "aave_supply",
          "aave_borrow",
          "compound_supply",
          "lido_stake",
          "uniswap_add_liquidity",
        ],
      },
      {
        name: "Bridges",
        count: 25,
        tools: [
          "bridge_tokens",
          "get_bridge_quote",
          "layerzero_send",
          "stargate_transfer",
          "wormhole_transfer",
        ],
      },
      {
        name: "Market Data",
        count: 60,
        tools: [
          "get_price",
          "get_ohlcv",
          "get_trending",
          "get_fear_greed",
          "get_tvl",
          "get_social_sentiment",
        ],
      },
      {
        name: "Security",
        count: 20,
        tools: [
          "check_token_security",
          "detect_honeypot",
          "check_rug_pull",
          "screen_address",
        ],
      },
      {
        name: "Wallets & Portfolio",
        count: 30,
        tools: [
          "get_balance",
          "send_transaction",
          "get_portfolio",
          "track_whale",
        ],
      },
      {
        name: "x402 Payments",
        count: 15,
        tools: [
          "x402_check_balance",
          "x402_pay",
          "x402_get_history",
          "register_service",
        ],
      },
      {
        name: "Technical Analysis",
        count: 50,
        tools: [
          "get_rsi",
          "get_macd",
          "get_bollinger_bands",
          "get_moving_average",
        ],
      },
    ],
    installCommand: "npx -y @nirholas/universal-crypto-mcp",
    configSnippet: JSON.stringify(
      {
        mcpServers: {
          "universal-crypto-mcp": {
            command: "npx",
            args: ["-y", "@nirholas/universal-crypto-mcp"],
          },
        },
      },
      null,
      2,
    ),
    chains: [
      "Ethereum",
      "BNB Chain",
      "Polygon",
      "Arbitrum",
      "Base",
      "Optimism",
      "Avalanche",
      "Fantom",
      "zkSync",
      "Linea",
      "Scroll",
      "Blast",
      "Solana",
      "Cosmos",
      "Near",
      "Sui",
      "Aptos",
      "and more",
    ],
    highlights: [
      "380+ tools",
      "Multi-chain",
      "x402 payments",
      "Multi-DEX",
      "Bridge support",
    ],
  },
  {
    id: "agenti",
    name: "Agenti",
    description:
      "EVM + Solana — Flashbots MEV protection, Wormhole bridges, x402 payments",
    longDescription:
      "A universal Model Context Protocol server for EVM + Solana blockchains. Includes Flashbots MEV protection, Wormhole cross-chain bridges, x402 autonomous payment protocol, and comprehensive DeFi tooling — enabling AI agents to operate across 20+ chains with full autonomy.",
    language: "TypeScript",
    toolCount: "380+",
    repoPath: "mcp-servers/agenti",
    npmPackage: "@nirholas/agenti",
    features: [
      "380+ tools across EVM + Solana chains",
      "Flashbots MEV protection and private transactions",
      "Wormhole cross-chain bridge integration",
      "x402 payment protocol — AI-to-AI and AI-to-API payments",
      "Multi-aggregator DEX — 1inch, 0x, ParaSwap",
      "DeFi protocols — Aave, Compound, Lido, Uniswap",
      "Real-time WebSocket price streams and mempool monitoring",
      "Whale tracking, wallet scoring, and behavior analysis",
    ],
    toolCategories: [
      {
        name: "DEX & Swaps",
        count: 40,
        tools: [
          "get_swap_quote",
          "execute_swap",
          "find_best_route",
          "get_pool_data",
        ],
      },
      {
        name: "DeFi Protocols",
        count: 60,
        tools: [
          "aave_supply",
          "compound_borrow",
          "lido_stake",
          "uniswap_v3_positions",
        ],
      },
      {
        name: "Bridges",
        count: 30,
        tools: [
          "wormhole_transfer",
          "layerzero_send",
          "stargate_bridge",
          "get_bridge_status",
        ],
      },
      {
        name: "MEV Protection",
        count: 15,
        tools: [
          "flashbots_send_bundle",
          "flashbots_simulate",
          "private_transaction",
        ],
      },
      {
        name: "Market Data",
        count: 55,
        tools: [
          "get_price",
          "get_ohlcv",
          "get_trending",
          "get_tvl",
          "get_social_metrics",
          "get_predictions",
        ],
      },
      {
        name: "Security",
        count: 20,
        tools: [
          "check_token_security",
          "detect_honeypot",
          "check_rug_pull",
          "screen_address",
        ],
      },
      {
        name: "x402 Payments",
        count: 15,
        tools: [
          "x402_check_balance",
          "x402_pay",
          "x402_register_service",
          "x402_discover_services",
        ],
      },
      {
        name: "Wallets & Analytics",
        count: 35,
        tools: [
          "get_balance",
          "send_tx",
          "track_whale",
          "wallet_score",
          "portfolio_summary",
        ],
      },
    ],
    installCommand: "npx -y @nirholas/agenti",
    configSnippet: JSON.stringify(
      {
        mcpServers: {
          agenti: {
            command: "npx",
            args: ["-y", "@nirholas/agenti"],
          },
        },
      },
      null,
      2,
    ),
    chains: [
      "Ethereum",
      "BNB Chain",
      "Polygon",
      "Arbitrum",
      "Base",
      "Optimism",
      "Solana",
      "Cosmos",
      "Near",
      "Sui",
      "Aptos",
      "20+ more",
    ],
    highlights: [
      "380+ tools",
      "EVM + Solana",
      "MEV protection",
      "x402 payments",
      "Whale tracking",
    ],
  },
  {
    id: "ucai",
    name: "UCAI",
    description:
      "ABI-to-MCP generator — turn any smart contract ABI into an MCP server",
    longDescription:
      "The Universal Contract AI Interface — generate a production-ready MCP server from any smart contract ABI in seconds. Supports any EVM chain, includes built-in transaction simulation, security scanning, and the UCAI standard for AI–smart-contract interoperability.",
    language: "Python",
    toolCount: "∞",
    repoPath: "mcp-servers/ucai",
    npmPackage: undefined,
    features: [
      "Generate MCP servers from any verified contract ABI",
      "Works on any EVM chain — Ethereum, BNB Chain, Polygon, etc.",
      "Built-in transaction simulation before execution",
      "Security scanner — detects rug pulls, honeypots, 50+ risks",
      "Contract Whisperer — explains contracts in plain English",
      "Pro templates — Flash Loans, Arbitrage, Yield Aggregators",
      "Web builder at mcp.ucai.tech — no install required",
      "Listed in the official Anthropic MCP Registry",
    ],
    toolCategories: [
      {
        name: "Generator",
        count: 5,
        tools: [
          "generate_server",
          "validate_abi",
          "list_functions",
          "list_events",
        ],
      },
      {
        name: "Security Scanner",
        count: 8,
        tools: [
          "scan_contract",
          "detect_rug_pull",
          "check_honeypot",
          "ownership_analysis",
        ],
      },
      {
        name: "Contract Whisperer",
        count: 4,
        tools: [
          "explain_contract",
          "explain_function",
          "explain_event",
        ],
      },
      {
        name: "Templates",
        count: 6,
        tools: [
          "flash_loan_template",
          "arbitrage_template",
          "yield_aggregator_template",
        ],
      },
    ],
    installCommand: "pip install abi-to-mcp",
    configSnippet: JSON.stringify(
      {
        mcpServers: {
          ucai: {
            command: "python",
            args: ["-m", "abi_to_mcp", "serve"],
            env: {
              RPC_URL: "https://bsc-dataseed.binance.org",
            },
          },
        },
      },
      null,
      2,
    ),
    chains: [
      "Any EVM chain",
      "Ethereum",
      "BNB Chain",
      "Polygon",
      "Arbitrum",
      "Base",
      "Optimism",
    ],
    highlights: [
      "∞ dynamic tools",
      "Any ABI → MCP",
      "Security scanner",
      "Web builder",
      "Python",
    ],
  },
];

// ── Tool Catalog ────────────────────────────────────────────────────────

export const toolCatalog: ToolEntry[] = [
  {
    id: "crypto-market-data",
    name: "Crypto Market Data",
    description:
      "Real-time and historical price feeds from CoinGecko, CoinMarketCap, and DexPaprika.",
    category: "Market Data",
    detail: "Multi-source price aggregation with OHLCV support",
    repoPath: "market-data/crypto-market-data",
    featured: true,
    icon: "TrendingUp",
  },
  {
    id: "crypto-news",
    name: "Crypto News Aggregator",
    description:
      "Aggregated news from CryptoPanic, RSS feeds, and social media with sentiment analysis.",
    category: "Market Data",
    detail: "NLP-powered sentiment scoring on crypto news",
    repoPath: "market-data/crypto-news",
    featured: true,
    icon: "Newspaper",
  },
  {
    id: "dust-sweeper",
    name: "Dust Sweeper",
    description:
      "Automatically sweep small token balances (dust) and consolidate into a single asset.",
    category: "DeFi Tools",
    detail: "Multi-token dust aggregation → single consolidated swap",
    repoPath: "defi-tools/sweep",
    featured: true,
    icon: "Sparkles",
  },
  {
    id: "hd-wallet-generator",
    name: "HD Wallet Generator",
    description:
      "Generate hierarchical deterministic (BIP-39/44) wallets — fully offline and secure.",
    category: "Wallets",
    detail: "BIP-39 mnemonic + BIP-44 derivation, air-gapped",
    repoPath: "wallets",
    featured: true,
    icon: "KeyRound",
  },
  {
    id: "transaction-signer",
    name: "Transaction Signer",
    description:
      "Sign Ethereum & BNB Chain transactions offline for maximum security.",
    category: "Wallets",
    detail: "Offline EIP-1559 & legacy transaction signing",
    repoPath: "wallets",
    featured: true,
    icon: "PenTool",
  },
  {
    id: "offline-wallet-html",
    name: "Offline Wallet HTML",
    description:
      "A single HTML file for generating wallets completely offline — no internet required.",
    category: "Wallets",
    detail: "Self-contained HTML5 wallet generator",
    repoPath: "wallets",
    featured: false,
    icon: "Globe",
  },
  {
    id: "erc-8004-verifier",
    name: "ERC-8004 Verifier",
    description:
      "Verify agent compliance with the ERC-8004 standard for on-chain AI agent identification.",
    category: "Standards",
    detail: "ERC-8004 on-chain agent identity verification",
    repoPath: "standards/erc-8004",
    featured: true,
    icon: "ShieldCheck",
  },
  {
    id: "w3ag-checker",
    name: "W3AG Checker",
    description:
      "Check adherence to the W3AG (Web3 Agent Guidelines) specification for AI agents.",
    category: "Standards",
    detail: "W3AG spec compliance checker",
    repoPath: "standards/w3ag",
    featured: true,
    icon: "CheckCircle",
  },
  {
    id: "lyra-market-data",
    name: "Lyra Market Data",
    description:
      "An npm package for streaming real-time crypto market data — prices, candles, tickers.",
    category: "Packages",
    detail: "npm: @nirholas/lyra-market-data — streaming WebSocket API",
    repoPath: "packages/lyra-market-data",
    featured: true,
    icon: "Package",
  },
];

// ── Helper functions ────────────────────────────────────────────────────

export function getServerById(id: string): MCPServer | undefined {
  return mcpServers.find((s) => s.id === id);
}

export function getToolsByCategory(
  category: ToolEntry["category"],
): ToolEntry[] {
  return toolCatalog.filter((t) => t.category === category);
}

export function getFeaturedTools(): ToolEntry[] {
  return toolCatalog.filter((t) => t.featured);
}

export const toolCategories: ToolEntry["category"][] = [
  "Market Data",
  "DeFi Tools",
  "Wallets",
  "Standards",
  "Packages",
];

/** Combined claude_desktop_config.json for all 6 servers */
export const allServersConfig = JSON.stringify(
  {
    mcpServers: {
      "bnb-chain-mcp": {
        command: "npx",
        args: ["-y", "@nirholas/bnb-chain-mcp@latest"],
      },
      binance: {
        command: "node",
        args: ["/path/to/Binance-MCP/build/index.js"],
        env: {
          BINANCE_API_KEY: "your_api_key",
          BINANCE_API_SECRET: "your_api_secret",
        },
      },
      "binance-us": {
        command: "node",
        args: ["/path/to/binance-us-mcp-server/build/index.js"],
        env: {
          BINANCE_US_API_KEY: "your_api_key",
          BINANCE_US_API_SECRET: "your_api_secret",
        },
      },
      "universal-crypto-mcp": {
        command: "npx",
        args: ["-y", "@nirholas/universal-crypto-mcp"],
      },
      agenti: {
        command: "npx",
        args: ["-y", "@nirholas/agenti"],
      },
      ucai: {
        command: "python",
        args: ["-m", "abi_to_mcp", "serve"],
        env: {
          RPC_URL: "https://bsc-dataseed.binance.org",
        },
      },
    },
  },
  null,
  2,
);
