/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Building bridges to a better tomorrow 🌉
 */

import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { TracingBeam } from "@/components/ui/tracing-beam";
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
} from "lucide-react";

interface Phase {
  number: number;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
  icon: React.ReactNode;
  description: string;
  deliverables: string[];
}

const phases: Phase[] = [
  {
    number: 1,
    title: "Core Toolkit",
    status: "completed",
    icon: <Bot className="w-5 h-5" />,
    description:
      "The foundational layer — 72+ AI agent definitions covering every major BNB Chain protocol, plus 6 specialized MCP servers providing 900+ composable tools for Claude, GPT, and other AI assistants.",
    deliverables: [
      "30 BNB Chain-specific agents (PancakeSwap, Venus, Lista DAO, Thena, etc.)",
      "42 general DeFi agents for cross-protocol operations",
      "bnbchain-mcp server for BNB Chain + EVM operations",
      "binance-mcp, binance-us-mcp for exchange operations",
      "universal-crypto-mcp for 60+ blockchain networks",
      "agenti for EVM + Solana advanced operations",
      "ucai ABI-to-MCP generator for custom smart contracts",
    ],
  },
  {
    number: 2,
    title: "Market Data",
    status: "completed",
    icon: <BarChart3 className="w-5 h-5" />,
    description:
      "Real-time market intelligence — price feeds, OHLCV data, market cap rankings, and AI-powered news aggregation from 200+ sources with sentiment analysis and event classification.",
    deliverables: [
      "CoinGecko + DeFiLlama price feed integration",
      "Crypto news aggregator with 200+ sources",
      "AI-powered sentiment analysis",
      "Event classification and trend detection",
      "Lyra Market Data package for developers",
    ],
  },
  {
    number: 3,
    title: "DeFi Tools",
    status: "completed",
    icon: <Wrench className="w-5 h-5" />,
    description:
      "Practical DeFi utilities — a token dust sweeper that identifies and consolidates small balances, wallet management tools, and composable building blocks for DeFi application development.",
    deliverables: [
      "Dust sweeper for small token balance consolidation",
      "HD wallet generation with BIP-39 support",
      "Vanity address generator",
      "Offline transaction signing",
      "Multi-chain wallet toolkit",
    ],
  },
  {
    number: 4,
    title: "Standards",
    status: "in-progress",
    icon: <Shield className="w-5 h-5" />,
    description:
      "Open standards for the AI agent ecosystem — ERC-8004 defines trust verification for on-chain agents, while W3AG establishes accessibility guidelines for Web3 applications.",
    deliverables: [
      "ERC-8004 specification for agent trust verification",
      "W3AG Web3 accessibility compliance spec",
      "Reference implementations and verifiers",
      "Community review and feedback integration",
    ],
  },
  {
    number: 5,
    title: "Enhanced MCP",
    status: "upcoming",
    icon: <Server className="w-5 h-5" />,
    description:
      "Deeper protocol integrations, more granular tool coverage, and performance improvements across all 6 MCP servers — bringing the total tool count well beyond 1,000.",
    deliverables: [
      "Advanced DeFi protocol integrations (lending, derivatives)",
      "Cross-chain bridge tool expansion",
      "Real-time event streaming and webhooks",
      "Performance optimization and caching layer",
      "Comprehensive test suites for all servers",
    ],
  },
  {
    number: 6,
    title: "Community",
    status: "upcoming",
    icon: <Users className="w-5 h-5" />,
    description:
      "An open marketplace for community-built agents and tools. Plugin architecture for third-party extensions, community governance for agent curation, and shared templates for rapid development.",
    deliverables: [
      "Agent marketplace for community contributions",
      "Plugin system for extending MCP servers",
      "Community governance and curation",
      "Shared templates and starter kits",
      "Developer documentation and tutorials",
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
    dot: "bg-gray-400 dark:bg-gray-600",
  },
};

export default function RoadmapPage() {
  useSEO({
    title: "Projects & Roadmap",
    description:
      "See what has been built and what is coming next for BNB Chain AI Toolkit — from core agents and MCP servers to community marketplace and standards.",
    path: "/projects",
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Projects &amp; Roadmap
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A transparent look at where the toolkit has been and where it is
            headed. Each phase builds on the last.
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

                    {/* Card */}
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
                      <ul className="space-y-2">
                        {phase.deliverables.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-500"
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                config.dot
                              )}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Help Shape the Roadmap</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Have ideas for what should come next? Open a discussion or contribute
            directly to any phase.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/nirholas/bnb-chain-toolkit/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F0B90B] text-black font-semibold hover:bg-[#F0B90B]/90 transition-colors"
            >
              Start a Discussion
            </a>
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
