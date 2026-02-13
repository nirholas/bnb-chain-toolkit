/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Footer Component
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * 📦 github.com/nirholas/bnb-chain-toolkit
 * Copyright (c) 2024-2026 nirholas (nich) - MIT License
 * @preserve
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';
import useI18n from '@/stores/i18nStore';

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/nirholas/bnb-chain-toolkit',
    icon: Github,
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/nichxbt',
    icon: Twitter,
  },
];

export default function Footer() {
  const { t } = useI18n();

  const productLinks = useMemo(() => [
    { label: t('nav.playground'), href: '/playground' },
    { label: t('nav.sandbox'), href: '/sandbox' },
    { label: t('nav.docs'), href: '/docs' },
    { label: t('nav.markets'), href: '/markets' },
  ], [t]);

  const resourceLinks = useMemo(() => [
    { label: t('footer.tutorials'), href: '/tutorials' },
    { label: t('footer.examples'), href: '/projects' },
    { label: t('footer.innovation_lab'), href: '/innovation' },
    { label: t('footer.api_reference'), href: '/docs/api' },
  ], [t]);

  const companyLinks = useMemo(() => [
    { label: t('nav.about'), href: '/about' },
    { label: t('footer.changelog'), href: '/changelog' },
    { label: t('nav.faq'), href: '/faq' },
  ], [t]);

  return (
    <footer
      className="bg-black text-gray-400 border-t border-white/[0.04] pt-16 pb-24 md:pb-8 mt-16"
      role="contentinfo"
    >
      {/* Golden gradient divider */}
      <div className="section-divider -mt-16 mb-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-bold text-white text-[15px] tracking-tight">
                BNB Chain AI Toolkit
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs font-light">
              {t('footer.brand_description')}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                  aria-label={`${link.label} (opens in new tab)`}
                >
                  <link.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <nav aria-label="Product links">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              {t('footer.product')}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resource links">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Project links">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              {t('footer.project')}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="border-t border-white/[0.04] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span>
            © {new Date().getFullYear()} BNB Chain AI Toolkit · Built by{' '}
            <a href="https://x.com/nichxbt" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">nich</a>
            {' '}· MIT License
          </span>
          <nav
            aria-label="Legal links"
            className="flex items-center gap-6"
          >
            <Link
              to="/privacy"
              className="hover:text-white transition-colors duration-200"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/terms"
              className="hover:text-white transition-colors duration-200"
            >
              {t('footer.terms')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
