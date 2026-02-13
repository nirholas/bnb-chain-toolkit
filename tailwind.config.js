/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Tailwind Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit | 🌐 https://bnbchaintoolkit.com
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import svgToDataUri from 'mini-svg-data-uri';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/ui/**/*.{tsx,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Menlo', 'monospace'],
      },
      colors: {
        primary: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#171717',
          900: '#000000',
        },
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#18181b',
          900: '#000000',
        },
        // Dark theme colors - all black with subtle variations
        dark: {
          bg: '#000000',
          card: '#0a0a0a',
          elevated: '#111111',
          border: '#1a1a1a',
          'border-light': '#262626',
        },
        // Aceternity UI / shadcn design token colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        accent: {
          DEFAULT: '#F0B90B',
          50: '#FFFDF0',
          100: '#FFF9D6',
          200: '#FFF0A3',
          300: '#FFE670',
          400: '#FFDC3D',
          500: '#F0B90B',
          600: '#C49808',
          700: '#987606',
          800: '#6C5404',
          900: '#403202',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 25px -5px rgba(255, 255, 255, 0.07)',
        'glow-lg': '0 0 35px -5px rgba(255, 255, 255, 0.1)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.1)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'elevation-3': '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.07)',
      },
      backgroundImage: {
        'dot-pattern': `url("${svgToDataUri(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="rgba(255,255,255,0.05)" cx="10" cy="10" r="1.6"></circle></svg>'
        )}")`,
        'grid-pattern': `url("${svgToDataUri(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="rgba(255,255,255,0.03)"><path d="M0 .5H31.5V32"/></svg>'
        )}")`,
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'stagger-1': 'fadeInUp 0.6s ease-out 0.1s both',
        'stagger-2': 'fadeInUp 0.6s ease-out 0.2s both',
        'stagger-3': 'fadeInUp 0.6s ease-out 0.3s both',
        'stagger-4': 'fadeInUp 0.6s ease-out 0.4s both',
        'stagger-5': 'fadeInUp 0.6s ease-out 0.5s both',
        'stagger-6': 'fadeInUp 0.6s ease-out 0.6s both',
        // Aceternity UI animations
        'shimmer': 'shimmer 2s linear infinite',
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'meteor': 'meteor 5s linear infinite',
        'scroll': 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        'move': 'move 5s linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        spotlight: {
          '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: 1, transform: 'translate(-50%, -40%) scale(1)' },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: 0 },
        },
        scroll: {
          to: { transform: 'translate(calc(-50% - 0.5rem))' },
        },
        move: {
          '0%': { transform: 'translateX(-200px)' },
          '100%': { transform: 'translateX(200px)' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
      },
    },
  },
  plugins: [
    // Custom plugin for hiding scrollbars (mobile-friendly horizontal scroll)
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-default': {
          '-ms-overflow-style': 'auto',
          'scrollbar-width': 'auto',
          '&::-webkit-scrollbar': {
            display: 'block',
          },
        },
      });
    },
  ],
}
