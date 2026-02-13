/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Your potential is limitless 🌌
 */

import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";
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
      "Use the agents, MCP servers, and tools in your own projects. Share what you build — we love seeing it.",
    link: "/explore",
    linkLabel: "Explore Components",
    external: false,
  },
];

const topContributors = [
  { name: "nich", role: "Creator & Maintainer", avatar: "N", url: "https://github.com/nirholas" },
];

const helpNeeded = [
  { title: "Add more BNB Chain agent definitions", label: "agents" },
  { title: "Improve MCP server test coverage", label: "testing" },
  { title: "Translate agent definitions to more languages", label: "i18n" },
  { title: "Write getting started tutorials", label: "docs" },
  { title: "Build example projects using the toolkit", label: "examples" },
];

export default function CommunityPage() {
  useSEO({
    title: "Community",
    description:
      "Join the BNB Chain AI Toolkit community — contribute on GitHub, follow on Twitter, and help build the future of AI-powered Web3.",
    path: "/community",
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero with Sparkles */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Join the Community
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            BNB Chain AI Toolkit is built in the open. Every star, PR, issue
            report, and shared build makes the project better for everyone.
          </p>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Ways to Contribute</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contributeWays.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={cn(
                    "group rounded-2xl border border-gray-200 dark:border-white/10 p-6",
                    "bg-white dark:bg-black",
                    "hover:border-[#F0B90B]/40 dark:hover:border-white/20",
                    "transition-all duration-200 flex flex-col"
                  )}
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Contributors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topContributors.map((contributor) => (
              <a
                key={contributor.name}
                href={contributor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-white/10 p-5",
                  "hover:border-[#F0B90B]/40 dark:hover:border-white/20 transition-all duration-200"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F0B90B] to-yellow-600 flex items-center justify-center text-black font-bold text-lg shrink-0">
                  {contributor.avatar}
                </div>
                <div>
                  <div className="font-semibold">{contributor.name}</div>
                  <div className="text-sm text-gray-500">{contributor.role}</div>
                </div>
              </a>
            ))}
            <div
              className={cn(
                "flex items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-5",
                "text-gray-400 dark:text-gray-600"
              )}
            >
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Your name here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Needs Help */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">What Needs Help</h2>
          <div className="space-y-3">
            {helpNeeded.map((item) => (
              <div
                key={item.title}
                className={cn(
                  "flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/10 p-4",
                  "bg-white dark:bg-black"
                )}
              >
                <span className="text-sm">{item.title}</span>
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-[#F0B90B]/10 text-[#F0B90B] font-medium shrink-0 ml-4">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://github.com/nirholas/bnb-chain-toolkit/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F0B90B] text-black font-semibold hover:bg-[#F0B90B]/90 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Read Contributing Guide
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
