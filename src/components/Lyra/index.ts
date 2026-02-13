/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Crafting digital magic since day one ✨
 */

/**
 * BNB Chain AI Toolkit - Brand UI Component Library
 * 
 * Exports BNB Chain branded components and icons.
 * Uses Lucide for UI icons and Simple Icons for brand icons.
 */

// =============================================================================
// ICONS - Re-export from our icon wrapper
// =============================================================================
export * from './BrandIcons';

// =============================================================================
// BNB CHAIN BRANDING
// =============================================================================
export { BNBLogo, BNBBrand, BNBLoading } from './BNBBrand';

// =============================================================================
// AI CHAT (Custom implementation)
// =============================================================================
export { AIChatMessage, AIChatPanel } from './AIChat';
export type { AIChatMessageProps, AIChatPanelProps } from './AIChat';

// Legacy aliases for backward compatibility
export { BNBLogo as LyraLogo, BNBBrand as LyraBrand, BNBLoading as LyraLoading } from './BNBBrand';
export { AIChatMessage as LyraChatMessage, AIChatPanel as LyraChatPanel } from './AIChat';
export type { AIChatMessageProps as LyraChatMessageProps, AIChatPanelProps as LyraChatPanelProps } from './AIChat';
