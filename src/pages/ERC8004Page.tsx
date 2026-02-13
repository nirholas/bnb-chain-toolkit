/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - ERC-8004 Agent Creator Page
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ✨ Original Author: nich
 * 🐦 Twitter/X: x.com/nichxbt
 * 🐙 GitHub: github.com/nirholas
 * 📦 Repository: github.com/nirholas/bnb-chain-toolkit
 *
 * Copyright (c) 2024-2026 nirholas (nich)
 * Licensed under MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

export default function ERC8004Page() {
  useSEO({
    title: 'ERC-8004 Agent Creator — BNB Chain AI Toolkit',
    description:
      'Create ERC-8004 Trustless Agents on BNB Smart Chain. Register your AI agent on-chain with a portable, censorship-resistant identity.',
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full" style={{ marginTop: '-64px' }}>
      <iframe
        src="/erc8004.html"
        title="ERC-8004 Agent Creator"
        className="w-full border-0"
        style={{
          height: 'calc(100vh + 600px)',
          minHeight: '2000px',
        }}
        allow="clipboard-write"
      />
    </div>
  );
}
