import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top every time the route changes.
 * Without this, react-router keeps the browser's current scroll
 * position when navigating — so clicking a link that sits low on the
 * page (e.g. "Admin" in the footer) lands on the new page still
 * scrolled down, and the user has to scroll up manually to see it
 * (for example, the login form on /admin/login).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
