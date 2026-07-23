/**
 * @file hooks/useFloating.js
 * @description Provides Framer Motion variants for the floating vertical translate animation and breathing glow effect.
 *
 * Usage:
 * const { floatVariants, glowVariants, isAnimated } = useFloating({ animated: true });
 */

import { useReducedMotion } from 'framer-motion';

export function useFloating({ animated = true }) {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;

  // Iceberg float sequence: 0px -> -6px -> +6px -> -6px over 8s
  const floatVariants = {
    initial: { translateY: 0 },
    animate: isAnimated
      ? {
          translateY: [-6, 6, -6],
          transition: {
            duration: 8,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }
      : { translateY: 0 },
  };

  // Ambient glow pulse sequence: opacity 0.12 -> 0.20 -> 0.12 over 6s
  const glowVariants = {
    initial: { opacity: 0.12 },
    animate: isAnimated
      ? {
          opacity: [0.12, 0.20, 0.12],
          transition: {
            duration: 6,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }
      : { opacity: 0.12 },
  };

  return { floatVariants, glowVariants, isAnimated };
}