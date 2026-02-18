# Troubleshooting

Step-by-step solutions for every known issue. Each problem includes the symptom, cause, and fix.

> **Quick diagnosis:** Use Ctrl+F (Cmd+F on Mac) to search for the error message you're seeing.
> **Don't know a term?** Check the [Glossary](GLOSSARY.md).

---

## How to Diagnose Problems

Before looking for specific errors, try these diagnostic steps:

```bash
# 1. Check your tools are installed and recent enough
node --version    # Need v18+
bun --version     # Any version
git --version     # Any version

# 2. Check you're in the right directory
pwd               # Should end with /bnb-chain-toolkit

# 3. Check dependencies are installed
ls node_modules/  # Should not be empty

# 4. Check the build ran successfully
ls public/index.json  # Should exist and not be empty
```

If any of these fail, the fix is in the relevant section below.

---

## Installation Issues

### `bun: command not found`

**Cause:** bun is not installed.

**Fix:**
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc  # or restart your terminal
```

### `bun install` fails with permission errors

**Fix:** Don't use `sudo`. Instead:
```bash
# Remove existing node_modules
rm -rf node_modules

# Try again
bun install
```

### Node.js version too old

**Symptom:** Errors about unsupported syntax or missing features.

**Fix:**
```bash
# Check your version
node --version

# If below 18, update via nvm:
nvm install 18
nvm use 18
```

---

## MCP Server Issues

### Server won't start

**Checklist:**
1. Are you in the right directory? (`cd mcp-servers/<server-name>`)
2. Did you run `bun install`?
3. Are required environment variables set?
4. Is the port already in use? (`lsof -i :3000`)

**Quick fix:**
```bash
cd mcp-servers/<server-name>
rm -rf node_modules
bun install
bun start
```

### Claude Desktop doesn't show MCP tools

**Checklist:**
1. Is the server running? Check with `ps aux | grep mcp`
2. Is `claude_desktop_config.json` valid JSON? Use `jq . claude_desktop_config.json`
3. Did you restart Claude Desktop after editing config?
4. Is the command path correct?

**Config file location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

### "Rate limited" errors

**Cause:** Too many API requests in a short time.

**Fix:**
- Add delays between requests
- Use caching (most components have built-in caching)
- Upgrade your API plan if available
- Reduce the number of concurrent requests

### "Invalid API key" errors

**Cause:** API key not set or expired.

**Fix:**
```bash
# Check if the variable is set
echo $BINANCE_API_KEY

# Set it
export BINANCE_API_KEY="your-key-here"
export BINANCE_SECRET_KEY="your-secret-here"

# Or add to .env file
echo 'BINANCE_API_KEY=your-key' >> .env
```

---

## Build Issues

### `bun run build` fails

**Checklist:**
1. Are you in the project root? (`/path/to/bnb-chain-toolkit/`)
2. Did you run `bun install` first?
3. Check for JSON syntax errors in `src/` files

**Quick fix:**
```bash
# Validate JSON files
for f in src/*.json; do jq . "$f" > /dev/null 2>&1 || echo "Invalid: $f"; done

# Rebuild
bun run build
```

### `public/index.json` is empty or missing

**Cause:** Build didn't complete successfully.

**Fix:**
```bash
bun run format    # Format source files first
bun run build     # Then build
ls -la public/    # Verify output exists
```

---

## Agent Issues

### Agent answers are too generic

**Cause:** System prompt isn't loaded properly.

**Fix:**
- Make sure you copied the entire `systemRole` field from the agent JSON
- Check that your AI assistant is using the prompt (not ignoring it)
- Some AI platforms have character limits on system prompts — try a shorter version

### Agent doesn't know about recent events

**Cause:** Agents are based on static system prompts. They don't have live data unless connected to MCP servers.

**Fix:** Connect an MCP server for real-time data:
1. Start the relevant MCP server
2. Add it to your AI assistant's config
3. The agent can now query live blockchain data

---

## Network Issues

### "Connection refused" to blockchain

**Cause:** RPC endpoint is down or blocked.

**Fix:** Try alternative RPC endpoints:

```bash
# BSC alternatives
export BSC_RPC_URL="https://bsc-dataseed1.binance.org"
# or
export BSC_RPC_URL="https://bsc-dataseed2.binance.org"
# or
export BSC_RPC_URL="https://rpc.ankr.com/bsc"
```

### Transactions stuck or failing

**Checklist:**
1. **Sufficient balance?** Check wallet has enough BNB for gas
2. **Gas price adequate?** BSC usually needs 3-5 Gwei minimum
3. **Nonce correct?** If resubmitting, use same nonce with higher gas
4. **Contract interaction?** Make sure ABI is correct

---

## Performance Issues

### Slow market data responses

**Fix:**
```typescript
// Enable caching
const client = new CoinGecko({ cacheTtl: 60_000 }); // Cache for 60 seconds
```

### High memory usage

**Cause:** Running too many MCP servers simultaneously.

**Fix:** Only run the servers you need:
```json
{
  "mcpServers": {
    "bnbchain": { ... }
  }
}
```

---

## Still Stuck?

If none of the sections above matched your issue:

1. **Check the [FAQ](faq.md)** — it covers conceptual questions the troubleshooting guide doesn't
2. **Search [existing issues](https://github.com/nirholas/bnb-chain-toolkit/issues)** — someone may have hit the same problem
3. **[Open a new issue](https://github.com/nirholas/bnb-chain-toolkit/issues/new)** with this template:

```markdown
**What I expected:** [describe the expected behavior]
**What happened:** [describe the actual behavior]
**Error message:** [paste the exact error]
**Steps to reproduce:**
1. [step 1]
2. [step 2]

**Environment:**
- OS: [e.g., macOS 14.2, Ubuntu 24.04, Windows 11]
- Node.js: [output of `node --version`]
- bun: [output of `bun --version`]
- Component: [e.g., bnbchain-mcp, agents build, etc.]
```

The more detail you provide, the faster we can help.

---

## Security Configuration

### CORS errors in production

**Cause:** Servers restrict cross-origin requests by default. Wildcard (`*`) origins are only allowed in development mode.

**Fix:** Set allowed origins via environment variables:
```bash
# MCP servers, Agent Runtime, Search Service
export CORS_ORIGINS="https://your-app.example.com,https://admin.example.com"

# Translate API (single origin)
export CORS_ORIGIN="https://your-app.example.com"
```

### Rate limiter blocking legitimate requests

**Cause:** When behind a reverse proxy or load balancer, all requests may appear to come from the same IP.

**Fix:**
```bash
# Enable X-Forwarded-For trust
export TRUST_PROXY=true
```

### Redis "NOAUTH" errors in Docker

**Cause:** Redis is configured to require authentication.

**Fix:** Set the Redis password in your environment:
```bash
export REDIS_PASSWORD=your-secure-password
```

### WebSocket connection rejected (code 1013)

**Cause:** Server reached the maximum WebSocket connection limit (default: 1,000).

**Fix:**
```bash
# Increase limit if needed
export MAX_WS_CONNECTIONS=2000
```

### Stack traces not showing in development

**Cause:** Stack traces are opt-in for security.

**Fix:**
```bash
export SHOW_STACK_TRACES=true
```

See [SECURITY.md](../SECURITY.md) for the full environment variables reference.

---

## See Also

- [Glossary](GLOSSARY.md) — Definitions for terms on this page
- [FAQ](faq.md) — Conceptual questions answered
- [Getting Started](getting-started.md) — Clean setup walkthrough
- [MCP Servers](mcp-servers.md) — Server-specific configuration details
