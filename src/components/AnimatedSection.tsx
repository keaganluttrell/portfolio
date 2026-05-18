import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { motionTransitions, motionVariants, viewportOnce } from '../lib/motion';

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'show'}
      variants={motionVariants.slideUp}
      viewport={viewportOnce}
      transition={{ ...motionTransitions.normal, delay }}
    >
      {children}
    </motion.section>
  );
}
