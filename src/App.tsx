/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Main Application Component
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✨ Original Author: nich
 * 🐦 Twitter/X: x.com/nichxbt
 * 🐙 GitHub: github.com/nirholas
 * 📦 Repository: github.com/nirholas/bnb-chain-toolkit
 * 🌐 Website: https://bnb-chain-toolkit.vercel.app
 * 
 * Copyright (c) 2024-2026 nirholas (nich)
 * Licensed under MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 * @author nich (@nichxbt)
 * @repository https://github.com/nirholas/bnb-chain-toolkit
 * @license MIT
 * @preserve
 */

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore } from './stores/themeStore';
import { initI18n } from './stores/i18nStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoader } from './components/LoadingStates';

// Attribution marker - nich | x.com/nichxbt | github.com/nirholas
const __bnb_attr__ = { author: 'nich', x: 'nichxbt', gh: 'nirholas' };

// Load persisted language translations on startup
initI18n();

// Eagerly loaded pages (critical path)
import Homepage from './pages/Homepage';

// Lazy-loaded pages (code splitting for better performance)
const ExamplePage = lazy(() => import('./pages/ExamplePage'));
const ExamplesPage = lazy(() => import('./pages/ExamplesPage'));
const TutorialBrowser = lazy(() => import('./pages/TutorialBrowser'));
const TutorialPage = lazy(() => import('./pages/TutorialPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Lazy-loaded pages (code splitting for better performance)
const ContractPlayground = lazy(() => import('./pages/ContractPlayground'));
const InteractiveSandbox = lazy(() => import('./components/Sandbox/InteractiveSandbox'));
const SandboxPage = lazy(() => import('./pages/SandboxPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const DocArticlePage = lazy(() => import('./pages/DocArticlePage'));
const DocCategoryPage = lazy(() => import('./pages/DocCategoryPage'));
const ApiReferencePage = lazy(() => import('./pages/ApiReferencePage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const InnovationShowcase = lazy(() => import('./pages/InnovationShowcase'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const ChangelogPage = lazy(() => import('./pages/ChangelogPage'));
const InteractiveLearningPlayground = lazy(() => import('./pages/InteractiveLearningPlayground'));
const FullStackDemoPage = lazy(() => import('./pages/FullStackDemoPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ContributePage = lazy(() => import('./pages/ContributePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AgentDetailPage = lazy(() => import('./pages/AgentDetailPage'));
const AgentBrowserPage = lazy(() => import('./pages/AgentBrowserPage'));
const SharedProjectPage = lazy(() => import('./pages/SharedProjectPage'));
const MarketsPage = lazy(() => import('./pages/MarketsPage'));
const MCPServersPage = lazy(() => import('./pages/MCPServersPage'));
const MCPServerPage = lazy(() => import('./pages/MCPServerPage'));
const ToolReferencePage = lazy(() => import('./pages/ToolReferencePage'));
const StandardsPage = lazy(() => import('./pages/StandardsPage'));
const ERC8004Page = lazy(() => import('./pages/ERC8004Page'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Innovation pages (experimental features - lazy loaded)
const AICodeWhispererPage = lazy(() => import('./pages/innovation/AICodeWhispererPage'));
const ContractTimeMachinePage = lazy(() => import('./pages/innovation/ContractTimeMachinePage'));
const ExploitLabPage = lazy(() => import('./pages/innovation/ExploitLabPage'));
const CollaborativeArenaPage = lazy(() => import('./pages/innovation/CollaborativeArenaPage'));
const NeuralGasOraclePage = lazy(() => import('./pages/innovation/NeuralGasOraclePage'));
const CrossChainDreamWeaverPage = lazy(() => import('./pages/innovation/CrossChainDreamWeaverPage'));
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';
import {
  SkipLink,
  LiveAnnouncerProvider,
  VisualFeedbackProvider,
  AccessibilityButton,
  ColorBlindFilters,
  ReadingGuide,
  DwellClick,
  AnnouncerProvider,
} from './components/Accessibility';
import { useAccessibilityStore } from './stores/accessibilityStore';
import '@/styles/accessibility.css';

// Get base path from Vite's configuration
const basename = import.meta.env.BASE_URL;

// Pages that should be rendered without navbar/footer (full-screen IDEs)
const fullscreenPaths = ['/ide'];

function AppContent() {
  const { mode } = useThemeStore();
  const location = useLocation();
  const { applyAccessibilityCSS } = useAccessibilityStore();

  // Apply accessibility CSS whenever settings change
  useEffect(() => {
    applyAccessibilityCSS();
  }, [applyAccessibilityCSS]);

  // Check if current path should be fullscreen (no navbar/footer)
  const isFullscreen = fullscreenPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  if (isFullscreen) {
    // Render without navbar and footer
    return (
      <div className={`min-h-screen ${mode === 'dark' ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen">
          <ScrollToTop />
          <Suspense fallback={<PageLoader message="Loading IDE..." />}>
            <Routes>
              <Route path="/ide" element={<SandboxPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen">
        <ScrollToTop />
        <SkipLink />
        <NavBar />
        <main id="main-content" className="pt-16 pb-20 md:pb-0" role="main" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<PageLoader />}>
                <Routes location={location}>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/example/:exampleId" element={<ExamplePage />} />
                  <Route path="/playground" element={<ContractPlayground />} />
                  <Route path="/sandbox" element={<InteractiveSandbox />} />
                  <Route path="/sandbox/:shareId" element={<InteractiveSandbox />} />
                  <Route path="/tutorials" element={<TutorialBrowser />} />
                  <Route path="/tutorial/:tutorialId" element={<TutorialPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/docs" element={<DocsPage />} />
                  <Route path="/docs/api" element={<ApiReferencePage />} />
                  <Route path="/docs/:categoryId" element={<DocCategoryPage />} />
                  <Route path="/docs/:categoryId/:articleId" element={<DocArticlePage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/innovation" element={<InnovationShowcase />} />
                  <Route path="/innovation/ai-whisperer" element={<AICodeWhispererPage />} />
                  <Route path="/innovation/time-machine" element={<ContractTimeMachinePage />} />
                  <Route path="/innovation/exploit-lab" element={<ExploitLabPage />} />
                  <Route path="/innovation/arena" element={<CollaborativeArenaPage />} />
                  <Route path="/innovation/gas-oracle" element={<NeuralGasOraclePage />} />
                  <Route path="/innovation/cross-chain" element={<CrossChainDreamWeaverPage />} />
                  <Route path="/projects" element={<RoadmapPage />} />
                  <Route path="/changelog" element={<ChangelogPage />} />
                  <Route path="/learn" element={<InteractiveLearningPlayground />} />
                  <Route path="/fullstack-demo" element={<FullStackDemoPage />} />
                  <Route path="/examples" element={<ExamplesPage />} />
                  <Route path="/markets" element={<MarketsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/contribute" element={<ContributePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/explore/agent/:agentId" element={<AgentDetailPage />} />
                  <Route path="/agents" element={<AgentBrowserPage />} />
                  <Route path="/mcp" element={<MCPServersPage />} />
                  <Route path="/mcp/:serverId" element={<MCPServerPage />} />
                  <Route path="/tools" element={<ToolReferencePage />} />
                  <Route path="/standards" element={<StandardsPage />} />
                  <Route path="/erc8004" element={<ERC8004Page />} />
                  <Route path="/shared/:token" element={<SharedProjectPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <MobileBottomNav />

        {/* Accessibility Features */}
        <ColorBlindFilters />
        <ReadingGuide />
        <DwellClick />
        <AccessibilityButton />
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AnnouncerProvider>
        <LiveAnnouncerProvider>
          <VisualFeedbackProvider>
            <Router basename={basename}>
              <AppContent />
            </Router>
          </VisualFeedbackProvider>
        </LiveAnnouncerProvider>
      </AnnouncerProvider>
    </ErrorBoundary>
  );
}

export default App;
