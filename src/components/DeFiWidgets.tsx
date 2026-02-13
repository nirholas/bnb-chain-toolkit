/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 The best code comes from the heart ❤️
 */

/**
 * DeFi Dashboard Widget
 * Displays DeFi protocol TVL and yield information
 * Can be embedded in the playground or any page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useTopProtocols, 
  useTopYields, 
  useTopChains,
  useChainDeFi 
} from '../hooks/useMarketData';
import { ProtocolTVL, YieldPool, ChainTVL } from '../services/marketData';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatTVL(tvl: number | null | undefined): string {
  if (tvl === null || tvl === undefined) return 'N/A';
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
  if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(2)}K`;
  return `$${tvl.toFixed(2)}`;
}

// ============================================================
// PROTOCOL CARD
// ============================================================

function ProtocolCard({ protocol, rank }: { protocol: ProtocolTVL; rank: number }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-white/[0.03] rounded-lg hover:bg-neutral-200/70 dark:hover:bg-white/[0.06] transition-colors">
      <span className="text-neutral-400 dark:text-neutral-500 text-sm w-6">{rank}</span>
      {protocol.logo && (
        <img src={protocol.logo} alt={protocol.name} className="w-8 h-8 rounded-full" />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-neutral-900 dark:text-white font-medium truncate">{protocol.name}</div>
        <div className="text-neutral-500 dark:text-neutral-500 text-xs">{protocol.category || 'DeFi'}</div>
      </div>
      <div className="text-right">
        <div className="text-neutral-900 dark:text-white font-medium">{formatTVL(protocol.tvl)}</div>
        <div className={`text-xs ${(protocol.change_1d || 0) >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {(protocol.change_1d || 0) >= 0 ? '+' : ''}{(protocol.change_1d || 0).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

// ============================================================
// YIELD CARD
// ============================================================

function YieldCard({ pool }: { pool: YieldPool }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-white/[0.03] rounded-lg hover:bg-neutral-200/70 dark:hover:bg-white/[0.06] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-neutral-900 dark:text-white font-medium truncate">{pool.symbol}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-neutral-500 dark:text-neutral-500 text-xs">{pool.project}</span>
          <span className="bg-neutral-200 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 text-xs px-1.5 py-0.5 rounded">
            {pool.chain}
          </span>
          {pool.stablecoin && (
            <span className="bg-green-500/20 text-green-600 dark:text-green-400 text-xs px-1.5 py-0.5 rounded">
              Stable
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-green-500 dark:text-green-400 font-semibold text-lg">{pool.apy?.toFixed(2)}%</div>
        <div className="text-neutral-500 dark:text-neutral-500 text-xs">TVL: {formatTVL(pool.tvlUsd)}</div>
      </div>
    </div>
  );
}

// ============================================================
// CHAIN CARD
// ============================================================

function ChainCard({ chain, rank }: { chain: ChainTVL; rank: number }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-white/[0.03] rounded-lg hover:bg-neutral-200/70 dark:hover:bg-white/[0.06] transition-colors">
      <span className="text-neutral-400 dark:text-neutral-500 text-sm w-6">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="text-neutral-900 dark:text-white font-medium truncate">{chain.name}</div>
        <div className="text-neutral-500 dark:text-neutral-500 text-xs">{chain.tokenSymbol || '-'}</div>
      </div>
      <div className="text-neutral-900 dark:text-white font-medium">{formatTVL(chain.tvl)}</div>
    </div>
  );
}

// ============================================================
// MAIN WIDGET COMPONENTS
// ============================================================

interface DeFiWidgetProps {
  className?: string;
  limit?: number;
}

/**
 * Top DeFi Protocols Widget
 */
export function TopProtocolsWidget({ className = '', limit = 5 }: DeFiWidgetProps) {
  const { data, loading, error } = useTopProtocols(limit);

  return (
    <div className={`bg-white dark:bg-white/[0.02] rounded-xl p-4 border border-neutral-200 dark:border-white/[0.06] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neutral-900 dark:text-white font-semibold flex items-center gap-2">
          🏦 Top DeFi Protocols
        </h3>
        <Link to="/markets" className="text-[#F0B90B] text-sm hover:underline">
          View All →
        </Link>
      </div>
      
      {loading && (
        <div className="space-y-2 animate-pulse">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-100 dark:bg-white/[0.03] rounded-lg"></div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-center py-6 text-red-400 text-sm">
          Failed to load protocols
        </div>
      )}
      
      {data && (
        <div className="space-y-2">
          {data.map((protocol, index) => (
            <ProtocolCard key={protocol.id} protocol={protocol} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Top Yields Widget
 */
export function TopYieldsWidget({ className = '', limit = 5 }: DeFiWidgetProps) {
  const { data, loading, error } = useTopYields(limit);
  const [showStable, setShowStable] = useState(false);

  const filteredData = showStable 
    ? data?.filter(p => p.stablecoin)?.slice(0, limit)
    : data;

  return (
    <div className={`bg-white dark:bg-white/[0.02] rounded-xl p-4 border border-neutral-200 dark:border-white/[0.06] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neutral-900 dark:text-white font-semibold flex items-center gap-2">
          📈 Top Yields
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStable(!showStable)}
            className={`text-xs px-2 py-1 rounded ${
              showStable 
                ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                : 'bg-neutral-200 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Stables
          </button>
          <Link to="/markets" className="text-[#F0B90B] text-sm hover:underline">
            View All →
          </Link>
        </div>
      </div>
      
      {loading && (
        <div className="space-y-2 animate-pulse">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-100 dark:bg-white/[0.03] rounded-lg"></div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-center py-6 text-red-400 text-sm">
          Failed to load yields
        </div>
      )}
      
      {filteredData && (
        <div className="space-y-2">
          {filteredData.map((pool) => (
            <YieldCard key={pool.pool} pool={pool} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Top Chains Widget
 */
export function TopChainsWidget({ className = '', limit = 5 }: DeFiWidgetProps) {
  const { data, loading, error } = useTopChains(limit);

  return (
    <div className={`bg-white dark:bg-white/[0.02] rounded-xl p-4 border border-neutral-200 dark:border-white/[0.06] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neutral-900 dark:text-white font-semibold flex items-center gap-2">
          ⛓️ Top Chains by TVL
        </h3>
        <Link to="/markets" className="text-[#F0B90B] text-sm hover:underline">
          View All →
        </Link>
      </div>
      
      {loading && (
        <div className="space-y-2 animate-pulse">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="h-14 bg-neutral-100 dark:bg-white/[0.03] rounded-lg"></div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-center py-6 text-red-400 text-sm">
          Failed to load chains
        </div>
      )}
      
      {data && (
        <div className="space-y-2">
          {data.map((chain, index) => (
            <ChainCard key={chain.name} chain={chain} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Chain-specific DeFi Widget
 */
export function ChainDeFiWidget({ 
  chain, 
  className = '' 
}: { 
  chain: string; 
  className?: string;
}) {
  const { data, loading, error } = useChainDeFi(chain);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-white/[0.02] rounded-xl p-4 border border-neutral-200 dark:border-white/[0.06] ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-100 dark:bg-white/[0.03] rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-neutral-100 dark:bg-white/[0.03] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`bg-white dark:bg-white/[0.02] rounded-xl p-4 border border-neutral-200 dark:border-white/[0.06] ${className}`}>
        <p className="text-red-500 dark:text-red-400 text-center py-6">Failed to load {chain} DeFi data</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-white/[0.02] rounded-xl p-4 border border-neutral-200 dark:border-white/[0.06] ${className}`}>
      <h3 className="text-neutral-900 dark:text-white font-semibold mb-4">
        🌐 {chain.charAt(0).toUpperCase() + chain.slice(1)} DeFi
      </h3>
      
      {/* Top Protocols on Chain */}
      {data.protocols.length > 0 && (
        <div className="mb-6">
          <h4 className="text-neutral-500 dark:text-neutral-400 text-sm mb-3">Top Protocols</h4>
          <div className="space-y-2">
            {data.protocols.slice(0, 5).map((protocol, index) => (
              <ProtocolCard key={protocol.id} protocol={protocol} rank={index + 1} />
            ))}
          </div>
        </div>
      )}
      
      {/* Top Yields on Chain */}
      {data.yields.length > 0 && (
        <div>
          <h4 className="text-neutral-500 dark:text-neutral-400 text-sm mb-3">Top Yields</h4>
          <div className="space-y-2">
            {data.yields.slice(0, 5).map((pool) => (
              <YieldCard key={pool.pool} pool={pool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact DeFi Summary Widget
 * Shows quick stats in a horizontal layout
 */
export function DeFiSummaryBar({ className = '' }: { className?: string }) {
  const { data: protocols } = useTopProtocols(1);
  const { data: chains } = useTopChains(1);
  const { data: yields } = useTopYields(1);

  const topProtocol = protocols?.[0];
  const topChain = chains?.[0];
  const topYield = yields?.[0];

  return (
    <div className={`flex flex-wrap items-center gap-6 text-sm ${className}`}>
      {topProtocol && (
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 dark:text-neutral-500">Top Protocol:</span>
          <span className="text-neutral-900 dark:text-white font-medium">{topProtocol.name}</span>
          <span className="text-neutral-500 dark:text-neutral-400">{formatTVL(topProtocol.tvl)}</span>
        </div>
      )}
      
      {topChain && (
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 dark:text-neutral-500">Top Chain:</span>
          <span className="text-neutral-900 dark:text-white font-medium">{topChain.name}</span>
          <span className="text-neutral-500 dark:text-neutral-400">{formatTVL(topChain.tvl)}</span>
        </div>
      )}
      
      {topYield && (
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 dark:text-neutral-500">Top Yield:</span>
          <span className="text-neutral-900 dark:text-white font-medium">{topYield.project}</span>
          <span className="text-green-500 dark:text-green-400">{topYield.apy?.toFixed(2)}% APY</span>
        </div>
      )}
      
      <Link to="/markets" className="text-[#F0B90B] hover:underline">
        View Markets →
      </Link>
    </div>
  );
}
