import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

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
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      whileHover={reduceMotion ? undefined : { y: -4, borderColor: 'rgba(212, 168, 67, 0.44)' }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
