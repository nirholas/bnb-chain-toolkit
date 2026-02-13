/**
 * MCP Server Detail Page — /mcp/:serverId
 * ═══════════════════════════════════════════════════
 * Individual server page with Spotlight hero, BentoGrid tool
 * categories, LampContainer install section, and 3D feature cards.
 *
 * @author nich (@nichxbt)
 * @license MIT
 * @preserve
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, ExternalLink, Code2, Globe, Cpu } from 'lucide-react';
import { useState } from 'react';
import {
  Spotlight,
  TextGenerateEffect,
  SparklesCore,
  BentoGrid,
  BentoGridItem,
  LampContainer,
  CardContainer,
  CardBody,
  CardItem,
} from '@/components/ui';
import { getServerById } from '@/data/mcpServers';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';

const GITHUB_BASE = 'https://github.com/nirholas/bnb-chain-toolkit/tree/main/';

export default function MCPServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const server = serverId ? getServerById(serverId) : undefined;

  useSEO({
    title: server ? server.name : 'Server Not Found',
    description: server?.description ?? 'MCP Server not found.',
    path: `/mcp/${serverId ?? ''}`,
  });

  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  // ── 404 ──────────────────────────────────────────────────────────────
  if (!server) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Server Not Found
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          No MCP server matches &ldquo;{serverId}&rdquo;.
        </p>
        <Link
          to="/mcp"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#F0B90B] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all servers
        </Link>
      </div>
    );
  }

  // ── Stats row items ──────────────────────────────────────────────────
  const statItems = [
    { label: 'Tools', value: server.toolCount, icon: Cpu },
    { label: 'Language', value: server.language, icon: Code2 },
    ...(server.chains
      ? [{ label: 'Chains', value: `${server.chains.length}+`, icon: Globe }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/mcp"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#F0B90B] dark:text-gray-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Servers
            </Link>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {server.name}
          </motion.h1>

          <div className="mx-auto mt-4 max-w-2xl">
            <TextGenerateEffect
              words={server.longDescription}
              className="text-base text-gray-600 dark:text-gray-400"
              duration={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <div className={cn('grid gap-4', statItems.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
          {statItems.map((s) => (
            <div
              key={s.label}
              className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a]/50 p-5 text-center"
            >
              <s.icon className="mx-auto mb-2 h-5 w-5 text-[#F0B90B]" />
              {s.label === 'Tools' ? (
                <div className="relative inline-block">
                  <span className="relative z-10 text-2xl font-bold text-gray-900 dark:text-white">
                    {s.value}
                  </span>
                  <div className="absolute inset-0 -inset-x-4 -inset-y-1">
                    <SparklesCore
                      id={`detail-sparkle-${server.id}`}
                      background="transparent"
                      minSize={0.3}
                      maxSize={0.7}
                      particleDensity={60}
                      particleColor="#F0B90B"
                      speed={0.5}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool categories — BentoGrid */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Tool Categories
        </h2>
        <BentoGrid className="md:grid-cols-3">
          {server.toolCategories.map((cat, idx) => (
            <BentoGridItem
              key={cat.name}
              className={cn(idx === 0 && 'md:col-span-2')}
              title={
                <span className="flex items-center gap-2">
                  {cat.name}
                  <span className="rounded-full bg-[#F0B90B]/10 px-2 py-0.5 text-xs font-semibold text-[#F0B90B]">
                    {cat.count}
                  </span>
                </span>
              }
              description={
                <ul className="mt-2 space-y-1">
                  {cat.tools.map((tool) => (
                    <li
                      key={tool}
                      className="font-mono text-xs text-gray-500 dark:text-gray-400"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              }
            />
          ))}
        </BentoGrid>
      </section>

      {/* Install section — LampContainer */}
      <section className="pb-16">
        <LampContainer>
          <div className="mx-auto max-w-2xl space-y-6 px-4">
            <h2 className="text-center text-2xl font-bold text-white">
              Get Started
            </h2>

            {/* Install command */}
            <div className="rounded-lg border border-gray-700 bg-black p-1">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-xs text-gray-400">Install</span>
                <button
                  onClick={() => copyText(server.installCommand, setCopiedInstall)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200"
                  aria-label="Copy install command"
                >
                  {copiedInstall ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto px-3 pb-3 font-mono text-sm text-green-400">
                $ {server.installCommand}
              </pre>
            </div>

            {/* Config snippet */}
            <div className="rounded-lg border border-gray-700 bg-black p-1">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-xs text-gray-400">
                  claude_desktop_config.json
                </span>
                <button
                  onClick={() => copyText(server.configSnippet, setCopiedConfig)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200"
                  aria-label="Copy config"
                >
                  {copiedConfig ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto px-3 pb-3 font-mono text-xs leading-relaxed text-gray-300">
                {server.configSnippet}
              </pre>
            </div>

            {server.npmPackage && (
              <p className="text-center text-xs text-gray-400">
                npm:{' '}
                <code className="rounded bg-[#0a0a0a] px-1.5 py-0.5 text-[#F0B90B]">
                  {server.npmPackage}
                </code>
              </p>
            )}
          </div>
        </LampContainer>
      </section>

      {/* Features — 3D cards */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Features
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {server.features.map((feature) => (
            <CardContainer key={feature} className="w-full">
              <CardBody className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 p-5 h-auto">
                <CardItem translateZ={30} className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* Chains */}
      {server.chains && server.chains.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Supported Chains
          </h2>
          <div className="flex flex-wrap gap-2">
            {server.chains.map((chain) => (
              <span
                key={chain}
                className="rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0a]/50 px-3 py-1 text-xs text-gray-600 dark:text-gray-400"
              >
                {chain}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Footer links */}
      <section className="mx-auto flex max-w-5xl items-center justify-between px-4 pb-24">
        <Link
          to="/mcp"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F0B90B] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all servers
        </Link>
        <a
          href={`${GITHUB_BASE}${server.repoPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          View on GitHub <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>
    </div>
  );
}
