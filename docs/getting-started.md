# Getting Started

A step-by-step guide from zero to running. No prior blockchain experience needed.

> **Estimated time:** 10-15 minutes for basic setup, 5 more for your first MCP server.

---

## Before You Start

### What You'll Need

You need three tools installed on your computer. If you already have them, skip ahead to [Step 1](#step-1-download-the-toolkit).

| Tool | What It Does | How to Check | Install Link |
|------|-------------|-------------|--------------|
| **Git** | Downloads the project | `git --version` → any version is fine | [git-scm.com](https://git-scm.com/) |
| **Node.js 18+** | Runs JavaScript code | `node --version` → should show v18 or higher | [nodejs.org](https://nodejs.org/) |
| **bun** | Fast package manager and runner | `bun --version` → any version is fine | [bun.sh](https://bun.sh/) |

<details>
<summary><b>How to install bun (MacOS / Linux / WSL)</b></summary>

Open your terminal and run:
```bash
curl -fsSL https://bun.sh/install | bash
```

Then restart your terminal (close and reopen it) so the `bun` command becomes available.

**Verify it worked:**
```bash
bun --version
# Should print something like 1.x.x
```

</details>

<details>
<summary><b>How to install bun on Windows</b></summary>

Open PowerShell and run:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Or if you have npm already: `npm install -g bun`

Then restart your terminal.

</details>

<details>
<summary><b>What if I don't want to install bun?</b></summary>

No problem — you can use `npm` or `yarn` instead. Anywhere this guide says `bun install`, use `npm install`. Anywhere it says `bun run build`, use `npm run build`. Everything works the same way.

</details>

### What You Won't Need (Yet)

You do **not** need:
- A crypto wallet (unless you want to execute on-chain transactions)
- Any cryptocurrency or tokens
- API keys (basic features work without them)
- Docker (optional, for deployment only)

---

## Step 1: Download the Toolkit

Open your terminal (Terminal on Mac/Linux, PowerShell on Windows) and run:

```bash
git clone https://github.com/nirholas/bnb-chain-toolkit.git
cd bnb-chain-toolkit
```

This downloads the entire toolkit to a folder called `bnb-chain-toolkit` and moves you into it.

<details>
<summary><b>What if git clone fails?</b></summary>

Common fixes:
- **"git: command not found"** → Install Git from [git-scm.com](https://git-scm.com/)
- **"Permission denied"** → You may need to set up SSH keys. Try the HTTPS method instead (which is what's shown above)
- **Slow download** → The repo is large. Wait it out, or use `git clone --depth 1 ...` to download only the latest version

</details>

---

## Step 2: Install Dependencies

```bash
bun install
```

This installs all the JavaScript packages the toolkit needs. It typically takes 30-60 seconds.

**What you should see:** A progress bar, then a success message like "done in X.XXs".

<details>
<summary><b>What if bun install fails?</b></summary>

1. **Permission errors:** Don't use `sudo`. Delete `node_modules` and retry:
   ```bash
   rm -rf node_modules && bun install
   ```
2. **Network errors:** Check your internet connection, or try a different network
3. **Version errors:** Ensure Node.js 18+ is installed: `node --version`

</details>

---

## Step 3: Build the Agent Index

```bash
bun run build
```

This processes all 78 agent definitions and creates a searchable index at `public/index.json`.

**What you should see:** Output describing the build process, ending in a success message.

---

## Step 4: Verify Everything Works

Run this quick check:

```bash
# Confirm the agent index was built
cat public/index.json | head -5
```

**Expected output:** You should see the start of a JSON file with agent data:
```json
{
  "agents": [
    {
      "identifier": "alpaca-finance-expert",
```

If you see JSON output, congratulations — the toolkit is installed and working!

---

## Step 5: Choose What to Do Next

The toolkit has many components. You don't need all of them. Pick the path that matches your goal:

### Path A: "I want to connect AI to blockchains" (Most Popular)

This is the core use case. You'll start an MCP server and connect it to Claude Desktop.

**Continue to: [Your First MCP Server](#your-first-mcp-server) below.**

### Path B: "I want to use/explore AI agents"

You want to browse the 78 agents and use them with your AI assistant.

**Continue to:** [Agents Guide](agents.md) — shows how to load agents into Claude, ChatGPT, or any LLM.

### Path C: "I want live crypto market data"

You want real-time prices, news, and market analytics.

**Continue to:** [Market Data Guide](market-data.md)

### Path D: "I want to sweep dust tokens"

You want to consolidate tiny token balances across chains.

**Continue to:** [DeFi Tools Guide](defi-tools.md)

### Path E: "I just want to look around"

Start the frontend to explore:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You'll see the agent catalog with all 78 agents, their descriptions, and full configurations.

---

## Your First MCP Server

This section walks you through starting the BNB Chain MCP server and connecting it to Claude Desktop. This gives Claude direct access to blockchain data.

### 5a. Install and Start the Server

```bash
cd mcp-servers/bnbchain-mcp
bun install
bun run build
```

> **Note:** Each MCP server has its own dependencies, so you need to run `bun install` inside the server directory too.

### 5b. Connect to Claude Desktop

Claude Desktop reads MCP server configs from a JSON file. Find or create it:

| OS | Config file location |
|----|---------------------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

Add this to the file (create the file if it doesn't exist):

```json
{
  "mcpServers": {
    "bnbchain": {
      "command": "npx",
      "args": ["-y", "@nirholas/bnbchain-mcp"],
      "env": {
        "BSC_RPC_URL": "https://bsc-dataseed.binance.org"
      }
    }
  }
}
```

### 5c. Restart Claude Desktop

Close and reopen Claude Desktop completely (not just the window — fully quit and relaunch).

### 5d. Try It Out

Open a new conversation in Claude and ask:

> "What's the BNB balance of address 0xF977814e90dA44bFA03b6295A0616a897441aceC?"

If everything is working, Claude will call the MCP server, query the BSC blockchain, and return the real balance.

**What just happened:**
```
Your question → Claude → MCP Server → BSC Blockchain → Real data → Claude's answer
```

Claude didn't guess — it looked up the actual on-chain data.

<details>
<summary><b>What if Claude doesn't show MCP tools?</b></summary>

1. **Is the config file valid JSON?** Open it and check for typos (missing commas, extra brackets)
2. **Did you fully restart Claude?** On Mac: Cmd+Q, then reopen. On Windows: right-click tray icon → Quit
3. **Is the server reachable?** Open a separate terminal and check: `npx -y @nirholas/bnbchain-mcp`
4. **Still stuck?** See the [Troubleshooting](troubleshooting.md) guide

</details>

---

## Optional: Add API Keys for More Features

The basic setup works without any API keys, but adding them unlocks more capabilities:

| API Key | What It Unlocks | How to Get One |
|---------|----------------|---------------|
| `COINGECKO_API_KEY` | Higher rate limits for price data | [coingecko.com/api](https://www.coingecko.com/en/api) (free tier available) |
| `BINANCE_API_KEY` + `BINANCE_SECRET_KEY` | Trading on Binance exchange | [binance.com/en/my/settings/api-management](https://www.binance.com/en/my/settings/api-management) |
| `PRIVATE_KEY` | On-chain write operations (sending tokens, swaps) | Export from your wallet (MetaMask → Account Details → Export Private Key) |

Set them as environment variables:

```bash
# Linux/Mac
export COINGECKO_API_KEY="your-key-here"

# Or create a .env file
echo 'COINGECKO_API_KEY=your-key-here' >> .env
```

> **Security Warning:** Never commit API keys or private keys to Git. The `.gitignore` file already excludes `.env` files, but always double-check.

---

## Understanding the Project Structure

Now that everything is running, here's what each top-level folder does:

```
bnb-chain-toolkit/
├── agents/            ← 78 AI agent definitions (JSON files)
│   ├── bnb-chain-agents/  ← 36 agents for BNB Chain specifically
│   └── defi-agents/       ← 42 agents for general DeFi
├── mcp-servers/       ← 6 MCP servers (the core technology)
├── market-data/       ← Live crypto prices and news
├── defi-tools/        ← Dust sweeper utility
├── wallets/           ← Offline wallet toolkit
├── standards/         ← ERC-8004 and W3AG specs
├── docs/              ← You are here
├── src/               ← Agent source files (processed by build)
├── public/            ← Built output (index.json)
├── scripts/           ← Build tools
├── locales/           ← 30+ language translations
└── schema/            ← JSON Schema for validation
```

> **Deep dive:** See [Architecture](architecture.md) for detailed diagrams and data flows.

---

## Common First Steps After Setup

| Goal | Command / Action |
|------|-----------------|
| Browse all agents visually | `bun run dev` → open http://localhost:5173 |
| Start the Binance MCP server too | `cd mcp-servers/binance-mcp && bun install` |
| Run tests to verify everything | `bun run test` |
| Check for linting issues | `bun run lint` |
| Format all JSON files | `bun run format` |
| Read real-world usage patterns | [Examples](examples.md) |

---

## What's Next?

| Guide | What You'll Learn |
|-------|------------------|
| [Architecture](architecture.md) | How all the pieces fit together, with diagrams |
| [Agents](agents.md) | Deep dive into all 78 agents, plus creating your own |
| [MCP Servers](mcp-servers.md) | Setting up all 6 servers with configuration details |
| [Examples](examples.md) | Real-world usage from beginner to advanced |
| [FAQ](faq.md) | Answers to questions you'll probably have |
| [Troubleshooting](troubleshooting.md) | When things go wrong |
| [Glossary](GLOSSARY.md) | Any term you don't recognize |

---

## Need Help?

- **Something not working?** → [Troubleshooting](troubleshooting.md)
- **Don't understand a term?** → [Glossary](GLOSSARY.md)
- **Found a bug?** → [Open an issue](https://github.com/nirholas/bnb-chain-toolkit/issues)
- **Want to contribute?** → [CONTRIBUTING.md](../CONTRIBUTING.md)
