/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Agent Detail Page
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit | 🌐 https://bnbchaintoolkit.com
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  Plug,
  Search,
  Server,
  Shield,
  Sparkles,
  Star,
  Zap,
  Code2,
  Layers,
  Target,
  TrendingUp,
  Lock,
  Eye,
  Cpu,
  Globe,
  Lightbulb,
  BookOpen,
  Wallet,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LampContainer } from "@/components/ui/lamp";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { SparklesCore } from "@/components/ui/sparkles";
import { MovingBorder } from "@/components/ui/moving-border";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import {
  getAgent,
  getRelatedAgents,
  getAgentGitHubUrl,
  type AgentData,
} from "@/data/agentLoader";

// ── Icon Picker ────────────────────────────────────────────────────────────

const CAPABILITY_ICONS = [
  Zap,
  Shield,
  Target,
  TrendingUp,
  Code2,
  Layers,
  Lock,
  Eye,
  Cpu,
  Globe,
  Lightbulb,
  BookOpen,
  Wallet,
  BarChart3,
  Star,
  Sparkles,
];

function getCapabilityIcon(index: number) {
  const Icon = CAPABILITY_ICONS[index % CAPABILITY_ICONS.length];
  return <Icon className="w-4 h-4 text-[#F0B90B]" />;
}

// ── MCP Server Metadata ────────────────────────────────────────────────────

const MCP_SERVER_INFO: Record<
  string,
  { name: string; tools: string; description: string }
> = {
  "bnbchain-mcp": {
    name: "BNB Chain MCP",
    tools: "175+",
    description:
      "BSC DeFi data, token analysis, contract reads, gas tracking, GoPlus security",
  },
  "binance-mcp": {
    name: "Binance MCP",
    tools: "478+",
    description:
      "Binance exchange data — spot, futures, earn products, klines, order book",
  },
  "binance-us-mcp": {
    name: "Binance.US MCP",
    tools: "100+",
    description: "US-compliant Binance data — spot trading, market data",
  },
  "universal-crypto-mcp": {
    name: "Universal Crypto MCP",
    tools: "60+",
    description: "Cross-chain data for 60+ networks — prices, TVL, protocols",
  },
  "free-crypto-news": {
    name: "Crypto News MCP",
    tools: "10+",
    description: "Real-time crypto news aggregation and search",
  },
  "sperax-crypto-mcp": {
    name: "Sperax Crypto MCP",
    tools: "50+",
    description: "Protocol analytics, yield data, DeFi metrics",
  },
};

// ── Category Styling ───────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  defi: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  security: "bg-red-500/10 text-red-400 border-red-500/20",
  trading: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  general: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  gaming: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  crypto: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  infrastructure: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

function getCategoryStyle(category: string): string {
  return (
    CATEGORY_COLORS[category] ||
    "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
  );
}

// ── Not Found Component ────────────────────────────────────────────────────

function AgentNotFound({ agentId }: { agentId: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
          Agent Not Found
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-2">
          No agent with ID{" "}
          <code className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.06] text-sm font-mono">
            {agentId}
          </code>{" "}
          was found.
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          Check the spelling or browse all available agents below.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F0B90B] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(240,185,11,0.3)] transition-all"
          >
            <Search className="w-4 h-4" />
            Browse All Agents
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 dark:border-white/[0.12] text-neutral-700 dark:text-neutral-300 rounded-xl hover:border-[#F0B90B]/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const agent = agentId ? getAgent(agentId) : undefined;

  useSEO({
    title: agent ? `${agent.title} — AI Agent` : "Agent Not Found",
    description: agent?.description,
    path: `/explore/agent/${agentId || ""}`,
  });

  // Scroll to top when navigating between agent pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [agentId]);

  if (!agent || !agentId) {
    return <AgentNotFound agentId={agentId || "unknown"} />;
  }

  const relatedAgents = getRelatedAgents(agentId);
  const githubUrl = getAgentGitHubUrl(agent);

  // key={agentId} forces full re-mount so all animations re-trigger on navigation
  return (
    <div key={agentId} className="bg-white dark:bg-black min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO (Spotlight)
      ══════════════════════════════════════════════════════════════════ */}
      <HeroSection agent={agent} />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — OPENING MESSAGE (TypewriterEffect)
      ══════════════════════════════════════════════════════════════════ */}
      <OpeningMessageSection agent={agent} />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3 — CAPABILITIES (LampContainer + BentoGrid)
      ══════════════════════════════════════════════════════════════════ */}
      <CapabilitiesSection agent={agent} />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4 — MCP TOOLS CONNECTED (BackgroundGradient cards)
      ══════════════════════════════════════════════════════════════════ */}
      <MCPToolsSection agent={agent} />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 5 — SYSTEM ROLE DEEP DIVE (TracingBeam)
      ══════════════════════════════════════════════════════════════════ */}
      {agent.systemRoleSections.length > 0 && (
        <SystemRoleSection agent={agent} />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 6 — RELATED AGENTS (InfiniteMovingCards)
      ══════════════════════════════════════════════════════════════════ */}
      {relatedAgents.length > 0 && (
        <RelatedAgentsSection relatedAgents={relatedAgents} />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 7 — CTA (SparklesCore + MovingBorder)
      ══════════════════════════════════════════════════════════════════ */}
      <CTASection agent={agent} githubUrl={githubUrl} />
    </div>
  );
}

// ── Section 1: Hero ────────────────────────────────────────────────────────

function HeroSection({ agent }: { agent: AgentData }) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <Spotlight
        className="absolute -top-40 left-0 md:left-60 md:-top-20"
        fill="#F0B90B"
      />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#F0B90B]/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-28 pb-16 text-center">
        {/* Back link */}
        <Link
          to="/agents"
          aria-label="Browse all agents"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#F0B90B] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          ← Browse Agents
        </Link>

        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="text-7xl md:text-8xl mb-6"
          role="img"
          aria-label={`${agent.title} avatar`}
        >
          {agent.avatar}
        </motion.div>

        {/* Title */}
        <TextGenerateEffect
          words={agent.title}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-6"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          {agent.description}
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {/* Category badge */}
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border",
              getCategoryStyle(agent.category)
            )}
          >
            {agent.category.toUpperCase()}
          </span>

          {/* Group badge */}
          <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[#F0B90B]/30 bg-[#F0B90B]/[0.08] text-[#F0B90B]">
            {agent.group === "bnb-chain" ? "BNB Chain" : "DeFi"}
          </span>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {agent.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg text-xs border border-neutral-200 dark:border-white/[0.08] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.02]"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400"
        >
          {agent.plugins.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Plug className="w-4 h-4 text-[#F0B90B]" />
              <span>
                {agent.plugins.length} MCP Server
                {agent.plugins.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {agent.capabilities.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F0B90B]" />
              <span>{agent.capabilities.length} Capabilities</span>
            </div>
          )}
          {agent.createdAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F0B90B]" />
              <span>{agent.createdAt}</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 2: Opening Message ─────────────────────────────────────────────

function OpeningMessageSection({ agent }: { agent: AgentData }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyQuestion = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  }, []);

  if (!agent.openingMessage) return null;

  const words = agent.openingMessage.split(" ").map((word) => ({
    text: word,
  }));

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] p-8 md:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F0B90B]/10 border border-[#F0B90B]/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#F0B90B]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Opening Conversation
              </h3>
              <p className="text-xs text-neutral-400">
                What the agent says when you start a conversation
              </p>
            </div>
          </div>

          <div className="mb-8">
            <TypewriterEffect
              words={words}
              className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed"
            />
          </div>

          {/* Opening Questions — Interactive Cards */}
          {agent.openingQuestions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                Try asking
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agent.openingQuestions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="group relative p-4 rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] hover:border-[#F0B90B]/40 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-4 h-4 text-[#F0B90B] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed flex-1 pr-8">
                        {q}
                      </p>
                    </div>
                    <button
                      onClick={() => copyQuestion(q, i)}
                      aria-label={`Copy question: ${q}`}
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-neutral-400 hover:text-[#F0B90B] hover:bg-[#F0B90B]/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 3: Capabilities ────────────────────────────────────────────────

function CapabilitiesSection({ agent }: { agent: AgentData }) {
  if (agent.capabilities.length === 0 && agent.keyFacts.length === 0)
    return null;

  return (
    <section className="py-24 md:py-32 bg-neutral-50 dark:bg-transparent overflow-hidden">
      <LampContainer>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
              Capabilities
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg">
              What this agent can do for you
            </p>
            {agent.capabilities.length > 0 && (
              <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold border border-[#F0B90B]/30 bg-[#F0B90B]/[0.08] text-[#F0B90B]">
                <Zap className="w-3 h-3" />
                {agent.capabilities.length} capabilities
              </span>
            )}
          </div>

          {/* Capabilities BentoGrid */}
          {agent.capabilities.length > 0 && (
            <BentoGrid className="max-w-4xl mx-auto mb-12">
              {agent.capabilities.map((cap, i) => (
                <BentoGridItem
                  key={i}
                  title={cap}
                  icon={getCapabilityIcon(i)}
                  className={cn(
                    "border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]",
                    i === 0 || i === 3 ? "md:col-span-2" : ""
                  )}
                />
              ))}
            </BentoGrid>
          )}

          {/* Key Facts */}
          {agent.keyFacts.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
                Key Facts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {agent.keyFacts.map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
                  >
                    <div className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-[#F0B90B] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        {fact}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </LampContainer>
    </section>
  );
}

// ── Section 4: MCP Tools ───────────────────────────────────────────────────

function MCPToolsSection({ agent }: { agent: AgentData }) {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            MCP Servers Connected
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Live data sources powering this agent
          </p>
        </div>

        {agent.plugins.length > 0 ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {agent.plugins.map((pluginId, idx) => {
              const info = MCP_SERVER_INFO[pluginId];
              return (
                <motion.div
                  key={pluginId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.4 }}
                >
                  <Link
                    to={`/mcp/${pluginId}`}
                    aria-label={`View ${info?.name || pluginId} server details`}
                  >
                    <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-[#0a0a0a] hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#F0B90B]/10 border border-[#F0B90B]/20 flex items-center justify-center">
                          <Server className="w-5 h-5 text-[#F0B90B]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#F0B90B] transition-colors">
                            {info?.name || pluginId}
                          </h3>
                          {info && (
                            <div className="relative inline-flex items-center">
                              <span className="text-xs text-[#F0B90B] font-medium relative z-10">
                                {info.tools} tools
                              </span>
                              <div className="absolute -inset-x-2 -inset-y-1 w-20 h-6">
                                <SparklesCore
                                  id={`sparkles-mcp-${pluginId}`}
                                  background="transparent"
                                  minSize={0.2}
                                  maxSize={0.6}
                                  particleDensity={60}
                                  particleColor="#F0B90B"
                                  speed={0.3}
                                  className="w-full h-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                        {info?.description || `MCP server: ${pluginId}`}
                      </p>
                      <span className="text-xs text-[#F0B90B] font-medium inline-flex items-center gap-1">
                        View Server →
                      </span>
                    </BackgroundGradient>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* MCP Tools list */}
          {agent.mcpTools.length > 0 && (
            <div className="max-w-5xl mx-auto mt-8">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 text-center">
                Available Tools
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {agent.mcpTools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-md text-xs font-mono border border-neutral-200 dark:border-white/[0.06] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.02]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02]">
              <Bot className="w-5 h-5 text-neutral-400" />
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                No MCP connections — this agent works standalone
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Section 5: System Role Deep Dive ───────────────────────────────────────

function SystemRoleSection({ agent }: { agent: AgentData }) {
  const [copied, setCopied] = useState(false);

  const copySystemRole = useCallback(() => {
    const fullText = agent.systemRoleSections
      .map((s) => `## ${s.heading}\n\n${s.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [agent.systemRoleSections]);

  // Only show for agents with substantial system roles
  const totalLength = agent.systemRoleSections.reduce(
    (acc, s) => acc + s.content.length,
    0
  );
  if (totalLength < 200) return null;

  return (
    <section className="py-20 md:py-24 bg-neutral-50 dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            System Role
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            How this agent thinks and operates
          </p>
          <button
            onClick={copySystemRole}
            aria-label="Copy full system role text"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/[0.12] text-sm text-neutral-600 dark:text-neutral-300 hover:border-[#F0B90B]/50 hover:text-[#F0B90B] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy System Role
              </>
            )}
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <TracingBeam>
            <div className="space-y-10">
              {agent.systemRoleSections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F0B90B]" />
                    {section.heading}
                  </h3>
                  <div className="pl-4 border-l-2 border-neutral-200 dark:border-white/[0.08]">
                    {section.content.split("\n").map((line, j) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      const isBullet = /^[-•*✅❌]/.test(trimmed);
                      const isNumbered = /^\d+\./.test(trimmed);
                      return (
                        <p
                          key={j}
                          className={cn(
                            "text-sm leading-relaxed text-neutral-600 dark:text-neutral-400",
                            isBullet || isNumbered ? "pl-4 py-0.5" : "py-1",
                            isBullet &&
                              "before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#F0B90B]/60 before:mr-2 before:align-middle"
                          )}
                        >
                          {isBullet ? trimmed.replace(/^[-•*✅❌]\s*/, "") : trimmed}
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </TracingBeam>
        </div>
      </div>
    </section>
  );
}

// ── Section 6: Related Agents ──────────────────────────────────────────────

function RelatedAgentsSection({
  relatedAgents,
}: {
  relatedAgents: AgentData[];
}) {
  const marqueeItems = relatedAgents.map((a) => ({
    quote: a.description,
    name: `${a.avatar} ${a.title}`,
    title: a.category,
    icon: (
      <Link
        to={`/explore/agent/${a.identifier}`}
        className="text-xs text-[#F0B90B] hover:underline"
      >
        View →
      </Link>
    ),
  }));

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Related Agents
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Explore similar specialized agents
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <InfiniteMovingCards
            items={marqueeItems}
            direction="left"
            speed="slow"
          />
        </div>

        {/* Static grid fallback for clicking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mt-10">
          {relatedAgents.slice(0, 3).map((a) => (
            <Link
              key={a.identifier}
              to={`/explore/agent/${a.identifier}`}
              className="group p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">{a.avatar}</div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1 group-hover:text-[#F0B90B] transition-colors">
                {a.title}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                {a.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 7: CTA ─────────────────────────────────────────────────────────

function CTASection({
  agent,
  githubUrl,
}: {
  agent: AgentData;
  githubUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const copySystemPrompt = useCallback(() => {
    const fullText = agent.systemRoleSections
      .map((s) => `## ${s.heading}\n\n${s.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [agent.systemRoleSections]);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Sparkles background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id={`sparkles-${agent.identifier}`}
          background="transparent"
          minSize={0.3}
          maxSize={1}
          particleDensity={40}
          particleColor="#F0B90B"
          speed={0.5}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl mb-6">{agent.avatar}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Use {agent.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto mb-10">
            Clone the agent JSON, connect your MCP servers, and start
            interacting with this specialized AI agent.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Copy System Prompt */}
            <button
              onClick={copySystemPrompt}
              aria-label="Copy system prompt to clipboard"
            >
              <MovingBorder
                borderRadius="0.75rem"
                className="px-8 py-3.5 bg-[#F0B90B] text-black font-semibold text-sm inline-flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy System Prompt
                  </>
                )}
              </MovingBorder>
            </button>

            {/* View on GitHub */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${agent.title} on GitHub`}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-300 dark:border-white/[0.12] text-neutral-700 dark:text-neutral-300 rounded-xl hover:border-[#F0B90B]/50 hover:text-[#F0B90B] transition-all font-semibold text-sm hover:scale-[1.02]"
            >
              <GitBranch className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            {/* Browse All Agents */}
            <Link
              to="/agents"
              aria-label="Browse all agents"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-300 dark:border-white/[0.12] text-neutral-700 dark:text-neutral-300 rounded-xl hover:border-[#F0B90B]/50 hover:text-[#F0B90B] transition-all font-semibold text-sm hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4" />
              Browse All Agents
            </Link>

            {/* Browse MCP Servers */}
            <Link
              to="/mcp"
              aria-label="Browse MCP servers"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-300 dark:border-white/[0.12] text-neutral-700 dark:text-neutral-300 rounded-xl hover:border-[#F0B90B]/50 hover:text-[#F0B90B] transition-all font-semibold text-sm hover:scale-[1.02]"
            >
              <Plug className="w-4 h-4" />
              Browse MCP Servers
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
