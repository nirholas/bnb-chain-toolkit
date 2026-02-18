import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  /** Optional JSON-LD structured data for the page */
  jsonLd?: Record<string, unknown>;
  /** Set to 'article' for blog/doc pages to enable article meta tags */
  type?: 'website' | 'article';
  /** ISO date string for article:modified_time */
  modifiedTime?: string;
  /** Disable indexing for this page */
  noindex?: boolean;
}

const BASE_TITLE = 'BNB Chain AI Toolkit';
const BASE_DESCRIPTION = '78 AI agents, 6 MCP servers, 1,100+ tools for BNB Chain and 60+ networks. The most comprehensive open-source AI toolkit for Web3.';
const BASE_URL = 'https://bnbchaintoolkit.com';

/**
 * SEO hook for dynamic page titles, meta tags, canonical URLs,
 * Open Graph, Twitter Cards, JSON-LD, and robots directives.
 * Updates document head on mount and cleans up on unmount.
 */
export function useSEO({ title, description, path, jsonLd, type = 'website', modifiedTime, noindex }: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || BASE_DESCRIPTION);
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical && path) {
      canonical.href = `${BASE_URL}${path}`;
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle) ogTitle.setAttribute('content', title ? `${title} | ${BASE_TITLE}` : BASE_TITLE);
    if (ogDescription) ogDescription.setAttribute('content', description || BASE_DESCRIPTION);
    if (ogUrl && path) ogUrl.setAttribute('content', `${BASE_URL}${path}`);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (twitterTitle) twitterTitle.setAttribute('content', title || BASE_TITLE);
    if (twitterDescription) twitterDescription.setAttribute('content', description || BASE_DESCRIPTION);
    if (twitterUrl && path) twitterUrl.setAttribute('content', `${BASE_URL}${path}`);

    // Robots meta — opt out of indexing for specific pages
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = 'noindex, nofollow';
    } else if (robotsMeta) {
      robotsMeta.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    }

    // Article modified time (for doc/blog pages)
    if (type === 'article' && modifiedTime) {
      let modMeta = document.querySelector('meta[property="article:modified_time"]') as HTMLMetaElement | null;
      if (!modMeta) {
        modMeta = document.createElement('meta');
        modMeta.setAttribute('property', 'article:modified_time');
        document.head.appendChild(modMeta);
      }
      modMeta.content = modifiedTime;
    }

    // Inject page-specific JSON-LD structured data
    let jsonLdScript: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        ...jsonLd,
      });
      document.head.appendChild(jsonLdScript);
    }

    // Cleanup - restore defaults on unmount
    return () => {
      document.title = BASE_TITLE;
      if (jsonLdScript && jsonLdScript.parentNode) {
        jsonLdScript.parentNode.removeChild(jsonLdScript);
      }
      // Remove article:modified_time meta on unmount
      const modMeta = document.querySelector('meta[property="article:modified_time"]');
      if (modMeta) modMeta.remove();
    };
  }, [title, description, path, jsonLd, type, modifiedTime, noindex]);
}

export default useSEO;
