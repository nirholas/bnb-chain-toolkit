/**
 * ScrollToTop - Resets scroll position on route changes
 *
 * React Router does not automatically scroll to the top when navigating.
 * This component listens for location changes and scrolls to (0, 0).
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
