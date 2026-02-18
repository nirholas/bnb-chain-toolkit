/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Vite Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit | 🌐 https://bnb-chain-toolkit.vercel.app
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Banner injected into all built JS files - nich | x.com/nichxbt | github.com/nirholas
const banner = `/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - https://bnb-chain-toolkit.vercel.app
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit
 * Copyright (c) 2024-${new Date().getFullYear()} nirholas (nich) - MIT License
 * 
 * NOTICE: This code contains embedded watermarks and attribution markers.
 * Removal or modification of attribution constitutes violation of the license.
 * ═══════════════════════════════════════════════════════════════════════════
 * @author nich (@nichxbt)
 * @repository https://github.com/nirholas/bnb-chain-toolkit
 * @preserve
 */`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdn.tailwindcss.com https://esm.sh https://binaries.soliditylang.org; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: ws: wss:; worker-src 'self' blob:; frame-src 'self' blob:; frame-ancestors 'self'; manifest-src 'self'",
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress /*#__PURE__*/ annotation warnings from third-party packages
        if (warning.code === 'SOURCEMAP_ERROR' || warning.message?.includes('/*#__PURE__*/')) return
        warn(warning)
      },
      output: {
        banner,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'web3-vendor': ['ethers', 'viem'],
          'solana': ['@solana/web3.js'],
          'privy': ['@privy-io/react-auth'],
          'ui-vendor': ['lucide-react', '@icons-pack/react-simple-icons', 'clsx', 'tailwind-merge'],
          'monaco': ['@monaco-editor/react', 'monaco-editor'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@solana/web3.js'],
    entries: [
      'index.html',
      'public/erc8004.html',
      'src/**/*.{ts,tsx}',
    ],
  },
})
