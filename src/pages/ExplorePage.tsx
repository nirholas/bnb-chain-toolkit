/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every bug fixed is a lesson learned 🎓
 */

import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import {
  Search,
  Bot,
  Server,
  Wrench,
  ExternalLink,
} from "lucide-react";

type Tab = "agents" | "servers" | "tools";

interface AgentItem {
  name: string;
  description: string;
  category: string;
}

interface ServerItem {
  name: string;
  description: string;
  toolCount: number;
  language: string;
}

interface ToolItem {
  name: string;
  description: string;
  category: string;
}

const agents: AgentItem[] = [
  { name: "PancakeSwap Expert", description: "Swap, LP, and yield farming on PancakeSwap V3", category: "DeFi" },
  { name: "Venus Protocol Expert", description: "Lending, borrowing, and liquidation on Venus", category: "DeFi" },
  { name: "BNB Staking Advisor", description: "Staking strategies, validators, and rewards on BNB Chain", category: "Staking" },
  { name: "BSC Developer", description: "Smart contract development, deployment, and verification on BSC", category: "Dev" },
  { name: "BSC Security Auditor", description: "Audit smart contracts for vulnerabilities and best practices", category: "Security" },
  { name: "BNB Chain Expert", description: "General BNB Chain knowledge, architecture, and ecosystem", category: "General" },
  { name: "opBNB L2 Expert", description: "Layer 2 scaling, transactions, and bridging on opBNB", category: "L2" },
  { name: "BNB Greenfield Expert", description: "Decentralized storage on BNB Greenfield", category: "Storage" },
  { name: "BSC Whale Tracker", description: "Track large wallet movements and whale activity on BSC", category: "Analytics" },
  { name: "BNB Bridge Expert", description: "Cross-chain bridging between BSC, opBNB, and other networks", category: "Bridge" },
  { name: "BNB NFT Expert", description: "NFT minting, trading, and marketplace operations on BNB Chain", category: "NFT" },
  { name: "BNB Governance Expert", description: "On-chain governance, proposals, and voting on BNB Chain", category: "Governance" },
  { name: "BNB Liquid Staking", description: "Liquid staking derivatives and strategies on BNB Chain", category: "Staking" },
  { name: "Lista DAO Expert", description: "Lista DAO operations, staking, and CDP management", category: "DeFi" },
  { name: "Thena DEX Expert", description: "Trading, LP, and ve(3,3) mechanics on Thena", category: "DeFi" },
  { name: "Alpaca Finance Expert", description: "Leveraged yield farming and lending on Alpaca Finance", category: "DeFi" },
  { name: "BSCScan Analytics", description: "On-chain analytics, contract verification, and transaction tracking", category: "Analytics" },
  { name: "BSC MEV Gas Expert", description: "MEV strategies, gas optimization, and block building on BSC", category: "Advanced" },
  { name: "BNB DeFi Aggregator", description: "Multi-protocol yield and swap aggregation across BNB DeFi", category: "DeFi" },
  { name: "BNB Gaming Expert", description: "GameFi protocols, in-game economies, and NFT gaming on BNB", category: "Gaming" },
  { name: "Binance Spot Trader", description: "Spot trading, order management, and market analysis on Binance", category: "CEX" },
  { name: "Binance Futures Expert", description: "Futures, margin, and perpetual trading on Binance", category: "CEX" },
  { name: "Binance Earn Advisor", description: "Savings, staking, and yield products on Binance Earn", category: "CEX" },
  { name: "Binance Web3 Wallet", description: "Binance Web3 Wallet operations, dApp browsing, and token management", category: "Wallet" },
];

const servers: ServerItem[] = [
  { name: "bnbchain-mcp", description: "BNB Chain + EVM operations — balances, transfers, contract calls, and token analytics", toolCount: 150, language: "TypeScript" },
  { name: "binance-mcp", description: "Binance.com exchange — spot trading, futures, earn products, and account management", toolCount: 200, language: "TypeScript" },
  { name: "binance-us-mcp", description: "Binance.US exchange — regulated US trading, deposits, and withdrawals", toolCount: 120, language: "TypeScript" },
  { name: "universal-crypto-mcp", description: "60+ blockchain networks — universal crypto operations across chains", toolCount: 300, language: "TypeScript" },
  { name: "agenti", description: "Universal EVM + Solana — advanced agent operations, DeFi protocols, and NFTs", toolCount: 100, language: "TypeScript" },
  { name: "ucai", description: "ABI-to-MCP generator — create custom MCP tools from any smart contract ABI", toolCount: 30, language: "Python" },
];

const tools: ToolItem[] = [
  { name: "Crypto Market Data", description: "Real-time price feeds, OHLCV data, and market cap rankings from CoinGecko and DeFiLlama", category: "Market Data" },
  { name: "Crypto News", description: "Aggregated news from 200+ sources with AI-powered sentiment analysis and event classification", category: "Market Data" },
  { name: "Dust Sweeper", description: "Identify and consolidate small token balances across wallets on BNB Chain", category: "DeFi" },
  { name: "HD Wallet Generator", description: "Generate hierarchical deterministic wallets with BIP-39 mnemonics offline", category: "Wallets" },
  { name: "Vanity Address Generator", description: "Create custom wallet addresses with specific prefixes or suffixes", category: "Wallets" },
  { name: "Transaction Signer", description: "Sign and broadcast transactions offline with hardware wallet support", category: "Wallets" },
  { name: "ERC-8004 Verifier", description: "Verify agent trust metadata following the ERC-8004 standard", category: "Standards" },
  { name: "W3AG Checker", description: "Web3 accessibility compliance checker based on the W3AG specification", category: "Standards" },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("agents");
  const [search, setSearch] = useState("");

  useSEO({
    title: "Explore",
    description:
      "Discover 72+ AI agents, 6 MCP servers, and 900+ tools in the BNB Chain AI Toolkit — browse, search, and find the right component for your project.",
    path: "/explore",
  });

  const filteredAgents = useMemo(() => {
    if (!search.trim()) return agents;
    const q = search.toLowerCase();
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredServers = useMemo(() => {
    if (!search.trim()) return servers;
    const q = search.toLowerCase();
    return servers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredTools = useMemo(() => {
    if (!search.trim()) return tools;
    const q = search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [search]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "agents", label: "AI Agents", icon: <Bot className="w-4 h-4" />, count: filteredAgents.length },
    { id: "servers", label: "MCP Servers", icon: <Server className="w-4 h-4" />, count: filteredServers.length },
    { id: "tools", label: "Tools & Utilities", icon: <Wrench className="w-4 h-4" />, count: filteredTools.length },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Explore the Toolkit
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse every agent, server, and tool in the ecosystem. Find exactly
            what you need for your next project.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents, servers, tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-3.5 rounded-2xl",
                "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10",
                "focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50 focus:border-[#F0B90B]/50",
                "placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "text-gray-900 dark:text-white"
              )}
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === tab.id
                    ? "border-[#F0B90B] text-[#F0B90B]"
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {tab.icon}
                {tab.label}
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-500">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          {/* Agents */}
          {activeTab === "agents" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.name}
                  className={cn(
                    "rounded-2xl border border-gray-200 dark:border-white/10 p-5",
                    "bg-white dark:bg-black",
                    "hover:border-[#F0B90B]/40 dark:hover:border-white/20 transition-all duration-200"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-4 h-4 text-[#F0B90B] shrink-0" />
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {agent.description}
                  </p>
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-[#F0B90B]/10 text-[#F0B90B]">
                    {agent.category}
                  </span>
                </div>
              ))}
              {filteredAgents.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No agents match your search.
                </div>
              )}
              {filteredAgents.length > 0 && (
                <div className="col-span-full text-center pt-8">
                  <p className="text-sm text-gray-500">
                    Showing {filteredAgents.length} of 72+ agents.{" "}
                    <a
                      href="https://github.com/nirholas/bnb-chain-toolkit/tree/main/agents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F0B90B] hover:underline inline-flex items-center gap-1"
                    >
                      Browse all on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Servers */}
          {activeTab === "servers" && (
            <div className="grid md:grid-cols-2 gap-5">
              {filteredServers.map((server) => (
                <div
                  key={server.name}
                  className={cn(
                    "rounded-2xl border border-gray-200 dark:border-white/10 p-6",
                    "bg-white dark:bg-black",
                    "hover:border-[#F0B90B]/40 dark:hover:border-white/20 transition-all duration-200"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Server className="w-5 h-5 text-[#F0B90B] shrink-0" />
                    <h3 className="font-semibold">{server.name}</h3>
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-500">
                      {server.language}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {server.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#F0B90B]">
                      {server.toolCount}+ tools
                    </span>
                    <a
                      href={`https://github.com/nirholas/bnb-chain-toolkit/tree/main/mcp-servers/${server.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F0B90B] inline-flex items-center gap-1 transition-colors"
                    >
                      View source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
              {filteredServers.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No servers match your search.
                </div>
              )}
            </div>
          )}

          {/* Tools */}
          {activeTab === "tools" && (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.name}
                  className={cn(
                    "rounded-2xl border border-gray-200 dark:border-white/10 p-5",
                    "bg-white dark:bg-black",
                    "hover:border-[#F0B90B]/40 dark:hover:border-white/20 transition-all duration-200"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-4 h-4 text-[#F0B90B] shrink-0" />
                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-500">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {tool.description}
                  </p>
                </div>
              ))}
              {filteredTools.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No tools match your search.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
