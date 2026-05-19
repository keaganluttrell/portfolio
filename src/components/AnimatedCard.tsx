import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motionTransitions, motionVariants, viewportOnce, viewportOnceMobile } from '../lib/motion';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
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

export default function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <motion.div
      className={`card ${className}`.trim()}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'show'}
      variants={motionVariants.slideUp}
      viewport={isMobile ? viewportOnceMobile : viewportOnce}
      whileHover={reduceMotion || isMobile ? undefined : { y: -4 }}
      transition={{ ...motionTransitions.normal, delay }}
    >
      {children}
    </motion.div>
  );
}
