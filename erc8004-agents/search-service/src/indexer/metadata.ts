/** Fetch and parse agent metadata from URIs. */

import type { AgentRecord } from "../storage/database.js";

interface AgentMetadataJSON {
  type?: string;
  name?: string;
  description?: string;
  image?: string;
  services?: Array<{ name: string; endpoint: string; description?: string }>;
  active?: boolean;
  x402Support?: unknown;
  supportedTrust?: unknown[];
}

/**
 * Parse agent metadata from a URI (data URI, HTTPS, or IPFS).
 */
export async function fetchAgentMetadata(uri: string): Promise<AgentMetadataJSON | null> {
  try {
    if (uri.startsWith("data:application/json;base64,")) {
      const b64 = uri.slice("data:application/json;base64,".length);
      const json = atob(b64);
      return JSON.parse(json);
    }

    if (uri.startsWith("{")) {
      return JSON.parse(uri);
    }

    if (uri.startsWith("https://") || uri.startsWith("http://")) {
      const response = await fetch(uri, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) return null;
      return (await response.json()) as AgentMetadataJSON;
    }

    if (uri.startsWith("ipfs://")) {
      const cid = uri.slice("ipfs://".length);
      const gateway = `https://ipfs.io/ipfs/${cid}`;
      const response = await fetch(gateway, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) return null;
      return (await response.json()) as AgentMetadataJSON;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Convert raw metadata JSON into fields for an AgentRecord.
 */
export function metadataToFields(
  meta: AgentMetadataJSON
): Partial<AgentRecord> {
  return {
    name: meta.name || "",
    description: meta.description || "",
    image: meta.image || null,
    services: JSON.stringify(meta.services || []),
    active: meta.active !== false,
  };
}
