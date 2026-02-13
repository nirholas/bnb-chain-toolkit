/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - MCP Servers Explorer (Browse Page)
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit | 🌐 https://bnbchaintoolkit.com
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  ArrowRight,
  Copy,
  Check,
  Server,
  Code2,
  Globe,
  Layers,
  Terminal,
  MessageSquare,
  MousePointerClick,
  Compass,
  Wrench,
  Users,
} from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Spotlight,
  TextGenerateEffect,
  BackgroundGradient,
  SparklesCore,
  MovingBorder,
} from '@/components/ui';
import { mcpServers, allServersConfig } from '@/data/mcpServers';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';

const GITHUB_BASE = 'https://github.com/nirholas/bnb-chain-toolkit/tree/main/';

/* ── Stat items ──────────────────────────────────────────────────────── */
const stats = [
  { label: 'Total Tools', value: '900+', icon: Server },
  { label: 'Servers', value: '6', icon: Layers },
  { label: 'Networks', value: '60+', icon: Globe },
  { label: 'Languages', value: '2', icon: Code2 },
];

/* ── Tab definitions ─────────────────────────────────────────────────── */
type ConfigTab = 'claude' | 'cursor' | 'chatgpt';

interface TabDef {
  id: ConfigTab;
  label: string;
  icon: typeof Terminal;
  filename: string;
}

const tabs: TabDef[] = [
  { id: 'claude', label: 'Claude Desktop', icon: Terminal, filename: 'claude_desktop_config.json' },
  { id: 'cursor', label: 'Cursor', icon: MousePointerClick, filename: '.cursor/mcp.json' },
  { id: 'chatgpt', label: 'ChatGPT', icon: MessageSquare, filename: 'instructions.md' },
];

/**
 * Cursor uses the same mcpServers format as Claude Desktop.
 * File location: .cursor/mcp.json (project-level) or ~/.cursor/mcp.json (global)
 */
const cursorConfig = allServersConfig;

/**
 * ChatGPT does not support MCP. This text is honest about that.
 * We still show the Claude config so users have it handy.
 */
const chatgptText = `ChatGPT does not support the Model Context Protocol (MCP).

To use these 900+ tools, use an MCP-compatible client:
• Claude Desktop — paste the config from the Claude tab
• Cursor — paste into .cursor/mcp.json
• Any MCP-compatible client (see modelcontextprotocol.io)

If you want to use these tools via the OpenAI API, each MCP
server can also run as a standalone HTTP/SSE server. See the
individual server READMEs for SSE setup instructions.

Claude Desktop config for reference:

${allServersConfig}`;

/* ── Hook: copy-to-clipboard with confirmation ───────────────────────── */
function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), timeout);
    },
    [timeout],
  );

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { copied, copy };
}

/* ── Tab content map ─────────────────────────────────────────────────── */
function getTabContent(tab: ConfigTab): string {
  switch (tab) {
    case 'claude':
      return allServersConfig;
    case 'cursor':
      return cursorConfig;
    case 'chatgpt':
      return chatgptText;
  }
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  COMPONENT                                                            */
/* ══════════════════════════════════════════════════════════════════════ */

export default function MCPServersPage() {
  useSEO({
    title: 'MCP Servers — 6 Servers, 900+ Tools',
    description:
      'Explore 6 MCP Servers with 900+ tools for BNB Chain, Binance, and 60+ blockchain networks. Compare, copy config, and start building.',
    path: '/mcp',
  });

  const [activeTab, setActiveTab] = useState<ConfigTab>('claude');
  const configCopy = useCopyToClipboard();
  const ctaCopy = useCopyToClipboard();
  const tabListRef = useRef<HTMLDivElement>(null);

  /** Keyboard navigation for tabs (arrow keys + enter/space) */
  const handleTabKeyDown = (e: React.KeyboardEvent, tabId: ConfigTab) => {
    const tabIds = tabs.map((t) => t.id);
    const idx = tabIds.indexOf(tabId);

    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = (idx + 1) % tabIds.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = (idx - 1 + tabIds.length) % tabIds.length;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tabId);
      return;
    }

    if (nextIdx !== null) {
      setActiveTab(tabIds[nextIdx]);
      const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIdx]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* ── 1. Hero Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            6 MCP Servers,{' '}
            <span className="text-[#F0B90B]">900+ Tools</span>
          </motion.h1>

          <div className="mx-auto mt-6 max-w-2xl">
            <TextGenerateEffect
              words="The most comprehensive AI-blockchain toolkit — trade, bridge, stake, and deploy across 60+ networks through natural language."
              className="text-lg text-gray-600 dark:text-gray-400"
            />
          </div>

          {/* Animated stat counters */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              >
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-[#F0B90B]" aria-hidden="true" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Quick Config Copier — 3 Tabs ─────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quick Config — Copy &amp; Go
          </h2>

          {/* Tab bar */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="MCP config format"
            className="flex gap-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                )}
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                activeTab === tab.id && (
                  <motion.div
                    key={tab.id}
                    role="tabpanel"
                    id={`tabpanel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-1"
                  >
                    <div className="flex items-center justify-between rounded-t-lg bg-gray-100 dark:bg-gray-800/60 px-4 py-2">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {tab.filename}
                      </span>
                      <button
                        onClick={() => configCopy.copy(getTabContent(tab.id))}
                        className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label={`Copy ${tab.label} config`}
                      >
                        {configCopy.copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      {getTabContent(tab.id)}
                    </pre>
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── 3. Server Comparison Grid ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <motion.h2
          className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          All Servers
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mcpServers.map((server, idx) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <BackgroundGradient className="rounded-2xl bg-white dark:bg-zinc-900 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {server.name}
                  </h3>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      server.language === 'Python'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                    )}
                  >
                    {server.language}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {server.description}
                </p>

                {/* Tool count with sparkles */}
                <div className="relative mt-4 flex items-baseline gap-2">
                  <div className="relative">
                    <span className="relative z-10 text-3xl font-black text-[#F0B90B]">
                      {server.toolCount}
                    </span>
                    <div className="absolute inset-0 -inset-x-3 -inset-y-1">
                      <SparklesCore
                        id={`sparkle-${server.id}`}
                        background="transparent"
                        minSize={0.3}
                        maxSize={0.8}
                        particleDensity={80}
                        particleColor="#F0B90B"
                        speed={0.6}
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">tools</span>
                </div>

                {/* Highlights */}
                <ul className="mt-4 space-y-1">
                  {server.highlights.slice(1).map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#F0B90B]" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between">
                  <Link
                    to={`/mcp/${server.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#F0B90B] hover:underline"
                    aria-label={`View details for ${server.name}`}
                  >
                    View Details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <a
                    href={`${GITHUB_BASE}${server.repoPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={`${server.name} on GitHub`}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </BackgroundGradient>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. Side-by-Side Comparison Table ────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Server Comparison
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Server</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Language</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Tools</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Key Capabilities</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Networks</th>
                </tr>
              </thead>
              <tbody>
                {mcpServers.map((server, idx) => (
                  <tr
                    key={server.id}
                    className={cn(
                      'border-b border-gray-100 dark:border-gray-800/50 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/30',
                      idx % 2 === 1 && 'bg-gray-50/50 dark:bg-gray-900/20',
                    )}
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/mcp/${server.id}`}
                        className="font-medium text-[#F0B90B] hover:underline"
                      >
                        {server.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                          server.language === 'Python'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                        )}
                      >
                        {server.language}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      {server.toolCount}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {server.highlights.slice(1, 4).join(' · ')}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {server.chains ? server.chains.slice(0, 3).join(', ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* ── 5. "Add All Servers" CTA ────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <motion.div
          className="relative flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Particle background */}
          <div className="pointer-events-none absolute inset-0 -inset-x-8">
            <SparklesCore
              id="cta-sparkles"
              background="transparent"
              minSize={0.4}
              maxSize={1.2}
              particleDensity={40}
              particleColor="#F0B90B"
              speed={0.4}
              className="h-full w-full"
            />
          </div>

          <h2 className="relative z-10 mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Ready to start?
          </h2>
          <p className="relative z-10 mb-6 text-sm text-gray-500 dark:text-gray-400">
            Copy the unified config and paste into your Claude Desktop settings.
          </p>

          <MovingBorder
            borderRadius="1.5rem"
            className="border-[#F0B90B]/30 bg-white px-8 py-3 text-sm font-semibold text-gray-900 dark:bg-zinc-900 dark:text-white"
            onClick={() => ctaCopy.copy(allServersConfig)}
            aria-label="Copy unified config for all 6 MCP servers"
          >
            {ctaCopy.copied ? (
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                Copied to Clipboard!
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Copy className="h-4 w-4" aria-hidden="true" />
                Add All 6 Servers to Claude Desktop
              </span>
            )}
          </MovingBorder>
        </motion.div>
      </section>

      {/* ── 6. Footer Links ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="mb-6 text-center text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Explore Individual Servers
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mcpServers.map((server) => (
              <Link
                key={server.id}
                to={`/mcp/${server.id}`}
                className="group flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-4 py-3 transition-colors hover:border-[#F0B90B]/40 hover:bg-gray-100 dark:hover:bg-gray-900/60"
                aria-label={`Explore ${server.name}`}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {server.name}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#F0B90B]" aria-hidden="true" />
              </Link>
            ))}
          </div>

          {/* Extra nav links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#F0B90B]/40 hover:text-[#F0B90B] dark:text-gray-300"
              aria-label="Browse all 900+ tools"
            >
              <Wrench className="h-4 w-4" aria-hidden="true" />
              Browse All 900+ Tools
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#F0B90B]/40 hover:text-[#F0B90B] dark:text-gray-300"
              aria-label="View agent browser"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              View Agent Browser
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#F0B90B]/40 hover:text-[#F0B90B] dark:text-gray-300"
              aria-label="Explore all AI agents"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              Explore 72+ AI Agents
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
