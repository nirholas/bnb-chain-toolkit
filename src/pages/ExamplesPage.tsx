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
} from "lucide-react";

type Category = "All" | "Web3" | "DeFi" | "NFT" | "AI" | "Full-Stack";

interface Example {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  icon: React.ReactNode;
}

const categories: Category[] = ["All", "Web3", "DeFi", "NFT", "AI", "Full-Stack"];

const examples: Example[] = [
  {
    id: "erc20-token",
    title: "ERC20 Token",
    description:
      "Create, deploy, and verify a BEP-20 token on BNB Chain with configurable supply, decimals, and metadata.",
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
    title: "Token Swap",
    description:
      "Build a DEX swap interface powered by PancakeSwap Router — get quotes, execute swaps, and manage slippage.",
    category: "DeFi",
    difficulty: "Intermediate",
    tags: ["PancakeSwap", "Router", "AMM"],
    icon: <ArrowRightLeft className="w-5 h-5" />,
  },
  {
    id: "defi-lending",
    title: "DeFi Lending",
    description:
      "Integrate Venus Protocol for lending and borrowing on BNB Chain with supply, borrow, and repay flows.",
    category: "DeFi",
    difficulty: "Advanced",
    tags: ["Venus", "Lending", "Liquidation"],
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: "wallet-connect",
    title: "Wallet Connect",
    description:
      "Connect MetaMask, Trust Wallet, and WalletConnect v2 with chain switching and account management.",
    category: "Web3",
    difficulty: "Beginner",
    tags: ["MetaMask", "WalletConnect", "ethers.js"],
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    id: "dao-governance",
    title: "DAO Governance",
    description:
      "On-chain voting and proposal system with quorum rules, timelock execution, and delegate support.",
    category: "Web3",
    difficulty: "Advanced",
    tags: ["Governor", "Timelock", "Voting"],
    icon: <Vote className="w-5 h-5" />,
  },
  {
    id: "staking",
    title: "Staking",
    description:
      "Token staking contract with reward distribution, lock periods, and APY calculation helpers.",
    category: "DeFi",
    difficulty: "Intermediate",
    tags: ["Staking", "Rewards", "APY"],
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: "yield-farming",
    title: "Yield Farming",
    description:
      "LP yield optimization with auto-compounding, multi-pool management, and harvest scheduling.",
    category: "DeFi",
    difficulty: "Advanced",
    tags: ["LP", "Auto-compound", "Farm"],
    icon: <Sprout className="w-5 h-5" />,
  },
  {
    id: "cross-chain-bridge",
    title: "Cross-Chain Bridge",
    description:
      "Bridge assets between BSC, opBNB, Ethereum, and other EVM chains with lock-mint and burn-release flows.",
    category: "Web3",
    difficulty: "Advanced",
    tags: ["Bridge", "Cross-chain", "opBNB"],
    icon: <Cable className="w-5 h-5" />,
  },
  {
    id: "multi-sig-wallet",
    title: "Multi-Sig Wallet",
    description:
      "Multi-signature wallet with configurable threshold, transaction queue, and owner management.",
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
    id: "ai-chat-assistant",
    title: "AI Chat Assistant",
    description:
      "AI-powered dApp assistant that answers Web3 questions, explains transactions, and suggests contract patterns.",
    category: "AI",
    difficulty: "Intermediate",
    tags: ["LLM", "Chat", "dApp"],
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: "ai-contract-generator",
    title: "AI Contract Generator",
    description:
      "Generate production-ready Solidity contracts from natural language descriptions using AI agents.",
    category: "AI",
    difficulty: "Advanced",
    tags: ["Codegen", "Solidity", "AI Agent"],
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "ai-fullstack-builder",
    title: "AI Full-Stack Builder",
    description:
      "End-to-end AI-powered development — from smart contract generation to frontend scaffolding and deployment.",
    category: "Full-Stack",
    difficulty: "Advanced",
    tags: ["Full-Stack", "AI", "Deploy"],
    icon: <Code2 className="w-5 h-5" />,
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
      "Browse example projects built with BNB Chain AI Toolkit — tokens, NFTs, DeFi protocols, AI assistants, and more.",
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

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Examples
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Production-ready code samples for every use case — from simple token
            deploys to full-stack AI-powered dApps.
          </p>
        </div>
      </section>

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
              {categories.map((cat) => (
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
                </button>
              ))}
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
              {filtered.map((ex) => (
                <Link
                  key={ex.id}
                  to={`/example/${ex.id}`}
                  className={cn(
                    "group rounded-2xl border border-gray-200 dark:border-white/10 p-6",
                    "bg-white dark:bg-black",
                    "hover:border-[#F0B90B]/40 dark:hover:border-white/20",
                    "transition-all duration-200"
                  )}
                >
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
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
