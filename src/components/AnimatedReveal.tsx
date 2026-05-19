import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motionTransitions, motionVariants, viewportOnce, viewportOnceMobile } from '../lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right';

type AnimatedRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  as?: 'div' | 'section' | 'article' | 'header';
  /**
   * If true, animation plays on mount instead of on viewport intersection.
   * Use for above-the-fold elements that are already in view on page load.
   */
  immediate?: boolean;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

const variantByDirection = {
  up: motionVariants.clipUp,
  down: motionVariants.clipDown,
  left: motionVariants.clipLeft,
  right: motionVariants.clipRight,
} as const;

/**
 * Clip-path scroll reveal — directional wipe into view.
 * The premium upgrade over basic fade/slide.
 *
 * Default direction is 'up' (reveals from bottom to top).
 */
export default function AnimatedReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  as = 'div',
  immediate = false,
}: AnimatedRevealProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const variants = variantByDirection[direction];

  const MotionTag = motion[as];

  const triggerProps = immediate
    ? {
        initial: reduceMotion ? false : 'hidden',
        animate: reduceMotion ? undefined : 'show',
      }
    : {
        initial: reduceMotion ? false : 'hidden',
        whileInView: reduceMotion ? undefined : 'show',
        viewport: isMobile ? viewportOnceMobile : viewportOnce,
      };

  return (
    <MotionTag
      className={className}
      variants={variants}
      transition={{ ...motionTransitions.reveal, delay }}
      {...triggerProps}
    >
      {children}
    </MotionTag>
  );
}
