import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { motionSprings } from '../lib/motion';

/**
 * Cursor-following text label.
 * Listens for elements with [data-cursor-label] and renders a small pill
 * near the cursor with the label text on hover.
 *
 * Mount once at the root (BaseLayout). Desktop only. Disabled under reduced-motion.
 */
export default function CursorLabel() {
  const reduceMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, motionSprings.soft);
  const springY = useSpring(y, motionSprings.soft);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!isFinePointer || reduceMotion) return;

    function handleMove(e: PointerEvent) {
      // 12px offset down-right from cursor
      x.set(e.clientX + 12);
      y.set(e.clientY + 12);

      const target = e.target as HTMLElement | null;
      const labeled = target?.closest('[data-cursor-label]');
      const next = labeled?.getAttribute('data-cursor-label') ?? null;
      setLabel(prev => (prev === next ? prev : next));
    }

    function handleLeaveDoc() {
      setLabel(null);
    }

    document.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeaveDoc);

    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeaveDoc);
    };
  }, [isFinePointer, reduceMotion, x, y]);

  if (!isFinePointer || reduceMotion) return null;

  return (
    <AnimatePresence>
      {label && (
        <motion.div
          aria-hidden="true"
          className="cursor-label"
          style={{ x: springX, y: springY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
