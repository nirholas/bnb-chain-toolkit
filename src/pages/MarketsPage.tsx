/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every line of code is a step toward something amazing ✨
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';
import {
  useTopCoins,
  useTrending,
  useGlobalMarketData,
  useTopProtocols,
  useTopChains,
  useTopYields,
  useLivePrices,
} from '../hooks/useMarketData';
import {
  Spotlight,
  TextGenerateEffect,
  SparklesCore,
  BackgroundGradient,
  MovingBorder,
  InfiniteMovingCards,
  BentoGrid,
  CardContainer,
  CardBody,
  CardItem,
} from '@/components/ui';
import type { InfiniteMovingCardItem } from '@/components/ui';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'N/A';
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

// ============================================================
// PRICE CHANGE COMPONENT
// ============================================================

function PriceChange({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined)
    return <span className="text-gray-400 dark:text-gray-500">N/A</span>;
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
      {formatPercent(value)}
    </span>
  );
}

// ============================================================
// SPARKLINE COMPONENT
// ============================================================

function Sparkline({ data }: { data?: number[] }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 120;
  const height = 40;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const isPositive = data[data.length - 1] >= data[0];
  const lineColor = isPositive ? '#F0B90B' : '#ef4444';

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================
// METRIC CARD (Global Stats)
// ============================================================

interface MetricCardProps {
  label: string;
  value: string;
  change?: number | null;
  icon?: React.ReactNode;
  highlight?: boolean;
}

function MetricCard({ label, value, change, icon, highlight }: MetricCardProps) {
  const inner = (
    <div
      className={cn(
        'rounded-[22px] p-5 h-full',
        'bg-white dark:bg-zinc-900'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
      {highlight ? (
        <MovingBorder
          as="div"
          duration={3}
          containerClassName="w-full h-auto rounded-xl"
          className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800"
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        </MovingBorder>
      ) : (
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      )}
      {change !== undefined && change !== null && (
        <div className="mt-2">
          <PriceChange value={change} />
        </div>
      )}
    </div>
  );

  return (
    <BackgroundGradient className="rounded-[22px]" containerClassName="rounded-[22px] h-full">
      {inner}
    </BackgroundGradient>
  );
}

// ============================================================
// PROTOCOL CARD (DeFi tab)
// ============================================================

interface ProtocolCardProps {
  protocol: {
    id: string;
    name: string;
    logo: string;
    category: string;
    tvl: number;
    change_1d: number;
    change_7d: number;
    chains?: string[];
  };
  index: number;
}

function ProtocolCard({ protocol, index }: ProtocolCardProps) {
  return (
    <BackgroundGradient className="rounded-[22px]" containerClassName="rounded-[22px] h-full">
      <div className="rounded-[22px] p-5 h-full bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums">
            #{index + 1}
          </span>
          {protocol.logo && (
            <img src={protocol.logo} alt={protocol.name} className="w-8 h-8 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white truncate">{protocol.name}</div>
            {protocol.category && (
              <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[#F0B90B]/10 text-[#F0B90B] font-medium mt-0.5">
                {protocol.category}
              </span>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-[#F0B90B] mb-3">{formatNumber(protocol.tvl)}</div>
        <div className="flex items-center gap-4 text-sm mb-3">
          <div>
            <span className="text-gray-500 dark:text-gray-400 mr-1">1d:</span>
            <PriceChange value={protocol.change_1d} />
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 mr-1">7d:</span>
            <PriceChange value={protocol.change_7d} />
          </div>
        </div>
        {protocol.chains && protocol.chains.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {protocol.chains.slice(0, 3).map((chain) => (
              <span
                key={chain}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
              >
                {chain}
              </span>
            ))}
            {protocol.chains.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-500">
                +{protocol.chains.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </BackgroundGradient>
  );
}

// ============================================================
// YIELD CARD (Yields tab)
// ============================================================

interface YieldCardProps {
  pool: {
    pool: string;
    symbol: string;
    project: string;
    chain: string;
    apy: number;
    apyBase: number;
    apyReward: number;
    tvlUsd: number;
    stablecoin: boolean;
  };
}

function YieldCard({ pool }: YieldCardProps) {
  return (
    <CardContainer containerClassName="w-full" className="w-full">
      <CardBody className="w-full h-auto p-5 rounded-[22px] border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900">
        <CardItem translateZ={30} className="w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white truncate">{pool.symbol}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{pool.project}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                {pool.chain}
              </span>
              {pool.stablecoin && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-medium">
                  Stable
                </span>
              )}
            </div>
          </div>
        </CardItem>
        <CardItem translateZ={50} className="w-full">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {pool.apy?.toFixed(2)}%
          </div>
          {pool.apyBase !== undefined && pool.apyReward !== undefined && (pool.apyBase > 0 || pool.apyReward > 0) && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Base: {pool.apyBase.toFixed(2)}% + Reward: {pool.apyReward.toFixed(2)}%
            </div>
          )}
        </CardItem>
        <CardItem translateZ={20} className="w-full">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            TVL: <span className="font-medium text-gray-700 dark:text-gray-300">{formatNumber(pool.tvlUsd)}</span>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

// ============================================================
// CHAIN CARD (Chains tab)
// ============================================================

interface ChainCardProps {
  chain: {
    name: string;
    tvl: number;
    tokenSymbol: string;
  };
  index: number;
  totalTVL: number;
}

function ChainCard({ chain, index, totalTVL }: ChainCardProps) {
  const percentage = ((chain.tvl / totalTVL) * 100).toFixed(2);
  return (
    <BackgroundGradient className="rounded-[22px]" containerClassName="rounded-[22px] h-full">
      <div className="rounded-[22px] p-4 bg-white dark:bg-zinc-900 flex items-center gap-4">
        <span className="text-sm font-bold text-gray-400 dark:text-gray-500 tabular-nums w-8 text-center">
          #{index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 dark:text-white">{chain.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {chain.tokenSymbol || '\u2014'} \u2022 {percentage}% of total
          </div>
        </div>
        <div className="text-xl font-bold text-[#F0B90B] flex-shrink-0">
          {formatNumber(chain.tvl)}
        </div>
      </div>
    </BackgroundGradient>
  );
}

// ============================================================
// SKELETON CARDS
// ============================================================

function SkeletonMetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <BackgroundGradient key={i} className="rounded-[22px]" containerClassName="rounded-[22px]" animate={false}>
          <div className="rounded-[22px] p-5 bg-white dark:bg-zinc-900 animate-pulse">
            <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-700 rounded mb-3" />
            <div className="h-7 w-28 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 rounded" />
          </div>
        </BackgroundGradient>
      ))}
    </div>
  );
}

function SkeletonProtocolCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <BackgroundGradient key={i} className="rounded-[22px]" containerClassName="rounded-[22px]" animate={false}>
          <div className="rounded-[22px] p-5 bg-white dark:bg-zinc-900 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
            <div className="h-7 w-20 bg-gray-200 dark:bg-zinc-700 rounded mb-3" />
            <div className="flex gap-4">
              <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
          </div>
        </BackgroundGradient>
      ))}
    </div>
  );
}

function SkeletonYieldCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-[22px] p-5 border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="h-5 w-16 bg-gray-200 dark:bg-zinc-700 rounded-full" />
          </div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
          <div className="h-3 w-32 bg-gray-200 dark:bg-zinc-700 rounded" />
        </div>
      ))}
    </div>
  );
}

function SkeletonChainCards() {
  return (
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <BackgroundGradient key={i} className="rounded-[22px]" containerClassName="rounded-[22px]" animate={false}>
          <div className="rounded-[22px] p-4 bg-white dark:bg-zinc-900 flex items-center gap-4 animate-pulse">
            <div className="w-8 h-5 bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded mb-1" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded" />
          </div>
        </BackgroundGradient>
      ))}
    </div>
  );
}

// ============================================================
// ERROR STATE
// ============================================================

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex justify-center py-16">
      <BackgroundGradient className="rounded-[22px]" containerClassName="rounded-[22px]">
        <div className="rounded-[22px] p-8 bg-white dark:bg-zinc-900 text-center max-w-md">
          <div className="text-4xl mb-4">{'\u26A0\uFE0F'}</div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Something went wrong</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{message}</p>
          {onRetry && (
            <MovingBorder
              duration={3}
              containerClassName="rounded-full"
              className="px-6 py-2 rounded-full bg-gray-50 dark:bg-zinc-800"
              onClick={onRetry}
            >
              Retry
            </MovingBorder>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
}

// ============================================================
// TAB TYPES & DATA
// ============================================================

type Tab = 'markets' | 'defi' | 'yields' | 'chains';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'markets', label: 'Cryptocurrencies', icon: '\uD83E\uDE99' },
  { id: 'defi', label: 'DeFi Protocols', icon: '\uD83C\uDFE6' },
  { id: 'yields', label: 'Yields', icon: '\uD83D\uDCC8' },
  { id: 'chains', label: 'Chains', icon: '\u26D3\uFE0F' },
];

// ============================================================
// SECTION 1 — HERO
// ============================================================

function HeroSection() {
  const { data: globalData, loading } = useGlobalMarketData();

  return (
    <div className="relative overflow-hidden bg-white dark:bg-black py-16 md:py-24">
      {/* Spotlight effect */}
      <Spotlight className="z-0" />

      {/* SparklesCore background */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={1}
          particleDensity={40}
          particleColor="#F0B90B"
          speed={0.5}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <TextGenerateEffect
          words="Live Crypto Markets"
          className="text-4xl md:text-6xl font-bold mb-6"
          duration={0.4}
        />

        {!loading && globalData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">Market Cap:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatNumber(globalData.total_market_cap?.usd)}
              </span>
              <PriceChange value={globalData.market_cap_change_percentage_24h_usd} />
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-300 dark:bg-zinc-900" />
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">Active Coins:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {globalData.active_cryptocurrencies?.toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="flex justify-center gap-6 animate-pulse mt-4">
            <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-700 rounded" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 2 — GLOBAL STATS BAR
// ============================================================

function GlobalStatsSection() {
  const { data, loading } = useGlobalMarketData();
  const livePrices = useLivePrices(['bitcoin', 'ethereum'], 30000);

  if (loading || !data) {
    return (
      <div className="bg-gray-50 dark:bg-[#0a0a0a] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonMetricCards />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0a0a0a] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <BentoGrid className="md:grid-cols-4 md:auto-rows-auto gap-4">
          <MetricCard
            label="Total Market Cap"
            value={formatNumber(data.total_market_cap?.usd)}
            change={data.market_cap_change_percentage_24h_usd}
            icon={<span>{'\uD83D\uDCCA'}</span>}
          />
          <MetricCard
            label="24h Trading Volume"
            value={formatNumber(data.total_volume?.usd)}
            icon={<span>{'\uD83D\uDCC8'}</span>}
          />
          <MetricCard
            label="Bitcoin"
            value={formatPrice(livePrices.data?.bitcoin?.usd)}
            change={livePrices.data?.bitcoin?.usd_24h_change}
            icon={<span className="text-orange-500">{'\u20BF'}</span>}
            highlight
          />
          <MetricCard
            label="Ethereum"
            value={formatPrice(livePrices.data?.ethereum?.usd)}
            change={livePrices.data?.ethereum?.usd_24h_change}
            icon={<span className="text-purple-500">{'\u039E'}</span>}
            highlight
          />
        </BentoGrid>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 3 — TRENDING TOKENS MARQUEE
// ============================================================

function TrendingMarquee() {
  const { data: trending, loading } = useTrending();

  if (loading || !trending || trending.length === 0) return null;

  const half = Math.ceil(trending.length / 2);

  const row1Items: InfiniteMovingCardItem[] = trending.slice(0, half).map((coin) => ({
    quote: `Rank #${coin.market_cap_rank ?? '\u2014'}`,
    name: coin.name,
    title: coin.symbol.toUpperCase(),
    icon: (
      <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
    ),
  }));

  const row2Items: InfiniteMovingCardItem[] = trending.slice(half).map((coin) => ({
    quote: `Rank #${coin.market_cap_rank ?? '\u2014'}`,
    name: coin.name,
    title: coin.symbol.toUpperCase(),
    icon: (
      <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
    ),
  }));

  return (
    <div className="bg-white dark:bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          {'\uD83D\uDD25'} Trending
        </h3>
        <InfiniteMovingCards items={row1Items} direction="left" speed="normal" />
        {row2Items.length > 0 && (
          <InfiniteMovingCards items={row2Items} direction="right" speed="normal" />
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 5 — CRYPTOCURRENCIES TAB
// ============================================================

function MarketsTab() {
  const { data: coins, loading, error, refetch } = useTopCoins(50);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-gray-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <BackgroundGradient className="rounded-[22px]" containerClassName="rounded-[22px]">
      <div className="rounded-[22px] overflow-hidden bg-white dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/[0.08]">
                <th className="text-left text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider p-4">#</th>
                <th className="text-left text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider p-4">Coin</th>
                <th className="text-right text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider p-4">Price</th>
                <th className="text-right text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider p-4 hidden sm:table-cell">24h</th>
                <th className="text-right text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider p-4 hidden md:table-cell">Market Cap</th>
                <th className="text-right text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider p-4 hidden lg:table-cell">Volume (24h)</th>
                <th className="text-right text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider p-4 hidden xl:table-cell">7d Chart</th>
              </tr>
            </thead>
            <tbody>
              {coins?.map((coin, idx) => (
                <tr
                  key={coin.id}
                  className={cn(
                    'transition-colors',
                    'hover:bg-gray-50 dark:hover:bg-zinc-800/50',
                    idx % 2 === 0
                      ? 'bg-white dark:bg-zinc-900'
                      : 'bg-gray-50/50 dark:bg-zinc-900/50',
                    idx < (coins?.length ?? 0) - 1 && 'border-b border-gray-100 dark:border-white/[0.04]'
                  )}
                >
                  <td className="p-4 text-gray-400 dark:text-gray-500 tabular-nums">{coin.market_cap_rank}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {coin.image && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{coin.name}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-gray-900 dark:text-white tabular-nums">
                    {formatPrice(coin.current_price)}
                  </td>
                  <td className="p-4 text-right hidden sm:table-cell">
                    <PriceChange value={coin.price_change_percentage_24h} />
                  </td>
                  <td className="p-4 text-right text-gray-700 dark:text-gray-300 hidden md:table-cell tabular-nums">
                    {formatNumber(coin.market_cap)}
                  </td>
                  <td className="p-4 text-right text-gray-500 dark:text-gray-400 hidden lg:table-cell tabular-nums">
                    {formatNumber(coin.total_volume)}
                  </td>
                  <td className="p-4 text-right hidden xl:table-cell">
                    <Sparkline data={coin.sparkline_in_7d?.price} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BackgroundGradient>
  );
}

// ============================================================
// SECTION 6 — DEFI PROTOCOLS TAB
// ============================================================

function DefiTab() {
  const { data: protocols, loading, error, refetch } = useTopProtocols(30);

  if (loading) {
    return <SkeletonProtocolCards />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {protocols?.map((protocol, index) => (
        <ProtocolCard key={protocol.id} protocol={protocol} index={index} />
      ))}
    </div>
  );
}

// ============================================================
// SECTION 7 — YIELDS TAB
// ============================================================

function YieldsTab() {
  const { data: yields, loading, error, refetch } = useTopYields(30);
  const [filter, setFilter] = useState<'all' | 'stablecoin'>('all');

  if (loading) {
    return <SkeletonYieldCards />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  const filteredYields =
    filter === 'stablecoin' ? yields?.filter((y) => y.stablecoin) : yields;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-5 py-2.5 rounded-full text-sm font-medium transition-colors',
            filter === 'all'
              ? 'bg-[#F0B90B] text-black'
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          All Pools
        </button>
        <button
          onClick={() => setFilter('stablecoin')}
          className={cn(
            'px-5 py-2.5 rounded-full text-sm font-medium transition-colors',
            filter === 'stablecoin'
              ? 'bg-[#F0B90B] text-black'
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          Stablecoins Only
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredYields?.map((pool) => (
          <YieldCard key={pool.pool} pool={pool} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 8 — CHAINS TAB
// ============================================================

function ChainsTab() {
  const { data: chains, loading, error, refetch } = useTopChains(25);

  if (loading) {
    return <SkeletonChainCards />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  const totalTVL = chains?.reduce((sum, c) => sum + (c.tvl || 0), 0) || 1;

  const barColors = [
    'bg-[#F0B90B]',
    'bg-[#d4a20a]',
    'bg-[#b88e09]',
    'bg-[#F0B90B]/80',
    'bg-amber-500',
    'bg-amber-400',
    'bg-yellow-500',
    'bg-yellow-400',
    'bg-[#F0B90B]/60',
    'bg-amber-600',
  ];

  return (
    <div className="space-y-6">
      {/* TVL Distribution Bar Chart */}
      <BackgroundGradient className="rounded-[22px]" containerClassName="rounded-[22px]">
        <div className="rounded-[22px] p-6 bg-white dark:bg-zinc-900">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">TVL Distribution</h3>
          <div className="flex rounded-full h-5 overflow-hidden bg-gray-100 dark:bg-zinc-800">
            {chains?.slice(0, 10).map((chain, i) => {
              const percent = (chain.tvl / totalTVL) * 100;
              return (
                <div
                  key={chain.name}
                  className={cn(barColors[i], 'transition-all relative group/bar cursor-pointer')}
                  style={{ width: `${percent}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black dark:bg-white text-white dark:text-black text-xs font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {chain.name}: {percent.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {chains?.slice(0, 10).map((chain, i) => (
              <div key={chain.name} className="flex items-center gap-2 text-sm">
                <div className={cn('w-3 h-3 rounded-sm', barColors[i])} />
                <span className="text-gray-600 dark:text-gray-400">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </BackgroundGradient>

      {/* Chain Cards */}
      <div className="space-y-3">
        {chains?.map((chain, index) => (
          <ChainCard key={chain.name} chain={chain} index={index} totalTVL={totalTVL} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MarketsPage() {
  useSEO({
    title: 'Crypto Markets - Live Prices & DeFi Data',
    description:
      'Real-time cryptocurrency prices, DeFi protocol TVL, yield farming APY, and cross-chain analytics. Track Bitcoin, Ethereum, and 1000+ tokens.',
    path: '/markets',
  });

  const [activeTab, setActiveTab] = useState<Tab>('markets');

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Section 1 — Hero */}
      <HeroSection />

      {/* Section 2 — Global Stats */}
      <GlobalStatsSection />

      {/* Section 3 — Trending Marquee */}
      <TrendingMarquee />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Markets</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Live cryptocurrency and DeFi market data powered by{' '}
              <span className="text-[#F0B90B] font-medium">BNB Chain MCP</span>
            </p>
          </div>
          <Link
            to="/"
            className="text-[#F0B90B] hover:text-[#d4a20a] transition-colors font-medium"
          >
            {'\u2190'} Back to Home
          </Link>
        </div>

        {/* Section 4 — Tab System */}
        <div className="border-b border-gray-200 dark:border-white/[0.08] mb-8">
          <div className="flex overflow-x-auto gap-1 relative">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'text-[#F0B90B]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <span className="relative z-10">
                  {tab.icon} {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="market-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#F0B90B]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'markets' && <MarketsTab />}
            {activeTab === 'defi' && <DefiTab />}
            {activeTab === 'yields' && <YieldsTab />}
            {activeTab === 'chains' && <ChainsTab />}
          </motion.div>
        </AnimatePresence>

        {/* Section 9 — Data Attribution */}
        <div className="mt-16 flex justify-center">
          <BackgroundGradient className="rounded-[22px]" containerClassName="rounded-[22px]">
            <div className="rounded-[22px] px-8 py-6 bg-white dark:bg-zinc-900 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Market data from{' '}
                <a
                  href="https://www.coingecko.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F0B90B] hover:underline font-medium"
                >
                  CoinGecko
                </a>
                {' \u2022 '}
                DeFi data from{' '}
                <a
                  href="https://defillama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F0B90B] hover:underline font-medium"
                >
                  DeFiLlama
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Integrated via{' '}
                <span className="text-[#F0B90B] font-semibold">BNB Chain MCP Framework</span>
              </p>
            </div>
          </BackgroundGradient>
        </div>
      </div>
    </div>
  );
}
