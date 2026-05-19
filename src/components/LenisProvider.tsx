import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initializes Lenis smooth scroll on mount.
 * Renders nothing — pure side effect.
 *
 * Conservative config: trackpad-friendly, light easing, native touch scroll.
 * Disabled when prefers-reduced-motion is set.
 */
export default function LenisProvider() {
  useEffect(() => {
    // Respect user motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.0,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false, // keep native scroll on mobile
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose for debugging / future scroll-to calls
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
