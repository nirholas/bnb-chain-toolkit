/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 You're part of something special 🎪
 */

import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import {
  Github,
  Twitter,
  Code2,
  Layers,
  Shield,
  Globe,
  Languages,
  BookOpen,
  ExternalLink,
  Heart,
} from "lucide-react";

const stats = [
  { value: "72+", label: "AI Agents", icon: Code2 },
  { value: "6", label: "MCP Servers", icon: Layers },
  { value: "900+", label: "Tools", icon: Shield },
  { value: "60+", label: "Chains", icon: Globe },
  { value: "30+", label: "Languages", icon: Languages },
  { value: "2", label: "Standards", icon: BookOpen },
];

const techStack = [
  { name: "React", url: "https://react.dev" },
  { name: "TypeScript", url: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com" },
  { name: "Vite", url: "https://vitejs.dev" },
  { name: "ethers.js", url: "https://docs.ethers.org" },
  { name: "viem", url: "https://viem.sh" },
  { name: "Zustand", url: "https://zustand-demo.pmnd.rs" },
  { name: "Framer Motion", url: "https://www.framer.com/motion" },
];

export default function AboutPage() {
  useSEO({
    title: "About",
    description:
      "Learn about BNB Chain AI Toolkit — 72+ AI agents, 6 MCP servers, and 900+ tools for BNB Chain and 60+ networks.",
    path: "/about",
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <TextGenerateEffect
            words="Built for BNB Chain. Built by the Community."
            className="text-4xl md:text-5xl font-bold tracking-tight"
          />
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            An open-source AI toolkit that makes blockchain development
            accessible, intelligent, and composable — across BNB Chain and 60+
            networks.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Mission</h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            <p>
              We believe AI should be a force multiplier for every Web3
              developer. The BNB Chain AI Toolkit provides pre-built agent
              definitions, Model Context Protocol servers, and hundreds of
              composable tools — so builders can focus on what matters rather
              than re-inventing infrastructure.
            </p>
            <p>
              Whether you&apos;re tracking whale wallets on BSC, bridging assets
              through opBNB, staking BNB, or generating smart contracts with AI
              — every capability is one import away. No vendor lock-in. No
              closed ecosystems. Just open-source tools that work.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <Icon className="w-6 h-6 mx-auto mb-3 text-[#F0B90B] group-hover:scale-110 transition-transform" />
                  <div className="text-3xl md:text-4xl font-bold tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Author */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Author</h2>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F0B90B] to-yellow-600 flex items-center justify-center text-black text-2xl font-bold shrink-0">
              N
            </div>
            <div>
              <h3 className="text-xl font-semibold">nich</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Independent builder. Focused on open-source AI and Web3
                infrastructure for the BNB Chain ecosystem.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://x.com/nichxbt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#F0B90B] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  @nichxbt
                </a>
                <a
                  href="https://github.com/nirholas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#F0B90B] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  nirholas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group rounded-2xl border border-gray-200 dark:border-white/10 p-5",
                  "hover:border-[#F0B90B]/50 dark:hover:border-white/20 transition-all duration-200",
                  "flex items-center justify-between"
                )}
              >
                <span className="font-medium">{tech.name}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#F0B90B] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-10 h-10 mx-auto mb-6 text-[#F0B90B]" />
          <h2 className="text-3xl font-bold mb-4">Open Source, Always</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
            BNB Chain AI Toolkit is released under the MIT License. Every agent
            definition, every MCP server, every tool — free to use, modify, and
            distribute. Contributions are welcome and appreciated.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/nirholas/bnb-chain-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F0B90B] text-black font-semibold hover:bg-[#F0B90B]/90 transition-colors"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 font-semibold hover:border-[#F0B90B]/50 transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
