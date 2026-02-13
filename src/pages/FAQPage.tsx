/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Excellence is a habit, not an act 🌟
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
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
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqCategories = [
  { id: "all", label: "All", icon: <HelpCircle className="w-4 h-4" /> },
  { id: "general", label: "General", icon: <HelpCircle className="w-4 h-4" /> },
  { id: "technical", label: "Technical", icon: <Code2 className="w-4 h-4" /> },
  { id: "mcp", label: "MCP Servers", icon: <Server className="w-4 h-4" /> },
  { id: "agents", label: "AI Agents", icon: <Bot className="w-4 h-4" /> },
  { id: "contributing", label: "Contributing", icon: <Users className="w-4 h-4" /> },
];

const faqs: FAQItem[] = [
  {
    question: "What is BNB Chain AI Toolkit?",
    answer:
      "BNB Chain AI Toolkit is an open-source collection of 72+ AI agent definitions, 6 Model Context Protocol (MCP) servers, and 900+ composable tools designed for the BNB Chain ecosystem and 60+ other blockchain networks. It enables AI assistants like Claude, GPT, and Gemini to interact with DeFi protocols, manage wallets, analyze market data, and execute on-chain operations out of the box.",
    category: "general",
  },
  {
    question: "What is MCP (Model Context Protocol)?",
    answer:
      "Model Context Protocol (MCP) is an open standard created by Anthropic that allows AI assistants to securely connect to external data sources and tools. MCP servers expose structured capabilities — like reading blockchain data, executing swaps, or querying market prices — that AI models can call without custom integrations. Think of it as a universal plugin system for AI.",
    category: "general",
  },
  {
    question: "How do I connect an MCP server to Claude?",
    answer:
      "To connect an MCP server to Claude Desktop, add the server configuration to your Claude Desktop config file (usually at ~/Library/Application Support/Claude/claude_desktop_config.json on macOS). Each MCP server in the toolkit includes a ready-to-use configuration snippet in its README. You provide the server command, set any required API keys as environment variables, and restart Claude Desktop. The new tools will automatically appear in your conversation.",
    category: "mcp",
  },
  {
    question: "What AI agents are included?",
    answer:
      "The toolkit includes 72+ agent definitions split into two categories: 30 BNB Chain-specific agents covering protocols like PancakeSwap, Venus Protocol, Lista DAO, Thena, Alpaca Finance, and BNB Staking — plus 42 general DeFi agents for cross-protocol operations like trading, lending, bridging, wallet management, and market analysis. Each agent is a portable JSON definition that can be imported into any compatible AI framework.",
    category: "agents",
  },
  {
    question: "Which blockchains are supported?",
    answer:
      "The primary focus is on BNB Smart Chain (BSC), opBNB, and BNB Greenfield. However, the universal-crypto-mcp server supports 60+ blockchain networks including Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, Fantom, Solana, and more. The agenti server also provides EVM and Solana support for advanced agent operations.",
    category: "technical",
  },
  {
    question: "Is this project open source?",
    answer:
      "Yes, BNB Chain AI Toolkit is fully open source under the MIT License. You can use, modify, and distribute any part of the toolkit — agent definitions, MCP servers, market data tools, DeFi utilities, and wallet tools — freely and without restriction. The entire source code is available on GitHub at github.com/nirholas/bnb-chain-toolkit.",
    category: "general",
  },
  {
    question: "How do I contribute?",
    answer:
      "Contributions are welcome in many forms: submitting pull requests with new agents or tools, reporting bugs via GitHub Issues, suggesting features in GitHub Discussions, improving documentation, adding translations, or simply starring the repository. Read the CONTRIBUTING.md file in the repo root for detailed guidelines on code style, commit conventions (gitmoji), and the review process.",
    category: "contributing",
  },
  {
    question: "What is ERC-8004?",
    answer:
      "ERC-8004 is a proposed Ethereum standard for AI agent trust verification. It defines a framework for verifying the identity, capabilities, and trustworthiness of on-chain AI agents through metadata schemas and attestation mechanisms. The BNB Chain AI Toolkit includes a reference implementation and verifier tool for this standard, which is currently in the community review phase.",
    category: "technical",
  },
  {
    question: "What is W3AG?",
    answer:
      "W3AG (Web3 Accessibility Guidelines) is a specification for making Web3 applications accessible to all users, including those with disabilities. It extends traditional web accessibility guidelines (WCAG) with Web3-specific requirements like wallet connection flows, transaction confirmation UIs, gas estimation displays, and blockchain error messaging. The toolkit includes a W3AG compliance checker tool.",
    category: "technical",
  },
  {
    question: "How do I report bugs?",
    answer:
      "Open an issue on the GitHub repository at github.com/nirholas/bnb-chain-toolkit/issues. Include a clear description of the problem, steps to reproduce it, the expected behavior, and your environment details (OS, Node.js version, AI client). Screenshots or logs are especially helpful. The maintainers respond to every issue and prioritize based on impact.",
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
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        isOpen
          ? "border-[#F0B90B]/30 dark:border-[#F0B90B]/20"
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
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useSEO({
    title: "FAQ",
    description:
      "Frequently asked questions about BNB Chain AI Toolkit — MCP servers, AI agents, ERC-8004, W3AG, and how to contribute.",
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Answers to common questions about the toolkit, MCP servers, AI
            agents, and contributing.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
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
            {faqCategories.map((cat) => (
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
              </button>
            ))}
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

      {/* Still need help */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="w-10 h-10 mx-auto mb-6 text-[#F0B90B]" />
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Open an issue on GitHub or start a discussion. We respond to every
            question.
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
