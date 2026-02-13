/** SQLite database for agent persistence. */

import Database from "better-sqlite3";
import path from "node:path";

export interface AgentRecord {
  id: string; // chainId:tokenId
  chainId: number;
  tokenId: number;
  owner: string;
  name: string;
  description: string;
  agentUri: string;
  services: string; // JSON array
  image: string | null;
  active: boolean;
  reputationScore: number;
  reputationCount: number;
  txHash: string;
  blockNumber: number;
  registeredAt: string; // ISO timestamp
  updatedAt: string;
}

export class AgentDatabase {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const resolvedPath = dbPath || path.join(process.cwd(), "data", "agents.db");
    this.db = new Database(resolvedPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        chain_id INTEGER NOT NULL,
        token_id INTEGER NOT NULL,
        owner TEXT NOT NULL,
        name TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        agent_uri TEXT NOT NULL DEFAULT '',
        services TEXT NOT NULL DEFAULT '[]',
        image TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        reputation_score INTEGER NOT NULL DEFAULT 0,
        reputation_count INTEGER NOT NULL DEFAULT 0,
        tx_hash TEXT NOT NULL DEFAULT '',
        block_number INTEGER NOT NULL DEFAULT 0,
        registered_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(chain_id, token_id)
      );

      CREATE INDEX IF NOT EXISTS idx_agents_chain ON agents(chain_id);
      CREATE INDEX IF NOT EXISTS idx_agents_owner ON agents(owner);
      CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
      CREATE INDEX IF NOT EXISTS idx_agents_reputation ON agents(reputation_score DESC);

      CREATE TABLE IF NOT EXISTS indexer_state (
        chain_id INTEGER PRIMARY KEY,
        last_block INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }

  upsertAgent(agent: AgentRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO agents (id, chain_id, token_id, owner, name, description, agent_uri, services, image, active, reputation_score, reputation_count, tx_hash, block_number, registered_at, updated_at)
      VALUES (@id, @chainId, @tokenId, @owner, @name, @description, @agentUri, @services, @image, @active, @reputationScore, @reputationCount, @txHash, @blockNumber, @registeredAt, @updatedAt)
      ON CONFLICT(id) DO UPDATE SET
        owner = @owner,
        name = @name,
        description = @description,
        agent_uri = @agentUri,
        services = @services,
        image = @image,
        active = @active,
        reputation_score = @reputationScore,
        reputation_count = @reputationCount,
        updated_at = @updatedAt
    `);
    stmt.run({
      ...agent,
      active: agent.active ? 1 : 0,
    });
  }

  getAgent(chainId: number, tokenId: number): AgentRecord | undefined {
    const stmt = this.db.prepare(
      "SELECT * FROM agents WHERE chain_id = ? AND token_id = ?"
    );
    const row = stmt.get(chainId, tokenId) as any;
    return row ? this.rowToAgent(row) : undefined;
  }

  getAgentsByOwner(owner: string): AgentRecord[] {
    const stmt = this.db.prepare(
      "SELECT * FROM agents WHERE LOWER(owner) = LOWER(?) ORDER BY registered_at DESC"
    );
    return (stmt.all(owner) as any[]).map(this.rowToAgent);
  }

  getAllAgents(limit = 1000, offset = 0): AgentRecord[] {
    const stmt = this.db.prepare(
      "SELECT * FROM agents ORDER BY reputation_score DESC, registered_at DESC LIMIT ? OFFSET ?"
    );
    return (stmt.all(limit, offset) as any[]).map(this.rowToAgent);
  }

  getAgentsByChain(chainId: number, limit = 100): AgentRecord[] {
    const stmt = this.db.prepare(
      "SELECT * FROM agents WHERE chain_id = ? ORDER BY reputation_score DESC LIMIT ?"
    );
    return (stmt.all(chainId, limit) as any[]).map(this.rowToAgent);
  }

  getStats(): { total: number; byChain: Record<number, number>; byService: Record<string, number> } {
    const total = (this.db.prepare("SELECT COUNT(*) as count FROM agents").get() as any).count;

    const chainRows = this.db.prepare(
      "SELECT chain_id, COUNT(*) as count FROM agents GROUP BY chain_id"
    ).all() as any[];
    const byChain: Record<number, number> = {};
    for (const row of chainRows) {
      byChain[row.chain_id] = row.count;
    }

    // Count service types across all agents
    const allAgents = this.db.prepare("SELECT services FROM agents").all() as any[];
    const byService: Record<string, number> = {};
    for (const row of allAgents) {
      try {
        const services = JSON.parse(row.services);
        for (const svc of services) {
          const name = svc.name || "Unknown";
          byService[name] = (byService[name] || 0) + 1;
        }
      } catch {
        // skip malformed
      }
    }

    return { total, byChain, byService };
  }

  getLastBlock(chainId: number): number {
    const stmt = this.db.prepare(
      "SELECT last_block FROM indexer_state WHERE chain_id = ?"
    );
    const row = stmt.get(chainId) as any;
    return row?.last_block || 0;
  }

  setLastBlock(chainId: number, blockNumber: number): void {
    const stmt = this.db.prepare(`
      INSERT INTO indexer_state (chain_id, last_block, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(chain_id) DO UPDATE SET last_block = ?, updated_at = datetime('now')
    `);
    stmt.run(chainId, blockNumber, blockNumber);
  }

  close(): void {
    this.db.close();
  }

  searchAgents(query: string, limit = 1000, offset = 0): AgentRecord[] {
    if (!query.trim()) {
      return this.getAllAgents(limit, offset);
    }
    const stmt = this.db.prepare(
      "SELECT * FROM agents WHERE name LIKE ? OR description LIKE ? ORDER BY reputation_score DESC LIMIT ? OFFSET ?"
    );
    const pattern = `%${query}%`;
    return (stmt.all(pattern, pattern, limit, offset) as any[]).map(this.rowToAgent);
  }

  private rowToAgent(row: any): AgentRecord {
    return {
      id: row.id,
      chainId: row.chain_id,
      tokenId: row.token_id,
      owner: row.owner,
      name: row.name,
      description: row.description,
      agentUri: row.agent_uri,
      services: row.services,
      image: row.image,
      active: Boolean(row.active),
      reputationScore: row.reputation_score,
      reputationCount: row.reputation_count,
      txHash: row.tx_hash,
      blockNumber: row.block_number,
      registeredAt: row.registered_at,
      updatedAt: row.updated_at,
    };
  }
}
