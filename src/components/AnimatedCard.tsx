import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { motionTransitions, motionVariants, viewportOnce } from '../lib/motion';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`card ${className}`.trim()}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'show'}
      variants={motionVariants.slideUp}
      viewport={viewportOnce}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ ...motionTransitions.normal, delay }}
    >
      {children}
    </motion.div>
  );
}
