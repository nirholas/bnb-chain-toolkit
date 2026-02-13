/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Mobile Bottom Navigation
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Terminal,
  Sparkles,
  BookOpen,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/utils/helpers';

interface BottomNavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const navItems: BottomNavItem[] = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/playground', icon: Terminal, label: 'Playground' },
  { path: '/sandbox', icon: Sparkles, label: 'Sandbox' },
  { path: '/docs', icon: BookOpen, label: 'Docs' },
  { path: '/explore', icon: MoreHorizontal, label: 'More' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const hasMounted = useRef(false);

  // Track initial mount to skip entrance animation
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on fullscreen / IDE pages
  const hiddenPaths = ['/ide'];
  if (
    hiddenPaths.some(
      (path) =>
        location.pathname.startsWith(path) && location.pathname !== path
    )
  ) {
    return null;
  }

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 md:hidden',
            'bg-white/80 dark:bg-black/80 backdrop-blur-xl',
            'border-t border-gray-200/50 dark:border-white/5'
          )}
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around h-16 px-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive =
                location.pathname === path ||
                (path !== '/' && location.pathname.startsWith(path));

              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'relative flex flex-col items-center justify-center flex-1 h-full px-1 py-1 rounded-lg transition-colors duration-200',
                    'active:bg-gray-100 dark:active:bg-white/5',
                    isActive
                      ? 'text-[#F0B90B]'
                      : 'text-gray-400 dark:text-gray-500'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span
                    className={cn(
                      'text-[10px] font-medium mt-1',
                      isActive && 'text-[#F0B90B]'
                    )}
                  >
                    {label}
                  </span>
                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#F0B90B]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
