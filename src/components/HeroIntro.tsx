import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'kl_hero_intro_seen';

/**
 * Hero loading sequence — gold dot expands to a horizontal line, then fades.
 * Total duration: ~700ms. Fires once per session.
 *
 * Renders an absolutely-positioned overlay inside the hero section
 * (parent must have position: relative and class .hero).
 */
export default function HeroIntro() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage blocked — show anyway
    }

    setShow(true);
    const t = window.setTimeout(() => setShow(false), 700);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="hero-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className="hero-intro-line"
            initial={{ width: 8 }}
            animate={{ width: ['8px', '120px', '120px'] }}
            exit={{ opacity: 0, width: '180px' }}
            transition={{
              duration: 0.6,
              times: [0, 0.5, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Sync helper: returns whether the hero intro will fire this load.
 * Use this to decide whether to delay subsequent animations.
 *
 * Note: must be called AFTER mount (sessionStorage isn't available SSR-side).
 */
export function willHeroIntroFire(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}
