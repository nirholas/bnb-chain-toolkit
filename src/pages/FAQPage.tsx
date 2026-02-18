/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Excellence is a habit, not an act 🌟
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import useI18n from '@/stores/i18nStore';
import { Spotlight } from "@/components/ui/spotlight";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  Code2,
  Shield,
  Server,
  Bot,
  Users,
  Wrench,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const heroWords = [
  { text: "Frequently" },
  { text: "Asked" },
  { text: "Questions", className: "text-[#F0B90B]" },
];

const faqCategories = [
  { id: "all", label: "All", icon: <HelpCircle className="w-4 h-4" /> },
  { id: "general", label: "General", icon: <HelpCircle className="w-4 h-4" /> },
  { id: "technical", label: "Technical", icon: <Code2 className="w-4 h-4" /> },
  { id: "mcp", label: "MCP Servers", icon: <Server className="w-4 h-4" /> },
  { id: "agents", label: "AI Agents", icon: <Bot className="w-4 h-4" /> },
  { id: "tools", label: "Tools", icon: <Wrench className="w-4 h-4" /> },
  { id: "contributing", label: "Contributing", icon: <Users className="w-4 h-4" /> },
];

const faqs: FAQItem[] = [
  {
    question: "What is BNB Chain AI Toolkit?",
    answer:
      "BNB Chain AI Toolkit is an open-source collection of 78 AI agent definitions, 6 Model Context Protocol (MCP) servers, and 1,100+ composable tools designed for the BNB Chain ecosystem and other blockchain networks. It includes market data feeds (662K+ news articles), a gasless Dust Sweeper, a 57-tool offline wallet toolkit, and two open standards (ERC-8004 and W3AG). It enables AI assistants like Claude, GPT, and Gemini to interact with DeFi protocols, manage wallets, analyze market data, and execute on-chain operations out of the box.",
    category: "general",
  },
  {
    question: "What is MCP (Model Context Protocol)?",
    answer:
      "Model Context Protocol (MCP) is an open standard created by Anthropic that allows AI assistants to securely connect to external data sources and tools. MCP servers expose structured capabilities — like reading blockchain data, executing swaps, or querying market prices — that AI models can call without custom integrations. Think of it as a universal plugin system for AI. The BNB Chain AI Toolkit contains the largest open-source collection of Web3 MCP tools with 1,100+ across 6 servers.",
    category: "general",
  },
  {
    question: "How do I connect an MCP server to Claude Desktop?",
    answer:
      "Add the server configuration to your Claude Desktop config file (usually at ~/Library/Application Support/Claude/claude_desktop_config.json on macOS or %APPDATA%/Claude/claude_desktop_config.json on Windows). Each MCP server includes a ready-to-use config snippet in its README. Set required API keys as environment variables, restart Claude Desktop, and the tools automatically appear. For example, bnbchain-mcp gives you 150+ BNB Chain tools instantly.",
    category: "mcp",
  },
  {
    question: "How many tools does each MCP server have?",
    answer:
      "The toolkit includes 6 MCP servers: bnbchain-mcp (150+ tools for BNB Chain and EVM), binance-mcp (478+ tools for Binance.com — the most comprehensive exchange MCP ever built, covering spot, futures, options, algo orders like TWAP/VP, copy trading, Simple Earn, NFTs, and Binance Pay), binance-us-mcp (120+ tools for Binance.US), universal-crypto-mcp (380+ tools for multiple networks), agenti (380+ tools for EVM + Solana with Flashbots and x402 payments), and ucai (unlimited — generates MCP tools from any ABI).",
    category: "mcp",
  },
  {
    question: "What is ucai and how does it work?",
    answer:
      "ucai is an ABI-to-MCP generator that creates custom MCP tools from any smart contract ABI. Install it with 'pip install abi-to-mcp', point it at a contract address or ABI file, and it generates a fully functional MCP server with typed tools for every contract function. It includes 50+ security detections, a Contract Whisperer for plain-English explanations, and Pro templates for Flash Loans and MEV Bundles. It's registered in Anthropic's official MCP Registry.",
    category: "mcp",
  },
  {
    question: "What AI agents are included?",
    answer:
      "The toolkit includes 78 agent definitions in two categories: 36 BNB Chain-specific agents (PancakeSwap, Venus Protocol, Lista DAO, Thena, Alpaca Finance, BNB Staking, opBNB, Greenfield, BSC Whale Tracker, MEV Gas Expert, and more) plus 42 general DeFi agents (Airdrop Hunter, MEV Protection Advisor, IL Calculator, DEX Route Optimizer, Yield Analyst, Risk Scoring Engine, Token Unlock Tracker, and more). Each agent is a portable JSON definition that works in any compatible AI framework.",
    category: "agents",
  },
  {
    question: "Can I create custom agents?",
    answer:
      "Yes. Agent definitions are portable JSON files. You can create new agents by copying an existing template (agent-template.json or agent-template-full.json), filling in the schema fields, and placing it in the agents/ directory. Use 'bun run format' to validate and format, and 'bun run build' to include it in the public index. The agents-manifest.json schema is documented and versioned.",
    category: "agents",
  },
  {
    question: "Which blockchains are supported?",
    answer:
      "The primary focus is BNB Smart Chain (BSC), opBNB, and BNB Greenfield. However, universal-crypto-mcp supports many networks including Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, Fantom, zkSync, Linea, Scroll, Mantle, and more. The agenti server adds Solana support. The Dust Sweeper supports 8 chains (BSC, Ethereum, Polygon, Arbitrum, Optimism, Avalanche, Base, opBNB).",
    category: "technical",
  },
  {
    question: "What is the Dust Sweeper?",
    answer:
      "The Dust Sweeper is a DeFi tool that identifies and consolidates small token balances ('dust') across wallets. It uses ERC-4337 account abstraction for gasless consolidation — you don't need native tokens to sweep. It integrates CoW Protocol for MEV-protected swaps, supports 8 chains, and can route swept assets directly into yield protocols like Aave, Yearn, or Beefy for automatic yield generation.",
    category: "tools",
  },
  {
    question: "What is the Wallet Toolkit?",
    answer:
      "The Wallet Toolkit includes 57 tools for offline wallet operations: HD wallet generation (BIP-39 mnemonics, BIP-32 derivation paths), vanity address generation, transaction signing (EIP-191, EIP-712 typed data, legacy + EIP-1559), V3 keystore encryption/decryption, and a self-contained offline1.html file (~500KB) that uses official ethereumjs libraries with zero network dependencies. It includes 5 MCP servers for programmatic access and 348 tests ensuring correctness.",
    category: "tools",
  },
  {
    question: "What market data is available?",
    answer:
      "Two packages: crypto-market-data provides Edge Runtime-compatible price feeds from CoinGecko and DeFiLlama (OHLCV candles, market cap rankings, Fear & Greed Index, smart caching at 25 req/min). crypto-news aggregates 662,000+ articles from 200+ sources with AI-powered sentiment analysis in 42 languages, event classification, and trend detection. The news API is free and public at cryptocurrency.cv/api/news — no auth required.",
    category: "tools",
  },
  {
    question: "What is ERC-8004?",
    answer:
      "ERC-8004 is a proposed Ethereum standard for AI agent trust verification. It defines on-chain registries for agent Identity, Reputation, and Validation. The standard is deployed live on Ethereum mainnet with contracts at 0x8004...A169 (Identity Registry), 0x8004...B267 (Reputation Registry), and 0x8004...C365 (Validation Registry). The toolkit includes a reference implementation, Solidity contracts, verifier tools, and an attestation framework.",
    category: "technical",
  },
  {
    question: "What is W3AG?",
    answer:
      "W3AG (Web3 Accessibility Guidelines) is a specification for making Web3 applications accessible to all users, including those with disabilities. It extends traditional WCAG with 50+ success criteria across 3 conformance levels (A, AA, AAA) covering wallet connection flows, transaction confirmation UIs, gas estimation displays, blockchain error messaging, and more. The toolkit includes a W3AG compliance checker and pre-built React components.",
    category: "technical",
  },
  {
    question: "What are x402 payments?",
    answer:
      "x402 is a payment protocol integrated in both universal-crypto-mcp and agenti MCP servers. It enables AI agents to make micropayments for premium API access, compute resources, or data feeds using HTTP 402 Payment Required responses. This allows autonomous agent-to-agent commerce — an AI can pay for services it needs during execution without human intervention.",
    category: "technical",
  },
  {
    question: "Is this project open source?",
    answer:
      "Yes, fully open source under the MIT License. You can use, modify, and distribute any part — agent definitions, MCP servers, market data tools, DeFi utilities, wallet tools, and standards — freely and without restriction. The source is at github.com/nirholas/bnb-chain-toolkit. Agent definitions are translated into 30+ languages in the locales/ directory.",
    category: "general",
  },
  {
    question: "How do I contribute?",
    answer:
      "Contributions are welcome: submitting PRs with new agents or tools, reporting bugs via Issues, suggesting features in Discussions, improving documentation, adding translations to the 30+ existing locales, or starring the repo. Use gitmoji for commit messages. Current high-priority areas: expanding agent definitions (78 → 100+), adding MCP server tests, ucai Pro templates (Flash Loans, MEV Bundles), and Solana tool coverage in agenti.",
    category: "contributing",
  },
  {
    question: "How do I report bugs?",
    answer:
      "Open an issue at github.com/nirholas/bnb-chain-toolkit/issues. Include: clear description, reproduction steps, expected vs actual behavior, environment details (OS, Node.js/Bun version, AI client). Screenshots or logs are helpful. Every issue receives a response. For security vulnerabilities, follow the SECURITY.md responsible disclosure process instead.",
    category: "contributing",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const inner = (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200 bg-white dark:bg-black",
        isOpen
          ? "border-transparent"
          : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-medium pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-[#F0B90B]"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isOpen) {
    return (
      <BackgroundGradient className="rounded-2xl" containerClassName="rounded-2xl">
        {inner}
      </BackgroundGradient>
    );
  }

  return inner;
}

export default function FAQPage() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useSEO({
    title: "FAQ",
    description:
      "Frequently asked questions about BNB Chain AI Toolkit — 78 agents, 6 MCP servers, 1,100+ tools, ERC-8004, W3AG, and how to contribute.",
    path: "/faq",
  });

  const filtered = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = activeCategory === "all" || faq.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <TypewriterEffect words={heroWords} />
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('faq.hero_subtitle')}
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('faq.search_placeholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
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

      {/* Category tabs */}
      <section className="px-6 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            {faqCategories.map((cat) => {
              const count = cat.id === "all" ? faqs.length : faqs.filter((f) => f.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    activeCategory === cat.id
                      ? "bg-[#F0B90B] text-black"
                      : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                  )}
                >
                  {cat.icon}
                  {cat.label}
                  <span className="ml-1 text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No questions match your search.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="mt-4 text-[#F0B90B] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  item={faq}
                  isOpen={openIndex === index}
                  onToggle={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still need help — BackgroundBeams + MovingBorder */}
      <section className="relative py-20 px-6 overflow-hidden">
        <BackgroundBeams />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Shield className="w-10 h-10 mx-auto mb-6 text-[#F0B90B]" />
          <h2 className="text-3xl font-bold mb-4">{t('faq.still_questions')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            {t('faq.still_questions_desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MovingBorder
              as="a"
              duration={3}
              containerClassName="h-12"
              className="bg-[#F0B90B] text-black font-semibold"
              {...{ href: "https://github.com/nirholas/bnb-chain-toolkit/discussions", target: "_blank", rel: "noopener noreferrer" } as Record<string, string>}
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
