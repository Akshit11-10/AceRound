import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't reset scroll position on navigation by default
// (unlike a traditional multi-page site). This scrolls to the top of the
// page every time the route (pathname) changes, so clicking "Home" from
// halfway down a page always lands you at the top.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
