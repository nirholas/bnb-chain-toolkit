# Getting Started

Welcome! This guide will help you set up the BNB Chain AI Toolkit in under 5 minutes.

No blockchain experience needed. We'll walk through everything step by step.

---

## What You'll Need

Before we start, make sure you have these installed on your computer:

| Tool | What It Does | Install Link |
|------|-------------|--------------|
| **Node.js 18+** | Runs JavaScript code | [nodejs.org](https://nodejs.org/) |
| **Git** | Downloads the project | [git-scm.com](https://git-scm.com/) |
| **bun** | Fast package manager | [bun.sh](https://bun.sh/) |

> **Not sure if you have these?** Open a terminal and type `node --version` and `git --version`. If you see version numbers, you're good!

---

## Step 1: Download the Toolkit

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/nirholas/bnb-chain-toolkit.git
cd bnb-chain-toolkit
```

This downloads the entire toolkit to your computer.

---

## Step 2: Install Dependencies

```bash
bun install
```

This installs all the packages the toolkit needs. It might take a minute or two.

---

## Step 3: Build the Agent Index

```bash
bun run build
```

This creates a searchable index of all 78 AI agents.

---

## Step 4: Pick What You Need

The toolkit has several components. You don't need all of them — pick what matches your use case:

### "I want AI agents in Claude or ChatGPT"
→ Start with [MCP Servers Guide](mcp-servers.md)

### "I want to track crypto prices"
→ Start with [Market Data Guide](market-data.md)

### "I want to build trading bots"
→ Start with [Agents Guide](agents.md)

### "I want wallet operations"
→ Start with [Wallets Guide](wallets.md)

### "I want to sweep dust tokens"
→ Start with [DeFi Tools Guide](defi-tools.md)

### "I want to learn about Web3 standards"
→ Start with [Standards Guide](standards.md)

---

## Quick Test

Let's make sure everything works. Run this command:

```bash
# Check that the agent index was built
cat public/index.json | head -20
```

You should see JSON data with agent definitions. If you do, you're all set!

---

## Using an MCP Server (Quick Demo)

Here's how to start the BNB Chain MCP server:

```bash
cd mcp-servers/bnbchain-mcp
bun install
bun start
```

Now add it to Claude Desktop by editing your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bnbchain": {
      "command": "node",
      "args": ["path/to/bnb-chain-toolkit/mcp-servers/bnbchain-mcp/dist/index.js"],
      "env": {
        "BSC_RPC_URL": "https://bsc-dataseed.binance.org"
      }
    }
  }
}
```

That's it! Claude can now interact with BNB Chain directly.

---

## What's Next?

| Guide | Description |
|-------|-------------|
| [What Is This?](what-is-this.md) | Simple explanation of what this toolkit does |
| [Architecture](architecture.md) | How all the pieces fit together |
| [Agents](agents.md) | Deep dive into all 78 AI agents |
| [MCP Servers](mcp-servers.md) | Set up any of the 6 MCP servers |
| [Examples](examples.md) | Real-world usage examples |
| [FAQ](faq.md) | Common questions answered |

---

## Need Help?

- **Something not working?** Check [Troubleshooting](troubleshooting.md)
- **Found a bug?** [Open an issue](https://github.com/nirholas/bnb-chain-toolkit/issues)
- **Want to contribute?** Read [Contributing](../CONTRIBUTING.md)
