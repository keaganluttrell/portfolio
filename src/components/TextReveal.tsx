import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { willHeroIntroFire } from './HeroIntro';

type TextRevealProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  /**
   * Animation mode:
   * - 'mount': words rise + fade in on mount with stagger (default — for above-the-fold)
   * - 'scroll': words rise as the user scrolls (for below-the-fold reveals)
   */
  mode?: 'mount' | 'scroll';
  /**
   * Delay before mount animation starts (seconds). Only applies to mode='mount'.
   */
  delay?: number;
  /**
   * If true, delays mount animation only when HeroIntro will fire this load.
   * On repeat session loads (intro skipped), text appears immediately.
   * Mutually exclusive with `delay`.
   */
  syncWithIntro?: boolean;
};

export default function TextReveal({
  text,
  className,
  as = 'h1',
  mode = 'mount',
  delay = 0,
  syncWithIntro = false,
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  // Resolve effective delay: syncWithIntro adds 0.5s only if HeroIntro will fire.
  const [effectiveDelay, setEffectiveDelay] = useState(delay);
  useEffect(() => {
    if (syncWithIntro) {
      setEffectiveDelay(willHeroIntroFire() ? 0.5 : 0);
    }
  }, [syncWithIntro]);

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  if (mode === 'scroll') {
    return <ScrollLinkedReveal words={words} className={className} as={as} />;
  }

  return <MountReveal words={words} className={className} as={as} delay={effectiveDelay} />;
}

/* -------------------- Mount-time stagger reveal -------------------- */

type MountRevealProps = {
  words: string[];
  className?: string;
  as: 'h1' | 'h2' | 'h3' | 'p';
  delay: number;
};

function MountReveal({ words, className, as, delay }: MountRevealProps) {
  const MotionTag = motion[as];
  const stagger = 0.05;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            marginRight: '0.25em',
          }}
        >
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            variants={{
              hidden: { y: '100%', opacity: 0 },
              show: { y: '0%', opacity: 1 },
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* -------------------- Scroll-linked reveal -------------------- */

type ScrollLinkedRevealProps = {
  words: string[];
  className?: string;
  as: 'h1' | 'h2' | 'h3' | 'p';
};

function ScrollLinkedReveal({ words, className, as }: ScrollLinkedRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end 0.7'],
  });

  const MotionTag = motion[as];

  return (
    <MotionTag ref={ref as never} className={className} style={{ position: 'relative' }}>
      {words.map((word, i) => (
        <ScrollWord
          key={`${word}-${i}`}
          word={word}
          index={i}
          total={words.length}
          progress={scrollYProgress}
        />
      ))}
    </MotionTag>
  );
}

type ScrollWordProps = {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function ScrollWord({ word, index, total, progress }: ScrollWordProps) {
  const start = (index / total) * 0.7;
  const end = start + 0.18;

  const y = useTransform(progress, [start, end], ['100%', '0%']);
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'top',
        marginRight: '0.25em',
      }}
    >
      <motion.span
        style={{
          display: 'inline-block',
          y,
          opacity,
          willChange: 'transform, opacity',
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}
