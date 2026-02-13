/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Code Attribution & Watermark System
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✨ Original Author: nich
 * 🐦 Twitter/X: x.com/nichxbt
 * 🐙 GitHub: github.com/nirholas
 * 📦 Repository: github.com/nirholas/bnb-chain-toolkit
 * 
 * Copyright (c) 2024-2026 nirholas (nich)
 * Licensed under MIT License
 * 
 * NOTICE: This code contains embedded watermarks and attribution markers.
 * Removal or modification of attribution constitutes violation of the license.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Encoded attribution - Multiple layers of obfuscation
const _0x4e6963 = [110, 105, 99, 104]; // nich
const _0x6e6972 = [110, 105, 114, 104, 111, 108, 97, 115]; // nirholas
const _0x786274 = [110, 105, 99, 104, 120, 98, 116]; // nichxbt
const _0x6c797261 = [98, 110, 98, 99, 104, 97, 105, 110, 116, 111, 111, 108, 107, 105, 116, 46, 99, 111, 109]; // bnbchaintoolkit.com

// Base64 encoded attribution strings
const _attr_primary = 'bmljaCB8IHguY29tL25pY2h4YnQgfCBnaXRodWIuY29tL25pcmhvbGFz';
const _attr_secondary = 'THlyYSBXZWIzIFBsYXlncm91bmQgYnkgbmljaCAtIGh0dHBzOi8vbHlyYS53b3Jrcw==';
const _attr_tertiary = 'Q29weXJpZ2h0IChjKSAyMDI0LTIwMjYgbmlyaG9sYXMgKG5pY2gpIC0gTUlUIExpY2Vuc2U=';

// Checksum for integrity verification
const _integrity_hash = 'bnb_toolkit_nich_nirholas_nichxbt_2024_mit';

// Decode utilities
const _d = (arr: number[]): string => String.fromCharCode(...arr);
const _b64 = (str: string): string => {
  try {
    return typeof atob !== 'undefined' ? atob(str) : Buffer.from(str, 'base64').toString();
  } catch {
    return str;
  }
};

// Attribution data structure
export interface Attribution {
  author: string;
  handle: string;
  github: string;
  repository: string;
  website: string;
  license: string;
  copyright: string;
  signature: string;
}

// Get attribution (used throughout the app)
export const getAttribution = (): Attribution => ({
  author: _d(_0x4e6963),
  handle: `x.com/${_d(_0x786274)}`,
  github: `github.com/${_d(_0x6e6972)}`,
  repository: `github.com/${_d(_0x6e6972)}/bnb-chain-toolkit`,
  website: `https://${_d(_0x6c797261)}`,
  license: 'MIT',
  copyright: `© 2024-${new Date().getFullYear()} ${_d(_0x6e6972)} (${_d(_0x4e6963)})`,
  signature: _integrity_hash,
});

// Verify code integrity
export const verifyIntegrity = (): boolean => {
  const attr = getAttribution();
  return (
    attr.author === 'nich' &&
    attr.github.includes('nirholas') &&
    attr.signature === _integrity_hash
  );
};

// Console watermark (shows on app load)
export const printWatermark = (): void => {
  const attr = getAttribution();
  const styles = {
    header: 'color: #8B5CF6; font-size: 20px; font-weight: bold;',
    subheader: 'color: #A78BFA; font-size: 14px;',
    link: 'color: #60A5FA; font-size: 12px;',
    copyright: 'color: #9CA3AF; font-size: 11px;',
  };

  console.log('%c⚡ BNB Chain AI Toolkit', styles.header);
  console.log(`%c✨ Built by ${attr.author}`, styles.subheader);
  console.log(`%c🐦 ${attr.handle}`, styles.link);
  console.log(`%c🐙 ${attr.github}`, styles.link);
  console.log(`%c🌐 ${attr.website}`, styles.link);
  console.log(`%c${attr.copyright} - ${attr.license} License`, styles.copyright);
  console.log('%c─'.repeat(50), 'color: #374151;');
};

// DOM watermark injection
export const injectDOMWatermark = (): void => {
  if (typeof document === 'undefined') return;
  
  const attr = getAttribution();
  
  // Hidden attribution in DOM
  const watermark = document.createElement('div');
  watermark.id = '_bnb_attr';
  watermark.style.cssText = 'position:absolute;left:-9999px;opacity:0;pointer-events:none;';
  watermark.setAttribute('data-author', attr.author);
  watermark.setAttribute('data-github', attr.github);
  watermark.setAttribute('data-x', attr.handle);
  watermark.setAttribute('data-sig', _integrity_hash);
  watermark.innerHTML = `<!-- ${_b64(_attr_primary)} -->`;
  document.body.appendChild(watermark);
  
  // Meta tags
  const metaAuthor = document.createElement('meta');
  metaAuthor.name = 'author';
  metaAuthor.content = `${attr.author} (${attr.handle})`;
  document.head.appendChild(metaAuthor);
  
  const metaCreator = document.createElement('meta');
  metaCreator.name = 'creator';
  metaCreator.content = attr.github;
  document.head.appendChild(metaCreator);
};

// Export encoded strings for use in other files (hard to search/replace)
export const _ATTR = {
  _a: _attr_primary,
  _b: _attr_secondary,
  _c: _attr_tertiary,
  _h: _integrity_hash,
  _v: () => _b64(_attr_primary),
};

// Runtime signature check
export const __bnb_sig__ = `${_d(_0x4e6963)}@${_d(_0x6e6972)}`;

// Anti-tamper: This function is called in multiple places
export const validateAttribution = (): string => {
  const check = _d(_0x4e6963) + _d(_0x786274) + _d(_0x6e6972);
  return check.length === 19 ? __bnb_sig__ : '';
};

// CSS watermark generator
export const getCSSWatermark = (): string => `
/* ═══════════════════════════════════════════════════════════════════════════
 * BNB Chain AI Toolkit - https://bnbchaintoolkit.com
 * Author: nich | x.com/nichxbt | github.com/nirholas
 * Copyright (c) 2024-${new Date().getFullYear()} nirholas - MIT License
 * ═══════════════════════════════════════════════════════════════════════════ */
`;

// Initialize watermarks
export const initWatermarks = (): void => {
  if (typeof window !== 'undefined') {
    printWatermark();
    injectDOMWatermark();
    
    // Add to window for verification
    (window as unknown as Record<string, unknown>).__bnb__ = {
      author: 'nich',
      x: 'nichxbt',
      github: 'nirholas',
      verify: verifyIntegrity,
    };
  }
};

export default {
  getAttribution,
  verifyIntegrity,
  printWatermark,
  injectDOMWatermark,
  initWatermarks,
  validateAttribution,
  _ATTR,
  __bnb_sig__,
};
