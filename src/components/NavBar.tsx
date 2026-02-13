/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Navigation Bar Component
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Menu,
  X,
  Zap,
  BookOpen,
  ChevronDown,
  GraduationCap,
  FileCode,
  Terminal,
  Layers,
  Play,
  Sparkles,
  FlaskConical,
  Code,
  Bot,
  TrendingUp,
  Users,
  HelpCircle,
  Info,
  Wrench,
} from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import useI18n from '@/stores/i18nStore';
import LanguageSelector from './LanguageSelector';
import WalletButton from './WalletButton';
import { useAnnounce, useFocusTrap } from './Accessibility';
import { cn } from '@/utils/helpers';

/* ─── Types ──────────────────────────────────────────────────────────── */

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  description?: string;
  badge?: string;
  iconColor?: string;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
  featured?: { title: string; description: string; href: string };
}

/* ─── Dropdown sub-component ─────────────────────────────────────────── */

interface NavDropdownProps {
  group: NavGroup;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function NavDropdown({ group, isOpen, onOpen, onClose }: NavDropdownProps) {
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if any child route is currently active
  const hasActiveChild = group.items.some(
    (item) =>
      location.pathname === item.href ||
      location.pathname.startsWith(item.href + '/')
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(onClose, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        className={cn(
          'relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          isOpen
            ? 'text-gray-900 dark:text-white'
            : hasActiveChild
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        <span>{group.label}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
        {/* Active route indicator dot */}
        {hasActiveChild && !isOpen && (
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F0B90B]"
            aria-hidden="true"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] z-50"
          >
            <div className="rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-black shadow-xl shadow-black/10 dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              <div
                className={cn(
                  'grid gap-0',
                  group.featured ? 'grid-cols-[1fr_200px]' : 'grid-cols-1'
                )}
              >
                {/* Main items */}
                <div className="p-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.href + item.label}
                      to={item.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/item"
                      onClick={onClose}
                    >
                      {item.icon && (
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center transition-colors">
                          <item.icon
                            className={cn(
                              'w-4 h-4 transition-colors',
                              item.iconColor || 'text-gray-500 dark:text-gray-400'
                            )}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-[#F0B90B]/15 text-[#F0B90B]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Featured sidebar */}
                {group.featured && (
                  <div className="border-l border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] p-4 flex flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                      Featured
                    </p>
                    <Link
                      to={group.featured.href}
                      onClick={onClose}
                      className="group/feat"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover/feat:text-[#F0B90B] transition-colors">
                        {group.featured.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {group.featured.description}
                      </p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mobile accordion ───────────────────────────────────────────────── */

function MobileAccordion({
  group,
  onNavigate,
}: {
  group: NavGroup;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {group.label}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href + item.label}
                  to={item.href}
                  onClick={onNavigate}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  {item.icon && (
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                      <item.icon
                        className={cn(
                          'w-4 h-4',
                          item.iconColor || 'text-gray-400'
                        )}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-[#F0B90B]/15 text-[#F0B90B]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main NavBar ────────────────────────────────────────────────────── */

export default function NavBar() {
  const { mode, toggleTheme } = useThemeStore();
  const { t } = useI18n();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { announce } = useAnnounce();

  // Focus trap for mobile menu — handles Tab cycling, Escape, and initial focus
  const mobileMenuRef = useFocusTrap<HTMLDivElement>({
    isActive: isMenuOpen,
    onEscape: () => {
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
      announce('Navigation menu closed', 'polite');
    },
    returnFocusTo: menuButtonRef.current,
  });

  // ── Navigation data ───────────────────────────────────────────────

  const navGroups: NavGroup[] = [
    {
      label: t('nav.learn'),
      items: [
        {
          label: t('nav.docs'),
          href: '/docs',
          icon: BookOpen,
          description: 'Comprehensive guides for agents, MCP servers & tools',
          iconColor: 'text-blue-500',
        },
        {
          label: t('nav.interactive_tutorials'),
          href: '/tutorials',
          icon: GraduationCap,
          description: 'Step-by-step BNB Chain integration walkthroughs',
          iconColor: 'text-emerald-500',
        },
        {
          label: t('nav.examples_gallery'),
          href: '/projects',
          icon: FileCode,
          description: 'Community projects and smart contract templates',
          badge: 'Popular',
          iconColor: 'text-amber-500',
        },
        {
          label: t('nav.api_reference'),
          href: '/docs/api',
          icon: Code,
          description: 'Complete API documentation and endpoints',
          iconColor: 'text-cyan-500',
        },
      ],
      featured: {
        title: 'Getting Started',
        description: 'New to BNB Chain AI Toolkit? Start here.',
        href: '/docs',
      },
    },
    {
      label: t('nav.build'),
      items: [
        {
          label: 'MCP Playground',
          href: '/tool-playground',
          icon: Wrench,
          description: 'Execute 900+ MCP tools live in your browser',
          badge: 'New',
          iconColor: 'text-[#F0B90B]',
        },
        {
          label: t('nav.code_playground'),
          href: '/playground',
          icon: Terminal,
          description: 'Interactive code editor with live preview',
          iconColor: 'text-violet-500',
        },
        {
          label: t('nav.sandbox_ide'),
          href: '/sandbox',
          icon: Sparkles,
          description: 'AI-powered BNB Chain dev environment',
          badge: 'New',
          iconColor: 'text-pink-500',
        },
        {
          label: t('nav.fullstack_builder'),
          href: '/fullstack-demo',
          icon: Layers,
          description: 'Contract + Frontend on BNB Chain',
          iconColor: 'text-green-500',
        },
        {
          label: t('nav.contract_templates'),
          href: '/playground',
          icon: FileCode,
          description: 'Pre-built smart contract templates for BSC',
          iconColor: 'text-orange-500',
        },
        {
          label: 'ERC-8004 Agents',
          href: '/erc8004',
          icon: Bot,
          description: 'Create trustless AI agent identities on BSC',
          badge: 'New',
          iconColor: 'text-amber-500',
        },
      ],
    },
    {
      label: t('nav.explore'),
      items: [
        {
          label: t('nav.innovation_lab'),
          href: '/innovation',
          icon: FlaskConical,
          description: 'MCP tools & experimental features',
          badge: 'Beta',
          iconColor: 'text-fuchsia-500',
        },
        {
          label: t('nav.markets'),
          href: '/markets',
          icon: TrendingUp,
          description: 'Live crypto prices and market data',
          iconColor: 'text-emerald-500',
        },
        {
          label: t('nav.community'),
          href: '/community',
          icon: Users,
          description: 'Connect with builders and developers',
          iconColor: 'text-blue-500',
        },
        {
          label: t('nav.about'),
          href: '/about',
          icon: Info,
          description: 'Learn about BNB Chain AI Toolkit',
          iconColor: 'text-gray-400',
        },
        {
          label: t('nav.faq'),
          href: '/faq',
          icon: HelpCircle,
          description: 'Frequently asked questions',
          iconColor: 'text-yellow-500',
        },
      ],
    },
  ];

  // ── Scroll effect ──────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close mobile menu on route change ──────────────────────────────

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // ── Escape key for desktop dropdowns ────────────────────────────────

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openDropdown) {
        setOpenDropdown(null);
      }
    },
    [openDropdown]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Announce mobile menu open/close ─────────────────────────────────

  useEffect(() => {
    if (isMenuOpen) {
      announce(
        'Navigation menu opened. Use Tab to navigate, Escape to close.',
        'polite'
      );
    }
  }, [isMenuOpen, announce]);

  // ── Lock body scroll when mobile menu is open ──────────────────────

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // ── Theme toggle handler ──────────────────────────────────────────

  const handleThemeToggle = () => {
    toggleTheme();
    announce(
      `Switched to ${mode === 'dark' ? 'light' : 'dark'} mode`,
      'polite'
    );
  };

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-200',
          isScrolled
            ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5'
            : 'bg-transparent'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* ── Brand ────────────────────────────────────────── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              aria-label="BNB Chain AI Toolkit - Home"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F0B90B] group-hover:scale-105 transition-transform duration-200 shadow-[0_0_12px_rgba(240,185,11,0.3)]">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-gray-900 dark:text-white hidden sm:block">
                BNB Chain AI Toolkit
              </span>
              <span className="font-bold text-[15px] tracking-tight text-gray-900 dark:text-white sm:hidden">
                BNBT
              </span>
            </Link>

            {/* ── Desktop navigation ───────────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navGroups.map((group) => (
                <NavDropdown
                  key={group.label}
                  group={group}
                  isOpen={openDropdown === group.label}
                  onOpen={() => setOpenDropdown(group.label)}
                  onClose={() => setOpenDropdown(null)}
                />
              ))}
            </div>

            {/* ── Right side actions ───────────────────────────── */}
            <div className="hidden lg:flex items-center gap-1">
              <LanguageSelector compact />

              {/* Theme toggle */}
              <motion.button
                onClick={handleThemeToggle}
                className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50 focus:ring-offset-2 dark:focus:ring-offset-black"
                aria-label={
                  mode === 'dark'
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'
                }
                aria-pressed={mode === 'dark'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mode === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-[18px] h-[18px]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-[18px] h-[18px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <div
                className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1"
                aria-hidden="true"
              />

              <WalletButton />

              <Link
                to="/erc8004"
                className="ml-1.5 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg border border-[#F0B90B]/40 text-[#F0B90B] hover:bg-[#F0B90B]/10 active:scale-[0.98] transition-all duration-200 tracking-tight relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#F0B90B]/0 via-[#F0B90B]/5 to-[#F0B90B]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Bot className="w-3.5 h-3.5" />
                <span>ERC-8004</span>
              </Link>

              <Link
                to="/fullstack-demo"
                className="ml-1 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90 active:scale-[0.98] transition-all duration-200 shadow-[0_0_16px_rgba(240,185,11,0.25)] hover:shadow-[0_0_24px_rgba(240,185,11,0.45)] tracking-tight"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Start Building</span>
              </Link>
            </div>

            {/* ── Mobile right actions ─────────────────────────── */}
            <div className="flex lg:hidden items-center gap-1">
              <motion.button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label={
                  mode === 'dark'
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mode === 'dark' ? (
                    <motion.div
                      key="sun-m"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon-m"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50"
                aria-label={
                  isMenuOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
                }
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay menu ───────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-white dark:bg-black pt-16"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="h-[calc(100%-4rem)] overflow-y-auto overscroll-contain"
            >
              <div className="px-2 py-6 space-y-1">
                {navGroups.map((group, idx) => (
                  <motion.div
                    key={group.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.05 + idx * 0.05,
                    }}
                  >
                    <MobileAccordion
                      group={group}
                      onNavigate={() => setIsMenuOpen(false)}
                    />
                  </motion.div>
                ))}

                <div className="border-t border-gray-200 dark:border-white/5 my-4" />

                {/* Actions in mobile */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="px-4 space-y-4 pb-24"
                >
                  <LanguageSelector />

                  <Link
                    to="/fullstack-demo"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-[#F0B90B] text-black font-medium transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(240,185,11,0.3)]"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Start Building</span>
                  </Link>

                  <div className="flex items-center justify-center">
                    <WalletButton />
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
