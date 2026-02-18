# Market Data Guide

How to use the market data components for real-time crypto prices, news, and analytics.

---

## Overview

The toolkit includes two market data components:

| Component | What It Does | Sources |
|-----------|-------------|---------|
| **Crypto Market Data** | Prices, market caps, TVL, sentiment | CoinGecko, DeFiLlama, Alternative.me |
| **Crypto News** | Headlines from 200+ sources | RSS, APIs, scraping |

---

## Crypto Market Data

**Location:** `market-data/crypto-market-data/`

A zero-dependency TypeScript library for fetching cryptocurrency market data.

### Features

- **CoinGecko** — Prices, market caps, trading volume, historical data
- **DeFiLlama** — Total Value Locked (TVL), protocol data, yields
- **Fear & Greed Index** — Market sentiment (0-100 scale)
- Smart caching with configurable TTL
- Automatic rate limiting with retry
- Edge Runtime compatible (Cloudflare Workers, Vercel Edge)

### Quick Start

```typescript
import { CoinGecko, DeFiLlama, FearAndGreed } from '@nirholas/crypto-market-data';

// Get Bitcoin price
const btc = await CoinGecko.getPrice('bitcoin');
console.log(`BTC: $${btc.usd}`);

// Get BNB Chain TVL
const bnbTvl = await DeFiLlama.getProtocolTvl('binance');
console.log(`BNB Chain TVL: $${bnbTvl}`);

// Get market sentiment
const sentiment = await FearAndGreed.getIndex();
console.log(`Market sentiment: ${sentiment.value} (${sentiment.classification})`);
```

### Configuration

```typescript
const client = new CoinGecko({
  cacheTtl: 60_000,        // Cache for 60 seconds
  maxRetries: 3,            // Retry up to 3 times
  rateLimit: 10,            // 10 requests per second
});
```

### Available Methods

| Provider | Method | Description |
|----------|--------|-------------|
| CoinGecko | `getPrice(id)` | Current price in USD |
| CoinGecko | `getMarketData(id)` | Full market data (cap, volume, supply) |
| CoinGecko | `getHistorical(id, days)` | Historical prices |
| CoinGecko | `getTrending()` | Trending coins |
| CoinGecko | `search(query)` | Search for coins |
| DeFiLlama | `getProtocolTvl(name)` | TVL for a protocol |
| DeFiLlama | `getChainTvl(chain)` | TVL for a chain |
| DeFiLlama | `getYields()` | Yield farming opportunities |
| FearAndGreed | `getIndex()` | Current fear/greed score |
| FearAndGreed | `getHistorical(days)` | Historical sentiment |

---

## Crypto News

**Location:** `market-data/crypto-news/`

A comprehensive crypto news aggregator with 200+ sources and 150+ API endpoints.

### Features

- 200+ news sources (CoinDesk, CoinTelegraph, The Block, Decrypt, etc.)
- 150+ REST API endpoints
- Real-time news streaming
- Sentiment analysis per article
- MCP server included for AI integration
- CLI tool for terminal-based reading
- 30+-language README support

### Quick Start

```bash
cd market-data/crypto-news
bun install
bun start
```

The API server starts on `http://localhost:3000`.

### API Endpoints (Examples)

```bash
# Get latest headlines
GET /api/news/latest

# Search for BNB Chain news
GET /api/news/search?q=bnb+chain

# Get news by category
GET /api/news/category/defi

# Get sentiment analysis
GET /api/news/sentiment?q=bitcoin

# Get trending topics
GET /api/news/trending
```

### As an MCP Server

```json
{
  "mcpServers": {
    "crypto-news": {
      "command": "node",
      "args": ["market-data/crypto-news/dist/mcp-server.js"]
    }
  }
}
```

---

## Use Cases

### Portfolio Dashboard

```typescript
import { CoinGecko } from '@nirholas/crypto-market-data';

// Track a portfolio
const portfolio = ['bitcoin', 'binancecoin', 'ethereum'];
const prices = await Promise.all(
  portfolio.map(id => CoinGecko.getPrice(id))
);
```

### Trading Signals

Combine market data with news sentiment:

```typescript
// If fear & greed is "Extreme Fear" AND prices are down 10%+
// → Potential buying opportunity

const sentiment = await FearAndGreed.getIndex();
const btcData = await CoinGecko.getMarketData('bitcoin');

if (sentiment.value < 20 && btcData.price_change_24h < -10) {
  console.log('🟢 Potential buying signal');
}
```

### News Monitoring

```typescript
// Set up alerts for BNB Chain news
const news = await fetch('http://localhost:3000/api/news/search?q=bnb+chain');
const articles = await news.json();
articles.forEach(article => {
  console.log(`[${article.sentiment}] ${article.title}`);
});
```

---

## See Also

- [Getting Started](getting-started.md) — Initial setup
- [Agents](agents.md) — AI agents that use market data
- [Examples](examples.md) — More usage patterns
