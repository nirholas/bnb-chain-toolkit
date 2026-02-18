# Security Policy

## Overview

BNB Chain AI Toolkit contains AI agent definitions (JSON), MCP server implementations (TypeScript/Python), market data libraries, wallet utilities, and documentation. Security is taken seriously given the financial nature of the tools.

## Reporting a Vulnerability

If you discover a security issue:

1. **DO NOT** open a public GitHub issue
2. Report via [GitHub Security Advisories](https://github.com/nirholas/bnb-chain-toolkit/security/advisories/new) (preferred)
3. Or email the maintainer directly at **security@bnb-chain-toolkit.vercel.app**
4. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
5. Allow reasonable time for a fix before public disclosure
6. We will acknowledge receipt within **48 hours** and aim to provide a fix or mitigation within **7 days**

## Security Considerations

### Private Keys & API Keys

- Private keys are **never** stored, logged, or transmitted by any component
- Keys are passed via environment variables and used only in memory
- The `.gitignore` excludes `.env` files by default
- Always use testnet keys during development

### MCP Servers

- MCP servers run locally on your machine
- No data is sent to external servers beyond the configured blockchain RPC and exchange APIs
- Review each server's source code before running
- Use read-only API keys when you don't need write access

### Smart Contracts (ERC-8004)

- Contracts in `standards/erc-8004/contracts/` are reference implementations
- They have **not been formally audited**
- Do not deploy to mainnet without independent audit
- Test thoroughly on testnet first

### Agent Definitions

- Agent JSON files contain system prompts, not executable code
- Review system prompts before using with any AI assistant
- Agents do not have inherent blockchain access — they need MCP servers

### Wallet Toolkit

- Designed for offline use (key generation, signing)
- Never transmits private keys over the network
- Verify wallet operations independently before trusting them with significant funds

## Security Controls

### CORS Configuration

All HTTP servers restrict cross-origin requests. By default, only same-origin requests are allowed in production. Configure allowed origins via environment variables:

| Component | Environment Variable | Default |
|-----------|---------------------|---------|
| Agent Runtime | `CORS_ORIGINS` | Same-origin (wildcard only in dev mode) |
| Translate API | `CORS_ORIGIN` | No cross-origin allowed |
| BNBChain MCP | `CORS_ORIGINS` | Same-origin |
| Universal Crypto MCP | `CORS_ORIGINS` | Same-origin |
| Agenti MCP | `CORS_ORIGINS` | Same-origin |
| Search Service | `CORS_ORIGINS` | Same-origin |

Set comma-separated origins for multiple domains:
```bash
CORS_ORIGINS="https://app.example.com,https://admin.example.com"
```

### Content Security Policy (CSP)

The deployment configurations (nginx, Vercel, Netlify) enforce a strict CSP:
- `default-src 'self'` — Only same-origin resources by default
- `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdn.tailwindcss.com https://esm.sh https://binaries.soliditylang.org` — Allows inline scripts (for SPA), eval (for Solidity compiler), and trusted CDNs (Pyodide, React sandbox, ERC-8004)
- `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net` — Inline styles for framework compatibility and CDN stylesheets
- `font-src 'self' data:` — Self-hosted fonts (Inter, JetBrains Mono, OpenDyslexic) and data URIs
- `img-src 'self' data: https:` — Images from same-origin, data URIs, and HTTPS
- `connect-src 'self' https: wss:` — API calls to HTTPS endpoints and WebSocket wallet connections
- `worker-src 'self' blob:` — Web workers from same-origin and blob URLs
- `frame-src 'self' blob:` — Iframes for sandbox/playground previews
- `manifest-src 'self'` — Web app manifest from same-origin
- `Permissions-Policy` restricts camera, microphone, and geolocation
- `Referrer-Policy: strict-origin-when-cross-origin`

### Rate Limiting

The server applies rate limiting on all routes. In production, rate limiters validate `X-Forwarded-For` headers to correctly identify clients behind reverse proxies.

Enable proxy trust when running behind a load balancer:
```bash
TRUST_PROXY=true
```

### Input Validation

- **Deploy route** — Network names are validated against an allowlist; bytecode must match hex format; ABI must be an array; constructor args are limited to 20
- **IPFS route** — CID format is validated (CIDv0 and CIDv1); content uploads are limited to 5 MB
- **Search service** — SQL LIKE metacharacters (`%`, `_`, `\`) are escaped in user queries
- **Auto-submit scripts** — Git branch names and agent names are validated against `^[a-zA-Z0-9_-]+$`; shell commands use `execFileSync` with argument arrays (no string interpolation)

### XSS Prevention

All user-controlled data rendered into HTML uses safe DOM APIs (`textContent`, `createElement`, `appendChild`) instead of `innerHTML`. This applies to:
- Web template generation (avatar URLs, NFT names, user listings)
- VS Code extension webviews (wallet status display)

### Docker Hardening

- **Nginx container** — Runs as non-root `nginx` user with minimal file permissions
- **Agent runtime** — Runs as non-root `appuser` (UID 1001)
- **Redis** — Requires password authentication; binds to localhost only

Configure Redis credentials:
```bash
REDIS_PASSWORD=your-secure-password
```

### WebSocket & Cache Limits

- **WebSocket connections** — Maximum 1,000 concurrent connections per search service instance (configurable via `MAX_WS_CONNECTIONS`)
- **In-memory cache** — Maximum 10,000 entries with LRU-style eviction (configurable via `MAX_CACHE_SIZE`)

### Error Handling

Stack traces are never exposed to clients in production. To enable stack traces for debugging:
```bash
SHOW_STACK_TRACES=true
```

### API Key Protection

API keys and secrets are masked in log output (showing only first and last 4 characters). The wallet toolkit displays security warnings when outputting private keys or mnemonics to stdout.

## Best Practices

1. **Use testnet first** for all development and testing
2. **Review before running** — inspect any script before executing
3. **Limit API permissions** — use read-only API keys where possible
4. **Set IP restrictions** on exchange API keys
5. **Never commit secrets** — use environment variables or `.env` files
6. **Start small** — test with minimal amounts before scaling up
7. **Verify independently** — cross-check any financial calculations
8. **Configure CORS** — set explicit `CORS_ORIGINS` in production; never use wildcard
9. **Enable proxy trust** — set `TRUST_PROXY=true` when behind a reverse proxy/load balancer
10. **Set Redis password** — always set `REDIS_PASSWORD` in production

## Environment Variables Reference

| Variable | Component | Description |
|----------|-----------|-------------|
| `CORS_ORIGINS` | MCP servers, Agent Runtime, Search Service | Comma-separated allowed origins |
| `CORS_ORIGIN` | Translate API | Single allowed origin |
| `TRUST_PROXY` | Server | Enable `X-Forwarded-For` trust (`true`/`false`) |
| `SHOW_STACK_TRACES` | Server | Expose stack traces in errors (`true`/`false`) |
| `REDIS_PASSWORD` | Docker Compose | Redis authentication password |
| `MAX_WS_CONNECTIONS` | Search Service | Max WebSocket connections (default: 1000) |
| `MAX_CACHE_SIZE` | Search Service | Max cache entries (default: 10000) |

## Supported Versions

| Version | Supported |
|---------|:---------:|
| v2.x    | ✅        |
| v1.x    | ❌        |

## Dependencies

- MCP server dependencies are listed in each server's `package.json`
- We monitor for known vulnerabilities via GitHub Dependabot
- Critical dependency updates are applied promptly
