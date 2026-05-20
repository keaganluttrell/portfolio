import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import { motionSprings } from '../lib/motion';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
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

const TILT_RANGE = 4;

export default function AnimatedCard({ children, className = '', delay = 0, cursorLabel }: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

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
      className={`card card-reveal ${className}`.trim()}
      data-cursor-label={cursorLabel}
      style={{
        animationDelay: `${delay}s`,
        ...(tiltEnabled
          ? {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformStyle: 'preserve-3d',
              transformPerspective: 1000,
              willChange: 'transform',
            }
          : {}),
      }}
      whileHover={tiltEnabled ? { y: -4 } : undefined}
      onPointerMove={tiltEnabled ? handleMove : undefined}
      onPointerLeave={tiltEnabled ? handleLeave : undefined}
    >
      {children}
    </motion.div>
  );
}
