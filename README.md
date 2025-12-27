<!--
  ✨ built by nich
  🌐 GitHub: github.com/nirholas
  💫 Persistence beats perfection 🎖️
-->

# Lyra Web3 Playground

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-lyra.works-blue)](https://lyra.works)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)

A browser-based interactive platform for learning blockchain development. Write, compile, and deploy Solidity smart contracts directly in your browser — no setup required.

**🌐 Live at [lyra.works](https://lyra.works)**

---

## ✨ Features

### 🎮 Premium Code Sandbox (NEW!)
- **World-class IDE** comparable to CodePen, JSFiddle, and Remix
- **Web Sandbox**: Multi-file projects with HTML, CSS, JS, React, Vue, Python
- **Solidity IDE**: Full-featured smart contract development environment
- **Split-pane layouts** with draggable resize
- **Device presets** for responsive testing (Desktop/Tablet/Mobile)
- **Auto-run on change** with live preview
- **Console panel** with log/warn/error capture
- **Settings panel**: Theme, font size, Vim mode, auto-save, and more

### 🔧 Solidity Development (NEW!)
- **Multiple Solidity versions** (0.6.x through 0.8.24)
- **Real-time compilation** with error/warning highlighting
- **Deploy to any network** (JS VM, Sepolia, Goerli, Mumbai, Mainnet)
- **Interactive contract UI** - call functions directly
- **Transaction history** with gas tracking
- **Copy ABI/Bytecode** with one click
- **Keyboard shortcuts** (Ctrl+S to compile)

### 🎮 Interactive Code Playground
- Full-featured Solidity editor with syntax highlighting and autocomplete
- Compile contracts in-browser using solc.js
- Deploy to testnets with one click
- Real-time error feedback and gas estimation

### 📚 Smart Contract Templates
- **40+ ready-to-use templates** across categories:
  - ERC-20, ERC-721, ERC-1155 tokens
  - DeFi (staking, vaults, DEX)
  - NFT marketplaces and minting
  - Governance and DAOs
  - Cross-chain bridges

### 📖 Comprehensive Tutorials
- **50+ tutorials** from beginner to advanced [in progress]
- Step-by-step guides with interactive examples
- Topics: Solidity basics, DeFi mechanics, security patterns, gas optimization

### 🔗 Multi-Chain Support
- Ethereum, Base, Polygon, Avalanche, BSC, Arbitrum
- Solana integration
- Monad testnet support

### 🧹 Token Consolidation Tool
- Sweep dust tokens across wallets
- Multi-chain token management
- Gas-efficient batch operations

### 🎨 Modern UI/UX
- Dark/light mode
- Fully responsive design
- Keyboard shortcuts for power users
- Mobile-optimized with bottom navigation

### ♿ Accessibility (NEW!)
- **WCAG 2.1 Level AA** compliant
- **Screen reader support**: ARIA live regions announce all actions
- **Visual feedback**: Toast notifications for deaf/hard-of-hearing users
- **Keyboard navigation**: Full keyboard support with visible focus indicators
- **Skip links**: Jump directly to main content
- **High contrast**: Respects system high-contrast preferences
- **Reduced motion**: Respects `prefers-reduced-motion` settings
- See [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) for full documentation

### 🌐 Community Features (NEW!)
- **Share Projects**: Publish your work with unique shareable links
- **Explore Gallery**: Discover projects, templates, and tutorials from the community
- **Like & Comment**: Engage with other developers' work
- **Fork Projects**: Build on top of others' code
- **Wallet Authentication**: Connect wallet to access community features
- **Embed Code**: Embed shared projects in your own websites

### 📊 Market Data Integration (NEW!)
- **Live Crypto Prices**: Real-time data from CoinGecko
- **DeFi Analytics**: Protocol TVL, yields from DeFiLlama
- **Chain Statistics**: TVL by chain, trending coins
- **Markets Page**: Comprehensive market overview at `/markets`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nirholas/lyra-web3-playground.git
cd play

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
├── src/
│   ├── components/     # React components
│   │   ├── CodePlayground/   # Monaco editor & compiler
│   │   ├── Tutorial/         # Tutorial system
│   │   ├── Sandbox/          # Premium sandbox IDEs
│   │   │   ├── WebSandbox.tsx       # Web dev sandbox
│   │   │   ├── SoliditySandbox.tsx  # Solidity IDE
│   │   │   ├── UnifiedSandbox.tsx   # Generic sandbox wrapper
│   │   │   └── ShareModal.tsx       # Project sharing modal
│   │   ├── Playground/       # Full-stack dApp playground
│   │   └── Consolidation/    # Token consolidation
│   ├── pages/          # Route pages
│   │   ├── SandboxPage.tsx   # Premium IDE selection
│   │   ├── ExplorePage.tsx   # Community project gallery
│   │   ├── SharedProjectPage.tsx  # View shared projects
│   │   ├── MarketsPage.tsx   # Market data dashboard
│   │   └── ExamplePage.tsx   # Example with sandbox toggle
│   ├── services/       # API services
│   │   ├── community.ts      # Sharing, likes, comments, forks
│   │   └── marketData.ts     # CoinGecko & DeFiLlama integration
│   ├── hooks/          # Custom React hooks
│   │   └── useMarketData.ts  # Market data hooks
│   ├── stores/         # Zustand state management
│   ├── examples/       # Code examples (web3, ai)
│   └── utils/          # Helper functions
│       └── contractTemplates.ts  # 40+ contract templates
├── server/             # Backend API (optional)
├── docs/               # Documentation
└── public/             # Static assets
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS |
| Editor | Monaco Editor |
| Web3 | ethers.js v6, viem |
| State | Zustand |
| Testing | Vitest |

---

## 📖 Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [Sandbox Guide](docs/SANDBOX_GUIDE.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Backend API](docs/BACKEND_API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security](docs/SECURITY.md)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Pull request process
- Coding standards

### Good First Issues

Check out issues labeled [`good first issue`](https://github.com/nirholas/lyra-web3-playground/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Remix IDE](https://remix.ethereum.org) for inspiration
- [OpenZeppelin](https://openzeppelin.com) for contract standards
- The Web3 developer community

---

<p align="center">
  <strong>If you find this project useful, please consider giving it a ⭐</strong>
</p>

<p align="center">
  Built with ❤️ by <a href="https://x.com/nichxbt">nich</a>
</p>
