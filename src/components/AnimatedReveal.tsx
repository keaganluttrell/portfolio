import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

type AnimatedRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  as?: 'div' | 'section' | 'article' | 'header';
};

const clipHidden = {
  up: 'inset(0 0 100% 0)',
  down: 'inset(100% 0 0 0)',
  left: 'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
} as const;

/**
 * Clip-path entrance reveal — directional wipe via CSS @keyframes.
 * Pure CSS approach avoids Framer Motion hydration timing issues.
 */
export default function AnimatedReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  as = 'div',
}: AnimatedRevealProps) {
  const Tag = as;

  return (
    <Tag
      className={className ? `reveal-${direction} ${className}` : `reveal-${direction}`}
      style={{
        animationDelay: `${delay}s`,
        ['--reveal-from' as string]: clipHidden[direction],
      }}
    >
      {children}
    </Tag>
  );
}
