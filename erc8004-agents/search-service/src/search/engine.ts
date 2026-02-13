/** Full-text search engine using MiniSearch. */

import MiniSearch from "minisearch";
import type { AgentRecord } from "../storage/database.js";

export interface SearchResult {
  agent: AgentRecord;
  score: number;
}

export class SearchEngine {
  private index: MiniSearch;
  private agents = new Map<string, AgentRecord>();

  constructor() {
    this.index = new MiniSearch({
      fields: ["name", "description", "owner", "serviceNames"],
      storeFields: ["id"],
      searchOptions: {
        boost: { name: 3, description: 1.5, serviceNames: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });
  }

  /** Add or update an agent in the search index. */
  addAgent(agent: AgentRecord): void {
    const id = agent.id;

    // Parse service names for indexing
    let serviceNames = "";
    try {
      const services = JSON.parse(agent.services);
      serviceNames = services.map((s: any) => s.name).join(" ");
    } catch {
      // skip
    }

    const doc = {
      id,
      name: agent.name,
      description: agent.description,
      owner: agent.owner,
      serviceNames,
    };

    // Remove old entry if exists
    if (this.agents.has(id)) {
      this.index.discard(id);
    }

    this.index.add(doc);
    this.agents.set(id, agent);
  }

  /** Remove an agent from the index. */
  removeAgent(id: string): void {
    if (this.agents.has(id)) {
      this.index.discard(id);
      this.agents.delete(id);
    }
  }

  /** Full-text search. */
  search(query: string, limit = 50): SearchResult[] {
    if (!query.trim()) {
      // Return all agents sorted by reputation
      return Array.from(this.agents.values())
        .sort((a, b) => b.reputationScore - a.reputationScore)
        .slice(0, limit)
        .map((agent) => ({ agent, score: 1 }));
    }

    const results = this.index.search(query).slice(0, limit);

    return results
      .map((result: { id: string | number; score: number }) => {
        const agent = this.agents.get(result.id as string);
        if (!agent) return null;
        return { agent, score: result.score };
      })
      .filter((r: SearchResult | null): r is SearchResult => r !== null);
  }

  /** Rebuild the index from a list of agents. */
  rebuild(agents: AgentRecord[]): void {
    this.index.removeAll();
    this.agents.clear();
    for (const agent of agents) {
      this.addAgent(agent);
    }
  }

  get size(): number {
    return this.agents.size;
  }
}
