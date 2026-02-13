/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - MCP Tool Playground
 * ═══════════════════════════════════════════════════════════════════════════
 * Connect to any MCP server, browse tools, fill params, execute live.
 * Like Postman/Swagger for MCP tools.
 *
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Play,
  Server,
  Wrench,
  ChevronRight,
  ChevronDown,
  Plug,
  PlugZap,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  X,
  Clock,
  Zap,
  Globe,
  ExternalLink,
  Info,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useMCPClient, DEFAULT_ENDPOINTS, type MCPTool } from '@/hooks/useMCPClient';
import { mcpServers } from '@/data/mcpServers';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';
import { Spotlight } from '@/components/ui';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ToolExecution {
  id: string;
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
  error?: string;
  duration: number;
  timestamp: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  return { copiedKey, copy };
}

function parseToolInputs(tool: MCPTool) {
  const props = tool.inputSchema?.properties || {};
  const required = new Set(tool.inputSchema?.required || []);
  return Object.entries(props).map(([name, schema]) => ({
    name,
    type: schema.type || 'string',
    description: schema.description || '',
    required: required.has(name),
    enum: schema.enum,
    default: schema.default,
  }));
}

function formatJSON(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

// ─── Connection Panel ────────────────────────────────────────────────────────

function ConnectionPanel({
  onConnect,
  connected,
  loading,
  error,
  toolCount,
  onDisconnect,
}: {
  onConnect: (url: string) => void;
  connected: boolean;
  loading: boolean;
  error: string | null;
  toolCount: number;
  onDisconnect: () => void;
}) {
  const [customUrl, setCustomUrl] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-4">
      {/* Server presets */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-1">
          Quick Connect
        </h3>
        {DEFAULT_ENDPOINTS.map((ep) => (
          <button
            key={ep.id}
            onClick={() => onConnect(ep.url)}
            disabled={loading}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group',
              connected && 'opacity-50 pointer-events-none',
              'border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]',
              'hover:border-[#F0B90B]/30 hover:bg-[#F0B90B]/[0.03]',
            )}
          >
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#F0B90B] shrink-0" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">{ep.name}</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed pl-6">
              {ep.description}
            </p>
          </button>
        ))}
      </div>

      {/* Custom endpoint */}
      <div className="space-y-2">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-[#F0B90B] transition-colors px-1"
        >
          {showCustom ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Custom Endpoint
        </button>

        <AnimatePresence>
          {showCustom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="http://localhost:3001/mcp"
                  className="flex-1 px-3 py-2 rounded-lg text-sm bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#F0B90B]/50 focus:ring-1 focus:ring-[#F0B90B]/20"
                />
                <button
                  onClick={() => customUrl && onConnect(customUrl)}
                  disabled={!customUrl || loading}
                  className="px-3 py-2 rounded-lg bg-[#F0B90B] text-black text-sm font-medium hover:bg-[#F0B90B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plug className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connection status */}
      {connected && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2">
            <PlugZap className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Connected — {toolCount} tools
            </span>
          </div>
          <button
            onClick={onDisconnect}
            className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F0B90B]/5 border border-[#F0B90B]/20">
          <Loader2 className="w-4 h-4 text-[#F0B90B] animate-spin" />
          <span className="text-sm text-neutral-600 dark:text-neutral-300">Connecting...</span>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Connection Failed</p>
              <p className="text-xs text-red-500/70 mt-1">{error}</p>
              <p className="text-xs text-neutral-500 mt-2">
                Make sure the MCP server is running with HTTP transport enabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* How to start a server - helper */}
      {!connected && !loading && (
        <div className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.01]">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">How to start a server</span>
          </div>
          <pre className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed">
{`# BNB Chain MCP (150+ tools)
npx @nirholas/bnb-chain-mcp@latest --http

# Universal Crypto (380+ tools)
npx @nirholas/universal-crypto-mcp --http

# Agenti (380+ tools)
npx @nirholas/agenti --http`}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Tool List (Sidebar) ────────────────────────────────────────────────────

function ToolList({
  tools,
  selectedTool,
  onSelect,
  search,
  onSearchChange,
}: {
  tools: MCPTool[];
  selectedTool: string | null;
  onSelect: (name: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const filtered = useMemo(() => {
    if (!search.trim()) return tools;
    const q = search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q),
    );
  }, [tools, search]);

  // Group tools by prefix (e.g. get_chain_info -> "chain", get_token_balance -> "token")
  const grouped = useMemo(() => {
    const groups: Record<string, MCPTool[]> = {};
    for (const tool of filtered) {
      // Extract category from tool name: get_chain_info -> chain, check_token_security -> token
      const parts = tool.name.split('_');
      let category = 'general';
      if (parts.length >= 2) {
        // Skip common prefixes like get, set, check, execute, list, search
        const skipPrefixes = ['get', 'set', 'check', 'execute', 'list', 'search', 'send', 'create', 'add', 'remove', 'detect', 'analyze', 'fetch', 'query', 'find'];
        if (skipPrefixes.includes(parts[0])) {
          category = parts[1] || 'general';
        } else {
          category = parts[0];
        }
      }
      if (!groups[category]) groups[category] = [];
      groups[category].push(tool);
    }
    // Sort categories: larger groups first
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${tools.length} tools...`}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#F0B90B]/50 focus:ring-1 focus:ring-[#F0B90B]/20"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="text-[11px] text-neutral-400 mt-1.5 px-1">
          {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </div>
      </div>

      {/* Tool tree */}
      <div className="flex-1 overflow-y-auto">
        {grouped.map(([category, categoryTools]) => (
          <ToolCategory
            key={category}
            name={category}
            tools={categoryTools}
            selectedTool={selectedTool}
            onSelect={onSelect}
          />
        ))}

        {filtered.length === 0 && (
          <div className="p-6 text-center text-sm text-neutral-500">
            No tools match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCategory({
  name,
  tools,
  selectedTool,
  onSelect,
}: {
  name: string;
  tools: MCPTool[];
  selectedTool: string | null;
  onSelect: (name: string) => void;
}) {
  const hasSelection = tools.some((t) => t.name === selectedTool);
  const [expanded, setExpanded] = useState(hasSelection || tools.length <= 5);

  useEffect(() => {
    if (hasSelection) setExpanded(true);
  }, [hasSelection]);

  return (
    <div className="border-b border-neutral-100 dark:border-white/[0.03]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        <span>{name}</span>
        <span className="ml-auto text-[10px] font-normal opacity-60">{tools.length}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {tools.map((tool) => (
              <button
                key={tool.name}
                onClick={() => onSelect(tool.name)}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm transition-all duration-150 border-l-2',
                  tool.name === selectedTool
                    ? 'bg-[#F0B90B]/10 border-[#F0B90B] text-neutral-900 dark:text-white'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.02] hover:text-neutral-900 dark:hover:text-white',
                )}
              >
                <div className="font-mono text-[13px] truncate">{tool.name}</div>
                {tool.description && (
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {tool.description}
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tool Form (Center Panel) ────────────────────────────────────────────────

function ToolForm({
  tool,
  onExecute,
  executing,
}: {
  tool: MCPTool;
  onExecute: (args: Record<string, unknown>) => void;
  executing: boolean;
}) {
  const inputs = parseToolInputs(tool);
  const [values, setValues] = useState<Record<string, string>>({});

  // Reset values when tool changes
  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const input of inputs) {
      if (input.default !== undefined) {
        defaults[input.name] = String(input.default);
      }
    }
    setValues(defaults);
  }, [tool.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const args: Record<string, unknown> = {};
    for (const input of inputs) {
      const val = values[input.name];
      if (val === undefined || val === '') continue;
      // Try to parse numeric and boolean values
      if (input.type === 'number' || input.type === 'integer') {
        args[input.name] = Number(val);
      } else if (input.type === 'boolean') {
        args[input.name] = val === 'true';
      } else if (input.type === 'array') {
        try {
          args[input.name] = JSON.parse(val);
        } catch {
          args[input.name] = val.split(',').map((s) => s.trim());
        }
      } else if (input.type === 'object') {
        try {
          args[input.name] = JSON.parse(val);
        } catch {
          args[input.name] = val;
        }
      } else {
        args[input.name] = val;
      }
    }
    onExecute(args);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tool header */}
      <div className="px-6 py-5 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F0B90B]/10">
            <Wrench className="w-5 h-5 text-[#F0B90B]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
              {tool.name}
            </h2>
            {tool.description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {tool.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {inputs.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-8 h-8 text-[#F0B90B]/50 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">
              This tool takes no parameters.
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Click Execute to run it.
            </p>
          </div>
        ) : (
          inputs.map((input) => (
            <div key={input.name}>
              <label className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 font-mono">
                  {input.name}
                </span>
                {input.required && (
                  <span className="text-[10px] font-semibold text-red-400 uppercase">required</span>
                )}
                <span className="text-[10px] text-neutral-400 ml-auto font-mono">{input.type}</span>
              </label>
              {input.description && (
                <p className="text-[11px] text-neutral-400 mb-2">{input.description}</p>
              )}

              {input.enum ? (
                <select
                  value={values[input.name] || ''}
                  onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white focus:outline-none focus:border-[#F0B90B]/50 focus:ring-1 focus:ring-[#F0B90B]/20"
                >
                  <option value="">Select...</option>
                  {input.enum.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              ) : input.type === 'boolean' ? (
                <select
                  value={values[input.name] || ''}
                  onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white focus:outline-none focus:border-[#F0B90B]/50 focus:ring-1 focus:ring-[#F0B90B]/20"
                >
                  <option value="">Select...</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : input.type === 'object' || input.type === 'array' ? (
                <textarea
                  value={values[input.name] || ''}
                  onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                  placeholder={input.type === 'array' ? '["item1", "item2"]' : '{"key": "value"}'}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#F0B90B]/50 focus:ring-1 focus:ring-[#F0B90B]/20 resize-y"
                />
              ) : (
                <input
                  type={input.type === 'number' || input.type === 'integer' ? 'number' : 'text'}
                  value={values[input.name] || ''}
                  onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                  placeholder={input.default !== undefined ? String(input.default) : `Enter ${input.name}...`}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#F0B90B]/50 focus:ring-1 focus:ring-[#F0B90B]/20"
                />
              )}
            </div>
          ))
        )}

        {/* Execute button */}
        <button
          type="submit"
          disabled={executing}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200',
            executing
              ? 'bg-[#F0B90B]/50 text-black/50 cursor-wait'
              : 'bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90 hover:shadow-lg hover:shadow-[#F0B90B]/20 active:scale-[0.98]',
          )}
        >
          {executing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Execute Tool
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Results Panel ───────────────────────────────────────────────────────────

function ResultsPanel({
  executions,
  onClear,
}: {
  executions: ToolExecution[];
  onClear: () => void;
}) {
  const { copiedKey, copy } = useCopy();

  if (executions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Terminal className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-3" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          No results yet
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
          Select a tool and click Execute to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.01]">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Results ({executions.length})
        </span>
        <button
          onClick={onClear}
          className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-white/[0.03]">
        {executions.map((exec) => (
          <div key={exec.id} className="px-4 py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    exec.error ? 'bg-red-400' : 'bg-green-400',
                  )}
                />
                <span className="text-sm font-mono font-medium text-neutral-900 dark:text-white">
                  {exec.tool}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {exec.duration}ms
                </span>
                <button
                  onClick={() => copy(formatJSON(exec.result), exec.id)}
                  className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {copiedKey === exec.id ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Args summary */}
            {Object.keys(exec.args).length > 0 && (
              <div className="text-[11px] text-neutral-400 font-mono mb-2 truncate">
                args: {JSON.stringify(exec.args)}
              </div>
            )}

            {/* Result */}
            {exec.error ? (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap break-all">
                {exec.error}
              </div>
            ) : (
              <pre className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.06] text-[13px] text-emerald-400 font-mono overflow-x-auto max-h-80 whitespace-pre-wrap break-all leading-relaxed">
                {formatJSON(exec.result)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Offline / Catalog Mode ─────────────────────────────────────────────────
// When not connected, show the static tool catalog with install instructions.

function OfflineCatalog() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F0B90B]/10 mx-auto mb-6">
          <Wrench className="w-8 h-8 text-[#F0B90B]" />
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          900+ Tools Ready to Use
        </h2>

        <p className="text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
          Connect to any MCP server to browse and execute tools live. Start a server
          locally with one command, then connect from the left panel.
        </p>

        {/* Server cards */}
        <div className="grid gap-3 text-left mb-6">
          {mcpServers.slice(0, 4).map((server) => (
            <div
              key={server.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
            >
              <Server className="w-5 h-5 text-[#F0B90B] shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                  {server.name}
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {server.toolCount} tools · {server.language}
                </div>
              </div>
              <span className="ml-auto text-[11px] text-neutral-400 font-mono shrink-0">
                {server.highlights[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Quick start terminal */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden text-left">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span className="text-[11px] text-neutral-500 font-mono ml-2">terminal</span>
          </div>
          <pre className="p-4 text-[13px] text-emerald-400 font-mono leading-relaxed">
{`# Start any MCP server with HTTP
npx @nirholas/bnb-chain-mcp@latest --http

# Then click "Connect" in the left panel`}
          </pre>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <a
            href="https://github.com/nirholas/bnb-chain-toolkit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#F0B90B] transition-colors"
          >
            <Globe className="w-4 h-4" />
            GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/docs"
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#F0B90B] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Documentation
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ToolPlaygroundPage() {
  useSEO({
    title: 'Tool Playground — Execute 900+ MCP Tools Live',
    description:
      'Connect to BNB Chain MCP servers and execute 900+ crypto, DeFi, and blockchain tools directly in your browser.',
    path: '/tool-playground',
  });

  const mcp = useMCPClient();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [executions, setExecutions] = useState<ToolExecution[]>([]);
  const [executing, setExecuting] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'connect' | 'tools'>('connect');

  // Auto-switch to tools tab on connect
  useEffect(() => {
    if (mcp.connected && mcp.tools.length > 0) {
      setSidebarTab('tools');
    }
  }, [mcp.connected, mcp.tools.length]);

  // Get selected tool object
  const activeTool = useMemo(
    () => mcp.tools.find((t) => t.name === selectedTool) || null,
    [mcp.tools, selectedTool],
  );

  // Handle tool execution
  const handleExecute = useCallback(
    async (args: Record<string, unknown>) => {
      if (!selectedTool) return;
      setExecuting(true);
      const start = performance.now();

      try {
        const result = await mcp.callTool(selectedTool, args);
        const duration = Math.round(performance.now() - start);

        setExecutions((prev) => [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tool: selectedTool,
            args,
            result,
            duration,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      } catch (err) {
        const duration = Math.round(performance.now() - start);
        setExecutions((prev) => [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tool: selectedTool,
            args,
            result: null,
            error: err instanceof Error ? err.message : String(err),
            duration,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      } finally {
        setExecuting(false);
      }
    },
    [selectedTool, mcp],
  );

  const handleConnect = useCallback(
    (url: string) => {
      mcp.connect(url);
    },
    [mcp],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#F0B90B" />

      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-white/[0.06] bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-16 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F0B90B]/10">
              <Wrench className="w-5 h-5 text-[#F0B90B]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                MCP Tool Playground
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Connect · Browse · Execute — 900+ tools across 6 servers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mcp.connected && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-xs font-medium text-green-600 dark:text-green-400 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {mcp.tools.length} tools
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout: sidebar | center | results */}
      <div className="flex" style={{ height: 'calc(100vh - 130px)' }}>
        {/* Left Sidebar — Connection + Tool Browser */}
        <aside className="w-80 shrink-0 border-r border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01] flex flex-col">
          {/* Sidebar tabs */}
          <div className="flex border-b border-neutral-200 dark:border-white/[0.06]">
            <button
              onClick={() => setSidebarTab('connect')}
              className={cn(
                'flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2',
                sidebarTab === 'connect'
                  ? 'text-[#F0B90B] border-[#F0B90B]'
                  : 'text-neutral-400 border-transparent hover:text-neutral-600 dark:hover:text-neutral-300',
              )}
            >
              <Plug className="w-3.5 h-3.5 inline mr-1.5" />
              Connect
            </button>
            <button
              onClick={() => setSidebarTab('tools')}
              disabled={!mcp.connected}
              className={cn(
                'flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2',
                sidebarTab === 'tools'
                  ? 'text-[#F0B90B] border-[#F0B90B]'
                  : 'text-neutral-400 border-transparent hover:text-neutral-600 dark:hover:text-neutral-300',
                !mcp.connected && 'opacity-40 cursor-not-allowed',
              )}
            >
              <Wrench className="w-3.5 h-3.5 inline mr-1.5" />
              Tools ({mcp.tools.length})
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarTab === 'connect' ? (
              <div className="p-4">
                <ConnectionPanel
                  onConnect={handleConnect}
                  connected={mcp.connected}
                  loading={mcp.loading}
                  error={mcp.error}
                  toolCount={mcp.tools.length}
                  onDisconnect={mcp.disconnect}
                />
              </div>
            ) : (
              <ToolList
                tools={mcp.tools}
                selectedTool={selectedTool}
                onSelect={setSelectedTool}
                search={search}
                onSearchChange={setSearch}
              />
            )}
          </div>
        </aside>

        {/* Center — Tool form or offline state */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-neutral-200 dark:border-white/[0.06]">
          {!mcp.connected ? (
            <OfflineCatalog />
          ) : !activeTool ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <Wrench className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-500 font-medium">Select a tool</p>
              <p className="text-xs text-neutral-400 mt-1">
                Choose a tool from the sidebar to see its parameters and execute it.
              </p>
            </div>
          ) : (
            <ToolForm
              tool={activeTool}
              onExecute={handleExecute}
              executing={executing}
            />
          )}
        </div>

        {/* Right — Results */}
        <aside className="w-[400px] shrink-0 bg-neutral-50/50 dark:bg-white/[0.01]">
          <ResultsPanel
            executions={executions}
            onClear={() => setExecutions([])}
          />
        </aside>
      </div>
    </div>
  );
}
