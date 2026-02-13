/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Your dedication inspires others 🌠
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import {
  BookOpen,
  Search,
  Code2,
  Shield,
  Zap,
  Wallet,
  Terminal,
  ChevronRight,
  Rocket,
  HelpCircle,
  ArrowRight,
  Layers,
  BarChart3,
} from "lucide-react";

interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articleCount: number;
}

const docCategories: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Setup your environment, install dependencies, and build your first AI-powered Web3 project in minutes.",
    icon: <Rocket className="w-6 h-6" />,
    articleCount: 5,
  },
  {
    id: "agents",
    title: "AI Agents",
    description:
      "Explore 72+ pre-built agent definitions for PancakeSwap, Venus Protocol, BNB Staking, and more.",
    icon: <Code2 className="w-6 h-6" />,
    articleCount: 12,
  },
  {
    id: "mcp-servers",
    title: "MCP Servers",
    description:
      "Configure and deploy 6 Model Context Protocol servers for BNB Chain, Binance, and universal crypto operations.",
    icon: <Terminal className="w-6 h-6" />,
    articleCount: 8,
  },
  {
    id: "market-data",
    title: "Market Data",
    description:
      "Integrate real-time price feeds from CoinGecko, DeFiLlama, and 200+ news sources for market intelligence.",
    icon: <BarChart3 className="w-6 h-6" />,
    articleCount: 6,
  },
  {
    id: "defi-tools",
    title: "DeFi Tools",
    description:
      "Dust sweeper, token utilities, and composable DeFi building blocks for BNB Chain applications.",
    icon: <Zap className="w-6 h-6" />,
    articleCount: 4,
  },
  {
    id: "wallets",
    title: "Wallets",
    description:
      "Offline wallet generation, HD wallets, vanity addresses, and secure transaction signing utilities.",
    icon: <Wallet className="w-6 h-6" />,
    articleCount: 5,
  },
  {
    id: "standards",
    title: "Standards",
    description:
      "ERC-8004 for agent trust verification and W3AG for Web3 accessibility — two open standards for the ecosystem.",
    icon: <Shield className="w-6 h-6" />,
    articleCount: 3,
  },
  {
    id: "architecture",
    title: "Architecture",
    description:
      "Repository structure, design decisions, monorepo layout, and how all the pieces fit together.",
    icon: <Layers className="w-6 h-6" />,
    articleCount: 4,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description:
      "Common issues, error solutions, FAQ, and debugging tips for every part of the toolkit.",
    icon: <HelpCircle className="w-6 h-6" />,
    articleCount: 7,
  },
];

export default function DocsPage() {
  const [search, setSearch] = useState("");

  useSEO({
    title: "Documentation",
    description:
      "Comprehensive documentation for BNB Chain AI Toolkit — guides for AI agents, MCP servers, market data, DeFi tools, and more.",
    path: "/docs",
  });

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return docCategories;
    const q = search.toLowerCase();
    return docCategories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Documentation
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to integrate AI agents, MCP servers, and Web3
            tools into your BNB Chain projects.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
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

      {/* Quick Start */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/docs/getting-started"
            className={cn(
              "group block rounded-2xl p-8",
              "bg-gradient-to-r from-[#F0B90B]/10 to-[#F0B90B]/5",
              "border border-[#F0B90B]/20 hover:border-[#F0B90B]/40",
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0B90B]/20 text-[#F0B90B] text-sm font-medium mb-4">
                  <Rocket className="w-4 h-4" />
                  Recommended
                </div>
                <h2 className="text-2xl font-bold mb-2">Quick Start Guide</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                  Get up and running in under 5 minutes. Install the toolkit,
                  configure your first MCP server, and deploy an AI agent on BNB
                  Chain.
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-[#F0B90B] group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Browse by Category</h2>

          {search.trim() && filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                No results for &ldquo;{search}&rdquo;
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-[#F0B90B] hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/docs/${cat.id}`}
                  className={cn(
                    "group rounded-2xl border border-gray-200 dark:border-white/10 p-6",
                    "hover:border-[#F0B90B]/40 dark:hover:border-white/20",
                    "bg-white dark:bg-black transition-all duration-200"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-[#F0B90B] shrink-0">
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold group-hover:text-[#F0B90B] transition-colors">
                          {cat.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#F0B90B] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {cat.description}
                      </p>
                      <span className="inline-block mt-3 text-xs text-gray-400">
                        {cat.articleCount} articles
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-6 text-[#F0B90B]" />
          <h2 className="text-3xl font-bold mb-4">Can&apos;t find what you need?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Check the FAQ, open a GitHub issue, or reach out on Twitter. We
            respond to every question.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F0B90B] text-black font-semibold hover:bg-[#F0B90B]/90 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              View FAQ
            </Link>
            <a
              href="https://github.com/nirholas/bnb-chain-toolkit/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 font-semibold hover:border-[#F0B90B]/50 transition-colors"
            >
              Open an Issue
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
