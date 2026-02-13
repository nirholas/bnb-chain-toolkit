/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Persistence beats perfection 🎖️
 */

/**
 * BNB Chain Branding Components
 * 
 * Custom BNB Chain branding components.
 * Logo, brand marks, and loading indicators.
 */

import React, { memo } from 'react';

// =============================================================================
// BNB LOGO
// =============================================================================

interface BNBLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BNB Chain Logo
 * BNB Chain brand logo
 */
export const BNBLogo = memo<BNBLogoProps>(({ size = 32, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* BNB Chain logo */}
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M12 22V10L22 8V20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="22" r="2" fill="currentColor" />
    <circle cx="20" cy="20" r="2" fill="currentColor" />
  </svg>
));

BNBLogo.displayName = 'BNBLogo';

// =============================================================================
// BNB BRAND TEXT
// =============================================================================

interface BNBBrandProps {
  size?: 'sm' | 'md' | 'lg';
  showLogo?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  sm: { logo: 20, text: 14 },
  md: { logo: 28, text: 18 },
  lg: { logo: 40, text: 24 },
};

/**
 * BNB Brand - Logo + Text combo
 */
export const BNBBrand = memo<BNBBrandProps>(({ 
  size = 'md', 
  showLogo = true, 
  className,
  style 
}) => {
  const sizes = sizeMap[size];
  
  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        ...style 
      }}
    >
      {showLogo && <BNBLogo size={sizes.logo} />}
      <span style={{ 
        fontSize: sizes.text, 
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}>
        Lyra
      </span>
    </div>
  );
});

BNBBrand.displayName = 'BNBBrand';

// =============================================================================
// BNB LOADING
// =============================================================================

interface BNBLoadingProps {
  size?: number;
  text?: string;
}

/**
 * BNB Chain Loading Spinner
 */
export const BNBLoading = memo<BNBLoadingProps>(({ size = 40, text = 'Loading...' }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '12px' 
  }}>
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid transparent',
        borderTopColor: 'currentColor',
        borderRadius: '50%',
        animation: 'bnb-spin 1s linear infinite',
      }}
    />
    {text && (
      <span style={{ fontSize: 14, opacity: 0.7 }}>{text}</span>
    )}
    <style>{`
      @keyframes bnb-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
));

BNBLoading.displayName = 'BNBLoading';

// =============================================================================
// EXPORTS
// =============================================================================

export type { BNBLogoProps, BNBBrandProps, BNBLoadingProps };
