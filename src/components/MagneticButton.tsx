import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import { motionSprings } from '../lib/motion';

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  /**
   * Maximum pull distance in pixels. Default 8px (subtle).
   */
  strength?: number;
  /**
   * If 'a', renders as anchor and forwards href/target/rel.
   * If 'button', renders as button.
   */
  as?: 'a' | 'button';
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

/**
 * Element that subtly pulls toward the cursor on hover.
 * Desktop only — falls through to a plain element on touch / coarse pointers.
 * Disabled under prefers-reduced-motion.
 */
export default function MagneticButton({
  children,
  className,
  strength = 8,
  as = 'a',
  href,
  target,
  rel,
  ariaLabel,
  onClick,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, motionSprings.snappy);
  const springY = useSpring(y, motionSprings.snappy);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const enabled = isFinePointer && !reduceMotion;

  function handleMove(e: ReactPointerEvent<HTMLElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Map to a [-1, 1] range based on element half-size, then scale by strength.
    const fx = Math.max(-1, Math.min(1, dx / (rect.width / 2)));
    const fy = Math.max(-1, Math.min(1, dy / (rect.height / 2)));
    x.set(fx * strength);
    y.set(fy * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const sharedProps = {
    ref: ref as never,
    className,
    onPointerMove: enabled ? handleMove : undefined,
    onPointerLeave: enabled ? handleLeave : undefined,
    style: enabled ? { x: springX, y: springY, willChange: 'transform' as const, display: 'inline-block' as const } : undefined,
    'aria-label': ariaLabel,
    onClick,
  };

  if (as === 'a') {
    return (
      <motion.a {...sharedProps} href={href} target={target} rel={rel}>
        {children}
      </motion.a>
    );
  }

  return <motion.button {...sharedProps}>{children}</motion.button>;
}
