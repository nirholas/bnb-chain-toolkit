/**
 * Tool Catalog Page — /tools
 * ═══════════════════════════════════════════════════
 * Showcases all 9 standalone tools with InfiniteMovingCards
 * marquee for featured tools, HoverEffect category grids,
 * search bar, and a SparklesCore CTA.
 *
 * @author nich (@nichxbt)
 * @license MIT
 * @preserve
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  Newspaper,
  Sparkles as SparklesIcon,
  KeyRound,
  PenTool,
  Globe,
  ShieldCheck,
  CheckCircle,
  Package,
  ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Spotlight,
  TextGenerateEffect,
  InfiniteMovingCards,
  HoverEffect,
  SparklesCore,
} from '@/components/ui';
import {
  toolCategories,
  getFeaturedTools,
  getToolsByCategory,
} from '@/data/mcpServers';
import type { ToolEntry } from '@/data/mcpServers';
import { useSEO } from '@/hooks/useSEO';

const GITHUB_BASE = 'https://github.com/nirholas/bnb-chain-toolkit/tree/main/';

/** Map lucide icon name strings to actual components */
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Newspaper,
  Sparkles: SparklesIcon,
  KeyRound,
  PenTool,
  Globe,
  ShieldCheck,
  CheckCircle,
  Package,
};

/** Category header icons */
const categoryIcons: Record<string, LucideIcon> = {
  'Market Data': TrendingUp,
  'DeFi Tools': SparklesIcon,
  Wallets: KeyRound,
  Standards: ShieldCheck,
  Packages: Package,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Package;
}

/** Convert ToolEntry[] → InfiniteMovingCards item format */
function toMarqueeItems(tools: ToolEntry[]) {
  return tools.map((t) => ({
    quote: t.description,
    name: t.name,
    title: t.category,
    icon: (() => {
      const Icon = getIcon(t.icon);
      return <Icon className="h-4 w-4 text-[#F0B90B]" />;
    })(),
  }));
}

/** Convert ToolEntry[] → HoverEffect item format */
function toHoverItems(tools: ToolEntry[]) {
  return tools.map((t) => ({
    title: t.name,
    description: t.description,
    link: `${GITHUB_BASE}${t.repoPath}`,
  }));
}

export default function ToolCatalogPage() {
  useSEO({
    title: 'Tool Catalog',
    description:
      '1,100+ tools for BNB Chain and multiple blockchain networks — market data, DeFi, wallets, standards, and more.',
    path: '/tools',
  });

  const [search, setSearch] = useState('');
  const featured = useMemo(() => getFeaturedTools(), []);
  const marqueeRow1 = useMemo(
    () => toMarqueeItems(featured.slice(0, Math.ceil(featured.length / 2))),
    [featured],
  );
  const marqueeRow2 = useMemo(
    () => toMarqueeItems(featured.slice(Math.ceil(featured.length / 2))),
    [featured],
  );

  /** Filtered tools per category based on search */
  const filteredCategories = useMemo(() => {
    const lc = search.toLowerCase().trim();
    return toolCategories
      .map((cat) => {
        const tools = getToolsByCategory(cat).filter(
          (t) =>
            !lc ||
            t.name.toLowerCase().includes(lc) ||
            t.description.toLowerCase().includes(lc) ||
            t.category.toLowerCase().includes(lc),
        );
        return { category: cat, tools };
      })
      .filter((c) => c.tools.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#F0B90B]">1,100+</span> Tools
          </motion.h1>
          <div className="mx-auto mt-4 max-w-2xl">
            <TextGenerateEffect
              words="Market data, DeFi utilities, wallets, standards, and packages — everything you need to build with BNB Chain."
              className="text-lg text-gray-600 dark:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Featured marquee */}
      <section className="pb-12">
        <div className="space-y-4 overflow-hidden">
          <InfiniteMovingCards
            items={marqueeRow1}
            direction="left"
            speed="slow"
          />
          <InfiniteMovingCards
            items={marqueeRow2}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-2xl px-4 pb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a]/50 py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#F0B90B] focus:outline-none focus:ring-1 focus:ring-[#F0B90B]"
          />
        </div>
      </section>

      {/* Category sections */}
      <section className="mx-auto max-w-6xl px-4 pb-16 space-y-16">
        {filteredCategories.map(({ category, tools }) => {
          const CatIcon = categoryIcons[category] ?? Package;
          return (
            <div key={category}>
              <div className="mb-4 flex items-center gap-2">
                <CatIcon className="h-5 w-5 text-[#F0B90B]" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {category}
                </h2>
                <span className="rounded-full bg-[#F0B90B]/10 px-2 py-0.5 text-xs font-semibold text-[#F0B90B]">
                  {tools.length}
                </span>
              </div>

              <HoverEffect items={toHoverItems(tools)} />

              {/* Detail badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {tools.map((t) => (
                  <a
                    key={t.id}
                    href={`${GITHUB_BASE}${t.repoPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0a]/40 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 transition-colors hover:border-[#F0B90B] hover:text-[#F0B90B]"
                  >
                    {t.detail}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <p className="py-16 text-center text-gray-500 dark:text-gray-400">
            No tools match &ldquo;{search}&rdquo;.
          </p>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="relative mx-auto max-w-4xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a]/50 py-16 text-center">
          <div className="absolute inset-0">
            <SparklesCore
              id="tools-cta-sparkles"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={40}
              particleColor="#F0B90B"
              speed={0.4}
              className="h-full w-full"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ready to Build?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Start with any MCP server or tool — add it to Claude Desktop in
              under 60 seconds.
            </p>
            <a
              href="/mcp"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#F0B90B] px-6 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              Browse MCP Servers
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
