import type { Variants, Transition } from 'framer-motion';

export const motionDurations = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  reveal: 0.6,
} as const;

export const motionEasings = {
  standard: [0.2, 0, 0, 1],
  decelerate: [0.22, 1, 0.36, 1],
  accelerate: [0.4, 0, 1, 1],
} as const;

export const motionTransitions = {
  fast: { duration: motionDurations.fast, ease: motionEasings.standard },
  normal: { duration: motionDurations.normal, ease: motionEasings.decelerate },
  slow: { duration: motionDurations.slow, ease: motionEasings.decelerate },
  reveal: { duration: motionDurations.reveal, ease: motionEasings.decelerate },
} satisfies Record<string, Transition>;

export const motionVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  },
  slideIn: {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1 },
  },
  navItem: {
    hidden: { y: -8 },
    show: { y: 0 },
  },
  // Clip-path reveals — directional wipes used for premium-feel section entrances.
  // Pair with `transition: motionTransitions.reveal` for a 600ms decelerate ease.
  clipUp: {
    hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
    show: { clipPath: 'inset(0 0 0 0)', opacity: 1 },
  },
  clipDown: {
    hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
    show: { clipPath: 'inset(0 0 0 0)', opacity: 1 },
  },
  clipLeft: {
    hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
    show: { clipPath: 'inset(0 0 0 0)', opacity: 1 },
  },
  clipRight: {
    hidden: { clipPath: 'inset(0 0 0 100%)', opacity: 0 },
    show: { clipPath: 'inset(0 0 0 0)', opacity: 1 },
  },
} satisfies Record<string, Variants>;

export const viewportOnce = {
  once: true,
  amount: 0.24,
} as const;

export const viewportOnceMobile = {
  once: true,
  amount: 0.08,
} as const;

export const navStagger = 0.03;

// Spring presets for interactive (cursor-driven) effects.
export const motionSprings = {
  // Cursor spotlight, magnetic pull — soft, lagging follow.
  soft: { damping: 30, stiffness: 200, mass: 0.8 },
  // 3D tilt cards — snappier, more responsive feel.
  snappy: { damping: 20, stiffness: 300, mass: 0.6 },
} as const;
