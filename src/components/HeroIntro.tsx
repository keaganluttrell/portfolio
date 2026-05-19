import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'kl_hero_intro_seen';

/**
 * Hero loading sequence — gold dot expands to a horizontal line, then fades.
 * Total duration: ~600ms. Fires once per session.
 *
 * Renders a fixed-positioned overlay that ignites the hero text reveal.
 */
export default function HeroIntro() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    // Only fire once per session
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
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '2px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            style={{
              display: 'block',
              height: '2px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, transparent, var(--color-accent-bright), var(--color-accent), var(--color-accent-bright), transparent)',
              boxShadow: '0 0 12px var(--color-accent-glow)',
            }}
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
