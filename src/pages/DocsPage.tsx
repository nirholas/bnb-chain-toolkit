/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Your dedication inspires others 🌠
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import useI18n from '@/stores/i18nStore';
import { Spotlight } from "@/components/ui/spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundBeams } from "@/components/ui/background-beams";
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
  Bot,
  Server,
  Database,
  Wrench,
} from "lucide-react";

interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articleCount: number;
  highlight?: string;
}

const docCategories: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Install dependencies, configure your first MCP server, and deploy an AI agent on BNB Chain in under 5 minutes.",
    icon: <Rocket className="w-6 h-6" />,
    articleCount: 5,
    highlight: "bun install && bun run build",
  },
  {
    id: "agents",
    title: "AI Agents",
    description:
      "78 agent definitions — 36 for BNB Chain protocols (PancakeSwap, Venus, Lista DAO, Thena, Alpaca) + 42 general DeFi agents.",
    icon: <Bot className="w-6 h-6" />,
    articleCount: 12,
    highlight: "Portable JSON format",
  },
  {
    id: "mcp-servers",
    title: "MCP Servers",
    description:
      "6 production servers with 1,100+ tools. bnbchain-mcp (384), binance-mcp (478+), universal-crypto-mcp (100+), agenti, ucai, and more.",
    icon: <Server className="w-6 h-6" />,
    articleCount: 8,
    highlight: "STDIO + SSE transport",
  },
  {
    id: "market-data",
    title: "Market Data",
    description:
      "Edge Runtime price feeds from CoinGecko and DeFiLlama. Crypto news from 200+ sources with 662K+ articles. Zero dependencies.",
    icon: <BarChart3 className="w-6 h-6" />,
    articleCount: 6,
    highlight: "Free API, no auth required",
  },
  {
    id: "defi-tools",
    title: "DeFi Tools",
    description:
      "Gasless dust sweeper via ERC-4337 across 8 chains with MEV protection. Routes into Aave, Yearn, Beefy, Lido yields.",
    icon: <Zap className="w-6 h-6" />,
    articleCount: 4,
    highlight: "CoW Protocol MEV protection",
  },
  {
    id: "wallets",
    title: "Wallet Toolkit",
    description:
      "57 tools across 5 MCP servers — HD wallets, BIP-39, vanity addresses, EIP-191/712 signing, EIP-1559 transactions. Fully offline.",
    icon: <Wallet className="w-6 h-6" />,
    articleCount: 5,
    highlight: "348 tests, offline-capable",
  },
  {
    id: "standards",
    title: "Open Standards",
    description:
      "ERC-8004 for AI agent trust verification (deployed on Ethereum mainnet). W3AG for Web3 accessibility (50+ success criteria).",
    icon: <Shield className="w-6 h-6" />,
    articleCount: 3,
    highlight: "ERC-8004 live on mainnet",
  },
  {
    id: "architecture",
    title: "Architecture",
    description:
      "Monorepo structure, design decisions, component independence, and how all pieces compose together.",
    icon: <Layers className="w-6 h-6" />,
    articleCount: 4,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description:
      "Common issues, error solutions, debugging tips for MCP connections, agent loading, and chain interactions.",
    icon: <HelpCircle className="w-6 h-6" />,
    articleCount: 7,
  },
];

const quickLinks = [
  { title: "Connect MCP to Claude Desktop", description: "Add bnbchain-mcp to your Claude config in 2 minutes", link: "/docs/mcp-servers", icon: <Terminal className="w-5 h-5" /> },
  { title: "Browse All 78 Agents", description: "PancakeSwap, Venus, Whale Tracker, Security Auditor, and 74 more", link: "/docs/agents", icon: <Bot className="w-5 h-5" /> },
  { title: "Generate MCP from ABI", description: "Use ucai to create custom tools from any smart contract ABI", link: "/docs/mcp-servers", icon: <Code2 className="w-5 h-5" /> },
  { title: "ERC-8004 Standard", description: "On-chain identity, reputation, and validation registries for AI agents", link: "/docs/standards", icon: <Shield className="w-5 h-5" /> },
  { title: "Dust Sweeper Setup", description: "Consolidate small balances with gasless ERC-4337 transactions", link: "/docs/defi-tools", icon: <Wrench className="w-5 h-5" /> },
  { title: "Market Data API", description: "Free crypto news API — curl https://cryptocurrency.cv/api/news", link: "/docs/market-data", icon: <Database className="w-5 h-5" /> },
];

export default function DocsPage() {
  const { t } = useI18n();
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
          <TextGenerateEffect
            words={t('docs.title')}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('docs.hero_subtitle')}
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('docs.search_placeholder')}
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
          <BackgroundGradient className="rounded-2xl p-8 bg-white dark:bg-black">
            <Link to="/docs/getting-started" className="group block">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0B90B]/20 text-[#F0B90B] text-sm font-medium mb-4">
                    <Rocket className="w-4 h-4" />
                    {t('docs.start_here')}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t('docs.quick_start')}</h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                    {t('docs.quick_start_desc')}
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-[#F0B90B] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>
          </BackgroundGradient>
        </div>
      </section>

      {/* BentoGrid Categories */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">{t('docs.browse_category')}</h2>

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
            <BentoGrid className="md:auto-rows-[20rem]">
              {filteredCategories.map((cat, i) => (
                <Link key={cat.id} to={`/docs/${cat.id}`} className={i === 0 ? "md:col-span-2" : ""}>
                  <BentoGridItem
                    className="h-full cursor-pointer"
                    title={
                      <div className="flex items-center gap-2">
                        <span>{cat.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    description={
                      <div>
                        <p className="mb-3">{cat.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">
                            {cat.articleCount} articles
                          </span>
                          {cat.highlight && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[#F0B90B]/10 text-[#F0B90B] font-medium">
                              {cat.highlight}
                            </span>
                          )}
                        </div>
                      </div>
                    }
                    icon={
                      <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-[#F0B90B] w-fit">
                        {cat.icon}
                      </div>
                    }
                  />
                </Link>
              ))}
            </BentoGrid>
          )}
        </div>
      </section>

      {/* Quick Links — HoverEffect */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t('docs.popular_guides')}</h2>
          <p className="text-gray-500 mb-6">{t('docs.popular_guides_desc')}</p>
          <HoverEffect
            items={quickLinks.map((item) => ({
              title: item.title,
              description: item.description,
              link: item.link,
            }))}
          />
        </div>
      </section>

      {/* Server Quick Reference */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">{t('docs.mcp_reference')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left py-3 px-4 font-semibold">Server</th>
                  <th className="text-left py-3 px-4 font-semibold">Tools</th>
                  <th className="text-left py-3 px-4 font-semibold">Focus</th>
                  <th className="text-left py-3 px-4 font-semibold">Language</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "bnbchain-mcp", tools: "150+", focus: "BNB Chain + EVM — balances, transfers, security", lang: "TypeScript" },
                  { name: "binance-mcp", tools: "478+", focus: "Spot, Futures, Margin, Options, Earn, Copy Trading", lang: "TypeScript" },
                  { name: "binance-us-mcp", tools: "120+", focus: "US-regulated — spot, staking, OTC, custody", lang: "TypeScript" },
                  { name: "universal-crypto-mcp", tools: "380+", focus: "Multi-chain — DEX, DeFi, bridges, x402 payments", lang: "TypeScript" },
                  { name: "agenti", tools: "380+", focus: "EVM + Solana — Flashbots MEV, Wormhole, LayerZero", lang: "TypeScript" },
                  { name: "ucai", tools: "∞", focus: "Generate MCP tools from any smart contract ABI", lang: "Python" },
                ].map((s) => (
                  <tr key={s.name} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono text-[#F0B90B] text-xs">{s.name}</td>
                    <td className="py-3 px-4 font-bold">{s.tools}</td>
                    <td className="py-3 px-4 text-gray-500">{s.focus}</td>
                    <td className="py-3 px-4 text-gray-400">{s.lang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Help CTA — BackgroundBeams + MovingBorder */}
      <section className="relative py-20 px-6 overflow-hidden">
        <BackgroundBeams />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <BookOpen className="w-10 h-10 mx-auto mb-6 text-[#F0B90B]" />
          <h2 className="text-3xl font-bold mb-4">{t('docs.cant_find')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            {t('docs.cant_find_desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MovingBorder
              as="a"
              duration={3}
              containerClassName="h-12"
              className="bg-[#F0B90B] text-black font-semibold"
              {...{ href: "/faq" } as Record<string, string>}
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              View FAQ
            </MovingBorder>
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
