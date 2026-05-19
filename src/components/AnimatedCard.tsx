import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import { motionTransitions, motionVariants, motionSprings, viewportOnce, viewportOnceMobile } from '../lib/motion';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * Optional label rendered next to the cursor on hover (desktop only).
   * Sets data-cursor-label on the card root for CursorLabel to read.
   */
  cursorLabel?: string;
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

const TILT_RANGE = 4; // degrees (-4 to +4)

export default function AnimatedCard({ children, className = '', delay = 0, cursorLabel }: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  // Normalized cursor position within the card (-0.5 to +0.5).
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateY = useTransform(px, [-0.5, 0.5], [-TILT_RANGE, TILT_RANGE]);
  const rotateX = useTransform(py, [-0.5, 0.5], [TILT_RANGE, -TILT_RANGE]);

  const springRotateX = useSpring(rotateX, motionSprings.snappy);
  const springRotateY = useSpring(rotateY, motionSprings.snappy);

  const tiltEnabled = !reduceMotion && !isMobile;

  function handleMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    if (!tiltEnabled) return;
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`card ${className}`.trim()}
      data-cursor-label={cursorLabel}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'show'}
      variants={motionVariants.slideUp}
      viewport={isMobile ? viewportOnceMobile : viewportOnce}
      whileHover={tiltEnabled ? { y: -4 } : undefined}
      transition={{ ...motionTransitions.normal, delay }}
      onPointerMove={tiltEnabled ? handleMove : undefined}
      onPointerLeave={tiltEnabled ? handleLeave : undefined}
      style={
        tiltEnabled
          ? {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformStyle: 'preserve-3d',
              transformPerspective: 1000,
              willChange: 'transform',
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
