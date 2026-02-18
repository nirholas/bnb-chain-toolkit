/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every bug fixed is a lesson learned 🎓
 */

import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Shield,
  Zap,
  Wallet,
  Rocket,
  Home,
  Bot,
  Server,
  BarChart3,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface DocArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface DocCategory {
  id: string;
  title: string;
  icon: React.JSX.Element;
  description: string;
  articles: DocArticle[];
}

const docCategories: DocCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Rocket className="w-6 h-6" />,
    description: 'Install dependencies, configure your first MCP server, and deploy an AI agent on BNB Chain in under 5 minutes.',
    articles: [
      { id: 'intro', title: 'Introduction to BNB Chain AI Toolkit', description: 'Learn what this platform can do for you', readTime: '5 min', difficulty: 'beginner' },
      { id: 'installation', title: 'Installation & Setup', description: 'Install dependencies and build the project', readTime: '5 min', difficulty: 'beginner' },
      { id: 'first-agent', title: 'Your First AI Agent', description: 'Load and use an agent in 10 minutes', readTime: '10 min', difficulty: 'beginner' },
      { id: 'sandbox-basics', title: 'Understanding the Sandbox', description: 'Navigate the interactive development environment', readTime: '7 min', difficulty: 'beginner' },
      { id: 'innovation-mode', title: 'Activating Innovation Mode', description: 'Unlock AI-powered features', readTime: '5 min', difficulty: 'beginner' }
    ]
  },
  {
    id: 'agents',
    title: 'AI Agents',
    icon: <Bot className="w-6 h-6" />,
    description: '78 agent definitions — 36 for BNB Chain protocols + 42 general DeFi agents. Portable JSON format.',
    articles: [
      { id: 'overview', title: 'AI Agents Overview', description: 'What are AI agents and how they work', readTime: '5 min', difficulty: 'beginner' },
      { id: 'bnb-chain-agents', title: 'BNB Chain Agents', description: '36 agents for PancakeSwap, Venus, Lista DAO, Thena, Alpaca, and more', readTime: '15 min', difficulty: 'beginner' },
      { id: 'defi-agents', title: 'DeFi Agents', description: '42 general DeFi agents for trading, yield, and portfolio management', readTime: '15 min', difficulty: 'beginner' },
      { id: 'using-agents', title: 'Using Agents with Claude & ChatGPT', description: 'Load agents into your AI assistant step by step', readTime: '8 min', difficulty: 'beginner' },
      { id: 'agent-format', title: 'Agent JSON Format', description: 'Understand the agent definition schema', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'creating-agents', title: 'Creating Custom Agents', description: 'Build your own agent definitions', readTime: '12 min', difficulty: 'intermediate' },
      { id: 'agent-mcp-integration', title: 'Connecting Agents to MCP Servers', description: 'Give agents real-time data and tools', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'agent-templates', title: 'Agent Templates', description: 'Use templates to scaffold new agents quickly', readTime: '6 min', difficulty: 'beginner' },
      { id: 'agent-best-practices', title: 'Agent Best Practices', description: 'Tips for writing effective system prompts', readTime: '8 min', difficulty: 'intermediate' },
      { id: 'agent-security', title: 'Agent Security Considerations', description: 'Safety guidelines and limitations', readTime: '7 min', difficulty: 'intermediate' },
      { id: 'erc8004-agents', title: 'ERC-8004 On-Chain Agents', description: 'Register agents on-chain for trust and discovery', readTime: '12 min', difficulty: 'advanced' },
      { id: 'agent-faq', title: 'Agent FAQ', description: 'Frequently asked questions about agents', readTime: '5 min', difficulty: 'beginner' }
    ]
  },
  {
    id: 'mcp-servers',
    title: 'MCP Servers',
    icon: <Server className="w-6 h-6" />,
    description: '6 production servers with 1,100+ tools. STDIO + SSE transport.',
    articles: [
      { id: 'overview', title: 'MCP Servers Overview', description: 'What are MCP servers and how they work', readTime: '5 min', difficulty: 'beginner' },
      { id: 'bnbchain-mcp', title: 'bnbchain-mcp', description: 'BNB Chain + EVM server with 384 tools', readTime: '15 min', difficulty: 'intermediate' },
      { id: 'binance-mcp', title: 'binance-mcp', description: 'Binance.com exchange server with 478+ tools', readTime: '15 min', difficulty: 'intermediate' },
      { id: 'binance-us-mcp', title: 'binance-us-mcp', description: 'Binance.US exchange server', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'universal-crypto-mcp', title: 'universal-crypto-mcp', description: 'Multi-network crypto server with 100+ tools', readTime: '12 min', difficulty: 'intermediate' },
      { id: 'agenti', title: 'agenti', description: 'Universal EVM + Solana server', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'ucai', title: 'ucai — ABI-to-MCP Generator', description: 'Generate MCP tools from any smart contract ABI', readTime: '12 min', difficulty: 'advanced' },
      { id: 'claude-desktop', title: 'Connect to Claude Desktop', description: 'Add MCP servers to your Claude config', readTime: '5 min', difficulty: 'beginner' }
    ]
  },
  {
    id: 'market-data',
    title: 'Market Data',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Edge Runtime price feeds and crypto news from 200+ sources. Free API, no auth required.',
    articles: [
      { id: 'overview', title: 'Market Data Overview', description: 'Available data feeds and APIs', readTime: '5 min', difficulty: 'beginner' },
      { id: 'price-feeds', title: 'Price Feeds', description: 'CoinGecko and DeFiLlama price data', readTime: '10 min', difficulty: 'beginner' },
      { id: 'news-api', title: 'Crypto News API', description: '662K+ articles from 200+ sources', readTime: '8 min', difficulty: 'beginner' },
      { id: 'edge-runtime', title: 'Edge Runtime Deployment', description: 'Deploy price feeds at the edge', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'data-sources', title: 'Data Sources', description: 'Where the data comes from and how it is aggregated', readTime: '7 min', difficulty: 'beginner' },
      { id: 'examples', title: 'Usage Examples', description: 'curl, fetch, and SDK examples', readTime: '6 min', difficulty: 'beginner' }
    ]
  },
  {
    id: 'defi-tools',
    title: 'DeFi Tools',
    icon: <Zap className="w-6 h-6" />,
    description: 'Gasless dust sweeper via ERC-4337 across 8 chains with MEV protection.',
    articles: [
      { id: 'overview', title: 'DeFi Tools Overview', description: 'Available DeFi utilities and features', readTime: '5 min', difficulty: 'beginner' },
      { id: 'dust-sweeper', title: 'Dust Sweeper', description: 'Consolidate small balances with gasless transactions', readTime: '12 min', difficulty: 'intermediate' },
      { id: 'mev-protection', title: 'MEV Protection', description: 'CoW Protocol integration for swap protection', readTime: '10 min', difficulty: 'advanced' },
      { id: 'yield-routing', title: 'Yield Routing', description: 'Route into Aave, Yearn, Beefy, Lido yields', readTime: '10 min', difficulty: 'advanced' }
    ]
  },
  {
    id: 'wallets',
    title: 'Wallet Toolkit',
    icon: <Wallet className="w-6 h-6" />,
    description: '57 tools across 5 MCP servers — HD wallets, BIP-39, vanity addresses, signing, transactions. Fully offline.',
    articles: [
      { id: 'overview', title: 'Wallet Toolkit Overview', description: 'All wallet tools and capabilities', readTime: '5 min', difficulty: 'beginner' },
      { id: 'hd-wallets', title: 'HD Wallets & BIP-39', description: 'Hierarchical deterministic wallets and mnemonics', readTime: '12 min', difficulty: 'intermediate' },
      { id: 'vanity-addresses', title: 'Vanity Address Generation', description: 'Generate custom wallet addresses', readTime: '8 min', difficulty: 'intermediate' },
      { id: 'signing', title: 'EIP-191/712 Signing', description: 'Message and typed data signing', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'transactions', title: 'EIP-1559 Transactions', description: 'Build and send transactions offline', readTime: '10 min', difficulty: 'advanced' }
    ]
  },
  {
    id: 'standards',
    title: 'Open Standards',
    icon: <Shield className="w-6 h-6" />,
    description: 'ERC-8004 for AI agent trust verification. W3AG for Web3 accessibility.',
    articles: [
      { id: 'erc-8004', title: 'ERC-8004 Standard', description: 'On-chain identity, reputation, and validation registries for AI agents', readTime: '15 min', difficulty: 'advanced' },
      { id: 'w3ag', title: 'W3AG Accessibility Standard', description: '50+ success criteria for Web3 accessibility', readTime: '12 min', difficulty: 'intermediate' },
      { id: 'contributing', title: 'Contributing to Standards', description: 'How to propose and contribute to open standards', readTime: '8 min', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'architecture',
    title: 'Architecture',
    icon: <Layers className="w-6 h-6" />,
    description: 'Monorepo structure, design decisions, component independence, and how all pieces compose together.',
    articles: [
      { id: 'overview', title: 'Architecture Overview', description: 'High-level system design and component map', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'monorepo', title: 'Monorepo Structure', description: 'How the project is organized', readTime: '8 min', difficulty: 'beginner' },
      { id: 'design-decisions', title: 'Design Decisions', description: 'Why JSON agents, independent MCP servers, and chain-agnostic architecture', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'composability', title: 'Composability', description: 'How components work together and independently', readTime: '8 min', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: <HelpCircle className="w-6 h-6" />,
    description: 'Common issues, error solutions, debugging tips for MCP connections, agent loading, and chain interactions.',
    articles: [
      { id: 'common-issues', title: 'Common Issues', description: 'Most frequently encountered problems and solutions', readTime: '10 min', difficulty: 'beginner' },
      { id: 'mcp-connections', title: 'MCP Connection Issues', description: 'Debugging MCP server connections', readTime: '8 min', difficulty: 'intermediate' },
      { id: 'agent-loading', title: 'Agent Loading Problems', description: 'Troubleshoot agent import and activation', readTime: '7 min', difficulty: 'beginner' },
      { id: 'chain-interactions', title: 'Chain Interaction Errors', description: 'RPC, gas, and transaction debugging', readTime: '10 min', difficulty: 'intermediate' },
      { id: 'build-errors', title: 'Build & Install Errors', description: 'Fix dependency and build issues', readTime: '8 min', difficulty: 'beginner' },
      { id: 'performance', title: 'Performance Optimization', description: 'Speed up agent responses and tool execution', readTime: '7 min', difficulty: 'intermediate' },
      { id: 'faq', title: 'FAQ', description: 'Frequently asked questions', readTime: '5 min', difficulty: 'beginner' }
    ]
  }
];

export default function DocCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = docCategories.find(c => c.id === categoryId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The documentation category you're looking for doesn't exist.
          </p>
          <Link
            to="/docs"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Back to Documentation</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/docs" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Documentation
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">{category.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-[#F0B90B]/20 rounded-xl text-[#F0B90B]">
                {category.icon}
              </div>
              <h1 className="text-3xl md:text-4xl font-black">{category.title}</h1>
            </div>
            <p className="text-xl text-gray-400">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Articles List */}
          <div className="space-y-4">
            {category.articles.map((article, index) => (
              <Link
                key={article.id}
                to={`/docs/${category.id}/${article.id}`}
                className="block bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg hover:shadow-xl transition-all p-6 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-10">
                      {article.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-3 ml-10">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>

          {/* Back Link */}
          <div className="mt-12 text-center">
            <Link
              to="/docs"
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Home className="w-5 h-5" />
              <span>Back to all documentation</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
