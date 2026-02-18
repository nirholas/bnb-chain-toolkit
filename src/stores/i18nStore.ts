/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Innovation starts with a single keystroke ⌨️
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'es' | 'zh' | 'fr' | 'de' | 'ja' | 'ko' | 'pt' | 'ru' | 'ar';

/**
 * Lazy-load static locale JSON files.
 * Vite will code-split each locale into its own chunk.
 */
const localeLoaders: Record<Exclude<Language, 'en'>, () => Promise<{ default: Record<string, string> }>> = {
  es: () => import('@/locales/es.json'),
  zh: () => import('@/locales/zh.json'),
  fr: () => import('@/locales/fr.json'),
  de: () => import('@/locales/de.json'),
  ja: () => import('@/locales/ja.json'),
  ko: () => import('@/locales/ko.json'),
  pt: () => import('@/locales/pt.json'),
  ru: () => import('@/locales/ru.json'),
  ar: () => import('@/locales/ar.json'),
};

interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const languages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true }
];

// Base English translations (source of truth)
export const baseTranslations: Record<string, string> = {
    // Navigation
    'nav.home': 'Home',
    'nav.examples': 'Examples',
    'nav.playground': 'Playground',
    'nav.sandbox': 'Sandbox',
    'nav.docs': 'Documentation',
    'nav.tutorials': 'Tutorials',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.community': 'Community',
    'nav.settings': 'Settings',
    
    // Hero
    'hero.title': 'Learn Web3 Development',
    'hero.subtitle': 'The Interactive Way',
    'hero.description': 'Build, deploy, and understand smart contracts with AI-powered tools and interactive tutorials.',
    'hero.cta.start': 'Start Building',
    'hero.cta.explore': 'Explore Examples',
    
    // Features
    'features.title': 'Revolutionary Features',
    'features.ai.title': 'AI Code Whisperer',
    'features.ai.description': 'Real-time AI analysis with voice control',
    'features.timemachine.title': 'Time Machine',
    'features.timemachine.description': 'Travel through code evolution',
    'features.exploit.title': 'Exploit Lab',
    'features.exploit.description': 'Learn security by hacking safely',
    'features.arena.title': 'Collaborative Arena',
    'features.arena.description': 'Code with AI teammates',
    'features.neural.title': 'Neural Gas Oracle',
    'features.neural.description': 'ML-powered gas optimization',
    'features.crosschain.title': 'Cross-Chain Deploy',
    'features.crosschain.description': 'Deploy to 8+ networks instantly',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.learn_more': 'Learn More',
    'common.get_started': 'Get Started',
    
    // Sandbox
    'sandbox.compile': 'Compile',
    'sandbox.deploy': 'Deploy',
    'sandbox.compiling': 'Compiling...',
    'sandbox.deploying': 'Deploying...',
    'sandbox.console': 'Console',
    'sandbox.files': 'Files',
    'sandbox.interaction': 'Interact',
    'sandbox.innovation': 'Innovation Mode',
    'sandbox.activate_innovation': 'Activate Innovation',
    
    // About
    'about.title': 'About Us',
    'about.mission': 'Our Mission',
    'about.vision': 'Our Vision',
    'about.team': 'Meet the Team',
    'about.values': 'Our Values',
    'about.join': 'Join Our Mission',
    
    // Docs
    'docs.title': 'Documentation',
    'docs.search_placeholder': 'Search documentation...',
    'docs.getting_started': 'Getting Started',
    'docs.quick_links': 'Quick Links',
    'docs.read_time': 'min read',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'System',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    
    // Explore Page
    'explore.title': 'Explore the Community',
    'explore.subtitle': 'Discover shared projects, templates, and tutorials from developers around the world',
    'explore.search_placeholder': 'Search projects, templates, tutorials...',
    'explore.no_projects': 'No projects found',
    'explore.be_first': 'Be the first to share something!',
    'explore.create_project': 'Create a Project',
    'explore.showing': 'Showing {count} of {total} projects',
    
    // Categories
    'category.all': 'All',
    'category.sandbox': 'Sandboxes',
    'category.template': 'Templates',
    'category.tutorial': 'Tutorials',
    'category.example': 'Examples',
    
    // Sort
    'sort.recent': 'Most Recent',
    'sort.popular': 'Most Viewed',
    'sort.likes': 'Most Liked',
    
    // Tutorial Page
    'tutorial.difficulty': 'Difficulty',
    'tutorial.duration': 'Duration',
    'tutorial.prerequisites': 'Prerequisites',
    'tutorial.start': 'Start Tutorial',
    'tutorial.continue': 'Continue',
    'tutorial.complete': 'Complete',
    'tutorial.step': 'Step {current} of {total}',
    
    // Markets Page
    'markets.title': 'Live Markets',
    'markets.price': 'Price',
    'markets.change_24h': '24h Change',
    'markets.volume': 'Volume',
    'markets.market_cap': 'Market Cap',
    
    // DeFi
    'defi.analytics': 'Live DeFi Analytics',
    'defi.tvl': 'Total Value Locked',
    'defi.protocols': 'Top Protocols',
    'defi.learn_build': 'Learn How to Build This',
    
    // Auth
    'auth.connect_wallet': 'Connect Wallet',
    'auth.disconnect': 'Disconnect',
    'auth.sign_in': 'Sign In',
    'auth.sign_out': 'Sign Out',
    
    // Errors
    'error.generic': 'Something went wrong',
    'error.not_found': 'Page not found',
    'error.network': 'Network error',
    'error.try_again': 'Try Again',

    // Homepage
    'home.hero.tagline': '78 AI Agents · 6 MCP Servers · 1,100+ Tools · One Repo',
    'home.how_it_works': 'How It Works',
    'home.how_it_works_sub': 'Give any AI model direct access to BNB Chain in three steps.',
    'home.step1.title': 'Pick an Agent',
    'home.step1.desc': 'Choose from 78 pre-built agents — each one is a JSON file tuned for a specific protocol like PancakeSwap, Venus, or Binance Futures.',
    'home.step1.link': 'Browse Agents',
    'home.step2.title': 'Connect MCP Servers',
    'home.step2.desc': 'Point Claude, ChatGPT, or any LLM at one of 6 MCP servers. Your AI can now read on-chain data, fetch prices, and interact with protocols.',
    'home.step2.link': 'View Servers',
    'home.step3.title': 'Execute On-Chain',
    'home.step3.desc': '1,100+ tools across multiple networks — swap tokens, check yields, audit contracts, track wallets. All through natural language.',
    'home.step3.link': 'Read Docs',
    'home.explore': 'Explore the Toolkit',
    'home.create_erc8004': 'Create ERC-8004 Agent',
    'home.start_building': 'Start Building',
    'home.star_github': 'Star on GitHub',
    'home.mcp.badge': 'Model Context Protocol',
    'home.mcp.title': '6 MCP Servers, 1,100+ Tools',
    'home.mcp.subtitle': 'Give AI assistants direct blockchain access. Connect Claude, ChatGPT, or any LLM to BNB Chain, Binance, and multiple networks.',
    'home.agents.badge': '78 Specialized Agents',
    'home.agents.title': 'Pre-Built AI Agents for Every Protocol',
    'home.agents.subtitle': 'From PancakeSwap trading to Venus lending, BNB staking to opBNB optimization — purpose-built agents for every major BNB Chain protocol.',
    'home.quickstart.title': 'Get Started in 60 Seconds',
    'home.quickstart.subtitle': "Clone, install, run. It's that simple.",
    'home.chains.badge': 'Multi-Chain',
    'home.chains.title': 'BNB Chain Networks',
    'home.chains.subtitle': 'Purpose-built for the BNB Chain ecosystem.',
    'home.defi.badge': 'Real-Time',
    'home.defi.title': 'Live DeFi Data',
    'home.defi.subtitle': 'Real-time market data from CoinGecko, DeFiLlama, and 200+ sources.',
    'home.architecture.title': 'Repository Architecture',
    'home.architecture.subtitle': 'A single monorepo with everything integrated and production-ready.',
    'home.why.badge': 'Why This Toolkit',
    'home.why.title': 'Why BNB Chain AI Toolkit?',
    'home.cta.title': 'Ready to Build on BNB Chain?',
    'home.cta.subtitle': '78 agents, 6 MCP servers, 1,100+ tools. Open source. Start building now.',

    // Nav groups
    'nav.learn': 'Learn',
    'nav.build': 'Build',
    'nav.explore': 'Explore',
    'nav.more': 'More',
    'nav.docs_short': 'Docs',
    'nav.interactive_tutorials': 'Interactive Tutorials',
    'nav.examples_gallery': 'Examples Gallery',
    'nav.api_reference': 'API Reference',
    'nav.code_playground': 'Code Playground',
    'nav.sandbox_ide': 'Sandbox IDE',
    'nav.fullstack_builder': 'Full-Stack Builder',
    'nav.contract_templates': 'Contract Templates',
    'nav.innovation_lab': 'Innovation Lab',
    'nav.markets': 'Markets',

    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.project': 'Project',
    'footer.brand_description': '78 AI agents, 6 MCP servers, and 1,100+ tools for BNB Chain. Open source and community-driven.',
    'footer.tutorials': 'Tutorials',
    'footer.examples': 'Examples',
    'footer.innovation_lab': 'Innovation Lab',
    'footer.api_reference': 'API Reference',
    'footer.changelog': 'Changelog',

    // Docs Page
    'docs.hero_subtitle': 'Everything you need to integrate 78 AI agents, 6 MCP servers, and 1,100+ tools into your BNB Chain projects.',
    'docs.start_here': 'Start Here',
    'docs.quick_start': 'Quick Start Guide',
    'docs.quick_start_desc': 'Get up and running in under 5 minutes. Install the toolkit, configure your first MCP server, and deploy an AI agent on BNB Chain.',
    'docs.browse_category': 'Browse by Category',
    'docs.popular_guides': 'Popular Guides',
    'docs.popular_guides_desc': 'Jump straight to the most-used documentation.',
    'docs.mcp_reference': 'MCP Server Reference',
    'docs.cant_find': "Can't find what you need?",
    'docs.cant_find_desc': 'Check the FAQ, open a GitHub issue, or reach out on Twitter. We respond to every question.',

    // About Page
    'about.hero_title': 'Built for BNB Chain. Built by nich.',
    'about.hero_subtitle': 'The most comprehensive open-source AI toolkit for blockchain — 78 agents, 6 MCP servers, 1,100+ tools, 2 open standards, and counting.',
    'about.whats_inside': "What's Inside",
    'about.mcp_servers': '6 MCP Servers',
    'about.open_standards': 'Open Standards',
    'about.beyond_agents': 'Beyond Agents',
    'about.author': 'Author',
    'about.tech_stack': 'Tech Stack',
    'about.open_source': 'Open Source, Always',

    // FAQ Page
    'faq.hero_subtitle': 'Answers to common questions about the toolkit, MCP servers, AI agents, tools, standards, and contributing.',
    'faq.search_placeholder': 'Search questions...',
    'faq.still_questions': 'Still have questions?',
    'faq.still_questions_desc': 'Open an issue on GitHub or start a discussion. We respond to every question.',

    // Community Page
    'community.hero_title': 'Join the Community',
    'community.hero_subtitle': 'BNB Chain AI Toolkit is built in the open. 78 agents, 6 MCP servers, 1,100+ tools — every contribution makes the ecosystem stronger.',
    'community.contributing_to': "What You're Contributing To",
    'community.ways_to_contribute': 'Ways to Contribute',
    'community.contributors': 'Contributors',
    'community.needs_help': 'What Needs Help',

    // Sandbox Page
    'sandbox.title': 'Code Sandbox',
    'sandbox.subtitle': 'A world-class development environment. Write, compile, deploy, and test your code in real-time with instant previews and professional tools.',
    'sandbox.web_sandbox': 'Web Sandbox',
    'sandbox.solidity_ude': 'Solidity UDE',
    'sandbox.start_template': 'Start from a Template',
};

// Loaded translations storage (populated from static JSON files)
const loadedTranslations: Record<Language, Record<string, string>> = {
  en: { ...baseTranslations },
  es: {},
  zh: {},
  fr: {},
  de: {},
  ja: {},
  ko: {},
  pt: {},
  ru: {},
  ar: {},
};

interface I18nStore {
  language: Language;
  isLoading: boolean;
  translationError: string | null;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: () => boolean;
  refreshTranslations: () => Promise<void>;
  clearCache: () => void;
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      isLoading: false,
      translationError: null,
      
      setLanguage: async (lang: Language) => {
        set({ language: lang, isLoading: true, translationError: null });
        
        // Update document direction for RTL languages
        const langInfo = languages.find(l => l.code === lang);
        document.documentElement.dir = langInfo?.rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // If English, no need to load anything
        if (lang === 'en') {
          loadedTranslations.en = { ...baseTranslations };
          set({ isLoading: false });
          return;
        }
        
        // If already loaded, use cached version
        if (Object.keys(loadedTranslations[lang]).length > 0) {
          set({ isLoading: false });
          return;
        }
        
        // Lazy-load the static JSON for this language
        try {
          const loader = localeLoaders[lang];
          const mod = await loader();
          loadedTranslations[lang] = mod.default;
          set({ isLoading: false });
        } catch (error: unknown) {
          console.error('Failed to load translations:', error);
          set({ isLoading: false, translationError: error instanceof Error ? error.message : String(error) });
        }
      },
      
      t: (key: string, params?: Record<string, string>) => {
        const { language } = get();
        
        // Get translation from loaded store, fall back to English, then to key
        let text = loadedTranslations[language]?.[key] 
          || loadedTranslations.en[key] 
          || baseTranslations[key]
          || key;
        
        // Replace parameters like {name} with actual values
        if (params) {
          Object.entries(params).forEach(([param, value]) => {
            text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
          });
        }
        
        return text;
      },
      
      isRTL: () => {
        const { language } = get();
        const langInfo = languages.find(l => l.code === language);
        return langInfo?.rtl || false;
      },
      
      refreshTranslations: async () => {
        const { language, setLanguage } = get();
        // Reset cached translations for this language to force reload
        if (language !== 'en') {
          loadedTranslations[language] = {};
        }
        await setLanguage(language);
      },
      
      clearCache: () => {
        // Reset all loaded translations except English
        Object.keys(loadedTranslations).forEach(lang => {
          if (lang !== 'en') {
            loadedTranslations[lang as Language] = {};
          }
        });
      }
    }),
    {
      name: 'i18n-storage',
      partialize: (state) => ({ language: state.language })
    }
  )
);

/**
 * Initialize i18n — call once on app startup to load
 * translations for the persisted language.
 */
export function initI18n() {
  const { language, setLanguage } = useI18n.getState();
  if (language !== 'en') {
    setLanguage(language);
  }
}

export default useI18n;
