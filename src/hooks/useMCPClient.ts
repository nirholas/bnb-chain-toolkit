/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MCP Client Hook — Browser-side MCP tool discovery & execution
 * ═══════════════════════════════════════════════════════════════════════════
 * Connects to MCP servers over StreamableHTTP (JSON-RPC 2.0).
 * No SDK dependency — pure fetch-based implementation.
 *
 * @author nich (@nichxbt)
 * @license MIT
 * @preserve
 */

import { useState, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MCPToolInput {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  enum?: string[];
  default?: unknown;
}

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, {
      type?: string;
      description?: string;
      enum?: string[];
      default?: unknown;
      items?: { type?: string };
    }>;
    required?: string[];
  };
}

export interface MCPToolResult {
  content: Array<{
    type: string;
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface MCPServerEndpoint {
  id: string;
  name: string;
  url: string;
  description?: string;
}

interface MCPClientState {
  sessionId: string | null;
  tools: MCPTool[];
  loading: boolean;
  error: string | null;
  connected: boolean;
}

// ─── JSON-RPC helpers ────────────────────────────────────────────────────────

let rpcIdCounter = 1;

function jsonrpcRequest(method: string, params?: Record<string, unknown>) {
  return {
    jsonrpc: '2.0' as const,
    id: rpcIdCounter++,
    method,
    params: params ?? {},
  };
}

// ─── Known public MCP endpoints ─────────────────────────────────────────────
// These are the endpoints where your MCP servers can be deployed.
// Users can also add custom endpoints.

export const DEFAULT_ENDPOINTS: MCPServerEndpoint[] = [
  {
    id: 'bnbchain-local',
    name: 'BNB Chain MCP (Local)',
    url: 'http://localhost:3001/mcp',
    description: 'Local bnbchain-mcp server — run: npx @nirholas/bnb-chain-mcp@latest --http',
  },
  {
    id: 'universal-local',
    name: 'Universal Crypto MCP (Local)',
    url: 'http://localhost:3002/mcp',
    description: 'Local universal-crypto-mcp — run: npx @nirholas/universal-crypto-mcp --http',
  },
  {
    id: 'agenti-local',
    name: 'Agenti (Local)',
    url: 'http://localhost:3003/mcp',
    description: 'Local agenti server — run: npx @nirholas/agenti --http',
  },
];

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useMCPClient() {
  const [state, setState] = useState<MCPClientState>({
    sessionId: null,
    tools: [],
    loading: false,
    error: null,
    connected: false,
  });

  const sessionIdRef = useRef<string | null>(null);
  const endpointRef = useRef<string>('');

  /**
   * Send a JSON-RPC request to the MCP server's HTTP endpoint.
   * Handles session initialization automatically.
   */
  const sendRequest = useCallback(async (
    endpoint: string,
    method: string,
    params?: Record<string, unknown>,
  ): Promise<unknown> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    };

    if (sessionIdRef.current) {
      headers['mcp-session-id'] = sessionIdRef.current;
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(jsonrpcRequest(method, params)),
    });

    // Capture session ID from response header
    const newSessionId = res.headers.get('mcp-session-id');
    if (newSessionId) {
      sessionIdRef.current = newSessionId;
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`MCP server returned ${res.status}: ${text || res.statusText}`);
    }

    const contentType = res.headers.get('content-type') || '';

    // Handle SSE responses (some servers send as SSE even for single responses)
    if (contentType.includes('text/event-stream')) {
      const text = await res.text();
      // Parse the last data: line as JSON-RPC response
      const lines = text.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('data: ')) {
          const json = JSON.parse(line.slice(6));
          if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
          return json.result;
        }
      }
      throw new Error('No data in SSE response');
    }

    // Handle regular JSON response
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error.message || JSON.stringify(json.error));
    }
    return json.result;
  }, []);

  /**
   * Connect to an MCP server: initialize session + discover tools.
   */
  const connect = useCallback(async (endpoint: string) => {
    setState(s => ({ ...s, loading: true, error: null, connected: false, tools: [] }));
    sessionIdRef.current = null;
    endpointRef.current = endpoint;

    try {
      // Step 1: Initialize the session
      await sendRequest(endpoint, 'initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'bnb-toolkit-playground', version: '1.0.0' },
      });

      // Step 2: Send initialized notification (no response expected, but some servers need it)
      // For StreamableHTTP this is sent as a notification (no id)
      try {
        const notifHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        };
        if (sessionIdRef.current) {
          notifHeaders['mcp-session-id'] = sessionIdRef.current;
        }

        await fetch(endpoint, {
          method: 'POST',
          headers: notifHeaders,
          body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
        });
      } catch {
        // Notifications may not return a response, that's fine
      }

      // Step 3: List available tools
      const result = await sendRequest(endpoint, 'tools/list', {}) as { tools: MCPTool[] };
      const tools = result?.tools || [];

      setState({
        sessionId: sessionIdRef.current,
        tools,
        loading: false,
        error: null,
        connected: true,
      });

      return tools;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setState(s => ({
        ...s,
        loading: false,
        error: message,
        connected: false,
      }));
      return [];
    }
  }, [sendRequest]);

  /**
   * Call a tool on the connected server.
   */
  const callTool = useCallback(async (
    toolName: string,
    args: Record<string, unknown> = {},
  ): Promise<MCPToolResult> => {
    if (!endpointRef.current) {
      throw new Error('Not connected to any MCP server');
    }

    const result = await sendRequest(endpointRef.current, 'tools/call', {
      name: toolName,
      arguments: args,
    }) as MCPToolResult;

    return result;
  }, [sendRequest]);

  /**
   * Disconnect (cleanup session).
   */
  const disconnect = useCallback(() => {
    sessionIdRef.current = null;
    endpointRef.current = '';
    setState({
      sessionId: null,
      tools: [],
      loading: false,
      error: null,
      connected: false,
    });
  }, []);

  return {
    ...state,
    connect,
    callTool,
    disconnect,
  };
}

export default useMCPClient;
