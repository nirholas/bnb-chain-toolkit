/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Homepage
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import PriceTicker from '@/components/PriceTicker';
import { TopProtocolsWidget, TopYieldsWidget, TopChainsWidget, DeFiSummaryBar } from '@/components/DeFiWidgets';
import {
    Shield, Globe, Bot, ChevronRight,
    Code, BookOpen, Terminal, Cpu, Users, Layers,
    Coins, GitBranch,
    ExternalLink, GraduationCap,
    BarChart3, Eye, Server, Wrench,
    Activity, Network, Blocks, Plug, FileCode, Sparkles, Copy, Check
} from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { SparklesCore } from '@/components/ui/sparkles';
import { LampContainer } from '@/components/ui/lamp';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

// ═══════════════════════════════════════════════════════════════
// BNB CHAIN TOOLKIT DATA
// ═══════════════════════════════════════════════════════════════

const mcpServers = [
    { name: 'BNB Chain MCP', tools: '100+', description: 'BSC, opBNB, Greenfield — swaps, transfers, contracts', icon: Blocks },
    { name: 'Binance MCP', tools: '478+', description: 'Spot, futures, margin trading on Binance.com', icon: BarChart3 },
    { name: 'Binance US MCP', tools: '—', description: 'US regulatory-compliant Binance access', icon: Shield },
    { name: 'Universal Crypto MCP', tools: '100+', description: '60+ networks, cross-chain DeFi', icon: Globe },
    { name: 'Agenti', tools: '50+', description: 'EVM + Solana, AI-to-AI payments (x402)', icon: Bot },
    { name: 'UCAI', tools: 'Dynamic', description: 'Turn any smart contract ABI into an MCP server', icon: Wrench },
];

const mcpHoverItems = mcpServers.map((s) => ({
    title: s.name,
    description: s.description,
    link: '#',
}));

const agentCategories = [
    { name: 'BNB Chain Agents', count: 30, description: 'PancakeSwap, Venus, BNB Staking, opBNB, Greenfield & more', icon: Blocks, color: 'text-yellow-500' },
    { name: 'Portfolio Management', count: 8, description: 'Tracking, rebalancing, tax optimization', icon: BarChart3, color: 'text-blue-500' },
    { name: 'Trading Automation', count: 7, description: 'Grid trading, DCA, arbitrage, signals', icon: Activity, color: 'text-green-500' },
    { name: 'Yield Optimization', count: 6, description: 'Auto-compounding, IL protection', icon: Coins, color: 'text-amber-500' },
    { name: 'Risk & Security', count: 5, description: 'Auditing, rug detection, exploit analysis', icon: Shield, color: 'text-red-500' },
    { name: 'Market Intelligence', count: 5, description: 'Sentiment analysis, whale tracking', icon: Eye, color: 'text-purple-500' },
    { name: 'DeFi Protocols', count: 6, description: 'Lending, DEX, derivatives integration', icon: Layers, color: 'text-teal-500' },
    { name: 'Infrastructure', count: 5, description: 'Bridge, gas, RPC, indexing tools', icon: Network, color: 'text-indigo-500' },
];

const supportedChains = [
    { name: 'BNB Smart Chain', type: 'L1', primary: true },
    { name: 'opBNB', type: 'L2', primary: true },
    { name: 'BNB Greenfield', type: 'Storage', primary: true },
    { name: 'Ethereum', type: 'L1', primary: false },
    { name: 'Polygon', type: 'L1/L2', primary: false },
    { name: 'Arbitrum', type: 'L2', primary: false },
    { name: 'Base', type: 'L2', primary: false },
    { name: 'Optimism', type: 'L2', primary: false },
    { name: 'Avalanche', type: 'L1', primary: false },
    { name: 'Solana', type: 'L1', primary: false },
];

const toolkitComponents = [
    { name: 'AI Agents', count: '72+', icon: Bot, description: 'Pre-built agent definitions for every major BNB Chain protocol' },
    { name: 'MCP Servers', count: '6', icon: Server, description: 'Model Context Protocol servers for direct blockchain access' },
    { name: 'Tools', count: '900+', icon: Wrench, description: 'On-chain tools, exchange APIs, market data endpoints' },
    { name: 'Chains', count: '60+', icon: Network, description: 'Multi-chain support with unified interfaces' },
    { name: 'Languages', count: '30+', icon: Globe, description: 'Global accessibility with translations' },
    { name: 'Standards', count: '2', icon: FileCode, description: 'ERC-8004 agent trust + W3AG accessibility' },
];

const featuredAgents = [
    { name: 'PancakeSwap Expert', description: 'Swap, LP, farm — DeFi trading intelligence on BSC', category: 'BNB Chain', color: '#F0B90B' },
    { name: 'BSC Security Auditor', description: 'Smart contract vulnerability detection & analysis', category: 'Risk & Security', color: '#EF4444' },
    { name: 'Binance Futures Expert', description: 'Perpetual & delivery futures, cross-margin strategies', category: 'Trading', color: '#8B5CF6' },
];

const heroStats = [
    { label: 'Agents', value: '72+', Icon: Bot },
    { label: 'Tools', value: '900+', Icon: Wrench },
    { label: 'Chains', value: '60+', Icon: Network },
    { label: 'MCP Servers', value: '6', Icon: Server },
    { label: 'Languages', value: '30+', Icon: Globe },
];

const whyReasons = [
    { title: 'Comprehensive Coverage', description: 'No other project covers the entire BNB Chain AI stack in one repo', link: '#' },
    { title: 'Production-Ready MCP', description: '6 servers, 900+ tools, ready for Claude and other LLMs today', link: '#' },
    { title: 'Original Standards', description: 'ERC-8004 for agent trust and W3AG for Web3 accessibility', link: '#' },
    { title: 'Real DeFi Tooling', description: 'Dust sweeper, market data, wallet toolkit — not just demos', link: '#' },
    { title: '72+ Specialized Agents', description: 'Purpose-built for every major BNB Chain protocol', link: '#' },
    { title: '30+ Languages', description: 'Global accessibility with translations for worldwide reach', link: '#' },
];

const chainMarqueeItems = [
    ...supportedChains.map((c) => ({
        quote: c.type,
        name: c.name,
        title: c.primary ? 'Primary' : 'Supported',
    })),
    { quote: '', name: '+ 50 more', title: 'networks' },
];

const exploreItems = [
    { title: 'Documentation', desc: 'Comprehensive guides and API references', icon: BookOpen, href: '/docs', accent: '#3B82F6' },
    { title: 'Tutorials', desc: 'Step-by-step interactive learning paths', icon: GraduationCap, href: '/tutorials', accent: '#10B981' },
    { title: 'Playground', desc: 'Try BNB Chain smart contracts live', icon: Code, href: '/playground', accent: '#F59E0B' },
    { title: 'Sandbox', desc: 'AI-powered development environment', icon: Terminal, href: '/sandbox', accent: '#8B5CF6' },
    { title: 'IDE', desc: 'Solidity and Web3 development studio', icon: Cpu, href: '/ide', accent: '#A855F7' },
    { title: 'Full-Stack Demo', desc: 'Contract + frontend builder', icon: Layers, href: '/fullstack-demo', accent: '#22C55E' },
    { title: 'Innovation Lab', desc: 'AI tools & experimental features', icon: Sparkles, href: '/innovation', accent: '#EC4899' },
    { title: 'Community', desc: 'Connect with BNB Chain builders', icon: Users, href: '/community', accent: '#6366F1' },
];

// ═══════════════════════════════════════════════════════════════
// COPY BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
    const [hasCopied, setHasCopied] = useState(false);
    const copy = useCallback(() => {
        navigator.clipboard.writeText(text);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    }, [text]);
    return (
        <button
            onClick={copy}
            className={`inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5 ${className}`}
            aria-label="Copy to clipboard"
        >
            {hasCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {hasCopied ? 'Copied' : 'Copy'}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════
// TERMINAL CODE BLOCK
// ═══════════════════════════════════════════════════════════════

function TerminalBlock({ title, code, lang = 'shell' }: { title: string; code: string; lang?: string }) {
    return (
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50" role="region" aria-label={title}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">{title}</span>
                </div>
                <CopyButton text={code} />
            </div>
            <pre className={`p-5 text-sm overflow-x-auto leading-relaxed ${lang === 'json' ? 'text-neutral-300' : 'text-emerald-400'}`} tabIndex={0}>
                <code>{code}</code>
            </pre>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SECTION HEADING
// ═══════════════════════════════════════════════════════════════

function SectionHeading({ badge, badgeIcon: BadgeIcon, title, subtitle }: {
    badge?: string;
    badgeIcon?: React.ElementType;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="text-center mb-16">
            {badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border backdrop-blur-sm bg-neutral-100 text-neutral-600 border-neutral-200/60 dark:bg-white/[0.03] dark:text-neutral-400 dark:border-white/[0.06]">
                    {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-[#F0B90B]" />}
                    {badge}
                </div>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════════════════════

const quickStartCode = `# Clone the toolkit
git clone https://github.com/nirholas/bnb-chain-toolkit.git
cd bnb-chain-toolkit
bun install && bun run build
cd mcp-servers/bnbchain-mcp && bun start`;

const claudeConfigCode = `{
  "mcpServers": {
    "bnbchain": {
      "command": "npx",
      "args": ["-y", "@nirholas/bnbchain-mcp"],
      "env": {
        "BSC_RPC_URL": "https://bsc-dataseed.binance.org"
      }
    }
  }
}`;

export default function Homepage() {
    useSEO({
        title: 'BNB Chain AI Toolkit — 72+ Agents, 6 MCP Servers, 900+ Tools',
        description: 'The most comprehensive open-source AI toolkit for BNB Chain. 72+ specialized agents, 6 MCP servers, 900+ tools, 60+ chains.',
    });

    return (
        <div className="min-h-screen bg-white dark:bg-black">

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1 — HERO
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Spotlight effect */}
                <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="#F0B90B" />

                {/* Subtle radial glow — not a blob gradient */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F0B90B]/[0.03] blur-[120px]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 pt-24 pb-20 text-center">
                    {/* Hackathon badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-10 border backdrop-blur-sm bg-neutral-100 border-neutral-200/60 text-neutral-600 dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-[#F0B90B] animate-pulse" />
                        BNB Chain &quot;Good Vibes Only&quot; Hackathon — Track 1: Agent
                    </div>

                    {/* Main headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] mb-6">
                        <span className="text-neutral-900 dark:text-white">BNB Chain</span>
                        <br />
                        <TextGenerateEffect
                            words="AI Toolkit"
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] bg-gradient-to-r from-[#F0B90B] via-amber-400 to-[#F0B90B] bg-clip-text text-transparent"
                        />
                    </h1>

                    {/* Sub-headline */}
                    <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                        72+ AI Agents. 6 MCP Servers. 900+ Tools. One Repo.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-14">
                        <a
                            href="https://github.com/nirholas/bnb-chain-toolkit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#F0B90B] text-black font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(240,185,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                        >
                            <GitBranch className="w-5 h-5" />
                            View on GitHub
                            <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <Link
                            to="/docs"
                            className="inline-flex items-center gap-2.5 px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 border border-neutral-300 dark:border-white/[0.12] text-neutral-700 dark:text-neutral-300 hover:border-[#F0B90B]/50 hover:text-[#F0B90B] dark:hover:border-[#F0B90B]/40 dark:hover:text-[#F0B90B] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                        >
                            <BookOpen className="w-5 h-5" />
                            Read Docs
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                        {heroStats.map(({ label, value, Icon }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white dark:bg-white/[0.03] border-neutral-200 dark:border-white/[0.06] backdrop-blur-sm"
                            >
                                <Icon className="w-4 h-4 text-[#F0B90B]" />
                                <span className="font-bold text-neutral-900 dark:text-white text-sm">{value}</span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-500">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-40" aria-hidden="true">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Scroll</span>
                        <ChevronRight className="w-4 h-4 text-neutral-400 rotate-90" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2 — LIVE MARKET DATA STRIP
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-3 border-y border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01]">
                <PriceTicker />
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3 — WHAT IS THIS? / VALUE PROPOSITION
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        title="What Is BNB Chain AI Toolkit?"
                        subtitle="Imagine giving Claude or ChatGPT a crypto wallet, a trading terminal, and 72 expert advisors. That's what this toolkit does."
                    />

                    <BentoGrid className="max-w-6xl mx-auto">
                        {toolkitComponents.map((comp, i) => (
                            <BentoGridItem
                                key={comp.name}
                                title={comp.name}
                                description={comp.description}
                                header={
                                    <div className="flex items-center justify-between w-full p-4">
                                        <div className="p-3 rounded-xl bg-[#F0B90B]/[0.08] border border-[#F0B90B]/[0.12]">
                                            <comp.icon className="w-6 h-6 text-[#F0B90B]" />
                                        </div>
                                        <span className="text-3xl font-bold text-[#F0B90B]">{comp.count}</span>
                                    </div>
                                }
                                className={i === 0 || i === 2 ? 'md:col-span-2' : ''}
                                icon={<comp.icon className="w-4 h-4 text-neutral-500" />}
                            />
                        ))}
                    </BentoGrid>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4 — MCP SERVERS SHOWCASE
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-neutral-50 dark:bg-white/[0.01]">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        badge="Model Context Protocol"
                        badgeIcon={Plug}
                        title="6 MCP Servers, 900+ Tools"
                        subtitle="Give AI assistants direct blockchain access. Connect Claude, ChatGPT, or any LLM to BNB Chain, Binance, and 60+ networks."
                    />

                    <div className="max-w-5xl mx-auto mb-16">
                        <HoverEffect items={mcpHoverItems} />
                        {/* Tool count badges beneath hover cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 max-w-3xl mx-auto">
                            {mcpServers.map((s) => (
                                <div
                                    key={s.name}
                                    className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
                                >
                                    <div className="flex items-center gap-2">
                                        <s.icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                        <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{s.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-[#F0B90B] ml-2">{s.tools}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Config code block */}
                    <div className="max-w-2xl mx-auto">
                        <TerminalBlock title="claude_desktop_config.json" code={claudeConfigCode} lang="json" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5 — AI AGENTS OVERVIEW
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        badge="72+ Specialized Agents"
                        badgeIcon={Bot}
                        title="Pre-Built AI Agents for Every Protocol"
                        subtitle="From PancakeSwap trading to Venus lending, BNB staking to opBNB optimization — purpose-built agents for every major BNB Chain protocol."
                    />

                    {/* Featured agents — 3D cards */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                        {featuredAgents.map((agent) => (
                            <CardContainer key={agent.name} className="inter-var">
                                <CardBody className="relative group/card w-full h-auto rounded-2xl p-6 border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0a] hover:shadow-xl dark:hover:shadow-[#F0B90B]/[0.04] transition-shadow">
                                    <CardItem translateZ="50" className="w-full">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}25` }}
                                        >
                                            <Bot className="w-5 h-5" style={{ color: agent.color }} />
                                        </div>
                                    </CardItem>
                                    <CardItem translateZ="60" className="w-full">
                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{agent.name}</h3>
                                    </CardItem>
                                    <CardItem translateZ="40" className="w-full">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{agent.description}</p>
                                    </CardItem>
                                    <CardItem translateZ="30" className="mt-4">
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/[0.08] text-neutral-500 dark:text-neutral-400">
                                            {agent.category}
                                        </span>
                                    </CardItem>
                                </CardBody>
                            </CardContainer>
                        ))}
                    </div>

                    {/* Category grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
                        {agentCategories.map((cat) => (
                            <div
                                key={cat.name}
                                className="group p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">{cat.count}</span>
                                </div>
                                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1">{cat.name}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{cat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6 — QUICK START
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-neutral-50 dark:bg-transparent overflow-hidden">
                <LampContainer>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                                Get Started in 60 Seconds
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg">
                                Clone, install, run. It&apos;s that simple.
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <TerminalBlock title="terminal" code={quickStartCode} lang="shell" />
                        </div>
                    </div>
                </LampContainer>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 7 — SUPPORTED CHAINS
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        badge="Multi-Chain"
                        badgeIcon={Network}
                        title="60+ Supported Networks"
                        subtitle="BNB Chain first, but cross-chain by design."
                    />

                    <div className="max-w-5xl mx-auto">
                        <InfiniteMovingCards
                            items={chainMarqueeItems}
                            direction="left"
                            speed="slow"
                        />
                    </div>

                    {/* Static chain pills as fallback / additional display */}
                    <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto mt-10">
                        {supportedChains.map((chain) => (
                            <div
                                key={chain.name}
                                className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 border ${
                                    chain.primary
                                        ? 'border-[#F0B90B]/30 bg-[#F0B90B]/[0.06] text-[#F0B90B] font-medium'
                                        : 'border-neutral-200 dark:border-white/[0.06] text-neutral-600 dark:text-neutral-400 bg-white dark:bg-white/[0.02]'
                                }`}
                            >
                                {chain.name}
                                <span className="ml-1.5 text-xs opacity-50">{chain.type}</span>
                            </div>
                        ))}
                        <div className="px-4 py-2 rounded-xl text-sm border border-dashed border-neutral-300 dark:border-white/[0.08] text-neutral-400">
                            + 50 more
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 8 — DEFI DASHBOARD
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-neutral-50 dark:bg-white/[0.01]">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        badge="Real-Time"
                        badgeIcon={Activity}
                        title="Live DeFi Data"
                        subtitle="Real-time market data from CoinGecko, DeFiLlama, and 200+ sources."
                    />

                    <div className="max-w-7xl mx-auto">
                        <DeFiSummaryBar />
                        <div className="grid md:grid-cols-3 gap-6 mt-6">
                            <TopProtocolsWidget />
                            <TopYieldsWidget />
                            <TopChainsWidget />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 9 — ARCHITECTURE OVERVIEW
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        title="Repository Architecture"
                        subtitle="A single monorepo with everything integrated and production-ready."
                    />

                    <div className="max-w-4xl mx-auto">
                        <BackgroundGradient className="rounded-2xl p-px">
                            <div className="bg-[#0a0a0a] rounded-2xl p-6 md:p-8 font-mono text-sm text-neutral-300 leading-relaxed overflow-x-auto">
                                <div className="text-[#F0B90B] mb-3 font-bold">bnb-chain-toolkit/</div>
                                <div className="ml-4 space-y-1.5">
                                    <div><span className="text-blue-400">├── agents/</span><span className="text-neutral-600 ml-4"># 72+ AI Agent definitions</span></div>
                                    <div className="ml-4 text-neutral-500">
                                        <div>├── bnb-chain-agents/ <span className="text-neutral-600"># 30 BNB-specific agents</span></div>
                                        <div>└── defi-agents/ <span className="text-neutral-600"># 42 general DeFi agents</span></div>
                                    </div>
                                    <div><span className="text-blue-400">├── mcp-servers/</span><span className="text-neutral-600 ml-4"># 6 MCP servers</span></div>
                                    <div className="ml-4 text-neutral-500">
                                        <div>├── bnbchain-mcp/ <span className="text-neutral-600"># BSC + opBNB (100+ tools)</span></div>
                                        <div>├── binance-mcp/ <span className="text-neutral-600"># Binance.com (478+ tools)</span></div>
                                        <div>├── universal-crypto-mcp/ <span className="text-neutral-600"># 60+ networks</span></div>
                                        <div>├── agenti/ <span className="text-neutral-600"># EVM + Solana</span></div>
                                        <div>└── ucai/ <span className="text-neutral-600"># ABI-to-MCP generator</span></div>
                                    </div>
                                    <div><span className="text-blue-400">├── market-data/</span><span className="text-neutral-600 ml-4"># Market data &amp; news</span></div>
                                    <div><span className="text-blue-400">├── defi-tools/</span><span className="text-neutral-600 ml-4"># DeFi utilities</span></div>
                                    <div><span className="text-blue-400">├── wallets/</span><span className="text-neutral-600 ml-4"># Wallet tooling</span></div>
                                    <div><span className="text-blue-400">├── standards/</span><span className="text-neutral-600 ml-4"># ERC-8004 + W3AG</span></div>
                                    <div><span className="text-blue-400">└── docs/</span><span className="text-neutral-600 ml-4"># Documentation</span></div>
                                </div>
                            </div>
                        </BackgroundGradient>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 10 — WHY THIS TOOLKIT
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-neutral-900 dark:bg-neutral-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                            Why BNB Chain AI Toolkit?
                        </h2>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <HoverEffect items={whyReasons} />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 11 — EXPLORE THE TOOLKIT
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        title="Explore the Toolkit"
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
                        {exploreItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.href}
                                className="group relative p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[#F0B90B]/[0.03]"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${item.accent}10`, border: `1px solid ${item.accent}20` }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: item.accent }} />
                                </div>
                                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-[#F0B90B] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                                <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mt-3 group-hover:translate-x-1 group-hover:text-[#F0B90B] transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 12 — FINAL CTA
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-28 md:py-36 overflow-hidden bg-neutral-900 dark:bg-black">
                {/* Sparkles particle background */}
                <div className="absolute inset-0 w-full h-full">
                    <SparklesCore
                        id="cta-sparkles"
                        background="transparent"
                        minSize={0.4}
                        maxSize={1.2}
                        particleDensity={40}
                        className="w-full h-full"
                        particleColor="#F0B90B"
                    />
                </div>

                {/* Radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#F0B90B]/[0.04] blur-[100px] pointer-events-none" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white mb-5">
                        Ready to Build on BNB Chain?
                    </h2>
                    <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
                        72+ agents, 6 MCP servers, 900+ tools. Open source. Start building now.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://github.com/nirholas/bnb-chain-toolkit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#F0B90B] text-black font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(240,185,11,0.35)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                            <GitBranch className="w-5 h-5" />
                            Star on GitHub
                        </a>
                        <Link
                            to="/docs"
                            className="inline-flex items-center gap-2.5 px-8 py-4 font-bold rounded-xl transition-all duration-300 border border-white/[0.15] text-white hover:border-[#F0B90B]/50 hover:text-[#F0B90B] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                            <BookOpen className="w-5 h-5" />
                            Get Started
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
