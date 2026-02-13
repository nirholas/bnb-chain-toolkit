/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 You're doing incredible things 🎯
 */

import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import WebSandbox from '@/components/Sandbox/WebSandbox';
import SoliditySandbox from '@/components/Sandbox/SoliditySandbox';
import { Code2, FileCode, Layers, Sparkles, Zap, Globe, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/utils/helpers';

type SandboxType = 'web' | 'solidity' | null;

export default function SandboxPage() {
  useSEO({
    title: 'IDE - Online Solidity & Web Development',
    description: 'Free browser-based IDE for Solidity and web development. Compile smart contracts, deploy to testnets, and build full-stack dApps with live preview.',
    path: '/ide'
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const [selectedType, setSelectedType] = useState<SandboxType>(
    typeParam === 'web' || typeParam === 'solidity' ? typeParam : null
  );

  const selectType = (type: SandboxType) => {
    setSelectedType(type);
    if (type) {
      setSearchParams({ type });
    }
  };

  // If a type is selected, show that sandbox
  if (selectedType === 'web') {
    return <WebSandbox />;
  }

  if (selectedType === 'solidity') {
    return <SoliditySandbox />;
  }

  // Otherwise, show the selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black text-white">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-12 px-4 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-gray-800">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <div className="ml-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">BNB Chain UDE</span>
        </div>
      </header>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span>60+ Templates</span>
            <span className="mx-1 text-white/40">·</span>
            <span>Premium Development Environment</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">
              Code Sandbox
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A world-class development environment. Write, compile, deploy, and test
            your code in real-time with instant previews and professional tools.
          </p>
        </div>

        {/* Sandbox Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Web Sandbox */}
          <button
            onClick={() => selectType('web')}
            className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-left hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-black" />
              </div>
            </div>
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold group-hover:text-white transition-colors">
                  Web Sandbox
                </h2>
                <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white">15 templates</span>
              </div>
              <p className="text-gray-400 mb-6">
                Build web applications with HTML, CSS, JavaScript, React, Vue, Python, and more.
                Real-time preview with hot reloading.
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                {[
                  'Multi-file project support',
                  'Live preview with hot reload',
                  'React & Vue support',
                  'Python execution (Pyodide)',
                  'Console & DevTools',
                  'Export & share projects'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-white/50" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Languages */}
              <div className="flex flex-wrap gap-2">
                {['HTML', 'CSS', 'JS', 'React', 'Vue', 'Python'].map(lang => (
                  <span
                    key={lang}
                    className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md border border-white/10"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Arrow */}
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Solidity Sandbox */}
          <button
            onClick={() => selectType('solidity')}
            className="group relative bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-left hover:border-purple-500/50 hover:bg-[#0a0a0a]/70 transition-all duration-300 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                <FileCode className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Content */}
            <div className="relative">
              <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                Solidity UDE
              </h2>
              <p className="text-gray-400 mb-6">
                Build smart contracts with our professional Solidity development environment.
                Better than Remix.
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                {[
                  'Multiple compiler versions',
                  'Real-time compilation',
                  'Deploy to testnet/mainnet',
                  'Contract interaction UI',
                  'Transaction history',
                  'ABI & bytecode export'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-white/50" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {['Solidity', 'EVM', 'Web3', 'Ethereum', 'Polygon'].map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Arrow */}
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </button>
        </div>

        {/* Template Showcase */}
        <div className="mt-16 w-full max-w-5xl">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Start from a Template</h2>
                <p className="text-gray-400 mt-1">60+ ready-to-use templates across all categories</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-white text-black rounded-full text-sm font-bold">15 Web</span>
                <span className="px-3 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium border border-white/20">42 Contracts</span>
                <span className="px-3 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium border border-white/20">6 Workspace</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'ERC-20 Token', category: 'Token', icon: '🪙' },
                { name: 'NFT Collection', category: 'NFT', icon: '🖼️' },
                { name: 'DeFi Staking', category: 'DeFi', icon: '📈' },
                { name: 'DAO Governance', category: 'DAO', icon: '🏛️' },
                { name: 'React dApp', category: 'Web3', icon: '⚛️' },
                { name: 'Wallet Connect', category: 'Web3', icon: '👛' },
                { name: 'DEX Swap', category: 'DeFi', icon: '🔄' },
                { name: 'MultiSig Wallet', category: 'Security', icon: '🔒' },
              ].map((t, i) => (
                <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-3 cursor-pointer transition-all group">
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <div className="text-sm font-medium text-white group-hover:text-white">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.category}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">Choose a sandbox above to browse all templates →</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '60+', label: 'Templates' },
            { value: '10+', label: 'Languages' },
            { value: '0.8.24', label: 'Solidity' },
            { value: '∞', label: 'Possibilities' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          <p>Built with ❤️ for developers who demand the best</p>
        </div>
      </div>
    </div>
  );
}
