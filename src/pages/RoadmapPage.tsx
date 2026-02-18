/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Building bridges to a better tomorrow 🌉
 */

import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { SparklesCore } from "@/components/ui/sparkles";
import { MovingBorder } from "@/components/ui/moving-border";
import {
  CheckCircle2,
  RefreshCw,
  Timer,
  Bot,
  BarChart3,
  Wrench,
  Shield,
  Server,
  Users,
  Cpu,
} from "lucide-react";

interface Phase {
  number: number;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
  icon: React.ReactNode;
  description: string;
  deliverables: { text: string; detail?: string }[];
}

const phases: Phase[] = [
  {
    number: 1,
    title: "Core Toolkit",
    status: "completed",
    icon: <Bot className="w-5 h-5" />,
    description:
      "The foundational layer — 78 AI agent definitions covering every major BNB Chain protocol, plus 6 specialized MCP servers providing 1,100+ composable tools for Claude, GPT, and other AI assistants.",
    deliverables: [
      { text: "36 BNB Chain agents", detail: "PancakeSwap, Venus, Lista DAO, Thena, Alpaca, opBNB, Greenfield" },
      { text: "42 DeFi agents", detail: "Airdrop Hunter, MEV Protection, IL Calculator, Yield Analyst, Risk Scoring" },
      { text: "bnbchain-mcp — 150+ tools", detail: "Balances, transfers, contract calls, GoPlus security, gas tracking" },
      { text: "binance-mcp — 478+ tools", detail: "Spot, Futures, Options, Algo (TWAP/VP), Copy Trading, NFTs, Binance Pay" },
      { text: "binance-us-mcp — 120+ tools", detail: "US-regulated spot, staking, OTC, custodial operations" },
      { text: "universal-crypto-mcp — 380+ tools", detail: "60+ chains, multi-aggregator DEX, Aave, Compound, Lido, LayerZero bridges" },
      { text: "agenti — 380+ tools", detail: "EVM + Solana, Flashbots MEV protection, Wormhole bridges, x402 payments" },
      { text: "ucai ABI-to-MCP generator", detail: "pip install abi-to-mcp — registered in Anthropic's MCP Registry" },
    ],
  },
  {
    number: 2,
    title: "Market Data & News",
    status: "completed",
    icon: <BarChart3 className="w-5 h-5" />,
    description:
      "Real-time market intelligence — Edge Runtime price feeds from CoinGecko and DeFiLlama, plus a 662K+ article news aggregator covering 200+ sources with AI-powered sentiment analysis in 42 languages.",
    deliverables: [
      { text: "crypto-market-data package", detail: "CoinGecko + DeFiLlama, OHLCV candles, Fear & Greed Index, Edge Runtime" },
      { text: "crypto-news aggregator", detail: "662,000+ articles from 200+ sources, AI sentiment in 42 languages" },
      { text: "Free public API", detail: "cryptocurrency.cv/api/news — no auth required, JSON responses" },
      { text: "Smart caching layer", detail: "25 req/min rate-limited with in-memory and Redis caching" },
      { text: "Lyra Market Data package", detail: "Unified SDK for market data across providers" },
    ],
  },
  {
    number: 3,
    title: "DeFi Tools & Wallets",
    status: "completed",
    icon: <Wrench className="w-5 h-5" />,
    description:
      "Practical DeFi utilities and a comprehensive offline wallet toolkit — gasless dust sweeping via ERC-4337, 57-tool wallet management with 348 tests, and self-contained offline HTML for air-gapped environments.",
    deliverables: [
      { text: "Dust Sweeper", detail: "Gasless ERC-4337, CoW Protocol MEV protection, routes into Aave/Yearn/Beefy" },
      { text: "8-chain support", detail: "BSC, Ethereum, Polygon, Arbitrum, Optimism, Avalanche, Base, opBNB" },
      { text: "57-tool wallet toolkit", detail: "HD generation, vanity addresses, EIP-191/712 signing, BIP-39/32 derivation" },
      { text: "348 tests, fully offline", detail: "Zero network dependencies, works in air-gapped environments" },
      { text: "offline1.html", detail: "Self-contained HTML with official ethereumjs libraries (~500KB)" },
      { text: "5 wallet MCP servers", detail: "Programmatic wallet operations with transaction building tools" },
    ],
  },
  {
    number: 4,
    title: "Open Standards",
    status: "in-progress",
    icon: <Shield className="w-5 h-5" />,
    description:
      "Open standards for AI agents and Web3 accessibility — ERC-8004 is deployed live on Ethereum mainnet for agent trust verification, and W3AG defines 50+ success criteria for accessible Web3 applications.",
    deliverables: [
      { text: "ERC-8004 — live on mainnet", detail: "Identity (0x8004...A169), Reputation (0x8004...B267), Validation (0x8004...C365)" },
      { text: "ERC-8004 reference implementation", detail: "Solidity contracts, verifier library, attestation framework" },
      { text: "W3AG v1.0 specification", detail: "50+ success criteria across 3 conformance levels (A, AA, AAA)" },
      { text: "W3AG React components", detail: "Pre-built accessible components for Web3 dApps" },
      { text: "Community review process", detail: "EIP review, feedback integration, broader ecosystem adoption" },
    ],
  },
  {
    number: 5,
    title: "Enhanced MCP & AI",
    status: "upcoming",
    icon: <Server className="w-5 h-5" />,
    description:
      "Deeper protocol integrations, real-time event streaming, and AI-native tool orchestration — pushing the MCP servers beyond 1,500 total tools with enhanced performance and observability.",
    deliverables: [
      { text: "ucai Pro templates", detail: "Flash Loan Executor, MEV Bundle Builder, Governance Proposal Analyzer" },
      { text: "Real-time event streaming", detail: "WebSocket subscriptions for on-chain events and price feeds" },
      { text: "Cross-chain bridge expansion", detail: "Wormhole, Stargate, LayerZero — 100+ chain pairs" },
      { text: "Advanced analytics tools", detail: "Portfolio tracking, P&L computation, tax reporting helpers" },
      { text: "Performance optimization", detail: "Connection pooling, batch RPC, request deduplication, caching" },
      { text: "Comprehensive test suites", detail: "Integration tests for all 6 servers with CI/CD pipelines" },
    ],
  },
  {
    number: 6,
    title: "Ecosystem & Community",
    status: "upcoming",
    icon: <Users className="w-5 h-5" />,
    description:
      "An open marketplace for community-built agents and tools. Plugin architecture for third-party extensions, community governance for agent curation, shared templates, and comprehensive developer education.",
    deliverables: [
      { text: "Agent marketplace", detail: "Discover, share, and compose community-built agents and tools" },
      { text: "Plugin system for MCP servers", detail: "Third-party protocol adapters and tool extensions" },
      { text: "Agent orchestration framework", detail: "Multi-agent workflows, tool chaining, and conditional execution" },
      { text: "Community governance", detail: "On-chain curation votes for featured agents and quality tiers" },
      { text: "Starter kits & templates", detail: "Next.js + MCP, Claude Desktop + agents, trading bot scaffolds" },
      { text: "Developer certification", detail: "Self-paced learning paths for BNB Chain AI agent development" },
    ],
  },
  {
    number: 7,
    title: "Autonomous Agents",
    status: "upcoming",
    icon: <Cpu className="w-5 h-5" />,
    description:
      "Long-running autonomous agents that can monitor positions, execute strategies, and adapt to market conditions — with ERC-8004 trust verification and human-in-the-loop safety guarantees.",
    deliverables: [
      { text: "Agent runtime environment", detail: "Persistent execution with state management and scheduling" },
      { text: "Strategy execution engine", detail: "DCA, rebalancing, yield harvesting, and custom strategy DSL" },
      { text: "ERC-8004 trust integration", detail: "On-chain agent reputation feeding into execution permissions" },
      { text: "Human-in-the-loop controls", detail: "Approval gates, spending limits, and emergency stop mechanisms" },
    ],
  },
];

const statusConfig = {
  completed: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    label: "Completed",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-200 dark:border-green-800/50",
    dot: "bg-green-500",
  },
  "in-progress": {
    icon: <RefreshCw className="w-5 h-5" />,
    label: "In Progress",
    color: "text-[#F0B90B]",
    bg: "bg-[#F0B90B]/10",
    border: "border-[#F0B90B]/30",
    dot: "bg-[#F0B90B]",
  },
  upcoming: {
    icon: <Timer className="w-5 h-5" />,
    label: "Upcoming",
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-white/5",
    border: "border-gray-200 dark:border-white/10",
    dot: "bg-gray-400 dark:bg-zinc-800",
  },
};

export default function RoadmapPage() {
  useSEO({
    title: "Projects & Roadmap",
    description:
      "See what has been built and what is coming next for BNB Chain AI Toolkit — 78 agents, 6 MCP servers, 1,100+ tools, and the road to autonomous agents.",
    path: "/projects",
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero with BackgroundBeams */}
      <section className="relative py-24 md:py-32 px-6">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <BackgroundBeams />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <TextGenerateEffect
            words="Projects & Roadmap"
            className="text-4xl md:text-5xl font-bold tracking-tight"
          />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A transparent look at where the toolkit has been and where it is
            headed. 7 phases — from core infrastructure to autonomous agents.
          </p>

          {/* Status legend */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div className={cn("w-2.5 h-2.5 rounded-full", config.dot)} />
                <span className={config.color}>{config.label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Overall Progress</span>
              <span>4 / 7 phases</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10">
              <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-[#F0B90B] to-[#F0B90B]/50" style={{ width: "52%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <TracingBeam className="px-4">
            <div className="space-y-12">
              {phases.map((phase) => {
                const config = statusConfig[phase.status];
                return (
                  <div key={phase.number} className="relative">
                    {/* Status badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                          config.bg,
                          config.color
                        )}
                      >
                        {config.icon}
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        Phase {phase.number}
                      </span>
                    </div>

                    {/* Card — BackgroundGradient for in-progress */}
                    {phase.status === "in-progress" ? (
                      <BackgroundGradient
                        className="rounded-2xl p-6 bg-white dark:bg-black"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn("p-2 rounded-lg", config.bg, config.color)}>
                            {phase.icon}
                          </div>
                          <h3 className="text-xl font-bold">{phase.title}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                          {phase.description}
                        </p>
                        <ul className="space-y-3">
                          {phase.deliverables.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                  config.dot
                                )}
                              />
                              <div>
                                <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                                {item.detail && (
                                  <span className="ml-1.5 text-xs text-gray-400">
                                    — {item.detail}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </BackgroundGradient>
                    ) : (
                    <div
                      className={cn(
                        "rounded-2xl border p-6",
                        "bg-white dark:bg-black",
                        config.border
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("p-2 rounded-lg", config.bg, config.color)}>
                          {phase.icon}
                        </div>
                        <h3 className="text-xl font-bold">{phase.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                        {phase.description}
                      </p>
                      <ul className="space-y-3">
                        {phase.deliverables.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                config.dot
                              )}
                            />
                            <div>
                              <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                              {item.detail && (
                                <span className="ml-1.5 text-xs text-gray-400">
                                  — {item.detail}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CTA — SparklesCore + MovingBorder */}
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
          <h2 className="text-3xl font-bold mb-4">Help Shape the Roadmap</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Have ideas for what should come next? Open a discussion or contribute
            directly to any phase.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MovingBorder
              as="a"
              duration={3}
              containerClassName="h-12"
              className="bg-[#F0B90B] text-black font-semibold"
              {...{ href: "https://github.com/nirholas/bnb-chain-toolkit/discussions", target: "_blank", rel: "noopener noreferrer" } as any}
            >
              Start a Discussion
            </MovingBorder>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 font-semibold hover:border-[#F0B90B]/50 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
