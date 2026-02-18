/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Small steps lead to big achievements 🏔️
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SparklesCore } from "@/components/ui/sparkles";
import { MovingBorder } from "@/components/ui/moving-border";
import {
  Search,
  Coins,
  Image,
  ArrowRightLeft,
  Brain,
  Wallet,
  Vote,
  Lock,
  Sprout,
  Cable,
  Users,
  Clock,
  Sparkles,
  FileCode,
  Code2,
  Layers,
  Shield,
  Zap,
  Server,
  Eye,
  Terminal,
} from "lucide-react";

type Category = "All" | "Web3" | "DeFi" | "NFT" | "AI" | "MCP" | "Tools";

interface Example {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  icon: React.ReactNode;
  featured?: boolean;
}

const categories: Category[] = ["All", "Web3", "DeFi", "NFT", "AI", "MCP", "Tools"];

const examples: Example[] = [
  {
    id: "mcp-claude-setup",
    title: "MCP + Claude Desktop",
    description:
      "Connect bnbchain-mcp to Claude Desktop and start querying BNB Chain balances, token data, and gas prices in conversation.",
    category: "MCP",
    difficulty: "Beginner",
    tags: ["MCP", "Claude", "Config"],
    icon: <Server className="w-5 h-5" />,
    featured: true,
  },
  {
    id: "abi-to-mcp",
    title: "ABI → MCP Generator",
    description:
      "Use ucai to turn any smart contract ABI into a full MCP server with auto-generated tools. pip install abi-to-mcp.",
    category: "MCP",
    difficulty: "Intermediate",
    tags: ["ucai", "Python", "ABI"],
    icon: <Terminal className="w-5 h-5" />,
    featured: true,
  },
  {
    id: "dust-sweeper",
    title: "Dust Sweeper",
    description:
      "Consolidate small token balances across 8 chains with gasless ERC-4337 transactions. Routes into Aave, Yearn, Beefy yields.",
    category: "Tools",
    difficulty: "Advanced",
    tags: ["ERC-4337", "CoW Protocol", "Multi-chain"],
    icon: <Zap className="w-5 h-5" />,
    featured: true,
  },
  {
    id: "erc20-token",
    title: "BEP-20 Token",
    description:
      "Create, deploy, and verify a BEP-20 token on BNB Chain with configurable supply, decimals, and BSCScan verification.",
    category: "Web3",
    difficulty: "Beginner",
    tags: ["Solidity", "BEP-20", "Deploy"],
    icon: <Coins className="w-5 h-5" />,
  },
  {
    id: "nft-minter",
    title: "NFT Minter",
    description:
      "Mint ERC-721 NFTs on BNB Chain with IPFS metadata, whitelist support, and on-chain royalties.",
    category: "NFT",
    difficulty: "Intermediate",
    tags: ["ERC-721", "IPFS", "Mint"],
    icon: <Image className="w-5 h-5" />,
  },
  {
    id: "token-swap",
    title: "PancakeSwap Swap",
    description:
      "Build a DEX swap interface powered by PancakeSwap Router — get quotes, execute swaps, and manage slippage on BNB Chain.",
    category: "DeFi",
    difficulty: "Intermediate",
    tags: ["PancakeSwap", "Router", "AMM"],
    icon: <ArrowRightLeft className="w-5 h-5" />,
  },
  {
    id: "defi-lending",
    title: "Venus Lending",
    description:
      "Integrate Venus Protocol for lending and borrowing on BNB Chain with supply, borrow, repay, and liquidation monitoring.",
    category: "DeFi",
    difficulty: "Advanced",
    tags: ["Venus", "Lending", "Liquidation"],
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: "wallet-connect",
    title: "Wallet Connect",
    description:
      "Connect MetaMask, Trust Wallet, and WalletConnect v2 with chain switching, account management, and BNB Chain configuration.",
    category: "Web3",
    difficulty: "Beginner",
    tags: ["MetaMask", "WalletConnect", "ethers.js"],
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    id: "dao-governance",
    title: "DAO Governance",
    description:
      "On-chain voting and proposal system with quorum rules, timelock execution, and delegate support on BSC.",
    category: "Web3",
    difficulty: "Advanced",
    tags: ["Governor", "Timelock", "Voting"],
    icon: <Vote className="w-5 h-5" />,
  },
  {
    id: "liquid-staking",
    title: "Liquid Staking",
    description:
      "Compare slisBNB, BNBx, and ankrBNB liquid staking derivatives with APY calculation, DeFi composability, and reward tracking.",
    category: "DeFi",
    difficulty: "Intermediate",
    tags: ["slisBNB", "BNBx", "LST"],
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: "yield-farming",
    title: "Yield Farming",
    description:
      "LP yield optimization with auto-compounding across PancakeSwap, Thena, and Alpaca Finance with harvest scheduling.",
    category: "DeFi",
    difficulty: "Advanced",
    tags: ["LP", "Auto-compound", "Farm"],
    icon: <Sprout className="w-5 h-5" />,
  },
  {
    id: "cross-chain-bridge",
    title: "Cross-Chain Bridge",
    description:
      "Bridge assets between BSC, opBNB, Ethereum via LayerZero, Stargate, and Wormhole with route optimization and fee comparison.",
    category: "Web3",
    difficulty: "Advanced",
    tags: ["LayerZero", "Stargate", "opBNB"],
    icon: <Cable className="w-5 h-5" />,
  },
  {
    id: "whale-tracker",
    title: "Whale Tracker",
    description:
      "Track large wallet movements on BSC using the BSC Whale Tracker agent — alerts, flow analysis, and exchange monitoring.",
    category: "AI",
    difficulty: "Intermediate",
    tags: ["Agent", "Analytics", "Alerts"],
    icon: <Eye className="w-5 h-5" />,
  },
  {
    id: "security-audit",
    title: "Smart Contract Audit",
    description:
      "Use the BSC Security Auditor agent to scan contracts for reentrancy, access control, overflow, and rug-pull patterns.",
    category: "AI",
    difficulty: "Advanced",
    tags: ["GoPlus", "Security", "Audit"],
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: "multi-sig-wallet",
    title: "Multi-Sig Wallet",
    description:
      "Multi-signature wallet with configurable threshold, transaction queue, and owner management on BNB Chain.",
    category: "Web3",
    difficulty: "Intermediate",
    tags: ["Multi-sig", "Security", "Gnosis"],
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "token-vesting",
    title: "Token Vesting",
    description:
      "Linear and cliff vesting schedules with revocable grants, beneficiary management, and claim interfaces.",
    category: "DeFi",
    difficulty: "Intermediate",
    tags: ["Vesting", "Cliff", "Schedule"],
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "ai-contract-generator",
    title: "AI Contract Generator",
    description:
      "Generate production-ready Solidity contracts from natural language descriptions using the BSC Developer agent.",
    category: "AI",
    difficulty: "Advanced",
    tags: ["Codegen", "Solidity", "AI Agent"],
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "ai-fullstack-builder",
    title: "AI Full-Stack dApp",
    description:
      "End-to-end AI-powered development — smart contract generation, frontend scaffolding, MCP integration, and deployment.",
    category: "AI",
    difficulty: "Advanced",
    tags: ["Full-Stack", "AI", "Deploy"],
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    id: "news-sentiment",
    title: "News Sentiment Feed",
    description:
      "Use the crypto news API (662K+ articles) to build a real-time sentiment dashboard for BNB Chain ecosystem tokens.",
    category: "Tools",
    difficulty: "Intermediate",
    tags: ["News API", "Sentiment", "Dashboard"],
    icon: <Brain className="w-5 h-5" />,
  },
];

const difficultyColor: Record<string, string> = {
  Beginner: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  Intermediate: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
  Advanced: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
};

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  useSEO({
    title: "Examples",
    description:
      "Browse example projects built with BNB Chain AI Toolkit — MCP integrations, DeFi protocols, AI agents, and more.",
    path: "/examples",
  });

  const filtered = useMemo(() => {
    return examples.filter((ex) => {
      const matchCat =
        selectedCategory === "All" || ex.category === selectedCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        ex.title.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q) ||
        ex.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  const featured = examples.filter((e) => e.featured);
  const nonFeatured = filtered.filter((e) => !e.featured);
  const showFeatured = selectedCategory === "All" && !search.trim();

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <TextGenerateEffect
            words="Examples"
            className="text-4xl md:text-5xl font-bold tracking-tight"
          />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Production-ready code samples — from MCP server setup to gasless
            dust sweeping, from AI agents to cross-chain bridges.
          </p>
        </div>
      </section>

      {/* Featured 3D Cards */}
      {showFeatured && (
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Featured</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((ex) => (
                <CardContainer key={ex.id} containerClassName="py-0">
                  <CardBody className="relative group/card rounded-2xl p-6 border border-gray-200 dark:border-white/10 bg-white dark:bg-black h-full">
                    <CardItem translateZ="50" className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#F0B90B]/10 text-[#F0B90B]">
                          {ex.icon}
                        </div>
                        <h3 className="font-bold">{ex.title}</h3>
                      </div>
                    </CardItem>
                    <CardItem translateZ="30" className="w-full">
                      <p className="text-sm text-gray-500 mb-4">
                        {ex.description}
                      </p>
                    </CardItem>
                    <CardItem translateZ="20" className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {ex.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ml-2",
                            difficultyColor[ex.difficulty]
                          )}
                        >
                          {ex.difficulty}
                        </span>
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search examples..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                  "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10",
                  "focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-600"
                )}
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => {
                const count = cat === "All"
                  ? examples.length
                  : examples.filter((e) => e.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      selectedCategory === cat
                        ? "bg-[#F0B90B] text-black"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                    )}
                  >
                    {cat}
                    <span className="ml-1 text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <FileCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No examples match your filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-[#F0B90B] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(showFeatured ? nonFeatured : filtered).map((ex) => (
                <BackgroundGradient
                  key={ex.id}
                  className="rounded-2xl p-6 bg-white dark:bg-black"
                  containerClassName="h-full"
                >
                  <Link to={`/example/${ex.id}`} className="block group h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-[#F0B90B]">
                        {ex.icon}
                      </div>
                      <h3 className="font-semibold group-hover:text-[#F0B90B] transition-colors">
                        {ex.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {ex.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {ex.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ml-2",
                          difficultyColor[ex.difficulty]
                        )}
                      >
                        {ex.difficulty}
                      </span>
                    </div>
                  </Link>
                </BackgroundGradient>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Build Your Own CTA — SparklesCore + MovingBorder */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            minSize={0.4}
            maxSize={1}
            particleDensity={40}
            className="w-full h-full"
            particleColor="#F0B90B"
          />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Code2 className="w-10 h-10 mx-auto mb-6 text-[#F0B90B]" />
          <h2 className="text-3xl font-bold mb-4">Build Something New</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            With 78 agents, 6 MCP servers, and 1,100+ tools at your fingertips,
            the only limit is your imagination. Share your builds with the community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MovingBorder
              as="a"
              duration={3}
              containerClassName="h-12"
              className="bg-[#F0B90B] text-black font-semibold"
              {...{ href: "/docs/getting-started" } as any}
            >
              Get Started
            </MovingBorder>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 font-semibold hover:border-[#F0B90B]/50 transition-colors"
            >
              Explore Components
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
