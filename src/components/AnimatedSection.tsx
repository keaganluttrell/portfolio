import type { ReactNode } from 'react';

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Section entrance animation — clip-path wipe via CSS @keyframes.
 * Uses pure CSS animation with a delay, avoiding Framer Motion hydration issues.
 * The animation plays automatically after mount with no JS dependency.
 */
export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <section
      className={className ? `section-reveal ${className}` : 'section-reveal'}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}
