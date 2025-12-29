/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Where ideas come to life
 */

/**
 * Lyra Web3 Playground
 * https://lyra.works
 * 
 * Copyright (c) 2025 nirholas
 * Licensed under MIT License
 * 
 * @author nich (@nichxbt)
 * @repository https://github.com/nirholas/lyra-web3-playground
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import Homepage from './pages/Homepage';
import ExamplePage from './pages/ExamplePage';
import ExamplesPage from './pages/ExamplesPage';
import ContractPlayground from './pages/ContractPlayground';
import InteractiveSandbox from './components/Sandbox/InteractiveSandbox';
import SandboxPage from './pages/SandboxPage';
import TutorialBrowser from './pages/TutorialBrowser';
import TutorialPage from './pages/TutorialPage';
import AboutPage from './pages/AboutPage';
import DocsPage from './pages/DocsPage';
import DocArticlePage from './pages/DocArticlePage';
import DocCategoryPage from './pages/DocCategoryPage';
import ApiReferencePage from './pages/ApiReferencePage';
import FAQPage from './pages/FAQPage';
import CommunityPage from './pages/CommunityPage';
import InnovationShowcase from './pages/InnovationShowcase';
import RoadmapPage from './pages/RoadmapPage';
import ChangelogPage from './pages/ChangelogPage';
import InteractiveLearningPlayground from './pages/InteractiveLearningPlayground';
import FullStackDemoPage from './pages/FullStackDemoPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContributePage from './pages/ContributePage';
import ExplorePage from './pages/ExplorePage';
import SharedProjectPage from './pages/SharedProjectPage';
import MarketsPage from './pages/MarketsPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ConsentModal, { useConsent, ConsentTrigger } from './components/ConsentModal';
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
  const isFullscreen = fullscreenPaths.some(path => location.pathname.startsWith(path));

  if (isFullscreen) {
    // Render without navbar and footer
    return (
      <div className={`min-h-screen ${mode === 'dark' ? 'dark' : ''}`}>
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
          <Routes>
            <Route path="/ide" element={<SandboxPage />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <SkipLink />
        <NavBar />
        <main id="main-content" className="pt-16 pb-20 md:pb-0" role="main" tabIndex={-1}>
          <Routes>
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
            <Route path="/shared/:token" element={<SharedProjectPage />} />
          </Routes>
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
    <AnnouncerProvider>
      <LiveAnnouncerProvider>
        <VisualFeedbackProvider>
          <Router basename={basename}>
            <AppContent />
          </Router>
        </VisualFeedbackProvider>
      </LiveAnnouncerProvider>
    </AnnouncerProvider>
  );
}

export default App;
