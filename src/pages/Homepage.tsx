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

import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import useI18n from '@/stores/i18nStore';
import PriceTicker from '@/components/PriceTicker';
import { TopProtocolsWidget, TopYieldsWidget, TopChainsWidget, DeFiSummaryBar } from '@/components/DeFiWidgets';
import {
    Shield, Globe, Bot, ChevronRight, Zap,
    Code, BookOpen, Terminal, Cpu, Users, Layers,
    Coins, GitBranch,
    ExternalLink, GraduationCap,
    BarChart3, Eye, Server, Wrench,
    Activity, Network, Blocks, Plug, Sparkles, Copy, Check,
    Fingerprint, BadgeCheck, ArrowRight
} from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
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
];

// howItWorks is now built inside the component so it can use t()

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
        title: 'Primary',
    })),
];

const exploreItems = [
    { title: 'ERC-8004 Agents', desc: 'Create trustless AI agent identities on BSC', icon: Bot, href: '/erc8004', accent: '#F0B90B' },
    { title: 'Documentation', desc: 'Comprehensive guides and API references', icon: BookOpen, href: '/docs', accent: '#3B82F6' },
    { title: 'Tutorials', desc: 'Step-by-step interactive learning paths', icon: GraduationCap, href: '/tutorials', accent: '#10B981' },
    { title: 'Playground', desc: 'Try BNB Chain smart contracts live', icon: Code, href: '/playground', accent: '#F59E0B' },
    { title: 'Sandbox', desc: 'AI-powered development environment', icon: Terminal, href: '/sandbox', accent: '#8B5CF6' },
    { title: 'IDE', desc: 'Solidity and Web3 development studio', icon: Cpu, href: '/ide', accent: '#A855F7' },
    { title: 'Full-Stack Demo', desc: 'Contract + frontend builder', icon: Layers, href: '/fullstack-demo', accent: '#F0B90B' },
    { title: 'Innovation Lab', desc: 'AI tools & experimental features', icon: Sparkles, href: '/innovation', accent: '#EC4899' },
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
                <div className="badge-pro mb-6">
                    {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
                    {badge}
                </div>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-neutral-900 dark:text-white mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-light">
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
    const { t } = useI18n();

    const howItWorks = useMemo(() => [
        {
            step: '1',
            title: t('home.step1.title'),
            description: t('home.step1.desc'),
            icon: Bot,
            link: '/agents',
            linkText: t('home.step1.link'),
        },
        {
            step: '2',
            title: t('home.step2.title'),
            description: t('home.step2.desc'),
            icon: Plug,
            link: '/mcp',
            linkText: t('home.step2.link'),
        },
        {
            step: '3',
            title: t('home.step3.title'),
            description: t('home.step3.desc'),
            icon: Wrench,
            link: '/docs',
            linkText: t('home.step3.link'),
        },
    ], [t]);
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

                {/* Grid background with radial mask */}
                <div className="absolute inset-0 pointer-events-none bg-grid-pro bg-grid-pro-mask opacity-60" />

                {/* Subtle radial glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#F0B90B]/[0.04] blur-[150px]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 pt-24 pb-20 text-center">
                    {/* Hackathon badge — professional pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-10 border backdrop-blur-md bg-[#F0B90B]/[0.04] border-[#F0B90B]/20 text-[#F0B90B] uppercase animate-border-glow">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0B90B] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0B90B]" />
                        </span>
                        BNB Chain &quot;Good Vibes Only&quot; Hackathon — Track 1: Agent
                    </div>

                    {/* Main headline — tighter, bolder */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.05em] mb-6 leading-[0.95]">
                        <span className="text-neutral-900 dark:text-white">BNB Chain</span>
                        <br />
                        <TextGenerateEffect
                            words="AI Toolkit"
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.05em] bg-gradient-to-r from-[#F0B90B] via-amber-300 to-[#F0B90B] bg-clip-text text-transparent animate-text-shimmer"
                        />
                    </h1>

                    {/* Sub-headline — sharper */}
                    <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto mb-12 leading-relaxed font-light tracking-wide">
                        {t('home.hero.tagline')}
                    </p>

                    {/* CTA buttons — hierarchy: primary > secondary > tertiary */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        <Link
                            to="/erc8004"
                            className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-[#F0B90B] text-black font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(240,185,11,0.45)] hover:-translate-y-0.5 active:translate-y-0 animate-glow-pulse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                        >
                            <Bot className="w-5 h-5" />
                            {t('home.create_erc8004')}
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/fullstack-demo"
                            className="group inline-flex items-center gap-2.5 px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 border border-neutral-200 dark:border-white/[0.1] text-neutral-600 dark:text-neutral-300 hover:border-[#F0B90B]/40 hover:text-[#F0B90B] hover:-translate-y-0.5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm"
                        >
                            <Zap className="w-5 h-5" />
                            {t('home.start_building')}
                        </Link>
                        <a
                            href="https://github.com/nirholas/bnb-chain-toolkit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 border border-neutral-200 dark:border-white/[0.1] text-neutral-600 dark:text-neutral-300 hover:border-[#F0B90B]/40 hover:text-[#F0B90B] hover:-translate-y-0.5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm"
                        >
                            <GitBranch className="w-5 h-5" />
                            GitHub
                            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>

                    {/* Stats — sharp professional counters */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        {heroStats.map(({ label, value, Icon }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border bg-white/80 dark:bg-white/[0.03] border-neutral-200/80 dark:border-white/[0.06] backdrop-blur-sm"
                            >
                                <Icon className="w-4 h-4 text-[#F0B90B]" />
                                <span className="font-bold text-neutral-900 dark:text-white text-sm stat-number">{value}</span>
                                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">{label}</span>
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
                <div className="container mx-auto px-4">
                    <PriceTicker />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2.5 — ERC-8004 TRUSTLESS AGENTS (HERO HIGHLIGHT)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#F0B90B]/[0.04] blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
                </div>
                <div className="absolute inset-0 bg-grid-pro bg-grid-pro-mask opacity-20 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Badge */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-8 border backdrop-blur-md bg-[#F0B90B]/[0.06] border-[#F0B90B]/25 text-[#F0B90B] uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0B90B] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0B90B]" />
                            </span>
                            Now Live on BSC
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-white mb-5">
                            Create{' '}
                            <span className="bg-gradient-to-r from-[#F0B90B] via-amber-300 to-[#F0B90B] bg-clip-text text-transparent">ERC-8004 Agents</span>
                            {' '}on BSC
                        </h2>
                        <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                            Give your AI agent a portable, censorship-resistant on-chain identity. Each agent gets an ERC-721 NFT
                            — discoverable, transferable, and trusted across the entire agent economy.
                        </p>
                    </div>

                    {/* Three pillars */}
                    <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
                        <div className="group relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#F0B90B]/10 border border-[#F0B90B]/20">
                                <Fingerprint className="w-6 h-6 text-[#F0B90B]" />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2 tracking-tight">Identity Registry</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">ERC-721 agent identity. Portable, browsable, transferable. Your agent&apos;s permanent on-chain handle.</p>
                        </div>
                        <div className="group relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-amber-500/10 border border-amber-500/20">
                                <BadgeCheck className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2 tracking-tight">Reputation Registry</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">Standardized feedback signals. Clients rate agents on-chain — scores, uptime, response time, revenue.</p>
                        </div>
                        <div className="group relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-amber-600/10 border border-amber-600/20">
                                <Shield className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2 tracking-tight">Validation Registry</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">Independent verification via stakers, zkML proofs, or TEE oracles. Pluggable trust models.</p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-white stat-number">0x8004</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Vanity Prefix</div>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-white stat-number">16+</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Chains Deployed</div>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-white stat-number">3</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">On-Chain Registries</div>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-white stat-number">Free</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">No Fees (Just Gas)</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/erc8004"
                            className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-[#F0B90B] text-black font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_50px_rgba(240,185,11,0.5)] hover:-translate-y-0.5 animate-glow-pulse"
                        >
                            <Bot className="w-5 h-5" />
                            Create Your Agent Now
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="https://testnet.bscscan.com/tx/0xfc55d83d20e6d92ff522f302fd3424d3fd5557f25c06f4bfc38ecf3246dc1962"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 border border-white/[0.12] text-white hover:border-[#F0B90B]/50 hover:text-[#F0B90B] hover:-translate-y-0.5"
                        >
                            See Our First Agent on BSC
                            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <a
                            href="https://www.8004.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 text-neutral-400 hover:text-[#F0B90B] hover:-translate-y-0.5"
                        >
                            Read the ERC-8004 Spec
                            <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3 — HOW IT WORKS
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        title={t('home.how_it_works')}
                        subtitle={t('home.how_it_works_sub')}
                    />

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {howItWorks.map((item, i) => (
                            <div
                                key={item.step}
                                className="relative group p-7 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[#F0B90B]/[0.03]"
                            >
                                {/* Step number */}
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F0B90B]/10 text-sm font-extrabold text-[#F0B90B] stat-number">
                                        {item.step}
                                    </span>
                                    <item.icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                                </div>

                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-5">
                                    {item.description}
                                </p>
                                <Link
                                    to={item.link}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F0B90B] hover:underline uppercase tracking-wide"
                                >
                                    {item.linkText}
                                    <ChevronRight className="w-3 h-3" />
                                </Link>

                                {/* Connector arrow (between cards, desktop only) */}
                                {i < howItWorks.length - 1 && (
                                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-neutral-300 dark:text-neutral-700" aria-hidden="true">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4 — MCP SERVERS SHOWCASE
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-neutral-50 dark:bg-white/[0.01]">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        badge={t('home.mcp.badge')}
                        badgeIcon={Plug}
                        title={t('home.mcp.title')}
                        subtitle={t('home.mcp.subtitle')}
                    />

                    <div className="max-w-5xl mx-auto mb-16">
                        <HoverEffect items={mcpHoverItems} />
                        {/* Tool count badges beneath hover cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 max-w-3xl mx-auto">
                            {mcpServers.map((s) => (
                                <div
                                    key={s.name}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#F0B90B]/20 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <s.icon className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">{s.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-[#F0B90B] ml-2 stat-number">{s.tools}</span>
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
                        badge={t('home.agents.badge')}
                        badgeIcon={Bot}
                        title={t('home.agents.title')}
                        subtitle={t('home.agents.subtitle')}
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
                                className="group p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[#F0B90B]/[0.03]"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                                    <span className="text-2xl font-extrabold text-neutral-900 dark:text-white stat-number">{cat.count}</span>
                                </div>
                                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1 tracking-tight">{cat.name}</h3>
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
                                {t('home.quickstart.title')}
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg">
                                {t('home.quickstart.subtitle')}
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
                        badge={t('home.chains.badge')}
                        badgeIcon={Network}
                        title={t('home.chains.title')}
                        subtitle={t('home.chains.subtitle')}
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
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 8 — DEFI DASHBOARD
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-neutral-50 dark:bg-white/[0.01]">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        badge={t('home.defi.badge')}
                        badgeIcon={Activity}
                        title={t('home.defi.title')}
                        subtitle={t('home.defi.subtitle')}
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
                        title={t('home.architecture.title')}
                        subtitle={t('home.architecture.subtitle')}
                    />

                    <div className="max-w-4xl mx-auto">
                        <BackgroundGradient className="rounded-2xl">
                            <div className="bg-[#0a0a0a] rounded-2xl p-6 md:p-8 font-mono text-sm text-neutral-300 leading-relaxed overflow-x-auto border border-white/[0.04]">
                                <div className="text-[#F0B90B] mb-3 font-extrabold tracking-tight text-base">bnb-chain-toolkit/</div>
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
            <section className="py-24 md:py-32 bg-neutral-900 dark:bg-neutral-950 relative overflow-hidden">
                {/* Subtle grid bg */}
                <div className="absolute inset-0 bg-grid-pro bg-grid-pro-mask opacity-30 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <div className="badge-pro mb-6">
                            <Shield className="w-3 h-3" />
                            {t('home.why.badge')}
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-white mb-4">
                            {t('home.why.title')}
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
                        title={t('home.explore')}
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
                        {exploreItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.href}
                                className="group relative p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#F0B90B]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[#F0B90B]/[0.04]"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${item.accent}10`, border: `1px solid ${item.accent}20` }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: item.accent }} />
                                </div>
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-1 group-hover:text-[#F0B90B] transition-colors tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                                <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mt-4 group-hover:translate-x-1 group-hover:text-[#F0B90B] transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 12 — FINAL CTA
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-28 md:py-36 overflow-hidden bg-neutral-900 dark:bg-black">
                {/* Grid background */}
                <div className="absolute inset-0 bg-grid-pro bg-grid-pro-mask opacity-40 pointer-events-none" />

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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F0B90B]/[0.05] blur-[120px] pointer-events-none" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="badge-pro mb-6">
                        <Zap className="w-3 h-3" />
                        Open Source
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white mb-5">
                        {t('home.cta.title')}
                    </h2>
                    <p className="text-neutral-400 text-lg mb-12 max-w-lg mx-auto font-light">
                        {t('home.cta.subtitle')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/fullstack-demo"
                            className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-[#F0B90B] text-black font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_50px_rgba(240,185,11,0.5)] hover:-translate-y-0.5 animate-glow-pulse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                            <Zap className="w-5 h-5" />
                            {t('home.start_building')}
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="https://github.com/nirholas/bnb-chain-toolkit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 px-8 py-4 font-bold rounded-xl transition-all duration-300 border border-white/[0.12] text-white hover:border-[#F0B90B]/50 hover:text-[#F0B90B] hover:-translate-y-0.5"
                        >
                            <GitBranch className="w-5 h-5" />
                            {t('home.star_github')}
                        </a>
                        <Link
                            to="/docs"
                            className="inline-flex items-center gap-2.5 px-8 py-4 font-bold rounded-xl transition-all duration-300 text-neutral-400 hover:text-[#F0B90B] hover:-translate-y-0.5"
                        >
                            <BookOpen className="w-5 h-5" />
                            {t('common.get_started')}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
