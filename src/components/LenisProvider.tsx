import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initializes Lenis smooth scroll on mount.
 * Renders nothing — pure side effect.
 *
 * Conservative config: trackpad-friendly, light easing, native touch scroll.
 * Disabled when prefers-reduced-motion is set.
 *
 * Handles Astro view transitions: re-creates the Lenis instance after each
 * page swap (the old instance's RAF loop is cleaned up on swap-end).
 */
export default function LenisProvider() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    function init() {
      lenis = new Lenis({
        lerp: 0.08,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        syncTouch: false,
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    function teardown() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lenis?.destroy();
      lenis = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    }

    init();

    // Re-init on Astro view transition page swap.
    function handleAfterSwap() {
      teardown();
      init();
    }

    document.addEventListener('astro:after-swap', handleAfterSwap);

    return () => {
      document.removeEventListener('astro:after-swap', handleAfterSwap);
      teardown();
    };
  }, []);

  return null;
}
