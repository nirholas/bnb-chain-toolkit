/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every bug fixed is a lesson learned 🎓
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BentoGrid } from "@/components/ui/bento-grid";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { SparklesCore } from "@/components/ui/sparkles";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { LampContainer } from "@/components/ui/lamp";
import {
  Search,
  Server,
  ExternalLink,
  Wrench,
} from "lucide-react";

import {
  allAgents,
  getFilteredAgents,
  getCategoriesForGroup,
  type AgentGroup,
  type AgentCategory,
  type AgentEntry,
} from "@/data/agents";

// ---------------------------------------------------------------------------
// Static Data — Servers & Tools (kept from original)
// ---------------------------------------------------------------------------

interface ServerItem {
  name: string;
  description: string;
  toolCount: string;
  language: string;
  highlights: string[];
}

interface ToolItem {
  name: string;
  description: string;
  category: string;
  detail: string;
}

const servers: ServerItem[] = [
  {
    name: "bnbchain-mcp",
    description: "The most comprehensive MCP server for BNB Chain and EVM blockchains",
    toolCount: "150+",
    language: "TypeScript",
    highlights: ["Balances & transfers", "Contract calls", "Token analytics", "GoPlus security", "Gas tracking"],
  },
  {
    name: "binance-mcp",
    description: "478+ tools for Binance.com — the most comprehensive exchange MCP ever built",
    toolCount: "478+",
    language: "TypeScript",
    highlights: ["Spot & Futures trading", "Options & Algo (TWAP, VP)", "Copy Trading", "Simple Earn & Staking", "NFT & Binance Pay"],
  },
  {
    name: "binance-us-mcp",
    description: "Regulated US exchange operations — spot, staking, OTC, and custody",
    toolCount: "120+",
    language: "TypeScript",
    highlights: ["US regulatory compliance", "Spot trading", "Staking & OTC", "Custodial solution"],
  },
  {
    name: "universal-crypto-mcp",
    description: "Universal MCP for 60+ blockchain networks with advanced capabilities",
    toolCount: "380+",
    language: "TypeScript",
    highlights: ["Multi-aggregator DEX", "Aave, Compound, Lido", "LayerZero & Stargate bridges", "x402 Payment Protocol", "AI Service Marketplace"],
  },
  {
    name: "agenti",
    description: "Advanced agent operations for EVM + Solana with cutting-edge integrations",
    toolCount: "380+",
    language: "TypeScript",
    highlights: ["EVM + Solana support", "Flashbots MEV protection", "Wormhole bridges", "x402 payments"],
  },
  {
    name: "ucai",
    description: "Generate custom MCP tools from any smart contract ABI — registered in Anthropic MCP Registry",
    toolCount: "∞",
    language: "Python",
    highlights: ["ABI → MCP generation", "50+ security detections", "Contract Whisperer", "Pro templates (Flash Loans)", "pip install abi-to-mcp"],
  },
];

const toolItems: ToolItem[] = [
  { name: "Crypto Market Data", description: "Edge Runtime price feeds from CoinGecko and DeFiLlama with smart caching", category: "Market Data", detail: "Zero dependencies, 25 req/min" },
  { name: "Crypto News Aggregator", description: "662K+ articles from 200+ sources with AI sentiment analysis in 42 languages", category: "Market Data", detail: "Free API: cryptocurrency.cv/api/news" },
  { name: "Dust Sweeper", description: "Gasless multi-chain consolidation via ERC-4337 with CoW Protocol MEV protection", category: "DeFi Tools", detail: "8 chains, routes into Aave/Yearn/Beefy" },
  { name: "HD Wallet Generator", description: "BIP-39 mnemonics, BIP-32 derivation, vanity addresses — fully offline", category: "Wallets", detail: "Part of 57-tool wallet toolkit" },
  { name: "Transaction Signer", description: "EIP-191, EIP-712 typed data, legacy + EIP-1559 — sign without network access", category: "Wallets", detail: "V3 keystore encrypt/decrypt" },
  { name: "Offline Wallet HTML", description: "Self-contained offline1.html using official ethereumjs libraries (~500KB)", category: "Wallets", detail: "Zero network dependencies" },
  { name: "ERC-8004 Verifier", description: "Verify agent trust on Ethereum mainnet — Identity, Reputation, and Validation registries", category: "Standards", detail: "Deployed: 0x8004A169..." },
  { name: "W3AG Checker", description: "Web3 accessibility compliance against 50+ success criteria across 3 levels", category: "Standards", detail: "React components included" },
  { name: "Fear & Greed Index", description: "Alternative.me sentiment index integrated into the market data package", category: "Market Data", detail: "Historical + current" },
  { name: "OHLCV Candlestick Data", description: "Historical price data with configurable intervals from CoinGecko", category: "Market Data", detail: "Edge Runtime compatible" },
];

// Group tools by category for HoverEffect
const toolHoverItems = toolItems.map((t) => ({
  title: t.name,
  description: `${t.description} — ${t.detail}`,
  link: "#",
}));

const toolCategories = [...new Set(toolItems.map((t) => t.category))];

// DeFi marquee items (two rows)
const marqueeRow1 = allAgents
  .filter((a) => a.group === "defi")
  .slice(0, 14)
  .map((a) => ({
    quote: a.description,
    name: a.title,
    title: a.category,
  }));

const marqueeRow2 = allAgents
  .filter((a) => a.group === "defi")
  .slice(14, 28)
  .map((a) => ({
    quote: a.description,
    name: a.title,
    title: a.category,
  }));

// ---------------------------------------------------------------------------
// Animated Counter
// ---------------------------------------------------------------------------

function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-[#F0B90B]">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Agent Card (3D)
// ---------------------------------------------------------------------------

function AgentCard({ agent, featured }: { agent: AgentEntry; featured?: boolean }) {
  return (
    <Link to={`/explore/agent/${agent.id}`} className="block h-full">
      <CardContainer containerClassName="w-full h-full">
        <CardBody
          className={cn(
            "relative w-full h-full rounded-xl p-6 border",
            "border-gray-200 dark:border-white/[0.08]",
            "bg-white dark:bg-black",
            "hover:shadow-[0_0_30px_rgba(240,185,11,0.12)] dark:hover:shadow-[0_0_30px_rgba(240,185,11,0.08)]",
            "transition-shadow duration-300",
            featured ? "min-h-[16rem]" : "min-h-[14rem]"
          )}
        >
          <CardItem translateZ="50" className="w-full">
            <span className={cn("block", featured ? "text-5xl" : "text-4xl")}>
              {agent.emoji}
            </span>
          </CardItem>

          <CardItem translateZ="60" className="w-full mt-3">
            <h3
              className={cn(
                "font-bold text-gray-900 dark:text-white",
                featured ? "text-lg" : "text-base"
              )}
            >
              {agent.title}
            </h3>
          </CardItem>

          <CardItem translateZ="40" className="w-full mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {agent.description}
            </p>
          </CardItem>

          <CardItem translateZ="30" className="w-full mt-3">
            <div className="flex flex-wrap gap-1.5">
              {agent.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
              {agent.mcpCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#F0B90B]/10 text-[#F0B90B] font-medium">
                  {agent.mcpCount} MCP
                </span>
              )}
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper with scroll-reveal
// ---------------------------------------------------------------------------

function RevealSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

type GroupFilter = AgentGroup | "all";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<AgentCategory | "all">("all");

  useSEO({
    title: "Explore",
    description:
      "Discover 78 AI agents, 6 MCP servers, and 1,100+ tools in the BNB Chain AI Toolkit.",
    path: "/explore",
  });

  // Visible categories based on group filter
  const visibleCategories = useMemo(
    () => getCategoriesForGroup(groupFilter),
    [groupFilter]
  );

  // Reset category when group changes and current category is no longer valid
  const handleGroupChange = useCallback(
    (g: GroupFilter) => {
      setGroupFilter(g);
      if (g !== "all") {
        const cats = getCategoriesForGroup(g);
        if (categoryFilter !== "all" && !cats.includes(categoryFilter)) {
          setCategoryFilter("all");
        }
      }
    },
    [categoryFilter]
  );

  // Filtered agents
  const filteredAgents = useMemo(
    () => getFilteredAgents(groupFilter, categoryFilter, search),
    [groupFilter, categoryFilter, search]
  );

  // Filtered servers
  const filteredServers = useMemo(() => {
    if (!search.trim()) return servers;
    const q = search.toLowerCase();
    return servers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }, [search]);

  // Filtered tools
  const filteredToolHoverItems = useMemo(() => {
    if (!search.trim()) return toolHoverItems;
    const q = search.toLowerCase();
    return toolHoverItems.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [search]);

  // Identify "featured" agents (first of each visible category)
  const featuredIds = useMemo(() => {
    const set = new Set<string>();
    const catsSeen = new Set<string>();
    for (const agent of filteredAgents) {
      if (!catsSeen.has(agent.category)) {
        catsSeen.add(agent.category);
        set.add(agent.id);
      }
    }
    return set;
  }, [filteredAgents]);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* ── Hero Section ── */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Explore the Toolkit
          </h1>
          <div className="mt-4 max-w-2xl mx-auto">
            <TextGenerateEffect
              words="78 agents, 6 MCP servers, 1,100+ tools — browse everything in the ecosystem and find exactly what you need."
              className="text-lg !font-normal text-gray-600 dark:text-gray-400"
              filter={false}
              duration={0.4}
            />
          </div>

          {/* Stat Counters */}
          <div className="flex items-center justify-center gap-10 md:gap-16 mt-10">
            <AnimatedStat value="78" label="AI Agents" />
            <AnimatedStat value="6" label="MCP Servers" />
            <AnimatedStat value="1,100+" label="Tools" />
          </div>

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

      {/* ── Category Filter Bar ── */}
      <RevealSection className="px-6 pb-4">
        <div className="max-w-7xl mx-auto">
          {/* Group Toggles */}
          <div className="flex items-center gap-2 mb-4">
            {(["all", "bnb", "defi"] as const).map((g) => (
              <button
                key={g}
                onClick={() => handleGroupChange(g)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200",
                  groupFilter === g
                    ? "bg-[#F0B90B] text-black border-[#F0B90B]"
                    : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#F0B90B]/50 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {g === "all" ? "All" : g === "bnb" ? "BNB Chain" : "DeFi"}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setCategoryFilter("all")}
              className={cn(
                "shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200",
                categoryFilter === "all"
                  ? "bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/30"
                  : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#F0B90B]/30"
              )}
            >
              All ({allAgents.filter((a) => groupFilter === "all" || a.group === groupFilter).length})
            </button>
            {visibleCategories.map((cat) => {
              const count = allAgents.filter(
                (a) =>
                  a.category === cat &&
                  (groupFilter === "all" || a.group === groupFilter)
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200",
                    categoryFilter === cat
                      ? "bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/30"
                      : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#F0B90B]/30"
                  )}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </RevealSection>

      {/* ── Agent Grid — BentoGrid + 3D Cards ── */}
      <RevealSection className="py-8 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Agents
              <span className="ml-2 text-sm font-normal text-gray-500">
                {filteredAgents.length} agents
              </span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${groupFilter}-${categoryFilter}-${search}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <BentoGrid className="md:auto-rows-auto gap-4">
                {filteredAgents.map((agent) => {
                  const isFeatured = featuredIds.has(agent.id);
                  return (
                    <div
                      key={agent.id}
                      className={cn(
                        isFeatured && "md:col-span-2"
                      )}
                    >
                      <AgentCard agent={agent} featured={isFeatured} />
                    </div>
                  );
                })}
              </BentoGrid>

              {filteredAgents.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  No agents match your search. Try a different query.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </RevealSection>

      {/* ── DeFi Agents Marquee ── */}
      <RevealSection className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            DeFi Agents Showcase
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            42 cross-protocol agents for analysis, optimization, and protection
          </p>

          <div className="space-y-4">
            <InfiniteMovingCards
              items={marqueeRow1}
              direction="right"
              speed="slow"
              pauseOnHover
            />
            <InfiniteMovingCards
              items={marqueeRow2}
              direction="left"
              speed="slow"
              pauseOnHover
            />
          </div>
        </div>
      </RevealSection>

      {/* ── MCP Servers Section ── */}
      <RevealSection className="py-16 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            MCP Servers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            6 production-grade Model Context Protocol servers powering 1,100+ tools
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredServers.map((server) => (
              <BackgroundGradient
                key={server.name}
                className="rounded-2xl p-6 bg-white dark:bg-black"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Server className="w-5 h-5 text-[#F0B90B] shrink-0" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{server.name}</h3>
                  <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-500">
                    {server.language}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {server.description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {server.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3">
                  <div className="relative">
                    <span className="relative z-10 text-sm font-bold text-[#F0B90B]">
                      {server.toolCount} tools
                    </span>
                    <div className="absolute -inset-2 -z-0 opacity-60">
                      <SparklesCore
                        particleDensity={40}
                        particleColor="#F0B90B"
                        minSize={0.3}
                        maxSize={0.8}
                        speed={0.5}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
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
              </BackgroundGradient>
            ))}
            {filteredServers.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No servers match your search.
              </div>
            )}
          </div>
        </div>
      </RevealSection>

      {/* ── Tools Section — HoverEffect ── */}
      <RevealSection className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Tools & Utilities
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Market data, DeFi tools, wallets, and standards
          </p>

          {/* Category headers */}
          <div className="flex flex-wrap gap-2 mb-4">
            {toolCategories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
              >
                {cat}
              </span>
            ))}
          </div>

          <HoverEffect items={filteredToolHoverItems} />

          {filteredToolHoverItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No tools match your search.
            </div>
          )}
        </div>
      </RevealSection>

      {/* ── CTA — Lamp Effect ── */}
      <LampContainer className="min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore the full ecosystem
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            78 AI agents, 6 MCP servers, and 1,100+ tools — all open source and ready to use.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/nirholas/bnb-chain-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-200",
                "bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90",
                "shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:shadow-[0_0_30px_rgba(240,185,11,0.5)]"
              )}
            >
              <Wrench className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </LampContainer>
    </main>
  );
}
