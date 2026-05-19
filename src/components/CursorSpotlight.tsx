import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { motionSprings } from '../lib/motion';

/**
 * Cursor-following spotlight for the hero section.
 * Renders a soft gold radial gradient that tracks the mouse with spring physics.
 *
 * Mounts inside the hero (parent must have position: relative).
 * Desktop-only — returns null on touch/coarse pointers.
 * Disabled under prefers-reduced-motion.
 */
export default function CursorSpotlight() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    function handleMove(e: PointerEvent) {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
    function handleEnter() {
      setIsVisible(true);
    }
    function handleLeave() {
      setIsVisible(false);
    }

    parent.addEventListener('pointermove', handleMove);
    parent.addEventListener('pointerenter', handleEnter);
    parent.addEventListener('pointerleave', handleLeave);

    return () => {
      parent.removeEventListener('pointermove', handleMove);
      parent.removeEventListener('pointerenter', handleEnter);
      parent.removeEventListener('pointerleave', handleLeave);
    };
  }, [isFinePointer, reduceMotion, x, y]);

  if (reduceMotion || !isFinePointer) return null;

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className="cursor-spotlight"
      style={{
        x: springX,
        y: springY,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.3 } }}
    />
  );
}
