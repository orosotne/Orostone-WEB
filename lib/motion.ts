import type { Transition } from 'framer-motion';

// Motion vocabulary of the site (see STYLE_GUIDE.md › Motion). Springs instead of fixed-length tweens:
// they start from the element's current position and velocity, so an interrupted animation never jumps.

/** Default for anything that opens or closes: critically damped, no overshoot. */
export const SPRING: Transition = { type: 'spring', bounce: 0, duration: 0.35 };

/** Drawers and sheets: a touch snappier. */
export const SPRING_SHEET: Transition = { type: 'spring', bounce: 0, duration: 0.3 };

/** Only after a flick: the gesture carried momentum, so a slight settle reads as physical. */
export const SPRING_FLICK: Transition = { type: 'spring', bounce: 0.15, duration: 0.35 };

/** Fades that accompany a spring (scrims, cross-fades). */
export const FADE: Transition = { duration: 0.2, ease: 'easeOut' };

/** The house ease-out curve, also used by the CSS transitions. */
export const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

/**
 * Scroll reveal: once, short and with little travel, so it never holds up reading.
 * Spread it on an m.* element: <m.div {...REVEAL}>. Lists add a small per-item delay with revealAt(i).
 */
export const REVEAL = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
  transition: { duration: 0.35, ease: EASE_OUT },
} as const;

export const revealAt = (index: number) => ({
  ...REVEAL,
  transition: { ...REVEAL.transition, delay: Math.min(index, 6) * 0.04 },
});

/**
 * Where a flick would come to rest, the way scrolling decelerates (Apple, "Designing Fluid Interfaces").
 * `velocity` in px/s; returns the extra distance in px.
 */
export const projectMomentum = (velocity: number, decelerationRate = 0.998): number =>
  ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
