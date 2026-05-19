import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
];

const MESSAGE = 'identity over credentials. — keagan';

/**
 * Konami code easter egg.
 * Triggers on ↑↑↓↓←→←→BA. Shows a gold sweep overlay + message for 4s.
 * Logs to console: "you found it. let's talk: keaganluttrell7@gmail.com"
 *
 * Mounts once at root (client:idle — low priority, non-blocking).
 */
export default function EasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let idx = 0;

    function handleKey(e: KeyboardEvent) {
      if (e.code === KONAMI[idx] || e.key === KONAMI[idx]) {
        idx++;
        setProgress(idx);
        if (idx === KONAMI.length) {
          idx = 0;
          setProgress(0);
          setTriggered(true);
          console.log("you found it. let's talk: keaganluttrell7@gmail.com");
          setTimeout(() => setTriggered(false), 4000);
        }
      } else {
        idx = 0;
        setProgress(0);
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          aria-hidden="true"
          className="easter-egg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="easter-egg-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {MESSAGE}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
