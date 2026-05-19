import { useEffect } from 'react';

/**
 * Watches the .hero element. When out of viewport, sets data-scrolled="true"
 * on the .site-header element. CSS handles the transition (blur, border, etc.).
 *
 * Renders nothing. Mount once at root.
 */
export default function StickyNavObserver() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const header = document.querySelector('.site-header');
    if (!header) return;

    // Pages without a hero (about, projects) — keep the scrolled state
    // active from scroll > 8px instead.
    const hero = document.querySelector('.hero');

    if (!hero) {
      const handleScroll = () => {
        const scrolled = window.scrollY > 8;
        header.toggleAttribute('data-scrolled', scrolled);
      };
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Hero in view → header is in default state. Hero out → scrolled state.
          header.toggleAttribute('data-scrolled', !entry.isIntersecting);
        }
      },
      { threshold: 0, rootMargin: '-40px 0px 0px 0px' }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return null;
}
