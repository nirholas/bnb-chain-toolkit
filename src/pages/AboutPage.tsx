/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 You're part of something special 🎪
 */

import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import useI18n from '@/stores/i18nStore';
import { LampContainer } from "@/components/ui/lamp";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { MovingBorder } from "@/components/ui/moving-border";
import { SparklesCore } from "@/components/ui/sparkles";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  Github,
  Twitter,
  Shield,
  Globe,
  Languages,
  Heart,
  Bot,
  Server,
  Wrench,
  Zap,
  BarChart3,
  Wallet,
  Eye,
  FileText,
  Database,
} from "lucide-react";

const stats = [
  { value: "78", label: "AI Agents", icon: Bot, description: "36 BNB Chain + 42 DeFi agents" },
  { value: "6", label: "MCP Servers", icon: Server, description: "1,100+ tools across all servers" },
  { value: "478+", label: "Binance Tools", icon: BarChart3, description: "Most comprehensive exchange MCP" },
  { value: "60+", label: "Chains", icon: Globe, description: "BNB Chain, Ethereum, Solana, and more" },
  { value: "57", label: "Wallet Tools", icon: Wallet, description: "5 wallet MCP servers, 348 tests" },
  { value: "2", label: "Open Standards", icon: Shield, description: "ERC-8004 + W3AG" },
  { value: "30+", label: "Languages", icon: Languages, description: "Agent translations" },
  { value: "662K+", label: "News Articles", icon: FileText, description: "200+ sources, 42 languages" },
];

const capabilities = [
  {
    quote: "PancakeSwap Expert, Venus Protocol, Lista DAO, Thena, Alpaca Finance — DeFi protocol coverage that runs deep, not wide.",
    name: "36 BNB Chain Agents",
    title: "DeFi, staking, NFTs, governance, bridges",
    icon: <Bot className="w-5 h-5" />,
  },
  {
    quote: "Airdrop Hunter, MEV Protection, Impermanent Loss Calculator, Liquidation Risk Manager — tools that actually save money.",
    name: "42 DeFi Agents",
    title: "Cross-protocol analysis and optimization",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    quote: "From ABI-to-MCP generation to 478+ Binance exchange tools — every server is production-tested with real endpoints.",
    name: "6 MCP Servers",
    title: "150+ to 478+ tools per server",
    icon: <Server className="w-5 h-5" />,
  },
  {
    quote: "ERC-8004 deployed on Ethereum mainnet for AI agent trust verification. W3AG defines 50+ accessibility criteria for Web3.",
    name: "Open Standards",
    title: "ERC-8004 + W3AG specifications",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    quote: "Gasless dust sweeping via ERC-4337, MEV-protected swaps through CoW Protocol, multi-chain consolidation across 8 networks.",
    name: "Dust Sweeper",
    title: "Consolidate small balances into DeFi yields",
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    quote: "662K+ articles from 200+ sources in 42 languages. Free API, no auth. Edge Runtime compatible. Self-hostable.",
    name: "Crypto News Aggregator",
    title: "Real-time intelligence from every source",
    icon: <Eye className="w-5 h-5" />,
  },
];

const techStack = [
  { name: "React 19", url: "https://react.dev", description: "UI framework" },
  { name: "TypeScript 5.9", url: "https://www.typescriptlang.org", description: "Type safety" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com", description: "Utility-first CSS" },
  { name: "Vite 7", url: "https://vitejs.dev", description: "Build tooling" },
  { name: "ethers.js", url: "https://docs.ethers.org", description: "Ethereum library" },
  { name: "viem", url: "https://viem.sh", description: "TypeScript Ethereum" },
  { name: "Zustand", url: "https://zustand-demo.pmnd.rs", description: "State management" },
  { name: "Framer Motion", url: "https://www.framer.com/motion", description: "Animations" },
  { name: "Foundry", url: "https://getfoundry.sh", description: "Smart contracts" },
  { name: "Hono", url: "https://hono.dev", description: "Edge backend" },
];

const mcpHighlights = [
  { name: "bnbchain-mcp", tools: "150+", focus: "BNB Chain + EVM — balances, transfers, tokens, security" },
  { name: "binance-mcp", tools: "478+", focus: "Spot, Futures, Margin, Options, Algo, Earn, Copy Trading, NFT" },
  { name: "binance-us-mcp", tools: "120+", focus: "Regulated US exchange — spot, staking, OTC, custody" },
  { name: "universal-crypto-mcp", tools: "380+", focus: "60+ chains — 1inch, Aave, Compound, Uniswap, LayerZero" },
  { name: "agenti", tools: "380+", focus: "EVM + Solana — x402 payments, Flashbots MEV, Wormhole bridges" },
  { name: "ucai", tools: "ABI→MCP", focus: "Generate custom MCP tools from any smart contract ABI" },
];

export default function AboutPage() {
  const { t } = useI18n();

  useSEO({
    title: "About",
    description:
      "Learn about BNB Chain AI Toolkit — 78 AI agents, 6 MCP servers, and 1,100+ tools for BNB Chain and 60+ networks.",
    path: "/about",
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero with Lamp */}
      <LampContainer className="min-h-[60vh] md:min-h-[70vh]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <TextGenerateEffect
            words={t('about.hero_title')}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          />
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('about.hero_subtitle')}
          </p>
        </div>
      </LampContainer>

      {/* Stats Strip — BentoGrid */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <BentoGrid className="md:auto-rows-[12rem] md:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <BentoGridItem
                  key={stat.label}
                  title={<span className="text-2xl md:text-3xl font-bold">{stat.value}</span>}
                  description={
                    <div>
                      <div className="font-medium text-sm text-gray-700 dark:text-gray-300">{stat.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{stat.description}</div>
                    </div>
                  }
                  icon={<Icon className="w-6 h-6 text-[#F0B90B]" />}
                  className="text-center"
                />
              );
            })}
          </BentoGrid>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">{t('about.mission')}</h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            <p>
              I believe AI should be a force multiplier for every Web3
              developer. BNB Chain AI Toolkit provides pre-built agent
              definitions, Model Context Protocol servers, and hundreds of
              composable tools — so builders can focus on what matters rather
              than re-inventing infrastructure.
            </p>
            <p>
              Whether you&apos;re tracking whale wallets on BSC, bridging assets
              through opBNB, optimizing gas with Flashbots MEV protection,
              sweeping dust across 8 chains with ERC-4337, or generating custom
              MCP servers from any smart contract ABI — every capability is one
              import away.
            </p>
          </div>
        </div>
      </section>

      {/* Scrolling capabilities showcase */}
      <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <h2 className="text-3xl font-bold">{t('about.whats_inside')}</h2>
          <p className="mt-2 text-gray-500">
            A scrolling look at the depth of the toolkit.
          </p>
        </div>
        <InfiniteMovingCards
          items={capabilities}
          direction="left"
          speed="slow"
          pauseOnHover
        />
      </section>

      {/* MCP Servers Deep Dive */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t('about.mcp_servers')}</h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Each server is production-ready, self-contained, and exposes hundreds
            of structured tools that AI assistants can call directly.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mcpHighlights.map((server) => (
              <BackgroundGradient
                key={server.name}
                className="rounded-2xl p-6 bg-white dark:bg-black"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Server className="w-5 h-5 text-[#F0B90B]" />
                  <h3 className="font-semibold">{server.name}</h3>
                  <span className="ml-auto text-sm font-bold text-[#F0B90B]">
                    {server.tools}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {server.focus}
                </p>
              </BackgroundGradient>
            ))}
          </div>
        </div>
      </section>

      {/* Standards — BackgroundGradient cards */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">{t('about.open_standards')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <BackgroundGradient className="rounded-2xl p-8 bg-white dark:bg-black">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#F0B90B]" />
                <h3 className="text-xl font-bold">ERC-8004</h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium">
                  Deployed on Mainnet
                </span>
              </div>
              <p className="text-gray-500 mb-4 leading-relaxed">
                Trustless agent verification standard. Three on-chain registries
                — Identity (ERC-721), Reputation, and Validation — give AI agents
                portable, verifiable trust metadata.
              </p>
              <div className="text-xs text-gray-400 font-mono space-y-1">
                <div>IdentityRegistry: 0x8004A169...</div>
                <div>ReputationRegistry: 0x8004BAa1...</div>
              </div>
            </BackgroundGradient>
            <BackgroundGradient className="rounded-2xl p-8 bg-white dark:bg-black">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-[#F0B90B]" />
                <h3 className="text-xl font-bold">W3AG</h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                  50+ Criteria
                </span>
              </div>
              <p className="text-gray-500 mb-4 leading-relaxed">
                Web3 Accessibility Guidelines — the first open standard for making
                blockchain apps accessible. 4 principles, 16 guidelines, 50+
                success criteria across 3 conformance levels. Includes React
                components for gas estimation, network switching, and token approvals.
              </p>
              <div className="text-xs text-gray-400">
                Level A (minimum) → Level AA (recommended) → Level AAA (enhanced)
              </div>
            </BackgroundGradient>
          </div>
        </div>
      </section>

      {/* Wallets + DeFi Tools — BackgroundGradient */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">{t('about.beyond_agents')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-black">
              <Wallet className="w-6 h-6 text-[#F0B90B] mb-4" />
              <h3 className="font-bold mb-2">Wallet Toolkit</h3>
              <p className="text-sm text-gray-500 mb-3">
                57 tools across 5 MCP servers — HD wallets, BIP-39 mnemonics,
                vanity addresses, EIP-191/712 signing, legacy + EIP-1559
                transactions, V3 keystores. All fully offline.
              </p>
              <span className="text-xs text-gray-400">348 tests passing</span>
            </BackgroundGradient>
            <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-black">
              <Wrench className="w-6 h-6 text-[#F0B90B] mb-4" />
              <h3 className="font-bold mb-2">Dust Sweeper</h3>
              <p className="text-sm text-gray-500 mb-3">
                Gasless multi-chain dust consolidation via ERC-4337 account
                abstraction. Routes into Aave, Yearn, Beefy, Lido, and Jito
                yields. MEV-protected through CoW Protocol batch auctions.
              </p>
              <span className="text-xs text-gray-400">8 chains supported</span>
            </BackgroundGradient>
            <BackgroundGradient className="rounded-2xl p-6 bg-white dark:bg-black">
              <Database className="w-6 h-6 text-[#F0B90B] mb-4" />
              <h3 className="font-bold mb-2">Market Data</h3>
              <p className="text-sm text-gray-500 mb-3">
                Edge Runtime price feeds (CoinGecko, DeFiLlama, Fear &amp; Greed
                Index) with zero dependencies. Plus 662K+ news articles from 200+
                sources with AI sentiment analysis. Free API, no auth.
              </p>
              <span className="text-xs text-gray-400">25 req/min smart caching</span>
            </BackgroundGradient>
          </div>
        </div>
      </section>

      {/* Author */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">{t('about.author')}</h2>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F0B90B] to-yellow-600 flex items-center justify-center text-black text-2xl font-bold shrink-0">
              N
            </div>
            <div>
              <h3 className="text-xl font-semibold">nich</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Independent builder shipping open-source AI and Web3
                infrastructure for the BNB Chain ecosystem. Building this toolkit
                for the BNB Chain &quot;Good Vibes Only&quot; hackathon.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://x.com/nichxbt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#F0B90B] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  @nichxbt
                </a>
                <a
                  href="https://github.com/nirholas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#F0B90B] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  nirholas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack — HoverEffect */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">{t('about.tech_stack')}</h2>
          <HoverEffect
            items={techStack.map((tech) => ({
              title: tech.name,
              description: tech.description,
              link: tech.url,
            }))}
          />
        </div>
      </section>

      {/* Open Source — SparklesCore bg + MovingBorder CTA */}
      <section className="relative py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            minSize={0.3}
            maxSize={0.8}
            particleDensity={30}
            particleColor="#F0B90B"
            className="w-full h-full"
          />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Heart className="w-10 h-10 mx-auto mb-6 text-[#F0B90B]" />
          <h2 className="text-3xl font-bold mb-4">{t('about.open_source')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
            BNB Chain AI Toolkit is released under the MIT License. Every agent
            definition, every MCP server, every tool — free to use, modify, and
            distribute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MovingBorder
              as="a"
              duration={3}
              containerClassName="h-12"
              className="bg-black dark:bg-white text-white dark:text-black font-semibold"
              {...{
                href: "https://github.com/nirholas/bnb-chain-toolkit",
                target: "_blank",
                rel: "noopener noreferrer",
              } as any}
            >
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </MovingBorder>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 font-semibold hover:border-[#F0B90B]/50 transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
