/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 You're doing incredible things 🎯
 */

/**
 * Live Price Ticker Component
 * Scrolling marquee of real-time crypto prices with auto-refresh
 */

import React, { useId, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLivePrices } from '../hooks/useMarketData';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

// Expanded coin list for the scrolling ticker
const TICKER_COINS = [
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple',
  'cardano', 'avalanche-2', 'polkadot', 'chainlink', 'matic-network',
  'tron', 'litecoin', 'uniswap', 'stellar',
];

interface PriceTickerProps {
  coins?: string[];
  refreshInterval?: number;
  speed?: 'fast' | 'normal' | 'slow';
}

function formatPrice(price: number | undefined): string {
  if (price == null) return '$—';
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatMarketCap(cap: number | undefined): string {
  if (cap == null) return '$—';
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(1)}M`;
  return `$${cap.toLocaleString()}`;
}

const COIN_META: Record<string, { symbol: string; name: string; color: string }> = {
  bitcoin:        { symbol: '₿',    name: 'BTC',   color: 'text-orange-400' },
  ethereum:       { symbol: 'Ξ',    name: 'ETH',   color: 'text-purple-400' },
  binancecoin:    { symbol: 'BNB',  name: 'BNB',   color: 'text-yellow-400' },
  solana:         { symbol: '◎',    name: 'SOL',   color: 'text-cyan-400' },
  ripple:         { symbol: 'XRP',  name: 'XRP',   color: 'text-gray-300' },
  cardano:        { symbol: 'ADA',  name: 'ADA',   color: 'text-blue-400' },
  'avalanche-2':  { symbol: 'AVAX', name: 'AVAX',  color: 'text-red-400' },
  polkadot:       { symbol: 'DOT',  name: 'DOT',   color: 'text-pink-400' },
  chainlink:      { symbol: 'LINK', name: 'LINK',  color: 'text-blue-500' },
  'matic-network':{ symbol: 'POL',  name: 'POL',   color: 'text-purple-500' },
  tron:           { symbol: 'TRX',  name: 'TRX',   color: 'text-red-500' },
  litecoin:       { symbol: 'Ł',    name: 'LTC',   color: 'text-gray-400' },
  uniswap:        { symbol: 'UNI',  name: 'UNI',   color: 'text-pink-500' },
  stellar:        { symbol: 'XLM',  name: 'XLM',   color: 'text-blue-300' },
};

const SPEED_MAP: Record<string, string> = {
  fast: '30s',
  normal: '50s',
  slow: '80s',
};

export default function PriceTicker({
  coins = TICKER_COINS,
  refreshInterval = 30000,
  speed = 'normal',
}: PriceTickerProps) {
  const uid = useId();
  const animName = `priceTicker${uid.replace(/:/g, '')}`;
  const prefersReducedMotion = usePrefersReducedMotion();

  const { data, loading, error } = useLivePrices(coins, refreshInterval);

  // Build renderable items from fetched data
  const items = useMemo(() => {
    if (!data) return [];
    return coins
      .filter((coin) => data[coin])
      .map((coin) => ({
        id: coin,
        meta: COIN_META[coin] || { symbol: coin.charAt(0).toUpperCase(), name: coin.toUpperCase(), color: 'text-gray-400' },
        price: data[coin].usd,
        change: data[coin].usd_24h_change,
        marketCap: data[coin].usd_market_cap,
        volume: data[coin].usd_24h_vol,
      }));
  }, [data, coins]);

  // Duplicate for seamless loop
  const allItems = useMemo(() => [...items, ...items], [items]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center gap-6 py-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-8 h-4 bg-neutral-200 dark:bg-zinc-800 rounded" />
            <div className="w-16 h-4 bg-neutral-200 dark:bg-zinc-800 rounded" />
            <div className="w-10 h-3 bg-neutral-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data || items.length === 0) {
    return null;
  }

  return (
    <Link to="/markets" className="block">
      <div
        className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]"
      >
        <div
          className="flex w-max items-center gap-8 py-1 hover:[animation-play-state:paused]"
          style={
            !prefersReducedMotion
              ? { animation: `${animName} ${SPEED_MAP[speed]} linear infinite` }
              : undefined
          }
        >
          {allItems.map((item, idx) => {
            const change = item.change ?? 0;
            const isPositive = change >= 0;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-3 shrink-0 group/coin"
                aria-hidden={idx >= items.length ? 'true' : undefined}
              >
                {/* Symbol badge */}
                <span className={`text-sm font-bold ${item.meta.color}`}>
                  {item.meta.symbol}
                </span>

                {/* Name */}
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  {item.meta.name}
                </span>

                {/* Price */}
                <span className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                  {formatPrice(item.price)}
                </span>

                {/* 24h change */}
                <span
                  className={`text-xs font-medium tabular-nums px-1.5 py-0.5 rounded ${
                    isPositive
                      ? 'text-green-600 dark:text-green-400 bg-green-500/10'
                      : 'text-red-600 dark:text-red-400 bg-red-500/10'
                  }`}
                >
                  {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                </span>

                {/* Market cap — hidden on small screens */}
                <span className="hidden md:inline text-[11px] text-neutral-400 dark:text-neutral-500 tabular-nums">
                  MCap {formatMarketCap(item.marketCap)}
                </span>

                {/* Separator dot */}
                <span className="text-neutral-300 dark:text-neutral-700 text-xs" aria-hidden="true">•</span>
              </div>
            );
          })}
        </div>

        {/* Scoped keyframes */}
        <style>{`
          @keyframes ${animName} {
            from { transform: translateX(0); }
            to   { transform: translateX(calc(-50% - 1rem)); }
          }
        `}</style>
      </div>
    </Link>
  );
}

// Mini version for mobile/compact displays
export function MiniPriceTicker() {
  const { data, loading } = useLivePrices(['bitcoin', 'ethereum', 'binancecoin'], 30000);

  if (loading || !data) return null;

  const coins = [
    { id: 'bitcoin', ...COIN_META.bitcoin },
    { id: 'ethereum', ...COIN_META.ethereum },
    { id: 'binancecoin', ...COIN_META.binancecoin },
  ];

  return (
    <Link to="/markets" className="flex items-center gap-3 text-xs">
      {coins.map((coin) => {
        const d = data[coin.id];
        if (!d) return null;
        const isPositive = d.usd_24h_change >= 0;
        return (
          <span key={coin.id} className="flex items-center gap-1">
            <span className={coin.color}>{coin.symbol}</span>
            <span className="text-neutral-900 dark:text-white font-medium tabular-nums">{formatPrice(d.usd)}</span>
            <span className={`${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '▲' : '▼'}
            </span>
          </span>
        );
      })}
    </Link>
  );
}
