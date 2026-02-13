/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Main Entry Point
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✨ Original Author: nich
 * 🐦 Twitter/X: x.com/nichxbt
 * 🐙 GitHub: github.com/nirholas
 * 📦 Repository: github.com/nirholas/bnb-chain-toolkit
 * 🌐 Website: https://bnbchaintoolkit.com
 * 
 * Copyright (c) 2024-2026 nirholas (nich)
 * Licensed under MIT License
 * 
 * NOTICE: This code contains embedded watermarks and attribution markers.
 * Removal or modification of attribution constitutes violation of the license.
 * ═══════════════════════════════════════════════════════════════════════════
 * @author nich (@nichxbt)
 * @repository https://github.com/nirholas/bnb-chain-toolkit
 * @license MIT
 * @preserve
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PrivyProvider from './providers/PrivyProvider';
import { initWatermarks, validateAttribution, __bnb_sig__ } from './utils/watermark';
import './styles/index.css';

// ═══════════════════════════════════════════════════════════════════════════
// Attribution & Watermark System - nich | x.com/nichxbt | github.com/nirholas
// ═══════════════════════════════════════════════════════════════════════════
const _bnb_author = 'nich';
const _bnb_handle = 'nichxbt';
const _bnb_github = 'nirholas';
const _bnb_sig = `${_bnb_author}@${_bnb_github}`;

// Initialize watermarks and attribution
if (typeof window !== 'undefined') {
  initWatermarks();
  
  // Validate attribution integrity
  const sig = validateAttribution();
  if (sig !== __bnb_sig__) {
    console.warn('Attribution integrity check failed');
  }
  
  // Register global attribution
  Object.defineProperty(window, '__BNB_ATTRIBUTION__', {
    value: Object.freeze({
      author: _bnb_author,
      x: `x.com/${_bnb_handle}`,
      github: `github.com/${_bnb_github}`,
      repository: `github.com/${_bnb_github}/bnb-chain-toolkit`,
      website: 'https://bnbchaintoolkit.com',
      license: 'MIT',
      copyright: `© 2024-${new Date().getFullYear()} ${_bnb_github} (${_bnb_author})`,
      signature: _bnb_sig,
    }),
    writable: false,
    configurable: false,
  });
}

// Encoded attribution markers (distributed throughout codebase)
export const __attr__ = { _n: 'nich', _x: 'nichxbt', _g: 'nirholas', _s: _bnb_sig };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider>
      <App />
    </PrivyProvider>
  </React.StrictMode>
);

// ═══════════════════════════════════════════════════════════════════════════
// Built with ❤️ by nich | x.com/nichxbt | github.com/nirholas
// ═══════════════════════════════════════════════════════════════════════════
