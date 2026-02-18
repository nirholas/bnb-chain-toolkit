/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Your potential is limitless 🌌
 */

import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import useI18n from '@/stores/i18nStore';
import { SparklesCore } from "@/components/ui/sparkles";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Spotlight } from "@/components/ui/spotlight";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { MovingBorder } from "@/components/ui/moving-border";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import {
  Star,
  GitPullRequest,
  Bug,
  Lightbulb,
  Twitter,
  ExternalLink,
  Users,
  BookOpen,
  Rocket,
  Globe,
  Bot,
  Server,
  Wrench,
  Shield,
  Terminal,
  FileText,
  Languages,
} from "lucide-react";

const contributeWays = [
  {
    icon: Star,
    title: "Star the Repository",
    description:
      "Show your support and help others discover the project. A star on GitHub goes a long way.",
    link: "https://github.com/nirholas/bnb-chain-toolkit",
    linkLabel: "Star on GitHub",
    external: true,
  },
  {
    icon: GitPullRequest,
    title: "Submit a Pull Request",
    description:
      "Found a bug or have an improvement? Fork the repo, make your changes, and open a PR. All contributions are welcome.",
    link: "https://github.com/nirholas/bnb-chain-toolkit/pulls",
    linkLabel: "Open a PR",
    external: true,
  },
  {
    icon: Bug,
    title: "Report Issues",
    description:
      "Encountered a problem? Open a GitHub issue with clear reproduction steps and we will look into it.",
    link: "https://github.com/nirholas/bnb-chain-toolkit/issues",
    linkLabel: "Report a Bug",
    external: true,
  },
  {
    icon: Lightbulb,
    title: "Suggest Features",
    description:
      "Have an idea for a new agent, tool, or integration? Start a discussion and let the community weigh in.",
    link: "https://github.com/nirholas/bnb-chain-toolkit/discussions",
    linkLabel: "Start a Discussion",
    external: true,
  },
  {
    icon: Twitter,
    title: "Spread the Word",
    description:
      "Follow @nichxbt on Twitter for updates, share your builds, and tag the project to help grow the community.",
    link: "https://x.com/nichxbt",
    linkLabel: "Follow @nichxbt",
    external: true,
  },
  {
    icon: Rocket,
    title: "Build with the Toolkit",
    description:
      "Use the agents, MCP servers, and tools in your own projects. 1,100+ tools ready for production.",
    link: "/explore",
    linkLabel: "Explore Components",
    external: false,
  },
];

// Scrolling project stats feed
const projectHighlights = [
  { quote: "78 portable JSON agent definitions covering BNB Chain, DeFi, and general crypto", name: "AI Agents", title: "36 BNB Chain + 42 DeFi", icon: <Bot className="w-5 h-5" /> },
  { quote: "6 MCP servers providing 1,100+ tools — the largest open-source Web3 MCP collection", name: "MCP Servers", title: "TypeScript + Python", icon: <Server className="w-5 h-5" /> },
  { quote: "binance-mcp alone has 478+ tools — spot, futures, options, algo orders, copy trading, NFTs", name: "Binance MCP", title: "478+ tools", icon: <Wrench className="w-5 h-5" /> },
  { quote: "Supports 60+ blockchain networks with multi-aggregator DEX, lending, bridges, and x402 payments", name: "Universal Crypto", title: "380+ tools, 60+ chains", icon: <Globe className="w-5 h-5" /> },
  { quote: "ucai — generate custom MCP tools from any ABI. Registered in Anthropic's MCP Registry", name: "ABI → MCP", title: "pip install abi-to-mcp", icon: <Terminal className="w-5 h-5" /> },
  { quote: "57-tool wallet toolkit with 348 tests, BIP-39/BIP-32, offline HTML — zero network dependencies", name: "Wallet Toolkit", title: "Fully offline", icon: <Shield className="w-5 h-5" /> },
  { quote: "W3AG and ERC-8004 standards — deployed on Ethereum mainnet for agent trust verification", name: "Open Standards", title: "ERC-8004 live", icon: <FileText className="w-5 h-5" /> },
  { quote: "Agent definitions translated into 30+ languages including Japanese, Korean, Arabic, Hindi", name: "Internationalization", title: "30+ locales", icon: <Languages className="w-5 h-5" /> },
];

const topContributors = [
  { name: "nich", role: "Creator & Maintainer", avatar: "N", url: "https://github.com/nirholas" },
];

const helpNeeded = [
  { title: "Add agent definitions for new BNB Chain protocols (78 agents → 100+)", label: "agents", difficulty: "Easy" },
  { title: "Write tests for bnbchain-mcp and binance-mcp servers", label: "testing", difficulty: "Medium" },
  { title: "Translate agent definitions — 30+ locales exist, more welcome", label: "i18n", difficulty: "Easy" },
  { title: "Create tutorials for MCP + Claude Desktop integration", label: "docs", difficulty: "Easy" },
  { title: "Add new tool categories to universal-crypto-mcp (380+ tools)", label: "mcp", difficulty: "Hard" },
  { title: "Build example apps using Dust Sweeper ERC-4337 API", label: "examples", difficulty: "Medium" },
  { title: "Implement ucai Pro templates (Flash Loan, MEV Bundle)", label: "python", difficulty: "Hard" },
  { title: "Add more security detections to ucai (50+ currently)", label: "security", difficulty: "Medium" },
  { title: "Improve W3AG accessibility checker — 50+ criteria", label: "standards", difficulty: "Medium" },
  { title: "Add agenti Solana tool coverage (Jupiter, Raydium)", label: "solana", difficulty: "Hard" },
];

const _difficultyColors: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-500",
  Medium: "bg-yellow-500/10 text-yellow-500",
  Hard: "bg-red-500/10 text-red-500",
};

export default function CommunityPage() {
  const { t } = useI18n();

  useSEO({
    title: "Community",
    description:
      "Join the BNB Chain AI Toolkit community — contribute to 78 agents, 6 MCP servers, and 1,100+ tools.",
    path: "/community",
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero with Sparkles */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            minSize={0.4}
            maxSize={1}
            particleDensity={40}
            particleColor="#F0B90B"
            className="w-full h-full"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <TextGenerateEffect
            words={t('community.hero_title')}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('community.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Project Highlights — Scrolling Feed */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t('community.contributing_to')}
          </h2>
          <InfiniteMovingCards
            items={projectHighlights}
            direction="left"
            speed="slow"
            pauseOnHover
          />
        </div>
      </section>

      {/* Ways to Contribute — BackgroundGradient cards */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">{t('community.ways_to_contribute')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributeWays.map((item) => {
              const Icon = item.icon;
              return (
                <BackgroundGradient
                  key={item.title}
                  className="rounded-2xl p-6 bg-white dark:bg-black flex flex-col"
                >
                  <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-[#F0B90B] w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">
                    {item.description}
                  </p>
                  {item.external ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F0B90B] hover:underline"
                    >
                      {item.linkLabel}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F0B90B] hover:underline"
                    >
                      {item.linkLabel}
                    </Link>
                  )}
                </BackgroundGradient>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contributors — 3D Card */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">{t('community.contributors')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topContributors.map((contributor) => (
              <CardContainer key={contributor.name} containerClassName="py-0">
                <CardBody className="relative group/card rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-white dark:bg-black h-full">
                  <CardItem translateZ="40">
                    <a
                      href={contributor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F0B90B] to-yellow-600 flex items-center justify-center text-black font-bold text-lg shrink-0">
                        {contributor.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{contributor.name}</div>
                        <div className="text-sm text-gray-500">{contributor.role}</div>
                      </div>
                    </a>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
            <CardContainer containerClassName="py-0">
              <CardBody className="relative group/card flex items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-5 text-gray-400 dark:text-gray-600 h-full">
                <CardItem translateZ="30">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Your name here</p>
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </section>

      {/* What Needs Help — HoverEffect + MovingBorder CTA */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t('community.needs_help')}</h2>
          <p className="text-sm text-gray-500 mb-8">
            Good first issues and advanced tasks — pick what fits your skills.
          </p>
          <HoverEffect
            items={helpNeeded.map((item) => ({
              title: `${item.title}`,
              description: `${item.difficulty} • ${item.label}`,
              link: "https://github.com/nirholas/bnb-chain-toolkit/issues",
            }))}
          />
          <div className="mt-10 text-center">
            <MovingBorder
              as="a"
              duration={3}
              containerClassName="h-12"
              className="bg-[#F0B90B] text-black font-semibold"
              {...{ href: "https://github.com/nirholas/bnb-chain-toolkit/blob/main/CONTRIBUTING.md", target: "_blank", rel: "noopener noreferrer" } as any}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read Contributing Guide
            </MovingBorder>
          </div>
        </div>
      </section>
    </main>
  );
}
