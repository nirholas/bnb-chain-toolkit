# Binance.US MCP Server  
 
A Model Context Protocol (MCP) server for interacting with the Binance.US cryptocurrency exchange API.
 
## Overview

This MCP server provides programmatic access to Binance.US exchange features including:

- **Market Data**: Real-time prices, order books, trade history
- **Spot Trading**: Place, cancel, and manage orders
- **Wallet Management**: Deposits, withdrawals, balances
- **Account Information**: Account details, trade history
- **Staking**: Earn rewards on supported assets
- **OTC Trading**: Over-the-counter trading
- **Sub-Accounts**: Manage sub-accounts
- **Custodial Solution**: For custody partners (requires special API key)
- **Credit Line**: For institutional credit (requires special API key)

## Binance.US vs Binance.com

This server is specifically designed for **Binance.US**, which differs from Binance.com in several important ways:

| Feature | Binance.US | Binance.com |
|---------|------------|-------------|
| Base URL | `api.binance.us` | `api.binance.com` |
| WebSocket | `stream.binance.us:9443` | `stream.binance.com:9443` |
| Regulation | US SEC/FinCEN compliant | International |
| Futures Trading | ❌ Not available | ✅ Available |
| Margin Trading | ❌ Not available | ✅ Available |
| Lending | ❌ Not available | ✅ Available |
| Custodial Solution API | ✅ Available | ❌ Not available |
| Credit Line API | ✅ Available | ❌ Not available |
| Available Pairs | ~150 pairs | ~1,500+ pairs |

## API Key Types

Binance.US offers three types of API keys:

### 1. Exchange API Keys
- Standard API keys for most users
- Access to market data, trading, wallet, and account endpoints
- Create at: Binance.US > Profile > API Management

### 2. Custodial Solution API Keys
- For users with a Custody Exchange Network agreement
- Access to custodial-specific endpoints only
- Requires agreement with a participating custody partner

### 3. Credit Line API Keys
- For institutional users with a credit line agreement
- Access to credit line-specific endpoints only
- Requires signed credit line agreement with Binance.US

## Installation

```bash
# Clone the repository
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp/binance-us-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file or set these environment variables:

```bash
BINANCE_US_API_KEY=your_api_key_here
BINANCE_US_API_SECRET=your_api_secret_here
```

### Claude Desktop Configuration

Add to your Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "binance-us-mcp": {
      "command": "node",
      "args": ["/path/to/binance-us-mcp-server/build/index.js"],
      "env": {
        "BINANCE_US_API_KEY": "your_api_key",
        "BINANCE_US_API_SECRET": "your_api_secret"
      }
    }
  }
}
```

## Usage

### Development

```bash
# Run in development mode with hot reload
npm run dev

# Test with MCP Inspector
npm test
```

### Production

```bash
# Build the project
npm run build

# Start the server
npm start
```

## Available Tool Categories

### Market Data (Public)
- Get ticker prices
- Get order book depth
- Get recent trades
- Get kline/candlestick data
- Get 24hr statistics
- Get exchange info

### Spot Trading (Requires API Key)
- Place new orders (limit, market, stop-limit)
- Cancel orders
- Get open orders
- Get order status
- Get trade history

### Wallet (Requires API Key)
- Get balances
- Get deposit address
- Get deposit history
- Get withdrawal history
- Withdraw funds

### Account (Requires API Key)
- Get account information
- Get trade history
- Get API key permissions

### Staking
- Get staking products
- Subscribe to staking
- Redeem staking
- Get staking history

### OTC Trading
- Get OTC quotes
- Execute OTC trades

### Sub-Account
- Create sub-account
- Get sub-account list
- Transfer between accounts

### Custodial Solution (Special API Key)
- Custody-specific operations
- Partner integrations

### Credit Line (Special API Key)
- Credit line management
- Institutional features

## Security Best Practices

1. **Never share your API keys** - Treat them like passwords
2. **Use IP restrictions** - Whitelist only trusted IPs in your API settings
3. **Limit permissions** - Only enable the permissions you need
4. **Use separate keys** - Create different keys for different applications
5. **Rotate keys regularly** - Generate new keys periodically
6. **Monitor activity** - Check your account for unauthorized access

## Rate Limits

Binance.US has the following rate limits:

- **Request Weight**: 1200 per minute
- **Orders**: 10 per second, 100,000 per day
- **Raw Requests**: 5000 per 5 minutes

The server handles rate limiting automatically, but be mindful of these limits when making many requests.

## Error Handling

The server returns standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": -1121,
    "msg": "Invalid symbol."
  }
}
```

Common error codes:
- `-1000`: Unknown error
- `-1002`: Unauthorized
- `-1021`: Timestamp outside recvWindow
- `-1022`: Invalid signature
- `-2010`: New order rejected
- `-2011`: Cancel rejected

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## Documentation

Detailed documentation is available in the `docs/` folder:

- [**TOOLS.md**](docs/TOOLS.md) - Complete tools reference with parameters, examples, and responses
- [**API_CLIENT.md**](docs/API_CLIENT.md) - API client architecture, types, and error handling
- [**QUICK_REFERENCE.md**](docs/QUICK_REFERENCE.md) - Fast lookup guide for all tools
- [**TRADING.md**](docs/TRADING.md) - Trading tools and order management (all 13 tools)
- [**TRADING_QUICK_REF.md**](docs/TRADING_QUICK_REF.md) - Trading tools cheat sheet
- [**ERROR_CODES.md**](docs/ERROR_CODES.md) - Complete error code reference with solutions

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Resources

- [Binance.US API Documentation](https://docs.binance.us/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

## Documentation

- [**Tools Reference**](docs/TOOLS_REFERENCE.md) - Complete documentation for all 93 tools
- [**Quick Reference**](docs/QUICK_REFERENCE.md) - Concise tool lookup card
- [**Prompt Examples**](docs/PROMPT_EXAMPLES.md) - Example prompts for Claude
- [**Changelog**](docs/CHANGELOG.md) - Version history and changes

---

## 🌐 Live HTTP Deployment

**Binance US MCP** is deployed and accessible over HTTP via [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport — no local installation required.

**Endpoint:**
```
https://modelcontextprotocol.name/mcp/binance-us-mcp
```

### Connect from any MCP Client

Add to your MCP client configuration (Claude Desktop, Cursor, SperaxOS, etc.):

```json
{
  "mcpServers": {
    "binance-us-mcp": {
      "type": "http",
      "url": "https://modelcontextprotocol.name/mcp/binance-us-mcp"
    }
  }
}
```

### Available Tools (3)

| Tool | Description |
|------|-------------|
| `get_ticker_price` | Get price on Binance.US |
| `get_24h_stats` | 24h statistics |
| `get_order_book` | Order book |

### Example Requests

**Get price on Binance.US:**
```bash
curl -X POST https://modelcontextprotocol.name/mcp/binance-us-mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_ticker_price","arguments":{"symbol":"BTCUSD"}}}'
```

**24h statistics:**
```bash
curl -X POST https://modelcontextprotocol.name/mcp/binance-us-mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_24h_stats","arguments":{"symbol":"ETHUSD"}}}'
```

**Order book:**
```bash
curl -X POST https://modelcontextprotocol.name/mcp/binance-us-mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_order_book","arguments":{"symbol":"BTCUSD","limit":5}}}'
```

### List All Tools

```bash
curl -X POST https://modelcontextprotocol.name/mcp/binance-us-mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Also Available On

- **[SperaxOS](https://speraxos.vercel.app)** — Browse and install from the [MCP marketplace](https://speraxos.vercel.app/community/mcp)
- **All 27 MCP servers** — See the full catalog at [modelcontextprotocol.name](https://modelcontextprotocol.name)

> Powered by [modelcontextprotocol.name](https://modelcontextprotocol.name) — the open MCP HTTP gateway
